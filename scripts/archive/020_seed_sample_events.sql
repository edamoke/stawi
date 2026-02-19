-- Seed sample events for each city
-- Cities are: Lamu, Diani, Mombasa, Zanzibar

-- Get city IDs and insert events
DO $$
DECLARE
    lamu_id UUID;
    diani_id UUID;
    mombasa_id UUID;
    zanzibar_id UUID;
BEGIN
    SELECT id INTO lamu_id FROM public.cities WHERE slug = 'lamu';
    SELECT id INTO diani_id FROM public.cities WHERE slug = 'diani';
    SELECT id INTO mombasa_id FROM public.cities WHERE slug = 'mombasa';
    SELECT id INTO zanzibar_id FROM public.cities WHERE slug = 'zanzibar';

    -- Delete existing sample events to avoid duplicates if re-run
    DELETE FROM public.events WHERE slug IN (
        'lamu-cultural-festival-2026',
        'diani-beach-yoga-retreat',
        'mombasa-heritage-tour',
        'zanzibar-spice-workshop'
    );

    -- Lamu Event
    INSERT INTO public.events (
        title, slug, description, long_description, image_url, 
        event_date, location, venue, max_attendees, price, 
        is_free, is_published, is_featured, category, city_id
    ) VALUES (
        'Lamu Cultural Festival 2026',
        'lamu-cultural-festival-2026',
        'Experience the magic of Swahili culture in the heart of Lamu Old Town.',
        'Join us for the annual Lamu Cultural Festival, a celebration of the unique Swahili heritage of Lamu Island. The festival features traditional dances, dhow races, donkey races, and exhibitions of local crafts and cuisine. It is a time when the narrow streets of the UNESCO World Heritage site come alive with music, color, and community spirit.',
        '/images/IMG_4416(1) (Custom).jpg',
        '2026-11-15 09:00:00+03',
        'Lamu Old Town',
        'Mkunguni Square',
        500,
        2500.00,
        FALSE,
        TRUE,
        TRUE,
        'Culture',
        lamu_id
    );

    -- Diani Event
    INSERT INTO public.events (
        title, slug, description, long_description, image_url, 
        event_date, location, venue, max_attendees, price, 
        is_free, is_published, is_featured, category, city_id
    ) VALUES (
        'Diani Beach Yoga Retreat',
        'diani-beach-yoga-retreat',
        'Rejuvenate your mind and body on the pristine white sands of Diani.',
        'Escape to the tranquil shores of Diani for a weekend of yoga, meditation, and wellness. Led by experienced instructors, this retreat offers daily yoga sessions at sunrise and sunset, healthy organic meals, and plenty of time to relax by the turquoise waters of the Indian Ocean. Perfect for all levels, from beginners to advanced practitioners.',
        '/images/IMG_4413(2) (Custom).jpg',
        '2026-03-20 07:00:00+03',
        'Diani Beach',
        'The Sands at Nomad',
        50,
        15000.00,
        FALSE,
        TRUE,
        TRUE,
        'Wellness',
        diani_id
    );

    -- Mombasa Event
    INSERT INTO public.events (
        title, slug, description, long_description, image_url, 
        event_date, location, venue, max_attendees, price, 
        is_free, is_published, is_featured, category, city_id
    ) VALUES (
        'Mombasa Heritage Walking Tour',
        'mombasa-heritage-tour',
        'Discover the hidden stories and historic landmarks of Mombasa Island.',
        'Guided by local historians, this walking tour takes you through the winding streets of Mombasa Old Town. Visit Fort Jesus, a UNESCO World Heritage site, explore the bustling spice markets, and admire the intricate Swahili architecture. Learn about the city''s diverse history as a gateway to East Africa and its role in global trade over the centuries.',
        '/images/IMG_4754 (Custom).jpg',
        '2026-02-10 10:00:00+03',
        'Mombasa Island',
        'Fort Jesus Entrance',
        20,
        1500.00,
        FALSE,
        TRUE,
        FALSE,
        'History',
        mombasa_id
    );

    -- Zanzibar Event
    INSERT INTO public.events (
        title, slug, description, long_description, image_url, 
        event_date, location, venue, max_attendees, price, 
        is_free, is_published, is_featured, category, city_id
    ) VALUES (
        'Zanzibar Spice & Culinary Workshop',
        'zanzibar-spice-workshop',
        'Learn the secrets of Zanzibari cuisine in the historic Stone Town.',
        'Immerse yourself in the aromatic world of spices on the Spice Island. This hands-on workshop begins with a visit to a local spice plantation to learn about the cultivation of cloves, cinnamon, and nutmeg. Then, return to a traditional kitchen in Stone Town to learn how to prepare authentic Zanzibari dishes using these fresh spices. Enjoy the delicious meal you''ve created at the end of the session.',
        '/images/IMG_4412 (Custom).jpg',
        '2026-04-05 11:00:00+03',
        'Stone Town, Zanzibar',
        'Darajani Market Kitchen',
        15,
        5500.00,
        FALSE,
        TRUE,
        TRUE,
        'Culinary',
        zanzibar_id
    );
END $$;
