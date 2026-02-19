-- Create missing storage buckets for CMS
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('hero-slides', 'hero-slides', true),
  ('products', 'products', true),
  ('content', 'content', true),
  ('social-feed', 'social-feed', true),
  ('events', 'events', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for hero-slides bucket
DO $$ BEGIN
  CREATE POLICY "Hero Slides Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'hero-slides');
EXCEPTION WHEN others THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Hero Slides Admin Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'hero-slides');
EXCEPTION WHEN others THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Hero Slides Admin Update" ON storage.objects FOR UPDATE USING (bucket_id = 'hero-slides');
EXCEPTION WHEN others THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Hero Slides Admin Delete" ON storage.objects FOR DELETE USING (bucket_id = 'hero-slides');
EXCEPTION WHEN others THEN NULL; END $$;

-- Storage policies for products bucket
DO $$ BEGIN
  CREATE POLICY "Products Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'products');
EXCEPTION WHEN others THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Products Admin Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products');
EXCEPTION WHEN others THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Products Admin Update" ON storage.objects FOR UPDATE USING (bucket_id = 'products');
EXCEPTION WHEN others THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Products Admin Delete" ON storage.objects FOR DELETE USING (bucket_id = 'products');
EXCEPTION WHEN others THEN NULL; END $$;

-- Storage policies for content bucket
DO $$ BEGIN
  CREATE POLICY "Content Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'content');
EXCEPTION WHEN others THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Content Admin Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'content');
EXCEPTION WHEN others THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Content Admin Update" ON storage.objects FOR UPDATE USING (bucket_id = 'content');
EXCEPTION WHEN others THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Content Admin Delete" ON storage.objects FOR DELETE USING (bucket_id = 'content');
EXCEPTION WHEN others THEN NULL; END $$;

-- Storage policies for social-feed bucket
DO $$ BEGIN
  CREATE POLICY "Social Feed Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'social-feed');
EXCEPTION WHEN others THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Social Feed Admin Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'social-feed');
EXCEPTION WHEN others THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Social Feed Admin Update" ON storage.objects FOR UPDATE USING (bucket_id = 'social-feed');
EXCEPTION WHEN others THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Social Feed Admin Delete" ON storage.objects FOR DELETE USING (bucket_id = 'social-feed');
EXCEPTION WHEN others THEN NULL; END $$;

-- Storage policies for events bucket
DO $$ BEGIN
  CREATE POLICY "Events Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'events');
EXCEPTION WHEN others THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Events Admin Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'events');
EXCEPTION WHEN others THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Events Admin Update" ON storage.objects FOR UPDATE USING (bucket_id = 'events');
EXCEPTION WHEN others THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Events Admin Delete" ON storage.objects FOR DELETE USING (bucket_id = 'events');
EXCEPTION WHEN others THEN NULL; END $$;
