-- Script to verify admin setup
-- Run this AFTER creating a user via Supabase Auth UI

-- 1. First, check if there are any users
SELECT 
  au.id,
  au.email,
  au.email_confirmed_at,
  p.is_admin
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
ORDER BY au.created_at DESC;

-- 2. If you see your user but is_admin is false, run this:
-- UPDATE profiles SET is_admin = true WHERE email = 'your-email@example.com';

-- 3. Verify the update worked:
SELECT 
  au.email,
  p.full_name,
  p.is_admin,
  p.created_at
FROM auth.users au
JOIN public.profiles p ON au.id = p.id
WHERE p.is_admin = true;

-- Expected result: You should see at least one admin user
