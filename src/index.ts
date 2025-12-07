import { query, interactiveMode, displayResults } from './query.js'

const args = process.argv.slice(2)
const command = args[0]

async function main() {
  if (!command) {
    console.log('Email RAG - Threat Hunting System')
    console.log('\nUsage:')
    console.log('  npm run generate     - Generate synthetic email dataset')
    console.log('  npm run ingest       - Ingest emails into vector database')
    console.log('  npm run query        - Run a single threat hunting query')
    console.log('  npm run interactive  - Start interactive query mode')
    console.log('  npm run inspect      - Inspect database contents')
    console.log('  npm run test         - Run all tests')
    process.exit(0)
  }

  switch (command) {
    case 'query': {
      const userQuery = args.slice(1).join(' ')
      if (!userQuery) {
        console.error('>> Error: Please provide a query')
        console.log('Example: npm run query "Find emails with urgent payment requests"')
        process.exit(1)
      }
      const response = await query(userQuery)
      displayResults(response)
      break
    }

    case 'interactive': {
      await interactiveMode()
      break
    }

    default:
      console.error(`>> Unknown command: ${command}`)
      console.log('Run without arguments to see usage.')
      process.exit(1)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Error:', error)
    process.exit(1)
  })
}
