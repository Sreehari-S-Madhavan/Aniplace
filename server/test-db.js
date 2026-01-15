/**
 * Database Connection Test
 * 
 * Run this to test if database connection works:
 * node test-db.js
 */

require('dotenv').config()
const { pool } = require('./database/db')

async function testConnection() {
  try {
    console.log('Testing database connection...')
    console.log('Host:', process.env.DB_HOST || 'localhost')
    console.log('Port:', process.env.DB_PORT || 5432)
    console.log('Database:', process.env.DB_NAME || 'anihub')

    const result = await pool.query('SELECT NOW() as current_time, version() as version')

    console.log('\n✅ Database connected successfully!')
    console.log('Current time:', result.rows[0].current_time)
    console.log('PostgreSQL version:', result.rows[0].version.split('\n')[0])

    // Test if tables exist
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `)

    if (tablesResult.rows.length > 0) {
      console.log('\n📊 Tables found:')
      tablesResult.rows.forEach(row => {
        console.log('  -', row.table_name)
      })
    } else {
      console.log('\n⚠️  No tables found. Run schema.sql to create tables.')
    }

    await pool.end()
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Database connection failed!')
    console.error('Error:', error.message)
    console.error('\nTroubleshooting:')
    console.error('1. Check PostgreSQL is running')
    console.error('2. Verify .env file has correct credentials')
    console.error('3. Make sure database "anihub" exists')
    console.error('4. Check firewall settings')
    process.exit(1)
  }
}

testConnection()
