// src/pages/api/rag/ingest.ts - Document Ingestion API
import type { NextApiRequest, NextApiResponse } from "next";
import { embedText } from "@/lib/embeddings";
import { upsertDocument, createCollection } from "@/lib/vector";
import { v4 as uuidv4 } from "uuid";

interface IngestRequest {
  text: string;
  metadata?: {
    source?: string;
    title?: string;
    category?: string;
    url?: string;
  };
}

interface IngestResponse {
  id: string;
  success: boolean;
  message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text, metadata }: IngestRequest = req.body;
  
  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    // 1. Create embedding
    const embedding = await embedText(text);
    
    // 2. Generate document ID
    const docId = uuidv4();
    
    // 3. Prepare document
    const document = {
      id: docId,
      text: text.trim(),
      embedding,
      metadata: {
        ...metadata,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    };
    
    // 4. Upsert to vector database
    await upsertDocument(document);
    
    // 5. Return success response
    const response: IngestResponse = {
      id: docId,
      success: true,
      message: "Document ingested successfully"
    };
    
    res.status(200).json(response);

  } catch (error) {
    console.error('Error ingesting document:', error);
    res.status(500).json({ 
      error: "Failed to ingest document",
      message: "Please try again later"
    });
  }
}

// Initialize collection on startup
export async function initializeCollection() {
  try {
    await createCollection();
    console.log("Vector collection initialized successfully");
  } catch (error) {
    console.error("Error initializing collection:", error);
  }
}
