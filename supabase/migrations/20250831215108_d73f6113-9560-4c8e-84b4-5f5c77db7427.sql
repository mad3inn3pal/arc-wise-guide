-- Add missing columns to plan_subscription table
ALTER TABLE public.plan_subscription 
ADD COLUMN IF NOT EXISTS billing_cycle text NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly','annual')),
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','past_due','canceled','trialing')),
ADD COLUMN IF NOT EXISTS trial_ends_at timestamptz,
ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- Create trigger for updated_at
CREATE TRIGGER update_plan_subscription_updated_at
    BEFORE UPDATE ON public.plan_subscription
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add RLS policy for plan updates (org admins only)
CREATE POLICY "plan_update_admin" ON public.plan_subscription
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.org_member 
    WHERE org_id = plan_subscription.org_id 
    AND user_id = auth.uid()::TEXT 
    AND role = 'admin'
  )
);

-- Create function to check if org can downgrade
CREATE OR REPLACE FUNCTION public.can_downgrade_to(p_org uuid, p_plan text)
RETURNS boolean 
LANGUAGE sql 
STABLE 
AS $$
  WITH seats AS (
    SELECT COALESCE(COUNT(*), 0) AS c 
    FROM public.org_member 
    WHERE org_id = p_org 
    AND role IN ('board', 'manager')
  )
  SELECT CASE p_plan
    WHEN 'free' THEN (SELECT c <= 1 FROM seats)
    WHEN 'starter' THEN (SELECT c <= 2 FROM seats)
    WHEN 'growth' THEN (SELECT c <= 5 FROM seats)
    ELSE true
  END;
$$;