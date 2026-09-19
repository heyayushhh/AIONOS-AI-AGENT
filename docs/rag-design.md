# RAG (Retrieval-Augmented Generation) Design

DealFlow AI incorporates Grounded Retrieval-Augmented Generation to ground AI agent responses in verified company assets.

## Current RAG Implementation (Demo Keyword Search)

- **Retrieval Engine**: Local keyword and tag-based search implemented in `server/retrievalService.ts`.
- **Knowledge Base**: Illustrative knowledge documents stored in `KNOWLEDGE_BASE` covering:
  - `doc-1`: Cloud Modernization & Microservices Strategy v2 (EKS, Aurora, 99.99% uptime blueprints)
  - `doc-2`: Enterprise AI & LLM Orchestration Platform (SOC2/GDPR compliance, LLM middleware)
  - `doc-3`: Legacy Sync Pro - ERP & Database Modernization Connector (SAP, Oracle CDC sync)
  - `doc-4`: Data & Analytics Alliance Overview (Snowflake, Databricks joint solutions)
- **Document Citations**: Each retrieved document carries a unique source ID (`doc-1`, `doc-2`, etc.). Agents cite these IDs directly in `evidenceDocIds`.

## Transparency & UI Labeling

In compliance with demonstration guidelines:
- The UI explicitly labels retrieval as **Demo Keyword Search RAG** to clarify that a vector database/embedding store is not yet attached.
- Only retrieved document snippets are passed into the agent prompt contexts.

## Future Production RAG (Roadmap)

In production, `server/retrievalService.ts` will be upgraded to:
- Chunk documents into semantic paragraphs.
- Compute dense vector embeddings using Google Text Embeddings (`text-embedding-004`).
- Store embeddings in Pinecone or Pgvector.
- Perform hybrid dense/sparse vector retrieval with RERANKING prior to prompt assembly.
