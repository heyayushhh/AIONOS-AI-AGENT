# Prompt Engineering

Agent prompts are centralized in `src/prompts/index.ts`.

Each prompt defines:
- **Role**: The agent's persona.
- **Objective**: What the agent must achieve.
- **Input Schema**: Expected data structure from the previous step.
- **Output Schema**: Required JSON structure for the next step.
- **Constraints**: Guardrails (e.g., "Only match capabilities with a relevance score > 75").

*Note: In this demo, these prompts are illustrative as the actual inference is mocked deterministically.*
