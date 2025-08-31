-- Create organizations table
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Create policies for organization access
CREATE POLICY "Users can view organizations they are members of" 
ON public.organizations 
FOR SELECT 
USING (public.is_org_member(id));

CREATE POLICY "Authenticated users can create organizations" 
ON public.organizations 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Create organization members junction table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.organization_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on organization_members
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

-- Create policies for organization members
CREATE POLICY "Users can view their own memberships" 
ON public.organization_members 
FOR SELECT 
USING (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can insert their own memberships" 
ON public.organization_members 
FOR INSERT 
WITH CHECK (auth.uid()::TEXT = user_id);

-- Create function to handle organization creation with member assignment
CREATE OR REPLACE FUNCTION public.create_organization_with_member(org_name TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_org_id UUID;
BEGIN
  -- Create the organization
  INSERT INTO public.organizations (name)
  VALUES (org_name)
  RETURNING id INTO new_org_id;
  
  -- Add the creator as an admin member
  INSERT INTO public.organization_members (org_id, user_id, role)
  VALUES (new_org_id, auth.uid()::TEXT, 'admin');
  
  RETURN new_org_id;
END;
$$;

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates on organizations
CREATE TRIGGER update_organizations_updated_at
BEFORE UPDATE ON public.organizations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();