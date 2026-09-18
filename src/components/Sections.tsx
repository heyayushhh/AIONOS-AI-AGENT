import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Layers, 
  FileCheck, 
  ShieldCheck, 
  ArrowRight, 
  Workflow, 
  Cpu, 
  Building2, 
  Network 
} from 'lucide-react';

export default function Sections() {
  const navigate = useNavigate();

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 space-y-36 pb-32">
      {/* 1. Features Section */}
      <section id="features" className="scroll-mt-28">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs text-white/70 bg-white/5 border border-white/10 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-white/90" />
            <span>Core Platform Capabilities</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl text-white font-normal tracking-tight">
            Engineered for high-stakes enterprise transactions.
          </h2>
          <p className="text-muted-foreground mt-4 text-base sm:text-lg leading-relaxed">
            Eliminate manual friction between discovery, qualification, and execution with multi-agent orchestration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel rounded-2xl p-8 hover:border-white/20 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-white">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-display text-2xl text-white mb-2 font-normal">
              Intelligent Inquiry Ingestion & Enrichment
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Consolidate inbound enterprise RFPs, strategic partner requests, and executive inquiries. Autonomous extractors parse buyer constraints, timelines, and budget signals in seconds.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-8 hover:border-white/20 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-white">
              <Workflow className="w-6 h-6" />
            </div>
            <h3 className="font-display text-2xl text-white mb-2 font-normal">
              Semantic Capability Discovery & Matchmaking
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Map complex customer requirements directly against your firm’s verified capabilities, subject-matter experts, past win records, and partner ecosystem integrations.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-8 hover:border-white/20 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-white">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="font-display text-2xl text-white mb-2 font-normal">
              Evidence-Grounded Proposal Synthesis
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Generate defensible, highly tailored proposal narratives. Every claim, case study, and timeline is grounded in verified corporate data—preventing hallucinations.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-8 hover:border-white/20 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-display text-2xl text-white mb-2 font-normal">
              Human-in-the-Loop Governance & Cadences
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              AI agents handle qualification research, proposal drafting, and follow-up tracking, while enterprise leaders maintain complete editorial sign-off and approval governance.
            </p>
          </div>
        </div>
      </section>

      {/* 2. How It Works Section */}
      <section id="how-it-works" className="scroll-mt-28">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs text-white/70 bg-white/5 border border-white/10 mb-4">
            <Cpu className="w-3.5 h-3.5 text-white/90" />
            <span>Workflow Automation Architecture</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl text-white font-normal tracking-tight">
            How DealFlow AI powers enterprise deal velocity.
          </h2>
          <p className="text-muted-foreground mt-4 text-base sm:text-lg leading-relaxed">
            A continuous loop of AI-assisted qualification, research, drafting, and verified human approval.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Capture Inquiry',
              desc: 'Ingests inbound RFPs, partner deal registrations, and email inquiries into a structured pipeline.',
            },
            {
              step: '02',
              title: 'Qualify & Match',
              desc: 'Autonomous agents evaluate strategic fit, score budget viability, and map optimal solution architects.',
            },
            {
              step: '03',
              title: 'Synthesize Proposal',
              desc: 'AI generates comprehensive, audit-ready proposal drafts grounded in verified win data.',
            },
            {
              step: '04',
              title: 'Approve & Nurture',
              desc: 'Alliance leads review and approve outputs before automated follow-up cadences initiate.',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="glass-panel rounded-2xl p-6 relative flex flex-col justify-between hover:border-white/20 transition-all duration-300"
            >
              <div>
                <span className="font-display text-3xl text-white/40 mb-4 block font-normal">
                  {item.step}
                </span>
                <h4 className="text-lg text-white font-medium mb-2">{item.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 text-xs text-white/50 flex items-center justify-between">
                <span>Phase {item.step}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Solutions Section */}
      <section id="solutions" className="scroll-mt-28">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs text-white/70 bg-white/5 border border-white/10 mb-4">
            <Building2 className="w-3.5 h-3.5 text-white/90" />
            <span>Targeted Workflows</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl text-white font-normal tracking-tight">
            Tailored solutions for modern revenue organizations.
          </h2>
          <p className="text-muted-foreground mt-4 text-base sm:text-lg leading-relaxed">
            Built to scale across complex alliance channels, enterprise sales teams, and advisory practices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel rounded-2xl p-8 hover:border-white/20 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest text-white/50 font-medium mb-3">Alliances & Ecosystems</div>
              <h3 className="font-display text-2xl text-white mb-3 font-normal">
                Strategic Partner Co-Selling
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Streamline co-sell notifications, shared pipeline tracking, and joint value propositions with cloud hyperscalers and global software partners.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-white/5">
              <span className="text-xs text-white/60">3.4x Faster Joint Proposal Cycles</span>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-8 hover:border-white/20 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest text-white/50 font-medium mb-3">Enterprise Sales</div>
              <h3 className="font-display text-2xl text-white mb-3 font-normal">
                RFP & Complex Bid Operations
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Empower bid managers to decompose 100+ page questionnaires into atomic requirements, automatically sourcing verified past answers and certifications.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-white/5">
              <span className="text-xs text-white/60">92% Reduction in Manual Search Time</span>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-8 hover:border-white/20 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest text-white/50 font-medium mb-3">Global Advisory</div>
              <h3 className="font-display text-2xl text-white mb-3 font-normal">
                Systems Integrators & Consultancies
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Discover internal capabilities across disparate business units and match the right technical leaders to multi-million dollar transformation opportunities.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-white/5">
              <span className="text-xs text-white/60">Complete Provenance & Governance</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. About Section */}
      <section id="about" className="scroll-mt-28">
        <div className="glass-panel rounded-3xl p-8 sm:p-14 text-center max-w-4xl mx-auto border border-white/10 relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs text-white/70 bg-white/5 border border-white/10 mb-6">
              <Network className="w-3.5 h-3.5 text-white/90" />
              <span>About DealFlow AI</span>
            </div>
            <h2 className="font-display text-4xl sm:text-6xl text-white font-normal tracking-tight leading-tight max-w-2xl mx-auto">
              Where artificial intelligence meets strategic human judgment.
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mt-6 leading-relaxed">
              We founded DealFlow AI on a singular conviction: enterprise relationships are won on trust, precision, and relevance. Our platform frees sales and alliance architects from tedious document assembly, elevating teams to focus on relationship-building and strategic consensus.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="liquid-glass rounded-full px-10 py-4 text-sm sm:text-base text-foreground hover:scale-[1.03] transition-all cursor-pointer font-medium flex items-center gap-2"
              >
                <span>Launch DealFlow Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
