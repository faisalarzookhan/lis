type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private logQueue: LogEntry[] = [];
  private batchSize = 10;
  private flushInterval = 30000; // 30 seconds

  constructor() {
    // Flush logs periodically
    if (typeof window !== 'undefined') {
      setInterval(() => this.flush(), this.flushInterval);
    }
  }

  private createLogEntry(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      userId: this.getUserId(),
      sessionId: this.getSessionId(),
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
    };
  }

  private getUserId(): string | undefined {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('user_id') || undefined;
    }
    return undefined;
  }

  private getSessionId(): string | undefined {
    if (typeof window !== 'undefined') {
      let sessionId = sessionStorage.getItem('session_id');
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('session_id', sessionId);
      }
      return sessionId;
    }
    return undefined;
  }

  private async sendToServer(logEntry: LogEntry) {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_type: `log_${logEntry.level}`,
          event_data: {
            message: logEntry.message,
            data: logEntry.data,
            url: logEntry.url,
            userAgent: logEntry.userAgent,
          },
          session_id: logEntry.sessionId,
        }),
      });
    } catch (error) {
      if (this.isDevelopment) {
        console.error('Failed to send log to server:', error);
      }
    }
  }

  private async flush() {
    if (this.logQueue.length === 0) return;

    const logsToSend = this.logQueue.splice(0);
    await Promise.all(logsToSend.map(log => this.sendToServer(log)));
  }

  debug(message: string, data?: any) {
    const entry = this.createLogEntry('debug', message, data);
    if (this.isDevelopment) {
      console.debug(`[${entry.timestamp}] DEBUG:`, message, data);
    }
    this.logQueue.push(entry);
    if (this.logQueue.length >= this.batchSize) {
      this.flush();
    }
  }

  info(message: string, data?: any) {
    const entry = this.createLogEntry('info', message, data);
    if (this.isDevelopment) {
      console.info(`[${entry.timestamp}] INFO:`, message, data);
    }
    this.logQueue.push(entry);
    if (this.logQueue.length >= this.batchSize) {
      this.flush();
    }
  }

  warn(message: string, data?: any) {
    const entry = this.createLogEntry('warn', message, data);
    console.warn(`[${entry.timestamp}] WARN:`, message, data);
    this.logQueue.push(entry);
    this.flush();
  }

  error(message: string, error?: Error | any) {
    const entry = this.createLogEntry('error', message, {
      error: error?.message || error,
      stack: error?.stack,
    });
    console.error(`[${entry.timestamp}] ERROR:`, message, error);
    this.logQueue.push(entry);
    this.flush();
  }

  trackEvent(eventType: string, data?: any) {
    const entry = this.createLogEntry('info', `Event: ${eventType}`, data);
    this.logQueue.push(entry);
    if (this.logQueue.length >= this.batchSize) {
      this.flush();
    }
  }
}

export const logger = new Logger();

// Global error handler
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    logger.error('Global error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    logger.error('Unhandled promise rejection', {
      reason: event.reason,
    });
  });
}
