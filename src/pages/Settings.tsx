import React from 'react';
import { useStore } from '../lib/store';
import { Settings as SettingsIcon, Trash2 } from 'lucide-react';
import { opportunityService } from '../services/opportunityService';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { clearState, addOpportunity } = useStore();
  const navigate = useNavigate();

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data? This will clear all opportunities and agent logs.')) {
      clearState();
      // Add initial demo opportunity back
      const initialOpps = opportunityService.getInitialDemoOpportunities();
      initialOpps.forEach(opp => addOpportunity(opp));
      alert('Data reset successfully.');
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-8 py-8 space-y-6">
      <div className="pb-4 border-b border-white/10">
        <h1 className="font-display text-3xl text-white tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-8 h-8 text-white/60" />
          Platform Settings
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Demo mode configuration and state management.
        </p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-white/10">
        <h3 className="text-lg text-white font-medium mb-4">Data Management</h3>
        <p className="text-sm text-white/60 mb-6">
          This platform is currently running in Demo Mode using LocalStorage. You can clear the state to restart the demonstration.
        </p>
        
        <button 
          onClick={handleReset}
          className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-medium rounded-lg border border-red-500/20 transition-colors flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" /> Reset Demo Data
        </button>
      </div>
    </div>
  );
}
