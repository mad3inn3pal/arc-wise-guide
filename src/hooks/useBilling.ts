import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

  const fetchPlan = async (): Promise<PlanData> => {
    const { data, error } = await supabase.functions.invoke('billing-api', {
      body: { action: 'get-plan' },
    });
    
    if (error) throw error;
    return data;
  };

  const previewPlanChange = async ({ plan, billing_cycle }: { plan: string; billing_cycle?: string }): Promise<PreviewData> => {
    const { data, error } = await supabase.functions.invoke('billing-api', {
      body: { action: 'preview-plan', plan, billing_cycle },
    });
    
    if (error) throw error;
    return data;
  };

  const changePlan = async ({ plan, billing_cycle, returnTo }: { plan: string; billing_cycle?: string; returnTo?: string }): Promise<ChangeData> => {
    const idempotencyKey = crypto.randomUUID();
    const { data, error } = await supabase.functions.invoke('billing-api', {
      body: { action: 'change-plan', plan, billing_cycle, returnTo },
      headers: { 'Idempotency-Key': idempotencyKey },
    });
    
    if (error) throw error;
    return data;
  };

  const planQuery = useQuery({
    queryKey: ['billing-plan'],
    queryFn: fetchPlan,
  });

  const previewMutation = useMutation({
    mutationFn: previewPlanChange,
  });

  const changeMutation = useMutation({
    mutationFn: changePlan,
    onSuccess: (data) => {
      if (data.changed) {
        toast({
          title: "Plan Updated",
          description: `Successfully upgraded to ${data.plan}`,
        });
        queryClient.invalidateQueries({ queryKey: ['billing-plan'] });
      }
    },
    onError: (error: any) => {
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
    isChanging: changeMutation.isPending,
  };
};