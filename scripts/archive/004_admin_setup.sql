-- Admin User Setup Script
-- This script sets up the admin user edamoke@gmail.com with proper RLS policies

-- Step 1: Set the admin flag for the user (once they sign up via auth)
-- Note: The user needs to sign up first at /admin/login with email: edamoke@gmail.com and password: HobbitKing@1980

-- Step 2: Create a TRIGGER to automatically set is_admin based on email
-- This ensures any user with this email is set as admin on signup

CREATE OR REPLACE FUNCTION public.auto_set_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Set is_admin to TRUE if email is edamoke@gmail.com
  IF NEW.email = 'edamoke@gmail.com' THEN
    NEW.is_admin = TRUE;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS auto_set_admin_trigger ON public.profiles;
CREATE TRIGGER auto_set_admin_trigger
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.auto_set_admin();

-- Step 3: Verify the security definer function works correctly
-- Test query to check if current user is admin
-- SELECT public.is_admin();

-- Step 4: Update existing profile if user already exists
UPDATE public.profiles 
SET is_admin = TRUE 
WHERE email = 'edamoke@gmail.com';

-- Step 5: Ensure all RLS policies are in place for admin operations on products
-- These policies allow admins to CRUD products

-- Check that products table has the necessary policies
-- Products should have:
-- 1. Anyone can view active products (SELECT WHERE is_active = TRUE OR is_admin())
-- 2. Admins can insert products (INSERT WITH CHECK is_admin())
-- 3. Admins can update products (UPDATE USING is_admin())
-- 4. Admins can delete products (DELETE USING is_admin())

-- Verify categories policies
-- Categories should allow:
-- 1. Anyone can view categories (SELECT)
-- 2. Admins can insert/update/delete categories

-- Step 6: Refresh the schema to ensure changes take effect
-- After running this script, the user must sign up again or manually update their is_admin flag

-- Diagnostic query to verify admin setup
-- SELECT email, is_admin FROM public.profiles WHERE email = 'edamoke@gmail.com';
