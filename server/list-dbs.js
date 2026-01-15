require('dotenv').config()
const { Pool } = require('pg')

async function listDatabases() {
    const pool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: 'postgres', // Connect to default postgres DB
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
        connectionTimeoutMillis: 5000,
    })

    try {
        console.log('Checking available databases...')
        const res = await pool.query('SELECT datname FROM pg_database WHERE datistemplate = false;')
        console.log('\nFound databases:')
        res.rows.forEach(row => console.log(` - ${row.datname}`))

        const exists = res.rows.some(row => row.datname === 'anihub')
        if (exists) {
            console.log('\n✅ "anihub" database exists.')
        } else {
            console.log('\n❌ "anihub" database does NOT exist.')
            console.log('Run this to create it: node create-db.js')
        }
    } catch (err) {
        console.error('\n❌ Failed to connect to PostgreSQL:')
        console.error(err.message)
        console.log('\nPossible reasons:')
        console.log('1. Password in .env is incorrect.')
        console.log('2. PostgreSQL is listening on a different port (check pgAdmin).')
        console.log('3. Firewall is blocking connection.')
    } finally {
        await pool.end()
    }
}

listDatabases()
