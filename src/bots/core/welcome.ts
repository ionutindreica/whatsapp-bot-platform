// src/bots/core/welcome.ts - Core welcome flow pentru toate industriile
export interface WelcomeContext {
  industry: 'coaching' | 'clinics' | 'ecommerce';
  userInfo: {
    name?: string;
    phone?: string;
    email?: string;
  };
  sessionId: string;
}

export interface WelcomeResponse {
  message: string;
  nextStep: 'qualify' | 'segment' | 'offer';
  context: WelcomeContext;
}

export class CoreWelcome {
  private industryMessages = {
    coaching: {
      greeting: "👋 Salut! Vrei să lansezi un business pe Amazon?",
      intro: "Sunt aici să te ajut să construiești un business profitabil pe Amazon. Să începem cu câteva întrebări simple!",
      cta: "Spune-mi, ce obiectiv ai cu Amazon?"
    },
    clinics: {
      greeting: "👋 Salut! Vrei să afli ce tratament ți se potrivește?",
      intro: "Sunt aici să te ajut să găsești soluția perfectă pentru nevoile tale de sănătate. Să începem!",
      cta: "Spune-mi, ce problemă vrei să rezolvi?"
    },
    ecommerce: {
      greeting: "👋 Salut! Cauți un produs anume?",
      intro: "Sunt aici să te ajut să găsești exact ce cauți. Să începem cu câteva întrebări!",
      cta: "Spune-mi, ce produs cauți?"
    }
  };

  async handleWelcome(context: WelcomeContext): Promise<WelcomeResponse> {
    const industry = context.industry;
    const messages = this.industryMessages[industry];

    return {
      message: `${messages.greeting}\n\n${messages.intro}\n\n${messages.cta}`,
      nextStep: 'qualify',
      context: {
        ...context,
        userInfo: {
          ...context.userInfo,
          // Capture basic info if available
        }
      }
    };
  }

  async captureLeadInfo(context: WelcomeContext, userResponse: string): Promise<WelcomeContext> {
    // Extract basic info from user response
    const emailMatch = userResponse.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    const phoneMatch = userResponse.match(/(\+?[0-9\s\-\(\)]{10,})/);

    return {
      ...context,
      userInfo: {
        ...context.userInfo,
        email: emailMatch ? emailMatch[1] : context.userInfo.email,
        phone: phoneMatch ? phoneMatch[1] : context.userInfo.phone,
      }
    };
  }
}
