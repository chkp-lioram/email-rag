# Email RAG System - Copilot Instructions

## Project Overview

This is a Retrieval-Augmented Generation (RAG) system for detecting and analyzing phishing threats in email datasets. It combines semantic vector search with LLM-powered analysis to identify security threats and provide detailed explanations.

**Key Capabilities:**

- Synthetic data generation (100 emails: 60% legitimate, 40% phishing)
- Vector embeddings for semantic search (1536 dimensions)
- Hybrid search (vector similarity + metadata filtering)
- Batch LLM analysis with confidence scores and explanations
- Interactive natural language query interface

## Tech Stack & Configuration

- **Runtime**: Node.js (v20+) with TypeScript (ES2022 target)
- **Execution**: Use `tsx` for direct TypeScript execution
- **Module System**: ES Modules (`type: "module"`). Use `import.meta.url` for file paths, not `__dirname`
- **LLM Provider**: OpenAI
  - Chat & Generation: `gpt-5-nano` (configurable via `OPENAI_CHAT_MODEL` env var)
  - Embeddings: `text-embedding-3-small` (1536 dims, configurable via `OPENAI_EMBEDDING_MODEL`)
- **Vector Database**: ChromaDB local server (`localhost:8000`)
  - Persistence: `./data/chroma-data`
  - Distance Metric: L2/Euclidean
- **Dependencies**: `openai`, `chromadb`, `@faker-js/faker`

## Critical Workflows & Commands

### Environment Setup

- **Running Scripts**: ALWAYS use the `--env-file` flag to load environment variables
  ```bash
  npx tsx --env-file=.env src/generate-dataset.ts
  ```
- **Environment Variables**: Do NOT use `dotenv` package. Rely on Node.js native `.env` loading
- **ChromaDB Server**: Must be running before ingestion/queries
  ```bash
  npx chroma run --path ./data/chroma-data
  ```

### Available Scripts

- `npm run generate`: Create synthetic dataset → `data/emails.json`
- `npm run ingest`: Embed emails and populate ChromaDB
- `npm run query "<query>"`: Single query mode
- `npm run interactive`: Continuous query loop
- `npm run inspect`: View database contents
- `npm run test:llm`: Test OpenAI connectivity
- `npm run test:vectordb`: Test ChromaDB operations
- `npm run test`: Run all tests

## Architecture & Patterns

### 1. RAG Pipeline (src/query.ts)

**Flow**: User Query → Parse Filters → Embed Query → Vector Search → LLM Batch Analysis → Ranked Results

**Key Optimizations:**

