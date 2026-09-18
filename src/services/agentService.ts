import { Opportunity, AgentActivity, Requirement, CapabilityMatch, ProposalDraft, FollowUpTask, WorkflowStatus, AgentType } from '../types';

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const agentService = {
  runIntakeAnalysis: async (inquiry: string): Promise<{ requirements: Requirement[], missing: string[], risks: string[] }> => {
    await delay(1500); // Simulate network latency
    return {
      requirements: [
        { id: 'r1', category: 'Business', description: 'Requires enterprise-grade predictive modeling.', criticality: 'High' },
        { id: 'r2', category: 'Technical', description: 'Integration with existing legacy ERP systems.', criticality: 'Medium' },
        { id: 'r3', category: 'Compliance', description: 'Must adhere to SOC2 and GDPR standards.', criticality: 'High' }
      ],
      missing: [
        'Exact timeline for deployment is vague.',
        'Current cloud provider is not specified.'
      ],
      risks: [
        'Data migration from legacy systems may cause delays.'
      ]
    };
  },
  
  runCapabilityMatching: async (requirements: Requirement[]): Promise<CapabilityMatch[]> => {
    await delay(2000);
    return [
      {
        id: 'c1',
        name: 'Enterprise AI Core',
        description: 'Our proprietary ML orchestration platform.',
        relevanceScore: 94,
        evidence: ['Successfully deployed at 3 Fortune 500 companies.', 'Meets all compliance standards.'],
        experts: ['Dr. Sarah Chen (Chief AI Scientist)', 'Marcus Webb (Lead Architect)']
      },
      {
        id: 'c2',
        name: 'Legacy Sync Pro',
        description: 'Middleware for ERP modernization.',
        relevanceScore: 88,
        evidence: ['Pre-built connectors for SAP and Oracle.'],
        experts: ['David Kim (Integration Specialist)']
      }
    ];
  }
};
