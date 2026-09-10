import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  Building2, 
  FileText, 
  Users, 
  Mail, 
  Zap, 
  CheckCircle2, 
  LogIn,
  Key,
  Globe2,
  Crown,
  Rocket,
  MessageSquare,
  Bot,
  Activity,
  Cpu,
  ChevronRight,
  TrendingUp,
  Calendar,
  AlertTriangle,
  Play,
  LogOut
} from 'lucide-react';
import { UserProfile, Organization } from '../types';

interface WelcomePortalProps {
  currentUser: UserProfile;
  activeOrg: Organization | undefined;
  onEnterConsole: () => void;
  onOpenAuthModal: () => void;
  onOpenOrgModal: () => void;
  onOpenGuideModal: () => void;
  onOpenDeployModal: () => void;
  onQuickSwitchToDemoTester: () => void;
  onQuickSwitchToSuperAdmin: () => void;
  onSignOut?: () => void;
}

interface DemoScenario {
  id: string;
  title: string;
  prompt: string;
  category: 'email' | 'intel' | 'crm';
  jackResponse: string;
  stagedActionTitle: string;
  stagedRecipient: string;
  safeguardReason: string;
}

const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'email-expansion',
    title: 'Enterprise $150k Deal Email',
    prompt: 'Jack, draft a reply to Marcus Sterling at Acme Global about our $150k expansion deal and confirm human-in-the-loop safeguards.',
    category: 'email',
    jackResponse: "I've drafted a polished executive reply confirming our strict human approval safeguard and addressing the $150k expansion terms. In accordance with zero-blind-send protocols, the message has been staged in your approval queue for your review.",
    stagedActionTitle: 'Email Dispatch: Re: $150k Expansion & Safeguard Attestation',
    stagedRecipient: 'Marcus Sterling (VP Procurement, Acme Global)',
    safeguardReason: 'High deal value ($150k) requires executive sign-off before dispatch.'
  },
  {
    id: 'intel-pricing',
    title: 'Competitor Price Shift Alert',
    prompt: 'Jack, check competitor pricing updates in North America and prepare a counter-strategy brief.',
    category: 'intel',
    jackResponse: "Detected RivalCorp's 15% price cut on mid-market tiers. Synthesized a value-defense counter-play highlighting our SOC2 Zero-Knowledge enclave. Ready for team distribution upon your approval.",
    stagedActionTitle: 'Strategy Document: Q4 Competitive Counter-Pricing Directive',
    stagedRecipient: 'Demo Organization Internal Workspace',
    safeguardReason: 'Pricing strategy adjustments impact revenue forecasts.'
  },
  {
    id: 'crm-stage',
    title: 'CRM Pipeline Progression',
    prompt: 'Jack, move Acme Global deal to Procurement Review stage and set close date to Nov 15.',
    category: 'crm',
    jackResponse: "CRM deal parameters prepared for updating. Stage transition to 'Procurement Review' ($150,000 ARR) staged in the review sandbox for one-click verification.",
    stagedActionTitle: 'CRM Mutation: Update Acme Global Deal Stage & Value',
    stagedRecipient: 'HubSpot / Salesforce Pipeline Synchronizer',
    safeguardReason: 'Automated CRM alterations require audited operator consent.'
  }
];

