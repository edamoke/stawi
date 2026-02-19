import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

async function seed() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log('Fetching city IDs...')
  const { data: cities, error: cityError } = await supabase.from('cities').select('id, slug')
  if (cityError) {
    console.error('Error fetching cities:', cityError.message)
    return
  }

  const cityMap = {}
  cities.forEach(c => cityMap[c.slug] = c.id)

  const events = [
    {
        title: 'Lamu Cultural Festival 2026',
        slug: 'lamu-cultural-festival-2026',
        description: 'Experience the magic of Swahili culture in the heart of Lamu Old Town.',
        image_url: '/images/IMG_4416(1) (Custom).jpg',
        event_date: '2026-11-15 09:00:00+03',
        location: 'Lamu Old Town',
        venue: 'Mkunguni Square',
        max_attendees: 500,
        price: 2500.00,
        is_free: false,
        is_published: true,
        is_featured: true,
        category: 'Culture',
        city_id: cityMap['lamu']
    },
    {
        title: 'Diani Beach Yoga Retreat',
        slug: 'diani-beach-yoga-retreat',
        description: 'Rejuvenate your mind and body on the pristine white sands of Diani.',
        image_url: '/images/IMG_4413(2) (Custom).jpg',
        event_date: '2026-03-20 07:00:00+03',
        location: 'Diani Beach',
        venue: 'The Sands at Nomad',
        max_attendees: 50,
        price: 15000.00,
        is_free: false,
        is_published: true,
        is_featured: true,
        category: 'Wellness',
        city_id: cityMap['diani']
    }
  ]

  console.log('Seeding events...')
  const { error } = await supabase.from('events').upsert(events, { onConflict: 'slug' })

  if (error) {
    console.error('Error seeding events:', error.message)
  } else {
    console.log('Successfully seeded events!')
  }
}

seed()
