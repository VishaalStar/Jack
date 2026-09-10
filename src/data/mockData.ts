import { CRMContact, CalendarEvent, WorkflowTask, AuditLogEntry, CompetitorData, MarketingMetrics, StagedAction } from '../types';

// Exactly 1 clean CRM Contact / Deal for Demo testing
export const initialCRMContacts: CRMContact[] = [
  {
    id: 'crm-demo-1',
    name: 'Jordan Hayes',
    email: 'jordan@apexpartner.co',
    company: 'Apex Partner Corp',
    role: 'Managing Director',
    dealValue: 45000,
    stage: 'Proposal',
    leadScore: 92,
    lastContact: 'Today at 9:30 AM',
    notes: [
      'Testing partner lead for Demo organization.',
      'Interested in autonomous real-time sync and approval queues.',
      'Ready to transition from example data to live sync when connected.'
    ],
    avatarColor: 'from-cyan-500 to-blue-600'
  }
];

// Exactly 1 clean Calendar Event for Demo testing
export const initialCalendarEvents: CalendarEvent[] = [
  {
    id: 'cal-demo-1',
    title: 'Demo Strategy & Automation Walkthrough with Jordan Hayes',
    startTime: '11:00 AM',
    endTime: '11:45 AM',
    attendees: ['jordan@apexpartner.co', 'alex.vance@demo.co'],
    platform: 'Google Meet',
    status: 'confirmed',
    crmContactId: 'crm-demo-1',
    prepBriefing: 'Jordan requested a live walkthrough of the Safeguard Approval Queue and real-time multi-tenant sync.',
    priority: 'high'
  }
];

// Exactly 1 clean Daily Workflow Task for Demo testing
export const initialWorkflowTasks: WorkflowTask[] = [
  {
    id: 'task-demo-1',
    title: 'Review staged outreach email in Demo enclave',
    category: 'Sales',
    priorityScore: 95,
    urgency: 'Critical',
    estimatedMinutes: 3,
    completed: false,
    dueDate: 'Today, 11:30 AM',
    reasoning: 'Alex Vance is testing the safeguard staging mechanism before activating live sends.'
  }
];

// Exactly 1 clean Competitor reference
export const initialCompetitors: CompetitorData[] = [
  {
    id: 'comp-demo-1',
    name: 'Legacy Cloud Automation',
    marketShare: '32%',
    pricingTier: '$499 - $1,999 / mo',
    primaryStrengths: ['Established brand heritage', 'Broad legacy enterprise connectors'],
    primaryWeaknesses: ['No safeguard human approval queue (risks blind sends)', 'Rigid setup', 'Slow reaction time'],
    targetAudience: 'Traditional B2B Departments',
    ourAdvantage: 'Jack AI provides instant voice & text execution, human-in-the-loop safety staging, and zero-knowledge encryption.',
    growthRate: '+10% YoY'
  }
];

// Baseline clean marketing metrics
export const initialMarketingMetrics: MarketingMetrics = {
  cac: 78.5,
  roas: 4.6,
  conversionRate: 4.12,
  pipelineValue: 45000,
  activeCampaigns: 1,
  emailOpenRate: 52.4,
  leadVelocityRate: 31.0,
  dailyAttribution: [
    { day: 'Mon', organic: 12, paidSocial: 24, coldEmail: 18 },
    { day: 'Tue', organic: 18, paidSocial: 31, coldEmail: 22 },
    { day: 'Wed', organic: 21, paidSocial: 36, coldEmail: 25 },
    { day: 'Thu', organic: 26, paidSocial: 42, coldEmail: 29 },
    { day: 'Fri', organic: 30, paidSocial: 48, coldEmail: 34 },
    { day: 'Sat', organic: 16, paidSocial: 22, coldEmail: 14 },
    { day: 'Sun', organic: 14, paidSocial: 20, coldEmail: 12 }
  ],
  funnelMetrics: [
    { stage: 'Campaign Reach', count: 24500, dropoff: '0%' },
    { stage: 'High Intent Clicks', count: 1840, dropoff: '92.5%' },
    { stage: 'Marketing Qualified Leads', count: 142, dropoff: '92.3%' },
    { stage: 'Sales Meetings Booked', count: 28, dropoff: '80.2%' },
    { stage: 'Deals Closed Won', count: 8, dropoff: '71.4%' }
  ]
};

// Exactly 1 clean Staged Action for Demo testing
export const initialStagedActions: StagedAction[] = [
  {
    id: 'stage-demo-1',
    type: 'draft_email',
    title: 'Personalized Follow-up to Jordan Hayes (Apex Partner Corp)',
    description: 'Drafted tailored proposal briefing for the Demo organization. Awaiting human authorization before sending.',
    targetPlatform: 'Gmail',
    status: 'staged_for_approval',
    createdAt: '5 minutes ago',
    confidenceScore: 99,
    encryptedChecksum: 'sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    details: {
      recipient: 'jordan@apexpartner.co',
      recipientName: 'Jordan Hayes',
      subject: 'Demo + Apex Partner Corp: Autonomous Operations & Real-Time Sync',
      body: `Hi Jordan,\n\nGreat speaking with you earlier regarding Apex Partner Corp's operations. As discussed in our Demo walkthrough, Jack AI operates with strict Human-In-The-Loop safeguards so nothing is sent blindly.\n\nHighlights of our setup:\n• Safeguard approval queue for all outgoing emails & CRM modifications\n• Real-time synchronization powered by Firebase Firestore\n• Multi-tenant role isolation for company teams\n\nLooking forward to our 11:00 AM demo sync.\n\nBest regards,\nAlex Vance | Operations Lead at Demo`,
      tags: ['Demo Lead', 'Approval Required', 'Real-Time Sync']
    },
    securityCheck: {
      isEncrypted: true,
      piiSafe: true,
      compliancePassed: true
    }
  }
];

// Clean Audit Logs
export const initialAuditLogs: AuditLogEntry[] = [
  {
    id: 'audit-demo-1',
    timestamp: 'Just now',
    actor: 'Jack AI',
    action: 'AES-256 GCM cryptographic session established for Demo organization',
    targetSystem: 'Zero-Knowledge Key Vault',
    encryptionHash: '0x8f4d92a1...bc78',
    status: 'Verified',
    ipOrigin: '127.0.0.1 (Demo Enclave)'
  },
  {
    id: 'audit-demo-2',
    timestamp: '5 minutes ago',
    actor: 'Jack AI',
    action: 'Safeguard trigger held: Email draft to jordan@apexpartner.co queued in staging',
    targetSystem: 'Gmail Workspace Connector',
    encryptionHash: '0x3b118a44...99ef',
    status: 'Pending Review',
    ipOrigin: '127.0.0.1 (Safeguard Sandbox)'
  }
];

