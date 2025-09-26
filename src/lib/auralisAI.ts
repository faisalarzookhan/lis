import { createClient } from '@supabase/supabase-js';
import { ChatContext, IntentDetection, EscalationData } from '../types/chat';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface KnowledgeItem {
  content: string;
  category: string;
}

// Enhanced AI Response Generator with Auralis Protocol
export class AuralisAI {
  private knowledgeBase: KnowledgeItem[] = [];
  private context: ChatContext | null = null;
  private messageHistory: string[] = [];
  private intentHistory: IntentDetection[] = [];

  async loadKnowledgeBase() {
    if (this.knowledgeBase.length === 0) {
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('content, category');
      if (!error && data) {
        this.knowledgeBase = data;
      }
    }
    return this.knowledgeBase;
  }

  setContext(context: ChatContext) {
    this.context = context;
  }

  addToHistory(message: string, intent?: IntentDetection) {
    this.messageHistory.push(message);
    if (intent) this.intentHistory.push(intent);
  }

  // Phase 1: Intent Detection & Analysis
  detectIntent(message: string): IntentDetection {
    const lowerMessage = message.toLowerCase();

    const intents = [
      { keywords: ['pricing', 'cost', 'fee', 'price', 'budget', 'quote'], intent: 'pricing', actions: ['Show pricing tiers', 'Schedule consultation', 'Compare plans'] },
      { keywords: ['service', 'offer', 'provide', 'do'], intent: 'services', actions: ['View services', 'Get portfolio', 'Contact for custom solution'] },
      { keywords: ['portfolio', 'work', 'project', 'case study'], intent: 'portfolio', actions: ['Browse portfolio', 'View case studies', 'See testimonials'] },
      { keywords: ['contact', 'reach', 'email', 'phone', 'call'], intent: 'contact', actions: ['View contact info', 'Fill contact form', 'Schedule meeting'] },
      { keywords: ['about', 'company', 'team', 'who'], intent: 'about', actions: ['Learn about us', 'Meet the team', 'View testimonials'] },
      { keywords: ['faq', 'question', 'help', 'support'], intent: 'faq', actions: ['Browse FAQ', 'Search knowledge base', 'Contact support'] },
      { keywords: ['demo', 'trial', 'test', 'try'], intent: 'demo', actions: ['Schedule demo', 'Request trial', 'View product tour'] },
      { keywords: ['integration', 'api', 'connect', 'sync'], intent: 'integration', actions: ['View integrations', 'API documentation', 'Setup guide'] },
    ];

    for (const intentData of intents) {
      if (intentData.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return {
          intent: intentData.intent,
          confidence: 0.8,
          entities: intentData.keywords.filter(k => lowerMessage.includes(k)),
          suggestedActions: intentData.actions
        };
      }
    }

    return {
      intent: 'general',
      confidence: 0.5,
      entities: [],
      suggestedActions: ['Explore services', 'View portfolio', 'Contact us']
    };
  }

  // Phase 2: Contextual Welcome Messages
  generateContextualWelcome(currentPage: string = '/'): { message: string; suggestions: string[] } {
    const page = currentPage.toLowerCase();

    if (page.includes('/pricing')) {
      return {
        message: "Welcome to our Pricing page! I'm Auralis from Limitless Infotech. Our pricing is customized based on your needs. Most users ask about plan differences—would you like a quick comparison or help choosing the right tier?",
        suggestions: ['Compare pricing plans', 'Get a custom quote', 'See pricing FAQ']
      };
    }

    if (page.includes('/services')) {
      return {
        message: "Exploring our Services? Hi, I'm Auralis! We offer web development, mobile apps, custom software, CRM, and AI automation. Which service interests you most?",
        suggestions: ['Web Development details', 'Mobile App services', 'Custom Software solutions']
      };
    }

    if (page.includes('/portfolio')) {
      return {
        message: "Checking out our Portfolio? Welcome! I'm Auralis. We've delivered 120+ projects across education, finance, healthcare, and technology. Want to see projects in a specific industry?",
        suggestions: ['Education projects', 'Finance solutions', 'Healthcare tech']
      };
    }

    if (page.includes('/contact')) {
      return {
        message: "Ready to get in touch? Hi, I'm Auralis! We love hearing from potential clients. Our team typically responds within 2 hours. How can we help transform your business?",
        suggestions: ['Schedule a consultation', 'Request a quote', 'General inquiry']
      };
    }

    if (page.includes('/about')) {
      return {
        message: "Learning about Limitless Infotech? Hello, I'm Auralis! We're where innovation meets execution, serving 28K+ users with 98% client retention. Curious about our team or story?",
        suggestions: ['Meet our team', 'Company story', 'Client testimonials']
      };
    }

    // Default welcome
    return {
      message: "Hello! I'm Auralis, your AI assistant from Limitless Infotech. I see you're on our website—let me help you find what you need. What brings you here today?",
      suggestions: ['Explore services', 'View portfolio', 'Get pricing info']
    };
  }

