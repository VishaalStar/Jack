import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Send, 
  Lock, 
  ExternalLink, 
  Mail, 
  Calendar, 
  Database, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  FileText
} from 'lucide-react';
import { StagedAction } from '../types';

interface ApprovalQueueProps {
  stagedActions: StagedAction[];
  onApproveAction: (actionId: string) => void;
  onRejectAction: (actionId: string) => void;
  onUpdateActionPayload: (actionId: string, updatedDetails: Partial<StagedAction['details']>) => void;
}

export const ApprovalQueue: React.FC<ApprovalQueueProps> = ({
  stagedActions,
  onApproveAction,
  onRejectAction,
  onUpdateActionPayload,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState('');
  const [editBody, setEditBody] = useState('');
  const [filterTab, setFilterTab] = useState<'pending' | 'executed' | 'all'>('pending');

  const pendingActions = stagedActions.filter(a => a.status === 'staged_for_approval');
  const executedActions = stagedActions.filter(a => a.status === 'approved_and_executed');

  const displayedActions = filterTab === 'pending' 
    ? pendingActions 
    : filterTab === 'executed' 
    ? executedActions 
    : stagedActions;

  const startEditing = (action: StagedAction) => {
    setEditingId(action.id);
    setEditSubject(action.details.subject || '');
    setEditBody(action.details.body || '');
  };

  const saveEdit = (actionId: string) => {
    onUpdateActionPayload(actionId, {
      subject: editSubject,
      body: editBody,
    });
    setEditingId(null);
  };

  const getPlatformIcon = (platform: StagedAction['targetPlatform']) => {
    switch (platform) {
      case 'Gmail':
      case 'Outlook':
        return <Mail className="w-4 h-4 text-rose-400" />;
      case 'Google Calendar':
        return <Calendar className="w-4 h-4 text-blue-400" />;
      case 'HubSpot CRM':
      case 'Salesforce':
        return <Database className="w-4 h-4 text-amber-400" />;
      default:
        return <FileText className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div id="approval-queue-section" className="space-y-4">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-cyan-400" />
              Safeguard Staged Actions Queue
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              {pendingActions.length} Pending Review
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            "Do the work, but don't send without review" safety protocol. Jack prepares high-converting emails, CRM changes, and tasks with zero blind dispatches.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setFilterTab('pending')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              filterTab === 'pending'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pending ({pendingActions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('executed')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              filterTab === 'executed'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Executed ({executedActions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              filterTab === 'all'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Logs ({stagedActions.length})
          </button>
        </div>
      </div>

      {/* List of Staged Actions */}
      {displayedActions.length === 0 ? (
        <div className="p-10 rounded-xl bg-slate-900/40 border border-slate-800/80 text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-400/60 mx-auto mb-3" />
          <h4 className="text-sm font-semibold text-slate-200">No Staged Actions In This Filter</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Give Jack a command like <span className="text-cyan-300 font-mono">"Jack send an email to Sarah with Q3 pricing"</span> to see him generate and stage the action safely.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {displayedActions.map((action) => {
            const isEditing = editingId === action.id;
            const isPending = action.status === 'staged_for_approval';

            return (
              <div
                key={action.id}
                id={`staged-action-${action.id}`}
                className={`rounded-xl border transition-all p-5 ${
                  isPending
                    ? 'bg-slate-900/90 border-cyan-500/40 shadow-lg shadow-cyan-950/20'
                    : 'bg-slate-900/40 border-slate-800/80 opacity-80'
                }`}
              >
                {/* Header of card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                      {getPlatformIcon(action.targetPlatform)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Target Platform:
                        </span>
                        <span className="text-xs font-semibold text-slate-200 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                          {action.targetPlatform}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {action.createdAt}
                        </span>
                      </div>
                      <h4 className="text-base font-semibold text-slate-100 mt-0.5">
                        {action.title}
                      </h4>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center space-x-2">
                    {isPending ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        <Lock className="w-3 h-3 text-amber-400" />
                        STAGED • HELD FOR REVIEW
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        APPROVED & EXECUTED
                      </span>
                    )}
                  </div>
                </div>

                {/* Body details */}
                <div className="py-4 space-y-3">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {action.description}
                  </p>

                  {/* Email Draft Preview */}
                  {action.details.recipient && (
                    <div className="rounded-lg bg-slate-950/80 border border-slate-800/80 p-4 space-y-2.5 font-sans">
                      <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800/60 text-slate-400">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-slate-500">To:</span>
                          <span className="text-cyan-300 font-medium">{action.details.recipientName || action.details.recipient}</span>
                          <span className="text-slate-500 font-mono">({action.details.recipient})</span>
                        </div>
                        <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> PII Encrypted
                        </span>
                      </div>

                      {isEditing ? (
                        <div className="space-y-2">
                          <div>
                            <label className="text-[11px] text-slate-400 font-medium">Subject Line</label>
                            <input
                              type="text"
                              value={editSubject}
                              onChange={(e) => setEditSubject(e.target.value)}
                              className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-slate-100"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-slate-400 font-medium">Email Content</label>
                            <textarea
                              rows={6}
                              value={editBody}
                              onChange={(e) => setEditBody(e.target.value)}
                              className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-xs text-slate-100 font-sans"
                            />
                          </div>
                          <div className="flex justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="px-3 py-1 text-xs rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => saveEdit(action.id)}
                              className="px-3 py-1 text-xs rounded bg-cyan-600 text-white hover:bg-cyan-500 font-medium"
                            >
                              Save Edits
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          {action.details.subject && (
                            <div className="text-xs font-semibold text-slate-200 mb-2">
                              <span className="text-slate-500 font-normal mr-2">Subject:</span>
                              {action.details.subject}
                            </div>
                          )}
                          <pre className="text-xs text-slate-300 whitespace-pre-wrap font-sans leading-relaxed bg-slate-900/60 p-3 rounded border border-slate-800/80">
                            {action.details.body}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Meeting Scheduling Preview */}
                  {action.details.meetingTime && (
                    <div className="rounded-lg bg-slate-950/80 border border-slate-800/80 p-3.5 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-400">Proposed Slot:</span>
                        <span className="font-semibold text-blue-300">{action.details.meetingTime}</span>
                      </div>
                      {action.details.agenda && (
                        <div className="text-slate-400 pt-1 border-t border-slate-800">
                          <span className="text-slate-500">Agenda:</span> {action.details.agenda}
                        </div>
                      )}
                    </div>
                  )}

                  {/* CRM Update Preview */}
                  {action.details.crmField && (
                    <div className="rounded-lg bg-slate-950/80 border border-slate-800/80 p-3.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-500 mr-2">Field to update:</span>
                        <span className="text-slate-200 font-medium">{action.details.crmField}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-600" />
                      <div>
                        <span className="text-slate-500 mr-2">New Target Value:</span>
                        <span className="text-amber-300 font-semibold">{action.details.crmValue}</span>
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {action.details.tags && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {action.details.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cryptographic Verification Footer & Controls */}
                <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-2 text-slate-500 font-mono text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Checksum:</span>
                    <span className="truncate max-w-[140px] text-slate-400">{action.encryptedChecksum}</span>
                  </div>

                  {isPending && (
                    <div className="flex items-center space-x-2">
                      {!isEditing && action.details.body && (
                        <button
                          type="button"
                          onClick={() => startEditing(action)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center space-x-1.5 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                          <span>Edit Copy</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onRejectAction(action.id)}
                        className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-medium flex items-center space-x-1.5 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>

                      <button
                        id={`approve-btn-${action.id}`}
                        type="button"
                        onClick={() => onApproveAction(action.id)}
                        className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-emerald-600/20 transition-all"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Authorize & Execute</span>
                      </button>
                    </div>
                  )}

                  {!isPending && (
                    <div className="text-xs text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Executed securely • Logged to immutable audit trail</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
