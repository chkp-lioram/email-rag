import { getEmbedding, chat } from './llm.js'
import { search } from './vectordb.js'
import { ThreatResult, QueryResponse, Email } from './types.js'

interface QueryFilters {
  hasAttachment?: boolean
  senderDomain?: string // 'external' or specific domain like 'gmail.com'
  dateRange?: { start?: string; end?: string }
}

/**
 * Query the email database for potential threats
 */
export async function query(userQuery: string, topK: number = 10): Promise<QueryResponse> {
  try {
    console.log(`\n🔍 Searching for: "${userQuery}"\n`)

    // 1. Extract filters from query
    const filters = parseFilters(userQuery)
    const whereFilter = buildWhereFilter(filters)

    // Only pass whereFilter if it has content (key word filters)
    const hasFilters = Object.keys(whereFilter).length > 0
    if (hasFilters) {
      console.log('Applying filters:', JSON.stringify(whereFilter, null, 2))
    }

    // 2. Generate embedding for the user's query
    console.log('Generating query embedding...')
    const queryEmbedding = await getEmbedding(userQuery)

    // 3. Search vector database for similar emails
    console.log(`Searching vector database (top ${topK} results)...`)

    // If filtering by domain, get more results and filter in-memory
    const searchLimit = filters.senderDomain && filters.senderDomain !== 'external' ? topK * 3 : topK
    const whereFilterWithoutDomain = { ...whereFilter }
    delete whereFilterWithoutDomain.sender

    const hasNonDomainFilters = Object.keys(whereFilterWithoutDomain).length > 0
    const searchResults = await search(
      queryEmbedding,
      searchLimit,
      undefined,
      hasNonDomainFilters ? whereFilterWithoutDomain : undefined
    )

    // Post-filter by sender domain if specified
    let filteredResults = searchResults
    if (filters.senderDomain && filters.senderDomain !== 'external') {
      console.log(`Filtering ${searchResults.length} results for domain: @${filters.senderDomain}`)
      filteredResults = searchResults
        .filter((result) => {
          const matches = result.metadata.sender.includes(`@${filters.senderDomain}`)
          if (matches) {
            console.log(`  ✓ ${result.metadata.sender}`)
          }
          return matches
        })
        .slice(0, topK)
      console.log(`Filtered to ${filteredResults.length} emails from ${filters.senderDomain}`)
    }

    if (filteredResults.length === 0) {
      console.log('No emails found.')
      return {
        query: userQuery,
        results: [],
        totalFound: 0,
      }
    }

    console.log(`Found ${filteredResults.length} potentially relevant emails.\n`)

    // 4. Reconstruct emails from search results
    const emails: Email[] = filteredResults.map((result) => ({
      ...result.metadata,
      body: extractBodyFromDocument(result.document),
    }))

    // 5. Analyze emails in batch with LLM
    console.log('Analyzing emails for threats (batch mode)...')
    const threatResults = await analyzeEmailsBatch(emails, userQuery)

    console.log(`\n✅ Analysis complete. Found ${threatResults.length} threats.\n`)

    return {
      query: userQuery,
      results: threatResults.sort((a, b) => b.confidenceScore - a.confidenceScore),
      totalFound: threatResults.length,
    }
  } catch (error) {
    console.error('Query failed:', error)
    throw error
  }
}

/**
 * Analyze multiple emails in batch with a single LLM call
 */
async function analyzeEmailsBatch(emails: Email[], userQuery: string): Promise<ThreatResult[]> {
  const systemPrompt = `You are a cybersecurity analyst specialized in identifying phishing threats in emails.

Analyze the provided emails against the user's query and determine which match the threat criteria.

Respond in JSON format with an array of results:
{
  "results": [
    {
      "emailId": "email-123",
      "isRelevant": boolean,
      "confidenceScore": number (0-1),
      "explanation": "Brief explanation",
      "threatIndicators": ["indicator1", "indicator2"]
    }
  ]
}

Only include emails that are relevant. Be specific about threat indicators like urgency language, suspicious senders, impersonation, unusual requests, suspicious links/attachments, grammar errors, etc.`

  // Format all emails for the prompt
  const emailsText = emails
    .map(
      (email, idx) => `
[Email ${idx + 1}] ID: ${email.id}
From: ${email.senderName} <${email.sender}>
To: ${email.recipient}
Subject: ${email.subject}
Date: ${email.timestamp}
${email.hasAttachment ? `Attachment: ${email.attachmentName}` : ''}
Body: ${email.body}
---`
    )
    .join('\n')

  const userPrompt = `User Query: "${userQuery}"

Emails to Analyze:
${emailsText}

Analyze these ${emails.length} emails and identify which ones match the threat hunting query. Return only relevant threats in JSON format.`

  try {
    const response = await chat(userPrompt, systemPrompt)

    // Parse LLM response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.warn('⚠️  Failed to parse batch LLM response, falling back to empty results')
      return []
    }

    const data = JSON.parse(jsonMatch[0])
    const results: ThreatResult[] = []

    // Map LLM results back to emails
    if (data.results && Array.isArray(data.results)) {
      for (const result of data.results) {
        if (result.isRelevant) {
          const email = emails.find((e) => e.id === result.emailId)
          if (email) {
            results.push({
              emailId: email.id,
              email,
              confidenceScore: result.confidenceScore,
              explanation: result.explanation,
              threatIndicators: result.threatIndicators || [],
            })
          }
        }
      }
    }

    return results
  } catch (error) {
    console.error('❌ Error analyzing emails in batch:', error)
    return []
  }
}

