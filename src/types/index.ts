export type ActionType = 
  | 'draft_email'
  | 'compare_competitors'
  | 'schedule_meeting'
  | 'update_crm'
  | 'generate_analytics'
  | 'prioritize_tasks'
  | 'launch_workflow'
  | 'security_audit';

export type ActionStatus = 'staged_for_approval' | 'approved_and_executed' | 'rejected' | 'in_progress';

export interface StagedAction {
  id: string;
  type: ActionType;
  title: string;
  description: string;
  targetPlatform: 'Gmail' | 'Outlook' | 'HubSpot CRM' | 'Salesforce' | 'Google Calendar' | 'Meta Ads' | 'LinkedIn' | 'Slack';
  status: ActionStatus;
  createdAt: string;
  executedAt?: string;
  confidenceScore: number;
  encryptedChecksum: string;
  details: {
    recipient?: string;
    recipientName?: string;
    subject?: string;
    body?: string;
    meetingTime?: string;
    durationMinutes?: number;
    attendees?: string[];
    agenda?: string;
    crmDealId?: string;
    crmField?: string;
    crmValue?: string | number;
    campaignBudget?: number;
    competitorName?: string;
    comparisonData?: Record<string, string | number>;
    tags?: string[];
  };
  securityCheck: {
    isEncrypted: boolean;
    piiSafe: boolean;
    compliancePassed: boolean;
  };
}

export interface CRMContact {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  dealValue: number;
  stage: 'Lead' | 'Meeting' | 'Proposal' | 'Negotiation' | 'Closed Won';
  leadScore: number;
  lastContact: string;
  notes: string[];
  avatarColor: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  attendees: string[];
  platform: 'Google Meet' | 'Zoom' | 'In-Person';
  status: 'confirmed' | 'tentative';
  crmContactId?: string;
  prepBriefing?: string;
  priority: 'high' | 'medium' | 'low';
}

export interface WorkflowTask {
  id: string;
  title: string;
  category: 'Marketing' | 'Sales' | 'Executive' | 'Operations';
  priorityScore: number; // 1 - 100
  urgency: 'Critical' | 'High' | 'Medium' | 'Low';
  estimatedMinutes: number;
  completed: boolean;
  dueDate: string;
  reasoning: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: 'Jack AI' | 'User (Approval)' | 'Automated Trigger';
  action: string;
  targetSystem: string;
  encryptionHash: string;
  status: 'Verified' | 'Encrypted & Stored' | 'Pending Review';
  ipOrigin: string;
}

export interface CompetitorData {
  id: string;
  name: string;
  marketShare: string;
  pricingTier: string;
  primaryStrengths: string[];
  primaryWeaknesses: string[];
  targetAudience: string;
  ourAdvantage: string;
  growthRate: string;
}

export interface MarketingMetrics {
  cac: number;
  roas: number;
  conversionRate: number;
  pipelineValue: number;
  activeCampaigns: number;
  emailOpenRate: number;
  leadVelocityRate: number;
  dailyAttribution: Array<{ day: string; organic: number; paidSocial: number; coldEmail: number }>;
  funnelMetrics: Array<{ stage: string; count: number; dropoff: string }>;
}

export type UserRole = 'super_admin' | 'org_head' | 'org_member';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  organizationId?: string;
  organizationName?: string;
  photoURL?: string;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  headUserId: string;
  headUserEmail: string;
  headUserName?: string;
  memberCount: number;
  status: 'active' | 'suspended';
  industry?: string;
  plan?: string;
  createdAt: string;
}

export interface OrgMember {
  id: string;
  organizationId: string;
  userId: string;
  email: string;
  displayName: string;
  role: 'org_head' | 'org_member';
  title?: string;
  joinedAt: string;
}

export interface EmailMessage {
  id: string;
  organizationId: string;
  sender: string;
  senderEmail: string;
  recipientEmail: string;
  subject: string;
  snippet: string;
  body: string;
  date: string;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
  source: 'Google Workspace' | 'Outlook 365' | 'Connected Mailbox';
  tags: string[];
}
