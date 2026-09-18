# Database Design

Future production database schema (PostgreSQL):

- **Opportunities**: `id`, `title`, `company`, `stage`, `value`, `raw_inquiry`, `created_at`
- **Requirements**: `id`, `opportunity_id`, `category`, `description`, `criticality`
- **Capabilities**: `id`, `name`, `description` (Used for mapping)
- **Opportunity_Capabilities**: `opportunity_id`, `capability_id`, `relevance_score`
- **Proposals**: `id`, `opportunity_id`, `status`, `created_at`
- **Proposal_Sections**: `id`, `proposal_id`, `title`, `content`
- **Agent_Logs**: `id`, `opportunity_id`, `agent_type`, `status`, `log_message`, `timestamp`
