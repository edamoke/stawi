import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

async function confirmUser() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  const email = 'edamoke@gmail.com'
  console.log(`Searching for user with email: ${email}...`)

  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()

  if (listError) {
    console.error('Error listing users:', listError.message)
    return
  }

  const user = users.find(u => u.email === email)

  if (!user) {
    console.error(`User ${email} not found. Please sign up first on the website.`)
    return
  }

  console.log(`Found user ${user.id}. Confirming email and setting admin...`)

  const { data, error: updateError } = await supabase.auth.admin.updateUserById(
    user.id,
    { email_confirm: true }
  )

  if (updateError) {
    console.error('Error confirming email:', updateError.message)
  } else {
    console.log('Email confirmed successfully!')
    
    // Now also set is_admin in public.profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ is_admin: true })
      .eq('id', user.id)

    if (profileError) {
       console.error('Error setting admin flag in profile:', profileError.message)
    } else {
       console.log('Admin flag set successfully in profile!')
    }
  }
}

confirmUser()
