import { ApiHealthResponse } from '../types';

export const apiClient = {
  getHealth: async (): Promise<ApiHealthResponse> => {
    try {
      const res = await fetch('/api/health');
      if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('[ApiClient] Failed to reach health endpoint. Defaulting to Demo Mode:', err);
      return {
        status: 'fallback',
        mode: 'demo',
        hasApiKey: false,
        model: 'gemini-2.5-flash (local fallback)',
      };
    }
  },

  postIntake: async (payload: { inquiry: string; budget?: string; timeline?: string; objective?: string; challenges?: string }) => {
    const res = await fetch('/api/ai/intake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Intake service error: ${res.statusText}`);
    return await res.json();
  },

  postQualification: async (intakeResult: any) => {
    const res = await fetch('/api/ai/qualification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ intakeResult }),
    });
    if (!res.ok) throw new Error(`Qualification service error: ${res.statusText}`);
    return await res.json();
  },

  postCapabilities: async (requirements: any[], query?: string) => {
    const res = await fetch('/api/ai/capabilities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requirements, query }),
    });
    if (!res.ok) throw new Error(`Capabilities service error: ${res.statusText}`);
    return await res.json();
  },

  postProposal: async (payload: { title: string; company: string; inquiry: string; intake: any; qualification: any; capabilities: any[] }) => {
    const res = await fetch('/api/ai/proposal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Proposal service error: ${res.statusText}`);
    return await res.json();
  },

  postFollowUps: async (opportunity: any) => {
    const res = await fetch('/api/ai/follow-ups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ opportunity }),
    });
    if (!res.ok) throw new Error(`Follow-up service error: ${res.statusText}`);
    return await res.json();
  },

  postWorkflow: async (payload: any) => {
    const res = await fetch('/api/ai/workflow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Workflow service error: ${res.statusText}`);
    return await res.json();
  },
};
