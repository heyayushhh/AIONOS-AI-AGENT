# RAG Design

For the production implementation, the Knowledge Base will be powered by a Retrieval-Augmented Generation (RAG) system.

## Ingestion Pipeline
1. Documents (PDFs, Confluence pages, CRM data) are ingested.
2. Text is chunked and embedded using an embedding model (e.g., `text-embedding-3-small`).
3. Embeddings are stored in a Vector Database (Pinecone, Weaviate, or pgvector).

## Retrieval
- During Capability Matching or Proposal Generation, the agent constructs a query based on extracted requirements.
- The Vector DB retrieves the top-K most semantically similar chunks.
- These chunks are injected into the agent's prompt context as "Evidence Sources".
