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

        await client.query(
            'UPDATE "Product" SET "stripePriceId" = $1 WHERE name = $2',
            ['price_1Sgk7Z2SVpoXiBfMoFfA3RdH', 'Standard License']
        )
        await client.query(
            'UPDATE "Product" SET "stripePriceId" = $1 WHERE name = $2',
            ['price_1Sgk7Z2SVpoXiBfMEQOF6Bqh', 'Pro License']
        )

        console.log('Updated Price IDs in database.')
    } catch (err) {
        console.error('Update failed:', err)
    } finally {
        await client.end()
    }
}

main()
