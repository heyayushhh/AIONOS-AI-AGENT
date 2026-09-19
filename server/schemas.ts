import { Type, Schema } from '@google/genai';

// 1. Intake Agent Schema
export const INTAKE_RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING, description: 'Executive summary of the business inquiry' },
    objective: { type: Type.STRING, description: 'Primary business or technical goal' },
    industry: { type: Type.STRING, description: 'Client industry sector' },
    requirements: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          category: { type: Type.STRING, enum: ['Technical', 'Business', 'Compliance', 'Other'] },
          description: { type: Type.STRING },
          criticality: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
        },
        required: ['id', 'category', 'description', 'criticality'],
      },
    },
    budget: { type: Type.STRING, description: 'Extracted budget details or note if missing' },
    timeline: { type: Type.STRING, description: 'Extracted timeline details or note if missing' },
    missingInformation: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Vague assertions or unspecified parameters',
    },
    risks: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Technical, compliance, or timeline risks',
    },
  },
  required: ['summary', 'objective', 'industry', 'requirements', 'budget', 'timeline', 'missingInformation', 'risks'],
};

// 2. Qualification Agent Schema
export const QUALIFICATION_RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    classification: { type: Type.STRING, enum: ['Qualified', 'Unqualified', 'Nurture'] },
    estimatedScore: { type: Type.NUMBER, description: 'Numerical score 0-100' },
    scoreLabelNote: { type: Type.STRING, description: 'Must specify that score is a demo-generated estimate' },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    risks: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    missingInformation: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    qualificationSummary: { type: Type.STRING },
    followUpQuestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: ['classification', 'estimatedScore', 'scoreLabelNote', 'strengths', 'risks', 'missingInformation', 'qualificationSummary', 'followUpQuestions'],
};

// 3. Capability Matcher Schema
export const CAPABILITY_MATCH_RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    matches: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          relevanceScore: { type: Type.NUMBER },
          relevanceExplanation: { type: Type.STRING },
          evidence: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          evidenceDocIds: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Specific source document IDs from retrieved context',
          },
          experts: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          unsupportedAssumptions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ['id', 'name', 'description', 'relevanceScore', 'relevanceExplanation', 'evidence', 'evidenceDocIds', 'experts', 'unsupportedAssumptions'],
      },
    },
  },
  required: ['matches'],
};

// 4. Proposal Agent Schema
export const PROPOSAL_RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    title: { type: Type.STRING },
    executiveSummary: { type: Type.STRING },
    sections: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          content: { type: Type.STRING },
          evidenceDocIds: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ['id', 'title', 'content', 'evidenceDocIds'],
      },
    },
    assumptions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    risks: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    openQuestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    nextSteps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: ['id', 'title', 'executiveSummary', 'sections', 'assumptions', 'risks', 'openQuestions', 'nextSteps'],
};

// 5. Follow-up Planner Schema
export const FOLLOWUP_RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    tasks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          assignee: { type: Type.STRING, enum: ['Human', 'AI'] },
          priority: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
          dueDate: { type: Type.STRING },
          status: { type: Type.STRING, enum: ['Pending', 'Completed'] },
        },
        required: ['id', 'title', 'description', 'assignee', 'priority', 'dueDate', 'status'],
      },
    },
  },
  required: ['tasks'],
};
