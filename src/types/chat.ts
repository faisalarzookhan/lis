export interface ChatContext {
  currentPage: string;
  userAgent: string;
  referrer?: string;
  sessionStartTime: string;
  messageCount: number;
  lastActivity: string;
}

export interface IntentDetection {
  intent: string;
  confidence: number;
  entities: string[];
  suggestedActions: string[];
}

export interface EscalationData {
  reason: string;
  priority: 'low' | 'medium' | 'high';
  contextSummary: string;
  userDetails?: {
    name?: string;
    email?: string;
    accountId?: string;
  };
}

export interface FeedbackData {
  messageId: string;
  rating: 'positive' | 'negative';
  comment?: string;
  timestamp: string;
}
