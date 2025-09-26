// src/bots/automation/crm_sync.ts - Sincronizare automată cu CRM-uri pentru toate industriile
export interface CRMSyncContext {
  industry: 'coaching' | 'clinics' | 'ecommerce';
  userInfo: {
    name?: string;
    phone?: string;
    email?: string;
  };
  leadScore: {
    level: 'cold' | 'warm' | 'hot';
    percentage: number;
  };
  segment?: string;
  responses: { [key: string]: string };
  lastActivity: string;
  crmProvider: 'hubspot' | 'pipedrive' | 'airtable' | 'google_sheets';
}

export interface CRMSyncResult {
  success: boolean;
  crmId?: string;
  error?: string;
  actions: Array<{
    type: 'create' | 'update' | 'tag' | 'note';
    description: string;
    success: boolean;
  }>;
}

export class CRMSync {
  private industryMappings = {
    coaching: {
      hubspot: {
        contact: {
          firstname: 'name',
          email: 'email',
          phone: 'phone',
          lead_score: 'leadScore',
          industry: 'coaching',
          segment: 'segment'
        },
        deal: {
          dealname: 'Amazon Business Opportunity',
          amount: '5000',
          stage: 'lead_score > 70 ? "qualified" : "lead"'
        }
      },
      pipedrive: {
        person: {
          name: 'name',
          email: 'email',
          phone: 'phone',
          label: 'coaching_lead'
        },
        deal: {
          title: 'Amazon Business Opportunity',
          value: '5000',
          stage_id: 'lead_score > 70 ? 1 : 2'
        }
      }
    },
    clinics: {
      hubspot: {
        contact: {
          firstname: 'name',
          email: 'email',
          phone: 'phone',
          lead_score: 'leadScore',
          industry: 'healthcare',
          segment: 'segment'
        },
        deal: {
          dealname: 'Medical Appointment',
          amount: '300',
          stage: 'lead_score > 70 ? "qualified" : "lead"'
        }
      },
      pipedrive: {
        person: {
          name: 'name',
          email: 'email',
          phone: 'phone',
          label: 'clinic_lead'
        },
        deal: {
          title: 'Medical Appointment',
          value: '300',
          stage_id: 'lead_score > 70 ? 1 : 2'
        }
      }
    },
    ecommerce: {
      hubspot: {
        contact: {
          firstname: 'name',
          email: 'email',
          phone: 'phone',
          lead_score: 'leadScore',
          industry: 'ecommerce',
          segment: 'segment'
        },
        deal: {
          dealname: 'E-commerce Sale',
          amount: '200',
          stage: 'lead_score > 70 ? "qualified" : "lead"'
        }
      },
      pipedrive: {
        person: {
          name: 'name',
          email: 'email',
          phone: 'phone',
          label: 'ecommerce_lead'
        },
        deal: {
          title: 'E-commerce Sale',
          value: '200',
          stage_id: 'lead_score > 70 ? 1 : 2'
        }
      }
    }
  };

  async syncToCRM(context: CRMSyncContext): Promise<CRMSyncResult> {
    const industry = context.industry;
    const crmProvider = context.crmProvider;
    const mapping = this.industryMappings[industry][crmProvider as keyof typeof this.industryMappings[typeof industry]];
    
    if (!mapping) {
      return {
        success: false,
        error: `No mapping found for ${industry} and ${crmProvider}`,
        actions: []
      };
    }

    const actions: Array<{ type: string; description: string; success: boolean }> = [];
    let crmId: string | undefined;

    try {
      // Create/Update Contact
      const contactResult = await this.syncContact(context, mapping);
      actions.push({
        type: 'create',
        description: 'Create/Update Contact',
        success: contactResult.success
      });
      
      if (contactResult.success) {
        crmId = contactResult.id;
      }

      // Create Deal if lead is warm or hot
      if (context.leadScore.level === 'warm' || context.leadScore.level === 'hot') {
        const dealResult = await this.syncDeal(context, mapping, crmId);
        actions.push({
          type: 'create',
          description: 'Create Deal',
          success: dealResult.success
        });
      }

      // Add Tags
      const tagResult = await this.addTags(context, crmId);
      actions.push({
        type: 'tag',
        description: 'Add Industry Tags',
        success: tagResult.success
      });

      // Add Notes
      const noteResult = await this.addNotes(context, crmId);
      actions.push({
        type: 'note',
        description: 'Add Conversation Notes',
        success: noteResult.success
      });

      return {
        success: true,
        crmId,
        actions
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        actions
      };
    }
  }

