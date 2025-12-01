// Core email interface
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
  isPhishing: boolean // ground truth
  phishingType?: string // e.g., "credential_harvest", "bec", "urgency_scam", "invoice_fraud"
}

// Email with embedding vector
export interface EmailWithEmbedding extends Email {
  embedding: number[]
}

// Threat analysis result for a single email
export interface ThreatResult {
  emailId: string
  email: Email
  confidenceScore: number // 0-1
  explanation: string // why flagged/relevant
  threatIndicators: string[]
}

// Complete query response
export interface QueryResponse {
  query: string
  results: ThreatResult[]
  totalFound: number
}

// Vector DB search result
export interface SearchResult {
  id: string
  document: string
  metadata: Omit<Email, 'body'>
  distance: number
}
