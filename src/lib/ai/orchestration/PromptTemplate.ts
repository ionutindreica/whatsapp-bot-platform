// Prompt Template Engine - Dynamic prompt construction for Llama 3
// Builds context-aware prompts based on user, business data, and conversation history

export interface PromptContext {
  userMessage: string;
  ragContext?: string;
  businessContext?: string;
  conversationHistory?: any[];
  userPlan?: string;
  userRole?: string;
  botPersonality?: string;
  botName?: string;
}

export interface PromptTemplate {
  system: string;
  user: string;
  assistant: string;
  context: string;
  business: string;
  history: string;
}

class PromptTemplate {
  private templates: PromptTemplate;

  constructor() {
    this.templates = {
      system: `You are {botName}, a helpful AI assistant. {botPersonality}

Your capabilities:
- Answer questions about our products and services
- Help with account management and billing
- Provide technical support
- Assist with onboarding and setup
- Handle general inquiries

Guidelines:
- Be helpful, accurate, and professional
- Use the provided context to give relevant answers
- If you don't know something, say so and offer to help find the information
- Maintain a {botPersonality} tone throughout the conversation
- Always prioritize user privacy and security`,

      user: `User: {userMessage}`,

      assistant: `Assistant:`,

      context: `Relevant Context:
{ragContext}`,

      business: `Business Information:
- User Plan: {userPlan}
- User Role: {userRole}
- Additional Context: {businessContext}`,

      history: `Recent Conversation History:
{conversationHistory}`
    };
  }

  buildPrompt(context: PromptContext): string {
    try {
      console.log('📝 Building dynamic prompt...');
      
      // Build system prompt
      const systemPrompt = this.buildSystemPrompt(context);
      
      // Build context sections
      const contextSections = this.buildContextSections(context);
      
      // Build conversation history
      const historySection = this.buildHistorySection(context);
      
      // Build user message
      const userMessage = this.buildUserMessage(context);
      
      // Combine all sections
      const fullPrompt = [
        systemPrompt,
        contextSections,
        historySection,
        userMessage,
        this.templates.assistant
      ].filter(section => section.trim().length > 0).join('\n\n');

      console.log(`✅ Prompt built (${fullPrompt.length} characters)`);
      return fullPrompt;
      
    } catch (error) {
      console.error('❌ Prompt building error:', error);
      return this.buildFallbackPrompt(context);
    }
  }

  private buildSystemPrompt(context: PromptContext): string {
    const botName = context.botName || 'AI Assistant';
    const botPersonality = context.botPersonality || 'friendly and professional';
    
    return this.templates.system
      .replace('{botName}', botName)
      .replace('{botPersonality}', botPersonality);
  }

  private buildContextSections(context: PromptContext): string {
    const sections: string[] = [];
    
    // Add RAG context if available
    if (context.ragContext && context.ragContext.trim().length > 0) {
      sections.push(this.templates.context.replace('{ragContext}', context.ragContext));
    }
    
    // Add business context if available
    if (context.businessContext && context.businessContext.trim().length > 0) {
      sections.push(this.templates.business
        .replace('{userPlan}', context.userPlan || 'Not specified')
        .replace('{userRole}', context.userRole || 'User')
        .replace('{businessContext}', context.businessContext)
      );
    }
    
    return sections.join('\n\n');
  }

  private buildHistorySection(context: PromptContext): string {
    if (!context.conversationHistory || context.conversationHistory.length === 0) {
      return '';
    }
    
    // Format conversation history (last 5 exchanges)
    const recentHistory = context.conversationHistory
      .slice(-5)
      .map((exchange: any) => {
        const timestamp = exchange.timestamp || 'Recent';
        return `[${timestamp}] User: ${exchange.userMessage}\nAssistant: ${exchange.assistantResponse}`;
      })
      .join('\n\n');
    
    return this.templates.history.replace('{conversationHistory}', recentHistory);
  }

  private buildUserMessage(context: PromptContext): string {
    return this.templates.user.replace('{userMessage}', context.userMessage);
  }

  private buildFallbackPrompt(context: PromptContext): string {
    // Simple fallback prompt
    return `You are a helpful AI assistant. Please respond to the user's message: "${context.userMessage}"`;
  }

  // Specialized prompt templates for different use cases
  buildCustomerSupportPrompt(context: PromptContext): string {
    const basePrompt = this.buildPrompt(context);
    
    const supportInstructions = `

Additional Support Guidelines:
- If the user has a technical issue, ask for specific details
- For billing questions, provide clear information about their plan
- If you can't resolve an issue, offer to escalate to human support
- Always be empathetic and understanding
- Provide step-by-step solutions when possible`;

    return basePrompt + supportInstructions;
  }

  buildSalesPrompt(context: PromptContext): string {
    const basePrompt = this.buildPrompt(context);
    
    const salesInstructions = `

Sales Guidelines:
- Understand the user's needs before recommending products
- Highlight benefits relevant to their use case
- Be helpful, not pushy
- Provide clear pricing and plan information
- Offer to schedule a demo or consultation if appropriate`;

    return basePrompt + salesInstructions;
  }

  buildTechnicalPrompt(context: PromptContext): string {
    const basePrompt = this.buildPrompt(context);
    
    const technicalInstructions = `

Technical Guidelines:
- Provide accurate technical information
- Include code examples when relevant
- Explain complex concepts in simple terms
- Offer troubleshooting steps
- Reference official documentation when possible`;

    return basePrompt + technicalInstructions;
  }

  // Dynamic prompt selection based on context
  selectPromptTemplate(context: PromptContext): string {
    const userMessage = context.userMessage.toLowerCase();
    
    // Determine prompt type based on keywords
    if (userMessage.includes('help') || userMessage.includes('support') || userMessage.includes('problem')) {
      return this.buildCustomerSupportPrompt(context);
    }
    
    if (userMessage.includes('price') || userMessage.includes('plan') || userMessage.includes('upgrade')) {
      return this.buildSalesPrompt(context);
    }
    
    if (userMessage.includes('code') || userMessage.includes('api') || userMessage.includes('technical')) {
      return this.buildTechnicalPrompt(context);
    }
    
    // Default to general prompt
    return this.buildPrompt(context);
  }

  // Template customization methods
  customizeForIndustry(industry: string, context: PromptContext): string {
    const basePrompt = this.buildPrompt(context);
    
    const industrySpecificInstructions = this.getIndustryInstructions(industry);
    
    return basePrompt + industrySpecificInstructions;
  }

  private getIndustryInstructions(industry: string): string {
    const instructions = {
      'healthcare': `
Healthcare Guidelines:
- Always prioritize patient privacy and HIPAA compliance
- Provide general health information only
- Recommend consulting healthcare professionals for medical advice
- Be sensitive to health concerns and conditions`,

      'finance': `
Finance Guidelines:
- Provide general financial information only
- Recommend consulting financial advisors for investment advice
- Be clear about limitations and disclaimers
- Prioritize security and compliance`,

      'education': `
Education Guidelines:
- Provide educational content and explanations
- Encourage learning and critical thinking
- Offer study tips and resources
- Be patient with learning questions`,

      'ecommerce': `
E-commerce Guidelines:
- Help with product selection and recommendations
- Provide information about shipping and returns
- Assist with order tracking and account management
- Be knowledgeable about product features and benefits`
    };
    
    return instructions[industry] || '';
  }
}

export default PromptTemplate;
