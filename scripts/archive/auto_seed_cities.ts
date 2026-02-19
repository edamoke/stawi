import { createAdminClient } from "@/lib/supabase/admin"

async function seed() {
  const supabase = createAdminClient()
  
  console.log("Starting automated seeding...")

  const citiesToSeed = [
    {
      name: "Lamu",
      slug: "lamu",
      description: "A UNESCO World Heritage site where time stands still and the essence of Swahili culture is preserved in every stone.",
      culture: "Lamu is the oldest and best-preserved Swahili settlement in East Africa, maintaining its traditional functions. Built in coral stone and mangrove timber, the town is characterized by the simplicity of structural forms enriched by such features as inner courtyards, verandas, and elaborately carved wooden doors.",
      leather_history: "The Wangozi people of the Lamu archipelago were renowned for their exquisite leather craftsmanship, a tradition that has influenced Sulha Afrika's commitment to heritage and quality.",
      hero_image: "/images/IMG_4416(1) (Custom).jpg",
      hero_sentence: "DISCOVER HERITAGE",
      display_order: 1,
      is_active: true
    },
    {
      name: "Diani",
      slug: "diani",
      description: "Pristine white sands meet turquoise waters, creating a serene sanctuary for the soul and a vibrant playground for the adventurous.",
      culture: "Diani represents the vibrant coastal lifestyle of Kenya, where the rhythm of the ocean dictates the pace of life and the warmth of the community welcomes every visitor with open arms.",
      leather_history: "Coastal leather work in Diani merged utility with aesthetics, creating durable pieces that withstood the salty air and reflected the beauty of the surrounding natural environment.",
      hero_image: "/images/IMG_4413(2) (Custom).jpg",
      hero_sentence: "DISCOVER SERENITY",
      display_order: 2,
      is_active: true
    },
    {
      name: "Mombasa",
      slug: "mombasa",
      description: "A bustling island city where history and modernity dance together in a vibrant celebration of culture, trade, and community.",
      culture: "Mombasa is a melting pot of cultures, a historic gateway to East Africa that has been shaped by centuries of global trade and a resilient spirit of hospitality.",
      leather_history: "As a historic hub for the leather trade, Mombasa has always been at the forefront of craftsmanship, where traditional techniques meet new influences to create something truly unique.",
      hero_image: "/images/IMG_4754 (Custom).jpg",
      hero_sentence: "DISCOVER VIBRANCY",
      display_order: 3,
      is_active: true
    },
    {
      name: "Zanzibar",
      slug: "zanzibar",
      description: "The Spice Island of Stone Town, where every narrow alleyway tells a story and the air is filled with the scent of cloves and history.",
      culture: "Zanzibar's culture is a breathtaking blend of African, Arab, Indian, and European influences, creating a unique tapestry of traditions that is reflected in its art, music, and daily life.",
      leather_history: "Leather craft reached a high level of sophistication in Zanzibar, with intricate designs and master techniques that continue to inspire artisans today.",
      hero_image: "/images/IMG_4412 (Custom).jpg",
      hero_sentence: "DISCOVER ESSENCE",
      display_order: 4,
      is_active: true
    }
  ]

  for (const city of citiesToSeed) {
    console.log(`Processing city: ${city.name}`)
    const { data: cityData, error: cityError } = await supabase
      .from("cities")
      .upsert(city, { onConflict: 'slug' })
      .select()
      .single()
    
    if (cityError) {
      console.error(`Error seeding ${city.name}:`, cityError)
      continue
    }

    if (cityData) {
      const { data: existingExps } = await supabase
        .from("city_experiences")
        .select("id")
        .eq("city_id", cityData.id)

      if (!existingExps || existingExps.length === 0) {
        let experiences: any[] = []
        if (city.slug === 'lamu') {
          experiences = [
            { city_id: cityData.id, title: "Old Town Walk", description: "Wander through the historic streets", image_url: "/images/IMG_4421(3) (Custom).jpg", display_order: 1 },
            { city_id: cityData.id, title: "Dhow Sailing", description: "Experience the ocean at sunset", image_url: "/images/IMG_4420(1) (Custom).jpg", display_order: 2 }
          ]
        } else if (city.slug === 'diani') {
          experiences = [
            { city_id: cityData.id, title: "Beach Sensation", description: "Pure relaxation on white sands", image_url: "/images/IMG_4745 (Custom).jpg", display_order: 1 },
            { city_id: cityData.id, title: "Ocean Adventure", description: "Explore the vibrant reef", image_url: "/images/IMG_4747 (Custom).jpg", display_order: 2 }
          ]
        } else if (city.slug === 'mombasa') {
          experiences = [
            { city_id: cityData.id, title: "Fort Jesus Visit", description: "Step back in time at the fort", image_url: "/images/IMG_4756 (Custom).jpg", display_order: 1 },
            { city_id: cityData.id, title: "Spice Market", description: "A feast for the senses", image_url: "/images/IMG_4411 (Custom).jpg", display_order: 2 }
          ]
        } else if (city.slug === 'zanzibar') {
          experiences = [
            { city_id: cityData.id, title: "Stone Town Tour", description: "The heart of Zanzibari culture", image_url: "/images/IMG_4415 (Custom).jpg", display_order: 1 },
            { city_id: cityData.id, title: "Spice Plantation", description: "Discover the source of flavors", image_url: "/images/IMG_4421 (Custom).jpg", display_order: 2 }
          ]
        }
        
        if (experiences.length > 0) {
          console.log(`Inserting experiences for ${city.name}`)
          await supabase.from("city_experiences").insert(experiences)
        }
      }
    }
  }
  console.log("Seeding finished.")
}

seed()
