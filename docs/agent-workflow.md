# Multi-Agent Workflow Pipeline

DealFlow AI coordinates 5 specialized agents to process business opportunities from initial intake to proposal approval.

## Agent Pipeline Overview

1. **Intake Agent** (`POST /api/ai/intake`)
   - **Input**: Raw unstructured text, target budget, timeline, key objectives.
   - **Output**: Structured requirements (categorized into Technical, Business, Compliance), criticality ratings, vague missing parameters, and technical/timeline risks.
   - **Security**: Treats inquiry as untrusted data to prevent prompt injection.

2. **Qualification Agent** (`POST /api/ai/qualification`)
   - **Input**: Intake Agent analysis output.
   - **Output**: Opportunity fit classification (`Qualified`, `Unqualified`, `Nurture`), numerical fit score (explicitly labeled as a *Demo-generated estimate*), strengths, risks, missing details, and prospect follow-up questions.

3. **Capability Matching Agent** (`POST /api/ai/capabilities`)
   - **Input**: Extracted requirements & retrieved knowledge base documents.
   - **Output**: Capability matches with relevance scores, explanations, evidence points, cited source document IDs (`doc-1`, `doc-3`), Subject Matter Experts (SMEs), and unsupported assumptions.
   - **Constraint**: Strictly grounded in retrieved knowledge documents.

4. **Proposal Drafter Agent** (`POST /api/ai/proposal`)
   - **Input**: Opportunity details, intake summary, qualification fit, capability matches, and RAG document context.
   - **Output**: Professional enterprise proposal draft (Executive Summary, Client Needs, Solution Architecture, Implementation Phasing, Risks, and Open Questions).
   - **Evidence Citations**: Cites source document IDs inline with solution points.

5. **Follow-up Planner Agent** (`POST /api/ai/follow-ups`)
   - **Input**: Complete opportunity state and proposal draft.
   - **Output**: Recommended task backlog categorized by Human vs. AI assignee, priority, and suggested due dates.

6. **Human Approval Gate**
   - Requires explicit sign-off from an authorized executive in the Approval Gateway before any proposal can be finalized or transmitted.
