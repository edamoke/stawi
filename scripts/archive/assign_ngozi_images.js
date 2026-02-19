const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function assignNgoziImages() {
  try {
    // 1. Get all Ngozi images from the directory
    const ngoziDir = path.join(process.cwd(), 'public', 'products', 'ngozi-collection');
    const files = fs.readdirSync(ngoziDir);
    const ngoziImages = files
      .filter(file => file.match(/\.(jpg|jpeg|png|gif)$/i))
      .map(file => `/products/ngozi-collection/${file}`);

    if (ngoziImages.length === 0) {
      console.error('No Ngozi images found in public/products/ngozi-collection');
      return;
    }

    console.log(`Found ${ngoziImages.length} Ngozi images.`);

    // Helper to get random image
    const getRandomImage = () => ngoziImages[Math.floor(Math.random() * ngoziImages.length)];

    // 2. Update Cities
    const { data: cities, error: citiesError } = await supabase
      .from('cities')
      .select('id, name');

    if (citiesError) throw citiesError;

    console.log(`Updating ${cities.length} cities...`);
    for (const city of cities) {
      const randomImage = getRandomImage();
      const { error } = await supabase
        .from('cities')
        .update({ hero_image: randomImage })
        .eq('id', city.id);
      
      if (error) console.error(`Error updating city ${city.name}:`, error.message);
      else console.log(`Updated city ${city.name} with image: ${randomImage}`);
    }

    // 3. Update City Experiences
    const { data: experiences, error: expError } = await supabase
      .from('city_experiences')
      .select('id, title');

    if (expError) throw expError;

    console.log(`Updating ${experiences.length} city experiences...`);
    for (const exp of experiences) {
      const randomImage = getRandomImage();
      const { error } = await supabase
        .from('city_experiences')
        .update({ image_url: randomImage })
        .eq('id', exp.id);
      
      if (error) console.error(`Error updating experience ${exp.title}:`, error.message);
      else console.log(`Updated experience ${exp.title} with image: ${randomImage}`);
    }

    // 4. Update Events
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id, title');

    if (eventsError) throw eventsError;

    console.log(`Updating ${events.length} events...`);
    for (const event of events) {
      const randomImage = getRandomImage();
      const { error } = await supabase
        .from('events')
        .update({ image_url: randomImage })
        .eq('id', event.id);
      
      if (error) console.error(`Error updating event ${event.title}:`, error.message);
      else console.log(`Updated event ${event.title} with image: ${randomImage}`);
    }

    console.log('Successfully randomly assigned Ngozi images to events and cities!');

  } catch (err) {
    console.error('An error occurred:', err.message);
  }
}

assignNgoziImages();
