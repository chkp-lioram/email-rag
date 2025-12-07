export interface Email {
  id: string
  sender: string // email address
  senderName: string
  recipient: string
  subject: string
  body: string
  timestamp: string // ISO date
  hasAttachment: boolean
  attachmentName?: string
  isPhishing: boolean // ground truth for testing
  phishingType?: string // also for testing. e.g., "credential_harvest", "bec", "urgency_scam", "invoice_fraud"
}

export interface EmailWithEmbedding extends Email {
  embedding: number[]
}

export interface ThreatResult {
  emailId: string
  email: Email
  confidenceScore: number // 0-1
  explanation: string // why flagged/relevant
  threatIndicators: string[]
}

export interface QueryResponse {
  query: string
  results: ThreatResult[]
  totalFound: number
}

export interface SearchResult {
  id: string
  document: string
  metadata: Omit<Email, 'body'>
  distance: number
}
