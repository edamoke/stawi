-- SQL Migration to fix Pesapal credentials and IPN registration issues

-- 1. Ensure Pesapal credentials are saved in site_settings
INSERT INTO public.site_settings (id, settings)
VALUES ('pesapal_settings', '{
    "consumer_key": "b22u1Q5eb85fPMuBB03NB+0bMdLjCRJp",
    "consumer_secret": "tneOsZvEwnCaOH2deEenKSEWDlI=",
    "is_sandbox": false
}')
ON CONFLICT (id) DO UPDATE SET
settings = jsonb_set(
    jsonb_set(
        public.site_settings.settings, 
        '{consumer_key}', 
        '"b22u1Q5eb85fPMuBB03NB+0bMdLjCRJp"'
    ),
    '{consumer_secret}',
    '"tneOsZvEwnCaOH2deEenKSEWDlI="'
);

-- 2. Clear IPN ID to force re-registration with new credentials
UPDATE public.site_settings 
SET settings = settings - 'ipn_id'
WHERE id = 'pesapal_settings';

-- 3. Ensure profiles are correctly set up (fixing possible null is_admin)
UPDATE public.profiles SET is_admin = true WHERE email = 'sulhaafrika2025@gmail.com';
