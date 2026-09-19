# Server API Contracts

The DealFlow AI backend implements the following REST endpoints in `server/routes/ai.ts`:

### GET `/api/health`
Returns system status, active AI mode, API key configuration state, and configured Gemini model.
- **Response**:
  ```json
  {
    "status": "ok",
    "mode": "live", // or "demo"
    "hasApiKey": true,
    "model": "gemini-2.5-flash"
  }
  ```

### POST `/api/ai/intake`
Processes raw inquiry text and metadata using the Intake Agent.
- **Body**: `{ inquiry, budget, timeline, objective, challenges }`
- **Response**: `{ success: true, isLive: boolean, data: { summary, objective, industry, requirements, budget, timeline, missingInformation, risks } }`

### POST `/api/ai/qualification`
Evaluates opportunity fit and generates qualification metrics.
- **Body**: `{ intakeResult }`
- **Response**: `{ success: true, isLive: boolean, data: { classification, estimatedScore, scoreLabelNote, strengths, risks, missingInformation, qualificationSummary, followUpQuestions } }`

### POST `/api/ai/capabilities`
Executes RAG retrieval and matches requirements to internal capabilities.
- **Body**: `{ requirements, query }`
- **Response**: `{ success: true, isLive: boolean, retrievalType: "Demo Keyword Search", retrievedDocs, data: { matches } }`

### POST `/api/ai/proposal`
Synthesizes intake, qualification, and capability matches into a structured proposal.
- **Body**: `{ title, company, inquiry, intake, qualification, capabilities }`
- **Response**: `{ success: true, isLive: boolean, data: { id, title, executiveSummary, sections, assumptions, risks, openQuestions, nextSteps } }`

### POST `/api/ai/follow-ups`
Generates recommended follow-up task backlog.
- **Body**: `{ opportunity }`
- **Response**: `{ success: true, isLive: boolean, data: { tasks } }`

### POST `/api/ai/workflow`
Orchestrates the full 5-agent sequential pipeline in a single batch call.
- **Body**: `{ title, company, inquiry, budget, timeline, objective, challenges }`
- **Response**: `{ success: true, isLive: boolean, data: { intake, qualification, capabilities, proposal, followUps, retrievedDocs } }`
