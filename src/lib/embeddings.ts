// src/lib/embeddings.ts
import OpenAI from "openai";

const client = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "your-api-key-here" 
});

export async function embedText(text: string): Promise<number[]> {
  try {
    const res = await client.embeddings.create({
      model: process.env.EMBEDDING_MODEL || "text-embedding-3-small",
      input: text,
    });
    return res.data[0].embedding as number[];
  } catch (error) {
    console.error('Error creating embedding:', error);
    throw new Error('Failed to create embedding');
  }
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  try {
    const res = await client.embeddings.create({
      model: process.env.EMBEDDING_MODEL || "text-embedding-3-small",
      input: texts,
    });
    return res.data.map(item => item.embedding as number[]);
  } catch (error) {
    console.error('Error creating batch embeddings:', error);
    throw new Error('Failed to create batch embeddings');
  }
}
