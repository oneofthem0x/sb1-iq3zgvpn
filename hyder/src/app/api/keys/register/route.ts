import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { z } from 'zod'

// Validation schema
const KeyRegistrationSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  publicKey: z.string().includes('-----BEGIN PGP PUBLIC KEY BLOCK-----'),
  timestamp: z.number()
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { address, publicKey, timestamp } = KeyRegistrationSchema.parse(body)

    const client = await clientPromise
    const db = client.db("hyder")
    const keysCollection = db.collection("public_keys")

    // Upsert the public key
    await keysCollection.updateOne(
      { address },
      { 
        $set: { 
          publicKey,
          timestamp 
        } 
      },
      { upsert: true }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Key registration error:', error)
    return NextResponse.json(
      { error: 'Failed to register key' },
      { status: 400 }
    )
  }
} 