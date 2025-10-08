-- Add likes_count column to case_studies table
ALTER TABLE public.case_studies
ADD COLUMN likes_count INTEGER NOT NULL DEFAULT floor(random() * (117 - 15 + 1) + 15)::int;

-- Update existing case studies with random likes between 15 and 117
UPDATE public.case_studies
SET likes_count = floor(random() * (117 - 15 + 1) + 15)::int
WHERE likes_count IS NULL;

-- Create function to increment likes
CREATE OR REPLACE FUNCTION public.increment_case_study_likes(case_study_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count integer;
BEGIN
  UPDATE public.case_studies
  SET likes_count = likes_count + 1
  WHERE id = case_study_id
  RETURNING likes_count INTO new_count;
  
  RETURN new_count;
END;
$$;

-- Create RLS policy to allow public to call the increment function
CREATE POLICY "Anyone can increment likes"
ON public.case_studies
FOR UPDATE
USING (true)
WITH CHECK (true);