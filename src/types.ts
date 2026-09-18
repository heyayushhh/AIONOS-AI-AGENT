export type WorkflowStatus = 'Not Started' | 'Running' | 'Completed' | 'Needs Review' | 'Blocked';
export type AgentType = 'Intake' | 'Qualification' | 'Capability Matching' | 'Proposal' | 'Follow-up Planner';

export interface AgentActivity {
  id: string;
  agentName: string;
  action: string;
  dealName: string;
  timestamp: string;
  type: 'qualification' | 'proposal' | 'match' | 'followup' | 'intake';
  status: 'completed' | 'in_progress' | 'pending_approval' | 'blocked';
}

export interface OpportunityAgentState {
  type: AgentType;
  status: WorkflowStatus;
  startedAt?: string;
  completedAt?: string;
  logs: string[];
}

export interface Requirement {
  id: string;
  category: 'Technical' | 'Business' | 'Compliance' | 'Other';
  description: string;
  criticality: 'High' | 'Medium' | 'Low';
}

export interface CapabilityMatch {
  id: string;
  name: string;
  description: string;
  relevanceScore: number;
  evidence: string[];
  experts: string[];
}

export interface ProposalSection {
  id: string;
  title: string;
  content: string;
}

export interface ProposalDraft {
  id: string;
  sections: ProposalSection[];
  status: 'Draft' | 'Needs Review' | 'Approved' | 'Rejected';
  createdAt: string;
  updatedAt: string;
}

export interface FollowUpTask {
  id: string;
  title: string;
  description: string;
  assignee: 'Human' | 'AI';
  dueDate: string;
  status: 'Pending' | 'Completed';
}

export interface Opportunity {
  id: string;
  title: string; // Formerly name
  company: string; // Formerly partner
  industry: string;
  value: string;
  stage: 'New' | 'Qualified' | 'Drafting' | 'Review' | 'Approved' | 'Closed' | 'Nurture';
  confidenceScore: number;
  
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
  capabilities?: CapabilityMatch[];
  proposal?: ProposalDraft;
  followUps?: FollowUpTask[];
}

export interface KnowledgeDoc {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  tags: string[];
}

export interface NavItem {
  label: string;
  href: string;
}
