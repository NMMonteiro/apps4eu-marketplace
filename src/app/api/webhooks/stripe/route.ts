import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import Stripe from 'stripe'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
    const body = await req.text()
    const headerList = await headers()
    const signature = headerList.get('stripe-signature')

    if (!signature) {
        return new NextResponse('Missing signature', { status: 400 })
    }

    let event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return new NextResponse(`Webhook Error: ${message}`, { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const productId = session.metadata?.productId

        if (!userId || !productId) {
            return new NextResponse('Metadata missing', { status: 400 })
        }

        // 1. Get Product Details
        const product = await prisma.product.findUnique({
            where: { id: productId }
        })

        if (!product) {
            return new NextResponse('Product not found', { status: 404 })
        }

        // 2. Create Transaction
        await prisma.transaction.create({
            data: {
                paymentIntentId: session.payment_intent as string,
                userId: userId,
                amount: ((session.amount_total || 0) / 100).toString(),
                status: 'completed'
            }
        })

        // 3. Generate License
        const license = await prisma.license.create({
            data: {
                userId: userId,
                productId: productId,
                status: 'active'
            }
        })

        // 4. Send Email via Resend
        const userEmail = session.customer_details?.email
        if (userEmail) {
            await resend.emails.send({
                from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
                to: userEmail,
                subject: `Your License Key for ${product.name}`,
                html: `
          <h1>Thank you for your purchase!</h1>
          <p>Product: <strong>${product.name}</strong></p>
          <p>Your License Key: <code>${license.licenseKey}</code></p>
          <p>Download URL: <a href="${process.env.NEXT_PUBLIC_SITE_URL}/download/${product.id}">Click here to download</a></p>
        `,
            })
        }
    }

    return new NextResponse('Success', { status: 200 })
}
