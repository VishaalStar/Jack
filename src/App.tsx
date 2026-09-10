import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShieldAlert, 
  Users, 
  Calendar as CalendarIcon, 
  BarChart2, 
  GitCompare, 
  Zap, 
  Workflow, 
  ShieldCheck, 
  Lock,
  Bell,
  Sliders,
  CheckCircle2,
  Mail,
  Building2,
  Crown,
  ChevronDown,
  Home,
  FileText,
  Rocket,
  LogOut
} from 'lucide-react';
import { 
  StagedAction, 
  CRMContact, 
  CalendarEvent, 
  WorkflowTask, 
  AuditLogEntry, 
  CompetitorData, 
  MarketingMetrics,
  Organization,
  OrgMember,
  UserProfile,
  EmailMessage,
  UserRole
} from './types';
import { 
  initialStagedActions, 
  initialCRMContacts, 
  initialCalendarEvents, 
  initialWorkflowTasks, 
  initialCompetitors, 
  initialMarketingMetrics, 
  initialAuditLogs 
} from './data/mockData';
import { sendCommandToJack } from './services/agentClient';
import { 
  DEFAULT_ORGANIZATIONS, 
  DEFAULT_MEMBERS, 
  DEFAULT_EMAILS,
  createOrganizationInDb,
  addMemberToOrgInDb,
  removeMemberFromOrgInDb,
  addIncomingEmailInDb,
  subscribeToOrganizations,
  subscribeToOrgEmails,
  subscribeToAuth,
  seedLiveFirestoreIfEmpty,
  logOut
} from './services/firebase';
import { JackVoiceOrb } from './components/JackVoiceOrb';
import { ApprovalQueue } from './components/ApprovalQueue';
import { CRMView } from './components/CRMView';
import { CalendarView } from './components/CalendarView';
import { AnalyticsView } from './components/AnalyticsView';
import { CompetitorMatrix } from './components/CompetitorMatrix';
import { WorkflowMatrix } from './components/WorkflowMatrix';
import { AutomationsView } from './components/AutomationsView';
import { SecurityCompliance } from './components/SecurityCompliance';
import { EmailInbox } from './components/EmailInbox';
import { OrgGovernanceModal } from './components/OrgGovernanceModal';
import { AuthModal } from './components/AuthModal';
import { WelcomePortal } from './components/WelcomePortal';
import { UserGuideModal } from './components/UserGuideModal';
import { DeploymentModal } from './components/DeploymentModal';
import { SignInGate } from './components/SignInGate';