  // Phase 3: Enhanced Response Generation
  async generateResponse(message: string, intent: IntentDetection): Promise<string> {
    await this.loadKnowledgeBase();

    const lowerMessage = message.toLowerCase();

    // Handle specific intents with enhanced responses
    switch (intent.intent) {
      case 'pricing': {
        if (lowerMessage.includes('starter') || lowerMessage.includes('basic')) {
          return "Our Starter package starts at $2,500 and includes a basic website with responsive design and SEO setup. It's perfect for small businesses getting started online. Would you like me to schedule a consultation to discuss your specific needs?";
        }
        if (lowerMessage.includes('professional') || lowerMessage.includes('advanced')) {
          return "The Professional package at $7,500 includes advanced website development, comprehensive SEO, analytics setup, and 24/7 support. It's ideal for growing businesses that need robust online presence. I can help you compare this with our other packages.";
        }
        if (lowerMessage.includes('enterprise') || lowerMessage.includes('custom')) {
          return "Our Enterprise solutions start at $15,000 and are fully customized to your business requirements. This includes custom software development, advanced integrations, and dedicated support. Let's discuss your project scope for a precise quote.";
        }
        return "Our pricing is customized based on your project scope and requirements. We offer three main tiers: Starter ($2,500+), Professional ($7,500+), and Enterprise ($15,000+). Each package can be tailored to your needs. What type of project are you interested in?";
      }

      case 'services': {
        if (lowerMessage.includes('web') || lowerMessage.includes('website')) {
          return "We specialize in modern web development using React, Next.js, and other cutting-edge technologies. Our websites are fast, responsive, and SEO-optimized. We can build anything from simple landing pages to complex e-commerce platforms. What kind of website do you need?";
        }
        if (lowerMessage.includes('mobile') || lowerMessage.includes('app')) {
          return "We develop native and cross-platform mobile apps for iOS and Android. Using React Native and Flutter, we create high-performance apps with great user experiences. Our mobile solutions include offline functionality, push notifications, and seamless integrations.";
        }
        if (lowerMessage.includes('ai') || lowerMessage.includes('automation')) {
          return "Our AI and automation solutions help businesses streamline operations and improve efficiency. We implement chatbots, predictive analytics, workflow automation, and intelligent data processing. Auralis, our AI assistant, is a great example of our AI capabilities!";
        }
        return "We offer comprehensive digital solutions including web development, mobile apps, custom software, CRM systems, AI automation, and digital marketing. Each service is tailored to your business goals. Which area interests you most?";
      }

      case 'portfolio': {
        if (lowerMessage.includes('education') || lowerMessage.includes('school')) {
          return "We've developed several education technology solutions, including learning management systems, student portals, and interactive educational platforms. One notable project was a comprehensive e-learning platform for a university with 10,000+ users. Would you like to see more education projects?";
        }
        if (lowerMessage.includes('finance') || lowerMessage.includes('bank')) {
          return "Our finance projects include secure banking applications, fintech platforms, and financial management systems. We prioritize security and compliance in all our financial solutions. We recently completed a digital banking platform that handles millions in transactions daily.";
        }
        if (lowerMessage.includes('healthcare') || lowerMessage.includes('medical')) {
          return "In healthcare, we've built patient management systems, telemedicine platforms, and health monitoring applications. All our healthcare solutions comply with HIPAA and other regulations. One project involved creating a comprehensive hospital management system.";
        }
        return "We've successfully delivered 120+ projects across education, finance, healthcare, e-commerce, and technology sectors. Our portfolio showcases our expertise in modern technologies and our commitment to quality. Would you like to explore projects in a specific industry?";
      }

      case 'contact':
        return "You can reach us through our contact form, email us at info@limitlessinfotech.com, or call us at +1 (555) 123-4567. Our team typically responds within 2 hours during business hours. We offer free initial consultations to discuss your project. How would you like to get in touch?";

      case 'about':
        return "Limitless Infotech is where innovation meets execution. Founded with a vision to transform businesses through technology, we've grown to serve 28K+ users with a 98% client retention rate. Our team combines technical expertise with business acumen to deliver exceptional results. Learn more about our story and values on our About page.";

      case 'faq':
        return "You can find answers to common questions in our FAQ section. We cover topics like our development process, pricing, timelines, support, and technical specifications. If you don't find what you're looking for, feel free to ask me directly!";

      case 'demo':
        return "We offer personalized demos tailored to your business needs. During a demo, we'll showcase relevant technologies, discuss your requirements, and demonstrate how our solutions can benefit your organization. Schedule a demo through our contact form or by calling us directly.";

      case 'integration':
        return "We provide seamless integrations with popular platforms including payment gateways, CRM systems, marketing tools, and enterprise software. Our API-first approach ensures smooth data flow and scalability. What systems do you need to integrate with?";

      default: {
        // Fallback to knowledge base search
        const relevantKnowledge = this.knowledgeBase.filter(item =>
          lowerMessage.includes(item.category.toLowerCase()) ||
          item.content.toLowerCase().includes(lowerMessage)
        );

        if (relevantKnowledge.length > 0) {
          return relevantKnowledge[0].content;
        }

        // Generic helpful response
        return "I'd be happy to help you learn more about Limitless Infotech and our services. We specialize in web development, mobile apps, AI automation, and digital transformation. What specific information are you looking for?";
      }
    }
  }

