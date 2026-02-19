-- Add more categories
INSERT INTO public.categories (name, slug, description, image_url) VALUES
  ('Accessories', 'accessories', 'Beautiful handcrafted accessories', '/elegant-african-gold-jewelry-accessories-black-wom.jpg'),
  ('Resort Wear', 'resort-wear', 'Beach and resort ready pieces', '/black-african-woman-model-resort-swimwear-lamu-isl.jpg'),
  ('Shoes', 'shoes', 'Elegant footwear collection', '/tan-strappy-heeled-sandals-shoes.jpg')
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url,
  description = EXCLUDED.description;

-- Update existing categories with images
UPDATE public.categories SET image_url = '/beautiful-black-african-woman-model-elegant-dress-.jpg' WHERE slug = 'dresses';
UPDATE public.categories SET image_url = '/white-linen-coord-set-tropical-garden.jpg' WHERE slug = 'co-ords';
UPDATE public.categories SET image_url = '/white-cotton-bralette-fashion-model.jpg' WHERE slug = 'tops';
UPDATE public.categories SET image_url = '/white-parachute-trousers-beach-fashion.jpg' WHERE slug = 'bottoms';

-- Insert products with proper images
-- First, let's get category IDs and insert products

-- Dresses
INSERT INTO public.products (name, slug, description, price, image_url, stock, is_active, category_id, images)
SELECT 
  'Diani Wrap Dress',
  'diani-wrap-dress',
  'A stunning wrap dress inspired by the beaches of Diani. Made from breathable cotton with a flattering silhouette.',
  12500,
  '/beautiful-black-african-woman-model-elegant-dress-.jpg',
  25,
  true,
  id,
  ARRAY['/beautiful-black-african-woman-model-elegant-dress-.jpg', '/beautiful-black-african-woman-model-elegant-resort.jpg']
FROM public.categories WHERE slug = 'dresses'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url,
  images = EXCLUDED.images,
  is_active = true;

INSERT INTO public.products (name, slug, description, price, image_url, stock, is_active, category_id, images)
SELECT 
  'Mombasa Tiered Dress',
  'mombasa-tiered-dress',
  'Elegant tiered white dress perfect for coastal evenings. Lightweight and flowing fabric.',
  15800,
  '/elegant-tiered-white-dress-desert-fashion.jpg',
  18,
  true,
  id,
  ARRAY['/elegant-tiered-white-dress-desert-fashion.jpg', '/elegant-tiered-white-dress-terracotta-building-fas.jpg']
FROM public.categories WHERE slug = 'dresses'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url,
  images = EXCLUDED.images,
  is_active = true;

INSERT INTO public.products (name, slug, description, price, image_url, stock, is_active, category_id, images)
SELECT 
  'Lamu Beach Dress',
  'lamu-beach-dress',
  'A beautiful resort dress perfect for beach days and tropical evenings in Lamu.',
  14200,
  '/kenyan-woman-in-elegant-resort-dress-mombasa-beach.jpg',
  22,
  true,
  id,
  ARRAY['/kenyan-woman-in-elegant-resort-dress-mombasa-beach.jpg']
FROM public.categories WHERE slug = 'dresses'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url,
  images = EXCLUDED.images,
  is_active = true;

INSERT INTO public.products (name, slug, description, price, image_url, stock, is_active, category_id, images)
SELECT 
  'Tropical Garden Dress',
  'tropical-garden-dress',
  'Vibrant dress inspired by Kenya''s tropical gardens. Features bold florals and comfortable fit.',
  13500,
  '/tropical-garden-palm-leaves-red-flowers-fashion-mo.jpg',
  15,
  true,
  id,
  ARRAY['/tropical-garden-palm-leaves-red-flowers-fashion-mo.jpg']
FROM public.categories WHERE slug = 'dresses'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url,
  images = EXCLUDED.images,
  is_active = true;

-- Co-ords
INSERT INTO public.products (name, slug, description, price, image_url, stock, is_active, category_id, images)
SELECT 
  'Lamu Linen Set',
  'lamu-linen-set',
  'Premium linen co-ord set in crisp white. Perfect for warm coastal days.',
  18900,
  '/white-linen-coord-set-tropical-garden.jpg',
  20,
  true,
  id,
  ARRAY['/white-linen-coord-set-tropical-garden.jpg', '/white-linen-coord-set-tropical-garden-berries-fash.jpg']
FROM public.categories WHERE slug = 'co-ords'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url,
  images = EXCLUDED.images,
  is_active = true;

INSERT INTO public.products (name, slug, description, price, image_url, stock, is_active, category_id, images)
SELECT 
  'Safari Coord Set',
  'safari-coord-set',
  'Neutral toned matching set perfect for safari adventures and city strolls.',
  16500,
  '/kenyan-fashion-instagram-lifestyle-.jpg',
  14,
  true,
  id,
  ARRAY['/kenyan-fashion-instagram-lifestyle-.jpg']
FROM public.categories WHERE slug = 'co-ords'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url,
  images = EXCLUDED.images,
  is_active = true;

-- Tops
INSERT INTO public.products (name, slug, description, price, image_url, stock, is_active, category_id, images)
SELECT 
  'Coastal Bralette',
  'coastal-bralette',
  'Delicate white cotton bralette top. Perfect for layering or beach days.',
  4500,
  '/white-cotton-bralette-fashion-model.jpg',
  30,
  true,
  id,
  ARRAY['/white-cotton-bralette-fashion-model.jpg']
