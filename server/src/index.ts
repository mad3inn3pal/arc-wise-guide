/// <reference path="../types.d.ts" />
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import multer from 'multer';
import { z } from 'zod';

const app = express();
app.use(express.json({ limit: '2mb' }));
app.use(cors({ 
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'], 
  credentials: true 
}));
app.use(helmet({ 
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false 
}));
app.use(rateLimit({ windowMs: 15*60*1000, max: 100 }));
app.use(pinoHttp({
  redact: ['req.headers.authorization', 'req.body.password']
}));

const sb = createClient(
  process.env.SUPABASE_URL!, 
  process.env.SUPABASE_SERVICE_ROLE_KEY!, 
  { auth: { persistSession: false } }
);
const AI_CONF_MIN = Number(process.env.AI_CONFIDENCE_MIN || 0.75);

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

function monthKey(d = new Date()) { return d.toISOString().slice(0,7); }

async function requireAuth(req: any, res: any, next: any) {
  let token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ error: 'missing token' });
  
  const { data, error } = await sb.auth.getUser(token);
  if (error || !data?.user) return res.status(401).json({ error: 'invalid token' });
  
  req.user = data.user;
  
  // Dev overrides
  if (process.env.NODE_ENV === 'development') {
    if (req.headers['x-dev-org']) {
      req.user.user_metadata = { 
        ...(req.user.user_metadata||{}), 
        org_id: String(req.headers['x-dev-org']) 
      };
    }
  }
  return next();
}

async function getPlan(org_id: string, devOverride?: string) {
  if (devOverride) {
    const planConfig = {
      starter: { plan: devOverride, submissions_included: 60, overage_rate: 3 },
      growth: { plan: devOverride, submissions_included: 240, overage_rate: 2 },
      pro: { plan: devOverride, submissions_included: 600, overage_rate: 1.25 },
      free: { plan: devOverride, submissions_included: 4, overage_rate: 999 }
    };
    return planConfig[devOverride as keyof typeof planConfig] || planConfig.free;
  }
  
  const { data, error } = await sb.from('plan_subscription').select('*').eq('org_id', org_id).single();
  if (error || !data) return { plan: 'free', submissions_included: 4, overage_rate: 999 };
  return data;
}

function featureAllowed(plan: string, feature: string) {
  const gates: Record<string, Record<string, boolean>> = {
    free:    { OCR:false, LLM:false, MEETING:false, WEBHOOKS:false, SSO:false },
    starter: { OCR:false, LLM:true,  MEETING:false, WEBHOOKS:false, SSO:false },
    growth:  { OCR:true,  LLM:true,  MEETING:true,  WEBHOOKS:true,  SSO:false },
    pro:     { OCR:true,  LLM:true,  MEETING:true,  WEBHOOKS:true,  SSO:true  },
  };
  return !!gates[plan]?.[feature];
}

async function enforceQuota(org_id: string, planRow: any) {
  const m = monthKey();
  const { data } = await sb.from('usage_counter').select('*').eq('org_id', org_id).eq('month_key', m).maybeSingle();
  const used = data?.submissions_count || 0;
  const included = planRow.submissions_included || 0;
  
  if (planRow.plan === 'free' && used >= 4) {
    const err: any = new Error('Submission limit reached. Please upgrade your plan to continue.');
    err.http = 402;
    throw err;
  }
  return { used, included, month: m };
}

async function bumpUsage(org_id: string) { 
  await sb.rpc('increment_usage', { p_org: org_id, p_month: monthKey() }); 
}

function guardChecklist(items: any[]) {
  return items.map(it => {
    if (it.result === 'pass' && !(it.clause_section && it.quote)) {
      return { ...it, result: 'needs-info', rationale: 'Missing citation—requires human review.' };
    }
    if (typeof it.confidence === 'number' && it.confidence < AI_CONF_MIN && it.result !== 'fail') {
      return { ...it, result: 'needs-info', rationale: 'Confidence below threshold.' };
    }
    return it;
  });
}

// Routes
app.get('/api/ping', (_req, res) => res.json({ ok: true }));

