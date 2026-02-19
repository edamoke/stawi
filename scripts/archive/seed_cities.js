import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const cities = [
  {
    name: 'Lamu',
    slug: 'lamu',
    description: 'A UNESCO World Heritage site where time stands still.',
    culture: 'Lamu is the oldest and best-preserved Swahili settlement.',
    leather_history: 'The Wangozi people were renowned for leather craftsmanship.',
    hero_image: '/images/IMG_4416(1) (Custom).jpg',
    display_order: 1
  },
  {
    name: 'Diani',
    slug: 'diani',
    description: 'Pristine white sands meet turquoise waters.',
    culture: 'Diani represents the vibrant coastal lifestyle of Kenya.',
    leather_history: 'Coastal leather work merged utility with aesthetics.',
    hero_image: '/images/IMG_4413(2) (Custom).jpg',
    display_order: 2
  },
  {
    name: 'Mombasa',
    slug: 'mombasa',
    description: 'A bustling island city of history and culture.',
    culture: 'Mombasa is a melting pot of cultures.',
    leather_history: 'Mombasa has been a hub for the leather trade.',
    hero_image: '/images/IMG_4754 (Custom).jpg',
    display_order: 3
  },
  {
    name: 'Zanzibar',
    slug: 'zanzibar',
    description: 'The Spice Island of Stone Town.',
    culture: 'Zanzibars culture is a blend of global influences.',
    leather_history: 'Leather craft reached high sophistication in Zanzibar.',
    hero_image: '/images/IMG_4412 (Custom).jpg',
    display_order: 4
  }
]

async function seed() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log('Seeding cities...')
  const { data, error } = await supabase
    .from('cities')
    .upsert(cities, { onConflict: 'slug' })

  if (error) {
    console.error('Error seeding cities:', error.message)
  } else {
    console.log('Successfully seeded cities!')
  }
}

seed()
