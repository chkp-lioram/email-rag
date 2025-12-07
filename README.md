# Email RAG System - Phishing Threat Hunter

A Retrieval-Augmented Generation (RAG) system for detecting and analyzing phishing threats in email datasets. This system combines semantic vector search with LLM-powered analysis to identify security threats and provide detailed explanations.

## Overview

This project demonstrates:

- **Synthetic Data Generation**: Create realistic email datasets with phishing examples
- **Vector Embeddings**: Semantic search using OpenAI embeddings (1536 dimensions)
- **Hybrid Search**: Combine vector similarity with metadata filtering
- **LLM Analysis**: Batch threat assessment with confidence scores and explanations
- **Interactive Query**: Natural language threat hunting interface

### Key Features

- 🔍 **Natural Language Queries**: "Find emails with urgent payment requests from external senders"
- 🎯 **High Precision**: Batch LLM analysis for accurate threat detection
- ⚡ **Fast Performance**: Optimized with batch processing and local vector DB
- 📊 **Rich Context**: Confidence scores, threat indicators, and explanations
- 🔄 **Interactive Mode**: Continuous query loop for iterative threat hunting

## Architecture

For detailed architecture diagrams, component descriptions and design decisions, see [ARCHITECTURE.md](ARCHITECTURE.md).

**Quick Overview:**

1. Generate synthetic email dataset (60% legitimate, 40% phishing)
2. Embed emails and store in ChromaDB vector database
3. Query with natural language → embed → search → LLM analysis → ranked results

## Prerequisites

- **Node.js**: v20 or higher
- **OpenAI API Key**: For embeddings and LLM analysis
- **ChromaDB**: Local vector database server

## Installation

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd email-rag
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and add your OpenAI API key:

```bash
cp .env.example .env
```

Edit `.env` and set your configuration:

```bash
OPENAI_API_KEY=sk-proj-your-actual-key-here
OPENAI_CHAT_MODEL=gpt-5-nano
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
```

### 3. Start ChromaDB Server

ChromaDB must be running before ingestion and queries:

```bash
npx chroma run --path ./data/chroma-data
```

Leave this terminal running. ChromaDB will start on `localhost:8000`.

## Usage

### Generate Synthetic Dataset

Create 100 emails (60 legitimate, 40 phishing) with realistic content using batch processing:

```bash
npm run generate
```

This generates emails in batches of 10 per LLM API call (~10 total calls), making it ~20x faster than sequential generation.

Output: `data/emails.json`

### Ingest Emails into Vector Database

Generate embeddings and populate ChromaDB:

```bash
npm run ingest
```

This processes emails in batches of 10 and stores them with embeddings in ChromaDB.

> Prerequisites: Ensure ChromaDB server is running and the `data/emails.json` file exists.

### Query for Threats

**Single Query Mode:**

```bash
npm run query "Find emails with urgent payment requests"
npm run query "Show credential harvesting attempts"
npm run query "Identify CEO impersonation emails"
npm run query "Find emails from gmail addresses with attachments"
```

**Interactive Mode:**

```bash
npm run interactive
```

Type queries continuously. Type `exit` to quit.

## Available Scripts

| Script            | Command                   | Description                        |
| ----------------- | ------------------------- | ---------------------------------- |
| **Generate**      | `npm run generate`        | Create synthetic email dataset     |
| **Ingest**        | `npm run ingest`          | Embed emails and store in ChromaDB |
| **Query**         | `npm run query "<query>"` | Single query mode                  |
| **Interactive**   | `npm run interactive`     | Continuous query loop              |
| **Inspect**       | `npm run inspect`         | View database contents             |
| **Test LLM**      | `npm run test:llm`        | Test OpenAI API connectivity       |
| **Test VectorDB** | `npm run test:vectordb`   | Test ChromaDB operations           |
| **Test All**      | `npm run test`            | Run all tests                      |

## Testing / Verification

### API Connectivity Tests

**Test OpenAI Integration:**

```bash
npm run test:llm
```

Verifies chat completion and embedding generation.

**Test ChromaDB Integration:**

```bash
npm run test:vectordb
```

Tests collection management, upsert, search, and filtering.

**Run All Tests:**

```bash
npm run test
```

### Database Inspection

Verify ingestion and view stored data:

```bash
npm run inspect
```

Shows:

- Total number of emails in database
- Sample records with metadata and document text
- Verification that embeddings were generated

## Example Queries

For more query examples, see [examples/queries.md](examples/queries.md).

**Basic Threat Detection:**

- "Find phishing emails"
- "Show suspicious emails with attachments"
- "Identify urgent payment requests"

**Targeted Searches:**

- "Find emails from gmail addresses mentioning invoice"
- "Show external emails with urgent language"
- "Identify CEO impersonation attempts"

**Filtered Searches:**

- "Find emails with attachments from external senders"
- "Show emails without attachments mentioning passwords"

## Dataset Details

The synthetic dataset includes:

**Legitimate Emails (60%):**

- Meeting requests and scheduling
- Project updates and status reports
- Professional correspondence
- Generated using Faker.js + GPT-5-nano

**Phishing Emails (40%):**

- **Credential Harvesting**: Fake login verification requests
- **BEC (Business Email Compromise)**: Executive impersonation
- **Invoice Fraud**: Fake payment requests with altered bank details
- **Urgency Scams**: Time-pressure tactics for wire transfers

Each email includes ground truth labels (`isPhishing`, `phishingType`) for validation.

## Project Structure

```
email-rag/
├── src/
│   ├── generate-dataset.ts    # Synthetic data generation
│   ├── ingest.ts              # Embedding generation & storage
│   ├── query.ts               # RAG query pipeline
│   ├── index.ts               # CLI entry point
│   ├── llm.ts                 # OpenAI wrapper
│   ├── vectordb.ts            # ChromaDB wrapper
│   ├── types.ts               # TypeScript interfaces
│   ├── llm.openai.test.ts     # LLM connectivity test
│   └── vectordb.test.ts       # VectorDB operations test
├── data/
│   ├── emails.json            # Generated dataset
│   └── chroma-data/           # ChromaDB persistence (gitignored)
├── examples/
│   └── queries.md             # Example queries
├── ARCHITECTURE.md            # System architecture & diagrams
├── README.md                  # This file
├── package.json
└── tsconfig.json
```

## Troubleshooting

**ChromaDB Connection Error:**

- Ensure ChromaDB is running: `npx chroma run --path ./data/chroma-data`
- Check it's accessible at `localhost:8000`

**OpenAI API Error:**

- Verify API key in `.env` is valid
- Check API rate limits and quota

**No Results Found:**

- Ensure emails are ingested: `npm run inspect` should show 100 emails
- Try broader queries: "Find suspicious emails"

**Empty Query Results:**

- Database may be empty - run `npm run generate` then `npm run ingest`
- Check ChromaDB is running and accessible

## Future Improvements

- **Dataset Generation**: Already optimized from ~200 to ~10 LLM calls via batch processing. Could be further improved by:
  - Running a local LLM for generation (faster, no API costs)
  - Increasing batch size beyond 10 emails per call
  - Caching and reusing common email patterns
- **Embeddings**: Consider using ChromaDB's built-in embedding models via `queryTexts` parameter:
  - Faster (locally hosted)
  - Free (no API costs)
  - May be more appropriate for small-scale datasets
- **Query Performance**: Implement caching for frequently asked queries
