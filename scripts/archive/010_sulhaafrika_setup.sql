-- Sulhaafrika Database Setup
-- Creates tables, categories, and leather bag products for the Ngozi Collection

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table with admin role support
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  image_url TEXT,
  images TEXT[],
  stock INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  payment_reference TEXT,
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create wishlists table
CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, product_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view items from their orders" ON public.order_items;
DROP POLICY IF EXISTS "Users can insert items for their orders" ON public.order_items;
DROP POLICY IF EXISTS "Users can view their wishlist" ON public.wishlists;
DROP POLICY IF EXISTS "Users can manage their wishlist" ON public.wishlists;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Categories policies (public read)
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (TRUE);

-- Products policies (public read)
CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT USING (is_active = TRUE);

-- Orders policies
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order items policies
CREATE POLICY "Users can view items from their orders" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert items for their orders" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid())
);

-- Wishlist policies
CREATE POLICY "Users can view their wishlist" ON public.wishlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their wishlist" ON public.wishlists FOR ALL USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, is_admin)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE((new.raw_user_meta_data->>'is_admin')::BOOLEAN, FALSE)
  );
  RETURN new;
END;
$$;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_user ON public.wishlists(user_id);

-- =====================================================
-- INSERT CATEGORIES FOR LEATHER BAGS
-- =====================================================

INSERT INTO public.categories (name, slug, description, image_url) VALUES
  ('Sling Bags', 'sling-bags', 'Handcrafted leather sling bags with African-inspired designs', '/placeholder.svg?height=400&width=400'),
  ('Side Bags', 'side-bags', 'Premium leather side bags in maxi and mini sizes', '/placeholder.svg?height=400&width=400'),
  ('Cross Body Bags', 'cross-body-bags', 'Elegant leather cross body bags for everyday style', '/placeholder.svg?height=400&width=400')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url;

-- =====================================================
-- INSERT NGOZI COLLECTION LEATHER BAG PRODUCTS
-- =====================================================

-- Sling Bags
INSERT INTO public.products (name, slug, description, price, image_url, stock, is_active, category_id, images)
SELECT 
  'Brown Sling Bag',
  'brown-sling-bag',
  'Premium handcrafted brown leather sling bag from the Ngozi Collection. Features African-inspired stitching, adjustable strap, and interior pockets. Perfect for everyday elegance.',
  8500,
  '/placeholder.svg?height=600&width=600',
  25,
  true,
  id,
  ARRAY['/placeholder.svg?height=600&width=600', '/placeholder.svg?height=600&width=600']
FROM public.categories WHERE slug = 'sling-bags'
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  images = EXCLUDED.images,
  stock = EXCLUDED.stock,
  is_active = EXCLUDED.is_active;

INSERT INTO public.products (name, slug, description, price, image_url, stock, is_active, category_id, images)
SELECT 
  'Black Sling Bag',
  'black-sling-bag',
  'Sleek black leather sling bag from the Ngozi Collection. Minimalist design with premium leather, adjustable strap, and secure zipper closure.',
  8500,
  '/placeholder.svg?height=600&width=600',
  30,
  true,
  id,
  ARRAY['/placeholder.svg?height=600&width=600', '/placeholder.svg?height=600&width=600']
FROM public.categories WHERE slug = 'sling-bags'
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  images = EXCLUDED.images,
  stock = EXCLUDED.stock,
  is_active = EXCLUDED.is_active;

INSERT INTO public.products (name, slug, description, price, image_url, stock, is_active, category_id, images)
SELECT 
  'Brown and White Sling Bag',
  'brown-white-sling-bag',
  'Two-tone brown and white leather sling bag from the Ngozi Collection. Unique pattern combining rich brown leather with white accents. Handcrafted with attention to detail.',
  9500,
  '/placeholder.svg?height=600&width=600',
  20,
  true,
  id,
  ARRAY['/placeholder.svg?height=600&width=600', '/placeholder.svg?height=600&width=600']
FROM public.categories WHERE slug = 'sling-bags'
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  images = EXCLUDED.images,
  stock = EXCLUDED.stock,
  is_active = EXCLUDED.is_active;

INSERT INTO public.products (name, slug, description, price, image_url, stock, is_active, category_id, images)
SELECT 
  'Black and White Sling Bag',
  'black-white-sling-bag',
  'Contemporary black and white leather sling bag from the Ngozi Collection. Bold contrast design with premium materials and expert craftsmanship.',
  9500,
  '/placeholder.svg?height=600&width=600',
  18,
  true,
  id,
  ARRAY['/placeholder.svg?height=600&width=600', '/placeholder.svg?height=600&width=600']
