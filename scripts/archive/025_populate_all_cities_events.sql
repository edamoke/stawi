-- Seed additional events for all cities to show populated view
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

    -- Lamu Event 2
    INSERT INTO public.events (
        title, slug, description, long_description, image_url, 
        event_date, location, venue, max_attendees, price, 
        is_free, is_published, is_active, is_featured, category, city_id
    ) VALUES (
        'Lamu Dhow Building Workshop',
        'lamu-dhow-building',
        'Learn the ancient art of dhow making from master craftsmen.',
        'A rare opportunity to visit a traditional dhow yard and learn about the techniques passed down through generations. Master craftsmen will guide you through the process of selecting wood, shaping the hull, and stitching the sails.',
        '/products/chestbags.jpg',
        '2026-07-20 10:00:00+03',
        'Shela Beach, Lamu',
        'Ali''s Dhow Yard',
        10,
        5000.00,
        FALSE,
        TRUE,
        TRUE,
        TRUE,
        'Craft',
        lamu_id
    );

    -- Diani Event 2
    INSERT INTO public.events (
        title, slug, description, long_description, image_url, 
        event_date, location, venue, max_attendees, price, 
        is_free, is_published, is_active, is_featured, category, city_id
    ) VALUES (
        'Diani Marine Life Photography',
        'diani-marine-photo',
        'Capture the vibrant underwater world of the Indian Ocean.',
        'Join award-winning photographers for a guided underwater photography excursion. Explore the coral reefs of Diani and learn how to capture stunning images of sea turtles, colorful fish, and intricate coral formations.',
        '/products/IMG_4410(2) (Custom).jpg',
        '2026-08-15 08:00:00+03',
        'Diani Reef',
        'Diani Marine Center',
        8,
        12000.00,
        FALSE,
        TRUE,
        TRUE,
        TRUE,
        'Photography',
        diani_id
    );

    -- Mombasa Event 2
    INSERT INTO public.events (
        title, slug, description, long_description, image_url, 
        event_date, location, venue, max_attendees, price, 
        is_free, is_published, is_active, is_featured, category, city_id
    ) VALUES (
        'Mombasa Street Food Extravaganza',
        'mombasa-street-food',
        'A culinary journey through the flavors of the coast.',
        'Taste the best of Mombasa''s legendary street food. From spicy mshikaki to crispy bhajias and refreshing coconut water, this tour will take you to the most authentic food stalls hidden in the heart of the city.',
        '/products/glasscases.jpg',
        '2026-09-10 17:30:00+03',
        'Mombasa Old Town',
        'Treasury Square',
        25,
        2000.00,
        FALSE,
        TRUE,
        TRUE,
        TRUE,
        'Culinary',
        mombasa_id
    );

END $$;
