// Centralized logging utility for the application

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  private log(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${this.context.toUpperCase()}] ${message}`;
    
    if (context) {
      console[level](logMessage, context);
    } else {
      console[level](logMessage);
    }
  }

  debug(message: string, context?: LogContext) {
    this.log('debug', message, context);
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
  }

  error(message: string, context?: LogContext) {
    this.log('error', message, context);
  }

  // For tracking user actions
  action(action: string, context?: LogContext) {
    this.log('info', `ACTION: ${action}`, context);
  }

  // For tracking API calls
  api(method: string, endpoint: string, context?: LogContext) {
    this.log('info', `API: ${method} ${endpoint}`, context);
  }

  // For tracking component lifecycle
  lifecycle(event: string, component?: string, context?: LogContext) {
    const comp = component || this.context;
    this.log('debug', `LIFECYCLE: ${comp} - ${event}`, context);
  }
}

// Factory function to create loggers
export const createLogger = (context: string) => new Logger(context);

// Common loggers for different parts of the app
export const authLogger = createLogger('auth');
export const billingLogger = createLogger('billing');
export const dbLogger = createLogger('database');
export const apiLogger = createLogger('api');
export const uiLogger = createLogger('ui');