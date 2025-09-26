// src/bots/industries/ecommerce/flow.ts - Flow complet pentru E-commerce & Retail
export interface EcommerceContext {
  sessionId: string;
  userInfo: {
    name?: string;
    phone?: string;
    email?: string;
  };
  responses: {
    [key: string]: string;
  };
  segment?: 'lead_fierbinte' | 'nurture_flow';
  category?: string;
  budget?: string;
  urgency?: 'urgent' | 'normal' | 'flexibil';
  score: number;
  currentStep: string;
  cart?: {
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
    }>;
    total: number;
    abandoned: boolean;
  };
  recommendations?: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
    matchScore: number;
  }>;
}

export interface EcommerceResponse {
  message: string;
  nextStep: string;
  segment?: string;
  recommendations?: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
    matchScore: number;
  }>;
  cart?: {
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
    }>;
    total: number;
  };
  context: EcommerceContext;
}

export class EcommerceFlow {
  private steps = {
    welcome: {
      message: "👋 Salut! Îți pot recomanda cel mai potrivit produs. Răspunde la câteva întrebări:",
      nextStep: "q1_category"
    },
    q1_category: {
      question: "Ce categorie te interesează?",
      options: ["Fashion", "Accesorii", "Home & Living", "Altceva"],
      nextStep: "q2_budget"
    },
    q2_budget: {
      question: "Care este bugetul tău aproximativ?",
      options: ["<50€", "50–200€", ">200€"],
      nextStep: "q3_urgency"
    },
    q3_urgency: {
      question: "Când plănuiești să cumperi?",
      options: ["Azi / în 48h", "În 1–2 săptămâni"],
      nextStep: {
        "Azi / în 48h": "segment_lead_fierbinte",
        "În 1–2 săptămâni": "segment_nurture_flow"
      }
    }
  };

  private segments = {
    lead_fierbinte: {
      message: "Perfect! Să îți găsesc produsele potrivite pentru tine.",
      priority: 'high',
      followUp: 'immediate'
    },
    nurture_flow: {
      message: "Perfect! Să îți găsesc produsele potrivite și să te țin la curent cu ofertele noastre.",
      priority: 'normal',
      followUp: 'nurture'
    }
  };

  private products = {
    "Fashion": {
      "<50€": [
        { id: "f1", name: "Tricou Premium", price: 29, image: "/products/tshirt.jpg", description: "Tricou 100% bumbac, design modern" },
        { id: "f2", name: "Jeans Clasic", price: 45, image: "/products/jeans.jpg", description: "Jeans skinny, culoare albastru" }
      ],
      "50–200€": [
        { id: "f3", name: "Bluză Elegantă", price: 89, image: "/products/blouse.jpg", description: "Bluză din mătase, perfectă pentru birou" },
        { id: "f4", name: "Costum Business", price: 150, image: "/products/suit.jpg", description: "Costum clasic, perfect pentru interviuri" }
      ],
      ">200€": [
        { id: "f5", name: "Rochie Designer", price: 299, image: "/products/dress.jpg", description: "Rochie de seară, design exclusiv" },
        { id: "f6", name: "Costum Premium", price: 450, image: "/products/premium-suit.jpg", description: "Costum din lână merino, croială italiană" }
      ]
    },
    "Accesorii": {
      "<50€": [
        { id: "a1", name: "Ceas Clasic", price: 35, image: "/products/watch.jpg", description: "Ceas cu mânecă din piele" },
        { id: "a2", name: "Geantă Casual", price: 42, image: "/products/bag.jpg", description: "Geantă din piele naturală" }
      ],
      "50–200€": [
        { id: "a3", name: "Ceas Smart", price: 120, image: "/products/smartwatch.jpg", description: "Ceas inteligent cu GPS" },
        { id: "a4", name: "Geantă Premium", price: 180, image: "/products/premium-bag.jpg", description: "Geantă din piele italiană" }
      ],
      ">200€": [
        { id: "a5", name: "Ceas Luxury", price: 350, image: "/products/luxury-watch.jpg", description: "Ceas mecanic, design exclusiv" },
        { id: "a6", name: "Geantă Designer", price: 500, image: "/products/designer-bag.jpg", description: "Geantă de lux, ediție limitată" }
      ]
    },
    "Home & Living": {
      "<50€": [
        { id: "h1", name: "Perne Decorative", price: 25, image: "/products/pillows.jpg", description: "Set de 2 perne, design modern" },
        { id: "h2", name: "Lampă LED", price: 40, image: "/products/lamp.jpg", description: "Lampă cu LED, control wireless" }
      ],
      "50–200€": [
        { id: "h3", name: "Canapea Modulară", price: 150, image: "/products/sofa.jpg", description: "Canapea 3 locuri, tapitată" },
        { id: "h4", name: "Masa de Mâncat", price: 180, image: "/products/table.jpg", description: "Masă din lemn masiv, 6 locuri" }
      ],
      ">200€": [
        { id: "h5", name: "Sistem Audio", price: 350, image: "/products/speakers.jpg", description: "Sistem audio wireless, calitate studio" },
        { id: "h6", name: "Frigider Smart", price: 800, image: "/products/fridge.jpg", description: "Frigider cu tehnologie smart" }
      ]
    }
  };

