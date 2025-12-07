import { chat, getEmbedding } from './llm.js'

/**
 * Simple test script to verify OpenAI API connectivity
 */
async function testOpenAI(): Promise<void> {
  console.log('🔍 Testing OpenAI API connectivity...\n')

  if (process.env.OPENAI_API_KEY == null || process.env.OPENAI_API_KEY.trim() === '') {
    console.error('❌ OPENAI_API_KEY is not set. Please set the environment variable and try again.')
    process.exit(1)
  }

  try {
    // Test 1: Chat completion
    console.log('1️⃣ Testing chat completion...')
    const chatResponse = await chat('Say "Hello, the API is working!" in exactly those words.')
    console.log('   ✅ Chat completion successful!')
    console.log(`   Response: "${chatResponse}"\n`)

    // Test 2: Embedding generation
    console.log('2️⃣ Testing embedding generation...')
    const testText = 'This is a test sentence for embedding generation.'
    const embedding = await getEmbedding(testText)
    console.log('   ✅ Embedding generation successful!')
    console.log(`   Embedding dimensions: ${embedding.length}`)
    console.log(
      `   First 5 values: [${embedding
        .slice(0, 5)
        .map((v) => v.toFixed(4))
        .join(', ')}...]\n`
    )

    console.log('🎉 All tests passed! OpenAI API is working correctly.')
  } catch (error) {
    console.error('❌ OpenAI API test failed!')
    if (error instanceof Error) {
      console.error(`   Error: ${error.message}`)
    }
    console.error('   Full error:', error)
    process.exit(1)
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testOpenAI().catch(console.error)
}