// Returns plan + usage meter
app.get('/api/billing/usage', requireAuth, async (req: any, res) => {
  try {
    const org_id = req.user.user_metadata?.org_id;
    if (!org_id) return res.status(400).json({ error:'missing org_id on user' });
    
    const plan = await getPlan(org_id, req.headers['x-dev-plan'] as string | undefined);
    const { used, included, month } = await enforceQuota(org_id, plan).catch(() => ({ 
      used: 0, 
      included: plan.submissions_included, 
      month: monthKey() 
    }));
    
    return res.json({ 
      plan: plan.plan, 
      included, 
      used, 
      month, 
      overage_rate: plan.overage_rate 
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Create submission (increments usage)
app.post('/api/submissions', requireAuth, async (req: any, res) => {
  try {
    const org_id = req.user.user_metadata?.org_id;
    if (!org_id) return res.status(400).json({ error:'missing org_id' });
    
    const plan = await getPlan(org_id, req.headers['x-dev-plan'] as string | undefined);
    await enforceQuota(org_id, plan);
    
    const { community_id, project_type, property_json = {}, fields_json = {} } = req.body || {};
    
    const { data, error } = await sb.from('submission').insert([{ 
      org_id, 
      community_id, 
      project_type, 
      property_json, 
      fields_json, 
      submitted_by: req.user.id 
    }]).select('id').single();
    
    if (error) return res.status(400).json({ error: error.message });
    
    await bumpUsage(org_id);
    res.json({ id: data.id });
  } catch (error: any) {
    return res.status(error.http || 400).json({ error: error.message });
  }
});

// Checklist (deterministic first; LLM gated)
app.post('/api/submissions/:id/check', requireAuth, async (req: any, res) => {
  try {
    const org_id = req.user.user_metadata?.org_id;
    const sub_id = req.params.id;
    if (!org_id) return res.status(400).json({ error:'missing org_id' });
    
    const plan = await getPlan(org_id, req.headers['x-dev-plan'] as string | undefined);
    
    // Fetch submission + community
    const { data: sub } = await sb.from('submission')
      .select('*, community:community(*)')
      .eq('id', sub_id)
      .single();
    if (!sub) return res.status(404).json({ error:'submission not found' });

    // Retrieve constraints for project_type
    const { data: docs } = await sb.from('governing_document')
      .select('id')
      .eq('community_id', sub.community_id);
    
    const docIds = (docs||[]).map(d => d.id);
    const { data: rules } = docIds.length ? 
      await sb.from('constraint_rule')
        .select('*')
        .in('document_id', docIds)
        .eq('project_type', sub.project_type) : 
      { data: [] };

    // Pseudo deterministic checks (example only)
    const results = [];
    
    if ('heightFt' in (sub.fields_json || {})) {
      const maxRule = rules?.find(r => r.text?.toLowerCase().includes('maximum fence height'));
      const ok = Number(sub.fields_json.heightFt) <= 6;
      results.push({
        constraint_id: maxRule?.id || null,
        result: ok ? 'pass' : 'fail',
        rationale: ok ? 'Height within allowed maximum.' : `Proposed height ${sub.fields_json.heightFt} ft exceeds maximum 6 ft.`,
        clause_section: maxRule?.section_label || '§4.3(b)',
        quote: maxRule?.text || 'Maximum fence height in rear and side yards is six (6) feet.',
        confidence: 0.92
      });
    }

    // Any remaining subjective checks would be LLM-gated
    if (!featureAllowed(plan.plan, 'LLM')) {
      results.push({
        constraint_id: null,
        result: 'needs-info',
        rationale: 'Subjective checks require reviewer because LLM is not enabled on this plan.',
        clause_section: null,
        quote: null,
        confidence: 0.5
      });
    }

    const guarded = guardChecklist(results);
    
    // Persist checklist rows
    const upserts = guarded.map(g => ({ 
      submission_id: sub_id, 
      constraint_id: g.constraint_id, 
      result: g.result, 
      rationale: g.rationale, 
      clause_section: g.clause_section, 
      quote: g.quote, 
      confidence: g.confidence 
    }));
    
    if (upserts.length > 0) {
      await sb.from('checklist_item').insert(upserts);
    }
    
    res.json({ submissionId: sub_id, results: guarded });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Letter draft (always draft, cached)
app.post('/api/submissions/:id/letter', requireAuth, async (req: any, res) => {
  try {
    const sub_id = req.params.id;
    const contentHash = crypto.createHash('sha256')
      .update(JSON.stringify({ sub_id, t: 'letter-v1' }))
      .digest('hex');
    
    const { data: cached } = await sb.from('render_cache')
      .select('*')
      .eq('submission_id', sub_id)
      .eq('type', 'letter')
      .eq('content_hash', contentHash)
      .maybeSingle();
    
    if (cached) {
      return res.json({ 
        cached: true, 
        file_url: cached.file_url, 
        note: 'DRAFT FOR HUMAN REVIEW — NOT LEGAL ADVICE' 
      });
    }

    // Fake a rendered URL (replace with your renderer)
    const file_url = `s3://placeholder/letters/${sub_id}-${contentHash}.pdf`;
    
    await sb.from('render_cache').insert([{ 
      submission_id: sub_id, 
      type: 'letter', 
      content_hash: contentHash, 
      file_url 
    }]);
    
    res.json({ 
      cached: false, 
      file_url, 
      note: 'DRAFT FOR HUMAN REVIEW — NOT LEGAL ADVICE' 
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Meeting-aware async vote block (CA)
app.post('/api/votes/async', requireAuth, async (req: any, res) => {
  try {
    const { submission_id } = req.body || {};
    const { data: sub } = await sb.from('submission')
      .select('*, community:community(state)')
      .eq('id', submission_id)
      .single();
    
    if (!sub) return res.status(404).json({ error:'submission not found' });
    
    if (sub.community?.state === 'CA') {
      return res.status(400).json({ 
        error: 'Email votes blocked in CA; schedule a meeting.' 
      });
    }
    
    res.json({ ok: true, message: 'Async vote links created (mock).' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Documents ingest (dedupe by file_hash; OCR gated)
app.post('/api/documents/ingest', requireAuth, async (req: any, res) => {
  try {
    const org_id = req.user.user_metadata?.org_id;
    const { community_id, file_hash, file_url, hintIsTextNative } = req.body || {};
    
    if (!org_id || !community_id || !file_hash || !file_url) {
      return res.status(400).json({ error:'missing fields' });
    }

    const plan = await getPlan(org_id, req.headers['x-dev-plan'] as string | undefined);
    
    const { data: exists } = await sb.from('governing_document')
      .select('id')
      .eq('org_id', org_id)
      .eq('file_hash', file_hash)
      .maybeSingle();
    
    if (exists) return res.json({ deduped: true, document_id: exists.id });

    const is_scanned = !hintIsTextNative;
    if (is_scanned && !featureAllowed(plan.plan, 'OCR')) {
      return res.status(403).json({ error:'OCR not included in current plan' });
    }

    const { data: doc, error } = await sb.from('governing_document').insert([{ 
      org_id, 
      community_id, 
      file_hash, 
      file_url, 
      is_scanned, 
      ocr_status: is_scanned ? 'queued' : 'skipped' 
    }]).select('id').single();
    
    if (error) return res.status(400).json({ error: error.message });
    
    res.json({ 
      deduped: false, 
      document_id: doc.id, 
      is_scanned, 
      ocr_status: is_scanned ? 'queued' : 'skipped' 
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Get communities for org
app.get('/api/communities', requireAuth, async (req: any, res) => {
  try {
    const org_id = req.user.user_metadata?.org_id;
    if (!org_id) return res.status(400).json({ error:'missing org_id' });
    
    const { data, error } = await sb.from('community')
      .select('*')
      .eq('org_id', org_id);
    
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Create organization and onboarding
app.post('/api/onboarding/org', requireAuth, async (req: any, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Organization name required' });
    
    // Create organization
    const { data: org, error: orgError } = await sb.from('org')
      .insert([{ name }])
      .select('id')
      .single();
    
    if (orgError) return res.status(400).json({ error: orgError.message });
    
    // Add user as admin
    const { error: memberError } = await sb.from('org_member')
      .insert([{ 
        org_id: org.id, 
        user_id: req.user.id, 
        role: 'admin' 
      }]);
    
    if (memberError) return res.status(400).json({ error: memberError.message });
    
    // Set default plan
    await sb.from('plan_subscription')
      .insert([{ 
        org_id: org.id, 
        plan: 'free', 
        submissions_included: 4, 
        overage_rate: 999 
      }])
      .select('id')
      .single();
    
    res.json({ org_id: org.id });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Create community
app.post('/api/onboarding/community', requireAuth, async (req: any, res) => {
  try {
    const org_id = req.user.user_metadata?.org_id;
    if (!org_id) return res.status(400).json({ error:'missing org_id' });
    
    const { name, state, timezone, meeting_mode = 'meeting' } = req.body;
    if (!name || !state || !timezone) {
      return res.status(400).json({ error: 'Name, state, and timezone required' });
    }
    
    const { data, error } = await sb.from('community')
      .insert([{ org_id, name, state, timezone, meeting_mode }])
      .select('id')
      .single();
    
    if (error) return res.status(400).json({ error: error.message });
    res.json({ community_id: data.id });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Internal crons
app.post('/internal/cron/retention-sweep', (req, res) => {
  const auth = (req.headers.authorization||'').replace(/^Bearer\s+/i,'');
  if (auth !== process.env.CRON_SECRET) {
    return res.status(401).json({ error:'unauthorized' });
  }
  // TODO: implement free-plan 30-day purge (except audit_event)
  return res.json({ ok: true, message: 'sweep scheduled' });
});

// Error handling middleware
app.use((error: any, req: any, res: any, next: any) => {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`🚀 ARC Copilot API running on port ${port}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});