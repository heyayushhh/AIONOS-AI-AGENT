# Agent Workflow

The platform orchestrates multiple specialized AI agents:

1. **Intake Agent**: Analyzes unstructured text (RFP fragments, meeting notes) to extract structured requirements, identify missing information, and flag risks.
2. **Qualification Agent**: (Implicitly run) Scores the opportunity based on capability match and budget.
3. **Capability Matching Agent**: Uses extracted requirements to search the knowledge base and match internal capabilities, providing evidence and identifying SMEs.
4. **Proposal Agent**: Generates a multi-section proposal draft using the matched capabilities and client needs.
5. **Human Approval Gateway**: Pauses the workflow until a human executive reviews and approves the generated proposal.
6. **Follow-up Planner**: Dispatches next steps (both for humans and AI agents) based on the current state.
