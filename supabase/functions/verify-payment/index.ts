import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PLAN_CONFIG = {
  free:    { included: 4,   overage_rate: 999,  seat_limit: 1 },
  starter: { included: 60,  overage_rate: 3.00, seat_limit: 2 },
  growth:  { included: 240, overage_rate: 2.00, seat_limit: 5 },
  pro:     { included: 600, overage_rate: 1.25, seat_limit: null },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting payment verification...');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.log('No authorization header provided');
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { session_id } = await req.json();
    console.log(`[VERIFY-PAYMENT] Session ID received: ${session_id}`);
    
    if (!session_id) {
      console.log('[VERIFY-PAYMENT] No session ID provided');
      return new Response(JSON.stringify({ error: 'Session ID required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Stripe
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      return new Response(JSON.stringify({ error: 'Stripe not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });
    
    // Add a small delay to prevent rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Retrieve the checkout session with subscription expanded
    console.log('[VERIFY-PAYMENT] Retrieving Stripe session...');
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['subscription']
    });
    
    console.log('[VERIFY-PAYMENT] Stripe session retrieved:', { 
      payment_status: session.payment_status, 
      metadata: session.metadata,
      subscription_metadata: session.subscription?.metadata,
      mode: session.mode 
    });
    
    if (session.payment_status !== 'paid') {
      console.log('[VERIFY-PAYMENT] Payment not completed, status:', session.payment_status);
      return new Response(JSON.stringify({ error: 'Payment not completed' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Extract metadata from session first, then subscription as fallback
    const metadata = {
      org_id: session.metadata?.org_id || session.subscription?.metadata?.org_id,
      plan: session.metadata?.plan || session.subscription?.metadata?.plan,
      billing_cycle: session.metadata?.billing_cycle || session.subscription?.metadata?.billing_cycle
    };
    
    console.log('[VERIFY-PAYMENT] Extracted metadata:', metadata);
    
    if (!metadata.org_id || !metadata.plan || !metadata.billing_cycle) {
      console.log('[VERIFY-PAYMENT] Missing required metadata fields');
      return new Response(JSON.stringify({ 
        error: 'Invalid session metadata',
        received_session_metadata: session.metadata,
        received_subscription_metadata: session.subscription?.metadata
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify user is member of the org
    const { data: orgMember } = await supabase
      .from('org_member')
      .select('user_id')
      .eq('org_id', metadata.org_id)
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (!orgMember) {
      return new Response(JSON.stringify({ error: 'User not authorized for this organization' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const config = PLAN_CONFIG[metadata.plan as keyof typeof PLAN_CONFIG];
    
    // Update or insert plan subscription
    const { error } = await supabase
      .from('plan_subscription')
      .upsert({
        org_id: metadata.org_id,
        plan: metadata.plan,
        billing_cycle: metadata.billing_cycle,
        status: 'active',
        submissions_included: config.included,
        overage_rate: config.overage_rate,
        updated_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('[VERIFY-PAYMENT] Database error:', error);
      return new Response(JSON.stringify({ error: 'Failed to update subscription' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    console.log('[VERIFY-PAYMENT] Successfully updated plan subscription');
    
    // Create audit log
    await supabase.from('audit_event').insert({
      org_id: metadata.org_id,
      actor_id: user.id,
      entity: 'plan_subscription',
      action: 'upgrade_via_stripe',
      entity_id: metadata.org_id,
      hash: JSON.stringify({ plan: metadata.plan, billing_cycle: metadata.billing_cycle, session_id })
    });

    console.log('[VERIFY-PAYMENT] Payment verification completed successfully');

    return new Response(JSON.stringify({
      success: true,
      plan: metadata.plan,
      billing_cycle: metadata.billing_cycle
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});