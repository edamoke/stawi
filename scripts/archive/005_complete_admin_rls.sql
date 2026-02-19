-- Complete Admin RLS Policy Fix
-- Ensures admins can fully manage products, categories, and orders

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;

DROP POLICY IF EXISTS "Admins can insert categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can update categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can delete categories" ON public.categories;

-- Recreate the security definer function (improved version)
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

-- ============ PRODUCTS TABLE POLICIES ============
-- Anyone can view active products
CREATE POLICY "Anyone can view active products" ON public.products 
  FOR SELECT USING (is_active = TRUE);

-- Admins can view all products (including inactive)
CREATE POLICY "Admins can view all products" ON public.products 
  FOR SELECT USING (public.is_admin());

-- Admins can create products
CREATE POLICY "Admins can insert products" ON public.products 
  FOR INSERT WITH CHECK (public.is_admin());

-- Admins can update products
CREATE POLICY "Admins can update products" ON public.products 
  FOR UPDATE USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Admins can delete products
CREATE POLICY "Admins can delete products" ON public.products 
  FOR DELETE USING (public.is_admin());

-- ============ CATEGORIES TABLE POLICIES ============
-- Anyone can view categories
CREATE POLICY "Anyone can view categories" ON public.categories 
  FOR SELECT USING (TRUE);

-- Admins can create categories
CREATE POLICY "Admins can insert categories" ON public.categories 
  FOR INSERT WITH CHECK (public.is_admin());

-- Admins can update categories
CREATE POLICY "Admins can update categories" ON public.categories 
  FOR UPDATE USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Admins can delete categories
CREATE POLICY "Admins can delete categories" ON public.categories 
  FOR DELETE USING (public.is_admin());

-- ============ PROFILES TABLE POLICIES ============
-- Users can view their own profile
CREATE POLICY "Users can view their own profile" ON public.profiles 
  FOR SELECT USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles 
  FOR SELECT USING (public.is_admin());

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles" ON public.profiles 
  FOR UPDATE USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Admins can insert profiles
CREATE POLICY "Admins can insert profiles" ON public.profiles 
  FOR INSERT WITH CHECK (public.is_admin() OR auth.uid() = id);

-- ============ ORDERS TABLE POLICIES ============
-- Users can view their own orders
CREATE POLICY "Users can view own orders" ON public.orders 
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can view all orders
CREATE POLICY "Admins can view all orders" ON public.orders 
  FOR SELECT USING (public.is_admin());

-- Users can create orders
CREATE POLICY "Users can insert own orders" ON public.orders 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can update orders
CREATE POLICY "Admins can update orders" ON public.orders 
  FOR UPDATE USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============ ORDER_ITEMS TABLE POLICIES ============
-- Users can view items from their orders
CREATE POLICY "Users can view own order items" ON public.order_items 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid())
  );

-- Admins can view all order items
CREATE POLICY "Admins can view all order items" ON public.order_items 
  FOR SELECT USING (public.is_admin());

-- Users can create order items for their orders
CREATE POLICY "Users can insert own order items" ON public.order_items 
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid())
  );

-- Admins can manage order items
CREATE POLICY "Admins can update order items" ON public.order_items 
  FOR UPDATE USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete order items" ON public.order_items 
  FOR DELETE USING (public.is_admin());

-- ============ VIRTUAL_TRYONS TABLE POLICIES ============
-- Users can view their own tryons
CREATE POLICY "Users can view own tryons" ON public.virtual_tryons 
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can view all tryons
CREATE POLICY "Admins can view all tryons" ON public.virtual_tryons 
  FOR SELECT USING (public.is_admin());

-- Users can create tryons
CREATE POLICY "Users can insert own tryons" ON public.virtual_tryons 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can update tryons
CREATE POLICY "Admins can update tryons" ON public.virtual_tryons 
  FOR UPDATE USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============ WISHLISTS TABLE POLICIES ============
-- Users can view their own wishlist
CREATE POLICY "Users can view own wishlist" ON public.wishlists 
  FOR SELECT USING (auth.uid() = user_id);

-- Users can add to wishlist
CREATE POLICY "Users can insert own wishlist" ON public.wishlists 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can remove from wishlist
CREATE POLICY "Users can delete own wishlist" ON public.wishlists 
  FOR DELETE USING (auth.uid() = user_id);

-- Admins can manage all wishlists
CREATE POLICY "Admins can view all wishlists" ON public.wishlists 
  FOR SELECT USING (public.is_admin());

-- Notify that setup is complete
-- After running this script, sign up at /admin/login with:
-- Email: edamoke@gmail.com
-- Password: HobbitKing@1980
