# API Contracts

The mock services in `src/services/` map directly to future REST API contracts.

### POST `/api/v1/opportunities`
Creates a new opportunity.

### POST `/api/v1/opportunities/:id/workflows/intake`
Triggers the Intake Agent workflow. Returns extracted requirements.

### POST `/api/v1/opportunities/:id/workflows/match`
Triggers the Capability Matching agent. Returns array of capabilities.

### POST `/api/v1/opportunities/:id/proposals`
Generates a proposal draft. Returns the drafted sections.

### PUT `/api/v1/opportunities/:id/proposals/approve`
Approves the current proposal draft.

### GET `/api/v1/knowledge?q={query}`
Searches the RAG system for knowledge documents.
