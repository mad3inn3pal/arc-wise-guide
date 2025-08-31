-- Fix security issues: Add INSERT policy for org table
CREATE POLICY "Authenticated users can create organizations" 
ON public.org 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Fix the org_member table to allow self-insertion during org creation
CREATE OR REPLACE FUNCTION public.create_org_with_member(org_name TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_org_id UUID;
BEGIN
  -- Create the organization
  INSERT INTO public.org (name)
  VALUES (org_name)
  RETURNING id INTO new_org_id;
  
  -- Add the creator as an admin member
  INSERT INTO public.org_member (org_id, user_id, role)
  VALUES (new_org_id, auth.uid()::TEXT, 'admin');
  
  RETURN new_org_id;
END;
$$;

-- Drop the duplicate organizations table since we have org table
DROP TABLE IF EXISTS public.organizations CASCADE;
DROP TABLE IF EXISTS public.organization_members CASCADE;

-- Update the org_member table to allow self-insertion for new orgs
CREATE POLICY "Users can insert themselves as admin when creating org" 
ON public.org_member 
FOR INSERT 
WITH CHECK (auth.uid()::TEXT = user_id AND role = 'admin');