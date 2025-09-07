import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight, Loader2 } from "lucide-react";
import { useBilling } from "@/hooks/useBilling";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { createLogger } from "@/utils/logger";

const PricingComplete = () => {
  const logger = createLogger('pricing-complete');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { plan: currentPlan, isLoading } = useBilling();
  const [isProcessing, setIsProcessing] = useState(true);

  const sessionId = searchParams.get('session_id');
  const returnTo = searchParams.get('returnTo');

  logger.lifecycle('component-mounted', 'PricingComplete', {
    sessionId,
    returnTo,
    hasCurrentPlan: !!currentPlan,
    isLoading
  });

  useEffect(() => {
    logger.lifecycle('effect-start', 'payment-verification', { sessionId });
    
    if (!sessionId) {
      logger.warn('No session ID found, redirecting to pricing', { sessionId });
      navigate('/pricing');
      return;
    }

    const verifyPayment = async () => {
      logger.info('Starting payment verification', { sessionId });
      
      try {
        setIsProcessing(true);
        logger.api('POST', 'verify-payment', { sessionId });
        
        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: { session_id: sessionId }
        });

        if (error) {
          logger.error('Supabase function invocation error', { error, sessionId });
          throw error;
        }

        logger.info('Payment verification response received', { data, sessionId });

        if (data?.success) {
          logger.info('Payment verification successful', { 
            plan: data.plan, 
            billing_cycle: data.billing_cycle,
            sessionId 
          });
          
          toast({
            title: "Payment Successful!",
            description: `Your plan has been upgraded to ${data.plan}.`,
          });
          
          logger.action('payment-verified-successfully', { 
            plan: data.plan,
            sessionId,
            returnTo 
          });
          
          // Invalidate billing queries to refresh plan data
          window.location.reload(); // Force refresh to get latest data
        } else {
          logger.error('Payment verification failed - success false', { 
            data,
            sessionId 
          });
          throw new Error('Payment verification failed');
        }
      } catch (error: any) {
        logger.error('Payment verification error', { 
          error: error.message,
          stack: error.stack,
          sessionId,
          errorType: error.constructor.name
        });
        
        toast({
          title: "Verification Error",
          description: "There was an issue verifying your payment. Please contact support.",
          variant: "destructive"
        });
      } finally {
        logger.info('Payment verification process completed', { sessionId });
        setIsProcessing(false);
      }
    };

    verifyPayment();
  }, [sessionId, navigate, toast, logger]);

  const handleContinue = () => {
    logger.action('continue-button-clicked', { returnTo });
    
    if (returnTo) {
      logger.info('Redirecting to returnTo URL', { returnTo });
      window.location.href = returnTo;
    } else {
      logger.info('Navigating to dashboard');
      navigate('/app');
    }
  };

  if (isLoading || isProcessing) {
    logger.debug('Showing loading state', { isLoading, isProcessing });
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-semibold mb-2">Processing your payment...</h2>
            <p className="text-muted-foreground">
              Please wait while we confirm your subscription.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  logger.info('Rendering success state', { 
    currentPlan: currentPlan?.plan,
    billing_cycle: currentPlan?.billing_cycle 
  });

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
      <Card className="w-full max-w-md mx-4 shadow-elevated">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-success-light rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-success" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Thank you for upgrading to our {currentPlan?.plan || 'premium'} plan.
            </p>
            
            {currentPlan && (
              <div className="space-y-2">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {currentPlan.plan.charAt(0).toUpperCase() + currentPlan.plan.slice(1)} Plan
                </Badge>
                <div className="text-sm text-muted-foreground">
                  <p>{currentPlan.included} submissions/month included</p>
                  <p>${currentPlan.overage_rate} per extra submission</p>
                  <p>
                    {currentPlan.seats.limit 
                      ? `${currentPlan.seats.limit} board seats` 
                      : 'Unlimited board seats'
                    }
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleContinue} 
              className="w-full"
              size="lg"
            >
              {returnTo?.includes('invites') ? 'Continue to Invite Members' : 'Go to Dashboard'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              className="w-full"
            >
              <Link to="/pricing">
                View All Plans
              </Link>
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              You will receive a receipt via email shortly.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingComplete;