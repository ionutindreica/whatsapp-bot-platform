// src/bots/industries/clinics/flow.ts - Flow complet pentru Servicii Locale & Clinici
export interface ClinicsContext {
  sessionId: string;
  userInfo: {
    name?: string;
    phone?: string;
    email?: string;
  };
  responses: {
    [key: string]: string;
  };
  segment?: 'client_existent' | 'lead_nou';
  urgency?: 'urgent' | 'normal' | 'flexibil';
  serviceType?: 'consultatie' | 'tratament' | 'urgenta';
  score: number;
  currentStep: string;
  appointment?: {
    date: string;
    time: string;
    service: string;
    confirmed: boolean;
  };
}

export interface ClinicsResponse {
  message: string;
  nextStep: string;
  segment?: string;
  appointment?: {
    date: string;
    time: string;
    service: string;
    calendarLink: string;
  };
  context: ClinicsContext;
}

export class ClinicsFlow {
  private steps = {
    welcome: {
      message: "👋 Salut! Te pot ajuta să faci o programare rapidă. Spune-mi mai multe:",
      nextStep: "q1_service"
    },
    q1_service: {
      question: "Ce tip de serviciu cauți?",
      options: ["Consultație generală", "Tratament specific", "Urgență"],
      nextStep: "q2_history"
    },
    q2_history: {
      question: "Ai mai fost la noi?",
      options: ["Da", "Nu"],
      nextStep: {
        "Da": "segment_client_existent",
        "Nu": "segment_lead_nou"
      }
    },
    q3_timing: {
      question: "Când ți-ar fi potrivită programarea?",
      options: ["Săptămâna aceasta", "Luna aceasta", "Nu sunt sigur"],
      nextStep: "appointment_booking"
    }
  };

  private segments = {
    client_existent: {
      message: "Bună! Văd că ești clientul nostru. Să găsim cea mai bună programare pentru tine.",
      priority: 'high'
    },
    lead_nou: {
      message: "Bună! Să te ajut să faci prima programare. Să găsim cea mai bună opțiune pentru tine.",
      priority: 'normal'
    }
  };

  private services = {
    "Consultație generală": {
      duration: "30 min",
      price: "150 RON",
      availableSlots: [
        { date: "2024-01-15", time: "09:00", available: true },
        { date: "2024-01-15", time: "14:00", available: true },
        { date: "2024-01-16", time: "10:00", available: true }
      ]
    },
    "Tratament specific": {
      duration: "60 min",
      price: "300 RON",
      availableSlots: [
        { date: "2024-01-15", time: "11:00", available: true },
        { date: "2024-01-16", time: "15:00", available: true },
        { date: "2024-01-17", time: "09:00", available: true }
      ]
    },
    "Urgență": {
      duration: "45 min",
      price: "200 RON",
      availableSlots: [
        { date: "2024-01-15", time: "16:00", available: true },
        { date: "2024-01-15", time: "18:00", available: true }
      ]
    }
  };

  async handleStep(context: ClinicsContext, userResponse?: string): Promise<ClinicsResponse> {
    const currentStep = context.currentStep || 'welcome';
    
    switch (currentStep) {
      case 'welcome':
        return this.handleWelcome(context);
      
      case 'q1_service':
        return this.handleQ1Service(context, userResponse!);
      
      case 'q2_history':
        return this.handleQ2History(context, userResponse!);
      
      case 'q3_timing':
        return this.handleQ3Timing(context, userResponse!);
      
      case 'appointment_booking':
        return this.handleAppointmentBooking(context);
      
      case 'appointment_confirmation':
        return this.handleAppointmentConfirmation(context, userResponse!);
      
      default:
        return this.handleWelcome(context);
    }
  }

  private handleWelcome(context: ClinicsContext): ClinicsResponse {
    return {
      message: this.steps.welcome.message,
      nextStep: 'q1_service',
      context: {
        ...context,
        currentStep: 'q1_service'
      }
    };
  }

  private handleQ1Service(context: ClinicsContext, response: string): ClinicsResponse {
    const updatedContext = {
      ...context,
      responses: {
        ...context.responses,
        q1_service: response
      },
      serviceType: response.toLowerCase().includes('consultatie') ? 'consultatie' : 
                   response.toLowerCase().includes('tratament') ? 'tratament' : 'urgenta',
      currentStep: 'q2_history'
    };

    return {
      message: this.steps.q2_history.question,
      nextStep: 'q2_history',
      context: updatedContext
    };
  }

