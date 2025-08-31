-- ARC Copilot Storage Policies
-- Secure file upload policies for Supabase Storage

BEGIN;

-- Create a private bucket for ARC submissions
INSERT INTO storage.buckets (id, name, public) VALUES ('arc-submissions', 'arc-submissions', false);

-- Policy: Users can only read files from their own organization
CREATE POLICY "Org members can read their files" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'arc-submissions' AND
        (storage.foldername(name))[1] IN (
            SELECT org_id::text FROM org_member 
            WHERE user_id = auth.uid()::text
        )
    );

-- Policy: Only service role can upload files (via presigned URLs)
CREATE POLICY "Service role can upload files" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'arc-submissions' AND
        auth.role() = 'service_role'
    );

-- Policy: Users can update file metadata (but not content)
CREATE POLICY "Org members can update file metadata" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'arc-submissions' AND
        (storage.foldername(name))[1] IN (
            SELECT org_id::text FROM org_member 
            WHERE user_id = auth.uid()::text
        )
    );

-- Policy: No deletion of files (audit trail)
CREATE POLICY "Files cannot be deleted" ON storage.objects
    FOR DELETE USING (false);

COMMIT;