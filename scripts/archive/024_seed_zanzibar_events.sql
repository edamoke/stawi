-- Seed 2/events zanzibar too
DO $$
DECLARE
    zanzibar_id UUID;
BEGIN
    SELECT id INTO zanzibar_id FROM public.cities WHERE slug = 'zanzibar';

    IF zanzibar_id IS NOT NULL THEN
        -- Event 1
        INSERT INTO public.events (
            title, slug, description, long_description, image_url, 
            event_date, location, venue, max_attendees, price, 
            is_free, is_published, is_active, is_featured, category, city_id
        ) VALUES (
            'Zanzibar Sunset Dhow Cruise',
            'zanzibar-sunset-dhow-cruise',
            'Sail into the sunset on a traditional wooden dhow.',
            'Experience the ultimate romantic evening as you sail along the Stone Town coastline. Enjoy traditional music, local snacks, and refreshing drinks while watching the sun dip below the horizon of the Indian Ocean.',
            '/products/IMG_4435 (Custom).jpg',
            '2026-05-10 16:30:00+03',
            'Stone Town Waterfront',
            'Serena Hotel Jetty',
            20,
            4500.00,
            FALSE,
            TRUE,
            TRUE,
            TRUE,
            'Adventure',
            zanzibar_id
        );

        -- Event 2
        INSERT INTO public.events (
            title, slug, description, long_description, image_url, 
            event_date, location, venue, max_attendees, price, 
            is_free, is_published, is_active, is_featured, category, city_id
        ) VALUES (
            'Stone Town Heritage & Coffee Trail',
            'stone-town-heritage-coffee',
            'A journey through the scents and history of Stone Town.',
            'Explore the labyrinthine alleys of Stone Town, visiting historic landmarks and hidden coffee houses. Learn about the art of traditional Zanzibari coffee brewing and the rich multicultural history of this UNESCO World Heritage site.',
            '/images/IMG_4419(1) (Custom).jpg',
            '2026-06-15 09:30:00+03',
            'Stone Town',
            'Jaws Corner',
            12,
            3000.00,
            FALSE,
            TRUE,
            TRUE,
            TRUE,
            'Culture',
            zanzibar_id
        );
    END IF;
END $$;
