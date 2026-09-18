import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import { agentService } from '../services/agentService';
import { proposalService } from '../services/proposalService';
import { followUpService } from '../services/followUpService';
import { approvalService } from '../services/approvalService';
import { Play, CheckCircle2, Clock, AlertTriangle, FileText, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { WorkflowStatus, AgentType } from '../types';

export default function OpportunityWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { opportunities, updateOpportunity, addActivity } = useStore();
  const [activeTab, setActiveTab] = useState('overview');
  
  const opp = opportunities.find(o => o.id === id);
  const [isRunning, setIsRunning] = useState(false);

  if (!opp) {
    return <div className="p-8 text-white">Opportunity not found.</div>;
  }

  const runWorkflow = async () => {
    setIsRunning(true);
    
    // Helper to update agent status
    const setStatus = (agent: AgentType, status: WorkflowStatus, logs: string[] = []) => {
      updateOpportunity(opp.id, {
        agentStates: {
          ...opp.agentStates,
          [agent]: { ...opp.agentStates[agent], status, logs }
        }
      });
    };

    try {
      // 1. Intake Agent
      setStatus('Intake', 'Running', ['Analyzing unstructured inquiry...']);
      const analysis = await agentService.runIntakeAnalysis(opp.inquiry);
      
      updateOpportunity(opp.id, {
        requirements: analysis.requirements,
        missingInformation: analysis.missing,
        risks: analysis.risks
      });
      setStatus('Intake', 'Completed', ['Requirements extracted successfully.']);
      addActivity({
        id: `act-${Date.now()}`, agentName: 'Intake Agent', action: 'Extracted requirements and identified risks.', dealName: opp.title, timestamp: 'Just now', type: 'intake', status: 'completed'
      });

      // 2. Qualification & Matching
      setStatus('Capability Matching', 'Running', ['Matching requirements to internal capabilities...']);
      const capabilities = await agentService.runCapabilityMatching(analysis.requirements);
      
      updateOpportunity(opp.id, {
        capabilities,
        stage: 'Qualified'
      });
      setStatus('Capability Matching', 'Completed', ['Capabilities matched with high affinity.']);
      addActivity({
        id: `act-${Date.now()}`, agentName: 'Capability Matcher', action: 'Matched internal SMEs and solutions.', dealName: opp.title, timestamp: 'Just now', type: 'match', status: 'completed'
      });

      // 3. Proposal Draft
      setStatus('Proposal', 'Running', ['Generating executive summary and drafting sections...']);
      const proposal = await proposalService.generateDraft(opp.title, opp.company);
      
      updateOpportunity(opp.id, {
        proposal,
        stage: 'Drafting'
      });
      setStatus('Proposal', 'Completed', ['Draft generated. Ready for human review.']);
      addActivity({
        id: `act-${Date.now()}`, agentName: 'Proposal Agent', action: 'Generated proposal draft requiring approval.', dealName: opp.title, timestamp: 'Just now', type: 'proposal', status: 'pending_approval'
      });

      // 4. Follow Up Tasks
      setStatus('Follow-up Planner', 'Running', ['Planning next steps...']);
      const followUps = await followUpService.generateTasks(opp.id);
      
      updateOpportunity(opp.id, {
        followUps
      });
      setStatus('Follow-up Planner', 'Completed', ['Next steps planned.']);
      
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunning(false);
    }
  };

  const handleApprove = async () => {
    if (opp.proposal) {
      await approvalService.approveProposal(opp.id);
      updateOpportunity(opp.id, {
        stage: 'Approved',
        proposal: { ...opp.proposal, status: 'Approved' }
      });
      addActivity({
        id: `act-${Date.now()}`, agentName: 'Human Gateway', action: 'Proposal Approved.', dealName: opp.title, timestamp: 'Just now', type: 'proposal', status: 'completed'
      });
    }
  };

  const StatusIcon = ({ status }: { status: WorkflowStatus }) => {
    if (status === 'Completed') return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    if (status === 'Running') return <Clock className="w-4 h-4 text-blue-400 animate-pulse" />;
    if (status === 'Needs Review') return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    return <Clock className="w-4 h-4 text-white/20" />;
  };

  const tabs = ['overview', 'requirements', 'capabilities', 'proposal', 'follow-ups'];

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-display text-3xl text-white tracking-tight">{opp.title}</h1>
            <span className="bg-white/10 text-white/80 text-xs px-2 py-1 rounded-md border border-white/20">{opp.stage}</span>
          </div>
          <p className="text-muted-foreground text-sm">{opp.company} • {opp.industry} • {opp.value}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={runWorkflow}
            disabled={isRunning || opp.stage !== 'New'}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors"
          >
            {isRunning ? <Clock className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {isRunning ? 'Running Agents...' : 'Run Analysis Workflow'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar: Workflow Status */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-white font-medium text-sm mb-4 uppercase tracking-wider">Agent Workflow</h3>
          <div className="space-y-3">
            {Object.entries(opp.agentStates).map(([agent, state]) => (
              <div key={agent} className="glass-panel p-4 rounded-xl border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/90 font-medium">{agent}</span>
                  <StatusIcon status={state.status} />
                </div>
                {state.logs.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-2 font-mono">
                    {state.logs[state.logs.length - 1]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Custom Tabs */}
          <div className="flex space-x-2 border-b border-white/10 pb-2 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg capitalize transition-colors whitespace-nowrap ${activeTab === tab ? 'text-emerald-400 border-b-2 border-emerald-400 bg-white/5' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>

          <div className="min-h-[400px]">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="glass-panel p-6 rounded-2xl border border-white/10">
                  <h3 className="text-lg font-medium text-white mb-4">Original Inquiry</h3>
                  <p className="text-white/80 text-sm whitespace-pre-wrap font-mono bg-[#020a12] p-4 rounded-lg border border-white/5">
                    {opp.inquiry}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-panel p-6 rounded-2xl border border-white/10">
                    <span className="text-xs text-muted-foreground uppercase">Budget</span>
                    <p className="text-white mt-1">{opp.budget || 'Unspecified'}</p>
                  </div>
                  <div className="glass-panel p-6 rounded-2xl border border-white/10">
                    <span className="text-xs text-muted-foreground uppercase">Timeline</span>
                    <p className="text-white mt-1">{opp.timeline || 'Unspecified'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Requirements Tab */}
            {activeTab === 'requirements' && (
              <div className="space-y-6">
                {!opp.requirements && <div className="text-muted-foreground">Workflow has not extracted requirements yet.</div>}
                
                {opp.requirements && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Extracted Requirements</h3>
                    {opp.requirements.map(req => (
                      <div key={req.id} className="glass-panel p-4 rounded-xl border border-white/10 flex items-start gap-4">
                        <div className={`px-2 py-1 text-[10px] uppercase font-bold rounded ${
                          req.criticality === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {req.criticality}
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground uppercase mb-1">{req.category}</div>
                          <div className="text-sm text-white">{req.description}</div>
                        </div>
                      </div>
                    ))}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="glass-panel p-4 rounded-xl border border-white/10 bg-amber-500/5">
                        <h4 className="text-amber-400 text-sm font-medium flex items-center gap-2 mb-3"><AlertTriangle className="w-4 h-4"/> Missing Information</h4>
                        <ul className="list-disc pl-5 text-sm text-white/80 space-y-1">
                          {opp.missingInformation?.map((m, i) => <li key={i}>{m}</li>)}
                        </ul>
                      </div>
                      <div className="glass-panel p-4 rounded-xl border border-white/10 bg-red-500/5">
                        <h4 className="text-red-400 text-sm font-medium flex items-center gap-2 mb-3"><ShieldCheck className="w-4 h-4"/> Identified Risks</h4>
                        <ul className="list-disc pl-5 text-sm text-white/80 space-y-1">
                          {opp.risks?.map((r, i) => <li key={i}>{r}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Capabilities Tab */}
            {activeTab === 'capabilities' && (
              <div className="space-y-6">
                {!opp.capabilities && <div className="text-muted-foreground">Workflow has not matched capabilities yet.</div>}
                
                {opp.capabilities?.map(cap => (
                  <div key={cap.id} className="glass-panel p-6 rounded-2xl border border-white/10">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl text-white font-medium">{cap.name}</h3>
                      <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded font-mono">
                        {cap.relevanceScore}% Match
                      </span>
                    </div>
                    <p className="text-sm text-white/70 mb-4">{cap.description}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs text-muted-foreground uppercase">Evidence</span>
                        <ul className="list-disc pl-5 mt-1 text-sm text-white/90">
                          {cap.evidence.map((ev, i) => <li key={i}>{ev}</li>)}
                        </ul>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground uppercase">SMEs</span>
                        <div className="flex gap-2 mt-1">
                          {cap.experts.map(exp => (
                            <span key={exp} className="text-xs bg-white/5 border border-white/10 rounded px-2 py-1 text-white/80">{exp}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Proposal Tab */}
            {activeTab === 'proposal' && (
              <div className="space-y-6">
                {!opp.proposal && <div className="text-muted-foreground">Proposal draft has not been generated.</div>}
                
                {opp.proposal && (
                  <div className="glass-panel p-0 rounded-2xl border border-white/10 overflow-hidden">
                    <div className="bg-[#041424] p-4 border-b border-white/10 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-400" />
                        <span className="font-medium text-white">AI Generated Draft</span>
                        <span className="text-[10px] uppercase bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30">
                          {opp.proposal.status === 'Approved' ? 'Approved' : 'Requires Review'}
                        </span>
                      </div>
                      {opp.proposal.status !== 'Approved' && (
                        <button onClick={handleApprove} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded flex items-center gap-1 transition-colors">
                          <Check className="w-3.5 h-3.5" /> Approve Proposal
                        </button>
                      )}
                    </div>
                    <div className="p-8 space-y-8 bg-white text-gray-900">
                      {opp.proposal.sections.map(sec => (
                        <div key={sec.id}>
                          <h4 className="text-lg font-bold text-gray-900 mb-2">{sec.title}</h4>
                          <p className="text-sm text-gray-700 leading-relaxed">{sec.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Follow-ups Tab */}
            {activeTab === 'follow-ups' && (
              <div className="space-y-4">
                {!opp.followUps && <div className="text-muted-foreground">Follow-up planner has not run yet.</div>}
                
                {opp.followUps?.map(task => (
                  <div key={task.id} className="glass-panel p-4 rounded-xl border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white font-medium text-sm">{task.title}</h4>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${task.assignee === 'AI' ? 'border-purple-500/30 text-purple-400 bg-purple-500/10' : 'border-blue-500/30 text-blue-400 bg-blue-500/10'}`}>
                          {task.assignee}
                        </span>
                      </div>
                      <p className="text-xs text-white/60">{task.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">{new Date(task.dueDate).toLocaleDateString()}</div>
                      <div className="text-xs text-emerald-400 mt-1">{task.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
