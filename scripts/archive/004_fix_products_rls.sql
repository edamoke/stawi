-- Fix infinite recursion in RLS policies
-- Run this script to fix the profiles and products policies

-- First, drop all existing policies on profiles that might cause recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- Drop product policies that reference profiles
DROP POLICY IF EXISTS "Admins can do everything with products" ON products;
DROP POLICY IF EXISTS "Admins can manage products" ON products;

-- Create a security definer function to check admin status without triggering RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role 
  FROM public.profiles 
  WHERE id = auth.uid();
  
  RETURN user_role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Make products publicly readable (no auth required for SELECT)
DROP POLICY IF EXISTS "Anyone can view active products" ON products;
CREATE POLICY "Anyone can view active products" ON products
  FOR SELECT USING (is_active = true);

-- Admins can manage products using the security definer function
CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (public.is_admin());

-- Fix profiles policies - users can only see their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Fix categories to be publicly readable
DROP POLICY IF EXISTS "Anyone can view categories" ON categories;
CREATE POLICY "Anyone can view categories" ON categories
  FOR SELECT USING (true);

-- Fix body_types to be publicly readable
DROP POLICY IF EXISTS "Anyone can view body types" ON body_types;
CREATE POLICY "Anyone can view body types" ON body_types
  FOR SELECT USING (true);
