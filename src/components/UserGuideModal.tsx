import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Copy, 
  Check, 
  X, 
  ShieldCheck, 
  Users, 
  Building2, 
  Mail, 
  Lock, 
  Sparkles,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserGuideModal({ isOpen, onClose }: UserGuideModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const text = `
JACK AI - EXECUTIVE & CUSTOMER OPERATIONS GUIDE
Jack of all trades AI for business • Autonomous Operations with Human-In-The-Loop Safeguards

1. PLATFORM OVERVIEW
Jack AI is an autonomous business and marketing intelligence agent built for executive teams and modern enterprises. It unifies email drafting, competitor intelligence, CRM pipeline management, meeting briefings, and performance analytics into a single command center.

2. ZERO BLIND SENDS: THE SAFEGUARD APPROVAL QUEUE
To protect corporate reputation, Jack AI operates with a strict Human-In-The-Loop (HITL) rule. 
• Jack generates outreach emails, proposal drafts, and CRM updates, but holds them in the Safeguard Staged Queue.
• Operators inspect the recipient, subject, body, and cryptographic checksum.
• Nothing is dispatched to Gmail, Outlook, or HubSpot until an authorized operator clicks "Approve & Execute".

3. DEMO ORGANIZATION & REAL-TIME MULTI-USER COLLABORATION
• Active Workspace: Pre-configured with the "Demo" organization.
• Test Operator: Alex Vance (Operations Lead, alex.vance@demo.co).
• How to test real-time sync:
  1. Open the "Demo" organization in your current browser.
  2. Click the organization switcher in the header to open Multi-Tenant Governance.
  3. Click "Add Team Member" and invite a second user (e.g. colleague@demo.co).
  4. Open Jack AI in a secondary window or tab. Changes made in one window synchronize instantly via Firebase Firestore real-time snapshots.

4. CRM & DEALS: FROM CLEAN EXAMPLE TO LIVE DATA
• The platform currently features a single minimal example deal (Jordan Hayes at Apex Partner Corp, $45,000) to keep your testing focused and uncluttered.
• When you are ready for production, connecting your live Google Workspace or creating customer deals instantly transitions the workspace into live real-time mode.

5. CORPORATE AUTHENTICATION & SESSION CACHING
• Sign in using Google Identity or your Corporate Work Email.
• Session Caching: Your authenticated session is securely preserved in local storage and Firebase Auth state, allowing immediate re-entry without re-typing credentials.
• Role-Based Access: Super Admin (global governance), Org Head (manages company tenant), Org Member (collaborator).

6. ENTERPRISE SECURITY & DATA PRIVACY
• Zero-Knowledge Enclave: Client-side AES-256 GCM cryptographic hashes for every staged action.
• Multi-Tenant Isolation: Enforced through Firebase Firestore Attribute-Based Access Control (ABAC) security rules.
• Zero Training: Customer proprietary data and emails are never used to train third-party foundation models.
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70 print:hidden">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">Jack AI Operations & Security Guide</h2>
              <p className="text-xs text-slate-400">Executive manual for administrators and client onboarding</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleCopyText}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors flex items-center space-x-1.5"
              title="Copy guide text"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors ml-2"
              title="Close guide"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable & Scrollable Guide Document */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-8 text-slate-200 text-sm font-sans leading-relaxed print:p-0 print:text-black print:bg-white">
          {/* Document Header */}
          <div className="border-b border-slate-800 pb-6 print:border-gray-300">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold print:text-blue-700">
                  Enterprise Documentation • Version 3.2
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 print:text-black">
                  Jack AI: Executive & Customer Operations Guide
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 print:text-gray-600">
                  Autonomous Multi-Task Business Operations with Safeguard Approval Queues & Real-Time Sync
                </p>
              </div>

              <div className="hidden sm:flex flex-col text-right text-xs text-slate-400 print:text-gray-500">
                <span className="font-semibold text-slate-300 print:text-black">Zero-Knowledge Enclave</span>
                <span>SOC2 Type II & GDPR Aligned</span>
              </div>
            </div>
          </div>

          {/* Section 1: The "Jack of All Trades" Concept */}
          <section className="space-y-3">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold text-base print:text-blue-700">
              <Sparkles className="w-4 h-4" />
              <h2>1. Platform Overview: "Jack of All Trades" for Business</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed print:text-gray-800">
              Jack AI is designed to serve as an autonomous executive copilot across all everyday commercial workflows. Rather than requiring separate point solutions for email communications, meeting briefings, competitive intelligence, CRM management, and ad analytics, Jack unifies them under a proactive natural intelligence model that responds instantly to voice and text instructions.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 print:bg-gray-50 print:border-gray-200">
                <span className="font-bold text-xs text-white print:text-black block mb-1">What Jack Executes Autonomously</span>
                <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside print:text-gray-700">
                  <li>Contextual email drafting tailored to ongoing deals</li>
                  <li>Pre-meeting talking point briefings</li>
                  <li>Competitor pricing & feature battlecards</li>
                  <li>Daily priority ranking by revenue impact</li>
                </ul>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 print:bg-gray-50 print:border-gray-200">
                <span className="font-bold text-xs text-white print:text-black block mb-1">What Jack Never Does Blindly</span>
                <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside print:text-gray-700">
                  <li>Never sends customer emails without your click</li>
                  <li>Never alters live CRM records without approval</li>
                  <li>Never schedules high-stake meetings unprompted</li>
                  <li>Never exposes private data to LLM public training</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2: Zero Blind Sends */}
          <section className="space-y-3">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-base print:text-amber-700">
              <ShieldAlert className="w-4 h-4" />
              <h2>2. Zero Blind Sends: The Safeguard Staged Queue</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed print:text-gray-800">
              Autonomous AI should never run unchecked in corporate environments. In Jack AI, every communication, outbound message, and pipeline modification is intercepted by our <strong>Human-In-The-Loop (HITL) Safeguard Engine</strong>.
            </p>
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-slate-300 space-y-2 print:bg-amber-50 print:border-amber-200 print:text-gray-800">
              <p><strong>How the Review Flow Works:</strong></p>
              <ol className="list-decimal list-inside space-y-1 text-slate-400 print:text-gray-700">
                <li><strong>Trigger:</strong> Jack detects an email reply is needed or an outbound proposal should be drafted.</li>
                <li><strong>Staging:</strong> The email draft is placed into the <em>Safeguard Staged Queue</em> with an AES-256 integrity checksum.</li>
                <li><strong>Inspection & Inline Edits:</strong> You or your delegated team lead can click on the draft, edit recipient wording directly, or review security badges.</li>
                <li><strong>Authorization:</strong> Clicking <em>"Approve & Execute"</em> officially dispatches the message and writes an immutable entry into the compliance audit log.</li>
              </ol>
            </div>
          </section>

          {/* Section 3: Testing the Demo Organization & Real-time Sync */}
          <section className="space-y-3">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold text-base print:text-blue-700">
              <Building2 className="w-4 h-4" />
              <h2>3. Testing the "Demo" Organization & Real-Time Sync</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed print:text-gray-800">
              To keep your testing completely transparent and predictable, all sample clutter has been removed. The application is seeded with exactly <strong>one active organization ("Demo")</strong> and <strong>one test operator ("Alex Vance", Operations Lead, alex.vance@demo.co)</strong>.
            </p>
            
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3 print:bg-gray-50 print:border-gray-200">
              <h4 className="font-bold text-xs text-white print:text-black">How to Test Real-Time Multi-User Collaboration:</h4>
              <div className="space-y-2 text-xs text-slate-300 print:text-gray-700">
                <div className="flex items-start space-x-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                  <span><strong>Open the Workspace:</strong> You are currently signed in with cached credentials for the Demo organization.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                  <span><strong>Invite a Second User:</strong> In the top bar, click the <em>Organization ("Demo")</em> button to open Multi-Tenant Governance. Use <em>"Add Team Member"</em> to add a colleague or second test email (e.g. <code>tester2@demo.co</code>).</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                  <span><strong>Simultaneous Verification:</strong> Open the app in a second browser window. Any staged action approved, email received, or task toggled in one window will reflect in real time without refreshing, powered by Firebase Firestore listeners.</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: CRM & Deals Streamlined */}
          <section className="space-y-3">
            <div className="flex items-center space-x-2 text-blue-400 font-bold text-base print:text-blue-700">
              <Users className="w-4 h-4" />
              <h2>4. CRM & Deals: Streamlined for Live Real-Time Data</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed print:text-gray-800">
              Per your directive, dozens of fake deals have been removed. The CRM currently contains a single clean reference contact: <strong>Jordan Hayes at Apex Partner Corp ($45,000, Proposal Stage)</strong>.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed print:text-gray-600">
              When your team begins daily operations, you can easily add custom contacts via the <em>"Add Contact / Deal"</em> button or connect your Google Workspace mailbox. As live inbound emails arrive, Jack AI will automatically extract deal velocity and keep your pipeline up to date.
            </p>
          </section>

          {/* Section 5: Authentication, Session Caching & Security */}
          <section className="space-y-3">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-base print:text-emerald-700">
              <Lock className="w-4 h-4" />
              <h2>5. Authentication, Session Caching & Security Architecture</h2>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-300 print:text-gray-800">
              <p>
                <strong>Corporate Identity:</strong> Operators and clients can sign in using Google Identity or their Corporate Work Email.
              </p>
              <p>
                <strong>Intelligent Session Caching:</strong> Once signed in, your session token and profile state are preserved locally. When you return to the Welcome Portal, Jack detects your cached credentials and allows one-click instant access to your AI Workstation.
              </p>
              <p>
                <strong>Zero-Knowledge Multi-Tenant Enclave:</strong> Every organization document in Firebase Firestore is governed by Attribute-Based Access Control (ABAC). Users can only read and mutate documents belonging to their assigned tenant ID, verified against their authenticated identity.
              </p>
            </div>
          </section>

          {/* Section 6: Quick Reference Checklist */}
          <section className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs print:bg-gray-100 print:border-gray-300">
            <div className="font-bold text-slate-200 print:text-black">Quick Operator Checklist:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-400 print:text-gray-700">
              <div className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>One clean organization: Demo</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>One test operator: Alex Vance</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero blind sends safeguard active</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Live Firebase Firestore real-time sync</span>
              </div>
            </div>
          </section>

          {/* Sign-off footer */}
          <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 print:text-gray-500">
            <span>Prepared for: Vishaal S. (Platform Administrator) & Commercial Clients</span>
            <span>Jack AI Autonomous Suite • All Rights Reserved</span>
          </div>
        </div>
      </div>
    </div>
  );
}
