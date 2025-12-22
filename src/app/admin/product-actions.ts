'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function addProduct(formData: FormData) {
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = formData.get('price') as string
    const appUrl = formData.get('app_url') as string
    const imageUrl = formData.get('image_url') as string
    const category = formData.get('category') as string
    const billingType = formData.get('billing_type') as string || 'LIFETIME'
    const price1m = formData.get('price1m') as string
    const price12m = formData.get('price12m') as string
    const price24m = formData.get('price24m') as string

    await prisma.product.create({
        data: {
            name,
            description,
            price: parseFloat(price),
            appUrl,
            imageUrl,
            category,
            billingType,
            price1m: price1m ? parseFloat(price1m) : null,
            price12m: price12m ? parseFloat(price12m) : null,
            price24m: price24m ? parseFloat(price24m) : null,
        }
    })

    revalidatePath('/admin')
    revalidatePath('/marketplace')
}

export async function updateProduct(id: string, formData: FormData) {
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = formData.get('price') as string
    const appUrl = formData.get('app_url') as string
    const imageUrl = formData.get('image_url') as string
    const category = formData.get('category') as string
    const billingType = formData.get('billing_type') as string
    const price1m = formData.get('price1m') as string
    const price12m = formData.get('price12m') as string
    const price24m = formData.get('price24m') as string

    await prisma.product.update({
        where: { id },
        data: {
            name,
            description,
            price: parseFloat(price),
            appUrl,
            imageUrl,
            category,
            billingType,
            price1m: price1m ? parseFloat(price1m) : null,
            price12m: price12m ? parseFloat(price12m) : null,
            price24m: price24m ? parseFloat(price24m) : null,
        }
    })

    revalidatePath('/admin')
    revalidatePath(`/admin/products/${id}/edit`)
    revalidatePath('/marketplace')
}

export async function deleteProduct(id: string) {
    await prisma.product.delete({
        where: { id }
    })
    revalidatePath('/admin')
    revalidatePath('/marketplace')
}