  async handleStep(context: EcommerceContext, userResponse?: string): Promise<EcommerceResponse> {
    const currentStep = context.currentStep || 'welcome';
    
    switch (currentStep) {
      case 'welcome':
        return this.handleWelcome(context);
      
      case 'q1_category':
        return this.handleQ1Category(context, userResponse!);
      
      case 'q2_budget':
        return this.handleQ2Budget(context, userResponse!);
      
      case 'q3_urgency':
        return this.handleQ3Urgency(context, userResponse!);
      
      case 'recommendations':
        return this.handleRecommendations(context, userResponse!);
      
      case 'cart_abandoned':
        return this.handleCartAbandoned(context);
      
      default:
        return this.handleWelcome(context);
    }
  }

  private handleWelcome(context: EcommerceContext): EcommerceResponse {
    return {
      message: this.steps.welcome.message,
      nextStep: 'q1_category',
      context: {
        ...context,
        currentStep: 'q1_category'
      }
    };
  }

  private handleQ1Category(context: EcommerceContext, response: string): EcommerceResponse {
    const updatedContext = {
      ...context,
      responses: {
        ...context.responses,
        q1_category: response
      },
      category: response,
      currentStep: 'q2_budget'
    };

    return {
      message: this.steps.q2_budget.question,
      nextStep: 'q2_budget',
      context: updatedContext
    };
  }

  private handleQ2Budget(context: EcommerceContext, response: string): EcommerceResponse {
    const updatedContext = {
      ...context,
      responses: {
        ...context.responses,
        q2_budget: response
      },
      budget: response,
      currentStep: 'q3_urgency'
    };

    return {
      message: this.steps.q3_urgency.question,
      nextStep: 'q3_urgency',
      context: updatedContext
    };
  }

  private handleQ3Urgency(context: EcommerceContext, response: string): EcommerceResponse {
    const updatedContext = {
      ...context,
      responses: {
        ...context.responses,
        q3_urgency: response
      },
      urgency: response === 'Azi / în 48h' ? 'urgent' : 'normal',
      segment: response === 'Azi / în 48h' ? 'lead_fierbinte' : 'nurture_flow',
      currentStep: 'recommendations'
    };

    const segmentData = this.segments[updatedContext.segment!];

    return {
      message: `${segmentData.message}\n\nSă îți găsesc produsele potrivite...`,
      nextStep: 'recommendations',
      segment: updatedContext.segment,
      context: updatedContext
    };
  }

  private handleRecommendations(context: EcommerceContext, userResponse?: string): EcommerceResponse {
    const category = context.category || 'Fashion';
    const budget = context.budget || '<50€';
    
    const categoryProducts = this.products[category as keyof typeof this.products];
    const budgetProducts = categoryProducts[budget as keyof typeof categoryProducts];
    
    // Generate recommendations with match scores
    const recommendations = budgetProducts.map(product => ({
      ...product,
      matchScore: this.calculateMatchScore(product, context)
    })).sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);

    const updatedContext = {
      ...context,
      recommendations,
      currentStep: 'product_selection'
    };

    let message = `🎯 **Produse recomandate pentru tine:**\n\n`;
    recommendations.forEach((product, index) => {
      message += `${index + 1}. **${product.name}** - ${product.price}€\n`;
      message += `   ${product.description}\n`;
      message += `   🎯 Match: ${Math.round(product.matchScore * 100)}%\n\n`;
    });
    message += `Răspunde cu numărul produsului dorit (ex: "1") sau "vezi toate" pentru mai multe opțiuni.`;

    return {
      message,
      nextStep: 'product_selection',
      recommendations,
      context: updatedContext
    };
  }

  private calculateMatchScore(product: any, context: EcommerceContext): number {
    let score = 0.5; // Base score
    
    // Budget match
    if (context.budget === '<50€' && product.price < 50) score += 0.3;
    else if (context.budget === '50–200€' && product.price >= 50 && product.price <= 200) score += 0.3;
    else if (context.budget === '>200€' && product.price > 200) score += 0.3;
    
    // Urgency bonus
    if (context.urgency === 'urgent') score += 0.2;
    
    return Math.min(score, 1.0);
  }

  private handleCartAbandoned(context: EcommerceContext): EcommerceResponse {
    const cart = context.cart;
    if (!cart || !cart.abandoned) {
      return this.handleWelcome(context);
    }

    const updatedContext = {
      ...context,
      currentStep: 'cart_recovery'
    };

    let message = `🛒 **Ai uitat ceva în coș!**\n\n`;
    cart.items.forEach(item => {
      message += `• ${item.name} - ${item.price}€ x${item.quantity}\n`;
    });
    message += `\n💰 **Total: ${cart.total}€**\n\n`;
    message += `⏰ **Ofertă limitată:** -10% dacă finalizezi comanda în următoarele 24h!\n\n`;
    message += `🔗 [Finalizează comanda acum](${this.generateCheckoutLink(cart)})`;

    return {
      message,
      nextStep: 'cart_recovery',
      cart,
      context: updatedContext
    };
  }

  private generateCheckoutLink(cart: any): string {
    const items = cart.items.map((item: any) => `${item.id}:${item.quantity}`).join(',');
    return `/checkout?items=${encodeURIComponent(items)}&discount=10`;
  }
}
