-- Create enhanced case studies table with all requested fields
CREATE TABLE public.case_studies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  client_name TEXT NOT NULL,
  access_code TEXT DEFAULT 'OSCAR',
  description TEXT,
  challenge TEXT,
  solution TEXT,
  result TEXT,
  tags TEXT[] DEFAULT '{}',
  categories TEXT[] DEFAULT '{}',
  media_urls JSONB DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admin can manage all case studies" 
ON public.case_studies 
FOR ALL 
USING (auth.email() = 'hrithishnachahal@gmail.com');

-- Create policy for public viewing of published case studies
CREATE POLICY "Public can view published case studies" 
ON public.case_studies 
FOR SELECT 
USING (status = 'published');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_case_studies_updated_at
BEFORE UPDATE ON public.case_studies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for case study media
INSERT INTO storage.buckets (id, name, public) 
VALUES ('case-study-media', 'case-study-media', true);

-- Create storage policies for media uploads
CREATE POLICY "Admin can upload media" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'case-study-media' AND auth.email() = 'hrithishnachahal@gmail.com');

CREATE POLICY "Admin can update media" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'case-study-media' AND auth.email() = 'hrithishnachahal@gmail.com');

CREATE POLICY "Admin can delete media" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'case-study-media' AND auth.email() = 'hrithishnachahal@gmail.com');

CREATE POLICY "Public can view media" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'case-study-media');

-- Create access codes table for front-end access control
CREATE TABLE public.access_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for access codes
ALTER TABLE public.access_codes ENABLE ROW LEVEL SECURITY;

-- Create policy for access codes
CREATE POLICY "Admin can manage access codes" 
ON public.access_codes 
FOR ALL 
USING (auth.email() = 'hrithishnachahal@gmail.com');

CREATE POLICY "Public can check access codes" 
ON public.access_codes 
FOR SELECT 
USING (is_active = true);

-- Insert the universal access code
INSERT INTO public.access_codes (code, description) 
VALUES ('OSCAR', 'Universal access code for case study viewing');

-- Insert admin user with new credentials
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'hrithishnachahal@gmail.com',
  crypt('OsC4r@2025', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  '',
  '',
  '',
  ''
);