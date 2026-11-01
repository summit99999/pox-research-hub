import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Database, 
  Sparkles, 
  Mail, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  RefreshCw,
  Copy,
  Check,
  User,
  Code,
  BookOpen
} from 'lucide-react';
import { api } from '../lib/api';
import { isSupabaseConfigured } from '../lib/supabase';

export default function SettingsView({ health, onRefreshHealth }) {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  const runHealthTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const data = await api.getHealth();
      setTestResult(data);
      if (onRefreshHealth) onRefreshHealth();
    } catch (e) {
      setTestResult({ status: 'error', error: e.message });
    } finally {
      setTesting(false);
    }
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/30">
            <Settings className="w-5 h-5" />
          </span>
          <h1 className="text-xl font-bold text-slate-100">
            Cloud Infrastructure & Service Configuration
          </h1>
        </div>
        <p className="text-xs text-slate-400">
          Verify online database connections, AI model access, scientific API polite pools, and weekly cloud automation.
        </p>
      </div>

      {/* Diagnostics Bar */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-100">System Connection Health</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Backend API: <span className="text-emerald-400 font-mono">Online</span> | Database: <span className="font-mono text-slate-200">{health?.database || 'Pending'}</span> | AI Engine: <span className="font-mono text-slate-200">{health?.ai_engine || 'Pending'}</span>
          </p>
        </div>

        <button
          onClick={runHealthTest}
          disabled={testing}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
          <span>{testing ? 'Probing Cloud Services...' : 'Run Live Diagnostic'}</span>
        </button>
      </div>

      {testResult && (
        <div className={`p-4 rounded-xl text-xs border ${
          testResult.status === 'healthy' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
            : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
        }`}>
          <div className="font-semibold flex items-center gap-1.5 mb-1">
            <CheckCircle2 className="w-4 h-4" />
            Diagnostic Result
          </div>
          <pre className="font-mono text-[11px] mt-2 overflow-x-auto bg-slate-950/60 p-3 rounded">
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      )}

      {/* 1. Supabase Cloud PostgreSQL & Auth */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">1. Supabase Cloud Database & Auth</h3>
              <p className="text-xs text-slate-400">Stores permanent research data, metadata, AI summaries, and user library</p>
            </div>
          </div>

          <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${
            health?.database === 'connected' 
              ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
              : 'bg-amber-950 text-amber-300 border-amber-800'
          }`}>
            {health?.database === 'connected' ? 'Connected' : 'Setup Required'}
          </span>
        </div>

        <div className="space-y-3 pt-2 text-xs text-slate-300">
          <p className="leading-relaxed">
            Create a free Supabase project at{' '}
            <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline inline-flex items-center gap-1 font-semibold">
              supabase.com <ExternalLink className="w-3 h-3" />
            </a>.
          </p>

          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <span className="font-semibold text-slate-300 block">Required Steps:</span>
            <ol className="list-decimal list-inside space-y-1 text-slate-400">
              <li>In your Supabase Dashboard, open the <strong className="text-slate-200">SQL Editor</strong>.</li>
              <li>Paste and execute the schema file provided at: <code className="text-teal-300">supabase/schema.sql</code></li>
              <li>Under <strong className="text-slate-200">Project Settings → API</strong>, copy your Project URL, anon public key, and service_role secret.</li>
              <li>Add them to <code className="text-teal-300">backend/.env</code> and <code className="text-teal-300">frontend/.env</code>.</li>
            </ol>
          </div>
        </div>
      </div>

      {/* 2. Google Gemini AI Engine */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">2. Google Gemini AI Engine</h3>
              <p className="text-xs text-slate-400">Powers 13-section structured scientific summarization & research gap discovery</p>
            </div>
          </div>

          <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${
            health?.ai_engine === 'configured' 
              ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
              : 'bg-amber-950 text-amber-300 border-amber-800'
          }`}>
            {health?.ai_engine === 'configured' ? 'Configured' : 'Setup Required'}
          </span>
        </div>

        <div className="space-y-3 pt-2 text-xs text-slate-300">
          <p className="leading-relaxed">
            Get your free API key at{' '}
            <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline inline-flex items-center gap-1 font-semibold">
              aistudio.google.com <ExternalLink className="w-3 h-3" />
            </a>.
          </p>
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 block">Configure in <code className="text-teal-300">backend/.env</code>:</span>
            <div className="font-mono text-teal-300 text-[11px]">
              GEMINI_API_KEY=AIzaSy...<br />
              GEMINI_MODEL=gemini-2.5-flash
            </div>
          </div>
        </div>
      </div>

      {/* 3. Scientific Literature APIs (Polite Pool) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">3. Scientific APIs (OpenAlex & Crossref Polite Pool)</h3>
            <p className="text-xs text-slate-400">Free, fast API access via polite pool identification</p>
          </div>
        </div>

        <div className="text-xs text-slate-400 leading-relaxed space-y-2">
          <p>
            Both OpenAlex and Crossref provide completely free, rapid programmatic access without paywalls when an email address is passed in the request header.
          </p>
          <div className="font-mono text-[11px] text-teal-300 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            OPENALEX_EMAIL=researcher@oxazoline-hub.org<br />
            CROSSREF_EMAIL=researcher@oxazoline-hub.org
          </div>
        </div>
      </div>

      {/* 4. Automated Weekly Cloud Scheduler */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">4. Autonomous Weekly Cloud Scheduler (Section 6 & 17)</h3>
            <p className="text-xs text-slate-400">Runs weekly in the cloud even when your personal computer is switched off</p>
          </div>
        </div>

        <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
          <p>
            When deployed to <strong className="text-slate-100">Render</strong> or via <strong className="text-slate-100">GitHub Actions</strong>, configure a weekly cron job calling your backend endpoint:
          </p>
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-200 space-y-1">
            <div className="text-teal-400"># Weekly Cron Trigger (Every Sunday at 00:00 UTC)</div>
            <div>curl -X POST https://your-backend.onrender.com/api/v1/collector/trigger \</div>
            <div className="pl-4">-H "X-Cron-Secret: $CRON_SECRET" \</div>
            <div className="pl-4">-H "Content-Type: application/json" \</div>
            <div className="pl-4">-d '{`{"query": "poly(2-oxazoline) OR poly(2-oxazine)", "source": "both", "max_results": 50}`}'</div>
          </div>
        </div>
      </div>

      {/* Developer Attribution Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">5. Platform Developer & Attribution</h3>
            <p className="text-xs text-slate-400">Architectural design and scientific engineering credits</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100 text-sm">Sumit Barik</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30 font-medium">
                Lead Developer & Polymer Chemist
              </span>
            </div>
            <p className="text-xs text-slate-300">
              School of Chemical Sciences, Indian Association for the Cultivation of Science (IACS), Kolkata
            </p>
            <p className="text-[11px] text-slate-400 pt-1">
              Primary author of <em>"A Thioether-Functionalized Biomimetic Poly(2-oxazoline) Platform for Thermo-, Photo-, and Anion-Responsive Pseudopolypeptides"</em> (ACS <em>Macromolecules</em>, DOI: 10.1021/acs.macromol.6c00522).
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="text-xs font-mono text-teal-400 bg-teal-950/60 border border-teal-800 px-3 py-1.5 rounded-lg">
              v1.0.0 Production
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
