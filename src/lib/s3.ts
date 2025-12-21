import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Initialize S3 Client (works with Minio, AWS S3, Cloudflare R2)
export const s3Client = new S3Client({
    region: process.env.S3_REGION || 'auto',
    endpoint: process.env.S3_ENDPOINT, // e.g., https://minio.yourdomain.com
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || '',
        secretAccessKey: process.env.S3_SECRET_KEY || '',
    },
    forcePathStyle: true, // Essential for Minio (uses path-style URLs)
})

export const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'products'

/**
 * Generates a temporary download link for a file in S3.
 * @param fileKey The path to the file in the bucket (e.g., "products/app-v1.zip")
 * @param expiresInSeconds Duration until the link expires (default 15 mins)
 */
export async function generateDownloadLink(fileKey: string, expiresInSeconds = 900) {
    try {
        const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: fileKey,
        })

        const url = await getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds })
        return url
    } catch (error) {
        console.error('Error generating presigned URL:', error)
        return null
    }
}
