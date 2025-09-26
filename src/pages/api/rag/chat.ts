// src/pages/api/rag/chat.ts - RAG Chat API
import type { NextApiRequest, NextApiResponse } from "next";
import { embedText } from "@/lib/embeddings";
import { similaritySearch } from "@/lib/vector";
import OpenAI from "openai";
import Redis from "ioredis";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "your-api-key-here" 
});

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const TOP_K = Number(process.env.TOP_K || 5);
const THRESHOLD = Number(process.env.SIMILARITY_THRESHOLD || 0.75);

interface ChatRequest {
  message: string;
  sessionId?: string;
  conversationHistory?: Array<{user: string, assistant: string}>;
}

interface ChatResponse {
  reply: string;
  sources: Array<{id: string, score: number}>;
  confidence: number;
  method: 'similarity' | 'rag' | 'fallback';
}

// Simple rate limiting
const rateLimit = async (ip: string): Promise<boolean> => {
  const key = `rate_limit:${ip}`;
  const current = await redis.incr(key);
  
  if (current === 1) {
    await redis.expire(key, 60); // 60 seconds
  }
  
  return current <= 20; // 20 requests per minute
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
  
  // Rate limiting
  const allowed = await rateLimit(ip as string);
  if (!allowed) {
    return res.status(429).json({ error: "Too many requests" });
  }

  const { message, sessionId, conversationHistory }: ChatRequest = req.body;
  
  if (!message) {
    return res.status(400).json({ error: "Missing message" });
  }

  try {
    // 1. Create embedding for query
    const queryEmbedding = await embedText(message);
    
    // 2. Similarity search
    const searchResults = await similaritySearch(queryEmbedding, TOP_K, 0.5);
    
    // 3. Check best score
    const bestScore = searchResults[0]?.score || 0;
    
    // 4. Prepare context
    const contextDocs = searchResults.map(hit => hit.payload.text).join("\n\n");
    
    let reply: string;
    let method: 'similarity' | 'rag' | 'fallback';
    
    // 5. High confidence - use similarity-based response
    if (bestScore >= THRESHOLD && contextDocs) {
      const prompt = `You are a helpful assistant. Use ONLY the provided context to answer the user's question concisely.

Context:
${contextDocs}

User: ${message}
Assistant:`;

      const completion = await openai.chat.completions.create({
        model: process.env.LLM_MODEL || "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.3,
      });

      reply = completion.choices[0].message?.content || "I don't have enough information to answer that.";
      method = 'similarity';
    } 
    // 6. RAG fallback - include conversation history
    else if (contextDocs) {
      const conversationContext = conversationHistory?.map(msg => 
        `User: ${msg.user}\nAssistant: ${msg.assistant}`
      ).join("\n") || "";

      const ragPrompt = `You are a helpful assistant. Use the provided context and conversation history to answer the user's question. If the context doesn't contain relevant information, say so.

Context:
${contextDocs}

${conversationContext ? `Conversation History:\n${conversationContext}\n` : ""}
User: ${message}
Assistant:`;

      const ragResponse = await openai.chat.completions.create({
        model: process.env.LLM_MODEL || "gpt-4o-mini",
        messages: [{ role: "user", content: ragPrompt }],
        max_tokens: 600,
        temperature: 0.5,
      });

      reply = ragResponse.choices[0].message?.content || "I don't have enough information to answer that.";
      method = 'rag';
    } 
    // 7. Fallback - no relevant context found
    else {
      const fallbackPrompt = `You are a helpful assistant. The user asked: "${message}". 
      
Since I don't have specific information about this topic, please provide a helpful general response or ask for clarification.`;

      const fallbackResponse = await openai.chat.completions.create({
        model: process.env.LLM_MODEL || "gpt-4o-mini",
        messages: [{ role: "user", content: fallbackPrompt }],
        max_tokens: 300,
        temperature: 0.7,
      });

      reply = fallbackResponse.choices[0].message?.content || "I'm sorry, I don't have enough information to help with that.";
      method = 'fallback';
    }

    // 8. Cache the response
    const cacheKey = `chat:${Buffer.from(message).toString('base64')}`;
    await redis.setex(cacheKey, 3600, JSON.stringify({ reply, method })); // 1 hour cache

    // 9. Return response
    const response: ChatResponse = {
      reply,
      sources: searchResults.map(hit => ({ id: hit.id, score: hit.score })),
      confidence: bestScore,
      method
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Error in RAG chat:', error);
    res.status(500).json({ 
      error: "Internal server error",
      reply: "I'm sorry, I encountered an error. Please try again."
    });
  }
}
