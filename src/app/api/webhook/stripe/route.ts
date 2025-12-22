
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-11-27-acacia' as any
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: Request) {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature') as string

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, signature, endpointSecret!)
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`)
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session
        const metadata = session.metadata

        if (metadata?.userId && metadata?.productId) {
            console.log(`Processing successful payment for user ${metadata.userId} and product ${metadata.productId}`)

            try {
                // 1. Create Transaction record
                await prisma.transaction.create({
                    data: {
                        paymentIntentId: session.payment_intent as string,
                        userId: metadata.userId,
                        amount: (session.amount_total || 0) / 100,
                        status: 'completed'
                    }
                })

                // 2. Create License record
                await prisma.license.create({
                    data: {
                        userId: metadata.userId,
                        productId: metadata.productId,
                        status: 'active'
                    }
                })

                console.log('License and Transaction created successfully.')
            } catch (err) {
                console.error('Error fulfilling order:', err)
                return NextResponse.json({ error: 'Fulfillment failed' }, { status: 500 })
            }
        }
    }

    return NextResponse.json({ received: true })
}