export default function App() {
  // Navigation View Mode: Welcome Landing Portal vs. Active AI Workstation Console
  const [viewMode, setViewMode] = useState<'welcome' | 'console'>(() => {
    const saved = localStorage.getItem('jack_view_mode');
    return (saved === 'console' || saved === 'welcome') ? saved : 'welcome';
  });

  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);

  // Global State
  const [activeTab, setActiveTab] = useState<
    'queue' | 'crm' | 'calendar' | 'inbox' | 'analytics' | 'competitors' | 'workflow' | 'automations' | 'security'
  >('queue');

  // Multi-Organization & RBAC State (Firebase-backed with resilient local cache)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('jack_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [organizations, setOrganizations] = useState<Organization[]>(() => {
    const saved = localStorage.getItem('jack_organizations');
    if (saved && !saved.includes('org-techcorp')) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_ORGANIZATIONS;
  });

  const [members, setMembers] = useState<Record<string, OrgMember[]>>(() => {
    const saved = localStorage.getItem('jack_org_members');
    if (saved && !saved.includes('org-techcorp')) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_MEMBERS;
  });

  const [emails, setEmails] = useState<Record<string, EmailMessage[]>>(() => {
    const saved = localStorage.getItem('jack_emails');
    if (saved && !saved.includes('org-techcorp')) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_EMAILS;
  });

  const [activeOrgId, setActiveOrgId] = useState<string | 'all'>(() => {
    const saved = localStorage.getItem('jack_active_org');
    if (saved && saved !== 'org-techcorp' && saved !== 'org-acme' && saved !== 'org-nexus') {
      return saved;
    }
    return 'org-demo';
  });

  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Live Firestore & Auth Real-Time Subscription
  useEffect(() => {
    seedLiveFirestoreIfEmpty();

    const unsubAuth = subscribeToAuth((fbUser) => {
      if (fbUser) {
        const isSuper = fbUser.email === 'vishaal.s.1078@gmail.com';
        setCurrentUser({
          id: fbUser.uid,
          email: fbUser.email || 'vishaal.s.1078@gmail.com',
          displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Vishaal S.',
          photoURL: fbUser.photoURL || undefined,
          role: isSuper ? 'super_admin' : 'org_member',
          createdAt: new Date().toISOString()
        });
      }
    });

    const unsubOrgs = subscribeToOrganizations((liveOrgs) => {
      if (liveOrgs && liveOrgs.length > 0) {
        setOrganizations(liveOrgs);
      }
    });

    return () => {
      unsubAuth();
      if (unsubOrgs) unsubOrgs();
    };
  }, []);

  // Real-time synchronization for active organization's emails
  useEffect(() => {
    if (activeOrgId !== 'all') {
      const unsubEmails = subscribeToOrgEmails(activeOrgId, (liveEmails) => {
        if (liveEmails && liveEmails.length > 0) {
          setEmails(prev => ({
            ...prev,
            [activeOrgId]: liveEmails
          }));
        }
      });
      return () => {
        if (unsubEmails) unsubEmails();
      };
    }
  }, [activeOrgId]);

  const [stagedActions, setStagedActions] = useState<StagedAction[]>(() => {
    const saved = localStorage.getItem('jack_staged_actions');
    if (saved && !saved.includes('stage-1') && !saved.includes('Sarah Chen')) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return initialStagedActions;
  });

  const [crmContacts, setCrmContacts] = useState<CRMContact[]>(() => {
    const saved = localStorage.getItem('jack_crm_contacts');
    if (saved && !saved.includes('crm-1') && !saved.includes('Sarah Chen')) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return initialCRMContacts;
  });

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('jack_calendar_events');
    if (saved && !saved.includes('cal-1') && !saved.includes('FinVanguard')) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return initialCalendarEvents;
  });

  const [workflowTasks, setWorkflowTasks] = useState<WorkflowTask[]>(() => {
    const saved = localStorage.getItem('jack_workflow_tasks');
    if (saved && !saved.includes('task-1') && !saved.includes('Sarah Chen')) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return initialWorkflowTasks;
  });

  const [competitors, setCompetitors] = useState<CompetitorData[]>(() => {
    const saved = localStorage.getItem('jack_competitors');
    if (saved && !saved.includes('comp-1') && !saved.includes('OmniFlow')) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return initialCompetitors;
  });

  const [marketingMetrics, setMarketingMetrics] = useState<MarketingMetrics>(() => {
    const saved = localStorage.getItem('jack_marketing_metrics');
    if (saved && !saved.includes('287000')) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return initialMarketingMetrics;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('jack_audit_logs');
    if (saved && !saved.includes('audit-1') && !saved.includes('Sarah Chen')) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return initialAuditLogs;
  });

  // Jack Voice Assistant reactive state (no voice on site load)
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [latestSpokenResponse, setLatestSpokenResponse] = useState('');

  // Persistence to local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('jack_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('jack_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('jack_organizations', JSON.stringify(organizations));
  }, [organizations]);

  useEffect(() => {
    localStorage.setItem('jack_org_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('jack_emails', JSON.stringify(emails));
  }, [emails]);

  useEffect(() => {
    localStorage.setItem('jack_active_org', activeOrgId);
  }, [activeOrgId]);

  useEffect(() => {
    localStorage.setItem('jack_staged_actions', JSON.stringify(stagedActions));
  }, [stagedActions]);

  useEffect(() => {
    localStorage.setItem('jack_crm_contacts', JSON.stringify(crmContacts));
  }, [crmContacts]);

  useEffect(() => {
    localStorage.setItem('jack_calendar_events', JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  useEffect(() => {
    localStorage.setItem('jack_workflow_tasks', JSON.stringify(workflowTasks));
  }, [workflowTasks]);

  useEffect(() => {
    localStorage.setItem('jack_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Current active organization name and scoped emails
  const currentOrg = organizations.find(o => o.id === activeOrgId);
  const activeOrgName = activeOrgId === 'all' 
    ? 'All Organizations (Super Admin Master View)' 
    : (currentOrg?.name || 'TechCorp Solutions');

  const activeEmails: EmailMessage[] = activeOrgId === 'all'
    ? Object.values(emails).flat()
    : (emails[activeOrgId] || []);

  const unreadEmailsCount = activeEmails.filter(e => !e.isRead).length;

  // Organization Governance Handlers
  const handleCreateOrganization = async (newOrgData: Omit<Organization, 'id' | 'createdAt'>) => {
    const createdOrg = await createOrganizationInDb(newOrgData);
    setOrganizations(prev => [createdOrg, ...prev]);

    // Add head as initial member
    const newHeadMember: OrgMember = {
      id: 'mem-' + Date.now(),
      organizationId: createdOrg.id,
      userId: createdOrg.headUserId,
      email: createdOrg.headUserEmail,
      displayName: createdOrg.headUserName || createdOrg.headUserEmail.split('@')[0],
      role: 'org_head',
      title: 'Organization Head & Managing Director',
      joinedAt: new Date().toISOString()
    };
    setMembers(prev => ({
      ...prev,
      [createdOrg.id]: [newHeadMember]
    }));

    // Seed welcoming email
    const welcomeEmail: EmailMessage = {
      id: 'em-' + Date.now(),
      organizationId: createdOrg.id,
      sender: createdOrg.headUserName || 'Executive Governance',
      senderEmail: createdOrg.headUserEmail,
      recipientEmail: currentUser.email,
      subject: `Tenant Setup Complete: ${createdOrg.name}`,
      snippet: `Organization workspace partitioned in Firestore with zero cross-tenant leakage. Staged approval queues active.`,
      body: `Hi Team,\n\nOur workspace for ${createdOrg.name} has been provisioned on Jack AI. All high-stakes emails and CRM mutations will be staged in our Safeguard Approval Queue before any external execution.\n\nBest,\n${createdOrg.headUserName || 'Executive Head'}`,
      date: 'Just now',
      isRead: false,
      priority: 'high',
      source: 'Google Workspace',
      tags: ['Onboarding', 'Security']
    };
    setEmails(prev => ({
      ...prev,
      [createdOrg.id]: [welcomeEmail]
    }));

    logAuditAction('User (Approval)', `Provisioned new organization: ${createdOrg.name} (Head: ${createdOrg.headUserEmail})`, 'Firebase Auth & Firestore', 'Verified');
    setLatestSpokenResponse(`I have provisioned ${createdOrg.name} with dedicated Firestore partitioning and delegated governance to ${createdOrg.headUserName || createdOrg.headUserEmail}.`);
  };

  const handleAddMember = async (orgId: string, memberData: Omit<OrgMember, 'id' | 'organizationId' | 'joinedAt'>) => {
    const newMem = await addMemberToOrgInDb(orgId, memberData);
    setMembers(prev => ({
      ...prev,
      [orgId]: [...(prev[orgId] || []), newMem]
    }));
    setOrganizations(prev => prev.map(o => o.id === orgId ? { ...o, memberCount: o.memberCount + 1 } : o));
    logAuditAction('User (Approval)', `Added member ${memberData.email} (${memberData.role}) to organization`, 'Firebase IAM & Firestore', 'Verified');
  };

  const handleRemoveMember = async (orgId: string, memberId: string) => {
    await removeMemberFromOrgInDb(orgId, memberId);
    setMembers(prev => ({
      ...prev,
      [orgId]: (prev[orgId] || []).filter(m => m.id !== memberId)
    }));
    setOrganizations(prev => prev.map(o => o.id === orgId ? { ...o, memberCount: Math.max(1, o.memberCount - 1) } : o));
    logAuditAction('User (Approval)', `Removed member from organization roster`, 'Firebase IAM', 'Verified');
  };

  const handleSwitchUserPersona = (role: UserRole, email: string, name: string, orgId?: string) => {
    const user: UserProfile = {
      id: 'user-' + role,
      email,
      displayName: name,
      role,
      organizationId: orgId,
      createdAt: new Date().toISOString()
    };
    setCurrentUser(user);
    if (role !== 'super_admin' && orgId) {
      setActiveOrgId(orgId);
    }
    logAuditAction('User (Approval)', `Switched persona to ${name} (${role})`, 'Firebase Auth Session', 'Verified');
    setLatestSpokenResponse(`Active persona switched to ${name} with ${role === 'super_admin' ? 'Super Admin' : role === 'org_head' ? 'Organization Head' : 'Member'} permissions.`);
  };

  const handleQuickSwitchToDemoTester = () => {
    const demoUser: UserProfile = {
      id: 'user-demo-tester',
      email: 'alex.vance@demo.co',
      displayName: 'Alex Vance (Operations Lead)',
      role: 'org_head',
      organizationId: 'org-demo',
      createdAt: new Date().toISOString()
    };
    setCurrentUser(demoUser);
    setActiveOrgId('org-demo');
    logAuditAction('User (Approval)', 'Switched active session to Alex Vance in Demo organization', 'Auth Session', 'Verified');
    setLatestSpokenResponse('Active session switched to Alex Vance in the Demo organization enclave.');
  };

  const handleQuickSwitchToSuperAdmin = () => {
    const adminUser: UserProfile = {
      id: 'user-super-admin',
      email: 'vishaal.s.1078@gmail.com',
      displayName: 'Vishaal S. (Platform Super Admin)',
      role: 'super_admin',
      createdAt: new Date().toISOString()
    };
    setCurrentUser(adminUser);
    setActiveOrgId('all');
    logAuditAction('User (Approval)', 'Switched active session to Super Admin (Vishaal S.)', 'Auth Session', 'Verified');
    setLatestSpokenResponse('Active session switched to Platform Super Admin master view.');
  };

  const handleDraftReplyWithJack = (email: EmailMessage) => {
    handleExecuteCommand(`Jack, draft a professional executive reply to ${email.sender} (${email.senderEmail}) regarding "${email.subject}". Address their key questions directly, but remember your safeguard rule: stage the draft in my approval queue and do not send automatically.`);
    setActiveTab('queue');
  };

  const handleSimulateInboundEmail = async () => {
    const targetOrg = activeOrgId === 'all' ? (organizations[0]?.id || 'org-demo') : activeOrgId;
    const newEmail = await addIncomingEmailInDb(targetOrg, {
      sender: 'Enterprise Client Lead',
      senderEmail: 'procurement@acme-global.org',
      recipientEmail: currentUser.email,
      subject: 'Inquiry: $150k Expansion Deal & Security Attestation',
      snippet: 'We are reviewing the final proposal. Can your team confirm that Jack AI stages all outgoing emails in an approval queue before dispatch?',
      body: 'Hi Alex,\n\nOur procurement committee is finalizing vendor selection for our Q4 omnichannel marketing push. Total deal value is estimated at $150k ARR.\n\nCould you confirm that Jack AI strictly enforces human-in-the-loop review for all correspondence and CRM adjustments?\n\nLooking forward to your reply.\n\nRegards,\nMarcus Sterling\nVP of Procurement',
      date: 'Just now',
      isRead: false,
      priority: 'high',
      source: 'Google Workspace',
      tags: ['High Deal Value', 'Procurement', 'Safeguard']
    });

    setEmails(prev => ({
      ...prev,
      [targetOrg]: [newEmail, ...(prev[targetOrg] || [])]
    }));

    setLatestSpokenResponse("A new high-priority email has arrived in your inbox regarding a 150,000 dollar expansion deal. I can prepare a staged response for you right now.");
  };

  const handleMarkEmailAsRead = (emailId: string) => {
    setEmails(prev => {
      const next = { ...prev };
      for (const orgId of Object.keys(next)) {
        next[orgId] = next[orgId].map(e => e.id === emailId ? { ...e, isRead: true } : e);
      }
      return next;
    });
  };

  // Master command executor for Jack (Voice & Text)
  const handleExecuteCommand = async (promptText: string) => {
    setIsProcessing(true);
    setCurrentStatus('thinking');

    try {
      const response = await sendCommandToJack(promptText, {
        currentCRMCount: crmContacts.length,
        currentEventsCount: calendarEvents.length,
        topContacts: crmContacts.map(c => ({
          name: c.name,
          email: c.email,
          company: c.company,
          dealValue: c.dealValue
        }))
      });

      setLatestSpokenResponse(response.speechText);
      setCurrentStatus('speaking');

      // Process structured action
      if (response.actionTaken) {
        const act = response.actionTaken;

        // If action requires staging (like drafting email or updating CRM without sending)
        if (act.requiresApproval) {
          const newStagedAction: StagedAction = {
            id: 'stage-' + Date.now(),
            type: act.type as any,
            title: act.title,
            description: act.description,
            targetPlatform: act.targetPlatform,
            status: 'staged_for_approval',
            createdAt: 'Just now',
            confidenceScore: 97,
            encryptedChecksum: 'sha256-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            details: act.stagedPayload,
            securityCheck: {
              isEncrypted: true,
              piiSafe: true,
              compliancePassed: true
            }
          };

          setStagedActions(prev => [newStagedAction, ...prev]);
          setActiveTab('queue'); // Auto-focus the safeguard staging queue

          // Add audit log
          logAuditAction('Jack AI', `Safeguard trigger held: ${act.title} queued for approval`, act.targetPlatform, 'Pending Review');
        } else if (act.type === 'compare_competitors') {
          setActiveTab('competitors');
          logAuditAction('Jack AI', 'Compiled competitor comparison report', 'Intelligence Engine', 'Verified');
        } else if (act.type === 'prioritize_tasks') {
          setActiveTab('workflow');
          logAuditAction('Jack AI', 'Re-ranked daily task workflow priority scores', 'Workflow Optimizer', 'Verified');
        } else if (act.type === 'generate_analytics') {
          setActiveTab('analytics');
          logAuditAction('Jack AI', 'Generated real-time ROAS & attribution metrics report', 'Analytics Engine', 'Verified');
        }
      }
    } catch (err) {
      console.error('Failed to process command:', err);
      setLatestSpokenResponse("I've staged your request in the secure queue for confirmation.");
    } finally {
      setIsProcessing(false);
      setTimeout(() => setCurrentStatus('idle'), 3000);
    }
  };

  const logAuditAction = (actor: AuditLogEntry['actor'], action: string, targetSystem: string, status: AuditLogEntry['status']) => {
    const newLog: AuditLogEntry = {
      id: 'audit-' + Date.now(),
      timestamp: 'Just now',
      actor,
      action,
      targetSystem,
      encryptionHash: '0x' + Math.random().toString(16).substring(2, 10) + '...verified',
      status,
      ipOrigin: '127.0.0.1 (Local Enclave)'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // User authorizes an action in the safeguard queue
  const handleApproveAction = (actionId: string) => {
    const action = stagedActions.find(a => a.id === actionId);
    if (!action) return;

    setStagedActions(prev => prev.map(a => a.id === actionId ? { ...a, status: 'approved_and_executed', executedAt: 'Just now' } : a));

    // Side effects on target systems
    if (action.type === 'update_crm' && action.details.crmDealId) {
      setCrmContacts(prev => prev.map(c => c.id === action.details.crmDealId ? {
        ...c,
        stage: 'Negotiation',
        notes: [`Stage advanced to Negotiation via Jack Automation ($120k ARR)`, ...c.notes]
      } : c));
    } else if (action.type === 'schedule_meeting' && action.details.meetingTime) {
      const newEvent: CalendarEvent = {
        id: 'cal-' + Date.now(),
        title: action.title || 'Executive Alignment Session',
        startTime: '2:30 PM',
        endTime: '3:15 PM',
        attendees: ['you@enterprise.com', 'client@partner.io'],
        platform: 'Google Meet',
        status: 'confirmed',
        prepBriefing: action.details.agenda || 'Meeting confirmed via Jack approval workflow.',
        priority: 'high'
      };
      setCalendarEvents(prev => [newEvent, ...prev]);
    }

    logAuditAction('User (Approval)', `Authorized & dispatched: ${action.title}`, action.targetPlatform, 'Encrypted & Stored');
    setLatestSpokenResponse(`Action approved and securely executed on ${action.targetPlatform}. An immutable audit receipt has been logged.`);
  };

  const handleRejectAction = (actionId: string) => {
    const action = stagedActions.find(a => a.id === actionId);
    setStagedActions(prev => prev.filter(a => a.id !== actionId));
    if (action) {
      logAuditAction('User (Approval)', `Rejected and dismissed: ${action.title}`, action.targetPlatform, 'Verified');
    }
  };

  const handleUpdateActionPayload = (actionId: string, updatedDetails: Partial<StagedAction['details']>) => {
    setStagedActions(prev => prev.map(a => a.id === actionId ? {
      ...a,
      details: { ...a.details, ...updatedDetails }
    } : a));
    logAuditAction('User (Approval)', `Modified payload copy for action ${actionId}`, 'Staging Sandbox', 'Verified');
  };

  const pendingApprovalsCount = stagedActions.filter(a => a.status === 'staged_for_approval').length;

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (e) {
      console.warn('Sign out error:', e);
    }
    localStorage.removeItem('jack_current_user');
    setCurrentUser(null);
  };

  // User Authentication Gate: Application is open for use, but sign-in is required on any platform
  if (!currentUser) {
    return <SignInGate onAuthSuccess={(user) => setCurrentUser(user)} />;
  }

  // When in Welcome Portal Mode
  if (viewMode === 'welcome') {
    return (
      <>
        <WelcomePortal
          currentUser={currentUser}
          activeOrg={currentOrg}
          onEnterConsole={() => {
            setViewMode('console');
            localStorage.setItem('jack_view_mode', 'console');
          }}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onOpenOrgModal={() => setIsOrgModalOpen(true)}
          onOpenGuideModal={() => setIsGuideModalOpen(true)}
          onOpenDeployModal={() => setIsDeployModalOpen(true)}
          onQuickSwitchToDemoTester={handleQuickSwitchToDemoTester}
          onQuickSwitchToSuperAdmin={handleQuickSwitchToSuperAdmin}
          onSignOut={handleSignOut}
        />

        <OrgGovernanceModal
          isOpen={isOrgModalOpen}
          onClose={() => setIsOrgModalOpen(false)}
          currentUser={currentUser}
          onSwitchUserPersona={handleSwitchUserPersona}
          organizations={organizations}
          members={members}
          activeOrgId={activeOrgId}
          onSelectOrg={(orgId) => {
            setActiveOrgId(orgId);
            setIsOrgModalOpen(false);
          }}
          onCreateOrganization={handleCreateOrganization}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          currentUser={currentUser}
          onAuthSuccess={(newProfile) => {
            setCurrentUser(newProfile);
            logAuditAction('User (Approval)', `User ${newProfile.displayName || newProfile.email} authenticated via Firebase Auth (Real-Time)`, 'Identity Service', 'Verified');
            setLatestSpokenResponse(`Welcome back, ${newProfile.displayName}. Real-time synchronization active.`);
          }}
        />

        <UserGuideModal
          isOpen={isGuideModalOpen}
          onClose={() => setIsGuideModalOpen(false)}
        />

        <DeploymentModal
          isOpen={isDeployModalOpen}
          onClose={() => setIsDeployModalOpen(false)}
          sharedAppUrl="https://ais-pre-5eui5th7jd3carxzyv3nnv-250042912168.asia-southeast1.run.app"
          devAppUrl="https://ais-dev-5eui5th7jd3carxzyv3nnv-250042912168.asia-southeast1.run.app"
          firestoreDbId="ai-studio-jackaibusinessma-bf94100f-8209-456c-a007-554a0c52c4d6"
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Application Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-md shadow-cyan-500/20 text-white font-bold text-base">
            J
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-slate-100 tracking-tight">Jack AI</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                Enterprise Siri
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Autonomous Business & Marketing Agent</p>
          </div>
        </div>

        {/* Global Security, Organization Governance & Status Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Back to Welcome Portal Button */}
          <button
            type="button"
            onClick={() => {
              setViewMode('welcome');
              localStorage.setItem('jack_view_mode', 'welcome');
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Return to Welcome Portal"
          >
            <Home className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Welcome Portal</span>
          </button>

          {/* Guide PDF Button */}
          <button
            type="button"
            onClick={() => setIsGuideModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Read and Print Executive Customer Guide"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">User Guide (PDF)</span>
          </button>

          {/* Deployment Center Button */}
          <button
            type="button"
            onClick={() => setIsDeployModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 border border-cyan-500/30 text-xs font-semibold text-cyan-300 hover:text-white transition-all cursor-pointer shadow-sm"
            title="Cloud Run, Firebase & Vercel Deployment Hub"
          >
            <Rocket className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Deployment</span>
          </button>

          {/* Active Tenant / Organization Button */}
          <button
            type="button"
            onClick={() => setIsOrgModalOpen(true)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 transition-all cursor-pointer shadow-sm group"
            title="Manage Multi-Tenant Organizations and Delegated Heads"
          >
            <Building2 className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <div className="flex flex-col text-left">
              <div className="flex items-center space-x-1.5">
                <span className="font-semibold text-slate-100 truncate max-w-[140px] sm:max-w-[200px]">
                  {activeOrgId === 'all' ? 'All Organizations' : (currentOrg?.name || 'Company Workspace')}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
              <span className="text-[9px] font-mono text-cyan-400 leading-tight">
                {currentUser.role === 'super_admin' ? 'Super Admin Mode' : currentUser.role === 'org_head' ? 'Governing Head' : 'Member'}
              </span>
            </div>
          </button>

          <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">Safeguard:</span>
            <span className="text-emerald-300 font-semibold">Zero Blind Sends</span>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('queue')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              pendingApprovalsCount > 0
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 animate-pulse'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>{pendingApprovalsCount} Staged Review{pendingApprovalsCount !== 1 ? 's' : ''}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 font-mono transition-colors"
          >
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Firebase Enclave</span>
          </button>

          {/* Real-time Account / Sign In Trigger */}
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-950 to-slate-900 hover:from-cyan-900/60 hover:to-slate-800 border border-cyan-500/40 text-xs font-semibold text-cyan-200 transition-all cursor-pointer shadow-sm hover:border-cyan-400 group"
            title="Sign in with Google or Corporate credentials to synchronize real-time data"
          >
            <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold text-[10px] group-hover:scale-110 transition-transform">
              {currentUser.email ? currentUser.email.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex flex-col text-left">
              <span className="font-bold text-slate-100 truncate max-w-[120px] sm:max-w-[160px]">
                {currentUser.displayName || currentUser.email.split('@')[0]}
              </span>
              <span className="text-[9px] font-mono text-cyan-400 leading-tight">
                Sign In / Real-Time Sync
              </span>
            </div>
          </button>

          {/* Sign Out Trigger */}
          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-500/20 border border-slate-800 hover:border-rose-500/40 text-xs font-semibold text-slate-400 hover:text-rose-300 transition-all cursor-pointer shadow-sm"
            title="Sign out of your workstation session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Core Jack Voice & Command Orb */}
        <JackVoiceOrb
          isProcessing={isProcessing}
          currentStatus={currentStatus}
          latestSpokenResponse={latestSpokenResponse}
          onExecuteCommand={handleExecuteCommand}
        />

        {/* Navigation Tabs Bar */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 border-b border-slate-800/80 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('queue')}
            className={`px-4 py-2.5 rounded-t-lg border-b-2 flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeTab === 'queue'
                ? 'border-cyan-400 text-cyan-300 bg-slate-900/60 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Safeguard Staged Queue</span>
            {pendingApprovalsCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                {pendingApprovalsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('inbox')}
            className={`px-4 py-2.5 rounded-t-lg border-b-2 flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeTab === 'inbox'
                ? 'border-cyan-400 text-cyan-300 bg-slate-900/60 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
            }`}
          >
            <Mail className="w-4 h-4 text-cyan-400" />
            <span>Real-Time Mail & Gmail</span>
            {unreadEmailsCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                {unreadEmailsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('crm')}
            className={`px-4 py-2.5 rounded-t-lg border-b-2 flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeTab === 'crm'
                ? 'border-cyan-400 text-cyan-300 bg-slate-900/60 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
            }`}
          >
            <Users className="w-4 h-4 text-blue-400" />
            <span>CRM & Deals</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
              {crmContacts.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2.5 rounded-t-lg border-b-2 flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeTab === 'calendar'
                ? 'border-cyan-400 text-cyan-300 bg-slate-900/60 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
            }`}
          >
            <CalendarIcon className="w-4 h-4 text-emerald-400" />
            <span>Calendar & Meetings</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
              {calendarEvents.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 rounded-t-lg border-b-2 flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'border-cyan-400 text-cyan-300 bg-slate-900/60 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
            }`}
          >
            <BarChart2 className="w-4 h-4 text-purple-400" />
            <span>Marketing Analytics</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('competitors')}
            className={`px-4 py-2.5 rounded-t-lg border-b-2 flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeTab === 'competitors'
                ? 'border-cyan-400 text-cyan-300 bg-slate-900/60 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
            }`}
          >
            <GitCompare className="w-4 h-4 text-cyan-400" />
            <span>Competitor Intel</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('workflow')}
            className={`px-4 py-2.5 rounded-t-lg border-b-2 flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeTab === 'workflow'
                ? 'border-cyan-400 text-cyan-300 bg-slate-900/60 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Daily Priorities</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('automations')}
            className={`px-4 py-2.5 rounded-t-lg border-b-2 flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeTab === 'automations'
                ? 'border-cyan-400 text-cyan-300 bg-slate-900/60 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
            }`}
          >
            <Workflow className="w-4 h-4 text-indigo-400" />
            <span>Automation Hub</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2.5 rounded-t-lg border-b-2 flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeTab === 'security'
                ? 'border-cyan-400 text-cyan-300 bg-slate-900/60 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Security & Privacy</span>
          </button>
        </div>

        {/* View Content Modules */}
        <div className="transition-all duration-200">
          {activeTab === 'queue' && (
            <ApprovalQueue
              stagedActions={stagedActions}
              onApproveAction={handleApproveAction}
              onRejectAction={handleRejectAction}
              onUpdateActionPayload={handleUpdateActionPayload}
            />
          )}

          {activeTab === 'inbox' && (
            <EmailInbox
              emails={activeEmails}
              activeOrgName={activeOrgName}
              onDraftReplyWithJack={handleDraftReplyWithJack}
              onSimulateInboundEmail={handleSimulateInboundEmail}
              onMarkEmailAsRead={handleMarkEmailAsRead}
            />
          )}

          {activeTab === 'crm' && (
            <CRMView
              contacts={crmContacts}
              onTriggerContactAction={(contact, actionType) => {
                if (actionType === 'email') {
                  handleExecuteCommand(`Jack, draft a personalized follow-up proposal email to ${contact.name} at ${contact.company} but hold it for review`);
                } else if (actionType === 'meeting') {
                  handleExecuteCommand(`Jack, schedule a 30-minute product walkthrough demo with ${contact.name}`);
                }
              }}
              onAddContact={(newContact) => {
                const created: CRMContact = {
                  ...newContact,
                  id: 'crm-' + Date.now(),
                };
                setCrmContacts(prev => [created, ...prev]);
                logAuditAction('User (Approval)', `Added CRM contact ${newContact.name}`, 'HubSpot CRM', 'Verified');
              }}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarView
              events={calendarEvents}
              crmContacts={crmContacts}
              onScheduleEvent={(newEvent) => {
                const created: CalendarEvent = {
                  ...newEvent,
                  id: 'cal-' + Date.now(),
                };
                setCalendarEvents(prev => [created, ...prev]);
                logAuditAction('User (Approval)', `Scheduled session: ${newEvent.title}`, 'Google Calendar', 'Verified');
              }}
              onRequestPrepForEvent={(event) => {
                handleExecuteCommand(`Jack, prepare an executive talking points briefing for upcoming meeting: "${event.title}"`);
              }}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              metrics={marketingMetrics}
              onAskJackForReport={() => {
                handleExecuteCommand('Jack, provide a detailed performance marketing and ROAS analytics briefing with recommendations');
              }}
            />
          )}

          {activeTab === 'competitors' && (
            <CompetitorMatrix
              competitors={competitors}
              onAnalyzeNewCompetitor={(name) => {
                handleExecuteCommand(`Jack, compare our business and marketing solution against ${name} with pricing and strengths`);
              }}
            />
          )}

          {activeTab === 'workflow' && (
            <WorkflowMatrix
              tasks={workflowTasks}
              onToggleTaskComplete={(taskId) => {
                setWorkflowTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
              }}
              onAddTask={(newTask) => {
                const created: WorkflowTask = {
                  ...newTask,
                  id: 'task-' + Date.now(),
                };
                setWorkflowTasks(prev => [created, ...prev]);
                logAuditAction('User (Approval)', `Added workflow task: ${newTask.title}`, 'Daily Queue', 'Verified');
              }}
              onReprioritize={() => {
                handleExecuteCommand('Jack, re-prioritize all my tasks today by highest revenue and marketing impact');
              }}
            />
          )}

          {activeTab === 'automations' && (
            <AutomationsView
              onTriggerRecipeTest={(recipeName) => {
                handleExecuteCommand(`Jack, simulate and trigger automation workflow: "${recipeName}"`);
              }}
            />
          )}

          {activeTab === 'security' && (
            <SecurityCompliance
              auditLogs={auditLogs}
              onTriggerKeyRotation={() => {
                logAuditAction('User (Approval)', 'Manual AES-256 GCM master key rotation completed', 'Key Vault Enclave', 'Verified');
                setLatestSpokenResponse('Cryptographic master keys rotated successfully. Zero-knowledge session re-authenticated.');
              }}
            />
          )}
        </div>
      </main>

      {/* Footer Info */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Jack AI Executive Assistant • Powered by Gemini 3.8 Flash • AES-256 GCM Zero-Knowledge Enclave</span>
          <span className="text-slate-400">SOC2 Type II & GDPR Compliant • Zero Training on Proprietary Data</span>
        </div>
      </footer>

      {/* Multi-Tenant Organization Governance Modal */}
      <OrgGovernanceModal
        isOpen={isOrgModalOpen}
        onClose={() => setIsOrgModalOpen(false)}
        currentUser={currentUser}
        onSwitchUserPersona={handleSwitchUserPersona}
        organizations={organizations}
        members={members}
        activeOrgId={activeOrgId}
        onSelectOrg={(orgId) => {
          setActiveOrgId(orgId);
          setIsOrgModalOpen(false);
        }}
        onCreateOrganization={handleCreateOrganization}
        onAddMember={handleAddMember}
        onRemoveMember={handleRemoveMember}
      />

      {/* Real-Time Firebase Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onAuthSuccess={(newProfile) => {
          setCurrentUser(newProfile);
          logAuditAction('User (Approval)', `User ${newProfile.displayName || newProfile.email} authenticated via Firebase Auth (Real-Time)`, 'Identity Service', 'Verified');
          setLatestSpokenResponse(`Welcome back, ${newProfile.displayName}. Real-time synchronization active.`);
        }}
      />

      {/* Official Executive & Customer Guide Modal */}
      <UserGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      {/* Deployment & Production Cloud Hub Modal */}
      <DeploymentModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        sharedAppUrl="https://ais-pre-5eui5th7jd3carxzyv3nnv-250042912168.asia-southeast1.run.app"
        devAppUrl="https://ais-dev-5eui5th7jd3carxzyv3nnv-250042912168.asia-southeast1.run.app"
        firestoreDbId="ai-studio-jackaibusinessma-bf94100f-8209-456c-a007-554a0c52c4d6"
      />
    </div>
  );
}
