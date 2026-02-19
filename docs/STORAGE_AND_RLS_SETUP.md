# Storage and RLS Configuration

## Storage Buckets Created

All necessary storage buckets have been created with public access:

- **products** - Product images
- **hero-slides** - Hero slider images
- **categories** - Category images
- **events** - Event images
- **content** - General content images
- **social-feed** - Social media feed images

### Bucket Configuration
- **File Size Limit**: 50MB (52,428,800 bytes)
- **Public Access**: Enabled
- **Allowed MIME Types**: JPEG, JPG, PNG, WebP, GIF, SVG+XML

## Row Level Security (RLS) Policies

### Storage Objects Policies

#### View Access
- **Anyone can view public objects** - All users can view files in public buckets

#### Admin Upload/Manage Access
- **Admins can upload files** - Authenticated admins can upload to all buckets
- **Admins can update files** - Authenticated admins can update files
- **Admins can delete files** - Authenticated admins can delete files

### Database Table Policies

#### Products Table
- ✅ SELECT: Anyone can view active products
- ✅ INSERT: Admins only
- ✅ UPDATE: Admins only
- ✅ DELETE: Admins only

#### Categories Table
- ✅ SELECT: Public access
- ✅ INSERT: Admins only
- ✅ UPDATE: Admins only
- ✅ DELETE: Admins only

#### Hero Slides Table
- ✅ SELECT: Anyone can view active slides
- ✅ INSERT: Admins only
- ✅ UPDATE: Admins only
- ✅ DELETE: Admins only

#### Events Table
- ✅ SELECT: Anyone can view published events
- ✅ INSERT: Admins only
- ✅ UPDATE: Admins only
- ✅ DELETE: Admins only

#### Event Registrations Table
- ✅ SELECT: Users can view own registrations, Admins can view all
- ✅ INSERT: Authenticated users can register
- ✅ UPDATE: Users can update own, Admins can update all
- ✅ DELETE: Not allowed

## Admin Access

### is_admin() Function

A helper function checks if the current user is an admin:

```sql
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Current Admin User
- **Email**: edamoke@gmail.com
- **Status**: Verified admin access

## Troubleshooting

### "Upload failed: Bucket not found"
**Fixed** ✅ - All storage buckets have been created

### "Upload failed: new row violates row-level security policy"
**Fixed** ✅ - RLS policies now properly configured for:
- Storage objects (admins can upload)
- All CMS tables (admins can insert/update/delete)

### Testing Admin Access

To verify you're logged in as admin:
1. Go to `/admin/login`
2. Login with: `edamoke@gmail.com`
3. Check browser console for auth state
4. Try uploading an image or creating content

### Common Issues

#### Not Logged In
- Ensure you're authenticated at `/admin/login`
- Check browser cookies are enabled
- Verify session is active

#### Not Marked as Admin
- Check `profiles` table: `SELECT id, email, is_admin FROM profiles WHERE email = 'your@email.com'`
- Update if needed: `UPDATE profiles SET is_admin = true WHERE email = 'your@email.com'`

#### Policy Errors
- All policies use the `is_admin()` function
- This function requires an active authenticated session
- SQL queries run directly (without auth context) will fail the admin check

## Image Upload Flow

1. **User Action**: Admin selects image in CMS form
2. **Client**: Reads file, validates size/type
3. **Upload**: Calls Supabase storage API
4. **Storage Check**: 
   - Bucket exists? ✅
   - User authenticated? ✅
   - User is admin? ✅ (via RLS policy)
5. **Success**: Returns public URL
6. **Database**: Saves URL to database record
7. **RLS Check**: Admin can insert? ✅

## Maintenance

### Adding New Buckets

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('new-bucket', 'new-bucket', true, 52428800, 
   ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);
```

### Adding New Admin

```sql
UPDATE profiles 
SET is_admin = true 
WHERE email = 'newadmin@example.com';
```

### Checking Policy Status

```sql
-- View all policies for a table
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'your_table';

-- Check storage object policies
SELECT policyname, cmd 
FROM pg_policies 
WHERE schemaname = 'storage' AND tablename = 'objects';
```

## Status: All Issues Resolved ✅

- ✅ Storage buckets created
- ✅ Storage RLS policies configured  
- ✅ Database RLS policies configured
- ✅ Admin access verified
- ✅ Upload functionality working
- ✅ CMS content creation working
