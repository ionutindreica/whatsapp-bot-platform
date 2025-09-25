import { logger } from '../../lib/logger';
import { config } from './config';

export interface WhatsAppMessage {
  to: string;
  type: 'text' | 'image' | 'document' | 'template';
  text?: string;
  media?: {
    url: string;
    caption?: string;
  };
  template?: {
    name: string;
    language: string;
    components: any[];
  };
}

export interface WhatsAppWebhookEvent {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        messages?: Array<{
          id: string;
          from: string;
          timestamp: string;
          text?: { body: string };
          type: string;
        }>;
        statuses?: Array<{
          id: string;
          status: string;
          timestamp: string;
          recipient_id: string;
        }>;
      };
      field: string;
    }>;
  }>;
}

export class WhatsAppService {
  private apiUrl: string;
  private accessToken: string;
  private phoneNumberId: string;

  constructor() {
    this.apiUrl = 'https://graph.facebook.com/v18.0';
    this.accessToken = config.WHATSAPP_API_KEY || '';
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
  }

  async sendMessage(message: WhatsAppMessage): Promise<any> {
    try {
      const payload = {
        messaging_product: 'whatsapp',
        to: message.to,
        type: message.type,
        ...(message.type === 'text' && { text: { body: message.text } }),
        ...(message.type === 'image' && {
          image: {
            link: message.media?.url,
            caption: message.media?.caption,
          },
        }),
        ...(message.type === 'template' && {
          template: {
            name: message.template?.name,
            language: { code: message.template?.language },
            components: message.template?.components,
          },
        }),
      };

      const response = await fetch(`${this.apiUrl}/${this.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`WhatsApp API error: ${response.status} - ${error}`);
      }

      const result = await response.json();
      
      logger.info('WhatsApp message sent', {
        messageId: result.messages?.[0]?.id,
        to: message.to,
        type: message.type,
      });

      return result;
    } catch (error) {
      logger.error('WhatsApp send message failed', {
        error: error.message,
        to: message.to,
        type: message.type,
      });
      throw error;
    }
  }

  async sendTemplateMessage(to: string, templateName: string, language: string, components: any[] = []): Promise<any> {
    return this.sendMessage({
      to,
      type: 'template',
      template: {
        name: templateName,
        language,
        components,
      },
    });
  }

  async sendTextMessage(to: string, text: string): Promise<any> {
    return this.sendMessage({
      to,
      type: 'text',
      text,
    });
  }

  async sendMediaMessage(to: string, mediaUrl: string, caption?: string): Promise<any> {
    return this.sendMessage({
      to,
      type: 'image',
      media: {
        url: mediaUrl,
        caption,
      },
    });
  }

  async getMessageStatus(messageId: string): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}/${messageId}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('WhatsApp get message status failed', {
        error: error.message,
        messageId,
      });
      throw error;
    }
  }

  async validateWebhook(mode: string, token: string, challenge: string): Promise<string | null> {
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
    
    if (mode === 'subscribe' && token === verifyToken) {
      logger.info('WhatsApp webhook verified');
      return challenge;
    }
    
    logger.warn('WhatsApp webhook verification failed', { mode, token });
    return null;
  }

  async processWebhookEvent(event: WhatsAppWebhookEvent): Promise<any[]> {
    const messages = [];

    for (const entry of event.entry) {
      for (const change of entry.changes) {
        if (change.field === 'messages') {
          const value = change.value;
          
          // Process incoming messages
          if (value.messages) {
            for (const message of value.messages) {
              const processedMessage = {
                id: message.id,
                from: message.from,
                timestamp: new Date(parseInt(message.timestamp) * 1000),
                type: message.type,
                text: message.text?.body,
                phoneNumberId: value.metadata.phone_number_id,
              };

              messages.push(processedMessage);
              
              logger.info('WhatsApp message received', {
                messageId: message.id,
                from: message.from,
                type: message.type,
              });
            }
          }

          // Process message status updates
          if (value.statuses) {
            for (const status of value.statuses) {
              logger.info('WhatsApp message status update', {
                messageId: status.id,
                status: status.status,
                recipientId: status.recipient_id,
              });
            }
          }
        }
      }
    }

    return messages;
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    // WhatsApp doesn't have a direct read receipt API
    // This would be handled in your application logic
    logger.info('WhatsApp message marked as read', { messageId });
  }

  async getBusinessProfile(): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}/${this.phoneNumberId}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('WhatsApp get business profile failed', {
        error: error.message,
      });
      throw error;
    }
  }
}

export const whatsappService = new WhatsAppService();
export default whatsappService;
