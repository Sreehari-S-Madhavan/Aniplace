require('dotenv').config()
const { Client } = require('pg')

async function createDatabase() {
    const client = new Client({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: 'postgres',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
    })

    try {
        await client.connect()
        console.log('Connected to PostgreSQL. Creating database "anihub"...')
        await client.query('CREATE DATABASE anihub;')
        console.log('✅ Database "anihub" created successfully!')
    } catch (err) {
        if (err.code === '42P04') {
            console.log('ℹ️  Database "anihub" already exists.')
        } else {
            console.error('❌ Failed to create database:', err.message)
        }
    } finally {
        await client.end()
    }
}

createDatabase()
