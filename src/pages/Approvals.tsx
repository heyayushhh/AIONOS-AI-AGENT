import React from 'react';
import { useStore } from '../lib/store';
import { CheckSquare, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Approvals() {
  const { opportunities } = useStore();
  const navigate = useNavigate();

  // Find opportunities that are in 'Drafting' or have a proposal that needs review
  const pendingOpps = opportunities.filter(o => o.proposal && o.proposal.status !== 'Approved');

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-8 py-8 space-y-6">
      <div className="pb-4 border-b border-white/10">
        <h1 className="font-display text-3xl text-white tracking-tight flex items-center gap-2">
          <CheckSquare className="w-8 h-8 text-amber-400" />
          Pending Approvals
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Review and approve AI-generated proposal drafts before they are dispatched.
        </p>
      </div>

      <div className="space-y-4">
        {pendingOpps.length === 0 ? (
          <div className="text-center py-12 glass-panel rounded-2xl border border-white/10">
            <CheckSquare className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-lg text-white font-medium">All caught up</h3>
            <p className="text-sm text-muted-foreground mt-1">There are no pending approvals at this time.</p>
          </div>
        ) : (
          pendingOpps.map(opp => (
            <div key={opp.id} className="glass-panel p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg text-white font-medium">{opp.title}</h3>
                <p className="text-sm text-white/60">{opp.company} • Draft generated {new Date(opp.proposal!.createdAt).toLocaleDateString()}</p>
              </div>
              <button 
                onClick={() => navigate(`/opportunities/${opp.id}`)}
                className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-sm font-medium rounded-lg border border-amber-500/30 transition-colors flex items-center gap-2"
              >
                Review Draft <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
