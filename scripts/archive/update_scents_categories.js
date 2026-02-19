const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateScentsCategories() {
  try {
    const categories = [
      { name: 'Scent 1', slug: 'scent-1' },
      { name: 'Scent 2', slug: 'scent-2' },
      { name: 'Scent 3', slug: 'scent-3' },
      { name: 'Scent 4', slug: 'scent-4' },
    ];

    console.log('Inserting/Updating Scent categories...');
    for (const cat of categories) {
      const { error } = await supabase
        .from('categories')
        .upsert(cat, { onConflict: 'slug' });
      
      if (error) console.error(`Error with ${cat.name}:`, error.message);
      else console.log(`Processed category: ${cat.name}`);
    }

    // Assign some products to these categories if they exist
    // For now, we just ensure categories exist.
    
    console.log('Done.');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

updateScentsCategories();
