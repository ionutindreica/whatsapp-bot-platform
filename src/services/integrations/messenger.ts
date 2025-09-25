import { logger } from '../../lib/logger';
import { config } from './config';

export interface MessengerMessage {
  recipient: { id: string };
  message: {
    text?: string;
    attachment?: {
      type: 'image' | 'video' | 'audio' | 'file';
      payload: {
        url: string;
      };
    };
    quick_replies?: Array<{
      content_type: 'text';
      title: string;
      payload: string;
    }>;
  };
}

export interface MessengerWebhookEvent {
  object: string;
  entry: Array<{
    id: string;
    time: number;
    messaging: Array<{
      sender: { id: string };
      recipient: { id: string };
      timestamp: number;
      message?: {
        mid: string;
        text?: string;
        attachments?: Array<{
          type: string;
          payload: {
            url: string;
          };
        }>;
      };
      postback?: {
        title: string;
        payload: string;
      };
      delivery?: {
        mids: string[];
        watermark: number;
      };
      read?: {
        watermark: number;
      };
    }>;
  }>;
}

export class MessengerService {
  private apiUrl: string;
  private accessToken: string;
  private pageId: string;

  constructor() {
    this.apiUrl = 'https://graph.facebook.com/v18.0';
    this.accessToken = config.FACEBOOK_APP_SECRET || '';
    this.pageId = process.env.FACEBOOK_PAGE_ID || '';
  }

  async sendMessage(message: MessengerMessage): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}/me/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Messenger API error: ${response.status} - ${error}`);
      }

      const result = await response.json();
      
      logger.info('Messenger message sent', {
        messageId: result.message_id,
        recipientId: message.recipient.id,
        type: message.message.text ? 'text' : 'attachment',
      });

      return result;
    } catch (error) {
      logger.error('Messenger send message failed', {
        error: error.message,
        recipientId: message.recipient.id,
      });
      throw error;
    }
  }

  async sendTextMessage(recipientId: string, text: string): Promise<any> {
    return this.sendMessage({
      recipient: { id: recipientId },
      message: { text },
    });
  }

  async sendAttachment(recipientId: string, type: string, url: string): Promise<any> {
    return this.sendMessage({
      recipient: { id: recipientId },
      message: {
        attachment: {
          type: type as any,
          payload: { url },
        },
      },
    });
  }

  async sendQuickReplies(recipientId: string, text: string, quickReplies: Array<{ title: string; payload: string }>): Promise<any> {
    return this.sendMessage({
      recipient: { id: recipientId },
      message: {
        text,
        quick_replies: quickReplies.map(reply => ({
          content_type: 'text' as const,
          title: reply.title,
          payload: reply.payload,
        })),
      },
    });
  }

  async typingOn(recipientId: string): Promise<any> {
    return this.sendMessage({
      recipient: { id: recipientId },
      message: { text: '' }, // Empty message for typing indicator
    });
  }

  async markAsRead(recipientId: string): Promise<any> {
    return this.sendMessage({
      recipient: { id: recipientId },
      message: { text: '' }, // Empty message for read receipt
    });
  }

  async validateWebhook(mode: string, token: string, challenge: string): Promise<string | null> {
    const verifyToken = process.env.FACEBOOK_VERIFY_TOKEN;
    
    if (mode === 'subscribe' && token === verifyToken) {
      logger.info('Messenger webhook verified');
      return challenge;
    }
    
    logger.warn('Messenger webhook verification failed', { mode, token });
    return null;
  }

  async processWebhookEvent(event: MessengerWebhookEvent): Promise<any[]> {
    const messages = [];

    for (const entry of event.entry) {
      for (const messaging of entry.messaging) {
        const processedMessage = {
          id: messaging.message?.mid,
          senderId: messaging.sender.id,
          recipientId: messaging.recipient.id,
          timestamp: new Date(messaging.timestamp),
          type: 'message',
          text: messaging.message?.text,
          attachments: messaging.message?.attachments,
          postback: messaging.postback,
          delivery: messaging.delivery,
          read: messaging.read,
        };

        messages.push(processedMessage);
        
        logger.info('Messenger message received', {
          messageId: messaging.message?.mid,
          senderId: messaging.sender.id,
          type: messaging.message ? 'message' : messaging.postback ? 'postback' : 'other',
        });
      }
    }

    return messages;
  }

  async getUserProfile(userId: string): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}/${userId}?fields=first_name,last_name,profile_pic`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Messenger API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('Messenger get user profile failed', {
        error: error.message,
        userId,
      });
      throw error;
    }
  }

  async getPageInfo(): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}/me?fields=name,picture`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Messenger API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('Messenger get page info failed', {
        error: error.message,
      });
      throw error;
    }
  }
}

export const messengerService = new MessengerService();
export default messengerService;
