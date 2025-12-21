import 'dotenv/config'
import pkg from 'pg'
const { Client } = pkg

async function main() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    })

    try {
        await client.connect()
        console.log('Connected to database.')

        const products = [
            ['Standard License', 'Standard license for apps4EUprojects digital assets.', 19.00, 'vault/standard_pkg.zip'],
            ['Pro License', 'Professional license for apps4EUprojects digital assets, includes priority support and commercial usage.', 49.00, 'vault/pro_pkg.zip'],
        ]

        for (const [name, desc, price, path] of products) {
            const id = crypto.randomUUID()
            await client.query(
                'INSERT INTO "Product" (id, name, description, price, s3_file_path, "createdAt") VALUES ($1, $2, $3, $4, $5, NOW()) ON CONFLICT DO NOTHING',
                [id, name, desc, price, path]
            )
            console.log(`Seeded product: ${name}`)
        }

        console.log('Seeding finished.')
    } catch (err) {
        console.error('Seeding failed:', err)
    } finally {
        await client.end()
    }
}

main()
