import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const CHAT_MODEL = process.env.OPENAI_CHAT_MODEL || 'gpt-5-nano'
const EMBEDDING_MODEL = process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small'

export async function chat(prompt: string, systemPrompt?: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages: [
        ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
        { role: 'user' as const, content: prompt },
      ],
    })

    return response.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('>> Error in chat completion:', error)
    throw error
  }
}

/**
 * Get embedding for a single text
 */
export async function getEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text,
      encoding_format: 'float',
    })

    return response.data[0].embedding
  } catch (error) {
    console.error('>> Error getting embedding:', error)
    throw error
  }
}

/**
 * Get embeddings for multiple texts in batch (more efficient)
 */
export async function getEmbeddings(texts: string[]): Promise<number[][]> {
  try {
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: texts,
      encoding_format: 'float',
    })

    return response.data.map((item) => item.embedding)
  } catch (error) {
    console.error('>> Error getting batch embeddings:', error)
    throw error
  }
}
