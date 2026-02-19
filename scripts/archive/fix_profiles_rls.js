import pg from 'pg'
import * as dotenv from 'dotenv'

dotenv.config()

const { Client } = pg

async function runSql() {
  const sql = `
    DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
    CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
    CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
  `;

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

  try {
    const client = new Client({
      connectionString: process.env.POSTGRES_URL_NON_POOLING,
      ssl: {
        rejectUnauthorized: false
      }
    })
    
    await client.connect()
    await client.query(sql)
    console.log("RLS policies updated successfully")
    await client.end()

  } catch (err) {
    console.error('FAILED:', err.message)
    process.exit(1)
  }
}

runSql()
