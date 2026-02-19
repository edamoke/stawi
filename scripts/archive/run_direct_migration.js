import pg from 'pg'
import fs from 'fs'
import path from 'path'
import * as dotenv from 'dotenv'

dotenv.config()

const { Client } = pg

async function runMigration() {
  // Use the Non-Pooling URL for direct migration
  const connectionString = process.env.POSTGRES_URL_NON_POOLING
  
  if (!connectionString) {
    console.error('Error: POSTGRES_URL_NON_POOLING is missing in .env')
    process.exit(1)
  }

  console.log('Attempting to connect with NON-POOLING URL...')
  
  // Disable TLS rejection for migration
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

  const client = new Client({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  })

  try {
    await client.connect()
    console.log('CONNECTED successfully!')

    const sqlFile = path.join('scripts', 'FULL_MIGRATION_AND_SEED.sql')
    let sqlContent = fs.readFileSync(sqlFile, 'utf8')

    // Remove BOM if it exists
    if (sqlContent.charCodeAt(0) === 0xFEFF) {
      sqlContent = sqlContent.slice(1)
    }

    console.log('Executing FULL_MIGRATION_AND_SEED.sql...')
    // Split by semicolons is risky but sometimes necessary if it's too large,
    // but usually client.query(sqlContent) works if it's one block.
    await client.query(sqlContent)
    
    console.log('MIGRATION SUCCESSFUL!')

  } catch (err) {
    console.error('MIGRATION FAILED:', err.message)
    if (err.detail) console.error('Detail:', err.detail)
    if (err.hint) console.error('Hint:', err.hint)
    process.exit(1)
  } finally {
    await client.end()
  }
}

runMigration()
