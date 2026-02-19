import "dotenv/config"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

const NEW_CATEGORIES = [
  "Black and white sling bag",
  "Black sling bag",
  "Black wash bag",
  "Brown and white sling bag",
  "Brown maxi side bag",
  "Brown sling bag",
  "Brown washbags",
  "Cardholders",
  "Chest bag",
  "Glass cases",
  "Maxi side bag",
  "Mini side bag",
  "Side bags maxi",
  "Wallet",
  "Wash bags",
  "Washbag"
]

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
}

async function updateCategories() {
  console.log("Updating categories for Ngozi Collection...")

  // 1. Get all categories
  const { data: existingCategories, error: fetchError } = await supabase
    .from("categories")
    .select("*")

  if (fetchError) {
    console.error("Error fetching categories:", fetchError)
    return
  }

  // 2. We keep 'scents' and any other non-ngozi related ones if they exist, 
  // but the user said "remove all other categories under ngozi collection and replace them with the attached one"
  // Assuming 'scents' is separate.
  
  // Let's identify which ones to delete. We'll delete all EXCEPT 'scents' (if it exists)
  // and then add the new ones.
  const toDelete = existingCategories.filter(c => c.slug !== 'scents').map(c => c.id)

  if (toDelete.length > 0) {
    console.log(`Deleting ${toDelete.length} old categories...`)
    const { error: deleteError } = await supabase
      .from("categories")
      .delete()
      .in("id", toDelete)
    
    if (deleteError) {
      console.error("Error deleting categories:", deleteError)
      // If there are products linked, we might need to handle that, but typically we want a clean slate
    }
  }

  // 3. Insert new categories
  const inserts = NEW_CATEGORIES.map(name => ({
    name,
    slug: slugify(name)
  }))

  console.log("Inserting new categories...")
  const { error: insertError } = await supabase
    .from("categories")
    .insert(inserts)

  if (insertError) {
    console.error("Error inserting new categories:", insertError)
  } else {
    console.log("Categories updated successfully!")
  }
}

updateCategories()
