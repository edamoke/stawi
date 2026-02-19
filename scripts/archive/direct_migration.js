import pg from 'pg'
import fs from 'fs'
import path from 'path'
import * as dotenv from 'dotenv'

dotenv.config()

const { Client } = pg

async function runMigration() {
  const connectionString = process.env.POSTGRES_URL_NON_POOLING
  
  if (!connectionString) {
    console.error('Error: POSTGRES_URL_NON_POOLING is missing in .env')
    process.exit(1)
  }

  // FORCE NO SSL VERIFICATION for migration
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

  const client = new Client({
    connectionString: connectionString,
    ssl: true
  })

  try {
    console.log('Connecting to database via direct Postgres connection (SSL verification disabled)...')
    await client.connect()
    console.log('Connected!')

    const sqlFile = path.join('scripts', 'FULL_MIGRATION_AND_SEED.sql')
    console.log(`Reading migration script: ${sqlFile}...`)
    const sqlContent = fs.readFileSync(sqlFile, 'utf8')

    console.log('Executing migration script (this may take a moment)...')
    await client.query(sqlContent)
    
    console.log('---------------------------------------------------------')
    console.log('MIGRATION SUCCESSFUL!')
    console.log('All tables created and Sulhaafrika data seeded.')
    console.log('---------------------------------------------------------')

  } catch (err) {
    console.error('Migration failed with error:')
    console.error(err.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

runMigration()
