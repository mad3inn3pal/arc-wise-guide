-- Create a test user with email/password for development
-- This creates a user that can sign in with email/password

-- First, we'll create the auth user with a password
-- Note: This is a development-only approach. In production, users should sign up normally.

-- Insert a user into auth.users with a hashed password
-- The password "meowmeow" will be hashed by Supabase
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud
)
SELECT
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'sauharda@hotmail.com',
  crypt('meowmeow', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  FALSE,
  'authenticated',
  'authenticated'
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'sauharda@hotmail.com'
);

-- Also create an identity record
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  u.id,
  jsonb_build_object(
    'email', 'sauharda@hotmail.com',
    'sub', u.id::text
  ),
  'email',
  NOW(),
  NOW(),
  NOW()
FROM auth.users u
WHERE u.email = 'sauharda@hotmail.com'
AND NOT EXISTS (
  SELECT 1 FROM auth.identities i 
  WHERE i.user_id = u.id AND i.provider = 'email'
);