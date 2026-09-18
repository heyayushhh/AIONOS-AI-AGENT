import { KnowledgeDoc } from '../types';
import { delay } from './agentService';

const MOCK_DOCS: KnowledgeDoc[] = [
  {
    id: 'doc-1',
    title: 'Cloud Modernization Strategy v2',
    category: 'Methodology',
    summary: 'Standardized approach for migrating monolithic applications to containerized microservices.',
    content: 'Detailed methodology covering assessment, re-platforming, and testing phases...',
    tags: ['cloud', 'migration', 'methodology']
  },
  {
    id: 'doc-2',
    title: 'AI Customer Support Framework',
    category: 'Capability',
    summary: 'Our proprietary solution for implementing LLM-driven customer support channels.',
    content: 'Overview of the architecture including vector databases, orchestration, and guardrails...',
    tags: ['ai', 'support', 'capability']
  },
  {
    id: 'doc-3',
    title: 'Data & Analytics Alliance Overview',
    category: 'Partner Ecosystem',
    summary: 'Joint offerings with Snowflake and Databricks.',
    content: 'Market positioning, joint solutions, and sales plays for the D&A space...',
    tags: ['data', 'alliance', 'snowflake']
  }
];

export const knowledgeService = {
  search: async (query: string): Promise<KnowledgeDoc[]> => {
    await delay(800);
    if (!query) return MOCK_DOCS;
    
    const lowerQuery = query.toLowerCase();
    return MOCK_DOCS.filter(doc => 
      doc.title.toLowerCase().includes(lowerQuery) || 
      doc.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  },
  
  getById: async (id: string): Promise<KnowledgeDoc | undefined> => {
    await delay(300);
    return MOCK_DOCS.find(doc => doc.id === id);
  }
};
