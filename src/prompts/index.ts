export const AGENT_PROMPTS = {
  INTAKE_AGENT: {
    role: 'Intake Agent',
    objective: 'Analyze unstructured business inquiries and extract formal requirements, missing information, and risks.',
    inputSchema: '{ inquiry: string, budget: string, timeline: string, objective: string, challenges: string }',
    outputSchema: '{ requirements: Requirement[], missing: string[], risks: string[] }',
    constraints: 'Must categorize requirements into Technical, Business, and Compliance. Highlight any vague assertions as missing info.',
  },
  QUALIFICATION_AGENT: {
    role: 'Qualification Agent',
    objective: 'Score the opportunity based on capability match, budget, and timeline feasibility.',
    inputSchema: '{ requirements: Requirement[] }',
    outputSchema: '{ score: number, qualificationStatus: string, reasons: string[] }',
    constraints: 'Decline opportunities requiring capabilities we do not have.',
  },
  CAPABILITY_MATCHER: {
    role: 'Capability Matching Agent',
    objective: 'Match internal capabilities and experts to the extracted requirements.',
    inputSchema: '{ requirements: Requirement[] }',
    outputSchema: '{ matches: CapabilityMatch[] }',
    constraints: 'Only match capabilities with a relevance score > 75. Provide concrete evidence for each match.',
  },
  PROPOSAL_AGENT: {
    role: 'Proposal Generation Agent',
    objective: 'Generate a comprehensive, client-ready proposal draft.',
    inputSchema: '{ matches: CapabilityMatch[], requirements: Requirement[], context: any }',
    outputSchema: '{ sections: ProposalSection[] }',
    constraints: 'Maintain a professional, authoritative tone. Include sections for Executive Summary, Client Needs, Solution, Implementation, and Risks.',
  },
  FOLLOW_UP_PLANNER: {
    role: 'Follow-up Planner',
    objective: 'Generate actionable next steps based on the current state of the opportunity.',
    inputSchema: '{ stage: string, missingInfo: string[] }',
    outputSchema: '{ tasks: FollowUpTask[] }',
    constraints: 'Assign tasks to Human or AI appropriately.',
  }
};
