# Future Production Roadmap

Transition path from the current prototype to full production:

## 1. LangGraph Orchestration & Agent State Machine
- Replace custom Express orchestration in `server/routes/ai.ts` with **LangGraph** or **Google Agent Builder**.
- Enable dynamic agent loops, branching evaluation logic, and recursive self-reflection.

## 2. Vector Database & Semantic RAG
- Upgrade keyword RAG (`server/retrievalService.ts`) to dense vector search with Pinecone, Qdrant, or Pgvector.
- Generate embeddings using Google Text Embeddings (`text-embedding-004`).
- Implement hybrid BM25 + dense vector search with Cohere / BGE Reranker.

## 3. Relational Persistence & Multi-Tenancy
- Migrate local React Context & `localStorage` store (`src/lib/store.tsx`) to PostgreSQL with Prisma ORM.
- Implement multi-tenant workspace security and role-based access control (RBAC).

## 4. Real External Integrations
- Connect Intake Agent to live inbound email webhooks (SendGrid / AWS SES) and Salesforce CRM / HubSpot APIs.
- Connect Follow-up Planner to Jira, Slack, and Google Calendar.
- Implement DocuSign integration for binding contract execution post Human Approval.

## 5. Async Job Queue & Real-time WebSockets
- Use Redis + BullMQ for asynchronous background execution of multi-agent workflows.
- Push real-time agent execution updates to client UI via WebSockets or Server-Sent Events (SSE).
