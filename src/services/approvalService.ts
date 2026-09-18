import { Opportunity } from '../types';
import { delay } from './agentService';

export const approvalService = {
  requestApproval: async (opportunityId: string): Promise<boolean> => {
    await delay(1000);
    return true; // Simply returns true to signify request sent
  },
  
  approveProposal: async (opportunityId: string): Promise<boolean> => {
    await delay(1500);
    return true;
  },
  
  rejectProposal: async (opportunityId: string, reason: string): Promise<boolean> => {
    await delay(1000);
    return true;
  }
};
