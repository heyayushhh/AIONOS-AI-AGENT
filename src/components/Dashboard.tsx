import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Send, 
  Sparkles, 
  Search, 
  Bot, 
  Check, 
  X,
  Building,
  RefreshCw,
  Eye,
  Plus
} from 'lucide-react';
import { useStore } from '../lib/store';

export default function Dashboard() {
  const navigate = useNavigate();
  const { opportunities, activities } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('All');

  // Calculate Metrics based on local state
  const totalValue = opportunities.reduce((acc, opp) => {
    const val = parseInt(opp.value.replace(/[^0-9]/g, ''), 10);
    return acc + (isNaN(val) ? 0 : val);
  }, 0);
  
  const activeOpportunities = opportunities.filter(o => o.stage !== 'Closed').length;
  const qualifiedOpportunities = opportunities.filter(o => o.stage === 'Qualified' || o.stage === 'Drafting' || o.stage === 'Review' || o.stage === 'Approved').length;
  const pendingApprovals = activities.filter(a => a.status === 'pending_approval').length;
  const followUps = activities.filter(a => a.type === 'followup' && a.status === 'pending_approval').length; // using pending_approval as active followup for simplicity

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch = 
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = selectedStage === 'All' || opp.stage === selectedStage;
    return matchesSearch && matchesStage;
  });

  // Format currency roughly
  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`;
    return `$${val}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 space-y-8">
      {/* Workspace Title & Quick Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl text-white font-normal tracking-tight">
            Sales & Alliances Intelligence Hub
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Active opportunity pipeline, autonomous agent operations, and pending executive approvals.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/opportunities/new')}
            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Opportunity</span>
          </button>
        </div>
      </div>

      {/* 4 Core Metrics Required in Prompt */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden border border-white/10">
          <div className="flex items-center justify-between text-muted-foreground text-xs uppercase tracking-wider mb-2">
            <span>Total Value</span>
            <Building className="w-4 h-4 text-white/40" />
          </div>
          <div className="font-display text-3xl sm:text-4xl text-white font-normal">
            {totalValue > 0 ? formatCurrency(totalValue) : '$0'}
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{activeOpportunities} active deals</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden border border-white/10">
          <div className="flex items-center justify-between text-muted-foreground text-xs uppercase tracking-wider mb-2">
            <span>Qualified Leads</span>
            <CheckCircle2 className="w-4 h-4 text-white/40" />
          </div>
          <div className="font-display text-3xl sm:text-4xl text-white font-normal">
            {qualifiedOpportunities} Deals
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Ready for drafting</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden border border-white/10 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => navigate('/approvals')}>
          <div className="flex items-center justify-between text-muted-foreground text-xs uppercase tracking-wider mb-2">
            <span>Pending Approvals</span>
            <Clock className="w-4 h-4 text-amber-400/80" />
          </div>
          <div className="font-display text-3xl sm:text-4xl text-white font-normal">
            {pendingApprovals} Drafts
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-amber-300">
            <span>Requires executive review</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden border border-white/10">
          <div className="flex items-center justify-between text-muted-foreground text-xs uppercase tracking-wider mb-2">
            <span>Active Follow-ups</span>
            <Send className="w-4 h-4 text-white/40" />
          </div>
          <div className="font-display text-3xl sm:text-4xl text-white font-normal">
            {followUps} Tasks
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Bot className="w-3.5 h-3.5 text-white/60" />
            <span>Autonomous nurture</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Opportunities */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-white/10 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h2 className="font-display text-2xl text-white font-normal">Recent Opportunities</h2>
                <p className="text-xs text-muted-foreground">Qualified enterprise transactions</p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search deals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="pb-3 px-4 font-medium">Deal Name & Partner</th>
                    <th className="pb-3 px-4 font-medium">Value</th>
                    <th className="pb-3 px-4 font-medium">Stage</th>
                    <th className="pb-3 px-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredOpportunities.length > 0 ? (
                    filteredOpportunities.map((opp) => (
                      <tr key={opp.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                        <td className="py-4 px-4">
                          <div className="font-medium text-white">{opp.title}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{opp.company}</div>
                        </td>
                        <td className="py-4 px-4 font-mono text-white/90">
                          {opp.value || 'N/A'}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              opp.stage === 'Approved' ? 'bg-emerald-400' :
                              opp.stage === 'Review' ? 'bg-amber-400' :
                              opp.stage === 'New' ? 'bg-blue-400' : 'bg-white/40'
                            }`} />
                            <span className="text-white/80 text-xs">{opp.stage}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button 
                            onClick={() => navigate(`/opportunities/${opp.id}`)}
                            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs rounded-md border border-white/10 transition-colors inline-flex items-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View Workspace
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-muted-foreground text-sm">
                        No opportunities found. Create one to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Agent Activity Feed */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col h-full">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <div>
              <h3 className="font-display text-xl text-white font-normal">Agent Activity</h3>
              <p className="text-xs text-muted-foreground">Live autonomous operations</p>
            </div>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div key={activity.id} className="relative pl-4 border-l border-white/10 group">
                  <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-[#041424] border-2 border-white/20 group-hover:border-emerald-500 transition-colors" />
                  <div className="text-xs text-muted-foreground mb-1">{activity.timestamp} • {activity.agentName}</div>
                  <div className="text-sm text-white/90 leading-snug">
                    {activity.action}
                  </div>
                  <div className="text-xs font-mono text-emerald-400 mt-1 opacity-60">
                    Deal: {activity.dealName}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No recent activity. Agents are standing by.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
