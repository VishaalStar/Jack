import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  UserPlus, 
  PlusCircle, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Crown, 
  Sparkles,
  ExternalLink,
  Lock,
  ChevronRight,
  Briefcase
} from 'lucide-react';
import { Organization, OrgMember, UserProfile, UserRole } from '../types';

interface OrgGovernanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSwitchUserPersona: (role: UserRole, email: string, name: string, orgId?: string) => void;
  organizations: Organization[];
  members: Record<string, OrgMember[]>;
  activeOrgId: string | 'all';
  onSelectOrg: (orgId: string | 'all') => void;
  onCreateOrganization: (org: Omit<Organization, 'id' | 'createdAt'>) => void;
  onAddMember: (orgId: string, member: Omit<OrgMember, 'id' | 'organizationId' | 'joinedAt'>) => void;
  onRemoveMember: (orgId: string, memberId: string) => void;
}

export function OrgGovernanceModal({
  isOpen,
  onClose,
  currentUser,
  onSwitchUserPersona,
  organizations,
  members,
  activeOrgId,
  onSelectOrg,
  onCreateOrganization,
  onAddMember,
  onRemoveMember
}: OrgGovernanceModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'create_org' | 'manage_team' | 'switch_persona'>('overview');
  
  // New Org form state
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgIndustry, setNewOrgIndustry] = useState('Enterprise B2B SaaS');
  const [newOrgPlan, setNewOrgPlan] = useState('Enterprise Tier');
  const [headName, setHeadName] = useState('');
  const [headEmail, setHeadEmail] = useState('');
  const [headTitle, setHeadTitle] = useState('Executive Director / General Manager');

  // New Member form state
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberTitle, setMemberTitle] = useState('');
  const [memberRole, setMemberRole] = useState<'org_head' | 'org_member'>('org_member');
  const [targetOrgIdForMember, setTargetOrgIdForMember] = useState(
    activeOrgId !== 'all' ? activeOrgId : (organizations[0]?.id || '')
  );

  const [notification, setNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const isSuperAdmin = currentUser.role === 'super_admin';
  const isOrgHead = currentUser.role === 'org_head';

  const currentOrg = organizations.find(o => o.id === (activeOrgId === 'all' ? currentUser.organizationId : activeOrgId)) || organizations[0];
  const activeOrgMembers = currentOrg ? (members[currentOrg.id] || []) : [];

  const handleCreateOrgSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName || !headEmail) return;

    const slug = newOrgName.toLowerCase().replace(/[^a-z0-9]/g, '');
    onCreateOrganization({
      name: newOrgName,
      slug,
      headUserId: 'user-head-' + Date.now(),
      headUserEmail: headEmail,
      headUserName: headName || headEmail.split('@')[0],
      memberCount: 1,
      status: 'active',
      industry: newOrgIndustry,
      plan: newOrgPlan
    });

    setNotification(`Organization "${newOrgName}" successfully created! Assigned ${headEmail} as Organization Head.`);
    setNewOrgName('');
    setHeadName('');
    setHeadEmail('');
    setActiveTab('overview');
    setTimeout(() => setNotification(null), 4000);
  };

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberEmail || !targetOrgIdForMember) return;

    onAddMember(targetOrgIdForMember, {
      userId: 'user-' + Date.now(),
      email: memberEmail,
      displayName: memberName || memberEmail.split('@')[0],
      role: memberRole,
      title: memberTitle || 'Marketing & Growth Executive'
    });

    setNotification(`Added ${memberEmail} to organization team with role: ${memberRole === 'org_head' ? 'Organization Head' : 'Member'}.`);
    setMemberName('');
    setMemberEmail('');
    setMemberTitle('');
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-slate-100">Multi-Organization Governance & RBAC</h2>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${
                  isSuperAdmin 
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    : isOrgHead 
                    ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}>
                  {isSuperAdmin ? 'Super Admin Mode' : isOrgHead ? 'Org Head Governance' : 'Org Member'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Manage organizations, delegate organization heads, and govern team activities securely with Firebase backend.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Feedback Alert */}
        {notification && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* Modal Navigation Tabs */}
        <div className="flex items-center space-x-1 px-6 pt-3 border-b border-slate-800 text-xs font-medium bg-slate-950/30">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-t-lg border-b-2 flex items-center space-x-1.5 transition-all ${
              activeTab === 'overview'
                ? 'border-cyan-400 text-cyan-300 bg-slate-800/60 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Organizations Directory ({organizations.length})</span>
          </button>

          {isSuperAdmin && (
            <button
              onClick={() => setActiveTab('create_org')}
              className={`px-3.5 py-2 rounded-t-lg border-b-2 flex items-center space-x-1.5 transition-all ${
                activeTab === 'create_org'
                  ? 'border-cyan-400 text-cyan-300 bg-slate-800/60 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Create Organization</span>
            </button>
          )}

          {(isSuperAdmin || isOrgHead) && (
            <button
              onClick={() => setActiveTab('manage_team')}
              className={`px-3.5 py-2 rounded-t-lg border-b-2 flex items-center space-x-1.5 transition-all ${
                activeTab === 'manage_team'
                  ? 'border-cyan-400 text-cyan-300 bg-slate-800/60 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>Company Team & Members</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('switch_persona')}
            className={`px-3.5 py-2 rounded-t-lg border-b-2 flex items-center space-x-1.5 transition-all ${
              activeTab === 'switch_persona'
                ? 'border-cyan-400 text-cyan-300 bg-slate-800/60 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-purple-400" />
            <span>Live Persona / Login Switcher</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200 text-sm">
          {/* TAB 1: OVERVIEW & ORGANIZATIONS LIST */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-100">Registered Organizations</h3>
                  <p className="text-xs text-slate-400">
                    {isSuperAdmin 
                      ? 'As Super Admin, you have global master access across all organizations below.' 
                      : 'You are viewing your authorized organization workspace.'}
                  </p>
                </div>
                {isSuperAdmin && (
                  <button
                    onClick={() => setActiveTab('create_org')}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add New Organization</span>
                  </button>
                )}
              </div>

              {/* Super Admin Global Switcher Button */}
              {isSuperAdmin && (
                <div 
                  onClick={() => onSelectOrg('all')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    activeOrgId === 'all'
                      ? 'bg-amber-500/10 border-amber-500/40 shadow-sm shadow-amber-500/10'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                      <Crown className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-slate-100">All Organizations (Master View)</h4>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
                          Super Admin Only
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        View rollups, unified approval queue, and global metrics across all registered client companies.
                      </p>
                    </div>
                  </div>
                  {activeOrgId === 'all' && (
                    <span className="text-xs font-semibold text-amber-400 flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Active</span>
                    </span>
                  )}
                </div>
              )}

              {/* Organizations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {organizations.map(org => {
                  const isSelected = activeOrgId === org.id;
                  const orgMems = members[org.id] || [];

                  return (
                    <div
                      key={org.id}
                      onClick={() => onSelectOrg(org.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                        isSelected
                          ? 'bg-cyan-950/30 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                          : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex items-center justify-center font-bold text-xs">
                              {org.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-100 text-sm">{org.name}</h4>
                              <span className="text-[10px] text-slate-400">{org.industry || 'Enterprise'}</span>
                            </div>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                            {org.status}
                          </span>
                        </div>

                        {/* Org Head Badge */}
                        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-400 flex items-center space-x-1">
                              <Crown className="w-3 h-3 text-amber-400" />
                              <span>Governing Head:</span>
                            </span>
                            <span className="font-semibold text-slate-200">{org.headUserName || org.headUserEmail.split('@')[0]}</span>
                          </div>
                          <p className="text-[10px] font-mono text-cyan-400 truncate">{org.headUserEmail}</p>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                          <span>{orgMems.length} Team Member{orgMems.length !== 1 ? 's' : ''}</span>
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                            {org.plan || 'Standard'}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500">Click to switch workspace</span>
                        {isSelected ? (
                          <span className="text-xs font-semibold text-cyan-400 flex items-center space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Current</span>
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 flex items-center space-x-0.5">
                            <span>Open</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: CREATE ORGANIZATION (SUPER ADMIN ONLY) */}
          {activeTab === 'create_org' && isSuperAdmin && (
            <form onSubmit={handleCreateOrgSubmit} className="space-y-4 max-w-xl mx-auto">
              <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 space-y-1">
                <p className="font-semibold flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Super Admin Privilege: Organization Provisioning</span>
                </p>
                <p className="text-slate-400">
                  Creating an organization configures its tenant partition in Firestore and assigns an Organization Head who will be granted governance to manage activities and invite members.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Company / Organization Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Global Logistics"
                  value={newOrgName}
                  onChange={e => setNewOrgName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Industry Sector</label>
                  <select
                    value={newOrgIndustry}
                    onChange={e => setNewOrgIndustry(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Enterprise B2B SaaS">Enterprise B2B SaaS</option>
                    <option value="Omnichannel Retail">Omnichannel Retail</option>
                    <option value="HealthTech & MedDevice">HealthTech & MedDevice</option>
                    <option value="FinTech & Banking">FinTech & Banking</option>
                    <option value="Professional Services">Professional Services</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Subscription Plan</label>
                  <select
                    value={newOrgPlan}
                    onChange={e => setNewOrgPlan(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Enterprise Tier">Enterprise Tier (Full RBAC)</option>
                    <option value="Growth Pro">Growth Pro</option>
                    <option value="Starter Business">Starter Business</option>
                  </select>
                </div>
              </div>

              {/* Designating the Org Head */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center space-x-2">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-semibold text-slate-200">Designate Organization Head</h4>
                </div>
                <p className="text-[11px] text-slate-400">
                  This person will have administrative governance over this organization, approving staged campaigns and adding team members.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Head Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Jordan Hayes"
                      value={headName}
                      onChange={e => setHeadName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Head Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="jordan.hayes@company.com"
                      value={headEmail}
                      onChange={e => setHeadEmail(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Executive Title</label>
                  <input
                    type="text"
                    value={headTitle}
                    onChange={e => setHeadTitle(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors flex items-center space-x-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Provision Organization</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: MANAGE COMPANY MEMBERS */}
          {activeTab === 'manage_team' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Active Company</span>
                  <h4 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                    <span>{currentOrg?.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
                      Head: {currentOrg?.headUserName || currentOrg?.headUserEmail}
                    </span>
                  </h4>
                </div>

                {isSuperAdmin && (
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-slate-400">Switch Company:</span>
                    <select
                      value={targetOrgIdForMember}
                      onChange={e => {
                        setTargetOrgIdForMember(e.target.value);
                        onSelectOrg(e.target.value);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100"
                    >
                      {organizations.map(o => (
                        <option key={o.id} value={o.id}>{o.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Add Member Form */}
              <form onSubmit={handleAddMemberSubmit} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                <div className="flex items-center space-x-2">
                  <UserPlus className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-xs font-semibold text-slate-200">Invite / Add Member to {currentOrg?.name}</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Rachel Adams"
                      value={memberName}
                      onChange={e => setMemberName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Corporate Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="rachel.adams@company.com"
                      value={memberEmail}
                      onChange={e => setMemberEmail(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Assigned Role</label>
                    <select
                      value={memberRole}
                      onChange={e => setMemberRole(e.target.value as any)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                    >
                      <option value="org_member">Company Member</option>
                      <option value="org_head">Co-Head / Governing Admin</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs flex items-center space-x-1.5 transition-colors"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Add Member</span>
                  </button>
                </div>
              </form>

              {/* Members Roster Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-300">
                  Current Roster for {currentOrg?.name} ({activeOrgMembers.length})
                </h4>

                <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
                  {activeOrgMembers.map(m => (
                    <div key={m.id} className="p-3.5 flex items-center justify-between hover:bg-slate-900/50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center text-xs font-bold">
                          {m.displayName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-semibold text-slate-100">{m.displayName}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                              m.role === 'org_head'
                                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold'
                                : 'bg-slate-800 text-slate-400'
                            }`}>
                              {m.role === 'org_head' ? 'Governing Head' : 'Member'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-mono">{m.email} • {m.title || 'Staff'}</p>
                        </div>
                      </div>

                      {/* Removal action (Org Head or Super Admin can remove non-head members) */}
                      {m.role !== 'org_head' && (
                        <button
                          onClick={() => currentOrg && onRemoveMember(currentOrg.id, m.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Remove Member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LIVE PERSONA & ROLE SWITCHER */}
          {activeTab === 'switch_persona' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200 space-y-1">
                <p className="font-semibold flex items-center space-x-1.5">
                  <Crown className="w-4 h-4 text-purple-400" />
                  <span>Instant Role-Based Access Control (RBAC) Testing</span>
                </p>
                <p className="text-slate-400">
                  Switch personas instantly to verify access boundaries. Notice how Super Admin can see every organization, while Org Heads are locked to their respective company and cannot see competitors' pipelines.
                </p>
              </div>

              <div className="space-y-3">
                {/* 1. Super Admin (You) */}
                <div 
                  onClick={() => {
                    onSwitchUserPersona('super_admin', 'vishaal.s.1078@gmail.com', 'Vishaal (Super Admin)');
                    onSelectOrg('all');
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    currentUser.role === 'super_admin'
                      ? 'bg-amber-950/30 border-amber-500/50 shadow-md shadow-amber-500/10'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                      <Crown className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-100 text-sm">Super Admin (Platform Owner)</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                          Full Tenant Access
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Email: <span className="font-mono text-slate-300">vishaal.s.1078@gmail.com</span> • Can create organizations, delegate heads, and access all tenant data.
                      </p>
                    </div>
                  </div>
                  {currentUser.role === 'super_admin' && (
                    <span className="text-xs font-semibold text-amber-400 flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Current Persona</span>
                    </span>
                  )}
                </div>

                {/* 2. Org Head - TechCorp */}
                <div 
                  onClick={() => {
                    onSwitchUserPersona('org_head', 'sarah.chen@techcorp.io', 'Sarah Chen (Org Head)', 'org-techcorp');
                    onSelectOrg('org-techcorp');
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    currentUser.role === 'org_head' && currentUser.organizationId === 'org-techcorp'
                      ? 'bg-cyan-950/30 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">
                      SC
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-100 text-sm">Sarah Chen • Org Head (TechCorp Solutions)</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                          TechCorp Only
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Email: <span className="font-mono text-slate-300">sarah.chen@techcorp.io</span> • Governs TechCorp activities, approves staged tasks, invites members.
                      </p>
                    </div>
                  </div>
                  {currentUser.role === 'org_head' && currentUser.organizationId === 'org-techcorp' && (
                    <span className="text-xs font-semibold text-cyan-400 flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Current Persona</span>
                    </span>
                  )}
                </div>

                {/* 3. Org Head - Acme Retail */}
                <div 
                  onClick={() => {
                    onSwitchUserPersona('org_head', 'd.miller@acmeretail.com', 'David Miller (Org Head)', 'org-acme');
                    onSelectOrg('org-acme');
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    currentUser.role === 'org_head' && currentUser.organizationId === 'org-acme'
                      ? 'bg-cyan-950/30 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold">
                      DM
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-100 text-sm">David Miller • Org Head (Acme Retail)</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono">
                          Acme Only
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Email: <span className="font-mono text-slate-300">d.miller@acmeretail.com</span> • Governs Acme Retail pipeline, ad budgets, and team.
                      </p>
                    </div>
                  </div>
                  {currentUser.role === 'org_head' && currentUser.organizationId === 'org-acme' && (
                    <span className="text-xs font-semibold text-cyan-400 flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Current Persona</span>
                    </span>
                  )}
                </div>

                {/* 4. Org Member - Marcus Vance */}
                <div 
                  onClick={() => {
                    onSwitchUserPersona('org_member', 'm.vance@techcorp.io', 'Marcus Vance (Account Exec)', 'org-techcorp');
                    onSelectOrg('org-techcorp');
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    currentUser.role === 'org_member'
                      ? 'bg-slate-800/80 border-slate-600'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center font-bold">
                      MV
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-100 text-sm">Marcus Vance • Member (TechCorp AE)</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                          Team Contributor
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Email: <span className="font-mono text-slate-300">m.vance@techcorp.io</span> • Cannot invite members or access other tenants.
                      </p>
                    </div>
                  </div>
                  {currentUser.role === 'org_member' && (
                    <span className="text-xs font-semibold text-slate-300 flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Current Persona</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Firebase Tenant Partitioning: Zero cross-organization leakage</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Close Governance
          </button>
        </div>
      </div>
    </div>
  );
}
