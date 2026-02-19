import pg from 'pg'
import * as dotenv from 'dotenv'

dotenv.config()

const { Client } = pg

async function runSQL(sql) {
  const connectionString = process.env.POSTGRES_URL_NON_POOLING
  
  // FORCE NO SSL VERIFICATION for migration
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

  const client = new Client({
    connectionString: connectionString,
    ssl: true
  })

  try {
    await client.connect()
    console.log('Executing SQL...')
    await client.query(sql)
    console.log('Success!')
  } catch (err) {
    console.error('Error:', err.message)
  } finally {
    await client.end()
  }
}

const cleanup = `
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS public.site_settings CASCADE;
DROP TABLE IF EXISTS public.hero_slides CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.city_experiences CASCADE;
DROP TABLE IF EXISTS public.cities CASCADE;
DROP TABLE IF EXISTS public.content_blocks CASCADE;
DROP TABLE IF EXISTS public.content_sections CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
`

const schema = `
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category_id UUID REFERENCES public.categories(id),
  image_url TEXT,
  images TEXT[],
  stock INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE public.hero_slides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    heading TEXT NOT NULL,
    subheading TEXT,
    description TEXT,
    image_url TEXT NOT NULL,
    alt TEXT,
    position INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE public.cities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    culture TEXT,
    leather_history TEXT,
    hero_image TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  venue TEXT,
  max_attendees INTEGER,
  price DECIMAL(10, 2) DEFAULT 0.00,
  is_published BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  city_id UUID REFERENCES public.cities(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
`

const rls = `
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (TRUE);
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (TRUE);
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (TRUE);
CREATE POLICY "Public Read Hero" ON public.hero_slides FOR SELECT USING (TRUE);
CREATE POLICY "Public Read Cities" ON public.cities FOR SELECT USING (TRUE);
CREATE POLICY "Public Read Events" ON public.events FOR SELECT USING (TRUE);

CREATE POLICY "Admin All Profiles" ON public.profiles FOR ALL USING (is_admin = TRUE);
CREATE POLICY "Admin All Products" ON public.products FOR ALL USING (is_admin = TRUE);
CREATE POLICY "Admin All Categories" ON public.categories FOR ALL USING (is_admin = TRUE);
CREATE POLICY "Admin All Hero" ON public.hero_slides FOR ALL USING (is_admin = TRUE);
CREATE POLICY "Admin All Cities" ON public.cities FOR ALL USING (is_admin = TRUE);
CREATE POLICY "Admin All Events" ON public.events FOR ALL USING (is_admin = TRUE);
`

const seeding = `
INSERT INTO public.categories (name, slug) VALUES ('Sling Bags', 'sling-bags'), ('Side Bags', 'side-bags'), ('Crossbody Bags', 'crossbody-bags'), ('Scents', 'scents') ON CONFLICT DO NOTHING;
INSERT INTO public.cities (name, slug, description, display_order) VALUES ('Lamu', 'lamu', 'UNESCO site', 1), ('Diani', 'diani', 'Beach', 2), ('Mombasa', 'mombasa', 'Island city', 3), ('Zanzibar', 'zanzibar', 'Spice island', 4) ON CONFLICT DO NOTHING;
`

async function main() {
  console.log('Starting atomic migration...')
  await runSQL(cleanup)
  await runSQL(schema)
  await runSQL(rls)
  await runSQL(seeding)
  console.log('Migration complete!')
}

main()
