import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

async function testConnection() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log('Using URL:', supabaseUrl)
  // Mask key for safety but show length
  console.log('Using Key (length):', supabaseKey ? supabaseKey.length : 0)

  if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Supabase environment variables are missing.')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log('Testing connection to Supabase...')
  
  try {
    // Try to fetch something simple from the database
    const { data, error } = await supabase.from('products').select('id').limit(1)

    if (error) {
      console.error('Connection failed with error:', JSON.stringify(error, null, 2))
      process.exit(1)
    }

    console.log('Successfully connected to Supabase!')
    console.log('Data sample:', data)
  } catch (err) {
    console.error('An unexpected error occurred during fetch:')
    console.error(err)
    process.exit(1)
  }
}

testConnection()
