/**
 * Database Connection
 * 
 * Connects to PostgreSQL database.
 * 
 * TODO: Implement database connection
 * - Use pg library to connect
 * - Store connection pool
 * - Export query function
 */

const { Pool } = require('pg')

// Create connection pool
// Connection details come from environment variables
// Connection details
const connectionConfig = process.env.DATABASE_URL
  ? {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  }
  : {
    host: String(process.env.DB_HOST || 'localhost'),
    port: Number(process.env.DB_PORT || 5432),
    database: String(process.env.DB_NAME || 'anihub'),
    user: String(process.env.DB_USER || 'postgres'),
    password: String(process.env.DB_PASSWORD || ''),
  }

console.log('🔌 Attempting DB connection with:', {
  host: connectionConfig.host || 'via URL',
  database: connectionConfig.database,
  user: connectionConfig.user,
  port: connectionConfig.port
})

const pool = new Pool({
  ...connectionConfig,
  // Maximum number of clients in the pool
  max: 20,
  // How long a client is allowed to remain idle before being closed
  idleTimeoutMillis: 30000,
  // How long to wait before timing out when connecting a new client
  connectionTimeoutMillis: 10000,
})

// Test connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database')
})

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err)
})

/**
 * Execute a SQL query
 * 
 * @param {string} text - SQL query string
 * @param {array} params - Query parameters (for prepared statements)
 * @returns {Promise} - Query result
 */
async function query(text, params) {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('Executed query', { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error('Query error', { text, error })
    throw error
  }
}

module.exports = {
  query,
  pool
}
