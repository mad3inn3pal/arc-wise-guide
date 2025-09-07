import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { createLogger } from '@/utils/logger';
import { PerformanceMonitor } from '@/utils/performance';

export const usePageLogger = (pageName?: string) => {
  const location = useLocation();
  const logger = createLogger('page-navigation');

  useEffect(() => {
    const currentPage = pageName || location.pathname;
    
    logger.action('page-visit', {
      page: currentPage,
      pathname: location.pathname,
      search: location.search,
      timestamp: new Date().toISOString(),
      referrer: document.referrer,
      userAgent: navigator.userAgent
    });

    // Log performance metrics
    PerformanceMonitor.logPageLoad();
    PerformanceMonitor.logMemoryUsage();

    // Track page leave
    const handleBeforeUnload = () => {
      logger.action('page-leave', {
        page: currentPage,
        pathname: location.pathname,
        timeSpent: Date.now() - performance.now()
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location, logger, pageName]);

  return { logger };
};