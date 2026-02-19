-- Add city_id to events table
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS city_id UUID REFERENCES public.cities(id) ON DELETE SET NULL;

-- Update RLS policies to allow selection by city_id
-- (Existing policies already allow selection of published/active events, 
-- we just need to ensure city_id is included in the returned data which it will be by default)
