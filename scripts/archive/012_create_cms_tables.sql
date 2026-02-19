-- Create content_sections table
CREATE TABLE IF NOT EXISTS public.content_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key TEXT UNIQUE NOT NULL,
  section_type TEXT NOT NULL DEFAULT 'flexible_grid',
  title TEXT,
  subtitle TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create content_blocks table
CREATE TABLE IF NOT EXISTS public.content_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID REFERENCES public.content_sections(id) ON DELETE CASCADE,
  row_number INTEGER DEFAULT 1,
  column_number INTEGER DEFAULT 1,
  columns_in_row INTEGER DEFAULT 2,
  image_url TEXT,
  heading TEXT,
  text_content TEXT,
  link_url TEXT,
  link_text TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS
ALTER TABLE public.content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;

-- Policies for content_sections
CREATE POLICY "Anyone can view active sections" ON public.content_sections FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins can manage sections" ON public.content_sections FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Policies for content_blocks
CREATE POLICY "Anyone can view blocks of active sections" ON public.content_blocks FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.content_sections WHERE id = section_id AND is_active = TRUE)
);
CREATE POLICY "Admins can manage blocks" ON public.content_blocks FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Seed Initial "Selected" Section
INSERT INTO public.content_sections (section_key, section_type, title, subtitle, display_order)
VALUES ('homepage-selected', 'flexible_grid', 'Selected Section', 'NGOZI COLLECTION & SULHA SCENTS', 1)
ON CONFLICT (section_key) DO NOTHING;

-- Seed Blocks for the section
INSERT INTO public.content_blocks (section_id, row_number, column_number, columns_in_row, image_url, heading, link_url, link_text, display_order)
SELECT 
  id, 
  1, 1, 2, 
  '/brown-leather-sling-bag.jpg', 
  'NGOZI COLLECTION', 
  '/our-collection?view=collections', 
  'Explore Collection',
  0
FROM public.content_sections WHERE section_key = 'homepage-selected'
ON CONFLICT DO NOTHING;

INSERT INTO public.content_blocks (section_id, row_number, column_number, columns_in_row, image_url, heading, link_url, link_text, display_order)
SELECT 
  id, 
  1, 2, 2, 
  '/beautiful-black-african-woman-model-elegant-resort.jpg', 
  'SULHA SCENTS', 
  '/our-collection?category=scents', 
  'Discover Scents',
  1
FROM public.content_sections WHERE section_key = 'homepage-selected'
ON CONFLICT DO NOTHING;
