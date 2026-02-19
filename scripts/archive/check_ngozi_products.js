import pg from 'pg'
import * as dotenv from 'dotenv'

dotenv.config()

const { Client } = pg

async function checkProducts() {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

  try {
    const client = new Client({
      connectionString: process.env.POSTGRES_URL_NON_POOLING,
      ssl: {
        rejectUnauthorized: false
      }
    })
    
    await client.connect()
    console.log('Connected!')

    const res = await client.query("SELECT name, slug, image_url, images, is_active FROM products WHERE image_url LIKE '/products/ngozi-collection/%'")
    console.log('Products found:', res.rows.length)
    console.log(JSON.stringify(res.rows, null, 2))
    
    await client.end()

  } catch (err) {
    console.error('FAILED:', err.message)
    process.exit(1)
  }
}

checkProducts()
