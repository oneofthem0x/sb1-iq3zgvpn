import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(
  request: Request,
  { params }: { params: { address: string } }
) {
  try {
    const { address } = params

    if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return NextResponse.json(
        { error: 'Invalid address format' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db("hyder")
    const keysCollection = db.collection("public_keys")

    const keyData = await keysCollection.findOne({ address })

    if (!keyData) {
      return NextResponse.json(
        { error: 'Public key not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      publicKey: keyData.publicKey,
      timestamp: keyData.timestamp
    })
  } catch (error) {
    console.error('Key lookup error:', error)
    return NextResponse.json(
      { error: 'Failed to lookup key' },
      { status: 500 }
    )
  }
} 