  private handleQ2History(context: ClinicsContext, response: string): ClinicsResponse {
    const updatedContext = {
      ...context,
      responses: {
        ...context.responses,
        q2_history: response
      },
      segment: response === 'Da' ? 'client_existent' : 'lead_nou',
      currentStep: 'q3_timing'
    };

    const segmentData = this.segments[updatedContext.segment!];

    return {
      message: `${segmentData.message}\n\n${this.steps.q3_timing.question}`,
      nextStep: 'q3_timing',
      segment: updatedContext.segment,
      context: updatedContext
    };
  }

  private handleQ3Timing(context: ClinicsContext, response: string): ClinicsResponse {
    const updatedContext = {
      ...context,
      responses: {
        ...context.responses,
        q3_timing: response
      },
      currentStep: 'appointment_booking'
    };

    return {
      message: "Perfect! Să găsim cea mai bună programare pentru tine.",
      nextStep: 'appointment_booking',
      context: updatedContext
    };
  }

  private handleAppointmentBooking(context: ClinicsContext): ClinicsResponse {
    const serviceType = context.serviceType || 'consultatie';
    const serviceName = serviceType === 'consultatie' ? 'Consultație generală' :
                        serviceType === 'tratament' ? 'Tratament specific' : 'Urgență';
    
    const serviceData = this.services[serviceName as keyof typeof this.services];
    const availableSlots = serviceData.availableSlots.filter(slot => slot.available);

    let message = `📅 **Programări disponibile pentru ${serviceName}:**\n\n`;
    availableSlots.forEach((slot, index) => {
      message += `${index + 1}. ${slot.date} la ${slot.time} (${serviceData.duration})\n`;
    });
    message += `\n💰 Preț: ${serviceData.price}\n\n`;
    message += `Răspunde cu numărul programării dorite (ex: "1" pentru prima opțiune).`;

    return {
      message,
      nextStep: 'appointment_confirmation',
      context: {
        ...context,
        currentStep: 'appointment_confirmation'
      }
    };
  }

  private handleAppointmentConfirmation(context: ClinicsContext, userResponse: string): ClinicsResponse {
    const serviceType = context.serviceType || 'consultatie';
    const serviceName = serviceType === 'consultatie' ? 'Consultație generală' :
                        serviceType === 'tratament' ? 'Tratament specific' : 'Urgență';
    
    const serviceData = this.services[serviceName as keyof typeof this.services];
    const availableSlots = serviceData.availableSlots.filter(slot => slot.available);
    
    const selectedIndex = parseInt(userResponse) - 1;
    const selectedSlot = availableSlots[selectedIndex];

    if (!selectedSlot) {
      return {
        message: "Opțiune invalidă. Te rog să alegi din nou.",
        nextStep: 'appointment_booking',
        context: {
          ...context,
          currentStep: 'appointment_booking'
        }
      };
    }

    const appointment = {
      date: selectedSlot.date,
      time: selectedSlot.time,
      service: serviceName,
      confirmed: true
    };

    const updatedContext = {
      ...context,
      appointment,
      currentStep: 'confirmed'
    };

    const calendarLink = this.generateCalendarLink(appointment);

    return {
      message: `✅ **Programarea ta a fost confirmată!**\n\n📅 **Detalii:**\n- Serviciu: ${serviceName}\n- Data: ${appointment.date}\n- Ora: ${appointment.time}\n- Durata: ${serviceData.duration}\n- Preț: ${serviceData.price}\n\n📱 **Link Calendar:** ${calendarLink}\n\n🔔 Vei primi reminder-uri la 24h și 1h înainte de programare.`,
      nextStep: 'confirmed',
      appointment: {
        ...appointment,
        calendarLink
      },
      context: updatedContext
    };
  }

  private generateCalendarLink(appointment: any): string {
    const startDate = new Date(`${appointment.date}T${appointment.time}`);
    const endDate = new Date(startDate.getTime() + 30 * 60000); // +30 min
    
    const startISO = startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endISO = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(appointment.service)}&dates=${startISO}/${endISO}`;
  }
}
