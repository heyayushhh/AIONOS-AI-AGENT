# Database Design & Schema Specification

Currently, DealFlow AI persists prototype state in `localStorage` (`src/lib/store.tsx`). For future production deployment, the relational PostgreSQL schema is specified below.

```sql
-- Opportunities Table
CREATE TABLE opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    value VARCHAR(50),
    stage VARCHAR(50) NOT NULL DEFAULT 'New',
    confidence_score INT DEFAULT 0,
    mode VARCHAR(20) DEFAULT 'demo',
    inquiry TEXT NOT NULL,
    budget VARCHAR(255),
    timeline VARCHAR(255),
    objective TEXT,
    challenges TEXT,
    contact_role VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Agent Workflow States
CREATE TABLE agent_states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
    agent_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    logs JSONB DEFAULT '[]'::jsonb,
    error TEXT
);

-- Extracted Requirements
CREATE TABLE requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    criticality VARCHAR(20) NOT NULL
);

-- Proposal Drafts
CREATE TABLE proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    executive_summary TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'Needs Review',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Proposal Sections
CREATE TABLE proposal_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    evidence_doc_ids JSONB DEFAULT '[]'::jsonb
);

-- Follow-up Tasks
CREATE TABLE follow_up_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assignee VARCHAR(20) NOT NULL CHECK (assignee IN ('Human', 'AI')),
    priority VARCHAR(20) DEFAULT 'Medium',
    due_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'Pending'
);
```
