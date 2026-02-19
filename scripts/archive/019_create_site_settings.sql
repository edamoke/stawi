-- Create a settings table for site-wide configurations
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow admins to read/write all settings
CREATE POLICY "Admins can manage site settings" ON public.site_settings
    FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
    ));

-- Allow anyone to read public settings (we will filter sensitive ones in the API)
CREATE POLICY "Public can read public site settings" ON public.site_settings
    FOR SELECT
    USING (true);

-- Insert Pesapal settings placeholder
INSERT INTO public.site_settings (key, value)
VALUES ('pesapal_settings', '{
    "consumer_key": "",
    "consumer_secret": "",
    "is_sandbox": true,
    "ipn_id": ""
}'::jsonb)
ON CONFLICT (key) DO NOTHING;
