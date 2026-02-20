-- Enhanced Seed Data for Cities and City Experiences
-- Using ON CONFLICT to update existing cities or insert if they don't exist

-- 1. Ensure hero_sentence column exists (from previous migration)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cities' AND column_name='hero_sentence') THEN
        ALTER TABLE cities ADD COLUMN hero_sentence TEXT;
    END IF;
END $$;

-- 2. Update/Insert Cities with Enhanced AI-Generated Content
INSERT INTO cities (name, slug, description, culture, leather_history, hero_image, hero_sentence, display_order, is_active)
VALUES 
(
    'Lamu', 
    'lamu', 
    'A UNESCO World Heritage site where the whispering palms and narrow winding streets tell stories of a thousand years. Lamu is not just a place; it is a feeling of suspended time, where dhows still sail the sapphire waters and the heartbeat of Swahili civilization is felt in every coral-hewn wall.', 
    'The culture of Lamu is a living tapestry of African, Arab, and Indian influences. It is defined by its deep commitment to community, the annual Maulidi festival, and the preservation of traditional crafts. Life here moves at the pace of a donkey''s trot, rooted in a philosophy of "pole pole" (slowly slowly) and profound hospitality.', 
    'Lamu has a storied relationship with leather, pioneered by the Wangozi ("people of leather"). Historically, leather was essential for dhow rigging, sandals for navigating coral paths, and protective covers for sacred manuscripts. Today, Stawi Afrika honors this lineage by reviving the artisanal precision that once made Lamu leather famous across the Indian Ocean.', 
    '/images/IMG_4416(1) (Custom).jpg', 
    'DISCOVER HERITAGE',
    1,
    true
),
(
    'Diani', 
    'diani', 
    'Where the emerald Kaya forests meet the blinding white sands of the Indian Ocean. Diani is a coastal sanctuary of breathtaking natural beauty, offering a serene escape where the rustle of Colobus monkeys in the canopy harmonizes with the gentle rhythm of the tides.', 
    'Diani''s culture is an invitation to the "Bahari" lifestyle—a seamless blend of traditional Mijikenda heritage and a cosmopolitan coastal spirit. It is a place of ecological reverence, where the sacred Kaya forests are protected as ancestral spirits, and life is celebrated through music, sun-drenched cuisine, and a deep connection to the sea.', 
    'In the coastal reaches of Diani, leather craftsmanship was born from the necessity of the elements. Artisans created durable, salt-resistant gear for fishermen and travelers, blending rugged utility with the elegant aesthetics of the coast. This tradition of "form meeting function" is the cornerstone of every Stawi Afrika piece inspired by Diani''s shores.', 
    '/images/IMG_4413(2) (Custom).jpg', 
    'DISCOVER SERENITY',
    2,
    true
),
(
    'Mombasa', 
    'mombasa', 
    'The historic Gateway to East Africa, Mombasa is a vibrant island city where the scent of spices hangs heavy in the air and the echoes of ancient trade still resonate. From the formidable walls of Fort Jesus to the bustling markets of the Old Town, it is a city of layers, energy, and enduring spirit.', 
    'Mombasa is a true melting pot, a kaleidoscope of cultures including Arab, Indian, Portuguese, and indigenous Mijikenda. This diversity is reflected in its world-famous street food, the intricate "Khanga" fabrics, and the "Taarab" music that floats through the evening air. It is a city that never stops moving, yet always finds time for a cup of spiced tea.', 
    'For centuries, Mombasa was the primary hub of the East African leather trade. It was here that hides from the interior were traded for exotic goods from the East. The city became a center for master cobblers and tanners who refined traditional techniques to meet global standards, a legacy of excellence that Stawi Afrika continues to champion.', 
    '/images/IMG_4754 (Custom).jpg', 
    'DISCOVER VIBRANCY',
    3,
    true
),
(
    'Zanzibar', 
    'zanzibar', 
    'The legendary Spice Island, where the labyrinthine alleys of Stone Town lead to hidden courtyards and sun-bleached squares. Zanzibar is a sensory masterpiece of clove plantations, turquoise lagoons, and the haunting beauty of a civilization built on the crossroads of the world.', 
    'Zanzibari culture is a sophisticated fusion of Omani elegance and African resilience. It is seen in the elaborately carved "Zanzibar Doors" that signify status and welcome, the rhythmic pulse of the "Bibi" drums, and the refined culinary arts that use spices as a language of history. It is a place of deep spirituality and artistic expression.', 
    'Leather craft in Zanzibar reached a pinnacle of ornamentation during the height of the Sultanate. Artisans specialized in embossed and gilded leather for royal upholstery, ceremonial regalia, and intricate footwear. At Stawi Afrika, we draw inspiration from this Zanzibari penchant for detail, ensuring our Sensations reflect that same level of royal craftsmanship.', 
    '/images/IMG_4412 (Custom).jpg', 
    'DISCOVER ESSENCE',
    4,
    true
)
ON CONFLICT (slug) 
DO UPDATE SET 
    description = EXCLUDED.description,
    culture = EXCLUDED.culture,
    leather_history = EXCLUDED.leather_history,
    hero_image = EXCLUDED.hero_image,
    hero_sentence = EXCLUDED.hero_sentence,
    display_order = EXCLUDED.display_order,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

