export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  benefits: string;
  link: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  image?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  industry: string;
  serviceType: string;
  projectSize: string;
  image: string;
  challenge: string;
  solution: string;
  techStack: string[];
  results: string[];
  clientReview?: {
    content: string;
    author: string;
    rating: number;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface AdvancedFormData {
  // Step 1: Business Basics
  companyName: string;
  industry: string;
  businessStage: string;
  currentChallenges: string;
  
  // Step 2: Project Details
  serviceType: string;
  desiredFeatures: string[];
  techPreferences: string;
  
  // Step 3: Timeline & Budget
  preferredStartDate: string;
  targetCompletionDate: string;
  budgetRange: string;
  additionalNotes: string;
}

export type Theme = 'light' | 'dark' | 'system';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: string;
  suggestions?: string[];
  structuredData?: {
    type: 'serviceList';
    items: { title: string; link: string }[];
  } | {
    type: 'faq';
    items: { question: string }[];
  };
  feedback?: 'positive' | 'negative' | null;
}
