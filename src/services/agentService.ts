import { Requirement, CapabilityMatch, QualificationResult } from '../types';
import { apiClient } from './apiClient';

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const agentService = {
  runIntakeAnalysis: async (payload: { inquiry: string; budget?: string; timeline?: string; objective?: string; challenges?: string }): Promise<{
    requirements: Requirement[];
    missing: string[];
    risks: string[];
    summary: string;
    objective: string;
    industry: string;
    isLive: boolean;
  }> => {
    try {
      const res = await apiClient.postIntake(payload);
      const data = res.data;
      return {
        requirements: data.requirements || [],
        missing: data.missingInformation || [],
        risks: data.risks || [],
        summary: data.summary || '',
        objective: data.objective || '',
        industry: data.industry || '',
        isLive: res.isLive || false,
      };
    } catch (err) {
      console.warn('[agentService] Intake API error, using local fallback:', err);
      return {
        requirements: [
          { id: 'r1', category: 'Business', description: 'Requires enterprise-grade predictive modeling.', criticality: 'High' },
          { id: 'r2', category: 'Technical', description: 'Integration with existing legacy ERP systems.', criticality: 'Medium' },
          { id: 'r3', category: 'Compliance', description: 'Must adhere to SOC2 and GDPR standards.', criticality: 'High' }
        ],
        missing: ['Exact timeline for deployment is vague.', 'Current cloud provider is not specified.'],
        risks: ['Data migration from legacy systems may cause delays.'],
        summary: 'Client seeks cloud modernization and microservices architecture.',
        objective: 'Improve uptime to 99.99%',
        industry: 'Retail',
        isLive: false,
      };
    }
  },

  runQualification: async (intakeResult: any): Promise<{ qualification: QualificationResult; isLive: boolean }> => {
    try {
      const res = await apiClient.postQualification(intakeResult);
      return { qualification: res.data, isLive: res.isLive || false };
    } catch (err) {
      console.warn('[agentService] Qualification API error, using local fallback:', err);
      return {
        qualification: {
          classification: 'Qualified',
          estimatedScore: 90,
          scoreLabelNote: 'Demo-generated estimate based on initial inquiry parameters',
          strengths: ['High alignment with Cloud Modernization capabilities.', 'Sufficient budget.'],
          risks: ['Timeline before holiday season is tight.'],
          missingInformation: ['Confirmation of legacy database engines.'],
          qualificationSummary: 'Strong opportunity with high win probability.',
          followUpQuestions: ['What legacy database engine is currently running on-premise?'],
        },
        isLive: false,
      };
    }
  },

  runCapabilityMatching: async (requirements: Requirement[], query?: string): Promise<{
    capabilities: CapabilityMatch[];
    retrievedDocs: Array<{ id: string; title: string; summary: string }>;
    isLive: boolean;
  }> => {
    try {
      const res = await apiClient.postCapabilities(requirements, query);
      return {
        capabilities: res.data.matches || [],
        retrievedDocs: res.retrievedDocs || [],
        isLive: res.isLive || false,
      };
    } catch (err) {
      console.warn('[agentService] Capability matching API error, using local fallback:', err);
      return {
        capabilities: [
          {
            id: 'c1',
            name: 'Cloud Modernization & Microservices Strategy v2',
            description: 'Standardized framework for migrating legacy monolithic workloads to AWS containerized microservices.',
            relevanceScore: 94,
            relevanceExplanation: 'Direct match for AWS microservices migration and 99.99% uptime target.',
            evidence: ['Pre-built migration patterns for legacy databases to AWS Aurora Postgres.', 'Zero-downtime blue/green deployment blueprints.'],
            evidenceDocIds: ['doc-1'],
            experts: ['Dr. Sarah Chen (Chief AI Scientist)', 'Marcus Webb (Lead Architect)'],
            unsupportedAssumptions: ['Assumes target cloud platform is AWS.'],
          },
          {
            id: 'c2',
            name: 'Legacy Sync Pro - Middleware Connector',
            description: 'Pre-packaged integration connectors for legacy SAP, Oracle, and mainframe backends.',
            relevanceScore: 88,
            relevanceExplanation: 'Middleware for ERP modernization and real-time CDC sync.',
            evidence: ['Pre-built connectors for SAP and Oracle.'],
            evidenceDocIds: ['doc-3'],
            experts: ['David Kim (Integration Specialist)'],
            unsupportedAssumptions: [],
          }
        ],
        retrievedDocs: [
          { id: 'doc-1', title: 'Cloud Modernization Strategy v2', summary: 'Standardized approach for containerized microservices.' },
          { id: 'doc-3', title: 'Legacy Sync Pro', summary: 'Middleware for ERP modernization.' }
        ],
        isLive: false,
      };
    }
  }
};
