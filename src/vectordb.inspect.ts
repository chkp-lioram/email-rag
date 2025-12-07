import { getCollection, count } from './vectordb.js'

/**
 * Simple script to inspect the ChromaDB collection
 */
async function inspect() {
  try {
    console.log('📊 Inspecting ChromaDB collection...\n')

    // Get collection and count
    const collection = await getCollection()
    const totalCount = await count()

    console.log(`Total emails in collection: ${totalCount}\n`)

    // Get a few sample records
    if (totalCount > 0) {
      console.log('Sample records (first 5):')
      const results = await collection.get({
        limit: 5,
        include: ['documents', 'metadatas'],
      })

      results.ids.forEach((id, index) => {
        console.log(`\n[${index + 1}] ID: ${id}`)
        console.log(`Document preview: ${results.documents![index]!.substring(0, 150)}...`)
        console.log(`Metadata:`, JSON.stringify(results.metadatas![index], null, 2))
      })
    } else {
      console.log('Collection is empty. Run "npm run ingest" first.')
    }
  } catch (error) {
    console.error('Failed to inspect database:', error)
    process.exit(1)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  inspect()
}
