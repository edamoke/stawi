import "dotenv/config"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

async function updateHeroSlides() {
  console.log("Updating hero slides...")

  // Delete existing slides to start fresh
  const { error: deleteError } = await supabase
    .from("hero_slides")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000") // dummy to delete all

  if (deleteError) {
    console.error("Error deleting old slides:", deleteError)
  }

  const slides = [
    {
      image_url: "/images/image.png",
      alt: "Stawi Afrika Leather Collection",
      heading: "The Ngozi Collection",
      subheading: "Handcrafted Excellence",
      description: "Experience the finest African leather craftsmanship.",
      position: 1,
      active: true,
    },
    {
      image_url: "/images/IMG_4410(2) (Custom).jpg",
      alt: "African Luxury Accessories",
      heading: "Timeless Elegance",
      subheading: "Luxury Redefined",
      description: "Sophisticated designs for the modern lifestyle.",
      position: 2,
      active: true,
    },
  ]

  const { data, error } = await supabase.from("hero_slides").insert(slides)

  if (error) {
    console.error("Error inserting slides:", error)
  } else {
    console.log("Hero slides updated successfully!")
  }
}

updateHeroSlides()
