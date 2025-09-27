-- Remove the public SELECT policy that exposes access codes
DROP POLICY IF EXISTS "Public can check access codes" ON public.access_codes;

-- Create a security definer function to verify access codes without exposing them
CREATE OR REPLACE FUNCTION public.verify_access_code(input_code text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.access_codes
    WHERE code = upper(input_code)
      AND is_active = true
  );
$$;

-- Grant execute permission to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION public.verify_access_code(text) TO authenticated, anon;