-- Migration to add items to the Ngozi Collection
-- Categories: Sling Bags, Side Bags, Cross Body Bags, Tote Bags, Backpacks

WITH category_ids AS (
  SELECT id, slug FROM categories
)
INSERT INTO products (name, slug, description, price, category_id, image_url, images, stock, is_active) VALUES
  (
    'Ngozi Premium Sling Bag 4819',
    'ngozi-premium-sling-bag-4819',
    'Part of the Ngozi Collection. Exquisitely crafted premium leather sling bag.',
    5500,
    (SELECT id FROM category_ids WHERE slug = 'sling-bags'),
    '/products/ngozi-collection/IMG_4819 (Large).jpg',
    ARRAY['/products/ngozi-collection/IMG_4819 (Large).jpg'],
    10,
    true
  ),
  (
    'Ngozi Classic Side Bag 4785',
    'ngozi-classic-side-bag-4785',
    'Part of the Ngozi Collection. Versatile and elegant side bag.',
    6800,
    (SELECT id FROM category_ids WHERE slug = 'side-bags'),
    '/products/ngozi-collection/IMG_4785 (Large).jpg',
    ARRAY['/products/ngozi-collection/IMG_4785 (Large).jpg'],
    10,
    true
  ),
  (
    'Ngozi Cross Body Bag 4766',
    'ngozi-cross-body-bag-4766',
    'Part of the Ngozi Collection. Comfortable and stylish crossbody bag.',
    5800,
    (SELECT id FROM category_ids WHERE slug = 'cross-body-bags'),
    '/products/ngozi-collection/IMG_4766 (Large).jpg',
    ARRAY['/products/ngozi-collection/IMG_4766 (Large).jpg'],
    10,
    true
  ),
  (
    'Ngozi Elegant Tote Bag 4813',
    'ngozi-elegant-tote-bag-4813',
    'Part of the Ngozi Collection. Spacious tote bag for all your essentials.',
    8500,
    (SELECT id FROM category_ids WHERE slug = 'tote-bags'),
    '/products/ngozi-collection/IMG_4813 (Large).jpg',
    ARRAY['/products/ngozi-collection/IMG_4813 (Large).jpg'],
    10,
    true
  ),
  (
    'Ngozi Durable Backpack 4778',
    'ngozi-durable-backpack-4778',
    'Part of the Ngozi Collection. High-quality leather backpack for daily use.',
    12000,
    (SELECT id FROM category_ids WHERE slug = 'backpacks'),
    '/products/ngozi-collection/IMG_4778 (Large).jpg',
    ARRAY['/products/ngozi-collection/IMG_4778 (Large).jpg'],
    10,
    true
  ),
  (
    'Ngozi Leather Item 4760',
    'ngozi-leather-item-4760',
    'Part of the Ngozi Collection. Authentic leather craftsmanship.',
    4500,
    (SELECT id FROM category_ids WHERE slug = 'sling-bags'),
    '/products/ngozi-collection/IMG_4760 (Large).jpg',
    ARRAY['/products/ngozi-collection/IMG_4760 (Large).jpg'],
    10,
    true
  ),
  (
    'Ngozi Leather Item 4745',
    'ngozi-leather-item-4745',
    'Part of the Ngozi Collection. Handcrafted with precision.',
    4800,
    (SELECT id FROM category_ids WHERE slug = 'side-bags'),
    '/products/ngozi-collection/IMG_4745 (Large).jpg',
    ARRAY['/products/ngozi-collection/IMG_4745 (Large).jpg'],
    10,
    true
  ),
  (
    'Ngozi Leather Item 4741',
    'ngozi-leather-item-4741',
    'Part of the Ngozi Collection. Timeless design.',
    5200,
    (SELECT id FROM category_ids WHERE slug = 'cross-body-bags'),
    '/products/ngozi-collection/IMG_4741 (Large).jpg',
    ARRAY['/products/ngozi-collection/IMG_4741 (Large).jpg'],
    10,
    true
  ),
  (
    'Ngozi Leather Item 4709',
    'ngozi-leather-item-4709',
    'Part of the Ngozi Collection. Premium quality materials.',
    7500,
    (SELECT id FROM category_ids WHERE slug = 'tote-bags'),
    '/products/ngozi-collection/IMG_4709 (Large).jpg',
    ARRAY['/products/ngozi-collection/IMG_4709 (Large).jpg'],
    10,
    true
  ),
  (
    'Ngozi Leather Item 4708',
    'ngozi-leather-item-4708',
    'Part of the Ngozi Collection. Elegant and practical.',
    11000,
    (SELECT id FROM category_ids WHERE slug = 'backpacks'),
    '/products/ngozi-collection/IMG_4708_(copy) (Large).jpg',
    ARRAY['/products/ngozi-collection/IMG_4708_(copy) (Large).jpg'],
    10,
    true
  ),
  (
    'Ngozi Leather Item 4701',
    'ngozi-leather-item-4701',
    'Part of the Ngozi Collection. Unique African style.',
    4200,
    (SELECT id FROM category_ids WHERE slug = 'sling-bags'),
    '/products/ngozi-collection/IMG_4701 (Large).jpg',
    ARRAY['/products/ngozi-collection/IMG_4701 (Large).jpg'],
    10,
    true
  ),
  (
    'Ngozi Leather Item 4700',
    'ngozi-leather-item-4700',
    'Part of the Ngozi Collection. Beautifully finished.',
    4600,
    (SELECT id FROM category_ids WHERE slug = 'side-bags'),
    '/products/ngozi-collection/IMG_4700 (Large).jpg',
    ARRAY['/products/ngozi-collection/IMG_4700 (Large).jpg'],
    10,
    true
  ),
  (
    'Ngozi Leather Item 4649',
    'ngozi-leather-item-4649',
    'Part of the Ngozi Collection. Classic leather accessory.',
    5100,
    (SELECT id FROM category_ids WHERE slug = 'cross-body-bags'),
    '/products/ngozi-collection/IMG_4649 (Large).jpg',
    ARRAY['/products/ngozi-collection/IMG_4649 (Large).jpg'],
    10,
    true
  ),
  (
    'Ngozi Leather Item 4647',
    'ngozi-leather-item-4647',
    'Part of the Ngozi Collection. High-end design.',
    8200,
    (SELECT id FROM category_ids WHERE slug = 'tote-bags'),
    '/products/ngozi-collection/IMG_4647 (Large).jpg',
    ARRAY['/products/ngozi-collection/IMG_4647 (Large).jpg'],
    10,
    true
  ),
  (
    'Ngozi Leather Item 4636',
    'ngozi-leather-item-4636',
    'Part of the Ngozi Collection. Durable and spacious.',
    11500,
    (SELECT id FROM category_ids WHERE slug = 'backpacks'),
    '/products/ngozi-collection/IMG_4636 (Large).jpg',
    ARRAY['/products/ngozi-collection/IMG_4636 (Large).jpg'],
    10,
    true
  ),
  (
    'Ngozi Leather Item 4630',
    'ngozi-leather-item-4630',
    'Part of the Ngozi Collection. Minimalist sling bag.',
    4300,
    (SELECT id FROM category_ids WHERE slug = 'sling-bags'),
    '/products/ngozi-collection/IMG_4630 (Large).jpg',
    ARRAY['/products/ngozi-collection/IMG_4630 (Large).jpg'],
    10,
    true
  ),
  (
    'Ngozi Leather Item 4619',
    'ngozi-leather-item-4619',
    'Part of the Ngozi Collection. Chic side bag.',
    4900,
    (SELECT id FROM category_ids WHERE slug = 'side-bags'),
    '/products/ngozi-collection/IMG_4619 (Large).jpg',
    ARRAY['/products/ngozi-collection/IMG_4619 (Large).jpg'],
    10,
    true
  ),
  (
    'Ngozi Leather Item 4613',
    'ngozi-leather-item-4613',
    'Part of the Ngozi Collection. Modern crossbody.',
    5300,
    (SELECT id FROM category_ids WHERE slug = 'cross-body-bags'),
    '/products/ngozi-collection/IMG_4613 (Large).jpg',
    ARRAY['/products/ngozi-collection/IMG_4613 (Large).jpg'],
    10,
    true
  ),
  (
    'Ngozi Leather Item 4592-1',
    'ngozi-leather-item-4592-1',
    'Part of the Ngozi Collection. Large tote bag.',
    8800,
    (SELECT id FROM category_ids WHERE slug = 'tote-bags'),
    '/products/ngozi-collection/IMG_4592(1) (Large).jpg',
    ARRAY['/products/ngozi-collection/IMG_4592(1) (Large).jpg'],
    10,
    true
  ),
  (
    'Ngozi Leather Item 4592',
    'ngozi-leather-item-4592',
    'Part of the Ngozi Collection. Robust backpack.',
    12500,
    (SELECT id FROM category_ids WHERE slug = 'backpacks'),
    '/products/ngozi-collection/IMG_4592 (Large).jpg',
    ARRAY['/products/ngozi-collection/IMG_4592 (Large).jpg'],
    10,
    true
  ),
  (
    'Ngozi Leather Item 4527',
    'ngozi-leather-item-4527',
    'Part of the Ngozi Collection. Simple and effective sling.',
    4400,
    (SELECT id FROM category_ids WHERE slug = 'sling-bags'),
    '/products/ngozi-collection/IMG_4527 (Large).jpg',
    ARRAY['/products/ngozi-collection/IMG_4527 (Large).jpg'],
    10,
    true
  ),
  (
    'Ngozi Leather Item 4517',
    'ngozi-leather-item-4517',
    'Part of the Ngozi Collection. Sophisticated side bag.',
    5000,
    (SELECT id FROM category_ids WHERE slug = 'side-bags'),
    '/products/ngozi-collection/IMG_4517 (Large).jpg',
    ARRAY['/products/ngozi-collection/IMG_4517 (Large).jpg'],
    10,
    true
  )
ON CONFLICT (slug) DO NOTHING;
