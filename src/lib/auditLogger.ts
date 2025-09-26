import { supabase } from './supabaseClient';

export interface AuditLogEntry {
  action: string;
  entity: string;
  entityId?: string;
  userId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

class AuditLogger {
  private static instance: AuditLogger;
  private logQueue: AuditLogEntry[] = [];
  private isProcessing = false;

  private constructor() {}

  static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  /**
   * Log an audit event
   */
  async log(entry: AuditLogEntry): Promise<void> {
    // Add timestamp and basic context
    const logEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
      ipAddress: this.getClientIP(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
    };

    // Add to queue for batch processing
    this.logQueue.push(logEntry);

    // Process queue if not already processing
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  /**
   * Log admin action
   */
  async logAdminAction(
    action: string,
    entity: string,
    entityId?: string,
    details?: Record<string, any>
  ): Promise<void> {
    await this.log({
      action,
      entity,
      entityId,
      details,
    });
  }

  /**
   * Log user action
   */
  async logUserAction(
    action: string,
    userId: string,
    details?: Record<string, any>
  ): Promise<void> {
    await this.log({
      action,
      entity: 'user',
      entityId: userId,
      userId,
      details,
    });
  }

  /**
   * Log security event
   */
  async logSecurityEvent(
    action: string,
    details: Record<string, any>
  ): Promise<void> {
    await this.log({
      action,
      entity: 'security',
      details,
    });
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.logQueue.length === 0) return;

    this.isProcessing = true;

    try {
      const entries = [...this.logQueue];
      this.logQueue = [];

      // In a real implementation, you might want to send to a logging service
      // For now, we'll just log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Audit Logs:', entries);
      }

      // TODO: Implement actual database logging
      // This would require adding an audit_logs table to the database
      /*
      const { error } = await supabase
        .from('audit_logs')
        .insert(entries);

      if (error) {
        console.error('Failed to save audit logs:', error);
        // Re-queue failed entries
        this.logQueue.unshift(...entries);
      }
      */

    } catch (error) {
      console.error('Error processing audit log queue:', error);
      this.isProcessing = false;
      return;
    }

    this.isProcessing = false;

    // Process any new entries that were added while processing
    if (this.logQueue.length > 0) {
      setTimeout(() => this.processQueue(), 100);
    }
  }

  private getClientIP(): string | undefined {
    // This is a simplified implementation
    // In a real app, you'd get this from the request headers
    return undefined;
  }
}

export const auditLogger = AuditLogger.getInstance();

// Convenience functions
export const logAdminAction = auditLogger.logAdminAction.bind(auditLogger);
export const logUserAction = auditLogger.logUserAction.bind(auditLogger);
export const logSecurityEvent = auditLogger.logSecurityEvent.bind(auditLogger);
