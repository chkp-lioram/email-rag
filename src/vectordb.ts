import { ChromaClient, Collection } from 'chromadb'
import { EmailWithEmbedding, Email, SearchResult } from './types.js'

const COLLECTION_NAME = 'emails'
const CHROMA_PATH = './chroma-data'

let client: ChromaClient
let collection: Collection

/**
 * Initialize ChromaDB client and get/create emails collection
 */
export async function initCollection(): Promise<Collection> {
  if (collection) {
    return collection
  }

  try {
    client = new ChromaClient({ path: CHROMA_PATH })

    // Try to get existing collection, or create new one
    try {
      collection = await client.getCollection({ name: COLLECTION_NAME })
      console.log(`Connected to existing collection: ${COLLECTION_NAME}`)
    } catch {
      collection = await client.createCollection({
        name: COLLECTION_NAME,
        metadata: { description: 'Email dataset for threat hunting' },
      })
      console.log(`Created new collection: ${COLLECTION_NAME}`)
    }

    return collection
  } catch (error) {
    console.error('Error initializing collection:', error)
    throw error
  }
}

/**
 * Add emails with embeddings to the collection
 */
export async function addEmails(emails: EmailWithEmbedding[]): Promise<void> {
  try {
    const col = await initCollection()

    const ids = emails.map((email) => email.id)
    const embeddings = emails.map((email) => email.embedding)
    const documents = emails.map(
      (email) => `From: ${email.senderName} <${email.sender}>\nSubject: ${email.subject}\n${email.body}`
    )

    // Store all email fields except body as metadata
    const metadatas = emails.map((email) => {
      const { body, embedding, ...metadata } = email
      return metadata as any
    })

    await col.add({
      ids,
      embeddings,
      documents,
      metadatas,
    })

    console.log(`Added ${emails.length} emails to collection`)
  } catch (error) {
    console.error('Error adding emails:', error)
    throw error
  }
}

/**
 * Search for similar emails using vector similarity
 */
export async function search(queryEmbedding: number[], limit: number = 20): Promise<SearchResult[]> {
  try {
    const col = await initCollection()

    const results = await col.query({
      queryEmbeddings: [queryEmbedding],
      nResults: limit,
    })

    if (!results.ids[0] || !results.documents[0] || !results.metadatas[0] || !results.distances[0]) {
      return []
    }

    return results.ids[0].map((id, index) => ({
      id,
      document: results.documents[0]![index]!,
      metadata: results.metadatas[0]![index] as Omit<Email, 'body'>,
      distance: results.distances[0]![index]!,
    }))
  } catch (error) {
    console.error('Error searching collection:', error)
    throw error
  }
}

/**
 * Clear all emails from the collection
 */
export async function clear(): Promise<void> {
  try {
    if (client && collection) {
      await client.deleteCollection({ name: COLLECTION_NAME })
      console.log(`Cleared collection: ${COLLECTION_NAME}`)
      collection = null as any
    }
  } catch (error) {
    console.error('Error clearing collection:', error)
    throw error
  }
}
