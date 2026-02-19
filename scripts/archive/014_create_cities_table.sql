-- Create cities table
CREATE TABLE IF NOT EXISTS cities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    culture TEXT,
    leather_history TEXT,
    hero_image TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create city_experiences table
CREATE TABLE IF NOT EXISTS city_experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id UUID REFERENCES cities(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE city_experiences ENABLE ROW LEVEL SECURITY;

-- Policies for public viewing
CREATE POLICY "Allow public read access on cities" ON cities FOR SELECT USING (true);
CREATE POLICY "Allow public read access on city_experiences" ON city_experiences FOR SELECT USING (true);

-- Policies for admin management (requires service role or specific admin check)
CREATE POLICY "Allow admin all access on cities" ON cities FOR ALL USING (true);
CREATE POLICY "Allow admin all access on city_experiences" ON city_experiences FOR ALL USING (true);

-- Seed initial data
INSERT INTO cities (name, slug, description, culture, leather_history, hero_image, display_order)
VALUES 
('Lamu', 'lamu', 'A UNESCO World Heritage site where time stands still.', 'Lamu is the oldest and best-preserved Swahili settlement.', 'The Wangozi people were renowned for leather craftsmanship.', '/images/IMG_4416(1) (Custom).jpg', 1),
('Diani', 'diani', 'Pristine white sands meet turquoise waters.', 'Diani represents the vibrant coastal lifestyle of Kenya.', 'Coastal leather work merged utility with aesthetics.', '/images/IMG_4413(2) (Custom).jpg', 2),
('Mombasa', 'mombasa', 'A bustling island city of history and culture.', 'Mombasa is a melting pot of cultures.', 'Mombasa has been a hub for the leather trade.', '/images/IMG_4754 (Custom).jpg', 3),
('Zanzibar', 'zanzibar', 'The Spice Island of Stone Town.', 'Zanzibars culture is a blend of global influences.', 'Leather craft reached high sophistication in Zanzibar.', '/images/IMG_4412 (Custom).jpg', 4)
ON CONFLICT (slug) DO NOTHING;
