import { supabase } from './supabaseClient';

export interface AnalyticsEvent {
  event_type: string;
  event_data: Record<string, any>;
  page_url?: string;
  user_agent?: string;
  session_id?: string;
}

class Analytics {
  private sessionId: string;
  private events: AnalyticsEvent[] = [];
  private flushInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startFlushInterval();
  }

  private generateSessionId(): string {
    if (typeof window !== 'undefined') {
      let sessionId = localStorage.getItem('analytics_session_id');
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem('analytics_session_id', sessionId);
      }
      return sessionId;
    }
    return 'server-session';
  }

  private startFlushInterval() {
    if (typeof window !== 'undefined') {
      this.flushInterval = setInterval(() => {
        this.flush();
      }, 30000); // Flush every 30 seconds
    }
  }

  private async flush() {
    if (this.events.length === 0) return;

    const eventsToSend = [...this.events];
    this.events = [];

    try {
      const { error } = await supabase
        .from('analytics_events')
        .insert(eventsToSend.map(event => ({
          event_type: event.event_type,
          event_data: event.event_data,
          page_url: event.page_url || window.location.href,
          user_agent: event.user_agent || navigator.userAgent,
          session_id: event.session_id || this.sessionId,
        })));

      if (error) {
        console.error('Analytics flush error:', error);
        // Re-queue events on failure
        this.events.unshift(...eventsToSend);
      }
    } catch (error) {
      console.error('Analytics flush error:', error);
      // Re-queue events on failure
      this.events.unshift(...eventsToSend);
    }
  }

  track(eventType: string, eventData: Record<string, any> = {}) {
    const event: AnalyticsEvent = {
      event_type: eventType,
      event_data: eventData,
      page_url: typeof window !== 'undefined' ? window.location.href : undefined,
      user_agent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
      session_id: this.sessionId,
    };

    this.events.push(event);

    // For immediate events like page views, flush immediately
    if (eventType === 'page_view') {
      this.flush();
    }
  }

  trackPageView(page: string) {
    this.track('page_view', { page });
  }

  trackUserInteraction(action: string, element: string, details?: Record<string, any>) {
    this.track('user_interaction', { action, element, ...details });
  }

  trackChatbotInteraction(message: string, response: string, sessionId: string) {
    this.track('chatbot_interaction', { message, response, session_id: sessionId });
  }

  trackFormSubmission(formType: string, success: boolean, details?: Record<string, any>) {
    this.track('form_submission', { form_type: formType, success, ...details });
  }

  trackError(error: Error, context?: Record<string, any>) {
    this.track('error', {
      message: error.message,
      stack: error.stack,
      ...context,
    });
  }

  destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    this.flush(); // Final flush
  }
}

// Singleton instance
let analyticsInstance: Analytics | null = null;

export const getAnalytics = (): Analytics => {
  if (!analyticsInstance) {
    analyticsInstance = new Analytics();
  }
  return analyticsInstance;
};

export const trackPageView = (page: string) => getAnalytics().trackPageView(page);
export const trackUserInteraction = (action: string, element: string, details?: Record<string, any>) =>
  getAnalytics().trackUserInteraction(action, element, details);
export const trackChatbotInteraction = (message: string, response: string, sessionId: string) =>
  getAnalytics().trackChatbotInteraction(message, response, sessionId);
export const trackFormSubmission = (formType: string, success: boolean, details?: Record<string, any>) =>
  getAnalytics().trackFormSubmission(formType, success, details);
export const trackError = (error: Error, context?: Record<string, any>) =>
  getAnalytics().trackError(error, context);
