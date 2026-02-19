-- Insert hero slides for homepage carousel
INSERT INTO hero_slides (title, subtitle, image_url, cta_text, cta_link, position, active) VALUES
  (
    'The Ngozi Collection',
    'Discover Premium African Leather Craftsmanship',
    '/placeholder.svg?height=600&width=1200',
    'Shop Collection',
    '/our-collection',
    1,
    true
  ),
  (
    'Handcrafted Excellence',
    'Each Piece Tells a Story of Tradition and Quality',
    '/placeholder.svg?height=600&width=1200',
    'Learn More',
    '/about',
    2,
    true
  ),
  (
    'Free Delivery in Nairobi',
    'On Orders Over KSh 15,000',
    '/placeholder.svg?height=600&width=1200',
    'Shop Now',
    '/our-collection',
    3,
    true
  )
ON CONFLICT (id) DO NOTHING;
