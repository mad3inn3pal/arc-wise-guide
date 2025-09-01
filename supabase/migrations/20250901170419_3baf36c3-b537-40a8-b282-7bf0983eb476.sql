-- Add stripe_customer_id to org table for Stripe integration
ALTER TABLE public.org ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;