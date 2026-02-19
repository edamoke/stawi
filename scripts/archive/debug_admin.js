import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

async function debugAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseKey)
  const email = 'edamoke@gmail.com'

  console.log(`Searching for user with email: ${email}...`)
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()

  if (listError) {
    console.error('Error listing users:', listError.message)
    return
  }

  const user = users.find(u => u.email === email)

  if (!user) {
    console.error(`User ${email} not found.`)
    return
  }

  console.log(`Auth User ID: ${user.id}`)
  console.log(`Email Confirmed: ${user.email_confirmed_at}`)

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError) {
    console.error('Profile not found for this ID. Creating profile...')
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: email,
        is_admin: true,
        full_name: 'Admin'
      })
    
    if (insertError) {
      console.error('Error creating profile:', insertError.message)
    } else {
      console.log('Profile created successfully with admin rights!')
    }
  } else {
    console.log('Existing Profile:', profile)
    if (!profile.is_admin) {
      console.log('Profile exists but is NOT admin. Updating...')
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ is_admin: true })
        .eq('id', user.id)
      
      if (updateError) {
        console.error('Error updating profile:', updateError.message)
      } else {
        console.log('Profile updated to admin successfully!')
      }
    } else {
      console.log('Profile is already marked as admin.')
    }
  }
}

debugAdmin()
