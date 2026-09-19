import { ProposalDraft } from '../types';
import { apiClient } from './apiClient';

export const proposalService = {
  generateDraft: async (payload: { title: string; company: string; inquiry: string; intake: any; qualification: any; capabilities: any[] }): Promise<{ proposal: ProposalDraft; isLive: boolean }> => {
    try {
      const res = await apiClient.postProposal(payload);
      const data = res.data;
      const draft: ProposalDraft = {
        id: data.id || `prop-${Date.now()}`,
        title: data.title || 'Enterprise Proposal Draft',
        executiveSummary: data.executiveSummary || '',
        sections: data.sections || [],
        assumptions: data.assumptions || [],
        risks: data.risks || [],
        openQuestions: data.openQuestions || [],
        nextSteps: data.nextSteps || [],
        status: 'Needs Review',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return { proposal: draft, isLive: res.isLive || false };
    } catch (err) {
      console.warn('[proposalService] Proposal API error, using local fallback:', err);
      const fallbackDraft: ProposalDraft = {
        id: `prop-${Date.now()}`,
        title: `Enterprise Cloud Modernization & Infrastructure Transformation`,
        executiveSummary: `This proposal outlines a 4-phase transformation strategy to migrate your monolithic application to AWS microservices, ensuring 99.99% availability.`,
        sections: [
          { id: 'sec-1', title: '1. Executive Summary', content: `Proposal for ${payload.company} to modernize monolithic operations onto AWS containerized microservices.`, evidenceDocIds: ['doc-1'] },
          { id: 'sec-2', title: '2. Client Needs & Requirement Mapping', content: `Addresses core requirements: AWS EKS migration, legacy CDC ERP sync, SOC2/GDPR compliance, and Kubernetes team enablement.`, evidenceDocIds: ['doc-1', 'doc-3'] },
          { id: 'sec-3', title: '3. Technical Architecture', content: `AWS EKS multi-AZ redundancy with Aurora Postgres and Legacy Sync Pro connector.`, evidenceDocIds: ['doc-1', 'doc-3'] },
          { id: 'sec-4', title: '4. Implementation Approach & Phasing', content: `4-phase rollout: Blueprint (W1-3), Core CDC (W4-8), Load Testing (W9-11), Handoff (W12).`, evidenceDocIds: ['doc-1'] },
          { id: 'sec-5', title: '5. Human Approval Note', content: `Synthesized by DealFlow AI. Requires explicit sign-off from Executive VP of Alliances prior to client delivery.`, evidenceDocIds: [] },
        ],
        assumptions: ['Client will provide staging credentials within 5 business days.'],
        risks: ['Legacy database stored procedures may require refactoring.'],
        openQuestions: ['Can client provide staging access for initial load testing by Week 4?'],
        nextSteps: ['Executive sign-off in DealFlow AI Approval Gateway.'],
        status: 'Needs Review',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return { proposal: fallbackDraft, isLive: false };
    }
  }
};
