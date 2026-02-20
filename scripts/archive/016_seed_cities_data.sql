-- Update cities table to include hero_sentence if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cities' AND column_name='hero_sentence') THEN
        ALTER TABLE cities ADD COLUMN hero_sentence TEXT;
    END IF;
END $$;

-- Clean up existing data to ensure a fresh seed
TRUNCATE cities RESTART IDENTITY CASCADE;

-- Seed cities with hero_sentence
INSERT INTO cities (name, slug, description, culture, leather_history, hero_image, hero_sentence, display_order)
VALUES 
(
    'Lamu', 
    'lamu', 
    'A UNESCO World Heritage site where time stands still and the essence of Swahili culture is preserved in every stone.', 
    'Lamu is the oldest and best-preserved Swahili settlement in East Africa, maintaining its traditional functions. Built in coral stone and mangrove timber, the town is characterized by the simplicity of structural forms enriched by such features as inner courtyards, verandas, and elaborately carved wooden doors.', 
    'The Wangozi people of the Lamu archipelago were renowned for their exquisite leather craftsmanship, a tradition that has influenced Stawi Afrika''s commitment to heritage and quality.', 
    '/images/IMG_4416(1) (Custom).jpg', 
    'DISCOVER HERITAGE',
    1
),
(
    'Diani', 
    'diani', 
    'Pristine white sands meet turquoise waters, creating a serene sanctuary for the soul and a vibrant playground for the adventurous.', 
    'Diani represents the vibrant coastal lifestyle of Kenya, where the rhythm of the ocean dictates the pace of life and the warmth of the community welcomes every visitor with open arms.', 
    'Coastal leather work in Diani merged utility with aesthetics, creating durable pieces that withstood the salty air and reflected the beauty of the surrounding natural environment.', 
    '/images/IMG_4413(2) (Custom).jpg', 
    'DISCOVER SERENITY',
    2
),
(
    'Mombasa', 
    'mombasa', 
    'A bustling island city where history and modernity dance together in a vibrant celebration of culture, trade, and community.', 
    'Mombasa is a melting pot of cultures, a historic gateway to East Africa that has been shaped by centuries of global trade and a resilient spirit of hospitality.', 
    'As a historic hub for the leather trade, Mombasa has always been at the forefront of craftsmanship, where traditional techniques meet new influences to create something truly unique.', 
    '/images/IMG_4754 (Custom).jpg', 
    'DISCOVER VIBRANCY',
    3
),
(
    'Zanzibar', 
    'zanzibar', 
    'The Spice Island of Stone Town, where every narrow alleyway tells a story and the air is filled with the scent of cloves and history.', 
    'Zanzibar''s culture is a breathtaking blend of African, Arab, Indian, and European influences, creating a unique tapestry of traditions that is reflected in its art, music, and daily life.', 
    'Leather craft reached a high level of sophistication in Zanzibar, with intricate designs and master techniques that continue to inspire artisans today.', 
    '/images/IMG_4412 (Custom).jpg', 
    'DISCOVER ESSENCE',
    4
);

-- Seed city_experiences
INSERT INTO city_experiences (city_id, title, description, image_url, display_order)
SELECT id, 'Old Town Walk', 'Wander through the historic streets', '/images/IMG_4421(3) (Custom).jpg', 1 FROM cities WHERE slug = 'lamu';
INSERT INTO city_experiences (city_id, title, description, image_url, display_order)
SELECT id, 'Dhow Sailing', 'Experience the ocean at sunset', '/images/IMG_4420(1) (Custom).jpg', 2 FROM cities WHERE slug = 'lamu';
INSERT INTO city_experiences (city_id, title, description, image_url, display_order)
SELECT id, 'Beach Sensation', 'Pure relaxation on white sands', '/images/IMG_4745 (Custom).jpg', 1 FROM cities WHERE slug = 'diani';
INSERT INTO city_experiences (city_id, title, description, image_url, display_order)
SELECT id, 'Ocean Adventure', 'Explore the vibrant reef', '/images/IMG_4747 (Custom).jpg', 2 FROM cities WHERE slug = 'diani';
INSERT INTO city_experiences (city_id, title, description, image_url, display_order)
SELECT id, 'Fort Jesus Visit', 'Step back in time at the fort', '/images/IMG_4756 (Custom).jpg', 1 FROM cities WHERE slug = 'mombasa';
INSERT INTO city_experiences (city_id, title, description, image_url, display_order)
SELECT id, 'Spice Market', 'A feast for the senses', '/images/IMG_4411 (Custom).jpg', 2 FROM cities WHERE slug = 'mombasa';
INSERT INTO city_experiences (city_id, title, description, image_url, display_order)
SELECT id, 'Stone Town Tour', 'The heart of Zanzibari culture', '/images/IMG_4415 (Custom).jpg', 1 FROM cities WHERE slug = 'zanzibar';
INSERT INTO city_experiences (city_id, title, description, image_url, display_order)
SELECT id, 'Spice Plantation', 'Discover the source of flavors', '/images/IMG_4421 (Custom).jpg', 2 FROM cities WHERE slug = 'zanzibar';
