import { setupIndexes } from '@/lib/mongodb-setup'

// Run setup once
setupIndexes().catch(console.error) 