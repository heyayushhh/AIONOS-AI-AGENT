import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, LayoutDashboard, FileText, CheckSquare, Activity, Settings, Database, Plus } from 'lucide-react';
import { useStore } from '../lib/store';

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { activities } = useStore();
  
  const pendingApprovals = activities.filter(a => a.status === 'pending_approval').length;

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'New Opportunity', href: '/opportunities/new', icon: Plus },
    { label: 'Knowledge Base', href: '/knowledge', icon: Database },
    { label: 'Approvals', href: '/approvals', icon: CheckSquare, badge: pendingApprovals },
    { label: 'Activity Log', href: '/activity', icon: Activity },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#03111e] text-foreground relative overflow-hidden font-body selection:bg-white/20 flex flex-col md:flex-row">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/20 via-[#03111e] to-[#03111e] pointer-events-none z-0" />

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 border-r border-white/10 bg-[#041424]/80 backdrop-blur-md relative z-10 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Database className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-display text-xl text-white tracking-tight">DealFlow AI</span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase tracking-wider">Demo</span>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.href)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${isActive ? 'bg-white/10 text-white font-medium' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
                {item.badge ? (
                  <span className="ml-auto bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-white/10">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors w-full px-3 py-2 rounded-lg hover:bg-white/5">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Landing Page</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden border-b border-white/10 bg-[#041424]/80 backdrop-blur-md p-4 relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <Database className="w-5 h-5 text-emerald-400" />
           <span className="font-display text-lg text-white">DealFlow AI</span>
           <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase tracking-wider">Demo</span>
        </div>
        <button onClick={() => navigate('/')} className="text-xs text-white/50">Back</button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 overflow-y-auto h-[calc(100vh-65px)] md:h-screen pb-16 md:pb-0">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#041424]/95 backdrop-blur-md border-t border-white/10 z-50 flex items-center justify-around p-2 pb-safe">
        {navItems.slice(0, 5).map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.href)}
              className={`p-2 rounded-lg flex flex-col items-center gap-1 transition-colors relative ${isActive ? 'text-emerald-400' : 'text-white/50'}`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium truncate w-12 text-center">{item.label.split(' ')[0]}</span>
              {item.badge ? (
                <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-emerald-500"></span>
              ) : null}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
