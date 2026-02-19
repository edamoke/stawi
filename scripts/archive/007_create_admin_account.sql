-- Create Admin Account for Trevor Collections
-- Run this script to set up the initial admin user

-- IMPORTANT: After running this script, you need to:
-- 1. Go to your Supabase dashboard
-- 2. Navigate to Authentication > Users
-- 3. Click "Add user" and create a user with:
--    Email: admin@trevor.com
--    Password: TrevorAdmin2024!
--    (or your preferred secure password)
-- 4. The trigger will automatically create a profile, but we need to update it to be admin

-- First, let's create a function to promote a user to admin by email
CREATE OR REPLACE FUNCTION public.promote_to_admin(user_email TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Get the user ID from auth.users
  SELECT id INTO user_id FROM auth.users WHERE email = user_email;
  
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
  
  -- Update the profile to be admin
  UPDATE public.profiles 
  SET is_admin = TRUE, 
      updated_at = NOW()
  WHERE id = user_id;
  
  -- If no profile exists, create one
  IF NOT FOUND THEN
    INSERT INTO public.profiles (id, email, is_admin, created_at, updated_at)
    VALUES (user_id, user_email, TRUE, NOW(), NOW());
  END IF;
  
  RAISE NOTICE 'User % has been promoted to admin', user_email;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.promote_to_admin(TEXT) TO service_role;

-- Instructions to create admin:
-- 1. First create the user in Supabase Auth (dashboard or API)
-- 2. Then run: SELECT public.promote_to_admin('admin@trevor.com');

-- Example admin credentials to set up:
-- Email: admin@trevor.com
-- Password: TrevorAdmin2024!
-- 
-- After creating the user in Supabase Auth, run:
-- SELECT public.promote_to_admin('admin@trevor.com');
