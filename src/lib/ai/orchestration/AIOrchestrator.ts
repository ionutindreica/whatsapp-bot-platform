// AI Orchestration Layer - Central brain of the application
// Handles Llama 3 integration with business logic and database

import { LlamaIntegration } from '../llamaIntegration';
import { VectorDB } from '../vector/VectorDB';
import { ContextRetriever } from './ContextRetriever';
import { PromptTemplate } from './PromptTemplate';
import { BusinessLogic } from './BusinessLogic';

export interface AIRequest {
  message: string;
  userId: string;
  sessionId: string;
  context?: {
    userPlan?: string;
    userRole?: string;
    conversationHistory?: any[];
    businessData?: any;
  };
}

export interface AIResponse {
  text: string;
  confidence: number;
  sources: string[];
  actions: string[];
  model: string;
  processingTime: number;
  tokens: number;
}

export interface AIConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  enableRAG: boolean;
  enableBusinessLogic: boolean;
  enableStreaming: boolean;
}

class AIOrchestrator {
  private llamaAI: LlamaIntegration | null = null;
  private vectorDB: VectorDB;
  private contextRetriever: ContextRetriever;
  private promptTemplate: PromptTemplate;
  private businessLogic: BusinessLogic;
  private config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
    this.vectorDB = new VectorDB();
    this.contextRetriever = new ContextRetriever(this.vectorDB);
    this.promptTemplate = new PromptTemplate();
    this.businessLogic = new BusinessLogic();
  }

  async initialize(): Promise<boolean> {
    try {
      console.log('🧠 Initializing AI Orchestrator...');
      
      // Initialize Llama 3
      if (this.config.model.startsWith('llama-')) {
        this.llamaAI = new LlamaIntegration({
          model: this.config.model as any,
          temperature: this.config.temperature,
          maxTokens: this.config.maxTokens,
          topP: 0.9
        });
        
        const llamaReady = await this.llamaAI.initialize();
        if (!llamaReady) {
          console.error('❌ Failed to initialize Llama 3');
          return false;
        }
      }
      
      // Initialize Vector DB
      await this.vectorDB.initialize();
      
      console.log('✅ AI Orchestrator initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize AI Orchestrator:', error);
      return false;
    }
  }

  async processRequest(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    
    try {
      console.log(`🧠 Processing AI request for user ${request.userId}`);
      
      // Step 1: Retrieve relevant context using RAG
      let context = '';
      let sources: string[] = [];
      
      if (this.config.enableRAG) {
        const ragContext = await this.contextRetriever.retrieveContext(
          request.message,
          request.userId,
          request.context
        );
        context = ragContext.text;
        sources = ragContext.sources;
      }
      
      // Step 2: Get business logic context
      let businessContext = '';
      if (this.config.enableBusinessLogic) {
        businessContext = await this.businessLogic.getContext(
          request.userId,
          request.context
        );
      }
      
      // Step 3: Build comprehensive prompt
      const prompt = this.promptTemplate.buildPrompt({
        userMessage: request.message,
        ragContext: context,
        businessContext: businessContext,
        conversationHistory: request.context?.conversationHistory || [],
        userPlan: request.context?.userPlan,
        userRole: request.context?.userRole
      });
      
      // Step 4: Generate response using Llama 3
      let response: any;
      if (this.llamaAI) {
        response = await this.llamaAI.generateResponse(prompt, context);
      } else {
        // Fallback to other AI models
        response = await this.generateFallbackResponse(prompt);
      }
      
      // Step 5: Extract actions and business logic
      const actions = await this.businessLogic.extractActions(response.text, request.userId);
      
      // Step 6: Execute any required actions
      if (actions.length > 0) {
        await this.businessLogic.executeActions(actions, request.userId);
      }
      
      const processingTime = Date.now() - startTime;
      
      return {
        text: response.text,
        confidence: response.confidence || 0.8,
        sources,
        actions,
        model: this.config.model,
        processingTime,
        tokens: response.tokens || 0
      };
      
    } catch (error) {
      console.error('❌ AI processing error:', error);
      throw error;
    }
  }

  async processStreamingRequest(request: AIRequest, onChunk: (chunk: string) => void): Promise<void> {
    if (!this.config.enableStreaming) {
      const response = await this.processRequest(request);
      onChunk(response.text);
      return;
    }
    
    try {
      // Simulate streaming response
      const fullResponse = await this.processRequest(request);
      const words = fullResponse.text.split(' ');
      
      for (let i = 0; i < words.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 50)); // Simulate streaming delay
        onChunk(words[i] + ' ');
      }
    } catch (error) {
      console.error('❌ Streaming error:', error);
      onChunk('Sorry, I encountered an error while processing your request.');
    }
  }

  private async generateFallbackResponse(prompt: string): Promise<any> {
    // Fallback to simple keyword-based responses
    const responses = [
      "I understand your request. Let me help you with that.",
      "That's a great question. Here's what I can tell you:",
      "I'd be happy to assist you with this matter.",
      "Let me provide you with the information you need."
    ];
    
    return {
      text: responses[Math.floor(Math.random() * responses.length)],
      confidence: 0.6,
      tokens: prompt.length / 4
    };
  }

  async getPerformanceMetrics() {
    const metrics = {
      orchestrator: {
        status: 'active',
        uptime: Date.now(),
        totalRequests: 0, // This would be tracked in production
        averageResponseTime: 0
      },
      llama: this.llamaAI ? await this.llamaAI.getPerformanceMetrics() : null,
      vectorDB: await this.vectorDB.getMetrics(),
      businessLogic: await this.businessLogic.getMetrics()
    };
    
    return metrics;
  }

  async shutdown() {
    console.log('🛑 Shutting down AI Orchestrator...');
    
    if (this.llamaAI) {
      // Cleanup Llama resources
    }
    
    await this.vectorDB.shutdown();
    console.log('✅ AI Orchestrator shutdown complete');
  }
}

export default AIOrchestrator;
