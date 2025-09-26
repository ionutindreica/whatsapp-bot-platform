// src/bots/industries/coaching/flow.ts - Flow complet pentru Coaching & Educație
export interface CoachingContext {
  sessionId: string;
  userInfo: {
    name?: string;
    phone?: string;
    email?: string;
  };
  responses: {
    [key: string]: string;
  };
  segment?: 'incepator_motivat' | 'incepator_explorator' | 'intermediar' | 'avansat';
  score: number;
  currentStep: string;
}

export interface CoachingResponse {
  message: string;
  nextStep: string;
  segment?: string;
  content?: {
    type: 'pdf' | 'video' | 'case_study';
    title: string;
    url: string;
  };
  cta?: {
    type: 'call' | 'course' | 'program';
    text: string;
    url: string;
  };
  context: CoachingContext;
}

export class CoachingFlow {
  private steps = {
    welcome: {
      message: "👋 Salut! Te pot ajuta să-ți dezvolți afacerea pe Amazon. Răspunde la câteva întrebări.",
      nextStep: "q1_experience"
    },
    q1_experience: {
      question: "Ai început deja să vinzi pe Amazon?",
      options: ["Da", "Nu"],
      nextStep: {
        "Da": "q2_obstacle",
        "Nu": "q3_timeline"
      }
    },
    q2_obstacle: {
      question: "Care este cel mai mare obstacol actual?",
      options: ["Lansare produs nou", "Scalare vânzări", "Optimizare listări"],
      nextStep: "segment_intermediar_avansat"
    },
    q3_timeline: {
      question: "Cât de repede vrei să lansezi primul produs?",
      options: ["<3 luni", ">3 luni"],
      nextStep: {
        "<3 luni": "segment_incepator_motivat",
        ">3 luni": "segment_incepator_explorator"
      }
    }
  };

  private segments = {
    incepator_motivat: {
      content: {
        type: 'pdf' as const,
        title: "Cum să începi pe Amazon - Ghid complet",
        url: "/content/amazon-beginner-guide.pdf"
      },
      cta: {
        type: 'call' as const,
        text: "Programează un call gratuit de strategie",
        url: "/booking/strategy-call"
      }
    },
    incepator_explorator: {
      content: {
        type: 'pdf' as const,
        title: "Cum să începi pe Amazon - Ghid complet",
        url: "/content/amazon-beginner-guide.pdf"
      },
      cta: {
        type: 'course' as const,
        text: "Vezi cursul potrivit pentru tine",
        url: "/courses/amazon-basics"
      }
    },
    intermediar: {
      content: {
        type: 'video' as const,
        title: "Strategii pentru lansări rapide",
        url: "/content/launch-strategies.mp4"
      },
      cta: {
        type: 'call' as const,
        text: "Programează un call gratuit de strategie",
        url: "/booking/strategy-call"
      }
    },
    avansat: {
      content: {
        type: 'case_study' as const,
        title: "Studiu de caz: Cum am ajuns la $50k/lună",
        url: "/content/success-case-study.pdf"
      },
      cta: {
        type: 'program' as const,
        text: "Vezi programul de mentoring 1:1",
        url: "/programs/mentoring"
      }
    }
  };

  async handleStep(context: CoachingContext, userResponse?: string): Promise<CoachingResponse> {
    const currentStep = context.currentStep || 'welcome';
    
    switch (currentStep) {
      case 'welcome':
        return this.handleWelcome(context);
      
      case 'q1_experience':
        return this.handleQ1Experience(context, userResponse!);
      
      case 'q2_obstacle':
        return this.handleQ2Obstacle(context, userResponse!);
      
      case 'q3_timeline':
        return this.handleQ3Timeline(context, userResponse!);
      
      case 'segment_intermediar_avansat':
        return this.handleSegmentIntermediarAvansat(context);
      
      case 'segment_incepator_motivat':
        return this.handleSegmentIncepatorMotivat(context);
      
      case 'segment_incepator_explorator':
        return this.handleSegmentIncepatorExplorator(context);
      
      default:
        return this.handleWelcome(context);
    }
  }

  private handleWelcome(context: CoachingContext): CoachingResponse {
    return {
      message: this.steps.welcome.message,
      nextStep: 'q1_experience',
      context: {
        ...context,
        currentStep: 'q1_experience'
      }
    };
  }

  private handleQ1Experience(context: CoachingContext, response: string): CoachingResponse {
    const updatedContext = {
      ...context,
      responses: {
        ...context.responses,
        q1_experience: response
      },
      currentStep: response === 'Da' ? 'q2_obstacle' : 'q3_timeline'
    };

    const nextStep = response === 'Da' ? 'q2_obstacle' : 'q3_timeline';
    const question = response === 'Da' ? this.steps.q2_obstacle : this.steps.q3_timeline;

    return {
      message: question.question,
      nextStep,
      context: updatedContext
    };
  }

  private handleQ2Obstacle(context: CoachingContext, response: string): CoachingResponse {
    const updatedContext = {
      ...context,
      responses: {
        ...context.responses,
        q2_obstacle: response
      },
      currentStep: 'segment_intermediar_avansat'
    };

    // Determine segment based on response
    let segment: 'intermediar' | 'avansat';
    if (response === 'Lansare produs nou') {
      segment = 'intermediar';
    } else {
      segment = 'avansat';
    }

    return this.handleSegment(updatedContext, segment);
  }

  private handleQ3Timeline(context: CoachingContext, response: string): CoachingResponse {
    const updatedContext = {
      ...context,
      responses: {
        ...context.responses,
        q3_timeline: response
      },
      currentStep: response === '<3 luni' ? 'segment_incepator_motivat' : 'segment_incepator_explorator'
    };

    const segment = response === '<3 luni' ? 'incepator_motivat' : 'incepator_explorator';
    return this.handleSegment(updatedContext, segment);
  }

  private handleSegmentIntermediarAvansat(context: CoachingContext): CoachingResponse {
    const response = context.responses.q2_obstacle;
    const segment = response === 'Lansare produs nou' ? 'intermediar' : 'avansat';
    return this.handleSegment(context, segment);
  }

  private handleSegmentIncepatorMotivat(context: CoachingContext): CoachingResponse {
    return this.handleSegment(context, 'incepator_motivat');
  }

  private handleSegmentIncepatorExplorator(context: CoachingContext): CoachingResponse {
    return this.handleSegment(context, 'incepator_explorator');
  }

  private handleSegment(context: CoachingContext, segment: 'incepator_motivat' | 'incepator_explorator' | 'intermediar' | 'avansat'): CoachingResponse {
    const segmentData = this.segments[segment];
    const updatedContext = {
      ...context,
      segment,
      currentStep: 'content_delivery'
    };

    return {
      message: `Perfect! Am înțeles nevoile tale. Să îți trimit conținutul potrivit pentru tine.`,
      nextStep: 'content_delivery',
      segment,
      content: segmentData.content,
      cta: segmentData.cta,
      context: updatedContext
    };
  }
}
