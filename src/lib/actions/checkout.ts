'use server'

import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function createCheckoutSession(productId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const product = await prisma.product.findUnique({
        where: { id: productId }
    })

    if (!product || !product.stripePriceId) {
        throw new Error('Product or Price ID not found')
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price: product.stripePriceId,
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?canceled=true`,
        metadata: {
            userId: user.id,
            productId: productId,
        },
    })

    if (session.url) {
        redirect(session.url)
    }
}
