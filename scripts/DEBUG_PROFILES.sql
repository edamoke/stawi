-- 1. CLEANUP (Drop ALL tables to start fresh)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. CORE TABLE CREATION
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  is_admin BOOLEAN DEFAULT FALSE, 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. ENABLE RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. POLICIES (Simple version)
CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (TRUE);

-- 5. INITIAL DATA
-- Note: Profiles usually auto-populate on signup, but we can't seed it without valid auth IDs.
