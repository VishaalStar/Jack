import React, { useState } from 'react';
import { 
  Users, 
  TrendingUp, 
  Building2, 
  Mail, 
  PhoneCall, 
  Plus, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  DollarSign,
  Briefcase,
  Search,
  CheckCircle2
} from 'lucide-react';
import { CRMContact } from '../types';

interface CRMViewProps {
  contacts: CRMContact[];
  onTriggerContactAction: (contact: CRMContact, actionType: 'email' | 'meeting' | 'advance') => void;
  onAddContact: (contact: Omit<CRMContact, 'id'>) => void;
}

export const CRMView: React.FC<CRMViewProps> = ({
  contacts,
  onTriggerContactAction,
  onAddContact,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactCompany, setNewContactCompany] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactRole, setNewContactRole] = useState('');
  const [newContactDeal, setNewContactDeal] = useState('50000');

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = selectedStage === 'All' || c.stage === selectedStage;
    return matchesSearch && matchesStage;
  });

  const totalPipeline = contacts.reduce((sum, c) => sum + c.dealValue, 0);

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName || !newContactEmail) return;

    onAddContact({
      name: newContactName,
      company: newContactCompany || 'New Enterprise Corp',
      email: newContactEmail,
      role: newContactRole || 'Director',
      dealValue: Number(newContactDeal) || 45000,
      stage: 'Lead',
      leadScore: 85,
      lastContact: 'Just now (Imported)',
      notes: ['Imported via Jack CRM Connector. AI auto-enrichment active.'],
      avatarColor: 'from-cyan-500 to-blue-600',
    });

    setNewContactName('');
    setNewContactCompany('');
    setNewContactEmail('');
    setNewContactRole('');
    setShowAddModal(false);
  };

  return (
    <div id="crm-integration-module" className="space-y-4">
      {/* Top stats & sync header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Total Pipeline Value</span>
            <div className="text-xl font-bold text-slate-100 font-mono mt-0.5">
              ${totalPipeline.toLocaleString()}
            </div>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3 h-3" /> +18.4% this quarter
            </span>
          </div>
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Active CRM Deals</span>
            <div className="text-xl font-bold text-slate-100 font-mono mt-0.5">
              {contacts.length} Strategic Accounts
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5">
              HubSpot & Salesforce Synced
            </span>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Jack Safeguard Status</span>
            <div className="text-base font-semibold text-emerald-400 mt-0.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Real-Time Listening
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5">
              Zero unauthorized stage drifts
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search contacts, company, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs">
          {['All', 'Lead', 'Meeting', 'Proposal', 'Negotiation', 'Closed Won'].map((stage) => (
            <button
              key={stage}
              type="button"
              onClick={() => setSelectedStage(stage)}
              className={`px-3 py-1 rounded-md transition-all whitespace-nowrap ${
                selectedStage === stage
                  ? 'bg-slate-800 text-cyan-300 font-semibold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {stage}
            </button>
          ))}
        </div>
      </div>

      {/* Contacts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            id={`crm-contact-${contact.id}`}
            className="rounded-xl bg-slate-900/80 border border-slate-800/90 p-4 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
          >
            <div>
              {/* Header with avatar, name, company */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${contact.avatarColor} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                    {contact.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
                      {contact.name}
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        Score: {contact.leadScore}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-slate-500" />
                      {contact.role} • {contact.company}
                    </p>
                  </div>
                </div>

                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                  contact.stage === 'Proposal' 
                    ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                    : contact.stage === 'Negotiation'
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    : contact.stage === 'Meeting'
                    ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                    : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                }`}>
                  {contact.stage}
                </span>
              </div>

              {/* Deal value & Contact detail */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs py-2 px-3 rounded-lg bg-slate-950/60 border border-slate-800/60">
                <div>
                  <span className="text-slate-500 text-[11px]">Deal Size</span>
                  <div className="font-bold text-slate-200 font-mono">
                    ${contact.dealValue.toLocaleString()}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px]">Email</span>
                  <div className="truncate text-cyan-400 font-mono text-[11px]">
                    {contact.email}
                  </div>
                </div>
              </div>

              {/* CRM Activity Notes */}
              <div className="mt-2.5 space-y-1">
                <span className="text-[11px] text-slate-500 font-medium">Recent Activity & Notes:</span>
                {contact.notes.slice(0, 2).map((note, idx) => (
                  <p key={idx} className="text-xs text-slate-300 bg-slate-900/50 p-2 rounded border border-slate-800/40">
                    • {note}
                  </p>
                ))}
              </div>
            </div>

            {/* Quick Jack Action Buttons */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">Ask Jack to react:</span>
              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={() => onTriggerContactAction(contact, 'email')}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 border border-slate-700 text-xs font-medium flex items-center space-x-1 transition-colors"
                  title="Jack drafts personalized email (staged for approval)"
                >
                  <Mail className="w-3 h-3 text-cyan-400" />
                  <span>Draft Email</span>
                </button>
                <button
                  type="button"
                  onClick={() => onTriggerContactAction(contact, 'meeting')}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-blue-300 border border-slate-700 text-xs font-medium flex items-center space-x-1 transition-colors"
                  title="Jack schedules demo meeting"
                >
                  <Briefcase className="w-3 h-3 text-blue-400" />
                  <span>Book Demo</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Plus className="w-5 h-5 text-cyan-400" />
              Add New CRM Contact
            </h3>
            <form onSubmit={handleCreateContact} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-medium">Full Name</label>
                <input
                  type="text"
                  required
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  placeholder="e.g. Jordan Bell"
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100"
                />
              </div>
              <div>
                <label className="text-slate-400 font-medium">Company Name</label>
                <input
                  type="text"
                  required
                  value={newContactCompany}
                  onChange={(e) => setNewContactCompany(e.target.value)}
                  placeholder="e.g. Horizon Labs"
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100"
                />
              </div>
              <div>
                <label className="text-slate-400 font-medium">Work Email</label>
                <input
                  type="email"
                  required
                  value={newContactEmail}
                  onChange={(e) => setNewContactEmail(e.target.value)}
                  placeholder="e.g. jordan@horizonlabs.io"
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 font-medium">Job Title</label>
                  <input
                    type="text"
                    value={newContactRole}
                    onChange={(e) => setNewContactRole(e.target.value)}
                    placeholder="e.g. VP of Product"
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-medium">Deal ARR ($)</label>
                  <input
                    type="number"
                    value={newContactDeal}
                    onChange={(e) => setNewContactDeal(e.target.value)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
                >
                  Save & Enrich
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
