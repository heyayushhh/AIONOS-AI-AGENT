import { GoogleGenAI, Schema } from '@google/genai';
import { config, isLiveMode } from './config.ts';
import {
  INTAKE_RESPONSE_SCHEMA,
  QUALIFICATION_RESPONSE_SCHEMA,
  CAPABILITY_MATCH_RESPONSE_SCHEMA,
  PROPOSAL_RESPONSE_SCHEMA,
  FOLLOWUP_RESPONSE_SCHEMA,
} from './schemas.ts';
import {
  INTAKE_AGENT_PROMPT,
  QUALIFICATION_AGENT_PROMPT,
  CAPABILITY_MATCHING_PROMPT,
  PROPOSAL_AGENT_PROMPT,
  FOLLOWUP_PLANNER_PROMPT,
} from './prompts.ts';

let lastKey = '';
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const currentKey = config.geminiApiKey;
  if (currentKey && currentKey !== lastKey) {
    try {
      aiClient = new GoogleGenAI({ apiKey: currentKey });
      lastKey = currentKey;
    } catch (e) {
      console.error('[GeminiGateway] Failed to initialize GoogleGenAI client:', (e as Error).message);
      aiClient = null;
    }
  }
  return aiClient;
}

/**
 * Executes a structured Gemini prompt with JSON schema enforcement.
 */
