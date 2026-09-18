import React from 'react';
import { useStore } from '../lib/store';
import { Activity as ActivityIcon } from 'lucide-react';

export default function Activity() {
  const { activities } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-8 py-8 space-y-6">
      <div className="pb-4 border-b border-white/10">
        <h1 className="font-display text-3xl text-white tracking-tight flex items-center gap-2">
          <ActivityIcon className="w-8 h-8 text-blue-400" />
          Global Agent Activity
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Real-time log of all autonomous agent operations across the platform.
        </p>
      </div>

      <div className="glass-panel rounded-2xl p-6 border border-white/10">
        <div className="space-y-6">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="relative pl-6 border-l-2 border-white/10 group">
                <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 border-[#041424] transition-colors ${
                  activity.status === 'completed' ? 'bg-emerald-500' :
                  activity.status === 'pending_approval' ? 'bg-amber-500' : 'bg-blue-500'
                }`} />
                <div className="text-sm text-muted-foreground mb-1">
                  <span className="text-white font-medium">{activity.agentName}</span> • {activity.timestamp}
                </div>
                <div className="text-base text-white/90 leading-relaxed mb-1">
                  {activity.action}
                </div>
                <div className="text-xs font-mono text-emerald-400/80 bg-emerald-500/10 inline-block px-2 py-0.5 rounded">
                  Opportunity: {activity.dealName}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No recent activity. Agents are standing by.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
