import pg from 'pg'
import * as dotenv from 'dotenv'

dotenv.config()

const { Client } = pg

async function verifyBuckets() {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

  try {
    const client = new Client({
      connectionString: process.env.POSTGRES_URL_NON_POOLING,
      ssl: {
        rejectUnauthorized: false
      }
    })
    
    await client.connect()
    
    const res = await client.query('SELECT id, name, public FROM storage.buckets')
    console.log('Existing Buckets:')
    console.table(res.rows)

    const requiredBuckets = ['hero-slides', 'products', 'content', 'social-feed', 'events']
    const existingBuckets = res.rows.map(b => b.id)
    
    const missing = requiredBuckets.filter(b => !existingBuckets.includes(b))
    
    if (missing.length === 0) {
      console.log('✅ All required buckets exist.')
    } else {
      console.log('❌ Missing buckets:', missing.join(', '))
    }

    // Verify policies
    const policiesRes = await client.query(`
      SELECT policyname, tablename 
      FROM pg_policies 
      WHERE schemaname = 'storage' AND tablename = 'objects'
    `)
    console.log('\nStorage Policies:')
    console.table(policiesRes.rows)

    await client.end()
  } catch (err) {
    console.error('Verification failed:', err.message)
    process.exit(1)
  }
}

verifyBuckets()
