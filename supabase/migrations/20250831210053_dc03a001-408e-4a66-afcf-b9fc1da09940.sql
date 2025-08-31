-- Update the test user password to ensure it works
UPDATE auth.users 
SET encrypted_password = crypt('meowmeow', gen_salt('bf'))
WHERE email = 'sauharda@hotmail.com';