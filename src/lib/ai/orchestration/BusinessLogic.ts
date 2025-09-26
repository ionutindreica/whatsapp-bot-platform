// Business Logic Integration - Connects AI with business rules and actions
// Handles user-specific data, permissions, and automated actions

export interface BusinessContext {
  userId: string;
  userPlan: string;
  userRole: string;
  permissions: string[];
  subscriptionStatus: string;
  usageStats: any;
  preferences: any;
}

export interface BusinessAction {
  type: string;
  parameters: any;
  priority: number;
  requiresConfirmation: boolean;
}

export interface BusinessMetrics {
  totalUsers: number;
  activeUsers: number;
  totalConversations: number;
  averageResponseTime: number;
  userSatisfaction: number;
}

class BusinessLogic {
  private businessRules: Map<string, any> = new Map();
  private actionHandlers: Map<string, Function> = new Map();

  constructor() {
    this.initializeBusinessRules();
    this.initializeActionHandlers();
  }

  private initializeBusinessRules() {
    // Define business rules based on user plans
    this.businessRules.set('starter', {
      maxConversations: 100,
      maxBots: 1,
      features: ['basic_chat', 'simple_automation'],
      limits: {
        messagesPerDay: 1000,
        apiCallsPerDay: 100
      }
    });

    this.businessRules.set('pro', {
      maxConversations: 1000,
      maxBots: 5,
      features: ['advanced_chat', 'automation', 'analytics', 'integrations'],
      limits: {
        messagesPerDay: 10000,
        apiCallsPerDay: 1000
      }
    });

    this.businessRules.set('enterprise', {
      maxConversations: -1, // Unlimited
      maxBots: -1, // Unlimited
      features: ['all_features', 'custom_integrations', 'priority_support'],
      limits: {
        messagesPerDay: -1, // Unlimited
        apiCallsPerDay: -1 // Unlimited
      }
    });
  }

  private initializeActionHandlers() {
    // Register action handlers
    this.actionHandlers.set('create_appointment', this.handleCreateAppointment.bind(this));
    this.actionHandlers.set('send_email', this.handleSendEmail.bind(this));
    this.actionHandlers.set('update_profile', this.handleUpdateProfile.bind(this));
    this.actionHandlers.set('upgrade_plan', this.handleUpgradePlan.bind(this));
    this.actionHandlers.set('schedule_meeting', this.handleScheduleMeeting.bind(this));
    this.actionHandlers.set('create_ticket', this.handleCreateTicket.bind(this));
  }

  async getContext(userId: string, userContext?: any): Promise<string> {
    try {
      console.log(`🏢 Getting business context for user ${userId}`);
      
      // In production, this would fetch from database
      const businessData = await this.fetchBusinessData(userId);
      
      const contextParts: string[] = [];
      
      // Add user plan information
      if (businessData.userPlan) {
        const planRules = this.businessRules.get(businessData.userPlan);
        if (planRules) {
          contextParts.push(`User Plan: ${businessData.userPlan}`);
          contextParts.push(`Available Features: ${planRules.features.join(', ')}`);
          contextParts.push(`Plan Limits: ${JSON.stringify(planRules.limits)}`);
        }
      }
      
      // Add user role and permissions
      if (businessData.userRole) {
        contextParts.push(`User Role: ${businessData.userRole}`);
        contextParts.push(`Permissions: ${businessData.permissions?.join(', ') || 'Standard user permissions'}`);
      }
      
      // Add subscription status
      if (businessData.subscriptionStatus) {
        contextParts.push(`Subscription Status: ${businessData.subscriptionStatus}`);
      }
      
      // Add usage statistics
      if (businessData.usageStats) {
        contextParts.push(`Usage Stats: ${JSON.stringify(businessData.usageStats)}`);
      }
      
      return contextParts.join('\n');
      
    } catch (error) {
      console.error('❌ Business context error:', error);
      return '';
    }
  }