- **Batch LLM Analysis**: Single API call analyzes all retrieved emails (10x faster than sequential)
- **Hybrid Search**: Vector similarity + metadata filtering (`hasAttachment`, `senderDomain`)
- **Post-filtering**: Domain filters applied in-memory (ChromaDB doesn't support `$contains` operator)

**Filter Parsing:**

- "with attachment" → `hasAttachment: true`
- "from gmail" → `senderDomain: gmail.com` (post-filter)
- "external" → `senderDomain: external` (semantic handling)

### 2. Synthetic Data Generation

**Dataset Composition:**

- 60 legitimate emails (business correspondence, meetings, updates)
- 40 phishing emails across 4 types:
  - Credential Harvesting
  - BEC (Business Email Compromise)
  - Invoice Fraud
  - Urgency Scams

**Batch Generation Optimization:**

- **Batch Size**: 10 emails per LLM API call (configurable via `BATCH_SIZE` constant)
- **Performance**: ~20x faster than sequential generation (10 API calls vs 200)
- **Approach**: Single prompt generates multiple emails as JSON array
- **Structure**: LLM returns `[{"subject": "...", "body": "..."}]` for batch processing
- **Metadata**: Faker.js generates realistic sender/recipient details post-generation

**Safety Bypass Pattern:**

- **Problem**: LLM refuses to generate "phishing" emails
- **Solution**: Request "training examples" or "patterns" with placeholders (e.g., `[VERIFICATION LINK]`)
- **Implementation**: Use `replacePlaceholders()` to inject realistic fake data post-generation
- **Do Not**: Ask LLM to "act as an attacker" or generate "malicious" content directly

### 3. Vector Database (src/vectordb.ts)

**ChromaDB Schema:**

- `documents`: Combined text format: `From: {name} <{email}>\nSubject: {subject}\n{body}\n[Attachment: {name}]`
- `metadatas`: Structured fields (`sender`, `subject`, `timestamp`, `isPhishing`, `hasAttachment`, etc.)
- `embeddings`: 1536-dimensional vectors
- `ids`: Unique email IDs

**Operations:**

- `getCollection(name)`: Get or create collection
- `addEmails(emails)`: Batch upsert with embeddings (optimized single-loop processing)
- `search(queryEmbedding, limit, whereFilter?)`: Hybrid search with optional metadata filtering
- `count()`: Get total email count
- `clear()`: Delete collection

**Important Constraints:**

- ChromaDB supports operators: `$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`, `$in`, `$nin`
- Does NOT support `$contains` - use post-filtering for partial matches
- Where clauses must have explicit operators: `{ hasAttachment: { $eq: true } }`

### 4. LLM Integration (src/llm.ts)

**Wrapper Functions:**

- `chat(prompt, systemPrompt?)`: Chat completion
- `getEmbedding(text)`: Single text embedding
- `getEmbeddings(texts[])`: Batch embedding generation (more efficient)

**Configuration:**

- Models configurable via environment variables
- Defaults: `gpt-5-nano` (chat), `text-embedding-3-small` (embeddings)

### 5. Batch Processing Strategy

**Dataset Generation (src/generate-dataset.ts):**

- Generate emails in batches of 10 per LLM call
- Structured JSON output: `[{"subject": "...", "body": "..."}]`
- Reduces API calls from ~200 to ~10 for 100 emails (~20x speedup)
- Post-process with Faker.js for metadata and placeholder replacement

**Ingestion (src/ingest.ts):**

- Process emails in batches of 10
- Generate embeddings via `getEmbeddings()` (single API call per batch)
- Upsert to ChromaDB (idempotent)

**Query Analysis:**

- Retrieve top-K emails from vector search
- Single LLM call analyzes all emails together
- Structured JSON output with threat assessments

## Key Files & Responsibilities

- `src/types.ts`: **Source of Truth** for data structures (`Email`, `ThreatResult`, `QueryResponse`, etc.)
- `src/generate-dataset.ts`: Batch synthetic data generation with safety bypass pattern (10 emails per API call)
- `src/ingest.ts`: Batch embedding generation and ChromaDB ingestion
- `src/query.ts`: Complete RAG pipeline with hybrid search and batch analysis
- `src/index.ts`: CLI entry point (query/interactive modes)
- `src/llm.ts`: Centralized OpenAI API handling
- `src/vectordb.ts`: ChromaDB wrapper with optimized operations
- `ARCHITECTURE.md`: System architecture diagrams and design decisions
- `README.md`: Setup instructions and usage guide

## Development Guidelines

1. **Always use batch processing** when possible (embeddings, LLM analysis)
2. **Use upsert over add** for idempotent operations
3. **Post-filter for partial matches** (ChromaDB limitation workaround)
4. **Structure LLM prompts for JSON output** with explicit schema
5. **Handle ChromaDB filter syntax strictly** (must use explicit operators)
6. **Keep ChromaDB server running** during development
7. **Test connectivity** before major operations (test:llm, test:vectordb)

## Common Issues & Solutions

**ChromaDB Filter Errors:**

- Always use explicit operators: `{ field: { $eq: value } }`
- Never pass empty where objects `{}`
- Post-filter for `$contains` operations

**LLM Safety Refusals:**

- Use "training example" framing
- Replace sensitive content with placeholders
- Post-process to inject realistic data

**Performance Optimization:**

- Batch dataset generation (10 emails per call, ~20x faster)
- Batch embeddings (10 emails per call)
- Single LLM analysis call for all results
- Local ChromaDB for fast queries
