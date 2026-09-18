import { ProposalDraft, ProposalSection } from '../types';
import { delay } from './agentService';

export const proposalService = {
  generateDraft: async (opportunityName: string, company: string): Promise<ProposalDraft> => {
    await delay(3000);
    return {
      id: `prop-${Date.now()}`,
      status: 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sections: [
        { id: 'sec1', title: 'Executive Summary', content: `This proposal outlines a strategic approach for ${company} to modernize their operations and leverage AI.` },
        { id: 'sec2', title: 'Client Needs', content: `Based on our analysis, ${company} requires robust, scalable, and compliant AI integration into their existing ERP.` },
        { id: 'sec3', title: 'Proposed Solution', content: `We propose deploying the Enterprise AI Core platform alongside Legacy Sync Pro.` },
        { id: 'sec4', title: 'Implementation Approach', content: `Phased rollout starting with a 4-week pilot in the European division.` },
        { id: 'sec5', title: 'Assumptions & Risks', content: `Assumes access to legacy database schemas by week 2. Risk: Potential downtime during weekend migration.` }
      ]
    };
  }
};