  async extractActions(responseText: string, userId: string): Promise<BusinessAction[]> {
    try {
      const actions: BusinessAction[] = [];
      
      // Simple keyword-based action extraction
      // In production, this would use NLP or structured output from LLM
      
      if (responseText.toLowerCase().includes('schedule') && responseText.toLowerCase().includes('appointment')) {
        actions.push({
          type: 'create_appointment',
          parameters: { userId, action: 'schedule_appointment' },
          priority: 1,
          requiresConfirmation: true
        });
      }
      
      if (responseText.toLowerCase().includes('send') && responseText.toLowerCase().includes('email')) {
        actions.push({
          type: 'send_email',
          parameters: { userId, action: 'send_email' },
          priority: 2,
          requiresConfirmation: false
        });
      }
      
      if (responseText.toLowerCase().includes('upgrade') && responseText.toLowerCase().includes('plan')) {
        actions.push({
          type: 'upgrade_plan',
          parameters: { userId, action: 'upgrade_plan' },
          priority: 1,
          requiresConfirmation: true
        });
      }
      
      if (responseText.toLowerCase().includes('meeting') && responseText.toLowerCase().includes('schedule')) {
        actions.push({
          type: 'schedule_meeting',
          parameters: { userId, action: 'schedule_meeting' },
          priority: 1,
          requiresConfirmation: true
        });
      }
      
      if (responseText.toLowerCase().includes('support') && responseText.toLowerCase().includes('ticket')) {
        actions.push({
          type: 'create_ticket',
          parameters: { userId, action: 'create_support_ticket' },
          priority: 1,
          requiresConfirmation: false
        });
      }
      
      return actions;
      
    } catch (error) {
      console.error('❌ Action extraction error:', error);
      return [];
    }
  }

  async executeActions(actions: BusinessAction[], userId: string): Promise<boolean[]> {
    try {
      console.log(`🏢 Executing ${actions.length} business actions for user ${userId}`);
      
      const results = await Promise.all(
        actions.map(async (action) => {
          try {
            const handler = this.actionHandlers.get(action.type);
            if (handler) {
              const result = await handler(action.parameters, userId);
              console.log(`✅ Action ${action.type} executed successfully`);
              return result;
            } else {
              console.warn(`⚠️ No handler found for action: ${action.type}`);
              return false;
            }
          } catch (error) {
            console.error(`❌ Action ${action.type} failed:`, error);
            return false;
          }
        })
      );
      
      return results;
      
    } catch (error) {
      console.error('❌ Action execution error:', error);
      return [];
    }
  }

  // Action handlers
  private async handleCreateAppointment(parameters: any, userId: string): Promise<boolean> {
    console.log(`📅 Creating appointment for user ${userId}`);
    // In production, this would integrate with calendar system
    return true;
  }

  private async handleSendEmail(parameters: any, userId: string): Promise<boolean> {
    console.log(`📧 Sending email for user ${userId}`);
    // In production, this would integrate with email service
    return true;
  }

  private async handleUpdateProfile(parameters: any, userId: string): Promise<boolean> {
    console.log(`👤 Updating profile for user ${userId}`);
    // In production, this would update user database
    return true;
  }

  private async handleUpgradePlan(parameters: any, userId: string): Promise<boolean> {
    console.log(`⬆️ Upgrading plan for user ${userId}`);
    // In production, this would integrate with billing system
    return true;
  }

  private async handleScheduleMeeting(parameters: any, userId: string): Promise<boolean> {
    console.log(`🤝 Scheduling meeting for user ${userId}`);
    // In production, this would integrate with calendar system
    return true;
  }

  private async handleCreateTicket(parameters: any, userId: string): Promise<boolean> {
    console.log(`🎫 Creating support ticket for user ${userId}`);
    // In production, this would integrate with support system
    return true;
  }

  private async fetchBusinessData(userId: string): Promise<BusinessContext> {
    // Simulate database fetch
    // In production, this would query the actual database
    return {
      userId,
      userPlan: 'pro',
      userRole: 'user',
      permissions: ['read', 'write', 'chat'],
      subscriptionStatus: 'active',
      usageStats: {
        conversationsThisMonth: 45,
        messagesThisMonth: 234,
        apiCallsThisMonth: 89
      },
      preferences: {
        language: 'en',
        timezone: 'UTC',
        notifications: true
      }
    };
  }

  async getMetrics(): Promise<BusinessMetrics> {
    // In production, this would query actual metrics
    return {
      totalUsers: 1250,
      activeUsers: 890,
      totalConversations: 15600,
      averageResponseTime: 1.2,
      userSatisfaction: 4.6
    };
  }

  // Business rule validation
  async validateUserAction(userId: string, action: string): Promise<boolean> {
    try {
      const businessData = await this.fetchBusinessData(userId);
      const planRules = this.businessRules.get(businessData.userPlan);
      
      if (!planRules) {
        return false;
      }
      
      // Check if user has permission for this action
      if (action === 'create_bot' && businessData.userPlan === 'starter') {
        return planRules.maxBots === -1 || businessData.usageStats?.botsCreated < planRules.maxBots;
      }
      
      if (action === 'send_message' && businessData.userPlan === 'starter') {
        return planRules.limits.messagesPerDay === -1 || 
               businessData.usageStats?.messagesToday < planRules.limits.messagesPerDay;
      }
      
      // Default to allowed
      return true;
      
    } catch (error) {
      console.error('❌ Action validation error:', error);
      return false;
    }
  }
}

export default BusinessLogic;