-- 3. Refresh City Experiences (Optional: Clean and re-seed to match enhanced content)
DELETE FROM city_experiences WHERE city_id IN (SELECT id FROM cities);

INSERT INTO city_experiences (city_id, title, description, image_url, display_order)
SELECT id, 'Stone Town Heritage Walk', 'Navigate the labyrinth of history through the soul of Lamu''s Old Town.', '/images/IMG_4421(3) (Custom).jpg', 1 FROM cities WHERE slug = 'lamu';
INSERT INTO city_experiences (city_id, title, description, image_url, display_order)
SELECT id, 'Sunset Dhow Sensation', 'Sail into the golden hour on a traditional wooden vessel, just as merchants did centuries ago.', '/images/IMG_4420(1) (Custom).jpg', 2 FROM cities WHERE slug = 'lamu';

INSERT INTO city_experiences (city_id, title, description, image_url, display_order)
SELECT id, 'Kaya Forest Encounter', 'A guided journey into the sacred ancestral forests of the coastal people.', '/images/IMG_4745 (Custom).jpg', 1 FROM cities WHERE slug = 'diani';
INSERT INTO city_experiences (city_id, title, description, image_url, display_order)
SELECT id, 'Turquoise Reef Snorkel', 'Discover the vibrant marine life thriving beneath Diani''s crystal clear waters.', '/images/IMG_4747 (Custom).jpg', 2 FROM cities WHERE slug = 'diani';

INSERT INTO city_experiences (city_id, title, description, image_url, display_order)
SELECT id, 'Fort Jesus Exploration', 'Uncover the military and architectural genius of this 16th-century Portuguese fortress.', '/images/IMG_4756 (Custom).jpg', 1 FROM cities WHERE slug = 'mombasa';
INSERT INTO city_experiences (city_id, title, description, image_url, display_order)
SELECT id, 'Old Town Spice Sensory', 'Immerse yourself in the aromas and textures of Mombasa''s historic trading quarters.', '/images/IMG_4411 (Custom).jpg', 2 FROM cities WHERE slug = 'mombasa';

INSERT INTO city_experiences (city_id, title, description, image_url, display_order)
SELECT id, 'The Doors of Stone Town', 'A curated walk focusing on the symbolic artistry of Zanzibar''s iconic wooden doors.', '/images/IMG_4415 (Custom).jpg', 1 FROM cities WHERE slug = 'zanzibar';
INSERT INTO city_experiences (city_id, title, description, image_url, display_order)
SELECT id, 'Spice Plantation Culinary', 'From soil to plate: a hands-on experience with the flavors that defined an island.', '/images/IMG_4421 (Custom).jpg', 2 FROM cities WHERE slug = 'zanzibar';
