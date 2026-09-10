import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  FileCheck, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Database,
  Terminal,
  Cpu
} from 'lucide-react';
import { AuditLogEntry } from '../types';

interface SecurityComplianceProps {
  auditLogs: AuditLogEntry[];
  onTriggerKeyRotation: () => void;
}

export const SecurityCompliance: React.FC<SecurityComplianceProps> = ({
  auditLogs,
  onTriggerKeyRotation,
}) => {
  const [isPIIMasked, setIsPIIMasked] = useState(true);
  const [encryptKeyStatus, setEncryptKeyStatus] = useState<'Active' | 'Rotating'>('Active');
  const [testPayload, setTestPayload] = useState('Confidential Client Deal: $120,000 ARR');
  const [encryptedOutput, setEncryptedOutput] = useState('');

  const handleTestEncrypt = () => {
    // Simulated AES-256 GCM cryptographic hash output
    const dummyHash = 'aes256-gcm:' + btoa(testPayload).split('').reverse().join('') + '.9e81bfa0c7';
    setEncryptedOutput(dummyHash);
  };

  const handleRotate = () => {
    setEncryptKeyStatus('Rotating');
    setTimeout(() => {
      setEncryptKeyStatus('Active');
      onTriggerKeyRotation();
    }, 1200);
  };

  return (
    <div id="security-compliance-module" className="space-y-4">
      {/* Header Banner */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-semibold text-slate-100">
              Zero-Trust Encryption & Privacy Compliance Enclave
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise-grade client-side encryption, immutable tamper-evident audit trails, and strict zero-training compliance.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleRotate}
            disabled={encryptKeyStatus === 'Rotating'}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${encryptKeyStatus === 'Rotating' ? 'animate-spin' : ''}`} />
            <span>{encryptKeyStatus === 'Rotating' ? 'Rotating Keys...' : 'Rotate AES Keys'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPIIMasked(!isPIIMasked)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            {isPIIMasked ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
            <span>PII Masking: {isPIIMasked ? 'Active' : 'Off'}</span>
          </button>
        </div>
      </div>

      {/* Compliance Certification Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>SOC2 Type II</span>
          </div>
          <p className="text-xs text-slate-300">Continuous cryptographic monitoring & zero leakage controls.</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>GDPR Article 32</span>
          </div>
          <p className="text-xs text-slate-300">Pseudonymization and encrypted data storage by design.</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Zero Training Policy</span>
          </div>
          <p className="text-xs text-slate-300">Proprietary CRM data & marketing assets are never used for model training.</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>AES-256 GCM</span>
          </div>
          <p className="text-xs text-slate-300">Hardware-accelerated client enclave encryption before transit.</p>
        </div>
      </div>

      {/* Live Cryptographic Enclave Sandbox */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-semibold text-slate-100">Live Cryptographic Payload Encryption Test</h4>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5" /> Hardware Enclave Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Plaintext Business Data (Input)</label>
            <textarea
              rows={3}
              value={testPayload}
              onChange={(e) => setTestPayload(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 font-mono"
            />
            <button
              type="button"
              onClick={handleTestEncrypt}
              className="mt-2 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors"
            >
              Encrypt with Local Key
            </button>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Encrypted Ciphertext (AES-256 Output)</label>
            <div className="w-full h-24 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-cyan-300 break-all overflow-y-auto">
              {encryptedOutput || 'Click "Encrypt with Local Key" to simulate zero-knowledge cryptographic cipher generation.'}
            </div>
          </div>
        </div>
      </div>

      {/* Immutable Audit Log Table */}
      <div className="rounded-xl bg-slate-900/80 border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-slate-400" />
            <h4 className="text-sm font-semibold text-slate-100">Immutable Audit Trail</h4>
          </div>
          <span className="text-xs text-slate-500 font-mono">SHA-256 Verified Ledger</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-medium">
                <th className="p-3 pl-4">Timestamp</th>
                <th className="p-3">Actor</th>
                <th className="p-3">Action Description</th>
                <th className="p-3">Target System</th>
                <th className="p-3">Cryptographic Hash</th>
                <th className="p-3 pr-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30">
                  <td className="p-3 pl-4 font-mono text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                  <td className="p-3 font-semibold text-slate-200">{log.actor}</td>
                  <td className="p-3 text-slate-300">
                    {isPIIMasked ? log.action.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_PII]') : log.action}
                  </td>
                  <td className="p-3 text-slate-400 font-mono text-[11px]">{log.targetSystem}</td>
                  <td className="p-3 font-mono text-cyan-400 text-[11px]">{log.encryptionHash}</td>
                  <td className="p-3 pr-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
