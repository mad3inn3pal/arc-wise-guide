-- Fix security warnings: Set proper search paths for functions

-- Update is_org_member function with search path
CREATE OR REPLACE FUNCTION public.is_org_member(target_org UUID)
RETURNS BOOLEAN 
LANGUAGE SQL STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS(SELECT 1 FROM public.org_member m WHERE m.org_id = target_org AND m.user_id = auth.uid()::TEXT);
$$;

-- Update increment_usage function with search path
CREATE OR REPLACE FUNCTION public.increment_usage(p_org UUID, p_month TEXT)
RETURNS VOID 
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.usage_counter(org_id, month_key, submissions_count)
  VALUES (p_org, p_month, 1)
  ON CONFLICT (org_id, month_key)
  DO UPDATE SET submissions_count = usage_counter.submissions_count + 1;
END;
$$;