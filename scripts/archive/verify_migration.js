import pg from 'pg'
import * as dotenv from 'dotenv'

dotenv.config()

const { Client } = pg

async function verifyMigration() {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

  try {
    const client = new Client({
      connectionString: process.env.POSTGRES_URL_NON_POOLING,
      ssl: {
        rejectUnauthorized: false
      }
    })
    
    await client.connect()
    
    const tables = [
      'categories',
      'products',
      'hero_slides',
      'cities',
      'events',
      'event_registrations',
      'site_settings',
      'profiles'
    ]

    console.log('Data Migration Status:')
    console.log('----------------------')

    for (const table of tables) {
      try {
        const res = await client.query(`SELECT COUNT(*) FROM ${table}`)
        console.log(`✅ Table "${table}": ${res.rows[0].count} rows`)
      } catch (e) {
        console.log(`❌ Table "${table}": NOT FOUND or ERROR (${e.message})`)
      }
    }

    // Check for admin user
    const adminRes = await client.query(`SELECT count(*) FROM profiles WHERE is_admin = true`)
    console.log(`\nAdmin Users: ${adminRes.rows[0].count}`)

    await client.end()
  } catch (err) {
    console.error('Verification failed:', err.message)
    process.exit(1)
  }
}

verifyMigration()
