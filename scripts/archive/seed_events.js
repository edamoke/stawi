const { createClient } = require("@supabase/supabase-js")
const dotenv = require("dotenv")

dotenv.config({ path: ".env" })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seedEvents() {
  const events = [
    {
      title: "Lamu Cultural Festival 2026",
      slug: "lamu-cultural-festival-2026",
      description: "Experience the magic of Swahili culture in the heart of Lamu Old Town.",
      long_description: "Join us for the annual Lamu Cultural Festival, a celebration of the unique Swahili heritage of Lamu Island.",
      image_url: "/images/IMG_4416(1) (Custom).jpg",
      event_date: "2026-11-15T09:00:00+03:00",
      location: "Lamu Old Town",
      venue: "Mkunguni Square",
      max_attendees: 500,
      price: 2500.00,
      is_free: false,
      is_published: true,
      is_featured: true,
      category: "Culture"
    },
    {
      title: "Diani Beach Yoga Retreat",
      slug: "diani-beach-yoga-retreat",
      description: "Rejuvenate your mind and body on the pristine white sands of Diani.",
      long_description: "Escape to the tranquil shores of Diani for a weekend of yoga, meditation, and wellness.",
      image_url: "/images/IMG_4413(2) (Custom).jpg",
      event_date: "2026-03-20T07:00:00+03:00",
      location: "Diani Beach",
      venue: "The Sands at Nomad",
      max_attendees: 50,
      price: 15000.00,
      is_free: false,
      is_published: true,
      is_featured: true,
      category: "Wellness"
    },
    {
      title: "Mombasa Heritage Walking Tour",
      slug: "mombasa-heritage-tour",
      description: "Discover the hidden stories and historic landmarks of Mombasa Island.",
      long_description: "Guided by local historians, this walking tour takes you through the winding streets of Mombasa Old Town.",
      image_url: "/images/IMG_4754 (Custom).jpg",
      event_date: "2026-02-10T10:00:00+03:00",
      location: "Mombasa Island",
      venue: "Fort Jesus Entrance",
      max_attendees: 20,
      price: 1500.00,
      is_free: false,
      is_published: true,
      is_featured: false,
      category: "History"
    },
    {
      title: "Zanzibar Spice & Culinary Workshop",
      slug: "zanzibar-spice-workshop",
      description: "Learn the secrets of Zanzibari cuisine in the historic Stone Town.",
      long_description: "Immerse yourself in the aromatic world of spices on the Spice Island.",
      image_url: "/images/IMG_4412 (Custom).jpg",
      event_date: "2026-04-05T11:00:00+03:00",
      location: "Stone Town, Zanzibar",
      venue: "Darajani Market Kitchen",
      max_attendees: 15,
      price: 5500.00,
      is_free: false,
      is_published: true,
      is_featured: true,
      category: "Culinary"
    }
  ]

  console.log("Seeding sample events...")
  for (const event of events) {
    const { error } = await supabase.from("events").upsert(event, { onConflict: "slug" })
    if (error) {
      console.error(`Error seeding event ${event.title}:`, error)
    } else {
      console.log(`Successfully seeded: ${event.title}`)
    }
  }
}

seedEvents()
