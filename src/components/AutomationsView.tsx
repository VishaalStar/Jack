import React, { useState } from 'react';
import { 
  Workflow, 
  CheckCircle2, 
  ExternalLink, 
  Zap, 
  Mail, 
  Calendar, 
  Database, 
  BarChart, 
  Sliders, 
  ShieldCheck,
  Play,
  Pause
} from 'lucide-react';

interface AutomationRecipe {
  id: string;
  name: string;
  trigger: string;
  actions: string[];
  platforms: string[];
  enabled: boolean;
  timesFired: number;
  safeguardMode: 'Strict Human Approval' | 'Autonomous Guardrails';
}

interface AutomationsViewProps {
  onTriggerRecipeTest: (recipeName: string) => void;
}

export const AutomationsView: React.FC<AutomationsViewProps> = ({
  onTriggerRecipeTest,
}) => {
  const [recipes, setRecipes] = useState<AutomationRecipe[]>([
    {
      id: 'rec-1',
      name: 'High-Value Inbound Lead Nurture',
      trigger: 'When lead score in CRM exceeds 80 and stage is Lead',
      actions: ['Jack drafts custom 25-seat tier email', 'Stages for user review in queue', 'Holds slot on calendar'],
      platforms: ['HubSpot CRM', 'Gmail', 'Google Calendar'],
      enabled: true,
      timesFired: 142,
      safeguardMode: 'Strict Human Approval'
    },
    {
      id: 'rec-2',
      name: 'Automated ROAS Defense & Ad Budget Reallocation',
      trigger: 'When any Meta AdSet ROAS falls under 3.2x over 72 hours',
      actions: ['Jack pauses underperforming creative', 'Stages $4,500 budget shift to top lookalike', 'Alerts executive on Slack'],
      platforms: ['Meta Ads', 'Slack'],
      enabled: true,
      timesFired: 28,
      safeguardMode: 'Strict Human Approval'
    },
    {
      id: 'rec-3',
      name: 'Executive Contract Acceleration Play',
      trigger: 'When CRM deal enters Negotiation ($50k+ ARR)',
      actions: ['Jack fetches customer SOC2 requirement', 'Drafts security packet email', 'Prepares redline briefing'],
      platforms: ['Salesforce', 'Outlook', 'Google Meet'],
      enabled: true,
      timesFired: 19,
      safeguardMode: 'Strict Human Approval'
    },
    {
      id: 'rec-4',
      name: 'Competitive Threat Counter-Positioning',
      trigger: 'When competitor announces pricing changes or new tier',
      actions: ['Jack compiles market comparison matrix', 'Updates CRM objection handling battlecard'],
      platforms: ['HubSpot CRM', 'Slack'],
      enabled: true,
      timesFired: 6,
      safeguardMode: 'Autonomous Guardrails'
    }
  ]);

  const toggleRecipe = (id: string) => {
    setRecipes(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const platforms = [
    { name: 'Gmail / Google Workspace', category: 'Email & Communications', status: 'Connected', ping: '12ms' },
    { name: 'Google Calendar & Meet', category: 'Scheduling', status: 'Connected', ping: '18ms' },
    { name: 'HubSpot CRM v3', category: 'Customer Relations', status: 'Connected', ping: '24ms' },
    { name: 'Salesforce Enterprise', category: 'Customer Relations', status: 'Connected', ping: '31ms' },
    { name: 'Meta Ads Manager', category: 'Performance Marketing', status: 'Connected', ping: '40ms' },
    { name: 'Slack Enterprise Grid', category: 'Executive Alerts', status: 'Connected', ping: '15ms' }
  ];

  return (
    <div id="automations-hub-module" className="space-y-4">
      {/* Header */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Workflow className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-semibold text-slate-100">
              Cross-Platform Professional Software Automation Hub
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automates complex business actions across CRM, marketing channels, and calendars with mandatory human-in-the-loop safeguards.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-emerald-400 font-mono px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> 6/6 Platforms Synced
          </span>
        </div>
      </div>

      {/* Connected Software Platforms */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {platforms.map((p, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-2">
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">{p.category}</span>
              <h5 className="text-xs font-semibold text-slate-200 mt-0.5 truncate">{p.name}</h5>
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/80">
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Connected
              </span>
              <span className="font-mono text-slate-500">{p.ping}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Active Autonomous Recipes */}
      <div className="space-y-3">
        {recipes.map((rec) => (
          <div
            key={rec.id}
            className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
              rec.enabled
                ? 'bg-slate-900/80 border-slate-800'
                : 'bg-slate-950/40 border-slate-800/50 opacity-60'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  {rec.name}
                </h4>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  {rec.safeguardMode}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Triggered {rec.timesFired} times
                </span>
              </div>

              <div className="text-xs text-slate-300">
                <span className="text-slate-500 font-medium">Trigger Condition:</span> {rec.trigger}
              </div>

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-500">Automated Pipeline:</span>
                {rec.actions.map((act, aIdx) => (
                  <span key={aIdx} className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
                    {act}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2 self-end md:self-center">
              <button
                type="button"
                onClick={() => onTriggerRecipeTest(rec.name)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                title="Simulate automated event"
              >
                <Play className="w-3.5 h-3.5 text-cyan-400" />
                <span>Test Fire</span>
              </button>

              <button
                type="button"
                onClick={() => toggleRecipe(rec.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  rec.enabled
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                {rec.enabled ? 'Active' : 'Paused'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
