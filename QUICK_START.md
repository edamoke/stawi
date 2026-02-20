# Quick Start Guide - Admin CMS Setup

## Current Status

### ✅ Fixed Issues
1. **Hero Slider** - Database schema updated to match component expectations
2. **API Routes** - All CRUD endpoints created for products, categories, orders, hero slides
3. **Server Actions** - Complete action library for admin operations
4. **Admin Authentication** - Proper auth flow with RLS bypass for admin operations

### ⚠️ Action Required: Create Your First Admin User

**The admin login returns "Invalid Login Credentials" because there are NO users in the database yet.**

## Create Your First Admin - Choose One Method

### Method 1: Use the Admin Setup Page (Easiest)

1. Navigate to: **`/admin/setup`** in your browser
2. Enter your details:
   - Email: `admin@Stawiafrika.co.ke` (or your preferred email)
   - Password: Choose a strong password
   - Full Name: Your name
3. Click "Create Admin Account"
4. Once successful, click "Go to Admin Login"
5. Login with your credentials at `/admin/login`

**Important:** The setup page requires the `SUPABASE_SERVICE_ROLE_KEY` environment variable. 

### Method 2: Use Supabase Dashboard (Most Reliable)

1. Go to your Supabase Dashboard → **Authentication** → **Users**
2. Click **"Add User"** → **"Create new user"**
3. Fill in:
   - Email: `admin@Stawiafrika.co.ke`
   - Password: Your strong password
   - **✓ Check "Auto Confirm User"**
4. Click **"Create User"** and copy the User ID
5. Go to **Table Editor** → **profiles** table
6. Find the row with your User ID
7. Edit the row and set `is_admin` to `true`
8. Save changes
9. Login at `/admin/login` with your credentials

### Method 3: SQL Script (For Developers)

```sql
-- Step 1: Create the auth user via Supabase Auth Admin API or Dashboard first
-- Then run this after you have the user ID:

UPDATE profiles 
SET is_admin = true 
WHERE email = 'your-email@example.com';

-- Verify it worked:
SELECT 
  au.email,
  p.is_admin,
  p.created_at
FROM auth.users au
JOIN public.profiles p ON au.id = p.id
WHERE p.is_admin = true;
```

## Required Environment Variables

Make sure these are set in your **Vars** section:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # Required for admin setup
```

## Admin CMS Features

Once logged in, you'll have access to:

- **`/admin`** - Dashboard overview
- **`/admin/products`** - Manage products (CRUD operations)
- **`/admin/products/new`** - Add new products
- **`/admin/products/[id]`** - Edit existing products
- **`/admin/categories`** - Manage categories
- **`/admin/orders`** - View and manage orders
- **`/admin/users`** - User management
- **`/admin/payments`** - Payment tracking
- **`/admin/settings`** - System settings

## API Endpoints Available

All endpoints require admin authentication:

### Products
- `GET /api/admin/products` - List all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product

### Categories
- `GET /api/admin/categories` - List categories
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/[id]` - Update category
- `DELETE /api/admin/categories/[id]` - Delete category

### Hero Slides
- `GET /api/admin/hero-slides` - List slides
- `POST /api/admin/hero-slides` - Create slide
- `PATCH /api/admin/hero-slides/[id]` - Update slide
- `DELETE /api/admin/hero-slides/[id]` - Delete slide

### Orders
- `PUT /api/admin/orders/[id]/status` - Update order status

## Troubleshooting

### "Invalid Login Credentials"
- **Cause**: No admin user exists yet
- **Solution**: Follow one of the methods above to create your first admin

### "Unable to verify admin status"
- **Cause**: Profile not created or `is_admin` not set
- **Solution**: Check the profiles table and ensure `is_admin = true`

### "Missing SUPABASE_SERVICE_ROLE_KEY"
- **Cause**: Environment variable not set
- **Solution**: Add it in the Vars section of your v0 workspace

### Hero Slider Not Showing
- **Status**: ✅ FIXED - Database schema updated
- The hero slider now works with the updated schema

## Security Notes

1. **Disable `/admin/setup` after first admin** - Consider adding a feature flag
2. **Use strong passwords** for all admin accounts
3. **Never commit credentials** to your repository
4. **Review RLS policies** regularly
5. **Monitor admin access** via the profiles table

## Next Steps

1. Create your first admin user using one of the methods above
2. Login at `/admin/login`
3. Start managing your e-commerce content
4. Add products, categories, and hero slides
5. Monitor orders and payments

## Support

- Check database status: Run SQL queries in Supabase SQL Editor
- Verify RLS policies: Use `ADMIN_SETUP.md` for security checks
- Database schema: See `ARCHITECTURE.md` for full schema details
