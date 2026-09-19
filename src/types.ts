export type WorkflowStatus = 'Not Started' | 'Queued' | 'Running' | 'Completed' | 'Failed' | 'Needs Review' | 'Blocked';
export type AgentType = 'Intake' | 'Qualification' | 'Capability Matching' | 'Proposal' | 'Follow-up Planner';

export interface AgentActivity {
  id: string;
  agentName: string;
  action: string;
  dealName: string;
  timestamp: string;
  type: 'qualification' | 'proposal' | 'match' | 'followup' | 'intake';
  status: 'completed' | 'in_progress' | 'pending_approval' | 'blocked' | 'failed';
}

export interface OpportunityAgentState {
  type: AgentType;
  status: WorkflowStatus;
  startedAt?: string;
  completedAt?: string;
  logs: string[];
  error?: string;
}

export interface Requirement {
  id: string;
  category: 'Technical' | 'Business' | 'Compliance' | 'Other';
  description: string;
  criticality: 'High' | 'Medium' | 'Low';
}

export interface QualificationResult {
  classification: 'Qualified' | 'Unqualified' | 'Nurture';
  estimatedScore: number;
  scoreLabelNote: string; // e.g. "Demo-generated estimate based on initial inquiry parameters"
  strengths: string[];
  risks: string[];
  missingInformation: string[];
  qualificationSummary: string;
  followUpQuestions: string[];
}

export interface CapabilityMatch {
  id: string;
  name: string;
  description: string;
  relevanceScore: number;
  relevanceExplanation?: string;
  evidence: string[];
  evidenceDocIds?: string[];
  experts: string[];
  unsupportedAssumptions?: string[];
}

export interface ProposalSection {
  id: string;
  title: string;
  content: string;
  evidenceDocIds?: string[];
}

export interface ProposalDraft {
  id: string;
  title: string;
  executiveSummary: string;
  sections: ProposalSection[];
  assumptions: string[];
  risks: string[];
  openQuestions: string[];
  nextSteps: string[];
  status: 'Draft' | 'Needs Review' | 'Approved' | 'Rejected';
  createdAt: string;
  updatedAt: string;
}

export interface FollowUpTask {
  id: string;
  title: string;
  description: string;
  assignee: 'Human' | 'AI';
  priority?: 'High' | 'Medium' | 'Low';
  dueDate: string;
  status: 'Pending' | 'Completed';
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  industry: string;
  value: string;
  stage: 'New' | 'Qualified' | 'Drafting' | 'Review' | 'Approved' | 'Closed' | 'Nurture';
  confidenceScore: number;
  
  // Mode used for workflow execution
  mode?: 'live' | 'demo';

  // Intake specific
  inquiry: string;
  budget: string;
  timeline: string;
  objective: string;
  challenges: string;
  contactRole: string;

  createdAt: string;
  updatedAt: string;

  // Workflow Data
  agentStates: Record<AgentType, OpportunityAgentState>;
  requirements?: Requirement[];
  missingInformation?: string[];
  risks?: string[];
  qualification?: QualificationResult;
  capabilities?: CapabilityMatch[];
  proposal?: ProposalDraft;
  followUps?: FollowUpTask[];
  retrievedDocs?: Array<{ id: string; title: string; summary: string }>;
}

export interface KnowledgeDoc {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  tags: string[];
  experts?: string[];
}

export interface NavItem {
  label: string;
  href: string;
}

export interface ApiHealthResponse {
  status: string;
  mode: 'live' | 'demo';
  hasApiKey: boolean;
  model: string;
}
