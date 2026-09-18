# Architecture

The DealFlow AI Agentic platform (Demo) is built with a frontend-first architecture using React, Vite, TypeScript, and Tailwind CSS. State is managed locally using React Context and `localStorage`.

## Mock Service Layer
To simulate a real backend and autonomous agents without external API dependencies, we use a service layer pattern:
- **`opportunityService`**: Handles CRUD for deals.
- **`agentService`**: Simulates the Intake and Capability Matching agents.
- **`knowledgeService`**: Simulates RAG (Retrieval-Augmented Generation) document retrieval.
- **`proposalService`**: Simulates the AI Proposal Generation.
- **`approvalService`**: Simulates Human-in-the-loop governance.
- **`followUpService`**: Simulates autonomous task generation.

## Future State
In production, these services will be replaced with real REST or gRPC clients pointing to a backend running LangGraph, a vector database (like Pinecone), and a relational database (PostgreSQL).
