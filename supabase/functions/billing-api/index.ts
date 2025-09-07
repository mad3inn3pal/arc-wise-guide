import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, idempotency-key',
};

const PLAN_FEATURES = {
  free:    { OCR:false, LLM:false, MEETING:false, WEBHOOKS:false, SSO:false, INVITES:false },
  starter: { OCR:false, LLM:true,  MEETING:false, WEBHOOKS:false, SSO:false, INVITES:true },
  growth:  { OCR:true,  LLM:true,  MEETING:true,  WEBHOOKS:true,  SSO:false, INVITES:true },  
  pro:     { OCR:true,  LLM:true,  MEETING:true,  WEBHOOKS:true,  SSO:true,  INVITES:true },
};

const PLAN_CONFIG = {
  free:    { included: 4,   overage_rate: 999,  seat_limit: 1 },
  starter: { included: 60,  overage_rate: 3.00, seat_limit: 2 },
  growth:  { included: 240, overage_rate: 2.00, seat_limit: 5 },
  pro:     { included: 600, overage_rate: 1.25, seat_limit: null },
};

// Plan pricing configuration - All $0 for testing
const PLAN_PRICING = {
  starter: { monthly: 0, annual: 0 }, // $0/month for testing
  growth: { monthly: 0, annual: 0 },  // $0/month for testing
  pro: { monthly: 0, annual: 0 }      // $0/month for testing
};

function getPriceAmount(plan: string, cycle: string): number | null {
  if (plan === 'free') return null;
  const planPricing = PLAN_PRICING[plan as keyof typeof PLAN_PRICING];
  if (!planPricing) return null;
  const price = planPricing[cycle as keyof typeof planPricing];
  return price !== undefined ? price : null;
}

