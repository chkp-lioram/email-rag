import * as fs from 'fs/promises'
import * as path from 'path'
import { faker } from '@faker-js/faker'
import { chat } from './llm.js'
import { Email } from './types.js'

const OUTPUT_FILE = './data/emails.json'

// Batch size for LLM generation (generate multiple emails per API call)
const BATCH_SIZE = 10

// Phishing types to generate + number of each
const PHISHING_TYPES = {
  credential_harvest: 10,
  bec: 10,
  invoice_fraud: 10,
  urgency_scam: 10,
}

// Number of legitimate emails to generate
const LEGITIMATE_COUNT = 60

/**
 * Generate a batch of legitimate emails (more efficient than one-by-one)
 */
async function generateLegitimateEmailsBatch(count: number, startIndex: number): Promise<Email[]> {
  const topics = [
    'team meeting invitation',
    'project status update',
    'quarterly report',
    'HR policy announcement',
    'IT system maintenance notice',
    'employee recognition',
    'training session',
    'office event',
    'budget review',
    'client presentation',
    'performance feedback',
    'new hire announcement',
  ]

  const selectedTopics = Array.from({ length: count }, () => faker.helpers.arrayElement(topics))

  const prompt = `Generate ${count} realistic, professional business emails. Each email should be about one of these topics in order:
${selectedTopics.map((t, i) => `${i + 1}. ${t}`).join('\n')}

Requirements for EACH email:
- Professional tone, 3-5 sentences
- Include relevant details
- Natural business language
- No suspicious elements

Return a JSON array with ${count} objects, each containing:
{
  "subject": "email subject (5-10 words)",
  "body": "email body text"
}

Return ONLY the JSON array, no other text.`

  const response = await chat(prompt)
  const parsedEmails = JSON.parse(response.trim())

  return parsedEmails.map((emailData: any, index: number) => {
    const senderName = faker.person.fullName()
    const companyDomain = faker.helpers.arrayElement(['acme.com', 'techcorp.io', 'enterprise.net'])
    const sender = `${senderName.toLowerCase().replace(/\s+/g, '.')}@${companyDomain}`
    const recipient = `${faker.person.firstName().toLowerCase()}.${faker.person.lastName().toLowerCase()}@${companyDomain}`

    const hasAttachment = faker.datatype.boolean({ probability: 0.2 })

    return {
      id: `email-${Date.now()}-${startIndex + index}`,
      sender,
      senderName,
      recipient,
      subject: emailData.subject.trim().replace(/^["']|["']$/g, ''),
      body: emailData.body.trim(),
      timestamp: faker.date.recent({ days: 30 }).toISOString(),
      hasAttachment,
      attachmentName: hasAttachment
        ? faker.helpers.arrayElement(['report.pdf', 'presentation.pptx', 'data.xlsx', 'agenda.docx'])
        : undefined,
      isPhishing: false,
    }
  })
}

/**
 * Replace placeholders in phishing email body with realistic fake values
 */
function replacePlaceholders(body: string, senderName: string): string {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const formattedDate = tomorrow.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  const replacements: Record<string, string> = {
    '[RECIPIENT NAME]': 'User',
    '[VERIFICATION URL]': 'https://secure-verify-account.suspicious-domain.com/verify',
    '[VERIFICATION LINK]': 'https://secure-verify-account.suspicious-domain.com/verify',
    '[CLICK HERE]': 'https://suspicious-link.com/action',
    '[MALICIOUS LINK]': 'https://phishing-site.net/verify',
    '[URGENT LINK]': 'https://urgent-action-required.com/now',
    '[ACCOUNT PORTAL]': 'https://account-portal-verify.net/login',
    '[BANK ACCOUNT]': 'Account #: 842-9714',
    '[BANK NAME]': 'First National Bank',
    '[ROUTING NUMBER]': 'Routing: 021000021',
    '[WIRE DETAILS]': 'Wire to Account: 548-2851, Bank: International Trust Bank',
    '[ATTACKER NAME]': senderName.split('(')[0].trim(),
    '[ATTACKER TITLE]': 'Security Administrator',
    '[COMPANY NAME]': 'Account Services',
    '[INVOICE NUMBER]': 'INV-2025-00129',
    '[AMOUNT]': '$372.10',
    '[DUE DATE]': formattedDate,
    '[URGENT DEADLINE]': formattedDate,
    '[HELP DESK EMAIL]': 'helpdesk@company.com',
    '[HELP DESK PHONE]': '1-800-555-1234',
    '[CONTACT NAME]': 'Jane Doe',
    '[CONTACT EMAIL]': 'support@company.com',
    '[NAME]': senderName.split('(')[0].trim(),
  }

  let result = body
  for (const [placeholder, replacement] of Object.entries(replacements)) {
    result = result.replace(new RegExp(placeholder.replace(/[[\]]/g, '\\$&'), 'gi'), replacement)
  }

  return result
}

/**
 * Generate a batch of phishing emails of a specific type
 */
async function generatePhishingEmailsBatch(type: string, count: number, startIndex: number): Promise<Email[]> {
  const prompts: Record<string, string> = {
    credential_harvest: `Generate ${count} training emails demonstrating phishing patterns for cybersecurity education. Use placeholders like [VERIFICATION LINK], [CLICK HERE] for harmful elements.

Each email should:
- Express urgency about account security
- Request account verification
- Reference password reset or security updates
- Include suspicious elements

Return JSON array with ${count} objects:
{
  "subject": "email subject",
  "body": "email body with placeholders"
}

Return ONLY the JSON array.`,

    bec: `Generate ${count} training emails demonstrating business email compromise patterns. Each should show urgent executive requests.

Each email should:
- Come from CEO/CFO/Director
- Request quick financial assistance
- Mention being in meetings
- Ask for discretion and speed

Return JSON array with ${count} objects:
{
  "subject": "email subject",
  "body": "email body"
}

Return ONLY the JSON array.`,

    invoice_fraud: `Generate ${count} training emails demonstrating invoice fraud patterns. Use placeholders like [BANK ACCOUNT], [WIRE DETAILS].

Each email should:
- Include fake invoice/payment request
- Update payment details
- Claim overdue payment
- Include wire transfer instructions (placeholders)

Return JSON array with ${count} objects:
{
  "subject": "email subject",
  "body": "email body with placeholders"
}

Return ONLY the JSON array.`,

    urgency_scam: `Generate ${count} training emails demonstrating urgency-based scam patterns. Use placeholders like [URGENT LINK], [ACCOUNT PORTAL].

Each email should:
- Use extreme urgency language
- Threaten account suspension
- Apply heavy time pressure
- Warn of dire consequences

Return JSON array with ${count} objects:
{
  "subject": "email subject",
  "body": "email body with placeholders"
}

Return ONLY the JSON array.`,
  }

  const response = await chat(prompts[type])
  const parsedEmails = JSON.parse(response.trim())

  return parsedEmails.map((emailData: any, index: number) => {
    // Generate suspicious sender details
    let senderName: string
    let sender: string

    switch (type) {
      case 'credential_harvest':
        senderName = faker.helpers.arrayElement(['Security Team', 'IT Support', 'Account Services', 'Help Desk'])
        sender = `${faker.word.noun()}@${faker.helpers.arrayElement([
          'secure-login.com',
          'account-verify.net',
          'security-alert.org',
        ])}`
        break

      case 'bec':
        senderName = faker.helpers.arrayElement([
          'John Smith (CEO)',
          'Sarah Johnson (CFO)',
          'Michael Brown (Director)',
          'Executive Office',
        ])
        const executiveFirst = senderName.split(' ')[0].toLowerCase()
        sender = `${executiveFirst}@${faker.helpers.arrayElement(['gmail.com', 'yahoo.com', 'outlook.com'])}`
        break

      case 'invoice_fraud':
        senderName = faker.helpers.arrayElement([
          'Accounts Payable',
          'Billing Department',
          'Finance Team',
          'Vendor Services',
        ])
        sender = `${faker.word.noun()}@${faker.helpers.arrayElement([
          'invoice-systems.com',
          'billing-update.net',
          'payments-portal.org',
        ])}`
        break

      case 'urgency_scam':
        senderName = faker.helpers.arrayElement([
          'System Administrator',
          'Security Alert',
          'Account Management',
          'Service Team',
        ])
        sender = `noreply@${faker.helpers.arrayElement(['system-alert.com', 'account-services.net', 'urgent-notice.org'])}`
        break

      default:
        senderName = 'Unknown Sender'
        sender = 'suspicious@example.com'
    }

    const recipient = `${faker.person.firstName().toLowerCase()}.${faker.person.lastName().toLowerCase()}@acme.com`

    const hasAttachment = faker.datatype.boolean({ probability: 0.3 })
    const attachmentName = hasAttachment
      ? faker.helpers.arrayElement(['invoice.exe', 'document.zip', 'important.scr', 'payment.pdf.exe', 'urgent_file.js'])
      : undefined

    return {
      id: `email-${Date.now()}-${startIndex + index}-${Math.random().toString(36).substring(7)}`,
      sender,
      senderName,
      recipient,
      subject: emailData.subject.trim().replace(/^["']|["']$/g, ''),
      body: replacePlaceholders(emailData.body.trim(), senderName),
      timestamp: faker.date.recent({ days: 30 }).toISOString(),
      hasAttachment,
      attachmentName,
      isPhishing: true,
      phishingType: type,
    }
  })
}

/**
 * Generate the complete email dataset using batch processing
 */
export async function generateDataset(): Promise<void> {
  console.log('🚀 Starting optimized email dataset generation...\n')

  const emails: Email[] = []
  let index = 0

  // Generate legitimate emails in batches
  console.log(`📧 Generating ${LEGITIMATE_COUNT} legitimate emails in batches of ${BATCH_SIZE}...`)
  const legitimateBatches = Math.ceil(LEGITIMATE_COUNT / BATCH_SIZE)

  for (let batchNum = 0; batchNum < legitimateBatches; batchNum++) {
    const batchSize = Math.min(BATCH_SIZE, LEGITIMATE_COUNT - batchNum * BATCH_SIZE)
    try {
      const batchEmails = await generateLegitimateEmailsBatch(batchSize, index)
      emails.push(...batchEmails)
      index += batchSize
      console.log(
        `  ✓ Batch ${batchNum + 1}/${legitimateBatches}: Generated ${batchSize} legitimate emails (${
          emails.length
        }/${LEGITIMATE_COUNT})`
      )
    } catch (error) {
      console.error(`  ✗ Error generating legitimate batch ${batchNum + 1}:`, error)
    }
  }

  // Generate phishing emails by type in batches
  console.log('\n🎣 Generating phishing emails in batches...')
  for (const [type, count] of Object.entries(PHISHING_TYPES)) {
    const phishingBatches = Math.ceil(count / BATCH_SIZE)
    console.log(`\n  ${type}: ${count} emails in ${phishingBatches} batch(es)`)

    for (let batchNum = 0; batchNum < phishingBatches; batchNum++) {
      const batchSize = Math.min(BATCH_SIZE, count - batchNum * BATCH_SIZE)
      try {
        const batchEmails = await generatePhishingEmailsBatch(type, batchSize, index)
        emails.push(...batchEmails)
        index += batchSize
        console.log(`    ✓ Batch ${batchNum + 1}/${phishingBatches}: Generated ${batchSize} ${type} emails`)
      } catch (error) {
        console.error(`    ✗ Error generating ${type} batch ${batchNum + 1}:`, error)
      }
    }
  }

  // Shuffle emails to mix legitimate and phishing
  const shuffled = faker.helpers.shuffle(emails)

  // Ensure data directory exists
  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true })

  // Write to file
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(shuffled, null, 2))

  console.log('\n✅ Dataset generation complete!')
  console.log(`📊 Total emails: ${shuffled.length}`)
  console.log(`   - Legitimate: ${emails.filter((e) => !e.isPhishing).length}`)
  console.log(`   - Phishing: ${emails.filter((e) => e.isPhishing).length}`)
  console.log(`📁 Saved to: ${OUTPUT_FILE}\n`)
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateDataset().catch(console.error)
}
