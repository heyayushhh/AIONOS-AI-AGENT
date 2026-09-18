import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Opportunity, AgentActivity } from '../types';

interface StoreState {
  opportunities: Opportunity[];
  activities: AgentActivity[];
  addOpportunity: (opp: Opportunity) => void;
  updateOpportunity: (id: string, updates: Partial<Opportunity>) => void;
  addActivity: (activity: AgentActivity) => void;
  clearState: () => void;
}

const StoreContext = createContext<StoreState | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    const saved = localStorage.getItem('dealflow_opportunities');
    return saved ? JSON.parse(saved) : [];
  });

  const [activities, setActivities] = useState<AgentActivity[]>(() => {
    const saved = localStorage.getItem('dealflow_activities');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('dealflow_opportunities', JSON.stringify(opportunities));
  }, [opportunities]);

  useEffect(() => {
    localStorage.setItem('dealflow_activities', JSON.stringify(activities));
  }, [activities]);

  const addOpportunity = (opp: Opportunity) => {
    setOpportunities(prev => [opp, ...prev]);
  };

  const updateOpportunity = (id: string, updates: Partial<Opportunity>) => {
    setOpportunities(prev => 
      prev.map(opp => opp.id === id ? { ...opp, ...updates, updatedAt: new Date().toISOString() } : opp)
    );
  };

  const addActivity = (activity: AgentActivity) => {
    setActivities(prev => [activity, ...prev]);
  };

  const clearState = () => {
    setOpportunities([]);
    setActivities([]);
    localStorage.removeItem('dealflow_opportunities');
    localStorage.removeItem('dealflow_activities');
  };

  return (
    <StoreContext.Provider value={{ opportunities, activities, addOpportunity, updateOpportunity, addActivity, clearState }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
