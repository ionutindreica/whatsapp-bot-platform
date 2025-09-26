// src/bots/core/qualify.ts - Core qualification flow pentru toate industriile
export interface QualificationContext {
  industry: 'coaching' | 'clinics' | 'ecommerce';
  userInfo: {
    name?: string;
    phone?: string;
    email?: string;
  };
  responses: {
    [key: string]: string;
  };
  sessionId: string;
}

export interface QualificationResponse {
  message: string;
  nextStep: 'segment' | 'offer' | 'followup';
  score: number;
  context: QualificationContext;
}

export class CoreQualify {
  private industryQuestions = {
    coaching: [
      {
        id: 'experience',
        question: "Ai deja un produs pe care vrei să îl lansezi pe Amazon?",
        options: ["Da, am deja produsul", "Nu, încă caut", "Am o idee, dar nu știu cum"],
        weight: 3
      },
      {
        id: 'budget',
        question: "Ce buget ai disponibil pentru investiția inițială?",
        options: ["Sub $1000", "$1000-5000", "Peste $5000"],
        weight: 2
      },
      {
        id: 'goal',
        question: "Ce obiectiv ai cu Amazon?",
        options: ["Să învăț procesul", "Să fac primul profit", "Să scalez business-ul"],
        weight: 4
      }
    ],
    clinics: [
      {
        id: 'problem',
        question: "Ce problemă de sănătate vrei să rezolvi?",
        options: ["Consultare generală", "Tratament specific", "Urgență medicală"],
        weight: 5
      },
      {
        id: 'history',
        question: "Ai mai fost la noi înainte?",
        options: ["Da, sunt client", "Nu, sunt nou", "Am auzit de voi"],
        weight: 2
      },
      {
        id: 'urgency',
        question: "Cât de urgent este?",
        options: ["Foarte urgent", "În următoarele zile", "Când am timp"],
        weight: 3
      }
    ],
    ecommerce: [
      {
        id: 'need',
        question: "Ce produs cauți?",
        options: ["Produs specific", "Categorie generală", "Nu știu exact"],
        weight: 4
      },
      {
        id: 'budget',
        question: "Ce buget ai?",
        options: ["Sub $50", "$50-200", "Peste $200"],
        weight: 3
      },
      {
        id: 'urgency',
        question: "Cât de urgent este?",
        options: ["Foarte urgent", "În următoarele zile", "Când am timp"],
        weight: 2
      }
    ]
  };

  async handleQualification(context: QualificationContext, questionId: string, answer: string): Promise<QualificationResponse> {
    const industry = context.industry;
    const questions = this.industryQuestions[industry];
    const currentQuestion = questions.find(q => q.id === questionId);
    
    if (!currentQuestion) {
      return this.completeQualification(context);
    }

    // Update context with response
    const updatedContext = {
      ...context,
      responses: {
        ...context.responses,
        [questionId]: answer
      }
    };

    // Calculate score based on answer
    const score = this.calculateScore(updatedContext, industry);
    
    // Get next question or complete
    const nextQuestion = this.getNextQuestion(updatedContext, industry);
    
    if (nextQuestion) {
      return {
        message: nextQuestion.question,
        nextStep: 'qualify',
        score,
        context: updatedContext
      };
    } else {
      return this.completeQualification(updatedContext);
    }
  }

  private calculateScore(context: QualificationContext, industry: string): number {
    const responses = context.responses;
    let score = 0;

    // Industry-specific scoring logic
    if (industry === 'coaching') {
      if (responses.experience === "Da, am deja produsul") score += 3;
      if (responses.budget === "Peste $5000") score += 2;
      if (responses.goal === "Să scalez business-ul") score += 4;
    } else if (industry === 'clinics') {
      if (responses.problem === "Tratament specific") score += 5;
      if (responses.history === "Da, sunt client") score += 2;
      if (responses.urgency === "Foarte urgent") score += 3;
    } else if (industry === 'ecommerce') {
      if (responses.need === "Produs specific") score += 4;
      if (responses.budget === "Peste $200") score += 3;
      if (responses.urgency === "Foarte urgent") score += 2;
    }

    return Math.min(score, 10); // Max score 10
  }

  private getNextQuestion(context: QualificationContext, industry: string) {
    const questions = this.industryQuestions[industry];
    const answeredQuestions = Object.keys(context.responses);
    
    return questions.find(q => !answeredQuestions.includes(q.id));
  }

  private completeQualification(context: QualificationContext): QualificationResponse {
    const score = this.calculateScore(context, context.industry);
    
    return {
      message: "Perfect! Am înțeles nevoile tale. Să trecem la următorul pas!",
      nextStep: 'segment',
      score,
      context
    };
  }
}
