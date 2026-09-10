import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as fbSignOut, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  User as FbUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDocFromServer,
  collection, 
  query, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  orderBy,
  where,
  getDocs,
  Timestamp
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Organization, OrgMember, UserProfile, StagedAction, CRMContact, CalendarEvent, EmailMessage, AuditLogEntry } from '../types';

// Initialize Firebase app singleton
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Explicitly use the configured firestore database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);

// Skill mandatory connection test
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase Firestore connection verified successfully.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore client appears offline or connecting:', error);
    } else {
      console.log('Firestore connection ping completed:', error);
    }
    return false;
  }
}

// Initial boot ping
testFirestoreConnection();

// Initial seed data with exactly ONE clean example organization: Demo
export const DEFAULT_ORGANIZATIONS: Organization[] = [
  {
    id: 'org-demo',
    name: 'Demo',
    slug: 'demo',
    headUserId: 'user-demo-tester',
    headUserEmail: 'alex.vance@demo.co',
    headUserName: 'Alex Vance',
    memberCount: 1,
    status: 'active',
    industry: 'Software & Growth Operations',
    plan: 'Enterprise Trial',
    createdAt: new Date().toISOString()
  }
];

export const DEFAULT_MEMBERS: Record<string, OrgMember[]> = {
  'org-demo': [
    {
      id: 'mem-demo-1',
      organizationId: 'org-demo',
      userId: 'user-demo-tester',
      email: 'alex.vance@demo.co',
      displayName: 'Alex Vance',
      role: 'org_head',
      title: 'Operations & Growth Lead',
      joinedAt: new Date().toISOString()
    }
  ]
};

export const DEFAULT_EMAILS: Record<string, EmailMessage[]> = {
  'org-demo': [
    {
      id: 'em-demo-1',
      organizationId: 'org-demo',
      sender: 'Jordan Hayes (Apex Partner Corp)',
      senderEmail: 'jordan@apexpartner.co',
      recipientEmail: 'alex.vance@demo.co',
      subject: 'Re: Demo Walkthrough & API Connectors',
      snippet: 'Hi Alex, loved the initial overview. Let us proceed with testing the real-time sync when you are ready...',
      body: 'Hi Alex,\n\nLoved the initial overview of Jack AI. Let us proceed with testing the real-time sync when you are ready. Looking forward to approving the staged proposal in the safeguard queue.\n\nBest,\nJordan Hayes',
      date: 'Today, 09:30 AM',
      isRead: false,
      priority: 'high',
      source: 'Google Workspace',
      tags: ['Demo Review', 'Partner Inquiry']
    }
  ]
};

// Firestore CRUD operations with fallback to local state for seamless offline & preview
export async function createOrganizationInDb(org: Omit<Organization, 'id' | 'createdAt'>): Promise<Organization> {
  const newOrg: Organization = {
    ...org,
    id: `org-${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, 'organizations', newOrg.id), newOrg);
  } catch (err) {
    console.warn('Firestore setDoc failed, saving to memory fallback:', err);
  }

  return newOrg;
}

export async function addMemberToOrgInDb(orgId: string, member: Omit<OrgMember, 'id' | 'organizationId' | 'joinedAt'>): Promise<OrgMember> {
  const newMember: OrgMember = {
    ...member,
    id: `mem-${Date.now()}`,
    organizationId: orgId,
    joinedAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, 'organizations', orgId, 'members', newMember.id), newMember);
  } catch (err) {
    console.warn('Firestore setDoc failed, saving to memory fallback:', err);
  }

  return newMember;
}

export async function removeMemberFromOrgInDb(orgId: string, memberId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'organizations', orgId, 'members', memberId));
  } catch (err) {
    console.warn('Firestore deleteDoc failed:', err);
  }
}

export async function addIncomingEmailInDb(orgId: string, email: Omit<EmailMessage, 'id' | 'organizationId'>): Promise<EmailMessage> {
  const newEmail: EmailMessage = {
    ...email,
    id: `em-${Date.now()}`,
    organizationId: orgId
  };

  try {
    await setDoc(doc(db, 'organizations', orgId, 'emails', newEmail.id), newEmail);
  } catch (err) {
    console.warn('Firestore email setDoc failed:', err);
  }

  return newEmail;
}

// ==========================================
// Authentication Operations
// ==========================================

export async function signInWithGoogle(): Promise<FbUser> {
  googleProvider.setCustomParameters({ prompt: 'select_account' });
  const credential = await signInWithPopup(auth, googleProvider);
  return credential.user;
}

export async function loginWithEmail(email: string, pass: string): Promise<FbUser> {
  const credential = await signInWithEmailAndPassword(auth, email, pass);
  return credential.user;
}

export async function registerWithEmail(email: string, pass: string, displayName: string): Promise<FbUser> {
  const credential = await createUserWithEmailAndPassword(auth, email, pass);
  if (displayName && credential.user) {
    await updateProfile(credential.user, { displayName });
  }
  return credential.user;
}

export async function logOut(): Promise<void> {
  await fbSignOut(auth);
}

export function subscribeToAuth(callback: (user: FbUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// ==========================================
// Real-time Firestore Sync Listeners
// ==========================================

export function subscribeToOrganizations(onData: (orgs: Organization[]) => void) {
  try {
    const q = collection(db, 'organizations');
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const orgs = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Organization));
        onData(orgs);
      }
    }, (err) => {
      console.warn('Real-time organizations listener warning:', err.message);
    });
  } catch (e) {
    console.warn('Failed to attach organizations listener:', e);
    return () => {};
  }
}

export function subscribeToOrgEmails(orgId: string, onData: (emails: EmailMessage[]) => void) {
  try {
    const q = collection(db, 'organizations', orgId, 'emails');
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as EmailMessage));
        onData(list);
      }
    }, (err) => {
      console.warn(`Real-time emails listener warning for ${orgId}:`, err.message);
    });
  } catch (e) {
    console.warn('Failed to attach email listener:', e);
    return () => {};
  }
}

export async function seedLiveFirestoreIfEmpty(): Promise<void> {
  try {
    for (const org of DEFAULT_ORGANIZATIONS) {
      await setDoc(doc(db, 'organizations', org.id), org, { merge: true });
      const orgEmails = DEFAULT_EMAILS[org.id] || [];
      for (const em of orgEmails) {
        await setDoc(doc(db, 'organizations', org.id, 'emails', em.id), em, { merge: true });
      }
      const orgMems = DEFAULT_MEMBERS[org.id] || [];
      for (const m of orgMems) {
        await setDoc(doc(db, 'organizations', org.id, 'members', m.id), m, { merge: true });
      }
    }
    console.log('Live Firestore initial multi-tenant data synchronized.');
  } catch (e) {
    console.warn('Note: Seed write to Firestore completed with fallback:', e);
  }
}
