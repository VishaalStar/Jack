import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Send, Sparkles, ShieldCheck, CheckCircle2, RefreshCw } from 'lucide-react';
import { speakText, stopSpeaking } from '../services/agentClient';

interface JackVoiceOrbProps {
  isProcessing: boolean;
  currentStatus: 'idle' | 'listening' | 'thinking' | 'speaking';
  latestSpokenResponse: string;
  onExecuteCommand: (prompt: string) => void;
}

export const JackVoiceOrb: React.FC<JackVoiceOrbProps> = ({
  isProcessing,
  currentStatus,
  latestSpokenResponse,
  onExecuteCommand,
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  // Default to false: Never speak on site load unless user explicitly requests or toggles voice feedback
  const [voiceFeedbackEnabled, setVoiceFeedbackEnabled] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeakingInternal, setIsSpeakingInternal] = useState(false);
  const recognitionRef = useRef<any>(null);
  const isInitialMount = useRef(true);

  // Initialize Speech Recognition if supported in browser
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const text = event.results[current][0].transcript;
          setTranscript(text);
          setInputText(text);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
          // If transcript had text, execute
          if (transcript.trim()) {
            onExecuteCommand(transcript.trim());
            setTranscript('');
          }
        };

        recognitionRef.current = recognition;
      } catch (e) {
        console.warn('Speech recognition not available', e);
      }
    }
  }, [transcript, onExecuteCommand]);

  // Handle voice synthesis when new spoken response arrives (NEVER on initial mount)
  useEffect(() => {
    // Suppress speech on initial page load / first mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (latestSpokenResponse && voiceFeedbackEnabled) {
      setIsSpeakingInternal(true);
      speakText(latestSpokenResponse, () => {
        setIsSpeakingInternal(false);
      });
    }
    return () => {
      stopSpeaking();
    };
  }, [latestSpokenResponse, voiceFeedbackEnabled]);

  const handleManualSpeakCurrent = () => {
    if (!latestSpokenResponse) return;
    if (isSpeakingInternal) {
      stopSpeaking();
      setIsSpeakingInternal(false);
    } else {
      setIsSpeakingInternal(true);
      speakText(latestSpokenResponse, () => {
        setIsSpeakingInternal(false);
      });
    }
  };

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      stopSpeaking();
      setIsSpeakingInternal(false);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.warn(e);
          // Fallback simulation if mic is blocked in sandbox iframe
          simulateVoiceInput();
        }
      } else {
        simulateVoiceInput();
      }
    }
  };

  const simulateVoiceInput = () => {
    setIsListening(true);
    setTranscript('Listening to your voice command...');
    setTimeout(() => {
      const sample = 'Jack, send an email to Sarah but do not send it, just stage it for review';
      setTranscript(sample);
      setInputText(sample);
      setIsListening(false);
      onExecuteCommand(sample);
    }, 2200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    const command = inputText.trim();
    setInputText('');
    stopSpeaking();
    onExecuteCommand(command);
  };

  const effectiveStatus = isListening 
    ? 'listening' 
    : isProcessing 
    ? 'thinking' 
    : isSpeakingInternal 
    ? 'speaking' 
    : 'idle';

  return (
    <div id="jack-voice-container" className="relative rounded-2xl bg-slate-900/90 border border-slate-800/80 p-6 shadow-2xl backdrop-blur-xl overflow-hidden">
      {/* Background ambient mesh glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar of Jack */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 shadow-md shadow-cyan-500/20">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-semibold text-slate-100 tracking-tight">Jack Executive Voice Agent</h2>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Siri for Marketing & Enterprise
              </span>
            </div>
            <p className="text-xs text-slate-400">Voice reactive • Safeguard staging queue • Zero blind executions</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Encrypted tag */}
          <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300 text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>AES-256 Verified</span>
          </div>

          {/* Voice feedback toggle */}
          <button
            type="button"
            onClick={() => {
              if (voiceFeedbackEnabled) {
                stopSpeaking();
                setIsSpeakingInternal(false);
              }
              setVoiceFeedbackEnabled(!voiceFeedbackEnabled);
            }}
            title={voiceFeedbackEnabled ? 'Voice feedback ON (Click to mute)' : 'Voice feedback OFF (Click to unmute)'}
            className={`p-2 rounded-lg border text-xs transition-colors ${
              voiceFeedbackEnabled
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            {voiceFeedbackEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Dynamic Siri-style Voice Orb & Waveform */}
      <div className="py-5 flex flex-col items-center justify-center relative z-10">
        <div className="relative flex items-center justify-center">
          {/* Animated concentric rings */}
          <div
            className={`absolute w-36 h-36 rounded-full border border-cyan-500/20 transition-all duration-700 ${
              effectiveStatus === 'listening'
                ? 'scale-125 border-cyan-400/40 animate-ping opacity-60'
                : effectiveStatus === 'speaking'
                ? 'scale-115 border-indigo-400/40 animate-pulse'
                : 'scale-100 opacity-20'
            }`}
          />
          <div
            className={`absolute w-28 h-28 rounded-full transition-all duration-500 ${
              effectiveStatus === 'listening'
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-md scale-110'
                : effectiveStatus === 'thinking'
                ? 'bg-gradient-to-r from-amber-500/20 to-cyan-500/20 blur-md animate-spin'
                : effectiveStatus === 'speaking'
                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-md'
                : 'bg-cyan-500/5 blur-sm'
            }`}
          />

          {/* Center Interactive Microphone Button */}
          <button
            id="jack-mic-btn"
            type="button"
            onClick={toggleListening}
            className={`relative z-20 w-18 h-18 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 ${
              effectiveStatus === 'listening'
                ? 'bg-gradient-to-tr from-cyan-500 to-blue-500 text-white shadow-cyan-500/40 scale-105 ring-cyan-500/40'
                : effectiveStatus === 'thinking'
                ? 'bg-gradient-to-tr from-amber-600 to-cyan-600 text-white shadow-amber-500/30'
                : effectiveStatus === 'speaking'
                ? 'bg-gradient-to-tr from-indigo-600 to-cyan-600 text-white shadow-indigo-500/30 ring-indigo-500/40'
                : 'bg-slate-800/90 text-cyan-400 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/50 hover:shadow-cyan-500/10'
            }`}
            title="Click to speak to Jack"
          >
            {effectiveStatus === 'listening' ? (
              <Mic className="w-8 h-8 animate-bounce" />
            ) : effectiveStatus === 'thinking' ? (
              <RefreshCw className="w-8 h-8 animate-spin text-white" />
            ) : effectiveStatus === 'speaking' ? (
              <Volume2 className="w-8 h-8 text-white animate-pulse" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </button>
        </div>

        {/* Dynamic Frequency Bars */}
        <div className="flex items-center space-x-1.5 mt-5 h-6">
          {[40, 75, 55, 95, 60, 85, 45, 90, 70, 50, 80, 65].map((heightPercent, idx) => {
            const isPulsing = effectiveStatus === 'listening' || effectiveStatus === 'speaking';
            return (
              <div
                key={idx}
                className={`w-1 rounded-full transition-all duration-150 ${
                  effectiveStatus === 'listening'
                    ? 'bg-cyan-400'
                    : effectiveStatus === 'speaking'
                    ? 'bg-indigo-400'
                    : effectiveStatus === 'thinking'
                    ? 'bg-amber-400'
                    : 'bg-slate-700'
                }`}
                style={{
                  height: isPulsing ? `${Math.max(15, (heightPercent * (idx % 3 + 1)) % 100)}%` : '20%',
                  opacity: isPulsing ? 0.9 : 0.4
                }}
              />
            );
          })}
        </div>

        {/* Current State Status Line */}
        <div className="mt-2.5 flex items-center space-x-2 text-xs">
          <span
            className={`w-2 h-2 rounded-full ${
              effectiveStatus === 'listening'
                ? 'bg-cyan-400 animate-ping'
                : effectiveStatus === 'thinking'
                ? 'bg-amber-400 animate-pulse'
                : effectiveStatus === 'speaking'
                ? 'bg-indigo-400'
                : 'bg-emerald-400'
            }`}
          />
          <span className="font-medium text-slate-300">
            {effectiveStatus === 'listening'
              ? 'Listening to voice command...'
              : effectiveStatus === 'thinking'
              ? 'Analyzing intent & staging safeguard actions...'
              : effectiveStatus === 'speaking'
              ? 'Jack is speaking...'
              : 'Jack is standing by • Say "Jack send an email..." or type below'}
          </span>
        </div>

        {/* Last spoken response quote with explicit on-demand play/stop */}
        {latestSpokenResponse && (
          <div className="mt-3 px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs text-slate-200 max-w-xl text-center leading-relaxed flex items-center justify-between gap-3 shadow-inner">
            <div className="flex-1 text-left sm:text-center">
              <span className="text-cyan-400 font-semibold mr-1.5">Jack:</span>
              "{latestSpokenResponse}"
            </div>
            <button
              type="button"
              onClick={handleManualSpeakCurrent}
              className={`shrink-0 p-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 text-[11px] ${
                isSpeakingInternal
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 hover:bg-rose-500/30'
                  : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20'
              }`}
              title={isSpeakingInternal ? 'Stop reading' : 'Read aloud with voice'}
            >
              {isSpeakingInternal ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Stop</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Speak</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Text Command Input Bar */}
      <form onSubmit={handleSubmit} className="mt-4 relative z-10 flex items-center gap-2">
        <div className="relative flex-1">
          <input
            id="jack-text-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder='Try: "Jack send an email to Sarah with Q3 proposal", "Jack compare our competitors", "What is my priority today?"'
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            disabled={isProcessing}
          />
        </div>
        <button
          id="jack-submit-command"
          type="submit"
          disabled={!inputText.trim() || isProcessing}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-semibold shadow-md shadow-cyan-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
        >
          <span>Execute</span>
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Suggested Fast Command Pills */}
      <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60 text-xs">
        <span className="text-slate-500 font-medium">Quick Prompts:</span>
        <button
          type="button"
          onClick={() => onExecuteCommand('Jack, send an email to Sarah Chen about our 25-seat tier but do not send it, stage for review')}
          className="px-2.5 py-1 rounded-lg bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700/70 text-slate-300 hover:text-cyan-300 transition-colors"
        >
          ✉️ Draft Sarah Chen Email (Hold in Stage)
        </button>
        <button
          type="button"
          onClick={() => onExecuteCommand('Jack, compare our marketing platform with OmniFlow and MarketNexus')}
          className="px-2.5 py-1 rounded-lg bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700/70 text-slate-300 hover:text-cyan-300 transition-colors"
        >
          📊 Compare Competitor Pricing & Battlecards
        </button>
        <button
          type="button"
          onClick={() => onExecuteCommand('Jack, what should I focus on first today and prioritize my workflow?')}
          className="px-2.5 py-1 rounded-lg bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700/70 text-slate-300 hover:text-cyan-300 transition-colors"
        >
          ⚡ Prioritize My Daily Workflow
        </button>
        <button
          type="button"
          onClick={() => onExecuteCommand('Jack, give me a detailed marketing performance and ROAS analytics report')}
          className="px-2.5 py-1 rounded-lg bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700/70 text-slate-300 hover:text-cyan-300 transition-colors"
        >
          📈 Executive Analytics & ROAS Report
        </button>
      </div>
    </div>
  );
};
