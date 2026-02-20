
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function testConnection() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    
    if (error) {
      if (error.code === '42P01') {
        console.log('Connection successful, but table "profiles" does not exist (expected for new DB).');
      } else {
        throw error;
      }
    } else {
      console.log('Connection successful. Profile count:', data);
    }
  } catch (err) {
    console.error('Connection failed:', err.message);
    process.exit(1);
  }
}

testConnection();
