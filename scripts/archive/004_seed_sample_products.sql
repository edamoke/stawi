-- Insert sample products
WITH category_ids AS (
  SELECT id, slug FROM categories
)
INSERT INTO products (name, slug, description, price, category_id, image_url, stock, is_active) VALUES
  (
    'Premium Brown Leather Sling Bag',
    'premium-brown-leather-sling-bag',
    'A beautifully crafted brown leather sling bag from our Ngozi Collection. Features premium African leather with traditional craftsmanship, adjustable strap, and secure zip closure. Perfect for daily essentials.',
    12500,
    (SELECT id FROM category_ids WHERE slug = 'sling-bags'),
    '/placeholder.svg?height=400&width=400',
    15,
    true
  ),
  (
    'Classic Black Leather Cross Body Bag',
    'classic-black-leather-cross-body-bag',
    'Classic black leather cross body bag from our Ngozi Collection. Designed for comfort and convenience with an adjustable strap, multiple compartments, and elegant finish.',
    14000,
    (SELECT id FROM category_ids WHERE slug = 'cross-body-bags'),
    '/placeholder.svg?height=400&width=400',
    20,
    true
  ),
  (
    'Tan Leather Side Bag',
    'tan-leather-side-bag',
    'Versatile tan leather side bag with spacious interior and premium finish. Perfect for work or casual outings.',
    16000,
    (SELECT id FROM category_ids WHERE slug = 'side-bags'),
    '/placeholder.svg?height=400&width=400',
    12,
    true
  ),
  (
    'Burgundy Leather Tote Bag',
    'burgundy-leather-tote-bag',
    'Elegant burgundy leather tote bag with reinforced handles and multiple pockets. Ideal for professionals.',
    18500,
    (SELECT id FROM category_ids WHERE slug = 'tote-bags'),
    '/placeholder.svg?height=400&width=400',
    8,
    true
  ),
  (
    'Vintage Brown Leather Backpack',
    'vintage-brown-leather-backpack',
    'Timeless vintage brown leather backpack with padded straps and laptop compartment. Built to last.',
    22000,
    (SELECT id FROM category_ids WHERE slug = 'backpacks'),
    '/placeholder.svg?height=400&width=400',
    10,
    true
  )
ON CONFLICT (slug) DO NOTHING;
