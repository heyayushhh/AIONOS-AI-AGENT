# Architecture & System Design

DealFlow AI is an autonomous, agentic sales and alliances platform designed to transform raw business inquiries into qualified, grounded proposals.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Client Browser (React SPA)                     │
│  - Timeline & Step Progress Indicator                                   │
│  - Mode Badge (🟢 Live Gemini AI vs 🟡 Demo Mode)                       │
│  - Human Approval Gate for Proposals                                    │
│  - Evidence Citations & Task Backlog                                    │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ HTTP / REST API (/api/ai/*)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      Server API Layer (Express / Node.js)               │
│  - Environment Config & API Key Security (.env)                         │
│  - Endpoint Router (/api/health, /api/ai/intake, etc.)                  │
└──────────────┬──────────────────────────────────────────┬───────────────┘
               │                                          │
               ▼                                          ▼
┌───────────────────────────────┐          ┌───────────────────────────────┐
│  Gemini AI Gateway (@google/genai)│          │ Local RAG Keyword Retriever   │
│  - System Instructions & Prompts│          │ - Illustrative Knowledge Base │
│  - Structured JSON Schemas    │          │ - Keyword & Tag Matching      │
│  - Live API / Fallback Engine │          │ - Cites Document IDs          │
└───────────────────────────────┘          └───────────────────────────────┘
```

## Security Architecture

- **Server-Side API Key Protection**: `GEMINI_API_KEY` strictly resides in the server environment (`.env`). It is never passed to frontend client bundles, browser requests, or Git commits.
- **Dual-Mode Engine**:
  - **Live AI Mode**: Active when `GEMINI_API_KEY` is present and valid. Calls `@google/genai` with strict `responseSchema` validation.
  - **Demo Mode**: Automatic local deterministic fallback if no API key is set or if network errors occur.

## Key Layers

1. **Frontend**: React + Vite + TypeScript + Tailwind CSS glassmorphic UI.
2. **Server Middleware**: Integrated Express router mounted directly in Vite dev server and standalone `server.ts`.
3. **Agent Orchestrator**: Executes 5 specialized AI agents sequentially with shared pipeline state.
4. **Retrieval Service**: Keyword and tag-based document search providing grounded evidence and source document IDs.
5. **Governance**: Human-in-the-Loop (HITL) approval gate for all synthesized proposal drafts.
