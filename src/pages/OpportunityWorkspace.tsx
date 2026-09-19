import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import { agentService } from '../services/agentService';
import { proposalService } from '../services/proposalService';
import { followUpService } from '../services/followUpService';
import { approvalService } from '../services/approvalService';
import { Play, CheckCircle2, Clock, AlertTriangle, FileText, ShieldCheck, Check, RotateCcw, AlertCircle, Sparkles, ExternalLink, RefreshCw } from 'lucide-react';
import { WorkflowStatus, AgentType, OpportunityAgentState } from '../types';

export default function OpportunityWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { opportunities, updateOpportunity, addActivity } = useStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [isRunning, setIsRunning] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(-1);
  const [workflowError, setWorkflowError] = useState<string | null>(null);
  const [failedAgent, setFailedAgent] = useState<AgentType | null>(null);

  const opp = opportunities.find(o => o.id === id);

  if (!opp) {
    return <div className="p-8 text-white">Opportunity not found.</div>;
  }

  const agentOrder: AgentType[] = [
    'Intake',
    'Qualification',
    'Capability Matching',
    'Proposal',
    'Follow-up Planner',
  ];

  // Helper to initialize or reset states
  const initAgentStates = (): Record<AgentType, OpportunityAgentState> => ({
    'Intake': { type: 'Intake', status: 'Not Started', logs: [] },
    'Qualification': { type: 'Qualification', status: 'Not Started', logs: [] },
    'Capability Matching': { type: 'Capability Matching', status: 'Not Started', logs: [] },
    'Proposal': { type: 'Proposal', status: 'Not Started', logs: [] },
    'Follow-up Planner': { type: 'Follow-up Planner', status: 'Not Started', logs: [] },
  });

  const agentStates = opp.agentStates || initAgentStates();

  const setStatus = (agent: AgentType, status: WorkflowStatus, logs: string[] = [], error?: string) => {
    updateOpportunity(opp.id, {
      agentStates: {
        ...agentStates,
        [agent]: { ...agentStates[agent], status, logs, error }
      }
    });
  };

  const resetWorkflow = () => {
    setWorkflowError(null);
    setFailedAgent(null);
    setActiveStepIndex(-1);
    setIsRunning(false);
    updateOpportunity(opp.id, {
      stage: 'New',
      agentStates: initAgentStates(),
      requirements: undefined,
      missingInformation: undefined,
      risks: undefined,
      qualification: undefined,
      capabilities: undefined,
      proposal: undefined,
      followUps: undefined,
      retrievedDocs: undefined,
    });
  };

  const runWorkflow = async (startFromAgent?: AgentType) => {
    setIsRunning(true);
    setWorkflowError(null);
    setFailedAgent(null);

    let startIdx = 0;
    if (startFromAgent) {
      startIdx = agentOrder.indexOf(startFromAgent);
    }

    try {
      // 1. INTAKE AGENT
      if (startIdx <= 0) {
        setActiveStepIndex(0);
        setStatus('Intake', 'Running', ['Ingesting unstructured inquiry details...']);
        
        const intakeData = await agentService.runIntakeAnalysis({
          inquiry: opp.inquiry,
          budget: opp.budget,
          timeline: opp.timeline,
          objective: opp.objective,
          challenges: opp.challenges,
        });

        updateOpportunity(opp.id, {
          requirements: intakeData.requirements,
          missingInformation: intakeData.missing,
          risks: intakeData.risks,
          mode: intakeData.isLive ? 'live' : 'demo',
        });

        setStatus('Intake', 'Completed', [
          `Extracted ${intakeData.requirements.length} requirements.`,
          `Identified ${intakeData.missing.length} missing items & ${intakeData.risks.length} risks.`
        ]);
        addActivity({
          id: `act-${Date.now()}-intake`, agentName: 'Intake Agent', action: 'Extracted requirements, missing details, and risks.', dealName: opp.title, timestamp: 'Just now', type: 'intake', status: 'completed'
        });
      }

      // 2. QUALIFICATION AGENT
      if (startIdx <= 1) {
        setActiveStepIndex(1);
        setStatus('Qualification', 'Running', ['Scoring fit and evaluating strengths/risks...']);
        
        const currentOpp = opportunities.find(o => o.id === id) || opp;
        const qualData = await agentService.runQualification({
          inquiry: opp.inquiry,
          requirements: currentOpp.requirements || [],
          missingInformation: currentOpp.missingInformation || [],
          risks: currentOpp.risks || [],
        });

        updateOpportunity(opp.id, {
          qualification: qualData.qualification,
          confidenceScore: qualData.qualification.estimatedScore,
          stage: 'Qualified',
        });

        setStatus('Qualification', 'Completed', [
          `Classification: ${qualData.qualification.classification} (Score: ${qualData.qualification.estimatedScore}%)`,
          qualData.qualification.scoreLabelNote
        ]);
        addActivity({
          id: `act-${Date.now()}-qual`, agentName: 'Qualification Agent', action: `Qualified opportunity (${qualData.qualification.classification}).`, dealName: opp.title, timestamp: 'Just now', type: 'qualification', status: 'completed'
        });
      }

      // 3. CAPABILITY MATCHING AGENT (RAG Grounding)
      if (startIdx <= 2) {
        setActiveStepIndex(2);
        setStatus('Capability Matching', 'Running', ['Executing RAG keyword retrieval over knowledge documents...']);
        
        const currentOpp = opportunities.find(o => o.id === id) || opp;
        const matchData = await agentService.runCapabilityMatching(currentOpp.requirements || [], currentOpp.inquiry);

        updateOpportunity(opp.id, {
          capabilities: matchData.capabilities,
          retrievedDocs: matchData.retrievedDocs,
        });

        setStatus('Capability Matching', 'Completed', [
          `Matched ${matchData.capabilities.length} capabilities with source evidence.`,
          `Retrieved ${matchData.retrievedDocs.length} knowledge base documents.`
        ]);
        addActivity({
          id: `act-${Date.now()}-cap`, agentName: 'Capability Matcher', action: 'Grounded requirements with internal knowledge docs.', dealName: opp.title, timestamp: 'Just now', type: 'match', status: 'completed'
        });
      }

      // 4. PROPOSAL DRAFTER AGENT
      if (startIdx <= 3) {
        setActiveStepIndex(3);
        setStatus('Proposal', 'Running', ['Synthesizing executive summary and drafting proposal sections...']);
        
        const currentOpp = opportunities.find(o => o.id === id) || opp;
        const propData = await proposalService.generateDraft({
          title: opp.title,
          company: opp.company,
          inquiry: opp.inquiry,
          intake: { requirements: currentOpp.requirements, risks: currentOpp.risks },
          qualification: currentOpp.qualification,
          capabilities: currentOpp.capabilities || [],
        });

        updateOpportunity(opp.id, {
          proposal: propData.proposal,
          stage: 'Drafting',
        });

        setStatus('Proposal', 'Needs Review', [
          `Draft generated with ${propData.proposal.sections.length} sections.`,
          'Awaiting Human Executive Approval.'
        ]);
        addActivity({
          id: `act-${Date.now()}-prop`, agentName: 'Proposal Agent', action: 'Generated proposal draft requiring approval.', dealName: opp.title, timestamp: 'Just now', type: 'proposal', status: 'pending_approval'
        });
      }

      // 5. FOLLOW-UP PLANNER AGENT
      if (startIdx <= 4) {
        setActiveStepIndex(4);
        setStatus('Follow-up Planner', 'Running', ['Generating recommended next steps for Human and AI...']);
        
        const currentOpp = opportunities.find(o => o.id === id) || opp;
        const followData = await followUpService.generateTasks(currentOpp);

        updateOpportunity(opp.id, {
          followUps: followData.tasks,
        });

        setStatus('Follow-up Planner', 'Completed', [
          `Planned ${followData.tasks.length} follow-up tasks with assignees and due dates.`
        ]);
        addActivity({
          id: `act-${Date.now()}-follow`, agentName: 'Follow-up Planner', action: 'Created recommended task backlog.', dealName: opp.title, timestamp: 'Just now', type: 'followup', status: 'completed'
        });
      }

    } catch (err: any) {
      console.error('[Workflow Error]', err);
      const targetAgent = agentOrder[activeStepIndex] || 'Intake';
      setFailedAgent(targetAgent);
      setWorkflowError(err?.message || 'Agent execution encountered an error.');
      setStatus(targetAgent, 'Failed', ['Execution failed. Click retry to resume.'], err?.message);
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
    if (status === 'Running') return <Clock className="w-4 h-4 text-blue-400 animate-spin" />;
    if (status === 'Needs Review') return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    if (status === 'Failed') return <AlertCircle className="w-4 h-4 text-red-400" />;
    return <Clock className="w-4 h-4 text-white/20" />;
  };

  const tabs = ['overview', 'qualification', 'requirements', 'capabilities', 'proposal', 'follow-ups'];

  const calculateProgressPercent = () => {
    const states = Object.values(agentStates);
    const completedCount = states.filter(s => s.status === 'Completed' || s.status === 'Needs Review').length;
    return Math.round((completedCount / agentOrder.length) * 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h1 className="font-display text-3xl text-white tracking-tight">{opp.title}</h1>
            <span className="bg-white/10 text-white/80 text-xs px-2.5 py-1 rounded-md border border-white/20 font-medium">
              {opp.stage}
            </span>
            {opp.mode && (
              <span className={`text-xs px-2.5 py-1 rounded-md border font-mono ${
                opp.mode === 'live' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                {opp.mode === 'live' ? '⚡ Live AI Workflow' : '🟡 Demo Mode'}
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-sm">{opp.company} • {opp.industry} • {opp.value}</p>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={resetWorkflow}
            disabled={isRunning}
            className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-sm font-medium rounded-lg flex items-center gap-2 border border-white/10 transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>

          <button 
            onClick={() => runWorkflow()}
            disabled={isRunning || opp.stage === 'Approved'}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span>{isRunning ? 'Orchestrating Agents...' : 'Run Agent Workflow'}</span>
          </button>
        </div>
      </div>

      {/* Timeline Progress Bar */}
      <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-2">
        <div className="flex justify-between items-center text-xs text-white/70">
          <span className="font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Agent Workflow Timeline Progress
          </span>
          <span className="font-mono text-emerald-400">{calculateProgressPercent()}% Completed</span>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-500 ease-out"
            style={{ width: `${calculateProgressPercent()}%` }}
          />
        </div>
      </div>

      {/* Error Banner with Retry */}
      {workflowError && (
        <div className="glass-panel p-4 rounded-xl border border-red-500/30 bg-red-500/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-red-300 text-sm">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <div>
              <span className="font-semibold text-red-400">Agent Execution Failed: </span>
              {workflowError}
            </div>
          </div>
          {failedAgent && (
            <button
              onClick={() => runWorkflow(failedAgent)}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retry {failedAgent}
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar: Workflow Status */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-white font-medium text-sm mb-4 uppercase tracking-wider flex items-center justify-between">
            <span>Specialized Agents</span>
            <span className="text-[10px] text-muted-foreground font-mono">5 Step Pipeline</span>
          </h3>
          <div className="space-y-3">
            {agentOrder.map((agentName, idx) => {
              const state = agentStates[agentName] || { type: agentName, status: 'Not Started', logs: [] };
              const isCurrent = activeStepIndex === idx && isRunning;
              return (
                <div 
                  key={agentName} 
                  className={`glass-panel p-4 rounded-xl border transition-all ${
                    isCurrent ? 'border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono text-white/50">0{idx + 1}</span>
                    <span className="text-sm text-white font-medium">{agentName}</span>
                    <StatusIcon status={state.status} />
                  </div>
                  
                  <div className="text-[11px] text-muted-foreground font-mono mt-1 flex justify-between">
                    <span>Status: <strong className="text-white/80">{state.status}</strong></span>
                  </div>

                  {state.logs.length > 0 && (
                    <p className="text-xs text-emerald-300/80 mt-2 font-mono bg-black/40 p-2 rounded border border-white/5 line-clamp-2">
                      {state.logs[state.logs.length - 1]}
                    </p>
                  )}

                  {state.status === 'Failed' && (
                    <button 
                      onClick={() => runWorkflow(agentName)} 
                      className="mt-2 text-xs text-red-400 underline hover:text-red-300 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" /> Retry step
                    </button>
                  )}
                </div>
              );
            })}
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
                className={`px-4 py-2 text-sm font-medium rounded-t-lg capitalize transition-colors whitespace-nowrap ${
                  activeTab === tab ? 'text-emerald-400 border-b-2 border-emerald-400 bg-white/5' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>

          <div className="min-h-[400px]">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                  <h3 className="text-lg font-medium text-white">Original Inquiry & Parameters</h3>
                  <p className="text-white/80 text-sm whitespace-pre-wrap font-mono bg-[#020a12] p-4 rounded-lg border border-white/5">
                    {opp.inquiry}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="glass-panel p-5 rounded-2xl border border-white/10">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Indicated Budget</span>
                    <p className="text-white mt-1 font-semibold">{opp.budget || 'Unspecified'}</p>
                  </div>
                  <div className="glass-panel p-5 rounded-2xl border border-white/10">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Target Timeline</span>
                    <p className="text-white mt-1 font-semibold">{opp.timeline || 'Unspecified'}</p>
                  </div>
                  <div className="glass-panel p-5 rounded-2xl border border-white/10">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Primary Objective</span>
                    <p className="text-white mt-1 font-semibold text-sm">{opp.objective || 'Unspecified'}</p>
                  </div>
                </div>

                {opp.retrievedDocs && opp.retrievedDocs.length > 0 && (
                  <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
                    <h4 className="text-sm font-medium text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> Grounded Evidence (Demo Keyword Search RAG)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {opp.retrievedDocs.map(doc => (
                        <div key={doc.id} className="p-3 bg-white/5 rounded-lg border border-white/10 text-xs space-y-1">
                          <div className="font-mono text-emerald-400 flex items-center justify-between">
                            <span>[{doc.id}]</span>
                            <span className="text-[10px] text-white/40 uppercase">Retrieved Doc</span>
                          </div>
                          <div className="text-white font-medium">{doc.title}</div>
                          <div className="text-white/60 line-clamp-2">{doc.summary}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Qualification Tab */}
            {activeTab === 'qualification' && (
              <div className="space-y-6">
                {!opp.qualification && <div className="text-muted-foreground">Qualification Agent has not run yet. Click 'Run Agent Workflow' above.</div>}

                {opp.qualification && (
                  <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Opportunity Fit Score</div>
                        <div className="flex items-baseline gap-3">
                          <span className="text-4xl font-display text-emerald-400">{opp.qualification.estimatedScore}%</span>
                          <span className="text-sm px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium">
                            {opp.qualification.classification}
                          </span>
                        </div>
                        <p className="text-xs text-amber-400/90 mt-2 font-mono flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {opp.qualification.scoreLabelNote || 'Demo-generated estimate based on initial inquiry parameters'}
                        </p>
                      </div>

                      <div className="max-w-md text-sm text-white/80 bg-white/5 p-4 rounded-xl border border-white/10">
                        <span className="text-xs font-semibold text-white uppercase mb-1 block">Qualification Summary</span>
                        {opp.qualification.qualificationSummary}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="glass-panel p-5 rounded-xl border border-white/10 bg-emerald-500/5 space-y-3">
                        <h4 className="text-emerald-400 text-sm font-medium flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4" /> Strategic Strengths
                        </h4>
                        <ul className="list-disc pl-5 text-sm text-white/80 space-y-1.5">
                          {opp.qualification.strengths.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>

                      <div className="glass-panel p-5 rounded-xl border border-white/10 bg-red-500/5 space-y-3">
                        <h4 className="text-red-400 text-sm font-medium flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" /> Qualification Risks
                        </h4>
                        <ul className="list-disc pl-5 text-sm text-white/80 space-y-1.5">
                          {opp.qualification.risks.map((r, i) => <li key={i}>{r}</li>)}
                        </ul>
                      </div>
                    </div>

                    {opp.qualification.followUpQuestions.length > 0 && (
                      <div className="glass-panel p-5 rounded-xl border border-white/10 space-y-3">
                        <h4 className="text-blue-400 text-sm font-medium">Recommended Prospect Follow-up Questions</h4>
                        <ul className="list-disc pl-5 text-sm text-white/80 space-y-1 font-mono">
                          {opp.qualification.followUpQuestions.map((q, i) => <li key={i}>{q}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Requirements Tab */}
            {activeTab === 'requirements' && (
              <div className="space-y-6">
                {!opp.requirements && <div className="text-muted-foreground">Intake Agent has not extracted requirements yet.</div>}
                
                {opp.requirements && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Extracted Requirements</h3>
                    {opp.requirements.map(req => (
                      <div key={req.id} className="glass-panel p-4 rounded-xl border border-white/10 flex items-start gap-4">
                        <div className={`px-2 py-1 text-[10px] uppercase font-bold rounded ${
                          req.criticality === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}>
                          {req.criticality}
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground uppercase mb-1">{req.category}</div>
                          <div className="text-sm text-white font-medium">{req.description}</div>
                        </div>
                      </div>
                    ))}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="glass-panel p-4 rounded-xl border border-white/10 bg-amber-500/5">
                        <h4 className="text-amber-400 text-sm font-medium flex items-center gap-2 mb-3">
                          <AlertTriangle className="w-4 h-4"/> Missing Information
                        </h4>
                        <ul className="list-disc pl-5 text-sm text-white/80 space-y-1">
                          {opp.missingInformation?.map((m, i) => <li key={i}>{m}</li>)}
                        </ul>
                      </div>
                      <div className="glass-panel p-4 rounded-xl border border-white/10 bg-red-500/5">
                        <h4 className="text-red-400 text-sm font-medium flex items-center gap-2 mb-3">
                          <ShieldCheck className="w-4 h-4"/> Identified Operational Risks
                        </h4>
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
                {!opp.capabilities && <div className="text-muted-foreground">Capability Matcher has not run yet.</div>}
                
                {opp.capabilities?.map(cap => (
                  <div key={cap.id} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl text-white font-medium">{cap.name}</h3>
                        {cap.relevanceExplanation && (
                          <p className="text-xs text-emerald-400/90 mt-1">{cap.relevanceExplanation}</p>
                        )}
                      </div>
                      <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded font-mono border border-emerald-500/30">
                        {cap.relevanceScore}% Match
                      </span>
                    </div>
                    
                    <p className="text-sm text-white/70">{cap.description}</p>
                    
                    <div className="space-y-3 pt-2 border-t border-white/10">
                      <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Grounded Evidence</span>
                        <ul className="list-disc pl-5 text-sm text-white/90 space-y-1">
                          {cap.evidence.map((ev, i) => <li key={i}>{ev}</li>)}
                        </ul>
                      </div>

                      {cap.evidenceDocIds && cap.evidenceDocIds.length > 0 && (
                        <div>
                          <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Cited Source Document IDs</span>
                          <div className="flex gap-2">
                            {cap.evidenceDocIds.map(docId => (
                              <span key={docId} className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded px-2 py-0.5 font-mono flex items-center gap-1">
                                <ExternalLink className="w-3 h-3" /> {docId}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {cap.experts && cap.experts.length > 0 && (
                        <div>
                          <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Subject Matter Experts (SMEs)</span>
                          <div className="flex gap-2 flex-wrap">
                            {cap.experts.map(exp => (
                              <span key={exp} className="text-xs bg-white/5 border border-white/10 rounded px-2.5 py-1 text-white/80">{exp}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {cap.unsupportedAssumptions && cap.unsupportedAssumptions.length > 0 && (
                        <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg text-xs text-amber-300">
                          <span className="font-semibold block mb-0.5">Unsupported Assumptions / Gaps:</span>
                          <ul className="list-disc pl-4 space-y-0.5">
                            {cap.unsupportedAssumptions.map((ua, i) => <li key={i}>{ua}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Proposal Tab */}
            {activeTab === 'proposal' && (
              <div className="space-y-6">
                {!opp.proposal && <div className="text-muted-foreground">Proposal Agent has not generated a draft yet.</div>}
                
                {opp.proposal && (
                  <div className="glass-panel p-0 rounded-2xl border border-white/10 overflow-hidden">
                    {/* Header Bar */}
                    <div className="bg-[#041424] p-4 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-400" />
                        <div>
                          <h4 className="font-medium text-white text-sm">{opp.proposal.title}</h4>
                          <span className="text-xs text-white/50">Human Approval Gate: Enterprise Sign-Off Required</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded border ${
                          opp.proposal.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        }`}>
                          {opp.proposal.status === 'Approved' ? 'Approved by Executive' : 'Requires Human Approval'}
                        </span>
                        {opp.proposal.status !== 'Approved' && (
                          <button onClick={handleApprove} className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors shadow-sm">
                            <Check className="w-3.5 h-3.5" /> Approve Proposal
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Proposal Document Render */}
                    <div className="p-8 space-y-8 bg-white text-gray-900">
                      {opp.proposal.executiveSummary && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h5 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">Executive Summary</h5>
                          <p className="text-sm text-blue-950 leading-relaxed font-sans">{opp.proposal.executiveSummary}</p>
                        </div>
                      )}

                      {opp.proposal.sections.map(sec => (
                        <div key={sec.id} className="space-y-2">
                          <h4 className="text-base font-bold text-gray-900">{sec.title}</h4>
                          <p className="text-sm text-gray-700 leading-relaxed font-sans">{sec.content}</p>
                          {sec.evidenceDocIds && sec.evidenceDocIds.length > 0 && (
                            <div className="flex items-center gap-2 text-[11px] text-emerald-700 pt-1 font-mono">
                              <span>Cited Evidence Docs:</span>
                              {sec.evidenceDocIds.map(docId => (
                                <span key={docId} className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-300">
                                  [{docId}]
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}

                      {opp.proposal.assumptions && opp.proposal.assumptions.length > 0 && (
                        <div className="pt-4 border-t border-gray-200 text-xs text-gray-600">
                          <strong className="text-gray-900 block mb-1">Key Assumptions:</strong>
                          <ul className="list-disc pl-5 space-y-0.5">
                            {opp.proposal.assumptions.map((a, i) => <li key={i}>{a}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Follow-ups Tab */}
            {activeTab === 'follow-ups' && (
              <div className="space-y-4">
                {!opp.followUps && <div className="text-muted-foreground">Follow-up Planner has not generated task backlog yet.</div>}
                
                {opp.followUps?.map(task => (
                  <div key={task.id} className="glass-panel p-4 rounded-xl border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white font-medium text-sm">{task.title}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono border ${
                          task.assignee === 'AI' ? 'border-purple-500/30 text-purple-400 bg-purple-500/10' : 'border-blue-500/30 text-blue-400 bg-blue-500/10'
                        }`}>
                          {task.assignee} Task
                        </span>
                        {task.priority && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${
                            task.priority === 'High' ? 'text-red-400 bg-red-500/10' : 'text-blue-400 bg-blue-500/10'
                          }`}>
                            {task.priority}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/60">{task.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs text-muted-foreground">Due: {new Date(task.dueDate).toLocaleDateString()}</div>
                      <div className="text-xs text-emerald-400 mt-1 font-mono">{task.status}</div>
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