  // Phase 4: Complexity Detection & Escalation
  detectComplexity(message: string, messageCount: number): EscalationData | null {
    const lowerMessage = message.toLowerCase();

    // High priority triggers
    if (lowerMessage.includes('urgent') || lowerMessage.includes('emergency') || lowerMessage.includes('critical')) {
      return {
        reason: 'Urgent request detected',
        priority: 'high',
        contextSummary: `User reported urgent issue: "${message}". Message count: ${messageCount}`,
        userDetails: {}
      };
    }

    // Medium priority - complex technical issues
    if (lowerMessage.includes('error') || lowerMessage.includes('bug') || lowerMessage.includes('not working')) {
      return {
        reason: 'Technical issue reported',
        priority: 'medium',
        contextSummary: `Technical problem: "${message}". Session messages: ${messageCount}`,
        userDetails: {}
      };
    }

    // Medium priority - repeated questions
    if (messageCount > 5 && this.intentHistory.length > 2) {
      const recentIntents = this.intentHistory.slice(-3);
      const uniqueIntents = new Set(recentIntents.map(i => i.intent));
      if (uniqueIntents.size === 1) {
        return {
          reason: 'Repeated questions on same topic',
          priority: 'medium',
          contextSummary: `User has asked ${messageCount} messages, mostly about ${Array.from(uniqueIntents)[0]}`,
          userDetails: {}
        };
      }
    }

    return null;
  }

  // Phase 5: Proactive Suggestions
  generateProactiveSuggestions(intent: IntentDetection, context: ChatContext): string[] {
    const suggestions: string[] = [];

    switch (intent.intent) {
      case 'pricing':
        suggestions.push('Compare pricing plans', 'Schedule consultation', 'View pricing FAQ');
        break;
      case 'services':
        suggestions.push('View our portfolio', 'Schedule demo', 'Get custom quote');
        break;
      case 'portfolio':
        suggestions.push('View case studies', 'Contact for similar project', 'See testimonials');
        break;
      case 'contact':
        suggestions.push('Fill contact form', 'Call us directly', 'Schedule meeting');
        break;
      case 'about':
        suggestions.push('Meet our team', 'View company story', 'See client testimonials');
        break;
      default:
        suggestions.push('Explore services', 'View portfolio', 'Contact us');
    }

    // Add contextual suggestions based on page
    if (context?.currentPage) {
      const page = context.currentPage.toLowerCase();
      if (page.includes('/services')) {
        suggestions.unshift('Get detailed service info');
      } else if (page.includes('/portfolio')) {
        suggestions.unshift('Explore case studies');
      } else if (page.includes('/contact')) {
        suggestions.unshift('Schedule consultation');
      }
    }

    return suggestions.slice(0, 3); // Limit to 3 suggestions
  }
}
