import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
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

    const org_id = user.user_metadata?.org_id;
    if (!org_id) {
      return new Response(JSON.stringify({ error: 'Missing org_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { action, plan, billing_cycle = 'monthly', returnTo } = await req.json();

    switch (action) {
      case 'get-plan': {
        const { data } = await supabase
          .from('plan_subscription')
          .select('*')
          .eq('org_id', org_id)
          .maybeSingle();

        const currentPlan = data?.plan || 'free';
        const currentBillingCycle = data?.billing_cycle || 'monthly';
        const status = data?.status || 'active';
        
        const config = PLAN_CONFIG[currentPlan as keyof typeof PLAN_CONFIG] || PLAN_CONFIG.free;
        const features = PLAN_FEATURES[currentPlan as keyof typeof PLAN_FEATURES] || PLAN_FEATURES.free;
        
        // Get seat usage
        const { count: seatCount } = await supabase
          .from('org_member')
          .select('*', { count: 'exact', head: true })
          .eq('org_id', org_id)
          .in('role', ['board', 'manager']);
        
        return new Response(JSON.stringify({
          plan: currentPlan,
          billing_cycle: currentBillingCycle,
          status,
          included: config.included,
          overage_rate: config.overage_rate,
          seats: {
            limit: config.seat_limit,
            used: seatCount || 0
          },
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
    console.error('Billing API error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});