// Context Retrieval - RAG implementation for context-aware responses
// Retrieves relevant information from vector DB and business data

import { VectorDB, VectorSearchResult } from '../vector/VectorDB';

export interface ContextData {
  text: string;
  sources: string[];
  confidence: number;
  metadata: any;
}

export interface RetrievalConfig {
  maxResults: number;
  similarityThreshold: number;
  includeUserHistory: boolean;
  includeBusinessData: boolean;
  includeKnowledgeBase: boolean;
}

class ContextRetriever {
  private vectorDB: VectorDB;
  private config: RetrievalConfig;

  constructor(vectorDB: VectorDB, config?: Partial<RetrievalConfig>) {
    this.vectorDB = vectorDB;
    this.config = {
      maxResults: 5,
      similarityThreshold: 0.7,
      includeUserHistory: true,
      includeBusinessData: true,
      includeKnowledgeBase: true,
      ...config
    };
  }

  async retrieveContext(
    query: string,
    userId: string,
    userContext?: any
  ): Promise<ContextData> {
    try {
      console.log(`🔍 Retrieving context for query: "${query}"`);
      
      const contextParts: string[] = [];
      const sources: string[] = [];
      let confidence = 0;
      const metadata: any = {};

      // 1. Retrieve from knowledge base (vector DB)
      if (this.config.includeKnowledgeBase) {
        const knowledgeContext = await this.retrieveKnowledgeBase(query);
        if (knowledgeContext.text) {
          contextParts.push(knowledgeContext.text);
          sources.push(...knowledgeContext.sources);
          confidence = Math.max(confidence, knowledgeContext.confidence);
          metadata.knowledgeBase = knowledgeContext.metadata;
        }
      }

      // 2. Retrieve user conversation history
      if (this.config.includeUserHistory) {
        const historyContext = await this.retrieveUserHistory(userId, query);
        if (historyContext.text) {
          contextParts.push(historyContext.text);
          sources.push(...historyContext.sources);
          confidence = Math.max(confidence, historyContext.confidence);
          metadata.userHistory = historyContext.metadata;
        }
      }

      // 3. Retrieve business-specific data
      if (this.config.includeBusinessData && userContext) {
        const businessContext = await this.retrieveBusinessData(query, userContext);
        if (businessContext.text) {
          contextParts.push(businessContext.text);
          sources.push(...businessContext.sources);
          confidence = Math.max(confidence, businessContext.confidence);
          metadata.businessData = businessContext.metadata;
        }
      }

      // 4. Combine and rank context
      const combinedContext = this.combineContext(contextParts, sources);
      
      return {
        text: combinedContext,
        sources: [...new Set(sources)], // Remove duplicates
        confidence,
        metadata
      };

    } catch (error) {
      console.error('❌ Context retrieval error:', error);
      return {
        text: '',
        sources: [],
        confidence: 0,
        metadata: { error: error.message }
      };
    }
  }

  private async retrieveKnowledgeBase(query: string): Promise<ContextData> {
    try {
      const results = await this.vectorDB.searchSimilar(
        query,
        this.config.maxResults,
        this.config.similarityThreshold,
        { type: 'knowledge_base' }
      );

      if (results.length === 0) {
        return { text: '', sources: [], confidence: 0, metadata: {} };
      }

      const contextText = results
        .map(result => result.document.content)
        .join('\n\n');

      const sources = results
        .map(result => result.document.metadata.source)
        .filter(source => source);

      const avgConfidence = results.reduce((sum, result) => sum + result.score, 0) / results.length;

      return {
        text: contextText,
        sources,
        confidence: avgConfidence,
        metadata: {
          resultCount: results.length,
          avgSimilarity: avgConfidence,
          topResult: results[0]?.document.content.substring(0, 100) + '...'
        }
      };
    } catch (error) {
      console.error('❌ Knowledge base retrieval error:', error);
      return { text: '', sources: [], confidence: 0, metadata: { error: error.message } };
    }
  }

