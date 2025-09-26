// src/lib/vector.ts - Vector database wrapper
import { QdrantClient } from "@qdrant/js-client-rest";

const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL || "http://localhost:6333",
  apiKey: process.env.QDRANT_API_KEY,
});

const COLLECTION = "chatflow_docs";

export interface Document {
  id: string;
  text: string;
  embedding: number[];
  metadata?: {
    source?: string;
    title?: string;
    category?: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

export interface SearchResult {
  id: string;
  score: number;
  payload: {
    text: string;
    metadata?: any;
  };
}

export async function upsertDocument(doc: Document) {
  try {
    await qdrant.upsert({
      collection_name: COLLECTION,
      points: [{
        id: doc.id,
        vector: doc.embedding,
        payload: {
          text: doc.text,
          ...doc.metadata
        }
      }],
    });
    return { success: true, id: doc.id };
  } catch (error) {
    console.error('Error upserting document:', error);
    throw new Error('Failed to upsert document');
  }
}

export async function similaritySearch(
  embedding: number[], 
  topK: number = 5,
  threshold: number = 0.75
): Promise<SearchResult[]> {
  try {
    const result = await qdrant.search({
      collection_name: COLLECTION,
      vector: embedding,
      limit: topK,
      with_payload: true,
      score_threshold: threshold,
    });
    
    return result.map((hit: any) => ({
      id: hit.id,
      score: hit.score,
      payload: hit.payload
    }));
  } catch (error) {
    console.error('Error in similarity search:', error);
    throw new Error('Failed to perform similarity search');
  }
}

export async function createCollection() {
  try {
    await qdrant.createCollection({
      collection_name: COLLECTION,
      vectors: {
        size: 1536, // OpenAI embedding size
        distance: "Cosine"
      }
    });
    return { success: true };
  } catch (error) {
    console.error('Error creating collection:', error);
    throw new Error('Failed to create collection');
  }
}

export async function deleteDocument(id: string) {
  try {
    await qdrant.delete({
      collection_name: COLLECTION,
      points: [id]
    });
    return { success: true };
  } catch (error) {
    console.error('Error deleting document:', error);
    throw new Error('Failed to delete document');
  }
}
