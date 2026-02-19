-- SQL Migration to align orders and order_items with checkout and Pesapal logic

-- 1. Update orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS pesapal_tracking_id TEXT,
ADD COLUMN IF NOT EXISTS payment_reference TEXT; -- Ensure it exists

-- 2. Update order_items table
-- The error mentioned 'price' column not found, but we also need to match what app/checkout/page.tsx inserts:
-- unit_price, total_price, product_name, product_image

ALTER TABLE public.order_items
ADD COLUMN IF NOT EXISTS unit_price DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS total_price DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS product_name TEXT,
ADD COLUMN IF NOT EXISTS product_image TEXT;

-- If 'price' column is missing or if we want to ensure it's there as a fallback
ALTER TABLE public.order_items
ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2);

-- 3. Update RLS policies to ensure these new columns are accessible
-- Usually RLS is per table, so new columns are covered by existing policies.
-- However, we'll refresh the policies just in case.

-- Orders refresh (allowing updates for payment tracking)
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;
CREATE POLICY "Users can update their own orders" ON public.orders 
FOR UPDATE USING (auth.uid() = user_id);

-- 4. Ensure Pesapal settings table/structure exists if needed
-- (Assuming site_settings covers this, but we can ensure the structure)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY,
    settings JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
