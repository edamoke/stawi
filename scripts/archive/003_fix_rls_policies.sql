-- Fix infinite recursion in RLS policies
-- The issue is that admin check policies reference the profiles table, which itself has RLS enabled

-- Drop problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Drop all admin check policies on other tables that cause recursion
DROP POLICY IF EXISTS "Admins can insert categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can update categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can delete categories" ON public.categories;
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
DROP POLICY IF EXISTS "Admins can insert body types" ON public.body_types;
DROP POLICY IF EXISTS "Admins can update body types" ON public.body_types;
DROP POLICY IF EXISTS "Admins can delete body types" ON public.body_types;
DROP POLICY IF EXISTS "Admins can view all tryons" ON public.virtual_tryons;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;

-- Create a security definer function to check admin status (bypasses RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()),
    FALSE
  );
$$;

-- Recreate profiles policies without recursion
CREATE POLICY "Users can view their own profile" ON public.profiles 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles 
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update all profiles" ON public.profiles 
  FOR UPDATE USING (public.is_admin());

-- Recreate category policies using the function
CREATE POLICY "Admins can insert categories" ON public.categories 
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update categories" ON public.categories 
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete categories" ON public.categories 
  FOR DELETE USING (public.is_admin());

-- Recreate product policies using the function
CREATE POLICY "Anyone can view active products" ON public.products 
  FOR SELECT USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admins can insert products" ON public.products 
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update products" ON public.products 
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete products" ON public.products 
  FOR DELETE USING (public.is_admin());

-- Recreate body_types policies using the function
CREATE POLICY "Admins can insert body types" ON public.body_types 
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update body types" ON public.body_types 
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete body types" ON public.body_types 
  FOR DELETE USING (public.is_admin());

-- Recreate virtual_tryons admin policy
CREATE POLICY "Admins can view all tryons" ON public.virtual_tryons 
  FOR SELECT USING (public.is_admin());

-- Recreate orders admin policies
CREATE POLICY "Admins can view all orders" ON public.orders 
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update all orders" ON public.orders 
  FOR UPDATE USING (public.is_admin());

-- Recreate order_items admin policy
CREATE POLICY "Admins can view all order items" ON public.order_items 
  FOR SELECT USING (public.is_admin());
