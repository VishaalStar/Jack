import React, { useState } from 'react';
import { 
  BarChart2, 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Sparkles, 
  Download, 
  Filter, 
  ArrowUpRight, 
  CheckCircle2, 
  Target,
  Layers
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Legend 
} from 'recharts';
import { MarketingMetrics } from '../types';

interface AnalyticsViewProps {
  metrics: MarketingMetrics;
  onAskJackForReport: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  metrics,
  onAskJackForReport,
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'quarter'>('7d');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExport = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div id="analytics-reports-module" className="space-y-4">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart2 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-semibold text-slate-100">
              Marketing Performance & Revenue Intelligence
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-touch attribution, CAC vs. LTV velocity, and automated ROAS optimization plays.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            {(['7d', '30d', 'quarter'] as const).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-md font-medium transition-all ${
                  timeRange === range
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {range === '7d' ? 'Last 7 Days' : range === '30d' ? '30 Days' : 'Q3 2026'}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onAskJackForReport}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Jack Executive Analysis</span>
          </button>

          <button
            type="button"
            onClick={handleExport}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>{downloadSuccess ? 'Downloaded!' : 'Export PDF'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Blended ROAS</span>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +14.2%
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono">
            {metrics.roas}x
          </div>
          <span className="text-[11px] text-slate-400">Target benchmark: &gt; 3.5x</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Customer Acquisition (CAC)</span>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center">
              <ArrowUpRight className="w-3 h-3" /> -$12.40
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono">
            ${metrics.cac.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-400">Healthy LTV/CAC ratio: 4.8:1</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Funnel Conversion Rate</span>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +0.6%
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono">
            {metrics.conversionRate}%
          </div>
          <span className="text-[11px] text-slate-400">Visitor-to-MQL efficiency</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Email Open Rate</span>
            <span className="text-[11px] text-cyan-400 font-semibold">
              Industry Top 5%
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono">
            {metrics.emailOpenRate}%
          </div>
          <span className="text-[11px] text-slate-400">Lead velocity: +{metrics.leadVelocityRate}%</span>
        </div>
      </div>

      {/* Attribution Chart & Funnel Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Multi-touch attribution trend */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-slate-100">Daily Channel Attribution</h4>
              <p className="text-xs text-slate-400">Leads generated across marketing channels</p>
            </div>
            <div className="text-xs text-slate-500 font-mono">7-Day Trailing</div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.dailyAttribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSocial" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEmail" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="paidSocial" name="Paid Social (Meta/LinkedIn)" stroke="#06b6d4" fillOpacity={1} fill="url(#colorSocial)" />
                <Area type="monotone" dataKey="coldEmail" name="Cold Email Sequences" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorEmail)" />
                <Area type="monotone" dataKey="organic" name="Organic Search" stroke="#10b981" fillOpacity={1} fill="url(#colorOrganic)" />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Marketing Funnel Dropoff */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-100">Full-Funnel Conversion Analysis</h4>
                <p className="text-xs text-slate-400">Ad impressions to Closed-Won conversions</p>
              </div>
              <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Healthy Pipeline
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {metrics.funnelMetrics.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{item.stage}</span>
                    <span className="font-mono text-slate-200">{item.count.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        idx === 0 ? 'bg-cyan-500' : idx === 1 ? 'bg-blue-500' : idx === 2 ? 'bg-indigo-500' : idx === 3 ? 'bg-purple-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.max(8, 100 - idx * 20)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-xs text-cyan-200 flex items-start space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-cyan-300">Jack Recommendation:</span>
              <p className="text-slate-300 mt-0.5">
                MQL to Meeting conversion is 25.5%. Jack has automated personal follow-up email drafts for all leads with score &gt; 80, projecting a +18% increase in booked sales demos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
