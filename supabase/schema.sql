-- ARC Copilot Database Schema
-- Enable Row Level Security on all tables

BEGIN;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations table
CREATE TABLE org (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE org ENABLE ROW LEVEL SECURITY;

-- Communities table
CREATE TABLE community (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES org(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    state TEXT NOT NULL,
    timezone TEXT NOT NULL DEFAULT 'America/New_York',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE community ENABLE ROW LEVEL SECURITY;

-- Organization members table
CREATE TABLE org_member (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES org(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL, -- From Auth0/OIDC
    role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'board', 'owner', 'contractor', 'counsel', 'viewer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(org_id, user_id)
);

ALTER TABLE org_member ENABLE ROW LEVEL SECURITY;

-- Submissions table
CREATE TABLE submission (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    community_id UUID NOT NULL REFERENCES community(id) ON DELETE CASCADE,
    project_type TEXT NOT NULL,
    property_lot TEXT,
    property_address TEXT,
    fields JSONB NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'needs-info')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE submission ENABLE ROW LEVEL SECURITY;

-- Checklist items table
CREATE TABLE checklist_item (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES submission(id) ON DELETE CASCADE,
    constraint_id TEXT NOT NULL,
    result TEXT NOT NULL CHECK (result IN ('pass', 'fail', 'needs-info')),
    rationale TEXT NOT NULL,
    clause_section TEXT NOT NULL,
    quote TEXT NOT NULL,
    confidence DECIMAL(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE checklist_item ENABLE ROW LEVEL SECURITY;

-- Letters table
CREATE TABLE letter (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES submission(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    note TEXT NOT NULL,
    content TEXT NOT NULL,
    approved_by TEXT, -- user_id of approver
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE letter ENABLE ROW LEVEL SECURITY;

-- Audit events table (append-only)
CREATE TABLE audit_event (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES org(id) ON DELETE CASCADE,
    actor_id TEXT NOT NULL, -- user_id
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id UUID,
    before_hash TEXT,
    after_hash TEXT,
    prev_hash TEXT,
    curr_hash TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE audit_event ENABLE ROW LEVEL SECURITY;

-- Create checklist view that flattens clause fields
CREATE VIEW checklist_item_view AS
SELECT 
    ci.id,
    ci.submission_id,
    ci.constraint_id,
    ci.result,
    ci.rationale,
    ci.clause_section,
    ci.quote,
    ci.confidence,
    ci.created_at,
    s.community_id,
    c.org_id
FROM checklist_item ci
JOIN submission s ON ci.submission_id = s.id
JOIN community c ON s.community_id = c.id;

-- RLS Policies

-- Org members can read their org data
CREATE POLICY "Org members can read org data" ON org
    FOR SELECT USING (
        id IN (
            SELECT org_id FROM org_member 
            WHERE user_id = current_setting('request.jwt.claims', true)::json->>'sub'
        )
    );

-- Org members can read their communities
CREATE POLICY "Org members can read communities" ON community
    FOR SELECT USING (
        org_id IN (
            SELECT org_id FROM org_member 
            WHERE user_id = current_setting('request.jwt.claims', true)::json->>'sub'
        )
    );

-- Org members can read their submissions
CREATE POLICY "Org members can read submissions" ON submission
    FOR SELECT USING (
        community_id IN (
            SELECT c.id FROM community c
            JOIN org_member om ON c.org_id = om.org_id
            WHERE om.user_id = current_setting('request.jwt.claims', true)::json->>'sub'
        )
    );

-- Org members can read their checklist items
CREATE POLICY "Org members can read checklist items" ON checklist_item
    FOR SELECT USING (
        submission_id IN (
            SELECT s.id FROM submission s
            JOIN community c ON s.community_id = c.id
            JOIN org_member om ON c.org_id = om.org_id
            WHERE om.user_id = current_setting('request.jwt.claims', true)::json->>'sub'
        )
    );

-- Org members can read their letters
CREATE POLICY "Org members can read letters" ON letter
    FOR SELECT USING (
        submission_id IN (
            SELECT s.id FROM submission s
            JOIN community c ON s.community_id = c.id
            JOIN org_member om ON c.org_id = om.org_id
            WHERE om.user_id = current_setting('request.jwt.claims', true)::json->>'sub'
        )
    );

-- Org members can read their audit events
CREATE POLICY "Org members can read audit events" ON audit_event
    FOR SELECT USING (
        org_id IN (
            SELECT org_id FROM org_member 
            WHERE user_id = current_setting('request.jwt.claims', true)::json->>'sub'
        )
    );

-- Prohibit UPDATE/DELETE on audit_event (append-only)
CREATE POLICY "Audit events are append-only" ON audit_event
    FOR UPDATE USING (false);

CREATE POLICY "Audit events cannot be deleted" ON audit_event
    FOR DELETE USING (false);

-- Only service role can INSERT audit events
CREATE POLICY "Service role can insert audit events" ON audit_event
    FOR INSERT WITH CHECK (
        current_setting('role') = 'service_role'
    );

COMMIT;