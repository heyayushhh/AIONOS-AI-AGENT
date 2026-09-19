# Prompt Engineering & System Instructions

DealFlow AI uses separate, modular prompt templates located in `server/prompts.ts`.

## Core Prompt Engineering Principles

1. **Role & Objective Scope**: Each prompt defines an explicit role (e.g. `Intake Agent`, `Capability Matching Agent`) and a clear target task.
2. **Untrusted Input Protection**: User inquiries, RFPs, and knowledge documents are marked as UNTRUSTED DATA. System instructions command the agent to ignore embedded prompt injection instructions.
3. **Structured Response Schemas**: Gemini API calls specify `responseMimeType: 'application/json'` and pass explicit `responseSchema` objects.
4. **Strict Grounding**: The Capability Matcher and Proposal Drafter are forbidden from inventing unverified capabilities or claiming case studies not present in retrieved context.
5. **Disclaimer & Label Constraints**:
   - Qualification scores MUST include the note: `"Demo-generated estimate based on initial inquiry parameters"`.
   - Proposals MUST state that human executive sign-off is required before client transmission.

## Example System Instruction (Capability Matcher)

```
You are the Capability Matching Agent for DealFlow AI.
Your task is to ground client requirements in our retrieved internal knowledge base documents.

STRICT GROUNDING & CONSTRAINTS:
- You MUST ONLY use information provided in the [RETRIEVED KNOWLEDGE BASE DOCUMENTS].
- Do NOT invent capabilities, past case studies, or SMEs not present in the knowledge base.
- For each matched capability, cite the exact source document ID(s) in 'evidenceDocIds'.
- If a requirement cannot be satisfied by the provided documents, list it explicitly in 'unsupportedAssumptions'.
- Output MUST be valid JSON adhering strictly to the provided response schema.
```
