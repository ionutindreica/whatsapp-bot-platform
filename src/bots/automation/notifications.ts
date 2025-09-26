// src/bots/automation/notifications.ts - Sistem de notificări automate pentru toate industriile
export interface NotificationContext {
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
  lastActivity: string;
  preferences: {
    channels: ('email' | 'whatsapp' | 'sms')[];
    frequency: 'immediate' | 'daily' | 'weekly';
    timezone: string;
  };
}

export interface Notification {
  id: string;
  type: 'reminder' | 'followup' | 'promotion' | 'abandoned_cart' | 'appointment' | 'lead_alert';
  channel: 'email' | 'whatsapp' | 'sms';
  message: string;
  scheduledFor: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  context: NotificationContext;
  actions?: Array<{
    type: 'button' | 'link' | 'phone';
    text: string;
    value: string;
  }>;
}

export class NotificationSystem {
  private industryTemplates = {
    coaching: {
      welcome: {
        email: "Bună {name}! Iată resursele tale pentru Amazon: {content}",
        whatsapp: "👋 Bună {name}! Iată resursele tale pentru Amazon: {content}",
        sms: "Bună {name}! Resursele tale pentru Amazon: {content}"
      },
      followup: {
        email: "Ai apucat să te uiți peste material? {link}",
        whatsapp: "📚 Ai apucat să te uiți peste material? {link}",
        sms: "Ai apucat să te uiți peste material? {link}"
      },
      promotion: {
        email: "Ofertă specială: {offer} - Valabilă până la {expiry}",
        whatsapp: "🎁 Ofertă specială: {offer} - Valabilă până la {expiry}",
        sms: "Ofertă specială: {offer} - Valabilă până la {expiry}"
      }
    },
    clinics: {
      appointment_reminder: {
        email: "Reminder: Programarea ta la {service} este {date} la {time}",
        whatsapp: "⏰ Reminder: Programarea ta la {service} este {date} la {time}",
        sms: "Reminder: Programarea ta la {service} este {date} la {time}"
      },
      followup: {
        email: "Cum te simți după tratament? {feedback_link}",
        whatsapp: "🏥 Cum te simți după tratament? {feedback_link}",
        sms: "Cum te simți după tratament? {feedback_link}"
      },
      promotion: {
        email: "Ofertă specială: {offer} - Valabilă până la {expiry}",
        whatsapp: "🎁 Ofertă specială: {offer} - Valabilă până la {expiry}",
        sms: "Ofertă specială: {offer} - Valabilă până la {expiry}"
      }
    },
    ecommerce: {
      cart_abandoned: {
        email: "Ai uitat ceva în coș! {items} - {discount}",
        whatsapp: "🛒 Ai uitat ceva în coș! {items} - {discount}",
        sms: "Ai uitat ceva în coș! {items} - {discount}"
      },
      followup: {
        email: "Cum ți-a plăcut produsul? {review_link}",
        whatsapp: "⭐ Cum ți-a plăcut produsul? {review_link}",
        sms: "Cum ți-a plăcut produsul? {review_link}"
      },
      promotion: {
        email: "Ofertă specială: {offer} - Valabilă până la {expiry}",
        whatsapp: "🎁 Ofertă specială: {offer} - Valabilă până la {expiry}",
        sms: "Ofertă specială: {offer} - Valabilă până la {expiry}"
      }
    }
  };

  async generateNotifications(context: NotificationContext): Promise<Notification[]> {
    const notifications: Notification[] = [];
    const industry = context.industry;
    const leadLevel = context.leadScore.level;
    
    // Generate notifications based on industry and lead level
    switch (industry) {
      case 'coaching':
        notifications.push(...this.generateCoachingNotifications(context));
        break;
      case 'clinics':
        notifications.push(...this.generateClinicsNotifications(context));
        break;
      case 'ecommerce':
        notifications.push(...this.generateEcommerceNotifications(context));
        break;
    }

    // Add team notifications for hot leads
    if (leadLevel === 'hot') {
      notifications.push(this.generateTeamAlert(context));
    }

    return notifications;
  }

  private generateCoachingNotifications(context: NotificationContext): Notification[] {
    const notifications: Notification[] = [];
    const now = new Date();
    
    // Welcome message (immediate)
    notifications.push({
      id: `coaching_welcome_${Date.now()}`,
      type: 'followup',
      channel: 'email',
      message: this.formatTemplate('coaching', 'welcome', context),
      scheduledFor: now.toISOString(),
      priority: 'high',
      context,
      actions: [
        { type: 'link', text: 'Vezi resursele', value: '/resources/amazon-guide' },
        { type: 'button', text: 'Programează call', value: '/booking/strategy-call' }
      ]
    });

    // Follow-up sequence
    const followupTimes = [
      { delay: 24 * 60 * 60 * 1000, message: 'followup' }, // 24h
      { delay: 3 * 24 * 60 * 60 * 1000, message: 'promotion' }, // 3 days
      { delay: 7 * 24 * 60 * 60 * 1000, message: 'promotion' } // 7 days
    ];

    followupTimes.forEach((item, index) => {
      const scheduledTime = new Date(now.getTime() + item.delay);
      notifications.push({
        id: `coaching_followup_${index}_${Date.now()}`,
        type: 'followup',
        channel: 'email',
        message: this.formatTemplate('coaching', item.message, context),
        scheduledFor: scheduledTime.toISOString(),
        priority: 'medium',
        context,
        actions: [
          { type: 'link', text: 'Vezi oferta', value: '/offers/special' },
          { type: 'button', text: 'Programează call', value: '/booking/strategy-call' }
        ]
      });
    });

    return notifications;
  }

