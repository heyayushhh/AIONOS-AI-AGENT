export interface KnowledgeDoc {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  tags: string[];
  experts?: string[];
}

export const KNOWLEDGE_BASE: KnowledgeDoc[] = [
  {
    id: 'doc-1',
    title: 'Cloud Modernization & Microservices Strategy v2',
    category: 'Methodology & Architecture',
    summary: 'Standardized framework for migrating legacy monolithic workloads to AWS containerized microservices (EKS / Kubernetes).',
    content: `Our Cloud Modernization framework delivers 99.99% uptime architectures on AWS using EKS, Terraform, and automated CI/CD pipelines.
Includes pre-built migration patterns for legacy databases (Oracle to Aurora Postgres), blue/green deployment blueprints for zero-downtime holiday traffic peaks, and hands-on Kubernetes training modules for client engineering teams.
Relevant SMEs: Dr. Sarah Chen (Chief AI Scientist), Marcus Webb (Lead Cloud Architect).`,
    tags: ['cloud', 'migration', 'aws', 'kubernetes', 'microservices', 'uptime', 'database', 'retail'],
    experts: ['Dr. Sarah Chen (Chief AI Scientist)', 'Marcus Webb (Lead Cloud Architect)'],
  },
  {
    id: 'doc-2',
    title: 'Enterprise AI & LLM Orchestration Platform',
    category: 'Capability Brief',
    summary: 'Our proprietary ML & LLM middleware for enterprise agent workflows and RAG integration.',
    content: `Enterprise AI Core provides high-throughput LLM orchestration, structured output validation, and hybrid RAG vector search.
Built with enterprise SOC2 Type II and GDPR compliance controls, automated fallbacks, and real-time observability dashboards. Proven in Fortune 500 deployments.
Relevant SMEs: Dr. Sarah Chen (Chief AI Scientist), Elena Rostova (Security & Compliance Officer).`,
    tags: ['ai', 'llm', 'rag', 'orchestration', 'enterprise', 'soc2', 'gdpr', 'security'],
    experts: ['Dr. Sarah Chen (Chief AI Scientist)', 'Elena Rostova (Security Officer)'],
  },
  {
    id: 'doc-3',
    title: 'Legacy Sync Pro - ERP & Database Modernization Connector',
    category: 'Integration Middleware',
    summary: 'Pre-packaged integration connectors for legacy SAP, Oracle, and mainframe backends.',
    content: `Legacy Sync Pro enables real-time CDC (Change Data Capture) and dual-write synchronizations between legacy on-premise ERP systems and cloud microservices.
Reduces data migration risk and eliminates downtime during complex backend cutovers.
Relevant SMEs: David Kim (Integration Specialist).`,
    tags: ['legacy', 'erp', 'oracle', 'sap', 'sync', 'integration', 'database'],
    experts: ['David Kim (Integration Specialist)'],
  },
  {
    id: 'doc-4',
    title: 'Data & Analytics Alliance Overview',
    category: 'Partner Ecosystem',
    summary: 'Joint solution architectures with Snowflake, Databricks, and AWS Data Lakehouse.',
    content: `Joint sales playbooks and architectures for real-time analytics, predictive modeling, and customer telemetry.
Relevant SMEs: Marcus Webb (Lead Architect), Priya Patel (Data Alliances Director).`,
    tags: ['data', 'analytics', 'snowflake', 'databricks', 'partner', 'aws'],
    experts: ['Priya Patel (Data Alliances Director)', 'Marcus Webb (Lead Architect)'],
  },
];

export const retrievalService = {
  /**
   * Keyword and tag-based document search.
   * Labeled as Demo Retrieval (Keyword Search) to distinguish from vector embeddings.
   */
  search: (query: string, limit: number = 3): KnowledgeDoc[] => {
    if (!query || query.trim() === '') {
      return KNOWLEDGE_BASE.slice(0, limit);
    }

    const keywords = query.toLowerCase().split(/\W+/).filter(k => k.length > 2);
    
    const scoredDocs = KNOWLEDGE_BASE.map(doc => {
      let score = 0;
      const textToSearch = `${doc.title} ${doc.summary} ${doc.content} ${doc.tags.join(' ')}`.toLowerCase();

      keywords.forEach(keyword => {
        if (doc.tags.some(tag => tag.toLowerCase().includes(keyword))) {
          score += 3;
        }
        if (doc.title.toLowerCase().includes(keyword)) {
          score += 2;
        }
        if (textToSearch.includes(keyword)) {
          score += 1;
        }
      });

      return { doc, score };
    });

    scoredDocs.sort((a, b) => b.score - a.score);

    // Filter to those with score > 0, or default top N
    const matches = scoredDocs.filter(item => item.score > 0).map(item => item.doc);
    return matches.length > 0 ? matches.slice(0, limit) : KNOWLEDGE_BASE.slice(0, limit);
  },

  getById: (id: string): KnowledgeDoc | undefined => {
    return KNOWLEDGE_BASE.find(d => d.id === id);
  },

  getAll: (): KnowledgeDoc[] => {
    return KNOWLEDGE_BASE;
  },
};
