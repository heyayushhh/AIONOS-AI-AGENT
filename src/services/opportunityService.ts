import { Opportunity, WorkflowStatus, AgentType } from '../types';
import { delay } from './agentService';

const INITIAL_AGENT_STATES = (): Record<AgentType, { type: AgentType, status: WorkflowStatus, logs: string[] }> => ({
  'Intake': { type: 'Intake', status: 'Not Started', logs: [] },
  'Qualification': { type: 'Qualification', status: 'Not Started', logs: [] },
  'Capability Matching': { type: 'Capability Matching', status: 'Not Started', logs: [] },
  'Proposal': { type: 'Proposal', status: 'Not Started', logs: [] },
  'Follow-up Planner': { type: 'Follow-up Planner', status: 'Not Started', logs: [] }
});

export const opportunityService = {
  createOpportunity: async (data: Partial<Opportunity>): Promise<Opportunity> => {
    await delay(1000);
    const newOpp: Opportunity = {
      id: `opp-${Date.now()}`,
      title: data.title || 'New Opportunity',
      company: data.company || 'Unknown Company',
      industry: data.industry || 'General',
      value: data.value || '$0',
      stage: 'New',
      confidenceScore: Math.floor(Math.random() * 20) + 50, // 50-70 initially
      inquiry: data.inquiry || '',
      budget: data.budget || '',
      timeline: data.timeline || '',
      objective: data.objective || '',
      challenges: data.challenges || '',
      contactRole: data.contactRole || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      agentStates: INITIAL_AGENT_STATES() as Opportunity['agentStates'],
    };
    return newOpp;
  },

  getInitialDemoOpportunities: (): Opportunity[] => {
    return [
      {
        id: 'opp-1',
        title: 'Cloud Infrastructure Modernization',
        company: 'Global Tier-1 Cloud Hyperscaler',
        industry: 'Technology',
        value: '$14,500,000',
        stage: 'Review',
        confidenceScore: 94,
        inquiry: 'Need to modernize legacy on-prem infrastructure to multi-cloud.',
        budget: '$15M',
        timeline: 'Q3 2024',
        objective: 'Reduce infrastructure costs by 30%.',
        challenges: 'Legacy monolithic architecture, lack of internal cloud skills.',
        contactRole: 'CIO',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
        agentStates: {
          'Intake': { type: 'Intake', status: 'Completed', logs: [] },
          'Qualification': { type: 'Qualification', status: 'Completed', logs: [] },
          'Capability Matching': { type: 'Capability Matching', status: 'Completed', logs: [] },
          'Proposal': { type: 'Proposal', status: 'Completed', logs: [] },
          'Follow-up Planner': { type: 'Follow-up Planner', status: 'Not Started', logs: [] }
        }
      },
      // ... more initial demo opportunities can be added if needed, but 1 is fine for initial state
    ];
  }
};
