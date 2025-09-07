import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Demo from "./pages/Demo";
import Product from "./pages/Product";
import HowItWorks from "./pages/HowItWorks";
import Pricing from "./pages/Pricing";
import PricingComplete from "./pages/PricingComplete";
import Security from "./pages/Security";
import NotFound from "./pages/NotFound";
import { createLogger } from "@/utils/logger";
import { useAuthLogger } from "@/hooks/useAuthLogger";
import ErrorBoundary from "@/components/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        const logger = createLogger('react-query');
        logger.error('Query failure', { 
          failureCount, 
          error: error?.message,
          maxRetries: 3 
        });
        return failureCount < 3;
      },
    },
    mutations: {
      retry: (failureCount, error: any) => {
        const logger = createLogger('react-query');
        logger.error('Mutation failure', { 
          failureCount, 
          error: error?.message,
          maxRetries: 1 
        });
        return failureCount < 1;
      },
    },
  },
});

// Router component with logging
function AppWithLogging() {
  const logger = createLogger('app-router');
  useAuthLogger();
  
  logger.lifecycle('router-render');
  
  return (
    <Routes>
      {/* Marketing pages */}
      <Route path="/" element={<Index />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/pricing/complete" element={<PricingComplete />} />
      <Route path="/product" element={<Product />} />
      <Route path="/security" element={<Security />} />
      <Route path="/demo" element={<Demo />} />
      
      {/* Auth flow */}
      <Route path="/auth" element={<Auth />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      
      {/* App pages */}
      <Route path="/app/onboarding" element={<Onboarding />} />
      <Route path="/app" element={<Dashboard />} />
      
      {/* Legacy dashboard route */}
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function AppRouter() {
  const logger = createLogger('app-root');
  
  logger.info('Application starting', {
    userAgent: navigator.userAgent,
    url: window.location.href,
    timestamp: new Date().toISOString()
  });

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppWithLogging />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default AppRouter;
