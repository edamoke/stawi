import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

async function seedAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  const email = 'edamoke@gmail.com'
  console.log(`Setting up admin profile for ${email}...`)

  // 1. Check if user exists in auth (we can't easily do this without admin auth API, 
  // but we can upsert the profile assuming the user will sign up)
  
  // Actually, let's just make sure the profile exists with is_admin = true
  // In a new project, we might need to wait for the user to sign up first,
  // OR we can manually insert into public.profiles if we have a UUID.
  
  console.log('Note: Admin must sign up first before we can elevate them via this script')
  console.log('OR you can run this SQL in the dashboard:')
  console.log(`UPDATE public.profiles SET is_admin = true WHERE email = '${email}';`)
}

seedAdmin()