  private async syncContact(context: CRMSyncContext, mapping: any): Promise<{ success: boolean; id?: string }> {
    const contactData = this.mapContactData(context, mapping.contact);
    
    // Simulate API call to CRM
    const response = await this.makeCRMRequest('POST', '/contacts', contactData);
    
    if (response.success) {
      return { success: true, id: response.id };
    } else {
      return { success: false };
    }
  }

  private async syncDeal(context: CRMSyncContext, mapping: any, contactId?: string): Promise<{ success: boolean }> {
    const dealData = this.mapDealData(context, mapping.deal, contactId);
    
    // Simulate API call to CRM
    const response = await this.makeCRMRequest('POST', '/deals', dealData);
    
    return { success: response.success };
  }

  private async addTags(context: CRMSyncContext, contactId?: string): Promise<{ success: boolean }> {
    const tags = this.generateTags(context);
    
    if (!contactId) return { success: false };
    
    // Simulate API call to add tags
    const response = await this.makeCRMRequest('POST', `/contacts/${contactId}/tags`, { tags });
    
    return { success: response.success };
  }

  private async addNotes(context: CRMSyncContext, contactId?: string): Promise<{ success: boolean }> {
    const notes = this.generateNotes(context);
    
    if (!contactId) return { success: false };
    
    // Simulate API call to add notes
    const response = await this.makeCRMRequest('POST', `/contacts/${contactId}/notes`, { notes });
    
    return { success: response.success };
  }

  private mapContactData(context: CRMSyncContext, mapping: any): any {
    const data: any = {};
    
    for (const [crmField, sourceField] of Object.entries(mapping)) {
      if (sourceField === 'name') {
        data[crmField] = context.userInfo.name || 'Unknown';
      } else if (sourceField === 'email') {
        data[crmField] = context.userInfo.email || '';
      } else if (sourceField === 'phone') {
        data[crmField] = context.userInfo.phone || '';
      } else if (sourceField === 'leadScore') {
        data[crmField] = context.leadScore.percentage;
      } else if (sourceField === 'industry') {
        data[crmField] = context.industry;
      } else if (sourceField === 'segment') {
        data[crmField] = context.segment || 'unknown';
      } else {
        data[crmField] = sourceField;
      }
    }
    
    return data;
  }

  private mapDealData(context: CRMSyncContext, mapping: any, contactId?: string): any {
    const data: any = {};
    
    for (const [crmField, sourceField] of Object.entries(mapping)) {
      if (sourceField === 'lead_score > 70 ? "qualified" : "lead"') {
        data[crmField] = context.leadScore.percentage > 70 ? 'qualified' : 'lead';
      } else if (sourceField === 'lead_score > 70 ? 1 : 2') {
        data[crmField] = context.leadScore.percentage > 70 ? 1 : 2;
      } else {
        data[crmField] = sourceField;
      }
    }
    
    if (contactId) {
      data.contact_id = contactId;
    }
    
    return data;
  }

  private generateTags(context: CRMSyncContext): string[] {
    const tags = [context.industry];
    
    if (context.leadScore.level === 'hot') {
      tags.push('hot-lead', 'urgent');
    } else if (context.leadScore.level === 'warm') {
      tags.push('warm-lead');
    } else {
      tags.push('cold-lead');
    }
    
    if (context.segment) {
      tags.push(context.segment);
    }
    
    return tags;
  }

  private generateNotes(context: CRMSyncContext): string {
    let notes = `Lead Score: ${context.leadScore.percentage}% (${context.leadScore.level})\n`;
    notes += `Industry: ${context.industry}\n`;
    notes += `Segment: ${context.segment || 'Unknown'}\n`;
    notes += `Last Activity: ${context.lastActivity}\n\n`;
    notes += `Responses:\n`;
    
    for (const [question, answer] of Object.entries(context.responses)) {
      notes += `- ${question}: ${answer}\n`;
    }
    
    return notes;
  }

  private async makeCRMRequest(method: string, endpoint: string, data: any): Promise<{ success: boolean; id?: string }> {
    // Simulate API call to CRM
    // In real implementation, this would make actual HTTP requests
    console.log(`CRM Request: ${method} ${endpoint}`, data);
    
    // Simulate success/failure
    const success = Math.random() > 0.1; // 90% success rate
    
    return {
      success,
      id: success ? `crm_${Date.now()}` : undefined
    };
  }
}