  private async retrieveUserHistory(userId: string, query: string): Promise<ContextData> {
    try {
      // Search for relevant conversation history
      const results = await this.vectorDB.searchSimilar(
        query,
        this.config.maxResults,
        this.config.similarityThreshold,
        { 
          userId,
          type: 'conversation_history'
        }
      );

      if (results.length === 0) {
        return { text: '', sources: [], confidence: 0, metadata: {} };
      }

      const historyText = results
        .map(result => {
          const doc = result.document;
          return `Previous conversation (${doc.metadata.timestamp}): ${doc.content}`;
        })
        .join('\n\n');

      const sources = results
        .map(result => `conversation_${result.document.id}`)
        .filter(source => source);

      const avgConfidence = results.reduce((sum, result) => sum + result.score, 0) / results.length;

      return {
        text: historyText,
        sources,
        confidence: avgConfidence,
        metadata: {
          conversationCount: results.length,
          timeRange: {
            earliest: Math.min(...results.map(r => new Date(r.document.metadata.timestamp).getTime())),
            latest: Math.max(...results.map(r => new Date(r.document.metadata.timestamp).getTime()))
          }
        }
      };
    } catch (error) {
      console.error('❌ User history retrieval error:', error);
      return { text: '', sources: [], confidence: 0, metadata: { error: error.message } };
    }
  }

  private async retrieveBusinessData(query: string, userContext: any): Promise<ContextData> {
    try {
      // Search for business-specific information based on user context
      const businessQuery = `${query} ${userContext.userPlan || ''} ${userContext.userRole || ''}`;
      
      const results = await this.vectorDB.searchSimilar(
        businessQuery,
        this.config.maxResults,
        this.config.similarityThreshold,
        { 
          type: 'business_data',
          userPlan: userContext.userPlan,
          userRole: userContext.userRole
        }
      );

      if (results.length === 0) {
        return { text: '', sources: [], confidence: 0, metadata: {} };
      }

      const businessText = results
        .map(result => result.document.content)
        .join('\n\n');

      const sources = results
        .map(result => result.document.metadata.source)
        .filter(source => source);

      const avgConfidence = results.reduce((sum, result) => sum + result.score, 0) / results.length;

      return {
        text: businessText,
        sources,
        confidence: avgConfidence,
        metadata: {
          businessContext: {
            userPlan: userContext.userPlan,
            userRole: userContext.userRole
          },
          resultCount: results.length
        }
      };
    } catch (error) {
      console.error('❌ Business data retrieval error:', error);
      return { text: '', sources: [], confidence: 0, metadata: { error: error.message } };
    }
  }

  private combineContext(contextParts: string[], sources: string[]): string {
    if (contextParts.length === 0) {
      return '';
    }

    // Combine context parts with clear separation
    const combinedContext = contextParts
      .filter(part => part.trim().length > 0)
      .map((part, index) => {
        const section = index === 0 ? 'Knowledge Base' : 
                      index === 1 ? 'Conversation History' : 
                      'Business Context';
        return `[${section}]\n${part}`;
      })
      .join('\n\n---\n\n');

    return combinedContext;
  }

  async addConversationToHistory(
    userId: string,
    message: string,
    response: string,
    sessionId: string
  ): Promise<boolean> {
    try {
      const conversationDoc = {
        id: `conv_${sessionId}_${Date.now()}`,
        content: `User: ${message}\nAssistant: ${response}`,
        metadata: {
          type: 'conversation_history',
          userId,
          sessionId,
          timestamp: new Date().toISOString(),
          tags: ['conversation', 'user_interaction']
        }
      };

      return await this.vectorDB.addDocument(conversationDoc);
    } catch (error) {
      console.error('❌ Failed to add conversation to history:', error);
      return false;
    }
  }

  async addKnowledgeBaseDocument(
    content: string,
    source: string,
    tags: string[] = []
  ): Promise<boolean> {
    try {
      const knowledgeDoc = {
        id: `kb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        content,
        metadata: {
          type: 'knowledge_base',
          source,
          timestamp: new Date().toISOString(),
          tags: ['knowledge_base', ...tags]
        }
      };

      return await this.vectorDB.addDocument(knowledgeDoc);
    } catch (error) {
      console.error('❌ Failed to add knowledge base document:', error);
      return false;
    }
  }
}

export default ContextRetriever;