serve(async (req) => {
  console.log(`[BILLING-API] ${req.method} request received from ${req.headers.get('origin') || 'unknown-origin'}`);
  
  if (req.method === 'OPTIONS') {
    console.log('[BILLING-API] Handling CORS preflight');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[BILLING-API] Initializing Supabase client');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    console.log('[BILLING-API] Auth header present:', !!authHeader);
    if (!authHeader) {
      console.log('[BILLING-API] ERROR: No authorization header provided');
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('[BILLING-API] Authenticating user');
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      console.log('[BILLING-API] ERROR: Authentication failed', { authError: authError?.message, hasUser: !!user });
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('[BILLING-API] User authenticated:', user.id);

    // Get the user's org_id from org_member table
    console.log('[BILLING-API] Fetching user organization membership');
    const { data: orgMember, error: orgError } = await supabase
      .from('org_member')
      .select('org_id')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (orgError) {
      console.log('[BILLING-API] ERROR: Failed to fetch org membership', orgError);
    }
    
    const org_id = orgMember?.org_id;
    console.log('[BILLING-API] Organization ID found:', org_id);
    if (!org_id) {
      console.log('[BILLING-API] ERROR: User not part of any organization');
      return new Response(JSON.stringify({ error: 'User not part of any organization' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const requestBody = await req.json();
    const { action, plan, billing_cycle = 'monthly', returnTo } = requestBody;
    console.log('[BILLING-API] Processing action:', action, { plan, billing_cycle, returnTo });

    switch (action) {
      case 'get-plan': {
        console.log('[BILLING-API] GET-PLAN: Fetching plan data for org:', org_id);
        const { data, error: planError } = await supabase
          .from('plan_subscription')
          .select('*')
          .eq('org_id', org_id)
          .maybeSingle();

        if (planError) {
          console.log('[BILLING-API] GET-PLAN ERROR: Failed to fetch plan subscription', planError);
        }

        const currentPlan = data?.plan || 'free';
        console.log('[BILLING-API] GET-PLAN: Current plan found:', currentPlan);
        const currentBillingCycle = data?.billing_cycle || 'monthly';
        const status = data?.status || 'active';
        
        const config = PLAN_CONFIG[currentPlan as keyof typeof PLAN_CONFIG] || PLAN_CONFIG.free;
        const features = PLAN_FEATURES[currentPlan as keyof typeof PLAN_FEATURES] || PLAN_FEATURES.free;
        
        // Get submission usage for current month
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
        console.log('[BILLING-API] GET-PLAN: Fetching usage for month:', currentMonth);
        const { data: usageData, error: usageError } = await supabase
          .from('usage_counter')
          .select('submissions_count')
          .eq('org_id', org_id)
          .eq('month_key', currentMonth)
          .maybeSingle();
        
        if (usageError) {
          console.log('[BILLING-API] GET-PLAN ERROR: Failed to fetch usage data', usageError);
        }
        console.log('[BILLING-API] GET-PLAN: Usage data:', usageData?.submissions_count || 0);
        
        // Get seat usage
        console.log('[BILLING-API] GET-PLAN: Fetching seat count');
        const { count: seatCount, error: seatError } = await supabase
          .from('org_member')
          .select('*', { count: 'exact', head: true })
          .eq('org_id', org_id)
          .in('role', ['board', 'manager']);
        
        if (seatError) {
          console.log('[BILLING-API] GET-PLAN ERROR: Failed to fetch seat count', seatError);
        }
        console.log('[BILLING-API] GET-PLAN: Seat count:', seatCount || 0);
        
        const planResponse = {
          plan: currentPlan,
          billing_cycle: currentBillingCycle,
          status,
          included: config.included,
          overage_rate: config.overage_rate,
          seats: {
            limit: config.seat_limit,
            used: usageData?.submissions_count || 0
          },
          seat_count: seatCount || 0,
          features
        };
        console.log('[BILLING-API] GET-PLAN: Returning plan data:', planResponse);
        
        return new Response(JSON.stringify(planResponse), {
          plan: currentPlan,
          billing_cycle: currentBillingCycle,
          status,
          included: config.included,
          overage_rate: config.overage_rate,
          seats: {
            limit: config.seat_limit,
            used: usageData?.submissions_count || 0
          },
          seat_count: seatCount || 0,
          features
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'preview-plan': {
        if (!plan || !['free','starter','growth','pro'].includes(plan)) {
          return new Response(JSON.stringify({ error: 'Invalid plan' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Check if org can downgrade
        const { data: canDowngrade } = await supabase.rpc('can_downgrade_to', { 
          p_org: org_id, 
          p_plan: plan 
        });

        if (!canDowngrade) {
          const config = PLAN_CONFIG[plan as keyof typeof PLAN_CONFIG];
          return new Response(JSON.stringify({
            allowed: false,
            reason: `You currently have more active seats than ${plan} allows (limit: ${config.seat_limit || 'unlimited'}). Remove board members first.`
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        const config = PLAN_CONFIG[plan as keyof typeof PLAN_CONFIG];
        const features = PLAN_FEATURES[plan as keyof typeof PLAN_FEATURES];
        
        return new Response(JSON.stringify({
          allowed: true,
          included: config.included,
          overage_rate: config.overage_rate,
          seat_limit: config.seat_limit,
          features
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'checkout': {
        // Check if user is org admin
        const { data: member } = await supabase
          .from('org_member')
          .select('role')
          .eq('org_id', org_id)
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (!member || member.role !== 'admin') {
          return new Response(JSON.stringify({ error: 'Admin only. Ask an org admin to change plans.' }), {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        if (!plan || !['starter','growth','pro'].includes(plan)) {
          return new Response(JSON.stringify({ error: 'Invalid plan' }), {
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
        
        // Get or create Stripe customer
        const { data: org } = await supabase
          .from('org')
          .select('stripe_customer_id, name')
          .eq('id', org_id)
          .single();
          
        let customerId = org?.stripe_customer_id;
        
        if (!customerId) {
          const customer = await stripe.customers.create({
            email: user.email,
            name: org?.name || `Organization ${org_id}`,
            metadata: { org_id }
          });
          customerId = customer.id;
          
          // Save customer ID
          await supabase
            .from('org')
            .update({ stripe_customer_id: customerId })
            .eq('id', org_id);
        }
        
        // Get price amount
        const priceAmount = getPriceAmount(plan, billing_cycle);
        if (priceAmount === null) {
          return new Response(JSON.stringify({ error: 'Invalid plan or billing cycle' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        // Create checkout session with dynamic pricing
        const origin = req.headers.get('origin') || 'http://localhost:5173';
        const session = await stripe.checkout.sessions.create({
          customer: customerId,
          line_items: [{
            price_data: {
              currency: 'usd',
              product_data: {
                name: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
                description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} subscription - ${billing_cycle} billing`
              },
              unit_amount: priceAmount,
              recurring: {
                interval: billing_cycle === 'annual' ? 'year' : 'month'
              }
            },
            quantity: 1,
          }],
          mode: 'subscription',
          success_url: `${origin}/pricing/complete?session_id={CHECKOUT_SESSION_ID}&returnTo=${encodeURIComponent(returnTo || '/pricing')}`,
          cancel_url: `${origin}/pricing?cancelled=true`,
          subscription_data: {
            metadata: { 
              org_id, 
              plan, 
              billing_cycle 
            },
          },
        });

        return new Response(JSON.stringify({ url: session.url }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'change-plan': {
        // Check if user is org admin
        const { data: member } = await supabase
          .from('org_member')
          .select('role')
          .eq('org_id', org_id)
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (!member || member.role !== 'admin') {
          return new Response(JSON.stringify({ error: 'Admin only. Ask an org admin to change plans.' }), {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        if (!plan || !['free','starter','growth','pro'].includes(plan)) {
          return new Response(JSON.stringify({ error: 'Invalid plan' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        // Get current plan
        const { data: currentPlan } = await supabase
          .from('plan_subscription')
          .select('*')
          .eq('org_id', org_id)
          .maybeSingle();
        
        if (currentPlan?.plan === plan && currentPlan?.billing_cycle === billing_cycle) {
          return new Response(JSON.stringify({ unchanged: true, plan }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        // Check if org can downgrade
        const { data: canDowngrade } = await supabase.rpc('can_downgrade_to', { 
          p_org: org_id, 
          p_plan: plan 
        });

        if (!canDowngrade) {
          return new Response(JSON.stringify({ error: 'Seat limit exceeded for target plan' }), {
            status: 409,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        const config = PLAN_CONFIG[plan as keyof typeof PLAN_CONFIG];
        
        // Update or insert plan subscription
        const { error } = await supabase
          .from('plan_subscription')
          .upsert({
            org_id,
            plan,
            billing_cycle,
            status: 'active',
            submissions_included: config.included,
            overage_rate: config.overage_rate,
            updated_at: new Date().toISOString()
          });
        
        if (error) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        // Audit log
        await supabase.from('audit_event').insert({
          org_id,
          actor_id: user.id,
          entity: 'plan_subscription',
          action: 'plan_change',
          entity_id: org_id,
          hash: JSON.stringify({ from: currentPlan?.plan || 'free', to: plan })
        });
        
        return new Response(JSON.stringify({
          changed: true,
          plan,
          redirect: returnTo || null
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error: any) {
    console.error('[BILLING-API] FATAL ERROR:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      cause: error.cause
    });
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});