/**
 * Database Seeder Script
 * 
 * Usage: node seed_db.js
 * 
 * This script:
 * 1. Reads schema.sql and creates tables
 * 2. Reads initial_data.sql and inserts seed data
 */

require('dotenv').config()
const fs = require('fs')
const path = require('path')
const { Pool } = require('pg')

async function seed() {
    const connectionConfig = process.env.DATABASE_URL
        ? {
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }
        }
        : {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            database: process.env.DB_NAME || 'anihub',
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD,
        }

    const pool = new Pool(connectionConfig)

    try {
        console.log('🔌 Connecting to database...')
        await pool.query('SELECT NOW()')
        console.log('✅ Connected successfully')

        // Read Schema
        console.log('📝 Reading schema.sql...')
        const schemaPath = path.join(__dirname, 'database', 'schema.sql')
        const schemaSql = fs.readFileSync(schemaPath, 'utf8')

        // Read Seed Data
        console.log('📝 Reading initial_data.sql...')
        const dataPath = path.join(__dirname, 'database', 'initial_data.sql')
        const dataSql = fs.readFileSync(dataPath, 'utf8')

        // Execute Schema
        console.log('⚙️ Creating tables...')
        await pool.query(schemaSql)
        console.log('✅ Tables created')

        // Execute Seed Data
        console.log('🌱 Seeding initial data...')
        await pool.query(dataSql)
        console.log('✅ Data seeded successfully')

        console.log('✨ Database initialization complete!')
    } catch (error) {
        console.error('❌ Error initializing database:', error)
        if (error.code === '28P01') {
            console.error('\n⚠️  AUTHENTICATION FAILED: Please check your DB_PASSWORD in .env file')
        }
    } finally {
        await pool.end()
    }
}

seed()
