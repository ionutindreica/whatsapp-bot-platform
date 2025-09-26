// src/bots/FlowManager.ts - Sistem unificat de management pentru toate flow-urile
import { CoachingFlow } from './industries/coaching/flow';
import { ClinicsFlow } from './industries/clinics/flow';
import { EcommerceFlow } from './industries/ecommerce/flow';
import { LeadScoring } from './automation/scoring';
import { NotificationSystem } from './automation/notifications';
import { CRMSync } from './automation/crm_sync';
import { BroadcastSystem } from './automation/broadcast';

export interface FlowContext {
  sessionId: string;
  industry: 'coaching' | 'clinics' | 'ecommerce';
  userInfo: {
    name?: string;
    phone?: string;
    email?: string;
  };
  responses: { [key: string]: string };
  segment?: string;
  score: number;
  currentStep: string;
  lastActivity: string;
  behavior: {
    timeSpent: number;
    pagesVisited: number;
    returnVisits: number;
  };
  preferences: {
    channels: ('email' | 'whatsapp' | 'sms')[];
    frequency: 'immediate' | 'daily' | 'weekly';
    timezone: string;
  };
}

export interface FlowResponse {
  message: string;
  nextStep: string;
  segment?: string;
  content?: {
    type: 'pdf' | 'video' | 'case_study';
    title: string;
    url: string;
  };
  cta?: {
    type: 'call' | 'course' | 'program' | 'booking' | 'checkout';
    text: string;
    url: string;
  };
  recommendations?: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
    matchScore: number;
  }>;
  context: FlowContext;
  automation?: {
    notifications: any[];
    crmSync: any;
    broadcast?: any;
  };
}

export class FlowManager {
  private coachingFlow: CoachingFlow;
  private clinicsFlow: ClinicsFlow;
  private ecommerceFlow: EcommerceFlow;
  private leadScoring: LeadScoring;
  private notificationSystem: NotificationSystem;
  private crmSync: CRMSync;
  private broadcastSystem: BroadcastSystem;

  constructor() {
    this.coachingFlow = new CoachingFlow();
    this.clinicsFlow = new ClinicsFlow();
    this.ecommerceFlow = new EcommerceFlow();
    this.leadScoring = new LeadScoring();
    this.notificationSystem = new NotificationSystem();
    this.crmSync = new CRMSync();
    this.broadcastSystem = new BroadcastSystem();
  }

  async handleMessage(context: FlowContext, userMessage: string): Promise<FlowResponse> {
    const industry = context.industry;
    let response: FlowResponse;

    // Route to appropriate industry flow
    switch (industry) {
      case 'coaching':
        response = await this.handleCoachingFlow(context, userMessage);
        break;
      case 'clinics':
        response = await this.handleClinicsFlow(context, userMessage);
        break;
      case 'ecommerce':
        response = await this.handleEcommerceFlow(context, userMessage);
        break;
      default:
        throw new Error(`Unsupported industry: ${industry}`);
    }

    // Update context with new information
    const updatedContext = {
      ...context,
      ...response.context,
      lastActivity: new Date().toISOString()
    };

    // Calculate lead score
    const leadScore = await this.leadScoring.calculateScore({
      industry,
      responses: updatedContext.responses,
      userInfo: updatedContext.userInfo,
      behavior: updatedContext.behavior
    });

    // Generate automation based on lead score and industry
    const automation = await this.generateAutomation(updatedContext, leadScore);

    return {
      ...response,
      context: updatedContext,
      automation
    };
  }

  private async handleCoachingFlow(context: FlowContext, userMessage: string): Promise<FlowResponse> {
    const coachingContext = {
      sessionId: context.sessionId,
      userInfo: context.userInfo,
      responses: context.responses,
      segment: context.segment,
      score: context.score,
      currentStep: context.currentStep
    };

    const response = await this.coachingFlow.handleStep(coachingContext, userMessage);
    
    return {
      message: response.message,
      nextStep: response.nextStep,
      segment: response.segment,
      content: response.content,
      cta: response.cta,
      context: {
        ...context,
        ...response.context
      }
    };
  }

  private async handleClinicsFlow(context: FlowContext, userMessage: string): Promise<FlowResponse> {
    const clinicsContext = {
      sessionId: context.sessionId,
      userInfo: context.userInfo,
      responses: context.responses,
      segment: context.segment,
      score: context.score,
      currentStep: context.currentStep
    };

    const response = await this.clinicsFlow.handleStep(clinicsContext, userMessage);
    
    return {
      message: response.message,
      nextStep: response.nextStep,
      segment: response.segment,
      context: {
        ...context,
        ...response.context
      }
    };
  }

