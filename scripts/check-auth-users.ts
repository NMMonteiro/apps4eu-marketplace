import 'dotenv/config'
import pkg from 'pg'
const { Client } = pkg

async function main() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    })

    try {
        await client.connect()
        console.log('Connected to database.')

        // Check auth.users table
        const res = await client.query('SELECT * FROM auth.users')
        console.log(`Found ${res.rows.length} users in auth.users:`)
        res.rows.forEach(user => {
            console.log(`- ${user.email} (ID: ${user.id}, Confirmed: ${user.email_confirmed_at})`)
        })

    } catch (err) {
        console.error('Query failed:', err)
    } finally {
        await client.end()
    }
}

main()
