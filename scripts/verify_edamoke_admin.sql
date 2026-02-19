-- SQL Script to verify edamoke@gmail.com as an admin
-- Run this in your Supabase SQL Editor

-- 1. Confirm the user's email in the auth.users table
UPDATE auth.users 
SET email_confirmed_at = NOW(),
    last_sign_in_at = NOW()
WHERE email = 'edamoke@gmail.com';

-- 2. Set the is_admin flag in the public.profiles table
-- This assumes the profile already exists. If not, you might need to insert it.
UPDATE public.profiles
SET is_admin = true,
    updated_at = NOW()
WHERE id IN (
    SELECT id FROM auth.users WHERE email = 'edamoke@gmail.com'
);

-- 3. Also set is_admin in user metadata as a backup (used by lib/auth.ts)
UPDATE auth.users
SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || '{"is_admin": true}'::jsonb,
    raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"is_admin": true}'::jsonb
WHERE email = 'edamoke@gmail.com';

-- Verification: check if the user is now an admin
SELECT p.id, u.email, p.is_admin, u.email_confirmed_at
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email = 'edamoke@gmail.com';
