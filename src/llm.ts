import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Get chat completion from GPT-4o
 */
export async function chat(prompt: string, systemPrompt?: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
        { role: 'user' as const, content: prompt },
      ],
      temperature: 0.7,
    })

    return response.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('Error in chat completion:', error)
    throw error
  }
}

/**
 * Get embedding for a single text
 */
export async function getEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small', // TODO is this the best/most effective one?
      input: text,
    })

    return response.data[0].embedding
  } catch (error) {
    console.error('Error getting embedding:', error)
    throw error
  }
}

/**
 * Get embeddings for multiple texts in batch (more efficient)
 */
export async function getEmbeddings(texts: string[]): Promise<number[][]> {
  try {
    // TODO where is the batching done? suggestion: process in batches of 100 to reduce API calls
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: texts,
    })

    return response.data.map((item) => item.embedding)
  } catch (error) {
    console.error('Error getting batch embeddings:', error)
    throw error
  }
}
