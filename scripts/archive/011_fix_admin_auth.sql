-- Fix Admin Authentication for edamoke@gmail.com
-- This script ensures the admin user can access the admin panel

-- Step 1: Create a security definer function to safely check admin status
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_is_admin BOOLEAN;
BEGIN
  SELECT is_admin INTO user_is_admin 
  FROM public.profiles 
  WHERE id = auth.uid();
  
  RETURN COALESCE(user_is_admin, FALSE);
END;
$$;

-- Step 2: Update the auto_set_admin trigger to ensure it runs properly
DROP TRIGGER IF EXISTS auto_set_admin_trigger ON public.profiles;

CREATE OR REPLACE FUNCTION public.auto_set_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'edamoke@gmail.com' THEN
    NEW.is_admin = TRUE;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER auto_set_admin_trigger
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.auto_set_admin();

-- Step 3: If the user already exists, update them to admin
UPDATE public.profiles 
SET is_admin = TRUE, updated_at = NOW()
WHERE email = 'edamoke@gmail.com';

-- Step 4: Enable admin policies on products table
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;

CREATE POLICY "Admins can insert products" ON public.products 
FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update products" ON public.products 
FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete products" ON public.products 
FOR DELETE USING (public.is_admin());

-- Step 5: Enable admin policies on categories table
DROP POLICY IF EXISTS "Admins can insert categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can update categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can delete categories" ON public.categories;

CREATE POLICY "Admins can insert categories" ON public.categories 
FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update categories" ON public.categories 
FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete categories" ON public.categories 
FOR DELETE USING (public.is_admin());

-- Diagnostic query to verify
SELECT 'Admin user setup complete. Current admin status:' as message;
SELECT email, is_admin FROM public.profiles WHERE email = 'edamoke@gmail.com';