  private async handleEcommerceFlow(context: FlowContext, userMessage: string): Promise<FlowResponse> {
    const ecommerceContext = {
      sessionId: context.sessionId,
      userInfo: context.userInfo,
      responses: context.responses,
      segment: context.segment,
      score: context.score,
      currentStep: context.currentStep
    };

    const response = await this.ecommerceFlow.handleStep(ecommerceContext, userMessage);
    
    return {
      message: response.message,
      nextStep: response.nextStep,
      segment: response.segment,
      recommendations: response.recommendations,
      context: {
        ...context,
        ...response.context
      }
    };
  }

  private async generateAutomation(context: FlowContext, leadScore: any): Promise<any> {
    const automation: any = {};

    // Generate notifications
    const notificationContext = {
      industry: context.industry,
      userInfo: context.userInfo,
      leadScore: {
        level: leadScore.level,
        percentage: leadScore.percentage
      },
      segment: context.segment,
      lastActivity: context.lastActivity,
      preferences: context.preferences
    };

    automation.notifications = await this.notificationSystem.generateNotifications(notificationContext);

    // Sync to CRM
    const crmContext = {
      industry: context.industry,
      userInfo: context.userInfo,
      leadScore: {
        level: leadScore.level,
        percentage: leadScore.percentage
      },
      segment: context.segment,
      responses: context.responses,
      lastActivity: context.lastActivity,
      crmProvider: 'hubspot' // Default, can be configured
    };

    automation.crmSync = await this.crmSync.syncToCRM(crmContext);

    // Generate broadcast campaigns for hot leads
    if (leadScore.level === 'hot') {
      automation.broadcast = await this.generateHotLeadBroadcast(context, leadScore);
    }

    return automation;
  }

  private async generateHotLeadBroadcast(context: FlowContext, leadScore: any): Promise<any> {
    const industry = context.industry;
    const segment = context.segment;

    // Create targeted broadcast campaign
    const campaign = await this.broadcastSystem.createBroadcastCampaign(
      industry,
      'promotional',
      {
        segments: [segment || 'all'],
        filters: {
          leadScore: { min: 70, max: 100 },
          industry: industry
        }
      },
      {
        subject: `Ofertă specială pentru ${industry}`,
        message: `🎁 Ofertă exclusivă pentru tine!\n\nValabilă până la sfârșitul săptămânii.\n\nProgramează acum!`,
        media: {
          type: 'image',
          url: `/images/offers/${industry}-special.jpg`
        }
      },
      ['email', 'whatsapp'],
      new Date().toISOString()
    );

    return campaign;
  }

  async getFlowAnalytics(industry?: string): Promise<any> {
    // Get analytics for all flows or specific industry
    const analytics = {
      totalSessions: 0,
      totalLeads: 0,
      conversionRate: 0,
      averageScore: 0,
      industryBreakdown: {} as any,
      topSegments: [] as any[],
      automationStats: {
        notificationsSent: 0,
        crmSyncs: 0,
        broadcasts: 0
      }
    };

    // In real implementation, this would query the database
    // For now, return mock data
    return {
      ...analytics,
      totalSessions: 1250,
      totalLeads: 890,
      conversionRate: 71.2,
      averageScore: 65.5,
      industryBreakdown: {
        coaching: { sessions: 450, leads: 320, conversion: 71.1 },
        clinics: { sessions: 400, leads: 280, conversion: 70.0 },
        ecommerce: { sessions: 400, leads: 290, conversion: 72.5 }
      },
      topSegments: [
        { name: 'hot_leads', count: 150, percentage: 16.9 },
        { name: 'warm_leads', count: 400, percentage: 44.9 },
        { name: 'cold_leads', count: 340, percentage: 38.2 }
      ],
      automationStats: {
        notificationsSent: 2340,
        crmSyncs: 890,
        broadcasts: 45
      }
    };
  }

  async createCustomFlow(
    industry: string,
    flowConfig: any
  ): Promise<{ success: boolean; flowId?: string; error?: string }> {
    try {
      const flowId = `custom_${industry}_${Date.now()}`;
      
      // Save custom flow configuration
      await this.saveCustomFlow(flowId, industry, flowConfig);
      
      return {
        success: true,
        flowId
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async saveCustomFlow(flowId: string, industry: string, config: any): Promise<void> {
    // Simulate saving custom flow to database
    console.log(`Saving custom flow ${flowId} for industry ${industry}`);
  }
}