  private generateClinicsNotifications(context: NotificationContext): Notification[] {
    const notifications: Notification[] = [];
    const now = new Date();
    
    // Appointment reminders
    const reminderTimes = [
      { delay: 24 * 60 * 60 * 1000, message: 'appointment_reminder' }, // 24h before
      { delay: 60 * 60 * 1000, message: 'appointment_reminder' } // 1h before
    ];

    reminderTimes.forEach((item, index) => {
      const scheduledTime = new Date(now.getTime() + item.delay);
      notifications.push({
        id: `clinics_reminder_${index}_${Date.now()}`,
        type: 'appointment',
        channel: 'whatsapp',
        message: this.formatTemplate('clinics', item.message, context),
        scheduledFor: scheduledTime.toISOString(),
        priority: 'high',
        context,
        actions: [
          { type: 'button', text: 'Confirmă', value: '/appointment/confirm' },
          { type: 'button', text: 'Reprogramează', value: '/appointment/reschedule' }
        ]
      });
    });

    // Follow-up after appointment
    const followupTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24h after
    notifications.push({
      id: `clinics_followup_${Date.now()}`,
      type: 'followup',
      channel: 'whatsapp',
      message: this.formatTemplate('clinics', 'followup', context),
      scheduledFor: followupTime.toISOString(),
      priority: 'medium',
      context,
      actions: [
        { type: 'link', text: 'Lasă feedback', value: '/feedback/appointment' },
        { type: 'button', text: 'Programează următoarea', value: '/booking/next' }
      ]
    });

    return notifications;
  }

  private generateEcommerceNotifications(context: NotificationContext): Notification[] {
    const notifications: Notification[] = [];
    const now = new Date();
    
    // Cart abandonment sequence
    const cartAbandonmentTimes = [
      { delay: 60 * 60 * 1000, message: 'cart_abandoned' }, // 1h
      { delay: 24 * 60 * 60 * 1000, message: 'cart_abandoned' }, // 24h
      { delay: 48 * 60 * 60 * 1000, message: 'cart_abandoned' } // 48h
    ];

    cartAbandonmentTimes.forEach((item, index) => {
      const scheduledTime = new Date(now.getTime() + item.delay);
      notifications.push({
        id: `ecommerce_cart_${index}_${Date.now()}`,
        type: 'abandoned_cart',
        channel: 'email',
        message: this.formatTemplate('ecommerce', item.message, context),
        scheduledFor: scheduledTime.toISOString(),
        priority: 'high',
        context,
        actions: [
          { type: 'link', text: 'Finalizează comanda', value: '/checkout' },
          { type: 'button', text: 'Vezi produsele', value: '/cart' }
        ]
      });
    });

    // Follow-up after purchase
    const followupTime = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days after
    notifications.push({
      id: `ecommerce_followup_${Date.now()}`,
      type: 'followup',
      channel: 'email',
      message: this.formatTemplate('ecommerce', 'followup', context),
      scheduledFor: followupTime.toISOString(),
      priority: 'medium',
      context,
      actions: [
        { type: 'link', text: 'Lasă review', value: '/review/product' },
        { type: 'button', text: 'Vezi recomandări', value: '/recommendations' }
      ]
    });

    return notifications;
  }

  private generateTeamAlert(context: NotificationContext): Notification {
    const industry = context.industry;
    const leadLevel = context.leadScore.level;
    
    let message = `🚨 LEAD FIERBINTE DETECTAT!\n\n`;
    message += `Industrie: ${industry}\n`;
    message += `Nivel: ${leadLevel}\n`;
    message += `Scor: ${context.leadScore.percentage}%\n`;
    message += `Contact: ${context.userInfo.email || context.userInfo.phone}\n`;
    message += `Segment: ${context.segment || 'N/A'}\n\n`;
    message += `ACȚIUNE IMEDIATĂ NECESARĂ!`;

    return {
      id: `team_alert_${Date.now()}`,
      type: 'lead_alert',
      channel: 'email',
      message,
      scheduledFor: new Date().toISOString(),
      priority: 'urgent',
      context,
      actions: [
        { type: 'button', text: 'Contactează acum', value: `/contact/${context.userInfo.phone}` },
        { type: 'link', text: 'Vezi detalii', value: `/leads/${context.userInfo.email}` }
      ]
    };
  }

  private formatTemplate(industry: string, template: string, context: NotificationContext): string {
    const templates = this.industryTemplates[industry as keyof typeof this.industryTemplates];
    const templateData = templates[template as keyof typeof templates];
    
    if (!templateData) return 'Template not found';
    
    const channel = context.preferences.channels[0] || 'email';
    const message = templateData[channel as keyof typeof templateData] || templateData.email;
    
    // Replace placeholders
    return message
      .replace(/{name}/g, context.userInfo.name || 'Client')
      .replace(/{content}/g, 'Ghidul complet pentru Amazon')
      .replace(/{link}/g, '/resources/amazon-guide')
      .replace(/{offer}/g, '20% reducere')
      .replace(/{expiry}/g, '31 decembrie 2024')
      .replace(/{service}/g, 'Consultație generală')
      .replace(/{date}/g, '15 ianuarie 2024')
      .replace(/{time}/g, '10:00')
      .replace(/{feedback_link}/g, '/feedback/appointment')
      .replace(/{items}/g, '3 produse')
      .replace(/{discount}/g, '10% reducere')
      .replace(/{review_link}/g, '/review/product');
  }
}
