import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { Email, EmailWithEmbedding } from './types.js'
import { getEmbeddings } from './llm.js'
import { addEmails, formatEmailDocument } from './vectordb.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, '../data')
const EMAILS_FILE = path.join(DATA_DIR, 'emails.json')

async function ingest() {
  try {
    console.log('Starting ingestion pipeline...')

    // 1. Read emails
    console.log(`Reading emails from ${EMAILS_FILE}...`)
    try {
      await fs.access(EMAILS_FILE)
    } catch {
      console.error(`>> Error: File not found at ${EMAILS_FILE}`)
      console.error('>> Please run "npm run generate" first to create the dataset.')
      process.exit(1)
    }

    const fileContent = await fs.readFile(EMAILS_FILE, 'utf-8')
    const emails: Email[] = JSON.parse(fileContent)
    console.log(`Loaded ${emails.length} emails.`)

    // 2. Generate embeddings in batches
    const BATCH_SIZE = 10 // Safe batch size for embeddings
    const emailsWithEmbeddings: EmailWithEmbedding[] = []

    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      const batch = emails.slice(i, i + BATCH_SIZE)
      console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(emails.length / BATCH_SIZE)}...`)

      const texts = batch.map((email) => formatEmailDocument(email))

      // Generate embeddings
      try {
        const embeddings = await getEmbeddings(texts)

        // Combine email with embedding
        batch.forEach((email, index) => {
          if (embeddings[index]) {
            emailsWithEmbeddings.push({
              ...email,
              embedding: embeddings[index],
            })
          }
        })
      } catch (err) {
        console.error(`>> Failed to generate embeddings for batch starting at index ${i}`, err)
        throw err
      }
    }

    // 3. Store in ChromaDB
    console.log('Storing emails in Vector DB...')
    await addEmails(emailsWithEmbeddings)

    console.log('Ingestion complete!')
  } catch (error) {
    console.error('>> Ingestion failed:', error)
    process.exit(1)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  ingest()
}
