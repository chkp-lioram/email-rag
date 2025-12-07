import { addEmails, search, clear, count } from './vectordb.js'
import { EmailWithEmbedding } from './types.js'

const TEST_COLLECTION_NAME = 'test-emails'

/**
 * Test script for Vector DB operations
 */
async function testVectorDB(): Promise<void> {
  console.log('🔍 Testing Vector DB (ChromaDB)...\n')

  try {
    // 1. Clear any existing test data
    console.log('1️⃣ Clearing test collection...')
    await clear(TEST_COLLECTION_NAME)
    console.log('   ✅ Collection cleared!\n')

    // 2. Verify collection is empty
    console.log('2️⃣ Verifying collection is empty...')
    const countAfterClear = await count(TEST_COLLECTION_NAME)
    if (countAfterClear !== 0) {
      throw new Error(`>> ERROR: Collection should be empty but has ${countAfterClear} items`)
    }
    console.log('   ✅ Collection is empty!\n')

    // 3. Create a test email with dummy embedding
    console.log('3️⃣ Adding test email...')
    const dummyEmbedding = new Array(1536).fill(0.1) // Dummy vector
    const testEmail: EmailWithEmbedding = {
      id: 'test-email-001',
      sender: 'test@example.com',
      senderName: 'Test User',
      recipient: 'recipient@example.com',
      subject: 'Test Subject',
      body: 'This is a test email body.',
      timestamp: new Date().toISOString(),
      hasAttachment: false,
      isPhishing: false,
      embedding: dummyEmbedding,
    }

    await addEmails([testEmail], TEST_COLLECTION_NAME)
    console.log('   ✅ Test email added!\n')

    // 4. Search for the email
    console.log('4️⃣ Searching for email...')
    // Search with the same embedding, should match perfectly
    const results = await search(dummyEmbedding, 1, TEST_COLLECTION_NAME)

    if (results.length > 0 && results[0].id === testEmail.id) {
      console.log('   ✅ Search successful!')
      console.log(`   Found email ID: ${results[0].id}`)
      console.log(`   Document: ${results[0].document.replace(/\n/g, ' ')}\n`)
      const distance = results[0].distance
      if (distance !== 0.0) {
        throw new Error('>> ERROR: Search should return 0.0 distance for exact match.')
      } else {
        console.log('   Distance is correctly 0.0 for exact match.\n')
      }
    } else {
      throw new Error('>> ERROR: Search did not return the expected email.')
    }

    // 5. Search for a non-existent email
    console.log('5️⃣ Searching for non-existent email...')
    const differentEmbedding = new Array(1536).fill(0.9) // Very different vector
    const nonExistentResults = await search(differentEmbedding, 1, TEST_COLLECTION_NAME)

    // Should still return the closest match (our test email), but we verify it exists
    if (nonExistentResults.length > 0) {
      console.log('   ✅ Search returned closest match (expected behavior)')
      console.log(`   Found email ID: ${nonExistentResults[0].id}`)
      const distance = nonExistentResults[0].distance
      console.log(`   Distance: ${distance}\n`)
      if (distance < 10.0) {
        throw new Error('>> ERROR: Search returned a match that is too close for a different embedding.')
      } else {
        console.log('   Distance is appropriately high for a non-matching embedding.\n')
      }
    } else {
      throw new Error('>> ERROR: Search should return closest match even if not exact.')
    }

    // 6. Cleanup
    console.log('5️⃣ Cleaning up...')
    await clear(TEST_COLLECTION_NAME)
    console.log('   ✅ Cleanup successful!\n')

    console.log('🎉 All Vector DB tests passed!')
  } catch (error) {
    console.error('❌ Vector DB test failed!')
    if (error instanceof Error) {
      console.error(`   Error: ${error.message}`)
    }
    console.error('   Full error:', error)
    process.exit(1)
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testVectorDB().catch(console.error)
}
