import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import { opportunityService } from '../services/opportunityService';
import { FileText, Bot, Upload, Loader2 } from 'lucide-react';

const DEMO_INQUIRY = {
  title: 'Cloud Modernization Request',
  company: 'Global Retail Alliance',
  industry: 'Retail',
  value: '$5,000,000',
  contactRole: 'VP of Engineering',
  inquiry: 'We are looking to migrate our monolithic e-commerce backend to a microservices architecture on AWS. We need high availability during the holiday season.',
  budget: 'Around $5M',
  timeline: 'Q3 2024 (Before Black Friday)',
  objective: 'Improve uptime to 99.99% and reduce infrastructure costs by 20%.',
  challenges: 'Legacy database dependencies, lack of internal Kubernetes expertise.',
};

export default function OpportunityIntake() {
  const navigate = useNavigate();
  const { addOpportunity } = useStore();
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    industry: '',
    value: '',
    contactRole: '',
    inquiry: '',
    budget: '',
    timeline: '',
    objective: '',
    challenges: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loadDemoInquiry = () => {
    setFormData(DEMO_INQUIRY);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const newOpp = await opportunityService.createOpportunity(formData);
      addOpportunity(newOpp);
      navigate(`/opportunities/${newOpp.id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl text-white font-normal tracking-tight">
            Opportunity Intake
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Capture new unstructured inquiries or RFP fragments for AI analysis.
          </p>
        </div>
        <button 
          onClick={loadDemoInquiry}
          className="px-4 py-2 text-sm font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span>Load Demo Inquiry</span>
        </button>
      </div>

      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/70 uppercase tracking-wider">Opportunity Title</label>
              <input required name="title" value={formData.title} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-colors" placeholder="e.g. ERP Modernization" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/70 uppercase tracking-wider">Company</label>
              <input required name="company" value={formData.company} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-colors" placeholder="Client or Partner Name" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/70 uppercase tracking-wider">Industry</label>
              <input name="industry" value={formData.industry} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-colors" placeholder="e.g. Financial Services" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/70 uppercase tracking-wider">Estimated Value</label>
              <input name="value" value={formData.value} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-colors" placeholder="e.g. $1,500,000" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/70 uppercase tracking-wider">Contact Role</label>
              <input name="contactRole" value={formData.contactRole} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-colors" placeholder="e.g. CTO, VP Engineering" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/70 uppercase tracking-wider">Budget</label>
              <input name="budget" value={formData.budget} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-colors" placeholder="Indicated budget" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-white/70 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              Raw Inquiry / Unstructured Text
            </label>
            <textarea required name="inquiry" value={formData.inquiry} onChange={handleInputChange} rows={4} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-colors resize-none" placeholder="Paste the raw email, meeting notes, or RFP extract here..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 md:col-span-1">
              <label className="text-xs font-medium text-white/70 uppercase tracking-wider">Timeline</label>
              <textarea name="timeline" value={formData.timeline} onChange={handleInputChange} rows={2} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-colors resize-none" placeholder="Target dates" />
            </div>
            <div className="space-y-2 md:col-span-1">
              <label className="text-xs font-medium text-white/70 uppercase tracking-wider">Key Objective</label>
              <textarea name="objective" value={formData.objective} onChange={handleInputChange} rows={2} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-colors resize-none" placeholder="Primary goal" />
            </div>
            <div className="space-y-2 md:col-span-1">
              <label className="text-xs font-medium text-white/70 uppercase tracking-wider">Known Challenges</label>
              <textarea name="challenges" value={formData.challenges} onChange={handleInputChange} rows={2} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-colors resize-none" placeholder="Risks or blockers" />
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex justify-end">
            <button
              type="submit"
              disabled={isLoading || !formData.title || !formData.inquiry}
              className="px-6 py-3 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center gap-2 transition-colors"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
              <span>Analyze Opportunity</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
