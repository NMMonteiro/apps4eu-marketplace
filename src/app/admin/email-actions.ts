'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function saveEmailTemplate(slug: string, subject: string, body: string) {
    await prisma.emailTemplate.upsert({
        where: { slug },
        update: { subject, body },
        create: { slug, subject, body }
    })
    revalidatePath('/admin')
}

export async function getEmailTemplate(slug: string) {
    return await prisma.emailTemplate.findUnique({
        where: { slug }
    })
}