FROM public.categories WHERE slug = 'tops'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url,
  images = EXCLUDED.images,
  is_active = true;

INSERT INTO public.products (name, slug, description, price, image_url, stock, is_active, category_id, images)
SELECT 
  'Savanna Orange Vest',
  'savanna-orange-vest',
  'Bold orange vest top inspired by Kenyan sunsets. Flattering cut and premium fabric.',
  5200,
  '/orange-vest-top-fashion-model.jpg',
  28,
  true,
  id,
  ARRAY['/orange-vest-top-fashion-model.jpg']
FROM public.categories WHERE slug = 'tops'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url,
  images = EXCLUDED.images,
  is_active = true;

-- Bottoms
INSERT INTO public.products (name, slug, description, price, image_url, stock, is_active, category_id, images)
SELECT 
  'Watamu Parachute Trousers',
  'watamu-parachute-trousers',
  'Flowing white parachute trousers perfect for the beach. Comfortable and stylish.',
  8900,
  '/white-parachute-trousers-beach-fashion.jpg',
  24,
  true,
  id,
  ARRAY['/white-parachute-trousers-beach-fashion.jpg', '/white-parachute-trousers-beach-model.jpg']
FROM public.categories WHERE slug = 'bottoms'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url,
  images = EXCLUDED.images,
  is_active = true;

-- Accessories
INSERT INTO public.products (name, slug, description, price, image_url, stock, is_active, category_id, images)
SELECT 
  'Malindi Gold Necklace',
  'malindi-gold-necklace',
  'Handcrafted gold necklace inspired by traditional Kenyan jewelry. Statement piece for any outfit.',
  4500,
  '/elegant-african-gold-jewelry-accessories-black-wom.jpg',
  35,
  true,
  id,
  ARRAY['/elegant-african-gold-jewelry-accessories-black-wom.jpg', '/elegant-african-accessories-jewelry-gold.jpg']
FROM public.categories WHERE slug = 'accessories'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url,
  images = EXCLUDED.images,
  is_active = true;

INSERT INTO public.products (name, slug, description, price, image_url, stock, is_active, category_id, images)
SELECT 
  'Nairobi Gold Hoops',
  'nairobi-gold-hoops',
  'Classic gold hoop earrings with a modern twist. Perfect for everyday elegance.',
  3200,
  '/gold-hoop-earrings-jewelry.jpg',
  40,
  true,
  id,
  ARRAY['/gold-hoop-earrings-jewelry.jpg']
FROM public.categories WHERE slug = 'accessories'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url,
  images = EXCLUDED.images,
  is_active = true;

INSERT INTO public.products (name, slug, description, price, image_url, stock, is_active, category_id, images)
SELECT 
  'Watamu Beach Bag',
  'watamu-beach-bag',
  'Spacious red canvas tote bag perfect for beach days and shopping trips.',
  7800,
  '/red-canvas-tote-bag-fashion.jpg',
  20,
  true,
  id,
  ARRAY['/red-canvas-tote-bag-fashion.jpg']
FROM public.categories WHERE slug = 'accessories'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url,
  images = EXCLUDED.images,
  is_active = true;

-- Resort Wear
INSERT INTO public.products (name, slug, description, price, image_url, stock, is_active, category_id, images)
SELECT 
  'Lamu Island Swimwear',
  'lamu-island-swimwear',
  'Beautiful resort swimwear perfect for Kenya''s stunning beaches. Bold patterns and comfortable fit.',
  9500,
  '/black-african-woman-model-resort-swimwear-lamu-isl.jpg',
  18,
  true,
  id,
  ARRAY['/black-african-woman-model-resort-swimwear-lamu-isl.jpg', '/african-resort-wear-swimwear-lamu-island.jpg']
FROM public.categories WHERE slug = 'resort-wear'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url,
  images = EXCLUDED.images,
  is_active = true;

INSERT INTO public.products (name, slug, description, price, image_url, stock, is_active, category_id, images)
SELECT 
  'Tropical Resort Set',
  'tropical-resort-set',
  'Vibrant resort set perfect for poolside lounging and beach walks.',
  11200,
  '/beautiful-african-woman-in-elegant-tropical-resort.jpg',
  15,
  true,
  id,
  ARRAY['/beautiful-african-woman-in-elegant-tropical-resort.jpg']
FROM public.categories WHERE slug = 'resort-wear'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url,
  images = EXCLUDED.images,
  is_active = true;

-- Shoes
INSERT INTO public.products (name, slug, description, price, image_url, stock, is_active, category_id, images)
SELECT 
  'Diani Strappy Sandals',
  'diani-strappy-sandals',
  'Elegant tan strappy heeled sandals. Perfect for evening events and dinner dates.',
  8500,
  '/tan-strappy-heeled-sandals-shoes.jpg',
  22,
  true,
  id,
  ARRAY['/tan-strappy-heeled-sandals-shoes.jpg']
FROM public.categories WHERE slug = 'shoes'
ON CONFLICT (slug) DO UPDATE SET
  image_url = EXCLUDED.image_url,
  images = EXCLUDED.images,
  is_active = true;
