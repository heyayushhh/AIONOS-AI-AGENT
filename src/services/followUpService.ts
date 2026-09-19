import { FollowUpTask } from '../types';
import { apiClient } from './apiClient';

export const followUpService = {
  generateTasks: async (opportunityData: any): Promise<{ tasks: FollowUpTask[]; isLive: boolean }> => {
    try {
      const res = await apiClient.postFollowUps(opportunityData);
      const tasks: FollowUpTask[] = (res.data?.tasks || []).map((t: any) => ({
        id: t.id || `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        title: t.title || 'Follow-up Task',
        description: t.description || '',
        assignee: t.assignee === 'AI' ? 'AI' : 'Human',
        priority: t.priority || 'Medium',
        dueDate: t.dueDate || new Date(Date.now() + 86400000 * 3).toISOString(),
        status: 'Pending',
      }));
      return { tasks, isLive: res.isLive || false };
    } catch (err) {
      console.warn('[followUpService] Follow-up API error, using local fallback:', err);
      return {
        tasks: [
          {
            id: `task-${Date.now()}-1`,
            title: 'Request Legacy Database Schema & Load Metrics',
            description: 'Obtain exact RPS profiles and database engine details from client VP of Engineering.',
            assignee: 'Human',
            priority: 'High',
            dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
            status: 'Pending',
          },
          {
            id: `task-${Date.now()}-2`,
            title: 'Schedule Architecture Alignment Call with SME',
            description: 'Coordinate a 45-minute technical deep-dive with Marcus Webb (Lead Architect).',
            assignee: 'AI',
            priority: 'Medium',
            dueDate: new Date(Date.now() + 86400000 * 4).toISOString(),
            status: 'Pending',
          },
          {
            id: `task-${Date.now()}-3`,
            title: 'Review Proposal Draft in Approval Gateway',
            description: 'Executive sign-off required prior to client delivery.',
            assignee: 'Human',
            priority: 'High',
            dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
            status: 'Pending',
          }
        ],
        isLive: false,
      };
    }
  }
};
