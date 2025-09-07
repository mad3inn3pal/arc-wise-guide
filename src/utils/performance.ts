// Performance monitoring utilities

import { createLogger } from "./logger";

const perfLogger = createLogger('performance');

export class PerformanceMonitor {
  private static marks: Map<string, number> = new Map();

  static startMark(name: string) {
    const startTime = performance.now();
    this.marks.set(name, startTime);
    perfLogger.debug('Performance mark started', { name, startTime });
  }

  static endMark(name: string, context?: any) {
    const endTime = performance.now();
    const startTime = this.marks.get(name);
    
    if (startTime) {
      const duration = endTime - startTime;
      perfLogger.info('Performance mark completed', {
        name,
        duration,
        startTime,
        endTime,
        context
      });
      
      this.marks.delete(name);
      return duration;
    } else {
      perfLogger.warn('Performance mark not found', { name });
      return null;
    }
  }

  static measureFunction<T>(name: string, fn: () => T, context?: any): T {
    this.startMark(name);
    try {
      const result = fn();
      this.endMark(name, context);
      return result;
    } catch (error) {
      this.endMark(name, { ...context, error: (error as Error).message });
      throw error;
    }
  }

  static async measureAsyncFunction<T>(
    name: string, 
    fn: () => Promise<T>, 
    context?: any
  ): Promise<T> {
    this.startMark(name);
    try {
      const result = await fn();
      this.endMark(name, context);
      return result;
    } catch (error) {
      this.endMark(name, { ...context, error: (error as Error).message });
      throw error;
    }
  }

  static logPageLoad() {
    if (typeof window !== 'undefined' && window.performance) {
      const navTiming = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      perfLogger.info('Page load performance', {
        domContentLoaded: navTiming.domContentLoadedEventEnd - navTiming.domContentLoadedEventStart,
        loadComplete: navTiming.loadEventEnd - navTiming.loadEventStart,
        firstPaint: this.getFirstPaint(),
        firstContentfulPaint: this.getFirstContentfulPaint(),
        pageLoadTime: navTiming.loadEventEnd - navTiming.fetchStart
      });
    }
  }

  private static getFirstPaint(): number | null {
    const paintEntries = window.performance.getEntriesByType('paint');
    const fp = paintEntries.find(entry => entry.name === 'first-paint');
    return fp ? fp.startTime : null;
  }

  private static getFirstContentfulPaint(): number | null {
    const paintEntries = window.performance.getEntriesByType('paint');
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return fcp ? fcp.startTime : null;
  }

  static logMemoryUsage() {
    if (typeof window !== 'undefined' && (window.performance as any).memory) {
      const memory = (window.performance as any).memory;
      perfLogger.info('Memory usage', {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      });
    }
  }
}

// Hook for React components
export const usePerformanceMonitor = () => {
  return {
    startMark: PerformanceMonitor.startMark,
    endMark: PerformanceMonitor.endMark,
    measureFunction: PerformanceMonitor.measureFunction,
    measureAsyncFunction: PerformanceMonitor.measureAsyncFunction
  };
};