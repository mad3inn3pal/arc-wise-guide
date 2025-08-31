-- ARC Copilot Full Schema Migration
-- This creates the complete architecture for the ARC Copilot system

BEGIN;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables if they exist (in correct order due to dependencies)
DROP VIEW IF EXISTS checklist_item_view CASCADE;
DROP TABLE IF EXISTS audit_event CASCADE;
DROP TABLE IF EXISTS usage_counter CASCADE;
DROP TABLE IF EXISTS plan_subscription CASCADE;
DROP TABLE IF EXISTS vote CASCADE;
DROP TABLE IF EXISTS render_cache CASCADE;
DROP TABLE IF EXISTS letter CASCADE;
DROP TABLE IF EXISTS checklist_item CASCADE;
DROP TABLE IF EXISTS constraint_rule CASCADE;
DROP TABLE IF EXISTS governing_document CASCADE;
DROP TABLE IF EXISTS submission CASCADE;
DROP TABLE IF EXISTS community CASCADE;
DROP TABLE IF EXISTS org_member CASCADE;
DROP TABLE IF EXISTS org CASCADE;

-- User profile projection (optional convenience)
CREATE TABLE IF NOT EXISTS public.user_profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID UNIQUE NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Organizations and membership
CREATE TABLE public.org (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.org_member (
  org_id UUID REFERENCES public.org(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL, -- auth.users.id as text
  role TEXT CHECK (role IN ('admin','manager','board','viewer')) NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (org_id, user_id)
);

-- Communities
CREATE TABLE public.community (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES public.org(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  timezone TEXT NOT NULL,
  meeting_mode TEXT DEFAULT 'meeting' CHECK (meeting_mode IN ('meeting', 'async-allowed')),
  sla_days INT DEFAULT 14,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Governing docs + dedup (OCR once by file_hash)
CREATE TABLE public.governing_document (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES public.org(id) ON DELETE CASCADE,
  community_id UUID NOT NULL REFERENCES public.community(id) ON DELETE CASCADE,
  file_hash TEXT NOT NULL,
  file_url TEXT NOT NULL,
  is_scanned BOOLEAN DEFAULT FALSE,
  ocr_status TEXT DEFAULT 'pending',
  text_bytes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (org_id, file_hash)
);

-- Extracted constraints
CREATE TABLE public.constraint_rule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES public.governing_document(id) ON DELETE CASCADE,
  section_label TEXT,
  page INT,
  span_start INT,
  span_end INT,
  text TEXT NOT NULL,
  project_type TEXT NOT NULL,
  confidence NUMERIC
);

-- Submissions
CREATE TABLE public.submission (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES public.org(id) ON DELETE CASCADE,
  community_id UUID NOT NULL REFERENCES public.community(id) ON DELETE CASCADE,
  property_json JSONB NOT NULL DEFAULT '{}',
  project_type TEXT NOT NULL,
  fields_json JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'reviewing', 'approved', 'rejected', 'needs-info')),
  submitted_by TEXT, -- auth.users.id as text
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Checklist items
CREATE TABLE public.checklist_item (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID NOT NULL REFERENCES public.submission(id) ON DELETE CASCADE,
  constraint_id UUID REFERENCES public.constraint_rule(id),
  result TEXT CHECK (result IN ('pass','fail','needs-info')) NOT NULL,
  rationale TEXT,
  clause_section TEXT,
  quote TEXT,
  confidence NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Letters
CREATE TABLE public.letter (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID NOT NULL REFERENCES public.submission(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('approval','conditional','denial')) NOT NULL,
  status TEXT CHECK (status IN ('draft','sent')) NOT NULL DEFAULT 'draft',
  file_url TEXT,
  content TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Packet/letter render cache
CREATE TABLE public.render_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID NOT NULL REFERENCES public.submission(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('packet','letter')) NOT NULL,
  content_hash TEXT NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (submission_id, type, content_hash)
);

-- Votes (meeting-aware)
CREATE TABLE public.vote (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID NOT NULL REFERENCES public.submission(id) ON DELETE CASCADE,
  voter_id TEXT NOT NULL, -- auth.users.id as text
  choice TEXT CHECK (choice IN ('approve','deny','abstain')) NOT NULL,
  rationale TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Plan + usage
CREATE TABLE public.plan_subscription (
  org_id UUID PRIMARY KEY REFERENCES public.org(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('free','starter','growth','pro')),
  submissions_included INT NOT NULL,
  overage_rate NUMERIC NOT NULL,
  monthly_reset_day INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.usage_counter (
  org_id UUID NOT NULL REFERENCES public.org(id) ON DELETE CASCADE,
  month_key TEXT NOT NULL, -- 'YYYY-MM'
  submissions_count INT NOT NULL DEFAULT 0,
  PRIMARY KEY (org_id, month_key)
);

-- Audit (append-only)
CREATE TABLE public.audit_event (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES public.org(id) ON DELETE CASCADE,
  actor_id TEXT,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id UUID,
  ip INET,
  ts TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  hash TEXT
);

-- Create helper functions
CREATE OR REPLACE FUNCTION public.is_org_member(target_org UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE AS $$
  SELECT EXISTS(SELECT 1 FROM public.org_member m WHERE m.org_id = target_org AND m.user_id = auth.uid()::TEXT);
$$;

-- Usage helper (UPSERT)
CREATE OR REPLACE FUNCTION public.increment_usage(p_org UUID, p_month TEXT)
RETURNS VOID LANGUAGE PLPGSQL AS $$
BEGIN
  INSERT INTO public.usage_counter(org_id, month_key, submissions_count)
  VALUES (p_org, p_month, 1)
  ON CONFLICT (org_id, month_key)
  DO UPDATE SET submissions_count = usage_counter.submissions_count + 1;
END;
$$;

-- Enable RLS on all tables
ALTER TABLE public.user_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_member ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.governing_document ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.constraint_rule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_item ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.letter ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.render_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vote ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_subscription ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_counter ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_event ENABLE ROW LEVEL SECURITY;

-- RLS Policies (service_role bypasses all)
CREATE POLICY user_profile_self ON public.user_profile
  FOR SELECT USING (auth.uid() = auth_user_id);

CREATE POLICY org_read ON public.org
  FOR SELECT USING (is_org_member(id));

CREATE POLICY orgm_read ON public.org_member
  FOR SELECT USING (is_org_member(org_id));

CREATE POLICY orgm_ins ON public.org_member
  FOR INSERT WITH CHECK (is_org_member(org_id));

CREATE POLICY com_rw ON public.community
  FOR ALL USING (is_org_member(org_id)) WITH CHECK (is_org_member(org_id));

CREATE POLICY doc_rw ON public.governing_document
  FOR ALL USING (is_org_member(org_id)) WITH CHECK (is_org_member(org_id));

CREATE POLICY con_r ON public.constraint_rule
  FOR SELECT USING (
    EXISTS(SELECT 1 FROM public.governing_document d WHERE d.id = document_id AND is_org_member(d.org_id))
  );

CREATE POLICY sub_rw ON public.submission
  FOR ALL USING (is_org_member(org_id)) WITH CHECK (is_org_member(org_id));

CREATE POLICY chk_rw ON public.checklist_item
  FOR ALL USING (
    EXISTS(SELECT 1 FROM public.submission s WHERE s.id = submission_id AND is_org_member(s.org_id))
  ) WITH CHECK (
    EXISTS(SELECT 1 FROM public.submission s WHERE s.id = submission_id AND is_org_member(s.org_id))
  );

CREATE POLICY let_rw ON public.letter
  FOR ALL USING (
    EXISTS(SELECT 1 FROM public.submission s WHERE s.id = submission_id AND is_org_member(s.org_id))
  ) WITH CHECK (
    EXISTS(SELECT 1 FROM public.submission s WHERE s.id = submission_id AND is_org_member(s.org_id))
  );

CREATE POLICY rc_rw ON public.render_cache
  FOR ALL USING (
    EXISTS(SELECT 1 FROM public.submission s WHERE s.id = submission_id AND is_org_member(s.org_id))
  ) WITH CHECK (
    EXISTS(SELECT 1 FROM public.submission s WHERE s.id = submission_id AND is_org_member(s.org_id))
  );

CREATE POLICY vote_rw ON public.vote
  FOR ALL USING (
    EXISTS(SELECT 1 FROM public.submission s WHERE s.id = submission_id AND is_org_member(s.org_id))
  ) WITH CHECK (
    EXISTS(SELECT 1 FROM public.submission s WHERE s.id = submission_id AND is_org_member(s.org_id))
  );

CREATE POLICY plan_r ON public.plan_subscription
  FOR SELECT USING (is_org_member(org_id));

CREATE POLICY usage_rw ON public.usage_counter
  FOR ALL USING (is_org_member(org_id)) WITH CHECK (is_org_member(org_id));

CREATE POLICY audit_r ON public.audit_event
  FOR SELECT USING (is_org_member(org_id));

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Seed data
INSERT INTO public.org (id, name) VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Demo Organization')
ON CONFLICT DO NOTHING;

INSERT INTO public.plan_subscription (org_id, plan, submissions_included, overage_rate)
VALUES ('00000000-0000-0000-0000-000000000001', 'growth', 240, 2.00)
ON CONFLICT (org_id) DO NOTHING;

INSERT INTO public.community (id, org_id, name, state, timezone) VALUES 
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Mockingbird Hills HOA', 'TX', 'America/Chicago')
ON CONFLICT DO NOTHING;

COMMIT;