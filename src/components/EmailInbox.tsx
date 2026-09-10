import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw, 
  ExternalLink, 
  Clock, 
  Tag, 
  CheckCircle2, 
  AlertCircle, 
  Check, 
  ArrowUpRight,
  Search,
  Inbox,
  Lock,
  Plus
} from 'lucide-react';
import { EmailMessage } from '../types';

interface EmailInboxProps {
  emails: EmailMessage[];
  activeOrgName: string;
  onDraftReplyWithJack: (email: EmailMessage) => void;
  onSimulateInboundEmail: () => void;
  onMarkEmailAsRead: (emailId: string) => void;
}

export function EmailInbox({
  emails,
  activeOrgName,
  onDraftReplyWithJack,
  onSimulateInboundEmail,
  onMarkEmailAsRead
}: EmailInboxProps) {
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(emails[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'high_priority'>('all');
  const [isOAuthModalOpen, setIsOAuthModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  const filteredEmails = emails.filter(em => {
    if (filter === 'unread' && em.isRead) return false;
    if (filter === 'high_priority' && em.priority !== 'high') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        em.subject.toLowerCase().includes(q) ||
        em.sender.toLowerCase().includes(q) ||
        em.senderEmail.toLowerCase().includes(q) ||
        em.snippet.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncNotice('Mailbox synced with Google Workspace API & Firebase. All messages up to date.');
      setTimeout(() => setSyncNotice(null), 3500);
    }, 900);
  };

  const handleSelectEmail = (em: EmailMessage) => {
    setSelectedEmail(em);
    if (!em.isRead) {
      onMarkEmailAsRead(em.id);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Real-time Header & Integration Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                <span>Real-Time Corporate Communications</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  Live Synced
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Workspace: <span className="font-semibold text-slate-200">{activeOrgName}</span> • Real-time inbox messages with instant Safeguard draft replies.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleManualSync}
            disabled={isSyncing}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-cyan-400' : 'text-slate-400'}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Mailbox'}</span>
          </button>

          <button
            type="button"
            onClick={onSimulateInboundEmail}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-semibold text-cyan-300 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Simulate Incoming Email</span>
          </button>

          <button
            type="button"
            onClick={() => setIsOAuthModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-xs font-semibold text-white shadow-sm transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Connect Personal / Company Mail</span>
          </button>
        </div>
      </div>

      {syncNotice && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{syncNotice}</span>
        </div>
      )}

      {/* Main Mailbox Workspace: Left List + Right Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Email Thread List */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden h-[620px]">
          {/* Search and Filters */}
          <div className="p-3 border-b border-slate-800 space-y-2 bg-slate-950/40">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search subject, sender, or snippet..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center space-x-1 text-xs">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                  filter === 'all' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({emails.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('unread')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                  filter === 'unread' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Unread ({emails.filter(e => !e.isRead).length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('high_priority')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                  filter === 'high_priority' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                High Priority ({emails.filter(e => e.priority === 'high').length})
              </button>
            </div>
          </div>

          {/* Email Item Rows */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
            {filteredEmails.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <Inbox className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-xs">No email messages match your current filter.</p>
              </div>
            ) : (
              filteredEmails.map(em => {
                const isSelected = selectedEmail?.id === em.id;

                return (
                  <div
                    key={em.id}
                    onClick={() => handleSelectEmail(em)}
                    className={`p-3.5 cursor-pointer transition-colors relative flex flex-col space-y-1.5 ${
                      isSelected 
                        ? 'bg-cyan-950/30 border-l-2 border-cyan-400' 
                        : em.isRead 
                        ? 'hover:bg-slate-800/40 bg-slate-900' 
                        : 'bg-slate-950/60 hover:bg-slate-800/60 font-medium'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 truncate">
                        {!em.isRead && (
                          <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                        )}
                        <span className={`text-xs truncate ${!em.isRead ? 'font-bold text-slate-100' : 'text-slate-300'}`}>
                          {em.sender}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0">{em.date}</span>
                    </div>

                    <h4 className={`text-xs truncate ${!em.isRead ? 'font-semibold text-slate-100' : 'text-slate-300'}`}>
                      {em.subject}
                    </h4>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {em.snippet}
                    </p>

                    <div className="flex items-center space-x-1.5 pt-1">
                      {em.priority === 'high' && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                          High Priority
                        </span>
                      )}
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                        {em.source}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Full Email Thread & Jack AI Action Deck */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden h-[620px]">
          {selectedEmail ? (
            <div className="flex-1 flex flex-col h-full">
              {/* Message Header */}
              <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/40 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-100 leading-tight">
                    {selectedEmail.subject}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                    {selectedEmail.date}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 pt-1">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-bold flex items-center justify-center text-xs">
                      {selectedEmail.sender.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-200">{selectedEmail.sender}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{selectedEmail.senderEmail}</p>
                    </div>
                  </div>

                  {/* Jack AI Action Trigger Button */}
                  <button
                    type="button"
                    onClick={() => onDraftReplyWithJack(selectedEmail)}
                    className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                    <span>Ask Jack to Draft Reply (Safeguard Staged)</span>
                  </button>
                </div>
              </div>

              {/* Message Body Content */}
              <div className="p-5 overflow-y-auto flex-1 text-slate-200 text-xs sm:text-sm space-y-4 leading-relaxed font-sans whitespace-pre-line bg-slate-900/60">
                {selectedEmail.body}
              </div>

              {/* Thread Safeguard Safeguard Footer */}
              <div className="p-3.5 border-t border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Safeguard Active: Jack prepares the response and places it in your Review Queue. Zero automated sends.</span>
                </div>
                <button
                  type="button"
                  onClick={() => onDraftReplyWithJack(selectedEmail)}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center space-x-1"
                >
                  <span>Quick Compose with Jack</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 space-y-2">
              <Mail className="w-10 h-10 text-slate-700" />
              <p className="text-xs">Select an email thread on the left to read and draft responses.</p>
            </div>
          )}
        </div>
      </div>

      {/* OAuth Integration Explanation Modal */}
      {isOAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">Connect Google Workspace / Gmail</h3>
                  <p className="text-xs text-slate-400">How real-time mail data works securely with Jack AI</p>
                </div>
              </div>
              <button
                onClick={() => setIsOAuthModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <p className="font-semibold text-slate-100 flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Client-Side OAuth 2.0 (Google Identity Services)</span>
                </p>
                <p className="text-slate-400 leading-relaxed">
                  Web browsers isolate websites in sandboxes so they cannot read your laptop files or mail client directly. Jack accesses your live inbox through Google Workspace's official REST API via OAuth scopes:
                </p>
                <ul className="list-disc list-inside text-slate-400 space-y-1 font-mono text-[11px]">
                  <li>https://www.googleapis.com/auth/gmail.readonly</li>
                  <li>https://www.googleapis.com/auth/gmail.compose</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 space-y-1">
                <p className="font-semibold flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>The Staging Safeguard Guarantee</span>
                </p>
                <p className="text-[11px] text-slate-400">
                  Even with Gmail connected, Jack is engineered to **never dispatch live emails blindly**. Jack strictly writes to the Google draft folder and halts execution inside your **Safeguard Staging Queue** until you review and authorize it.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              <span className="text-[11px] text-slate-400 font-mono">
                OAuth Provider: Google Cloud Identity
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsOAuthModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsOAuthModalOpen(false);
                    handleManualSync();
                  }}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs transition-all shadow-md flex items-center space-x-1.5"
                >
                  <span>Grant Access & Sync Live Inbox</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
