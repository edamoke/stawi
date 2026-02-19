-- SQL Migration to fix RLS infinite recursion and align schema

-- 1. Fix Profiles RLS (Infinite Recursion Fix)
-- The original policy "Admins can view all profiles" used "EXISTS (SELECT 1 FROM public.profiles ...)"
-- which causes recursion because checking the policy for 'profiles' requires selecting from 'profiles'.

-- First, drop the problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;

-- Solution: Use JWT claims or a direct non-recursive check.
-- For Supabase, the best way to handle admin checks in RLS without recursion is 
-- often to check the `is_admin` column directly if possible, or use a function.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = TRUE
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Re-create profiles policy using the function (carefully) 
-- Or better: Use the JWT metadata if you set it there, but here we'll use a direct check for id.
CREATE POLICY "Admins can view all profiles" ON public.profiles 
FOR SELECT USING (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = TRUE
);

-- Actually, even simpler for the profiles table itself:
-- A user can see their own, and if they are an admin they can see all.
-- To avoid recursion, the admin check should ideally not select from the same table in a way that triggers the policy again.

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles 
FOR SELECT USING (
  id = auth.uid() OR 
  (auth.jwt() ->> 'is_admin')::boolean = true OR
  EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND (raw_user_meta_data->>'is_admin')::boolean = true)
);

-- If you don't use JWT claims, here is the standard fix using a separate schema or a security definer function that is NOT restricted by RLS.
-- But the simplest fix for "infinite recursion" is often to ensure the admin check doesn't trigger the same policy.

-- 2. Update orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS pesapal_tracking_id TEXT,
ADD COLUMN IF NOT EXISTS payment_reference TEXT;

-- 3. Update order_items table
ALTER TABLE public.order_items
ADD COLUMN IF NOT EXISTS unit_price DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS total_price DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS product_name TEXT,
ADD COLUMN IF NOT EXISTS product_image TEXT,
ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2);

-- 4. Corrected Admin Policies for other tables (using the profile check)
CREATE POLICY "Admins can view all orders" ON public.orders 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

CREATE POLICY "Admins can update all orders" ON public.orders 
FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

CREATE POLICY "Admins can view all order items" ON public.order_items 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- 5. Fix for Orders Update for Users (Needed for payment tracking)
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;
CREATE POLICY "Users can update their own orders" ON public.orders 
FOR UPDATE USING (auth.uid() = user_id);

-- 6. Ensure site_settings exists
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY,
    settings JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view settings" ON public.site_settings FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage settings" ON public.site_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);