FROM public.categories WHERE slug = 'sling-bags'
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  images = EXCLUDED.images,
  stock = EXCLUDED.stock,
  is_active = EXCLUDED.is_active;

-- Side Bags (Maxi)
INSERT INTO public.products (name, slug, description, price, image_url, stock, is_active, category_id, images)
SELECT 
  'Maxi Black Side Bag',
  'maxi-black-side-bag',
  'Large black leather side bag from the Ngozi Collection. Spacious interior with multiple compartments, perfect for work or travel. Premium full-grain leather construction.',
  12500,
  '/placeholder.svg?height=600&width=600',
  15,
  true,
  id,
  ARRAY['/placeholder.svg?height=600&width=600', '/placeholder.svg?height=600&width=600']
FROM public.categories WHERE slug = 'side-bags'
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  images = EXCLUDED.images,
  stock = EXCLUDED.stock,
  is_active = EXCLUDED.is_active;

INSERT INTO public.products (name, slug, description, price, image_url, stock, is_active, category_id, images)
SELECT 
  'Maxi Brown Side Bag',
  'maxi-brown-side-bag',
  'Large brown leather side bag from the Ngozi Collection. Rich tan leather with brass hardware, multiple pockets, and adjustable shoulder strap.',
  12500,
  '/placeholder.svg?height=600&width=600',
  12,
  true,
  id,
  ARRAY['/placeholder.svg?height=600&width=600', '/placeholder.svg?height=600&width=600']
FROM public.categories WHERE slug = 'side-bags'
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  images = EXCLUDED.images,
  stock = EXCLUDED.stock,
  is_active = EXCLUDED.is_active;

-- Side Bags (Mini)
INSERT INTO public.products (name, slug, description, price, image_url, stock, is_active, category_id, images)
SELECT 
  'Mini Black Side Bag',
  'mini-black-side-bag',
  'Compact black leather side bag from the Ngozi Collection. Perfect for essentials - phone, wallet, keys. Sleek design with secure closure.',
  6500,
  '/placeholder.svg?height=600&width=600',
  35,
  true,
  id,
  ARRAY['/placeholder.svg?height=600&width=600', '/placeholder.svg?height=600&width=600']
FROM public.categories WHERE slug = 'side-bags'
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  images = EXCLUDED.images,
  stock = EXCLUDED.stock,
  is_active = EXCLUDED.is_active;

INSERT INTO public.products (name, slug, description, price, image_url, stock, is_active, category_id, images)
SELECT 
  'Mini Brown Side Bag',
  'mini-brown-side-bag',
  'Compact brown leather side bag from the Ngozi Collection. Warm caramel tones with gold hardware. Ideal for evening outings and casual wear.',
  6500,
  '/placeholder.svg?height=600&width=600',
  28,
  true,
  id,
  ARRAY['/placeholder.svg?height=600&width=600', '/placeholder.svg?height=600&width=600']
FROM public.categories WHERE slug = 'side-bags'
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  images = EXCLUDED.images,
  stock = EXCLUDED.stock,
  is_active = EXCLUDED.is_active;

-- Cross Body Bags
INSERT INTO public.products (name, slug, description, price, image_url, stock, is_active, category_id, images)
SELECT 
  'Black Cross Body Bag',
  'black-cross-body-bag',
  'Elegant black leather cross body bag from the Ngozi Collection. Long adjustable strap, front flap closure, and organized interior. Perfect for hands-free style.',
  7500,
  '/placeholder.svg?height=600&width=600',
  22,
  true,
  id,
  ARRAY['/placeholder.svg?height=600&width=600', '/placeholder.svg?height=600&width=600']
FROM public.categories WHERE slug = 'cross-body-bags'
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  images = EXCLUDED.images,
  stock = EXCLUDED.stock,
  is_active = EXCLUDED.is_active;

INSERT INTO public.products (name, slug, description, price, image_url, stock, is_active, category_id, images)
SELECT 
  'Brown Cross Body Bag',
  'brown-cross-body-bag',
  'Classic brown leather cross body bag from the Ngozi Collection. Timeless design with premium saddle leather, antique brass hardware, and comfortable strap.',
  7500,
  '/placeholder.svg?height=600&width=600',
  25,
  true,
  id,
  ARRAY['/placeholder.svg?height=600&width=600', '/placeholder.svg?height=600&width=600']
FROM public.categories WHERE slug = 'cross-body-bags'
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  images = EXCLUDED.images,
  stock = EXCLUDED.stock,
  is_active = EXCLUDED.is_active;