export function WelcomePortal({
  currentUser,
  activeOrg,
  onEnterConsole,
  onOpenAuthModal,
  onOpenOrgModal,
  onOpenGuideModal,
  onOpenDeployModal,
  onQuickSwitchToDemoTester,
  onQuickSwitchToSuperAdmin,
  onSignOut
}: WelcomePortalProps) {
  const [selectedScenario, setSelectedScenario] = useState<DemoScenario>(DEMO_SCENARIOS[0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState<'idle' | 'processing' | 'ready'>('ready');

  const isSuperAdmin = currentUser.role === 'super_admin';
  const isDemoTester = currentUser.email === 'alex.vance@demo.co';

  const handleSelectScenario = (scenario: DemoScenario) => {
    setSelectedScenario(scenario);
    setIsSimulating(true);
    setSimulationStep('processing');
    setTimeout(() => {
      setSimulationStep('ready');
      setIsSimulating(false);
    }, 450);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden font-sans">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-cyan-600/10 via-blue-600/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none -z-10" />
      
      {/* Top Application Bar */}
      <header className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-4 sm:px-8 lg:px-12 py-3.5 flex items-center justify-between z-30 sticky top-0">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/25 flex items-center justify-center text-slate-950 font-black text-lg">
            J
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base tracking-tight text-white">Jack AI</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold">
                Enterprise Siri
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Jack of all trades AI for business</p>
          </div>
        </div>

        {/* Global Navigation Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Deployment Center Link */}
          <button
            type="button"
            onClick={onOpenDeployModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 border border-cyan-500/30 text-xs font-semibold text-cyan-300 transition-all cursor-pointer shadow-sm"
            title="Deploy Jack AI to Cloud Run, Firebase Hosting, or Vercel"
          >
            <Rocket className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Deployment Center</span>
            <span className="sm:hidden">Deploy</span>
          </button>

          {/* User Guide PDF Link */}
          <button
            type="button"
            onClick={onOpenGuideModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Executive Customer Guide & Technical Documentation"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">User Guide (PDF)</span>
          </button>

          {/* Account / Sync Button */}
          <button
            type="button"
            onClick={onOpenAuthModal}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer shadow-sm"
          >
            <LogIn className="w-3.5 h-3.5 text-cyan-400" />
            <span>{currentUser.displayName ? 'Account' : 'Sign In'}</span>
          </button>

          {/* Sign Out Button */}
          {onSignOut && (
            <button
              type="button"
              onClick={onSignOut}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-500/20 border border-slate-800 hover:border-rose-500/40 text-xs font-semibold text-slate-400 hover:text-rose-300 transition-all cursor-pointer shadow-sm"
              title="Sign out of current account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content Hub */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12 flex flex-col justify-center space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-5 max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-wide shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Gemini 3.8 Flash Inference • Zero-Knowledge AES-256 Vault</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Meet <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">Jack AI</span>
            <br />
            <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-300">The Jack of all trades AI for business</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Autonomous marketing, executive email drafting, competitor intelligence radar, and CRM synchronization—engineered with a mandatory <strong>Zero Blind Send</strong> safeguard queue and multi-tenant governance.
          </p>

          {/* Quick Launch & Active Session Bar */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-xl mx-auto">
            <button
              type="button"
              onClick={onEnterConsole}
              className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-bold text-sm transition-all shadow-xl shadow-cyan-500/25 flex items-center justify-center space-x-2.5 cursor-pointer group"
            >
              <span>Launch AI Workstation</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>

            <button
              type="button"
              onClick={onOpenDeployModal}
              className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Rocket className="w-4 h-4 text-cyan-400" />
              <span>Deploy App (Cloud Run)</span>
            </button>
          </div>

          {/* Active Session Info Pill */}
          <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 shadow-sm">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-slate-400">Active Identity:</span>
              <span className="font-semibold text-white">{currentUser.displayName}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                {activeOrg?.name || 'Demo'}
              </span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onQuickSwitchToDemoTester}
                className={`text-[10px] font-mono px-2 py-0.5 rounded transition-colors ${
                  isDemoTester ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Demo Tester
              </button>
              <button
                type="button"
                onClick={onQuickSwitchToSuperAdmin}
                className={`text-[10px] font-mono px-2 py-0.5 rounded transition-colors ${
                  isSuperAdmin ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Super Admin
              </button>
            </div>
          </div>
        </div>

        {/* Live Interactive Test Drive Sandbox */}
        <div className="max-w-5xl w-full mx-auto rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wider">Interactive Live Preview</span>
                <span className="text-[11px] text-slate-400 ml-2">Click a prompt to test Jack's real-time reasoning</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Zero-Blind-Send Safeguard Active</span>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Scenario Selector Chips */}
            <div className="lg:col-span-4 space-y-2.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Select Business Scenario
              </span>
              {DEMO_SCENARIOS.map((sc) => (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => handleSelectScenario(sc)}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedScenario.id === sc.id
                      ? 'bg-cyan-500/10 border-cyan-500/40 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">{sc.title}</span>
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {sc.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    "{sc.prompt}"
                  </p>
                </button>
              ))}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onEnterConsole}
                  className="w-full py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <span>Open Full Voice & Text Console</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Jack AI Synthesis & Safeguard Staging Display */}
            <div className="lg:col-span-8 bg-slate-950 p-5 rounded-xl border border-slate-800/80 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span className="font-semibold text-slate-200">Jack AI Executive Synthesis</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">Response Latency: 0.18s</span>
                </div>

                <div className="mt-3 p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-200 leading-relaxed min-h-[70px]">
                  {simulationStep === 'processing' ? (
                    <div className="flex items-center space-x-2 text-slate-400">
                      <div className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                      <span>Jack AI is analyzing parameters and structuring safeguard payloads...</span>
                    </div>
                  ) : (
                    <span>{selectedScenario.jackResponse}</span>
                  )}
                </div>
              </div>

              {/* Safeguard Staging Box */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-xs font-bold text-amber-300">Safeguard Approval Queue Staged Item</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold uppercase">
                    Requires Human Review
                  </span>
                </div>

                <div className="text-xs space-y-1 text-slate-300">
                  <div>
                    <span className="text-slate-400">Action: </span>
                    <strong className="text-white">{selectedScenario.stagedActionTitle}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Recipient/Target: </span>
                    <span className="text-cyan-300 font-mono text-[11px]">{selectedScenario.stagedRecipient}</span>
                  </div>
                  <div className="text-[11px] text-amber-400/90 pt-1 flex items-center space-x-1">
                    <span>Audit Note: {selectedScenario.safeguardReason}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={onEnterConsole}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Inspect in Approval Queue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Core Architecture Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/30 transition-all space-y-3 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Zero Blind Sends</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every critical action—customer emails, price discounts, contract proposals, and calendar invites—is intercepted and placed into a human approval queue.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/30 transition-all space-y-3 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Demo Org & Multi-Tenant IAM</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Equipped with a dedicated "Demo" organization enclave. Delegated org heads govern activity, invite team members, and isolate proprietary business context.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/30 transition-all space-y-3 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Zero-Knowledge Enclave</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              AES-256 GCM client-side encryption and Firestore Attribute-Based Access Control (ABAC). No proprietary operational data is ever used for model training.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950 py-5 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Jack AI • Enterprise Business & Marketing Autonomous Agent</span>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={onOpenDeployModal}
              className="text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
            >
              Cloud Deployment
            </button>
            <button
              type="button"
              onClick={onOpenGuideModal}
              className="text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              Executive Guide (PDF)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
