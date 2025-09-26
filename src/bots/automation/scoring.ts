// src/bots/automation/scoring.ts - Lead scoring automat pentru toate industriile
export interface LeadScore {
  totalScore: number;
  maxScore: number;
  percentage: number;
  level: 'cold' | 'warm' | 'hot';
  factors: {
    [key: string]: {
      score: number;
      weight: number;
      description: string;
    };
  };
  recommendations: string[];
}

export interface ScoringContext {
  industry: 'coaching' | 'clinics' | 'ecommerce';
  responses: { [key: string]: string };
  userInfo: {
    name?: string;
    phone?: string;
    email?: string;
  };
  behavior: {
    timeSpent: number;
    pagesVisited: number;
    returnVisits: number;
    lastActivity: string;
  };
}

export class LeadScoring {
  private industryWeights = {
    coaching: {
      experience: 0.3,
      budget: 0.25,
      timeline: 0.2,
      engagement: 0.15,
      contact: 0.1
    },
    clinics: {
      urgency: 0.4,
      service: 0.25,
      history: 0.15,
      contact: 0.1,
      engagement: 0.1
    },
    ecommerce: {
      budget: 0.3,
      urgency: 0.25,
      category: 0.2,
      engagement: 0.15,
      contact: 0.1
    }
  };

  private scoringRules = {
    coaching: {
      experience: {
        "Da, am deja produsul": 8,
        "Nu, încă caut": 5,
        "Am o idee, dar nu știu cum": 3
      },
      budget: {
        "Peste $5000": 10,
        "$1000-5000": 7,
        "Sub $1000": 4
      },
      timeline: {
        "<3 luni": 9,
        "3-6 luni": 6,
        ">6 luni": 3
      }
    },
    clinics: {
      urgency: {
        "Foarte urgent": 10,
        "În următoarele zile": 7,
        "Când am timp": 4
      },
      service: {
        "Urgență": 9,
        "Tratament specific": 7,
        "Consultație generală": 5
      },
      history: {
        "Da, sunt client": 8,
        "Nu, sunt nou": 5,
        "Am auzit de voi": 3
      }
    },
    ecommerce: {
      budget: {
        ">200€": 10,
        "50–200€": 7,
        "<50€": 4
      },
      urgency: {
        "Azi / în 48h": 10,
        "În 1–2 săptămâni": 6,
        "Când am timp": 3
      },
      category: {
        "Fashion": 8,
        "Accesorii": 7,
        "Home & Living": 6,
        "Altceva": 5
      }
    }
  };

  async calculateScore(context: ScoringContext): Promise<LeadScore> {
    const industry = context.industry;
    const weights = this.industryWeights[industry];
    const rules = this.scoringRules[industry];
    
    let totalScore = 0;
    let maxScore = 0;
    const factors: { [key: string]: any } = {};

    // Calculate scores for each factor
    for (const [factor, weight] of Object.entries(weights)) {
      const factorScore = this.calculateFactorScore(factor, context, rules);
      const factorMaxScore = 10;
      
      factors[factor] = {
        score: factorScore,
        weight: weight,
        description: this.getFactorDescription(factor, industry),
        maxScore: factorMaxScore
      };
      
      totalScore += factorScore * weight;
      maxScore += factorMaxScore * weight;
    }

    // Add engagement bonus
    const engagementBonus = this.calculateEngagementBonus(context);
    totalScore += engagementBonus;
    maxScore += 10; // Max engagement bonus

    factors.engagement = {
      score: engagementBonus,
      weight: 0.1,
      description: "Engagement și comportament",
      maxScore: 10
    };

    const percentage = Math.round((totalScore / maxScore) * 100);
    const level = this.determineLevel(percentage);
    const recommendations = this.generateRecommendations(level, industry, context);

    return {
      totalScore: Math.round(totalScore),
      maxScore: Math.round(maxScore),
      percentage,
      level,
      factors,
      recommendations
    };
  }

  private calculateFactorScore(factor: string, context: ScoringContext, rules: any): number {
    const responses = context.responses;
    const factorRules = rules[factor];
    
    if (!factorRules) return 0;
    
    // Find matching response
    for (const [response, score] of Object.entries(factorRules)) {
      if (responses[factor] === response) {
        return score as number;
      }
    }
    
    return 0;
  }

  private calculateEngagementBonus(context: ScoringContext): number {
    const behavior = context.behavior;
    let bonus = 0;
    
    // Time spent bonus
    if (behavior.timeSpent > 300) bonus += 3; // 5+ minutes
    else if (behavior.timeSpent > 120) bonus += 2; // 2+ minutes
    else if (behavior.timeSpent > 60) bonus += 1; // 1+ minute
    
    // Pages visited bonus
    if (behavior.pagesVisited > 5) bonus += 2;
    else if (behavior.pagesVisited > 3) bonus += 1;
    
    // Return visits bonus
    if (behavior.returnVisits > 2) bonus += 3;
    else if (behavior.returnVisits > 0) bonus += 1;
    
    // Contact info bonus
    if (context.userInfo.email && context.userInfo.phone) bonus += 2;
    else if (context.userInfo.email || context.userInfo.phone) bonus += 1;
    
    return Math.min(bonus, 10);
  }

  private determineLevel(percentage: number): 'cold' | 'warm' | 'hot' {
    if (percentage >= 70) return 'hot';
    if (percentage >= 40) return 'warm';
    return 'cold';
  }

  private generateRecommendations(level: string, industry: string, context: ScoringContext): string[] {
    const recommendations: string[] = [];
    
    switch (level) {
      case 'hot':
        recommendations.push("🔥 Lead fierbinte - contactează imediat!");
        if (industry === 'coaching') {
          recommendations.push("Oferă call gratuit de strategie");
          recommendations.push("Trimite ofertă personalizată");
        } else if (industry === 'clinics') {
          recommendations.push("Programează consultația urgent");
          recommendations.push("Oferă discount pentru programare rapidă");
        } else if (industry === 'ecommerce') {
          recommendations.push("Oferă discount pentru cumpărare imediată");
          recommendations.push("Trimite link direct la checkout");
        }
        break;
        
      case 'warm':
        recommendations.push("🌡️ Lead cald - urmărește în 24-48h");
        recommendations.push("Trimite conținut educațional relevant");
        recommendations.push("Programează follow-up automat");
        break;
        
      case 'cold':
        recommendations.push("❄️ Lead rece - păstrează în nurture flow");
        recommendations.push("Trimite secvență educațională");
        recommendations.push("Re-engage după 7 zile");
        break;
    }
    
    return recommendations;
  }

  private getFactorDescription(factor: string, industry: string): string {
    const descriptions = {
      coaching: {
        experience: "Experiența cu Amazon",
        budget: "Buget disponibil",
        timeline: "Urgența lansării",
        engagement: "Nivel de engagement",
        contact: "Informații de contact"
      },
      clinics: {
        urgency: "Urgența serviciului",
        service: "Tipul de serviciu",
        history: "Istoricul cu clinica",
        contact: "Informații de contact",
        engagement: "Nivel de engagement"
      },
      ecommerce: {
        budget: "Buget disponibil",
        urgency: "Urgența cumpărării",
        category: "Categoria de interes",
        engagement: "Nivel de engagement",
        contact: "Informații de contact"
      }
    };
    
    return descriptions[industry as keyof typeof descriptions][factor as keyof typeof descriptions[typeof industry]] || factor;
  }
}
