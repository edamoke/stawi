import pg from 'pg'
import fs from 'fs'
import path from 'path'
import * as dotenv from 'dotenv'

dotenv.config()

const { Client } = pg

async function runMigration() {
  const filename = process.argv[2]
  if (!filename) {
    console.error('Error: Please provide a SQL filename as an argument')
    process.exit(1)
  }

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

  try {
    console.log('Connecting to database using POSTGRES_URL_NON_POOLING...')
    
    const client = new Client({
      connectionString: process.env.POSTGRES_URL_NON_POOLING,
      ssl: {
        rejectUnauthorized: false
      }
    })
    
    await client.connect()
    console.log('Connected!')

    const sqlFile = path.join('scripts', filename)
    const sqlContent = fs.readFileSync(sqlFile, 'utf8')

    console.log(`Executing ${filename}...`)
    await client.query(sqlContent)
    
    console.log('SUCCESS!')
    await client.end()

  } catch (err) {
    console.error('FAILED:', err.message)
    process.exit(1)
  }
}

runMigration()
