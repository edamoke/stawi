import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"
import * as fs from "fs"
import * as path from "path"

dotenv.config({ path: ".env.local" })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seedEvents() {
  const sqlPath = path.join(process.cwd(), "scripts", "020_seed_sample_events.sql")
  const sql = fs.readFileSync(sqlPath, "utf8")

  console.log("Seeding sample events...")
  
  const { error } = await supabase.rpc("exec_sql", { sql_query: sql })

  if (error) {
    // If exec_sql RPC doesn't exist, we'll try a different approach or inform the user
    console.error("Error executing SQL:", error)
    
    if (error.message.includes("function exec_sql(text) does not exist")) {
        console.log("The 'exec_sql' RPC function is not available. Please run the SQL manually in the Supabase SQL Editor:")
        console.log("--------------------------------------------------")
        console.log(sql)
        console.log("--------------------------------------------------")
    }
  } else {
    console.log("Successfully seeded sample events.")
  }
}

seedEvents()