/**
 * Parse filters from natural language query
 */
function parseFilters(query: string): QueryFilters {
  const filters: QueryFilters = {}
  const lowerQuery = query.toLowerCase()

  // Check for attachment keywords
  if (
    lowerQuery.includes('with attachment') ||
    lowerQuery.includes('has attachment') ||
    lowerQuery.includes('attached file')
  ) {
    filters.hasAttachment = true
  }

  if (lowerQuery.includes('without attachment') || lowerQuery.includes('no attachment')) {
    filters.hasAttachment = false
  }

  // Check for specific email domains
  const domainPatterns = [
    { keywords: ['gmail', 'google mail'], domain: 'gmail.com' },
    { keywords: ['yahoo'], domain: 'yahoo.com' },
    { keywords: ['outlook', 'hotmail', 'live.com'], domain: 'outlook.com' },
    { keywords: ['proton', 'protonmail'], domain: 'protonmail.com' },
  ]

  for (const { keywords, domain } of domainPatterns) {
    if (keywords.some((keyword) => lowerQuery.includes(keyword))) {
      filters.senderDomain = domain
      break
    }
  }

  // Check for external/external domain keywords (fallback)
  if (
    !filters.senderDomain &&
    (lowerQuery.includes('external') || lowerQuery.includes('outside') || lowerQuery.includes('unknown sender'))
  ) {
    filters.senderDomain = 'external'
  }

  return filters
}

/**
 * Build ChromaDB where filter from parsed filters
 */
function buildWhereFilter(filters: QueryFilters): Record<string, any> {
  const where: Record<string, any> = {}

  if (filters.hasAttachment !== undefined) {
    where.hasAttachment = { $eq: filters.hasAttachment }
  }

  if (filters.senderDomain === 'external') {
    // Filter for emails NOT from common company domains
    // ChromaDB doesn't support complex nested $not with $or, so we skip this filter
    // and let the LLM handle "external sender" detection semantically
    console.log('  Note: "external sender" filter handled by semantic search + LLM analysis')
  }

  // Note: Specific email domain filtering (gmail, yahoo, etc.) is done post-search
  // in-memory because ChromaDB doesn't support $contains operator

  return where
}

/**
 * Extract email body from the formatted document
 */
function extractBodyFromDocument(document: string): string {
  // Document format: "From: ...\nSubject: ...\n{body}\nAttachment: ..."
  const lines = document.split('\n')

  // Skip first two lines (From and Subject)
  const bodyLines = lines.slice(2)

  // Remove attachment line if present
  if (bodyLines[bodyLines.length - 1]?.startsWith('Attachment:')) {
    bodyLines.pop()
  }

  return bodyLines.join('\n').trim()
}

/**
 * Interactive query mode
 */
export async function interactiveMode(): Promise<void> {
  console.log('🤖 Email Threat Hunting - Interactive Mode')
  console.log('Type your queries to search for threats. Type "exit" to quit.\n')

  const readline = await import('readline')
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  const askQuestion = () => {
    rl.question('Query: ', async (input) => {
      const userQuery = input.trim()

      if (userQuery.toLowerCase() === 'exit') {
        console.log('\n👋 Goodbye!')
        rl.close()
        return
      }

      if (!userQuery) {
        askQuestion()
        return
      }

      try {
        const response = await query(userQuery)
        displayResults(response)
      } catch (error) {
        console.error('Error:', error)
      }

      askQuestion()
    })
  }

  askQuestion()
}

/**
 * Display query results in a readable format
 */
export function displayResults(response: QueryResponse): void {
  console.log(`\n${'='.repeat(80)}`)
  console.log(`Query: "${response.query}"`)
  console.log(`Found ${response.totalFound} threat(s)`)
  console.log('='.repeat(80))

  if (response.results.length === 0) {
    console.log('\n✅ No threats detected matching your query.\n')
    return
  }

  response.results.forEach((result, index) => {
    console.log(`\n[${index + 1}] Email ID: ${result.emailId}`)
    console.log(`    Confidence: ${(result.confidenceScore * 100).toFixed(1)}%`)
    console.log(`    From: ${result.email.senderName} <${result.email.sender}>`)
    console.log(`    Subject: ${result.email.subject}`)
    console.log(`    Date: ${new Date(result.email.timestamp).toLocaleString()}`)
    console.log(`    Explanation: ${result.explanation}`)
    console.log(`    Threat Indicators:`)
    result.threatIndicators.forEach((indicator) => {
      console.log(`      - ${indicator}`)
    })
  })

  console.log('\n')
}
