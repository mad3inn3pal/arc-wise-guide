import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { billingLogger } from "@/utils/logger";

interface PlanData {
  plan: 'free' | 'starter' | 'growth' | 'pro';
  billing_cycle: 'monthly' | 'annual';
  status: 'active' | 'past_due' | 'canceled' | 'trialing';
  included: number;
  overage_rate: number;
  seats: {
    limit: number | null;
    used: number;
  };
  features: {
    OCR: boolean;
    LLM: boolean;
    MEETING: boolean;
    WEBHOOKS: boolean;
    SSO: boolean;
    INVITES: boolean;
  };
}

interface PreviewData {
  allowed: boolean;
  reason?: string;
  included?: number;
  overage_rate?: number;
  seat_limit?: number | null;
  features?: Record<string, boolean>;
}

interface ChangeData {
  unchanged?: boolean;
  changed?: boolean;
  plan?: string;
  redirect?: string | null;
}

export const useBilling = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  billingLogger.lifecycle('hook-initialized', 'useBilling');

  const fetchPlan = async (): Promise<PlanData> => {
    console.log('[BILLING-HOOK] Fetching plan data');
    const { data, error } = await supabase.functions.invoke('billing-api', {
      body: { action: 'get-plan' },
    });
    
    if (error) {
      console.error('[BILLING-HOOK] Error fetching plan:', error);
      throw error;
    }
    console.log('[BILLING-HOOK] Plan data received:', data);
    return data;
  };

  const previewPlanChange = async ({ plan, billing_cycle }: { plan: string; billing_cycle?: string }): Promise<PreviewData> => {
    console.log('[BILLING-HOOK] Previewing plan change:', { plan, billing_cycle });
    const { data, error } = await supabase.functions.invoke('billing-api', {
      body: { action: 'preview-plan', plan, billing_cycle },
    });
    
    if (error) {
      console.error('[BILLING-HOOK] Error previewing plan change:', error);
      throw error;
    }
    console.log('[BILLING-HOOK] Plan preview result:', data);
    return data;
  };

  const checkout = async ({ plan, billing_cycle, returnTo }: { plan: string; billing_cycle?: string; returnTo?: string }): Promise<{ url: string }> => {
    const idempotencyKey = crypto.randomUUID();
    console.log('[BILLING-HOOK] Starting checkout:', { plan, billing_cycle, returnTo, idempotencyKey });
    const { data, error } = await supabase.functions.invoke('billing-api', {
      body: { action: 'checkout', plan, billing_cycle, returnTo },
      headers: { 'Idempotency-Key': idempotencyKey },
    });
    
    if (error) {
      console.error('[BILLING-HOOK] Checkout error:', error);
      throw error;
    }
    console.log('[BILLING-HOOK] Checkout successful, redirect URL:', data.url);
    return data;
  };

  const changePlan = async ({ plan, billing_cycle, returnTo }: { plan: string; billing_cycle?: string; returnTo?: string }): Promise<ChangeData> => {
    const idempotencyKey = crypto.randomUUID();
    console.log('[BILLING-HOOK] Changing plan:', { plan, billing_cycle, returnTo, idempotencyKey });
    const { data, error } = await supabase.functions.invoke('billing-api', {
      body: { action: 'change-plan', plan, billing_cycle, returnTo },
      headers: { 'Idempotency-Key': idempotencyKey },
    });
    
    if (error) {
      console.error('[BILLING-HOOK] Plan change error:', error);
      throw error;
    }
    console.log('[BILLING-HOOK] Plan change result:', data);
    return data;
  };

  const planQuery = useQuery({
    queryKey: ['billing-plan'],
    queryFn: fetchPlan,
  });

  const previewMutation = useMutation({
    mutationFn: previewPlanChange,
  });

  const checkoutMutation = useMutation({
    mutationFn: checkout,
    onSuccess: (data) => {
      console.log('[BILLING-HOOK] Checkout mutation success, redirecting to:', data.url);
      // Redirect to Stripe checkout
      window.open(data.url, '_blank');
    },
    onError: (error: any) => {
      console.error('[BILLING-HOOK] Checkout mutation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to start checkout",
        variant: "destructive",
      });
    },
  });

  const changeMutation = useMutation({
    mutationFn: changePlan,
    onSuccess: (data) => {
      console.log('[BILLING-HOOK] Change plan mutation success:', data);
      if (data.changed) {
        toast({
          title: "Plan Updated",
          description: `Successfully upgraded to ${data.plan}`,
        });
        console.log('[BILLING-HOOK] Invalidating billing plan queries');
        // Invalidate queries to refresh the data
        queryClient.invalidateQueries({ queryKey: ['billing-plan'] });
      }
    },
    onError: (error: any) => {
      console.error('[BILLING-HOOK] Change plan mutation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to change plan",
        variant: "destructive",
      });
    },
  });

  return {
    plan: planQuery.data,
    isLoading: planQuery.isLoading,
    error: planQuery.error,
    previewPlanChange: previewMutation.mutateAsync,
    changePlan: changeMutation.mutateAsync,
    checkout: checkoutMutation.mutateAsync,
    isChanging: changeMutation.isPending,
    isCheckingOut: checkoutMutation.isPending,
  };
};