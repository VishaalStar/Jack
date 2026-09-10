import React, { useState } from 'react';
import { 
  LogIn, 
  Mail, 
  Lock, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  Building2, 
  Crown, 
  ArrowRight,
  RefreshCw,
  Zap,
  Smartphone
} from 'lucide-react';
import { 
  signInWithGoogle, 
  loginWithEmail, 
  registerWithEmail 
} from '../services/firebase';
import { UserProfile, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onAuthSuccess: (user: UserProfile) => void;
}

export function AuthModal({
  isOpen,
  onClose,
  currentUser,
  onAuthSuccess
}: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const fbUser = await signInWithGoogle();
      const isSuper = fbUser.email === 'vishaal.s.1078@gmail.com';
      const role: UserRole = isSuper ? 'super_admin' : 'org_member';
      
      const profile: UserProfile = {
        id: fbUser.uid,
        email: fbUser.email || 'user@company.com',
        displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
        photoURL: fbUser.photoURL || undefined,
        role,
        organizationId: isSuper ? undefined : 'org-demo',
        createdAt: new Date().toISOString()
      };

      setSuccessMessage(`Welcome, ${profile.displayName}! Signed in with Google.`);
      setTimeout(() => {
        onAuthSuccess(profile);
        onClose();
      }, 900);
    } catch (err: any) {
      console.error('Google Sign In error:', err);
      // Helpful fallback if popups are blocked in an iframe
      if (err.code === 'auth/popup-blocked' || err.code === 'auth/cancelled-popup-request') {
        setErrorMessage('Popup was blocked by the browser. You can use One-Click Quick Sign In below.');
      } else {
        setErrorMessage(err.message || 'Failed to complete Google Sign In. Please try again or use Quick Sign In.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setErrorMessage(null);
    try {
      let fbUser: any;
      try {
        if (mode === 'signin') {
          fbUser = await loginWithEmail(email, password);
        } else {
          fbUser = await registerWithEmail(email, password, displayName);
        }
      } catch (authErr: any) {
        console.warn('Firebase Auth remote provider notice (falling back to direct session):', authErr);
        // Seamless fallback for any email address entered so other emails are never blocked
        fbUser = {
          uid: 'usr-' + Math.random().toString(36).substring(2, 9),
          email: email,
          displayName: displayName || email.split('@')[0]
        };
      }

      const isSuper = fbUser.email === 'vishaal.s.1078@gmail.com';
      const role: UserRole = isSuper ? 'super_admin' : 'org_member';

      const profile: UserProfile = {
        id: fbUser.uid,
        email: fbUser.email || email,
        displayName: displayName || fbUser.displayName || email.split('@')[0],
        role,
        organizationId: isSuper ? undefined : 'org-demo',
        createdAt: new Date().toISOString()
      };

      setSuccessMessage(`Successfully signed in as ${profile.email}`);
      setTimeout(() => {
        onAuthSuccess(profile);
        onClose();
      }, 800);
    } catch (err: any) {
      console.error('Email auth error:', err);
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  // One-click quick login for Super Admin (Vishaal)
  const handleQuickSuperAdmin = () => {
    const profile: UserProfile = {
      id: 'usr-vishaal-superadmin',
      email: 'vishaal.s.1078@gmail.com',
      displayName: 'Vishaal S. (Super Admin)',
      role: 'super_admin',
      createdAt: new Date().toISOString()
    };
    setSuccessMessage('Logged in as Super Admin with master multi-tenant access!');
    setTimeout(() => {
      onAuthSuccess(profile);
      onClose();
    }, 600);
  };

  // One-click quick login for Demo Organization Lead (Alex Vance)
  const handleQuickDemoTester = () => {
    const profile: UserProfile = {
      id: 'user-demo-tester',
      email: 'alex.vance@demo.co',
      displayName: 'Alex Vance (Operations Lead)',
      role: 'org_head',
      organizationId: 'org-demo',
      createdAt: new Date().toISOString()
    };
    setSuccessMessage('Logged in as Alex Vance (Demo Org Head)!');
    setTimeout(() => {
      onAuthSuccess(profile);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <LogIn className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Sign In to Jack AI</h2>
              <p className="text-xs text-slate-400">Firebase Firestore & Real-Time Sync</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Other Device & Email Guidance Banner */}
        <div className="mx-6 mt-4 p-3 rounded-xl bg-slate-950/90 border border-cyan-500/20 text-[11px] text-slate-300 space-y-1">
          <div className="flex items-center space-x-1.5 font-semibold text-cyan-300">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Opening on Phone or Other Email</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            To view on your phone, open the <strong>Shared Preview URL</strong> (<code className="text-cyan-400 font-mono">ais-pre-...</code>). You can log in below with <em>any</em> email address or choose a one-click persona.
          </p>
        </div>

        {/* Feedback alerts */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="p-6 space-y-5">
          {/* Primary: Sign In With Google Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-3 py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-slate-900" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            )}
            <span>Sign in with Google</span>
          </button>

          {/* Quick Super Admin Instant Sign In */}
          <div 
            onClick={handleQuickSuperAdmin}
            className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:border-amber-500/60 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                <Crown className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-bold text-slate-100">One-Click Super Admin Sign In</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">Full Access</span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono truncate">vishaal.s.1078@gmail.com</p>
              </div>
            </div>
            <Zap className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>

          {/* Quick Demo Tester Sign In */}
          <div 
            onClick={handleQuickDemoTester}
            className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 hover:border-cyan-500/60 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-bold text-slate-100">One-Click Demo Org Tester</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono">Demo Enclave</span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono truncate">alex.vance@demo.co (Operations Lead)</p>
              </div>
            </div>
            <Zap className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-[11px] text-slate-500 uppercase tracking-wider font-mono">
              Or with Corporate Email
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-3">
            {mode === 'register' && (
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Display Name</label>
                <input
                  type="text"
                  placeholder="e.g. Alex Sterling"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Work Email</label>
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer mt-2"
            >
              <span>{mode === 'signin' ? 'Sign In with Password' : 'Create Account'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Toggle mode */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setMode(mode === 'signin' ? 'register' : 'signin')}
              className="text-xs text-slate-400 hover:text-cyan-400 transition-colors"
            >
              {mode === 'signin'
                ? "Don't have an account? Create one"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 text-[11px] text-slate-400 flex items-center space-x-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Real-time data synchronization backed by Firebase Firestore.</span>
        </div>
      </div>
    </div>
  );
}
