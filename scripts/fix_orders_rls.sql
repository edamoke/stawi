-- Fix RLS policies for orders to allow updates during payment processing
-- and ensure anonymous users can create orders if needed (though app currently requires login)

-- 1. Orders table: Allow users to update their own pending orders (needed for Pesapal tracking ID)
DROP POLICY IF EXISTS "Users can update own orders" ON public.orders;
CREATE POLICY "Users can update own orders" ON public.orders
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 2. Allow anonymous order creation if needed (optional, depends on app requirements)
-- But for now, let's just make sure the update policy is solid.

-- 3. Ensure admins can update everything
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Admins can update orders" ON public.orders
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  ));

-- 4. Order Items: Ensure users can insert items for their orders
DROP POLICY IF EXISTS "Users can insert items for their orders" ON public.order_items;
CREATE POLICY "Users can insert items for their orders" ON public.order_items
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE id = order_id
      AND (user_id = auth.uid() OR user_id IS NULL)
    )
  );
