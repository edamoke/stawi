
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const migrationPath = path.join(__dirname, 'FULL_MIGRATION_AND_SEED.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');

  console.log('Starting migration...');

  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      if (error.message.includes('function "exec_sql" does not exist')) {
        console.error('ERROR: The "exec_sql" function is not installed in your Supabase database.');
        console.log('Please go to the Supabase SQL Editor and run the migration manually using the contents of scripts/FULL_MIGRATION_AND_SEED.sql');
      } else {
        throw error;
      }
    } else {
      console.log('Migration completed successfully!');
    }
  } catch (err) {
    console.error('Migration failed:', err.message);
    
    // Fallback: try common tables check to see if it might have worked anyway or if some parts passed
    const { data: profileCheck } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    if (profileCheck !== null) {
        console.log('Note: "profiles" table exists. Some parts of the migration may have already been applied.');
    }
  }
}

runMigration();
