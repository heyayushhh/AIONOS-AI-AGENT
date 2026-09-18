import { FollowUpTask } from '../types';
import { delay } from './agentService';

export const followUpService = {
  generateTasks: async (opportunityId: string): Promise<FollowUpTask[]> => {
    await delay(1000);
    return [
      {
        id: `task-${Date.now()}-1`,
        title: 'Schedule Technical Deep Dive',
        description: 'Set up a meeting with the lead architect to discuss ERP integration.',
        assignee: 'Human',
        dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), // +2 days
        status: 'Pending'
      },
      {
        id: `task-${Date.now()}-2`,
        title: 'Draft Security Addendum',
        description: 'Auto-generate standard SOC2 and GDPR compliance artifacts for the client.',
        assignee: 'AI',
        dueDate: new Date(Date.now() + 86400000 * 1).toISOString(),
        status: 'Pending'
      }
    ];
  }
};
