import pg from 'pg'
import * as dotenv from 'dotenv'

dotenv.config()

const { Client } = pg

async function runSql() {
  const sql = process.argv[2]
  if (!sql) {
    console.error('Error: Please provide SQL string as an argument')
    process.exit(1)
  }

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

  try {
    const client = new Client({
      connectionString: process.env.POSTGRES_URL_NON_POOLING,
      ssl: {
        rejectUnauthorized: false
      }
    })
    
    await client.connect()
    const res = await client.query(sql)
    console.log(JSON.stringify(res.rows, null, 2))
    await client.end()

  } catch (err) {
    console.error('FAILED:', err.message)
    process.exit(1)
  }
}

runSql()
