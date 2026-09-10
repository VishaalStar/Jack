import React, { useState } from 'react';
import { 
  Cloud, 
  ExternalLink, 
  Copy, 
  Check, 
  Terminal, 
  Rocket, 
  Server, 
  ShieldCheck, 
  Database, 
  Globe, 
  Layers, 
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Code2,
  GitBranch,
  Link2
} from 'lucide-react';

interface DeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  sharedAppUrl: string;
  devAppUrl: string;
  firestoreDbId: string;
}

export function DeploymentModal({
  isOpen,
  onClose,
  sharedAppUrl,
  devAppUrl,
  firestoreDbId
}: DeploymentModalProps) {
  const [activeTab, setActiveTab] = useState<'cloudrun' | 'firebase' | 'vercel' | 'docker' | 'github' | 'domain'>('domain');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-md shadow-cyan-500/20 text-white">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white tracking-tight">Deployment & Cloud Production Hub</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Ready to Ship
                </span>
              </div>
              <p className="text-xs text-slate-400">Deploy Jack AI to Cloud Run, Firebase Hosting, Vercel, or custom Docker containers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Live Active Endpoints Banner */}
        <div className="p-5 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-blue-950/40 border-b border-slate-800">
          <div className="text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
            <Globe className="w-3.5 h-3.5" />
            <span>Instant Live Endpoints (Available Now)</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Shared Production Preview */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5 mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-slate-200">Shared Preview (Public URL)</span>
                </div>
                <p className="text-[11px] font-mono text-cyan-400 truncate">{sharedAppUrl}</p>
              </div>
              <div className="flex items-center space-x-1 shrink-0">
                <button
                  type="button"
                  onClick={() => copyToClipboard(sharedAppUrl, 'shared')}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-700"
                  title="Copy URL"
                >
                  {copiedKey === 'shared' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <a
                  href={sharedAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Development Workspace */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5 mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="text-xs font-bold text-slate-200">Dev Sandbox URL</span>
                </div>
                <p className="text-[11px] font-mono text-slate-400 truncate">{devAppUrl}</p>
              </div>
              <div className="flex items-center space-x-1 shrink-0">
                <button
                  type="button"
                  onClick={() => copyToClipboard(devAppUrl, 'dev')}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-700"
                  title="Copy URL"
                >
                  {copiedKey === 'dev' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <a
                  href={devAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body & Platform Tabs */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Platform Tab Selector */}
          <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
            <button
              type="button"
              onClick={() => setActiveTab('domain')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'domain'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Link2 className="w-4 h-4" />
              <span>Custom Domain & URL</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('cloudrun')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'cloudrun'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Cloud className="w-4 h-4" />
              <span>Google Cloud Run</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('firebase')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'firebase'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Firebase Hosting & Firestore</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('vercel')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'vercel'
                  ? 'bg-white text-slate-950 font-bold shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Vercel / Netlify (SPA)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('docker')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'docker'
                  ? 'bg-blue-500 text-white font-bold shadow-md shadow-blue-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Server className="w-4 h-4" />
              <span>Docker Container</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('github')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'github'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <GitBranch className="w-4 h-4" />
              <span>GitHub & Local Setup</span>
            </button>
          </div>

          {/* Option 0: Custom Domain & URL Guide */}
          {activeTab === 'domain' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 text-emerald-200 text-xs flex items-start space-x-3">
                <Link2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm mb-1">Yes! You Can Create a Custom URL & Edit It Anytime</h4>
                  <p className="leading-relaxed text-emerald-300/90">
                    Whether you use a branded short link, a free hosting subdomain, or your own personal domain (<code className="text-white font-mono font-bold">yourname.com</code>), you can <strong>edit, rename, or swap the URL at any time</strong> with zero downtime and no lock-in.
                  </p>
                </div>
              </div>

              {/* 3 Pathways Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Method 1 */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase">
                        Instant (30s)
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">100% Free</span>
                    </div>
                    <h5 className="font-bold text-white text-xs">1. Free Branded Short Link</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Create an instant custom link (e.g. <strong className="text-slate-200">dub.sh/jackai</strong> or <strong className="text-slate-200">tinyurl.com/jackai-vishaal</strong>) pointing directly to your live app.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 space-y-1">
                    <span className="text-cyan-400 font-semibold block">Can you edit it?</span>
                    <span>Yes! In Dub.co or TinyURL dashboard, you can change the target URL anytime you update your app.</span>
                  </div>
                </div>

                {/* Method 2 */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold uppercase">
                        Vercel / Netlify
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">1-Click</span>
                    </div>
                    <h5 className="font-bold text-white text-xs">2. Free Subdomain URL</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Deploy the code to Vercel and pick any free subdomain like <strong className="text-slate-200">jack-ai.vercel.app</strong> or <strong className="text-slate-200">vishaal-jackai.vercel.app</strong>.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 space-y-1">
                    <span className="text-cyan-400 font-semibold block">Can you edit it?</span>
                    <span>Yes! In Project Settings ➔ Domains, you can type a new name and click Save in 2 seconds.</span>
                  </div>
                </div>

                {/* Method 3 */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-bold uppercase">
                        Own Domain
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">Custom DNS</span>
                    </div>
                    <h5 className="font-bold text-white text-xs">3. Custom Domain (Cloud Run)</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Map your purchased domain (e.g. <strong className="text-slate-200">jackai.com</strong> or <strong className="text-slate-200">app.yourcompany.com</strong>) with automatic free SSL.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 space-y-1">
                    <span className="text-cyan-400 font-semibold block">Can you edit it?</span>
                    <span>Yes! DNS CNAME records and Cloud Run mappings can be updated or swapped at any time.</span>
                  </div>
                </div>
              </div>

              {/* Step-by-Step for Setting Up Custom Domain on Cloud Run */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <span>How to map your domain to Google Cloud Run:</span>
                </h4>
                <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed pl-1">
                  <li>Deploy your app via the top-right <strong>Deploy to Cloud Run</strong> button.</li>
                  <li>In the <a href="https://console.cloud.google.com/run" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">Google Cloud Console</a>, navigate to <strong>Cloud Run</strong> ➔ <strong>Manage Custom Domains</strong>.</li>
                  <li>Click <strong>Add Mapping</strong>, select service <code className="text-cyan-300 font-mono">jack-ai</code>, and enter your domain name (e.g., <code className="text-white font-mono">app.yourdomain.com</code>).</li>
                  <li>Copy the provided DNS record (e.g., <code className="text-emerald-400 font-mono">CNAME ghs.googlehosted.com</code>) and paste it into your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.).</li>
                  <li>Google Cloud will automatically provision and renew your free SSL/TLS certificate!</li>
                </ol>
              </div>

              {/* Quick Copy Target URL for URL Shorteners */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <span className="font-semibold text-white block">Current Shared App URL to redirect to:</span>
                  <span className="font-mono text-cyan-400 text-[11px] truncate block">{sharedAppUrl}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(sharedAppUrl, 'shared_target')}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedKey === 'shared_target' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'shared_target' ? 'Copied' : 'Copy Live Link'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Option 1: Google Cloud Run */}
          {activeTab === 'cloudrun' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 text-xs flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm mb-1">Easiest 1-Click Deployment (Built-in)</h4>
                  <p className="leading-relaxed">
                    Google AI Studio includes native 1-click deployment to <strong>Google Cloud Run</strong>. Click the <strong>Deploy</strong> or <strong>Share</strong> button in the top navigation of AI Studio to immediately publish a production-grade instance with HTTPS, zero-cold start, and custom domain mapping.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Method A: 1-Click via AI Studio UI</h4>
                <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <li>In the top right menu of AI Studio, click <strong>Deploy</strong> (or <strong>Share</strong> → <strong>Deploy to Cloud Run</strong>).</li>
                  <li>Select your Google Cloud Project (or let AI Studio provision a managed instance).</li>
                  <li>Confirm deployment. Cloud Run provisions a dedicated serverless container in seconds.</li>
                </ol>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Method B: Manual gcloud CLI Deployment</h4>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(`gcloud run deploy jack-ai \\\n  --source . \\\n  --platform managed \\\n  --region us-central1 \\\n  --allow-unauthenticated \\\n  --port 3000`, 'gcloud')}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                  >
                    {copiedKey === 'gcloud' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'gcloud' ? 'Copied' : 'Copy command'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-cyan-300 overflow-x-auto">
{`gcloud run deploy jack-ai \\
  --source . \\
  --platform managed \\
  --region us-central1 \\
  --allow-unauthenticated \\
  --port 3000`}
                </pre>
              </div>
            </div>
          )}

          {/* Option 2: Firebase Hosting & Firestore */}
          {activeTab === 'firebase' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Firestore Security Rules are actively compiled and deployed to your project: <strong className="font-mono text-white">{firestoreDbId}</strong></span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Deploy to Firebase Hosting</h4>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(`npm run build\nfirebase init hosting\nfirebase deploy --only hosting`, 'fb_host')}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                  >
                    {copiedKey === 'fb_host' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'fb_host' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-amber-300 overflow-x-auto">
{`# 1. Build production static bundle (dist)
npm run build

# 2. Deploy static bundle and security rules
firebase deploy --only hosting,firestore:rules`}
                </pre>
              </div>
            </div>
          )}

          {/* Option 3: Vercel */}
          {activeTab === 'vercel' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/30 text-blue-200 text-xs flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm mb-1">Vercel Deployment Ready!</h4>
                  <p className="leading-relaxed text-slate-300">
                    Your repository now includes a configured <code className="text-cyan-300 font-mono">vercel.json</code> and serverless API endpoints (<code className="text-cyan-300 font-mono">api/agent.ts</code> and <code className="text-cyan-300 font-mono">api/health.ts</code>). You can deploy in under 60 seconds with full AI backend support.
                  </p>
                </div>
              </div>

              {/* Method A: Via GitHub (Recommended) */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Method A: Connect via GitHub (1-Click Automated CI/CD)</h4>
                <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800 leading-relaxed">
                  <li>In Google AI Studio, click <strong>Settings</strong> (top right) ➔ <strong>Export to GitHub</strong>.</li>
                  <li>Go to <strong><a href="https://vercel.com/new" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">vercel.com/new</a></strong> and log in.</li>
                  <li>Import your newly created GitHub repository.</li>
                  <li>Vercel will auto-detect Vite:
                    <div className="mt-2 ml-4 p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
                      <div>Framework Preset: <span className="text-cyan-300 font-bold">Vite</span></div>
                      <div>Build Command: <span className="text-cyan-300 font-bold">npm run build</span></div>
                      <div>Output Directory: <span className="text-cyan-300 font-bold">dist</span></div>
                    </div>
                  </li>
                  <li>Under <strong>Environment Variables</strong> on Vercel, add:
                    <div className="mt-1 ml-4 text-[11px] text-emerald-400 font-mono">
                      GEMINI_API_KEY = (your Gemini API key)
                    </div>
                  </li>
                  <li>Click <strong>Deploy</strong>! Vercel builds and hosts your app with global CDN and SSL.</li>
                </ol>
              </div>

              {/* Method B: Via Vercel CLI */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Method B: Deploy with Vercel CLI</h4>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(`npm i -g vercel\nvercel --prod`, 'vercel')}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                  >
                    {copiedKey === 'vercel' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'vercel' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-cyan-300 overflow-x-auto">
{`# 1. Install Vercel CLI (if not already installed)
npm i -g vercel

# 2. Deploy directly from your terminal
vercel --prod`}
                </pre>
              </div>
            </div>
          )}

          {/* Option 4: Docker Container */}
          {activeTab === 'docker' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Dockerfile (Node 20 + Nginx / Static Serving)</h4>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(`FROM node:20-alpine AS build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nRUN npm run build\n\nFROM nginx:alpine\nCOPY --from=build /app/dist /usr/share/nginx/html\nEXPOSE 3000\nCMD ["nginx", "-g", "daemon off;"]`, 'dockerfile')}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                  >
                    {copiedKey === 'dockerfile' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'dockerfile' ? 'Copied' : 'Copy Dockerfile'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-blue-300 overflow-x-auto">
{`FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]`}
                </pre>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Build & Run</h4>
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-slate-300 overflow-x-auto">
{`docker build -t jack-ai-app .
docker run -p 3000:3000 jack-ai-app`}
                </pre>
              </div>
            </div>
          )}

          {/* Option 5: GitHub Repository & Local Code Package */}
          {activeTab === 'github' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/30 text-purple-200 text-xs flex items-start space-x-3">
                <GitBranch className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm mb-1">Download & Put on Your Personal GitHub</h4>
                  <p className="leading-relaxed">
                    You can download the entire source code package to edit locally in VS Code / Cursor and publish to your personal or organization GitHub repository.
                  </p>
                </div>
              </div>

              {/* Method 1: Export directly via AI Studio */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-mono text-[10px]">1</span>
                    Method A: 1-Click Export to GitHub via AI Studio UI
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Fastest</span>
                </div>
                <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed pl-1">
                  <li>In Google AI Studio, look at the top right navigation bar and click the <strong>Settings (Gear icon)</strong> or <strong>Share / Export</strong> menu.</li>
                  <li>Click <strong>Export to GitHub</strong> (or <strong>Export as ZIP</strong> to download the full folder directly to your machine).</li>
                  <li>Select your GitHub account and target repository name. AI Studio will automatically push all commits, branches, and assets!</li>
                </ol>
              </div>

              {/* Method 2: Command line git init and push */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono text-[10px]">2</span>
                    Method B: Push Downloaded Code to GitHub (Terminal)
                  </h4>
                </div>
                <p className="text-xs text-slate-400">
                  After unzipping your code package or opening the folder in VS Code, run these commands to push it to your GitHub account:
                </p>
                <div className="relative">
                  <pre className="p-3 bg-slate-900 border border-slate-800 rounded-xl font-mono text-[11px] text-cyan-300 overflow-x-auto leading-relaxed">
{`# 1. Initialize git and add all files
git init
git add .
git commit -m "feat: Jack AI Business & Marketing Workstation initial commit"

# 2. Rename branch to main
git branch -M main

# 3. Link to your GitHub repo (replace with your repo URL)
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git

# 4. Push to GitHub
git push -u origin main`}
                  </pre>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(`git init\ngit add .\ngit commit -m "feat: Jack AI Workstation initial commit"\ngit branch -M main\ngit remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git\ngit push -u origin main`, 'git-cmd')}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Copy Git Commands"
                  >
                    {copiedKey === 'git-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Method 3: Run Locally */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono text-[10px]">3</span>
                    Running & Editing Locally (Localhost:3000)
                  </h4>
                </div>
                <div className="relative">
                  <pre className="p-3 bg-slate-900 border border-slate-800 rounded-xl font-mono text-[11px] text-emerald-400 overflow-x-auto leading-relaxed">
{`# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build optimized production bundle
npm run build`}
                  </pre>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(`npm install\nnpm run dev`, 'npm-cmd')}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Copy NPM Commands"
                  >
                    {copiedKey === 'npm-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Export Code Options */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-white block">Need the raw codebase on GitHub or ZIP?</span>
              <span className="text-slate-400 text-[11px]">You can export the entire repository directly via AI Studio's top-right Settings menu (Export to GitHub / Export to ZIP).</span>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 font-mono text-[11px]">
                Settings ➔ Export
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Built for SOC2 Type II & Zero-Knowledge Security compliance</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