async function callGeminiStructured<T>(
  systemInstruction: string,
  userPrompt: string,
  responseSchema: Schema
): Promise<T | null> {
  if (!isLiveMode()) {
    console.log('[GeminiGateway] Operating in DEMO mode. Skipping live API call.');
    return null;
  }

  const client = getAiClient();
  if (!client) {
    console.warn('[GeminiGateway] No valid API key configured. Falling back to Demo mode.');
    return null;
  }

  try {
    console.log(`[GeminiGateway] Executing Live Gemini call using model: ${config.geminiModel}`);

    const response = await client.models.generateContent({
      model: config.geminiModel,
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response received from Gemini API');
    }

    const parsed = JSON.parse(text) as T;
    return parsed;
  } catch (error: any) {
    console.error('[GeminiGateway] Live AI call failed:', error?.message || error);
    return null; // Return null so callers can gracefully fall back to local mock data
  }
}

// --- Deterministic Mock Fallbacks ---

const MOCK_INTAKE_RESULT = {
  summary: 'Client seeks cloud migration from legacy on-premise infrastructure to AWS microservices.',
  objective: 'Improve uptime to 99.99% and reduce operational costs by 20% prior to holiday traffic peaks.',
  industry: 'Retail',
  requirements: [
    { id: 'req-1', category: 'Technical', description: 'Migrate monolithic e-commerce backend to containerized microservices on AWS (EKS).', criticality: 'High' },
    { id: 'req-2', category: 'Technical', description: 'Real-time database integration and CDC synchronization with legacy ERP.', criticality: 'High' },
    { id: 'req-3', category: 'Compliance', description: 'Full SOC2 Type II and GDPR compliance audit readiness.', criticality: 'High' },
    { id: 'req-4', category: 'Business', description: 'Engineering team hands-on Kubernetes training and operational runbooks.', criticality: 'Medium' },
  ],
  budget: '$5,000,000 indicated',
  timeline: 'Q3 2024 (Target completion before Black Friday peak)',
  missingInformation: [
    'Current cloud provider infrastructure details are unspecified.',
    'Exact throughput (RPS) requirements during peak holiday traffic.',
  ],
  risks: [
    'Legacy database dependencies may introduce cutover migration delays.',
    'Lack of internal client Kubernetes expertise could slow down operational handoff.',
  ],
};

const MOCK_QUALIFICATION_RESULT = {
  classification: 'Qualified',
  estimatedScore: 92,
  scoreLabelNote: 'Demo-generated estimate based on initial inquiry parameters',
  strengths: [
    'High strategic alignment with our Cloud Modernization & AWS capabilities.',
    'Sufficient budget ($5M) for comprehensive migration and training scope.',
    'Clear executive mandate for uptime and cost reduction.',
  ],
  risks: [
    'Tight timeline preceding holiday traffic requires immediate deployment of senior architects.',
    'Internal skill gap requires embedded enablement team.',
  ],
  missingInformation: [
    'Confirmation of existing legacy database engines (Oracle vs DB2).',
  ],
  qualificationSummary: 'Strong opportunity with high win probability provided database migration risks are mitigated early.',
  followUpQuestions: [
    'What legacy database engine is currently running on-premise?',
    'What is the estimated peak transaction per second load expected for Black Friday?',
  ],
};

const MOCK_CAPABILITY_RESULT = {
  matches: [
    {
      id: 'match-1',
      name: 'Cloud Modernization & Microservices Strategy v2',
      description: 'Standardized framework for migrating legacy monolithic workloads to AWS containerized microservices (EKS).',
      relevanceScore: 96,
      relevanceExplanation: 'Direct match for AWS microservices migration, Kubernetes enablement, and 99.99% uptime target.',
      evidence: [
        'Pre-built migration patterns for legacy databases to AWS Aurora Postgres.',
        'Zero-downtime blue/green deployment blueprints for holiday traffic peaks.',
      ],
      evidenceDocIds: ['doc-1'],
      experts: ['Dr. Sarah Chen (Chief AI Scientist)', 'Marcus Webb (Lead Cloud Architect)'],
      unsupportedAssumptions: ['Assumes client uses AWS as target cloud provider.'],
    },
    {
      id: 'match-2',
      name: 'Legacy Sync Pro - Middleware Connector',
      description: 'Pre-packaged integration connectors for legacy ERP and database synchronization.',
      relevanceScore: 89,
      relevanceExplanation: 'Provides real-time CDC sync to safely decouple legacy databases without downtime.',
      evidence: [
        'Pre-built connectors for legacy SAP and Oracle databases.',
        'Dual-write synchronization to prevent data loss during cutover.',
      ],
      evidenceDocIds: ['doc-3'],
      experts: ['David Kim (Integration Specialist)'],
      unsupportedAssumptions: [],
    },
  ],
};

const MOCK_PROPOSAL_RESULT = {
  id: `prop-${Date.now()}`,
  title: 'Enterprise Cloud Modernization & Infrastructure Transformation',
  executiveSummary: 'This proposal outlines a 4-phase transformation strategy to migrate your monolithic e-commerce application to AWS microservices, ensuring 99.99% availability for Black Friday and beyond.',
  sections: [
    {
      id: 'sec-1',
      title: '1. Executive Summary & Strategic Objectives',
      content: 'Global Retail Alliance requires a resilient, high-availability architecture capable of handling peak holiday demand while reducing infrastructure overhead by 20%. Our solution leverages AWS EKS microservices and automated scaling.',
      evidenceDocIds: ['doc-1'],
    },
    {
      id: 'sec-2',
      title: '2. Client Needs & Requirement Mapping',
      content: 'We address all core requirements: (1) Monolith decomposition into containerized microservices, (2) Real-time legacy ERP synchronization using Legacy Sync Pro middleware, (3) SOC2 / GDPR compliance enforcement, and (4) Comprehensive Kubernetes enablement for your engineering team.',
      evidenceDocIds: ['doc-1', 'doc-3'],
    },
    {
      id: 'sec-3',
      title: '3. Technical Architecture & Solution Design',
      content: 'The target state deploys AWS EKS with multi-AZ redundancy, Aurora Postgres with automated failover, and CloudFront CDN caching. Real-time Change Data Capture (CDC) connects on-premise legacy systems during phase transition.',
      evidenceDocIds: ['doc-1', 'doc-2', 'doc-3'],
    },
    {
      id: 'sec-4',
      title: '4. Implementation Approach & Phasing',
      content: 'Phase 1: Architecture Blueprint & Security Audit (Weeks 1-3). Phase 2: Core Microservices & CDC Setup (Weeks 4-8). Phase 3: Traffic Migration & Performance Load Testing (Weeks 9-11). Phase 4: Production Handoff & Knowledge Transfer (Week 12).',
      evidenceDocIds: ['doc-1'],
    },
    {
      id: 'sec-5',
      title: '5. Governance & Human Approval Note',
      content: 'This draft has been synthesized by DealFlow AI Agents. Per enterprise policy, this proposal requires explicit sign-off from the Executive Vice President of Alliances prior to formal client delivery.',
      evidenceDocIds: [],
    },
  ],
  assumptions: [
    'Client will grant security credentials for staging environment within 5 business days of contract execution.',
    'Target cloud platform is AWS.',
  ],
  risks: [
    'Custom legacy database stored procedures may require manual refactoring.',
  ],
  openQuestions: [
    'Can client provide staging access for initial load testing by Week 4?',
  ],
  nextSteps: [
    'Executive sign-off in DealFlow AI Approval Gateway.',
    'Schedule Technical Alignment Call with SME Marcus Webb.',
  ],
};

const MOCK_FOLLOWUP_RESULT = {
  tasks: [
    {
      id: 'task-1',
      title: 'Request Legacy Database Schema & Throughput Metrics',
      description: 'Contact client VP of Engineering to obtain exact RPS load profiles and database engine details.',
      assignee: 'Human' as const,
      priority: 'High' as const,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Pending' as const,
    },
    {
      id: 'task-2',
      title: 'Schedule Architecture Alignment Call with SME',
      description: 'Coordinate a 45-minute technical deep-dive with Marcus Webb (Lead Cloud Architect).',
      assignee: 'AI' as const,
      priority: 'Medium' as const,
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Pending' as const,
    },
    {
      id: 'task-3',
      title: 'Review Proposal Draft in Approval Gateway',
      description: 'Executive sign-off required prior to client transmission.',
      assignee: 'Human' as const,
      priority: 'High' as const,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Pending' as const,
    },
  ],
};

// --- Agent Gateways ---

export const geminiGateway = {
  runIntakeAgent: async (data: { inquiry: string; budget?: string; timeline?: string; objective?: string; challenges?: string }) => {
    const prompt = INTAKE_AGENT_PROMPT.buildPrompt(data);
    const liveResult = await callGeminiStructured<typeof MOCK_INTAKE_RESULT>(
      INTAKE_AGENT_PROMPT.systemInstruction,
      prompt,
      INTAKE_RESPONSE_SCHEMA
    );

    if (liveResult) {
      return { result: liveResult, isLive: true };
    }

    return { result: MOCK_INTAKE_RESULT, isLive: false };
  },

  runQualificationAgent: async (intakeResult: any) => {
    const prompt = QUALIFICATION_AGENT_PROMPT.buildPrompt(intakeResult);
    const liveResult = await callGeminiStructured<typeof MOCK_QUALIFICATION_RESULT>(
      QUALIFICATION_AGENT_PROMPT.systemInstruction,
      prompt,
      QUALIFICATION_RESPONSE_SCHEMA
    );

    if (liveResult) {
      return { result: liveResult, isLive: true };
    }

    return { result: MOCK_QUALIFICATION_RESULT, isLive: false };
  },

  runCapabilityMatchingAgent: async (requirements: any[], retrievedDocs: any[]) => {
    const prompt = CAPABILITY_MATCHING_PROMPT.buildPrompt(requirements, retrievedDocs);
    const liveResult = await callGeminiStructured<typeof MOCK_CAPABILITY_RESULT>(
      CAPABILITY_MATCHING_PROMPT.systemInstruction,
      prompt,
      CAPABILITY_MATCH_RESPONSE_SCHEMA
    );

    if (liveResult) {
      return { result: liveResult, isLive: true };
    }

    return { result: MOCK_CAPABILITY_RESULT, isLive: false };
  },

  runProposalAgent: async (data: { title: string; company: string; inquiry: string; intake: any; qualification: any; capabilities: any[]; docs: any[] }) => {
    const prompt = PROPOSAL_AGENT_PROMPT.buildPrompt(data);
    const liveResult = await callGeminiStructured<typeof MOCK_PROPOSAL_RESULT>(
      PROPOSAL_AGENT_PROMPT.systemInstruction,
      prompt,
      PROPOSAL_RESPONSE_SCHEMA
    );

    if (liveResult) {
      return { result: liveResult, isLive: true };
    }

    return { result: MOCK_PROPOSAL_RESULT, isLive: false };
  },

  runFollowUpPlannerAgent: async (oppData: any) => {
    const prompt = FOLLOWUP_PLANNER_PROMPT.buildPrompt(oppData);
    const liveResult = await callGeminiStructured<typeof MOCK_FOLLOWUP_RESULT>(
      FOLLOWUP_PLANNER_PROMPT.systemInstruction,
      prompt,
      FOLLOWUP_RESPONSE_SCHEMA
    );

    if (liveResult) {
      return { result: liveResult, isLive: true };
    }

    return { result: MOCK_FOLLOWUP_RESULT, isLive: false };
  },
};
