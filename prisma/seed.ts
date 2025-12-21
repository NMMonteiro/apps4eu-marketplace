import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
})

async function main() {
    const products = [
        {
            name: 'Standard License',
            description: 'Standard license for apps4EUprojects digital assets.',
            price: 19.00,
            s3_file_path: 'vault/standard_pkg.zip',
        },
        {
            name: 'Pro License',
            description: 'Professional license for apps4EUprojects digital assets, includes priority support and commercial usage.',
            price: 49.00,
            s3_file_path: 'vault/pro_pkg.zip',
        },
    ]

    console.log('Seeding products...')

    for (const p of products) {
        const product = await prisma.product.create({
            data: p,
        })
        console.log(`Created product: ${product.name} with ID: ${product.id}`)
    }

    console.log('Seeding finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
