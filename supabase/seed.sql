-- ARC Copilot Seed Data
-- Insert demo data for testing

BEGIN;

-- Insert demo organization
INSERT INTO org (id, name) VALUES 
    ('00000000-0000-0000-0000-000000000001', 'Demo Organization');

-- Insert demo community
INSERT INTO community (id, org_id, name, state, timezone) VALUES 
    ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Mockingbird Hills HOA', 'TX', 'America/Chicago');

-- Insert demo org member (replace with your test user ID)
INSERT INTO org_member (org_id, user_id, role) VALUES 
    ('00000000-0000-0000-0000-000000000001', 'demo-user-123', 'admin');

-- Insert demo submission
INSERT INTO submission (id, community_id, project_type, property_lot, property_address, fields) VALUES 
    ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000002', 'Fence', '23', '114 Mockingbird Ln', 
     '{"heightFt": 7, "material": "wood", "style": "board-on-board"}');

-- Insert demo checklist items
INSERT INTO checklist_item (submission_id, constraint_id, result, rationale, clause_section, quote, confidence) VALUES 
    ('00000000-0000-0000-0000-000000000101', 'c_fence_max_height', 'fail', 'Proposed height 7 ft exceeds maximum 6 ft.', '§4.3(b)', 'Maximum fence height in rear and side yards is six (6) feet.', 0.92),
    ('00000000-0000-0000-0000-000000000101', 'c_fence_materials_allowed', 'pass', 'Material ''wood'' is allowed.', '§4.3(c)', 'Permitted materials: wood..., wrought iron.', 0.90),
    ('00000000-0000-0000-0000-000000000101', 'missing_neighbor_notice', 'needs-info', 'Neighbor notice required for shared fences is missing for Lot 24.', 'Appendix A', 'Fence: ... neighbor notice for shared fences.', 0.78);

-- Insert demo letter
INSERT INTO letter (submission_id, type, note, content) VALUES 
    ('00000000-0000-0000-0000-000000000101', 'conditional', 'DRAFT FOR HUMAN REVIEW — NOT LEGAL ADVICE', 'Draft: Reduce height to 6 ft (§4.3(b)); provide neighbor notice (Appendix A).');

COMMIT;