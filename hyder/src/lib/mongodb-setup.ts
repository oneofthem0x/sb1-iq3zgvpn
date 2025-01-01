import clientPromise from '@/lib/mongodb'

export async function setupIndexes() {
  try {
    const client = await clientPromise
    const db = client.db("hyder")
    const keysCollection = db.collection("public_keys")

    // Create indexes
    await keysCollection.createIndex({ address: 1 }, { unique: true })
    await keysCollection.createIndex({ timestamp: 1 })

    console.log('MongoDB indexes created successfully')
  } catch (error) {
    console.error('Failed to create MongoDB indexes:', error)
  }
} 