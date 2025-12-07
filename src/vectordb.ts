import { ChromaClient, Collection } from 'chromadb'
import { EmailWithEmbedding, Email, SearchResult } from './types.js'

export const DEFAULT_COLLECTION_NAME = 'emails'

let client: ChromaClient
let collection: Collection
let currentCollectionName: string

// ///////////////////////
// Utility functions
// ///////////////////////

/**
 * Format email into a single string for embedding and storage
 */
export function formatEmailDocument(email: Email): string {
  return `From: ${email.senderName} <${email.sender}>
Subject: ${email.subject}
${email.body}
${email.hasAttachment ? `Attachment: ${email.attachmentName}` : ''}`
}

// ///////////////////////
// ChromaDB operations
// ///////////////////////

/**
 * Initialize ChromaDB client and get/create emails collection
 */
export async function getCollection(name: string = DEFAULT_COLLECTION_NAME): Promise<Collection> {
  if (collection && currentCollectionName === name) {
    return collection
  }

  try {
    client = new ChromaClient()

    collection = await client.getOrCreateCollection({
      name,
      metadata: { description: 'Email dataset for threat hunting' },
    })
    console.log(`Connected to collection: ${name}`)

    currentCollectionName = name
    return collection
  } catch (error) {
    console.error('>> Error initializing collection:', error)
    throw error
  }
}

/**
 * Add emails with embeddings to the collection
 */
export async function addEmails(
  emails: EmailWithEmbedding[],
  collectionName: string = DEFAULT_COLLECTION_NAME
): Promise<void> {
  try {
    const collection = await getCollection(collectionName)

    // Process all emails in a single pass
    const ids: string[] = []
    const embeddings: number[][] = []
    const documents: string[] = []
    const metadatas: any[] = []

    for (const email of emails) {
      ids.push(email.id)
      embeddings.push(email.embedding)
      documents.push(formatEmailDocument(email))

      const { body, embedding, ...metadata } = email
      metadatas.push(metadata)
    }

    await collection.upsert({
      ids,
      embeddings,
      documents,
      metadatas,
    })

    console.log(`Upserted ${emails.length} emails to collection: ${collectionName}`)
  } catch (error) {
    console.error('>> Error adding emails:', error)
    throw error
  }
}

/**
 * Search for similar emails using vector similarity with optional metadata filtering
 */
export async function search(
  queryEmbedding: number[],
  limit: number = 20,
  collectionName: string = DEFAULT_COLLECTION_NAME,
  whereFilter?: Record<string, any>
): Promise<SearchResult[]> {
  try {
    const collection = await getCollection(collectionName)

    const queryParams: any = {
      queryEmbeddings: [queryEmbedding],
      nResults: limit,
    }

    if (whereFilter) {
      queryParams.where = whereFilter
    }

    const results = await collection.query(queryParams)

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
    console.error('>> Error searching collection:', error)
    throw error
  }
}

/**
 * Get the count of emails in the collection
 */
export async function count(collectionName: string = DEFAULT_COLLECTION_NAME): Promise<number> {
  try {
    const collection = await getCollection(collectionName)
    return await collection.count()
  } catch (error) {
    console.error('>> Error counting emails:', error)
    throw error
  }
}

/**
 * Clear all emails from the collection
 */
export async function clear(collectionName: string = DEFAULT_COLLECTION_NAME): Promise<void> {
  try {
    // Ensure we are connected to the right collection before deleting
    await getCollection(collectionName)

    if (client) {
      await client.deleteCollection({ name: collectionName })
      console.log(`Cleared collection: ${collectionName}`)
      collection = null as any
      currentCollectionName = ''
    }
  } catch (error) {
    console.error('>> Error clearing collection:', error)
    throw error
  }
}
