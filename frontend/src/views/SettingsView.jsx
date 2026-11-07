import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Moon, 
  Sun, 
  Sliders, 
  FileText, 
  Bookmark, 
  Layers, 
  CheckCircle2, 
  Download, 
  Trash2, 
  RefreshCw,
  BookOpen,
  Atom,
  Network,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { api } from '../lib/api';
import { clearPdfBlobCache, getPdfCacheStats } from '../lib/pdfStorage';
import { ENGINE_SCOPES } from '../lib/searchEngine';

export default function SettingsView({ health, onRefreshHealth }) {
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem('prih_theme_mode') || 'dark');
  const [defaultEngine, setDefaultEngine] = useState(() => localStorage.getItem('prih_default_engine') || ENGINE_SCOPES.POX);
  const [defaultSort, setDefaultSort] = useState(() => localStorage.getItem('prih_default_sort') || 'date_desc');
  const [resultsPerPage, setResultsPerPage] = useState(() => localStorage.getItem('prih_results_per_page') || '20');
  const [cacheStats, setCacheStats] = useState({ count: 0, sizeMb: '0.00' });
  const [cacheCleared, setCacheCleared] = useState(false);
  const [exportNotice, setExportNotice] = useState(null);

  useEffect(() => {
    loadCacheStats();
  }, []);

  const loadCacheStats = async () => {
    try {
      const stats = await getPdfCacheStats();
      setCacheStats(stats);
    } catch {
      setCacheStats({ count: 0, sizeMb: '0.00' });
    }
  };

  const handleThemeChange = (mode) => {
    setThemeMode(mode);
    localStorage.setItem('prih_theme_mode', mode);
    if (mode === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  };

  const handleEngineChange = (engine) => {
    setDefaultEngine(engine);
    localStorage.setItem('prih_default_engine', engine);
  };

  const handleSortChange = (sort) => {
    setDefaultSort(sort);
    localStorage.setItem('prih_default_sort', sort);
  };

  const handleResultsPerPageChange = (count) => {
    setResultsPerPage(count);
    localStorage.setItem('prih_results_per_page', count);
  };

  const handleClearCache = async () => {
    try {
      await clearPdfBlobCache();
      setCacheCleared(true);
      await loadCacheStats();
      setTimeout(() => setCacheCleared(false), 3000);
    } catch (e) {
      console.debug('Failed to clear cache:', e);
    }
  };

  const handleExportWatchlist = async () => {
    try {
      const watchlist = await api.getWatchlist();
      const blob = new Blob([JSON.stringify(watchlist, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prih_watchlist_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setExportNotice('Watchlist successfully exported!');
      setTimeout(() => setExportNotice(null), 3000);
    } catch (e) {
      setExportNotice('Export failed: ' + e.message);
      setTimeout(() => setExportNotice(null), 3000);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800/80 p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <span className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-sm">
            <Settings className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              Platform Settings &amp; Research Preferences
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize research views, search behavior, reading defaults, and workspace storage.
            </p>
          </div>
        </div>
      </div>

      {/* 1. Interface & Visual System */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-md space-y-5">
        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
          <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100">Interface &amp; Display Preferences</h2>
            <p className="text-xs text-slate-400">Configure appearance and default research environment</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
          {/* Theme Mode */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Color Theme Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleThemeChange('dark')}
                className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                  themeMode === 'dark'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark Theme (Default)</span>
              </button>

              <button
                type="button"
                onClick={() => handleThemeChange('light')}
                className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                  themeMode === 'light'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light Theme</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              High-contrast dark mode is optimized for long literature reading sessions.
            </p>
          </div>

          {/* Default Engine */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Default Literature Scope
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleEngineChange(ENGINE_SCOPES.POX)}
                className={`px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                  defaultEngine === ENGINE_SCOPES.POX
                    ? 'bg-teal-600 text-white border-teal-500 shadow-md shadow-teal-600/20'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <Atom className="w-3.5 h-3.5" />
                <span>POx/POzi Dedicated</span>
              </button>

              <button
                type="button"
                onClick={() => handleEngineChange(ENGINE_SCOPES.UNIVERSAL)}
                className={`px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                  defaultEngine === ENGINE_SCOPES.UNIVERSAL
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <Network className="w-3.5 h-3.5" />
                <span>Universal Polymer</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Selected engine is active upon opening search and dashboard query bars.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Literature Search & Filtering Defaults */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-md space-y-5">
        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100">Literature Search &amp; Feed Defaults</h2>
            <p className="text-xs text-slate-400">Default query ordering, pagination size, and journal classification</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
          {/* Default Sorting */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Default Results Order
            </label>
            <select
              value={defaultSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500 transition-colors"
            >
              <option value="date_desc">Publication Date (Newest First · ASAP to 1950)</option>
              <option value="relevance">Algorithmic Keyword Relevance</option>
              <option value="citations">Citation Count (Most Cited Landmark Works)</option>
              <option value="date_asc">Historical Order (Oldest First)</option>
            </select>
          </div>

          {/* Results Per Page */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Articles Per Page
            </label>
            <select
              value={resultsPerPage}
              onChange={(e) => handleResultsPerPageChange(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500 transition-colors"
            >
              <option value="10">10 Publications per page</option>
              <option value="20">20 Publications per page (Recommended)</option>
              <option value="50">50 Publications per page (Dense)</option>
            </select>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-slate-100">Strict Polymer Classification:</strong> Active across all 10 monitored journal feeds (JACS, Macromolecules, Biomacromolecules, Polymer Chemistry, etc.). Articles without genuine polymer chemistry contributions are automatically filtered from the primary publication feeds.
          </div>
        </div>
      </div>

      {/* 3. Personal PDF Library & Watchlist Storage */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-md space-y-5">
        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100">Local Cache &amp; Personal Workspace Storage</h2>
            <p className="text-xs text-slate-400">Manage offline PDF document caching, metadata backup, and reading lists</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* PDF Cache */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">Local PDF Offline Cache</span>
              <span className="text-[11px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
                {cacheStats.count} cached ({cacheStats.sizeMb} MB)
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Cached full texts allow fast offline viewing in the built-in reader modal without re-downloading from the cloud vault.
            </p>
            <button
              type="button"
              onClick={handleClearCache}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors border border-slate-700 flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Clear Local PDF Cache</span>
            </button>
            {cacheCleared && (
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Cache emptied successfully
              </span>
            )}
          </div>

          {/* Watchlist Backup */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">Watchlist &amp; Notes Export</span>
              <span className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                JSON Backup
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Export your bookmarked research papers, reading progress tags, and personal research annotations.
            </p>
            <button
              type="button"
              onClick={handleExportWatchlist}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Watchlist Data</span>
            </button>
            {exportNotice && (
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {exportNotice}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 4. Platform Scope & Version Overview */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100">Platform Scope &amp; Taxonomy</h2>
            <p className="text-xs text-slate-400">Polymer Research Intelligence Hub (PRIH)</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-lg font-bold font-mono text-teal-400">18</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">Research Domains</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-lg font-bold font-mono text-indigo-400">10</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">Core Journals</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-lg font-bold font-mono text-purple-400">1950–2026+</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">Historical Range</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-lg font-bold font-mono text-emerald-400">v2.0</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">Production Hub</div>
          </div>
        </div>
      </div>

      {/* 5. Developer & Platform Architecture Footer Attribution */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-slate-800/80 p-6 sm:p-7 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-teal-500/20 shrink-0">
            SB
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-slate-100">
                Developed &amp; Engineered by Sumit Barik
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Platform Developer &amp; Researcher
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              Polymer Chemist at <span className="font-semibold text-slate-100">Indian Association for the Cultivation of Science (IACS), Kolkata</span>. Researcher on stimuli-responsive cyclic imino ether architectures for biomedical applications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
