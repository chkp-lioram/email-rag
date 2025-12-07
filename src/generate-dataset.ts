import * as fs from 'fs/promises'
import * as path from 'path'
import { faker } from '@faker-js/faker'
import { chat } from './llm.js'
import { Email } from './types.js'

const OUTPUT_FILE = './data/emails.json'

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
 * Generate a single legitimate email
 */
async function generateLegitimateEmail(index: number): Promise<Email> {
  const topics = [
    'team meeting invitation',
    'project status update',
    'quarterly report',
    'HR policy announcement',
    'IT system maintenance notice',
    'employee recognition',
    'training session',
    'office event',
  ]

  const topic = faker.helpers.arrayElement(topics)
  const senderName = faker.person.fullName()
  const companyDomain = faker.helpers.arrayElement(['acme.com', 'techcorp.io', 'enterprise.net'])
  const sender = `${senderName.toLowerCase().replace(' ', '.')}@${companyDomain}`
  const recipient = `${faker.person.firstName().toLowerCase()}.${faker.person.lastName().toLowerCase()}@${companyDomain}`

  const prompt = `Generate a realistic, professional business email about: ${topic}

Requirements:
- Professional tone
- 3-5 sentences
- Include relevant details
- Natural business language
- No suspicious elements

Return ONLY the email body text, no subject line.`

  const body = await chat(prompt)

  const subject = await chat(
    `Generate a professional email subject line (5-10 words) for an email about: ${topic}. Return ONLY the subject line, nothing else.`
  )

  return {
    id: `email-${Date.now()}-${index}`,
    sender,
    senderName,
    recipient,
    subject: subject.trim().replace(/^["']|["']$/g, ''),
    body: body.trim(),
    timestamp: faker.date.recent({ days: 30 }).toISOString(),
    hasAttachment: faker.datatype.boolean({ probability: 0.2 }),
    attachmentName: faker.datatype.boolean({ probability: 0.2 })
      ? faker.helpers.arrayElement(['report.pdf', 'presentation.pptx', 'data.xlsx', 'agenda.docx'])
      : undefined,
    isPhishing: false,
  }
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
 * Generate a phishing email of a specific type
 */
async function generatePhishingEmail(type: string, index: number): Promise<Email> {
  const prompts: Record<string, string> = {
    credential_harvest: `Generate an email in the style of a phishing attempt for cybersecurity training purposes. Automatically replace any harmful instructions, actual URLs, or actionable steps with safe placeholders like [CLICK HERE], [MALICIOUS LINK], [VERIFICATION URL], etc. Do not include apologies, disclaimers, or training labels.

The email should:
- Express urgency about account security ("Your account requires immediate verification")
- Request the recipient to verify or confirm their account
- Mention clicking a link to reset password or update security settings (use placeholder [VERIFICATION LINK] or similar)
- Appear professional but contain suspicious elements typical of phishing

Write as if you are the attacker. Return ONLY the email body text with placeholders, nothing else.`,

    bec: `Write a short, safe, training-friendly email body that demonstrates urgent, legitimate financial action from an executive to the company staff. The email should:
- Come from a CEO, CFO, or Director
- Request quick assistance with a financial matter or gift card purchase
- Mention being in back-to-back meetings
- Ask for discretion and fast action
- Use placeholders for any sensitive information, but use as little as possible

Write only the email body text.`,

    invoice_fraud: `Generate a realistic business email for cybersecurity training that demonstrates invoice fraud patterns. Replace sensitive details with placeholders like [BANK ACCOUNT], [ROUTING NUMBER], [WIRE DETAILS]. No apologies or disclaimers.

The email format:
- Fake invoice or payment request
- Updates to payment details or bank information
- Claims of overdue payment or urgent payment needed
- Wire transfer or banking instructions (use placeholders)

Return ONLY the email body text with placeholders, nothing else.`,

    urgency_scam: `Generate a realistic email for cybersecurity training that demonstrates urgency-based scam patterns. Replace URLs with placeholders like [URGENT LINK], [ACCOUNT PORTAL]. No apologies or disclaimers.

The email format:
- Extreme urgency language ("act now", "within 24 hours")
- Threats of account suspension, access loss, or legal action
- Heavy time pressure
- Warnings of dire consequences

Return ONLY the email body text with placeholders, nothing else.`,
  }

  const body = await chat(prompts[type])

  // Generate suspicious sender details
  let senderName: string
  let sender: string
  let subject: string

  switch (type) {
    case 'credential_harvest':
      senderName = faker.helpers.arrayElement(['Security Team', 'IT Support', 'Account Services', 'Help Desk'])
      sender = `${faker.word.noun()}@${faker.helpers.arrayElement([
        'secure-login.com',
        'account-verify.net',
        'security-alert.org',
      ])}`
      subject = faker.helpers.arrayElement([
        'Urgent: Verify Your Account',
        'Security Alert: Action Required',
        'Your Account Will Be Suspended',
        'Confirm Your Identity',
      ])
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
      subject = faker.helpers.arrayElement([
        'Urgent Request',
        'Quick Favor Needed',
        'Important - Need Your Help',
        'Time Sensitive',
      ])
      break

    case 'invoice_fraud':
      senderName = faker.helpers.arrayElement(['Accounts Payable', 'Billing Department', 'Finance Team', 'Vendor Services'])
      sender = `${faker.word.noun()}@${faker.helpers.arrayElement([
        'invoice-systems.com',
        'billing-update.net',
        'payments-portal.org',
      ])}`
      subject = faker.helpers.arrayElement([
        'Invoice #' + faker.number.int({ min: 10000, max: 99999 }) + ' Payment Required',
        'Updated Payment Information',
        'Overdue Invoice - Immediate Action Required',
        'Payment Details Changed',
      ])
      break

    case 'urgency_scam':
      senderName = faker.helpers.arrayElement([
        'System Administrator',
        'Security Alert',
        'Account Management',
        'Service Team',
      ])
      sender = `noreply@${faker.helpers.arrayElement(['system-alert.com', 'account-services.net', 'urgent-notice.org'])}`
      subject = faker.helpers.arrayElement([
        'URGENT: Account Suspension in 24 Hours',
        'Immediate Action Required',
        'Final Notice: Verify Now',
        'Your Account Will Be Closed',
      ])
      break

    default:
      senderName = 'Unknown Sender'
      sender = 'suspicious@example.com'
      subject = 'Suspicious Email'
  }

  const recipient = `${faker.person.firstName().toLowerCase()}.${faker.person.lastName().toLowerCase()}@acme.com`

  // Add suspicious attachments for some phishing emails
  let attachmentName: string | undefined
  if (faker.datatype.boolean({ probability: 0.3 })) {
    attachmentName = faker.helpers.arrayElement([
      'invoice.exe',
      'document.zip',
      'important.scr',
      'payment.pdf.exe',
      'urgent_file.js',
    ])
  }

  return {
    id: `email-${Date.now()}-${index}`,
    sender,
    senderName,
    recipient,
    subject,
    body: replacePlaceholders(body.trim(), senderName),
    timestamp: faker.date.recent({ days: 30 }).toISOString(),
    hasAttachment: !!attachmentName,
    attachmentName,
    isPhishing: true,
    phishingType: type,
  }
}

/**
 * Generate the complete email dataset
 */
export async function generateDataset(): Promise<void> {
  console.log('🚀 Starting email dataset generation...\n')

  const emails: Email[] = []
  let index = 0

  // Generate legitimate emails
  console.log(`📧 Generating ${LEGITIMATE_COUNT} legitimate emails...`)
  for (let i = 0; i < LEGITIMATE_COUNT; i++) {
    try {
      const email = await generateLegitimateEmail(index++)
      emails.push(email)
      console.log(`  ✓ Generated legitimate email ${i + 1}/${LEGITIMATE_COUNT}: "${email.subject}"`)
    } catch (error) {
      console.error(`  ✗ Error generating legitimate email ${i + 1}:`, error)
    }
  }

  // Generate phishing emails by type
  console.log('\n🎣 Generating phishing emails...')
  for (const [type, count] of Object.entries(PHISHING_TYPES)) {
    console.log(`\n  Generating ${count} ${type} emails...`)
    for (let i = 0; i < count; i++) {
      try {
        const email = await generatePhishingEmail(type, index++)
        emails.push(email)
        console.log(`    ✓ Generated ${type} email ${i + 1}/${count}: "${email.subject}"`)
      } catch (error) {
        console.error(`    ✗ Error generating ${type} email ${i + 1}:`, error)
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
  console.log(`   - Legitimate: ${LEGITIMATE_COUNT}`)
  console.log(`   - Phishing: ${emails.length - LEGITIMATE_COUNT}`)
  console.log(`📁 Saved to: ${OUTPUT_FILE}\n`)
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateDataset().catch(console.error)
}
