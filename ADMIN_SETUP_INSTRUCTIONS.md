# Admin Setup Instructions

## Problem: "Invalid Login Credentials" Error

This error occurs because there are **no users** in the Supabase Auth database yet. You need to create an admin user first.

## Solution: Create Your First Admin User

### Option 1: Use Supabase Dashboard (Recommended for First Admin)

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Users**
3. Click **Add User** → **Create new user**
4. Enter:
   - Email: `admin@Stawiafrika.co.ke` (or your preferred email)
   - Password: Choose a strong password
   - Auto Confirm User: **Check this box** ✓
5. Click **Create User**
6. Copy the User ID (UUID) that was created
7. Go to **Table Editor** → **profiles**
8. Find the profile row with your User ID
9. Set `is_admin` to `true`
10. Click **Save**

Now you can log in at `/admin/login` with your email and password!

### Option 2: Create Admin via SQL (For Additional Admins)

Run this SQL in the Supabase SQL Editor (replace with actual user details):

```sql
-- First, create the auth user via Supabase Auth UI or API
-- Then update the profile to make them admin:

UPDATE profiles 
SET is_admin = true 
WHERE email = 'newemail@Stawiafrika.co.ke';
```

## Verification

After creating your admin user, verify the setup:

```sql
-- Check if admin user exists
SELECT 
  au.email,
  p.full_name,
  p.is_admin,
  p.created_at
FROM auth.users au
JOIN public.profiles p ON au.id = p.id
WHERE p.is_admin = true;
```

## Troubleshooting

### "Unable to verify admin status"
- The profile may not have been created yet by the trigger
- Wait a few seconds and try again
- Check if the `handle_new_user` trigger is enabled

### "Access denied. Admin privileges required"
- The user exists but `is_admin` is not set to `true`
- Update the profile manually in Supabase Dashboard

### "Email not confirmed"
- In Supabase Dashboard → Authentication → Users
- Click on the user and select "Confirm email"

## Security Notes

- Never commit admin credentials to your repository
- Use strong passwords for admin accounts
- Consider enabling 2FA in Supabase for admin users
- Regularly audit admin access in the profiles table
</parameter>
