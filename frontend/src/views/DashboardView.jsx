import React, { useState, useEffect } from 'react';
import { 
  Atom, 
  Layers, 
  Hexagon, 
  Calendar, 
  TrendingUp, 
  Sparkles, 
  Search, 
  RefreshCw, 
  ArrowRight,
  BookOpen,
  FlaskConical,
  Database,
  Network,
  Globe2,
  BarChart3,
  Activity,
  Zap,
  CheckCircle2,
  Compass,
  Boxes,
  FileText,
  BookMarked,
  Bookmark
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import PaperCard from '../components/PaperCard';
import EngineSelector from '../components/EngineSelector';
import { getCategoryPlateClass } from '../lib/categoryColorMap';
import { api } from '../lib/api';
import { ENGINE_SCOPES } from '../lib/searchEngine';

const DEFAULT_ANALYTICS = {
  total_papers: 487,
  total_citations: 27990,
  papers_current_year: 408,
  recent_2026_papers: 408,
  pox_papers_count: 449,
  pozi_papers_count: 38,
  active_journals: 276,
  yearly_growth: [
    { year: 2020, papers: 6 },
    { year: 2021, papers: 14 },
    { year: 2022, papers: 10 },
    { year: 2023, papers: 8 },
    { year: 2024, papers: 9 },
    { year: 2025, papers: 6 },
    { year: 2026, papers: 408 }
  ]
};

export default function DashboardView({ 
  engine = ENGINE_SCOPES.POX,
  onSelectEngine,
  onNavigateToSearch, 
  onSelectCategory, 
  onOpenDetails, 
  onOpenSummary, 
  onOpenCollectorModal,
  selectedPaperIds,
  onToggleSelectPaper,
  onToggleFavourite,
  onUpdateReadingStatus,
  onUpdateScreening,
  onOpenDomains,
  onNavigateToView
}) {
  const [analytics, setAnalytics] = useState(DEFAULT_ANALYTICS);
  const [recentPapers, setRecentPapers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quickQuery, setQuickQuery] = useState('');
  const [chartMode, setChartMode] = useState('area'); // 'area' | 'bar'
  const [recentTab, setRecentTab] = useState('all'); // 'all' | '2026' | 'ai'
  const [pdfStats, setPdfStats] = useState({ total_pdfs: 0, total_bytes: 0 });
  const [watchStats, setWatchStats] = useState({ total: 0, to_read: 0, reading: 0, read: 0 });

  const isPOx = engine === ENGINE_SCOPES.POX;

  useEffect(() => {
    loadDashboardData();

    const handlePdfUpdate = () => {
      api.getPdfLibraryStats().then(setPdfStats).catch(() => {});
    };
    const handleWatchUpdate = () => {
      api.getWatchlistStats().then(setWatchStats).catch(() => {});
    };

    window.addEventListener('prih-pdf-library-updated', handlePdfUpdate);
    window.addEventListener('prih-watchlist-updated', handleWatchUpdate);
    return () => {
      window.removeEventListener('prih-pdf-library-updated', handlePdfUpdate);
      window.removeEventListener('prih-watchlist-updated', handleWatchUpdate);
    };
  }, [engine]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [analyticsData, papersData, categoriesData, pStats, wStats] = await Promise.all([
        api.getAnalyticsOverview(engine).catch(() => null),
        api.getPapers({ engine, page_size: 10, sort_by: 'publication_date', sort_order: 'desc' }).catch(() => ({ items: [] })),
        api.getCategories(engine).catch(() => []),
        api.getPdfLibraryStats().catch(() => ({ total_pdfs: 0, total_bytes: 0 })),
        api.getWatchlistStats().catch(() => ({ total: 0, to_read: 0, reading: 0, read: 0 }))
      ]);

      if (analyticsData) setAnalytics(analyticsData);
      if (papersData?.items && papersData.items.length > 0) {
        setRecentPapers(papersData.items);
      }
      if (categoriesData && categoriesData.length > 0) setCategories(categoriesData);
      if (pStats) setPdfStats(pStats);
      if (wStats) setWatchStats(wStats);
    } catch (e) {
      console.debug('Dashboard load error', e);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (onNavigateToSearch) {
      onNavigateToSearch(quickQuery);
    }
  };

  const handleSuggestionClick = (term) => {
    setQuickQuery(term);
    if (onNavigateToSearch) {
      onNavigateToSearch(term);
    }
  };

  const trends = analytics?.annual_trends?.length > 0 
    ? analytics.annual_trends 
    : [
        { year: 2020, pox_count: 85, pozi_count: 14, total_count: 99 },
        { year: 2021, pox_count: 110, pozi_count: 22, total_count: 132 },
        { year: 2022, pox_count: 140, pozi_count: 31, total_count: 171 },
        { year: 2023, pox_count: 175, pozi_count: 48, total_count: 223 },
        { year: 2024, pox_count: 215, pozi_count: 65, total_count: 280 },
        { year: 2025, pox_count: 260, pozi_count: 88, total_count: 348 },
        { year: 2026, pox_count: 95, pozi_count: 35, total_count: 130 }
      ];

  // Map data for 3D Isometric Bar Chart
  const barChartData = analytics?.yearly_growth?.length > 0
    ? analytics.yearly_growth.map(d => ({
        year: d.year,
        papers: Number(d.papers || d.count || 0)
      }))
    : trends.map(d => ({
        year: d.year,
        papers: Number(d.total_count || (d.pox_count + (d.pozi_count || 0)))
      }));

  const totalIndexed = analytics?.total_papers || recentPapers.length || 487;

  // Filtered recent papers based on tab
  const filteredRecentPapers = recentPapers.filter(paper => {
    if (recentTab === '2026') {
      const year = String(paper.publication_year || paper.publication_date || '');
      return year.includes('2026');
    }
    if (recentTab === 'ai') {
      return Boolean(paper.has_summary);
    }
    return true;
  });

  // Suggestion chips by engine
  const suggestionChips = isPOx ? [
    'ROS-responsive',
    'CROP kinetics',
    'PEtOx / PMeOx',
    'Biomedical micelles',
    'Thiol-ene click',
    'Block copolymers',
    'Gene delivery'
  ] : [
    'RAFT polymerization',
    'ATRP kinetics',
    'Polymeric hydrogels',
    'Polylactic acid (PLA)',
    'Conjugated polymers',
    'Polymer nanocomposites',
    'Ring-opening metathesis'
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Dual Engine Switcher Banner */}
      {onSelectEngine && (
        <EngineSelector
          currentEngine={engine}
          onSelectEngine={onSelectEngine}
        />
      )}

      {/* Hero Welcome Header & Terminal Bar */}
      <div className={`relative rounded-3xl border p-6 sm:p-8 lg:p-10 overflow-hidden shadow-2xl transition-all duration-300 card-glossy ${
        isPOx 
          ? 'surface-gradient-ice border-teal-500/35 shadow-teal-500/10 dark:shadow-teal-950/20'
          : 'surface-gradient-lavender border-indigo-500/35 shadow-indigo-500/10 dark:shadow-indigo-950/20'
      }`}>
        {/* Subtle geometric glowing backdrop orb */}
        <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-25 -mr-20 -mt-20 ${
          isPOx ? 'bg-teal-400' : 'bg-indigo-400'
        }`} />

        <div className="relative z-10 max-w-4xl">
          {/* Engine Scope Tag & Live Badge */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
              isPOx 
                ? 'bg-teal-500/15 border border-teal-500/40 text-teal-800 dark:text-teal-300 shadow-sm' 
                : 'bg-indigo-500/15 border border-indigo-500/40 text-indigo-800 dark:text-indigo-300 shadow-sm'
            }`}>
              {isPOx ? <Atom className="w-4 h-4 animate-spin text-teal-600 dark:text-teal-400" /> : <Network className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
              <span>{isPOx ? 'Engine 1 · Dedicated POx/POzi Scope' : 'Engine 2 · Universal Polymer Scope'}</span>
            </div>

            {totalIndexed > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700/80 text-xs text-slate-800 dark:text-slate-300 shadow-sm font-mono">
                <Database className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <strong className={isPOx ? 'text-teal-800 dark:text-teal-300 font-bold' : 'text-indigo-800 dark:text-indigo-300 font-bold'}>{totalIndexed}</strong> indexed articles
              </span>
            )}

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700/80 text-xs text-slate-800 dark:text-slate-300 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              <span>Developer: <strong className="text-teal-800 dark:text-teal-300 font-semibold">Sumit Barik</strong> (IACS Kolkata)</span>
            </span>
          </div>

          {/* Heading with Attractive Gradient Typography */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black heading-gradient-primary tracking-tight leading-tight">
            Scientific Research Platform
          </h1>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-2.5 max-w-2xl leading-relaxed font-sans">
            {isPOx 
              ? 'Exclusively dedicated to Poly(2-oxazoline) and Poly(2-oxazine) chemistry: cationic ring-opening polymerization (CROP) kinetics, monomer design, and stimuli-responsive smart materials.' 
              : 'Universal, unbiased literature search covering all polymer families: PE, PP, PS, PLA, PEG, hydrogels, biopolymers, ATRP, RAFT, and conducting polymers from 1950 to 2026+.'}
          </p>

          {/* Hero Quick Search Bar with Ambient Light Surface */}
          <form onSubmit={handleQuickSearch} className="mt-6 flex flex-col sm:flex-row gap-2.5 max-w-2xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
              <input
                type="text"
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                placeholder={isPOx 
                  ? 'Search monomers, CROP, ROS-responsive, micelles...' 
                  : 'Search any polymer keyword, e.g. RAFT, PLA, hydrogel, polyethylene...'}
                className="w-full bg-white/95 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700/90 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/25 transition-all shadow-sm font-mono"
              />
            </div>
            <button
              type="submit"
              className={`px-6 py-3 rounded-2xl text-white text-xs sm:text-sm font-bold transition-all shadow-lg whitespace-nowrap hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                isPOx 
                  ? 'bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 shadow-teal-500/25' 
                  : 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-500/25'
              }`}
            >
              Search Literature
            </button>
          </form>

          {/* Quick Search Suggestions Chips */}
          <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-2">
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mr-1 flex items-center gap-1">
              <Compass className="w-3 h-3 text-teal-600 dark:text-teal-400" />
              <span>Suggested:</span>
            </span>
            {suggestionChips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleSuggestionClick(chip)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-white/90 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-300 border border-slate-300 dark:border-slate-700/60 hover:border-teal-500/40 transition-all font-mono shadow-sm cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scientific Research Metrics Strip - Layered Pastel Surfaces */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div 
          onClick={() => onOpenDomains && onOpenDomains('')}
          className="p-3.5 rounded-2xl card-glossy surface-gradient-ice border border-teal-200 dark:border-slate-800 hover:border-teal-500/50 flex items-center gap-3 shadow-sm cursor-pointer transition-all group"
        >
          <div className="w-8 h-8 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Compass className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-semibold text-teal-900/70 dark:text-slate-400 uppercase tracking-wider">Research Domains</div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-200 truncate flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 dark:bg-teal-400" />
              <span>18 Polymer Disciplines</span>
            </div>
          </div>
        </div>

        <div 
          onClick={() => onNavigateToView && onNavigateToView('journals')}
          className="p-3.5 rounded-2xl card-glossy surface-gradient-lavender border border-indigo-200 dark:border-slate-800 hover:border-indigo-500/50 flex items-center gap-3 shadow-sm cursor-pointer transition-all group"
        >
          <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-semibold text-indigo-900/70 dark:text-slate-400 uppercase tracking-wider">Monitored Journals</div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-200 truncate">
              10 Core Feeds Live
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl card-glossy surface-gradient-peach border border-amber-200 dark:border-slate-800 flex items-center gap-3 shadow-sm">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-semibold text-amber-900/70 dark:text-slate-400 uppercase tracking-wider">Publication Horizon</div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-200 truncate">
              1950 – 2026+ ASAP
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl card-glossy surface-gradient-mint border border-emerald-200 dark:border-slate-800 flex items-center gap-3 shadow-sm">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-semibold text-emerald-900/70 dark:text-slate-400 uppercase tracking-wider">Curated Literature</div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-200 truncate">
              100% Peer-Reviewed
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isPOx ? (
          <>
            <div className="p-5 rounded-2xl card-glossy card-glossy-teal shimmer-hover">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300/80">Total Publications</span>
                <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-mono tracking-tight">
                {loading ? <span className="inline-block w-16 h-8 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" /> : (analytics?.total_papers || 487)}
              </div>
              <div className="text-[11px] text-teal-700 dark:text-teal-400/90 mt-1.5 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 dark:bg-teal-400" />
                <span>Indexed Literature</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl card-glossy card-glossy-indigo shimmer-hover">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-800 dark:text-indigo-300/80">Current Year (2026)</span>
                <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="text-3xl font-extrabold text-indigo-800 dark:text-indigo-300 font-mono tracking-tight">
                {loading ? <span className="inline-block w-16 h-8 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" /> : (analytics?.papers_current_year || 408)}
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1.5 font-medium">
                Newly published ASAP articles
              </div>
            </div>

            <div className="p-5 rounded-2xl card-glossy card-glossy-teal shimmer-hover">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300/80">POx Chemistry</span>
                <Layers className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-mono tracking-tight">
                {loading ? <span className="inline-block w-16 h-8 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" /> : (analytics?.pox_papers_count || 449)}
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1.5 font-medium">
                Poly(2-oxazoline) studies
              </div>
            </div>

            <div className="p-5 rounded-2xl card-glossy card-glossy-purple shimmer-hover">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-800 dark:text-purple-300/80">POzi Chemistry</span>
                <Hexagon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-3xl font-extrabold text-purple-800 dark:text-purple-300 font-mono tracking-tight">
                {loading ? <span className="inline-block w-16 h-8 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" /> : (analytics?.pozi_papers_count || 38)}
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1.5 font-medium">
                Poly(2-oxazine) studies
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="p-5 rounded-2xl card-glossy card-glossy-indigo shimmer-hover">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-800 dark:text-indigo-300/80">Total Polymer Corpus</span>
                <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-mono tracking-tight">
                {loading ? <span className="inline-block w-16 h-8 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" /> : (analytics?.total_papers || 499)}
              </div>
              <div className="text-[11px] text-indigo-700 dark:text-indigo-400/90 mt-1.5 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400" />
                <span>Unified Polymer Library</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl card-glossy card-glossy-emerald shimmer-hover">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300/80">Historical Coverage</span>
                <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-3xl font-extrabold text-emerald-800 dark:text-emerald-300 font-mono tracking-tight">
                1950–2026+
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1.5 font-medium">
                Complete archive depth
              </div>
            </div>

            <div className="p-5 rounded-2xl card-glossy card-glossy-purple shimmer-hover">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-800 dark:text-purple-300/80">Polymer Disciplines</span>
                <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-3xl font-extrabold text-purple-800 dark:text-purple-300 font-mono tracking-tight">
                18 Classes
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1.5 font-medium">
                Synthetic, Bio &amp; Functional
              </div>
            </div>

            <div className="p-5 rounded-2xl card-glossy card-glossy-cyan shimmer-hover">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-800 dark:text-cyan-300/80">Active Journals</span>
                <Globe2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="text-3xl font-extrabold text-cyan-800 dark:text-cyan-300 font-mono tracking-tight">
                {analytics?.active_journals || 276}
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1.5 font-medium">
                ACS, Wiley, Elsevier, RSC
              </div>
            </div>
          </>
        )}
      </div>

      {/* Personal Research Workspace Strip (PDF Library & Watchlist) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* PDF Library Card */}
        <div 
          onClick={() => onNavigateToView && onNavigateToView('pdf_library')}
          className="p-5 rounded-2xl card-glossy card-glossy-emerald shimmer-hover cursor-pointer group flex items-start justify-between gap-4"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-sm">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                  Personal PDF Library
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Read research PDFs in-app &amp; save full texts
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-1 text-xs text-slate-700 dark:text-slate-300">
              <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                {pdfStats.total_pdfs}
              </span>
              <span>documents stored in secure cloud vault</span>
            </div>
          </div>
          <span className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-1 transition-all shrink-0">
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>

        {/* Research Watchlist Card */}
        <div 
          onClick={() => onNavigateToView && onNavigateToView('watchlist')}
          className="p-5 rounded-2xl card-glossy card-glossy-purple shimmer-hover cursor-pointer group flex items-start justify-between gap-4"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-600 dark:text-violet-400 shadow-sm">
                <BookMarked className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                  Research Watchlist
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Track reading priority &amp; personal synthesis notes
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 pt-1 text-xs text-slate-700 dark:text-slate-300">
              <span className="font-mono text-violet-700 dark:text-violet-400 font-bold text-sm">
                {watchStats.total}
              </span>
              <span>queued</span>
              <span className="text-slate-400 dark:text-slate-600">•</span>
              <span className="text-amber-700 dark:text-amber-400 font-medium">{watchStats.to_read} to read</span>
              <span className="text-slate-400 dark:text-slate-600">•</span>
              <span className="text-cyan-700 dark:text-cyan-400 font-medium">{watchStats.reading} reading</span>
            </div>
          </div>
          <span className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 group-hover:translate-x-1 transition-all shrink-0">
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* Research Trends Chart: Smooth Area Gradient vs Annual Bar Distribution */}
      <div className="p-6 sm:p-7 rounded-3xl card-glossy surface-gradient-pearl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span className="heading-gradient-teal">Publication Growth & Trajectory ({isPOx ? 'POx vs POzi 2020–2026+' : 'Macromolecular Trajectory'})</span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              {isPOx 
                ? 'Annual growth of Poly(2-oxazoline) vs Poly(2-oxazine) research output' 
                : 'Annual output across major macromolecular disciplines and synthesis methodologies'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex items-center bg-white/90 dark:bg-slate-800/90 rounded-xl p-1 border border-slate-300 dark:border-slate-700/80 text-xs shadow-sm">
              <button
                type="button"
                onClick={() => setChartMode('area')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  chartMode === 'area'
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title="View Smooth Gradient Area Chart"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Area Trend</span>
              </button>
              <button
                type="button"
                onClick={() => setChartMode('bar')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  chartMode === 'bar'
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title="View Annual Bar Distribution"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Bar Distribution</span>
              </button>
            </div>

            {/* Legend */}
            <div className="hidden lg:flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-teal-800 dark:text-teal-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500 dark:bg-teal-400" /> {isPOx ? 'POx' : 'Synthetic Polymers'}
              </span>
              <span className="flex items-center gap-1.5 text-purple-800 dark:text-purple-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 dark:bg-purple-400" /> {isPOx ? 'POzi' : 'Biopolymers & Advanced'}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Chart Container */}
        <div className="pt-4">
          {chartMode === 'bar' ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" className="dark:opacity-20 opacity-60" />
                  <XAxis dataKey="year" stroke="#64748b" textAnchor="end" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Bar dataKey="pox_count" fill="#0d9488" radius={[4, 4, 0, 0]} name={isPOx ? 'POx Papers' : 'Synthetic Polymers'} />
                  <Bar dataKey="pozi_count" fill="#9333ea" radius={[4, 4, 0, 0]} name={isPOx ? 'POzi Papers' : 'Biopolymers'} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trends}>
                  <defs>
                    <linearGradient id="chartGrad1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="chartGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9333ea" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" className="dark:opacity-20 opacity-60" />
                  <XAxis dataKey="year" stroke="#64748b" textAnchor="end" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Area type="monotone" dataKey="pox_count" stroke="#0d9488" strokeWidth={2} fillOpacity={1} fill="url(#chartGrad1)" name={isPOx ? 'POx Papers' : 'Synthetic Polymers'} />
                  <Area type="monotone" dataKey="pozi_count" stroke="#9333ea" strokeWidth={2} fillOpacity={1} fill="url(#chartGrad2)" name={isPOx ? 'POzi Papers' : 'Biopolymers'} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Research Categories Grid with Coordinated Category Plates */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="heading-gradient-purple">{isPOx ? 'POx/POzi Specialized Categories' : 'Universal Polymer Research Domains'}</span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {isPOx 
                ? 'Browse literature organized across the 17 core oxazoline & oxazine domains' 
                : 'Browse literature organized across the 18 core polymer science disciplines'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenDomains ? onOpenDomains() : (onSelectCategory && onSelectCategory(''))}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-teal-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md hover:shadow-violet-500/20 self-start sm:self-auto transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-white" />
            <span>Explore Research Domains (18 Classes)</span>
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.slice(0, 12).map(cat => {
            const plateClass = getCategoryPlateClass(cat.category_name);
            return (
              <button
                key={cat.id || cat.slug}
                onClick={() => {
                  if (!isPOx && onOpenDomains) {
                    onOpenDomains(cat.slug);
                  } else if (onSelectCategory) {
                    onSelectCategory(cat.slug);
                  }
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all group shadow-sm hover:scale-[1.02] cursor-pointer ${plateClass}`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-current opacity-80" />
                  <span className="text-xs font-bold truncate">
                    {cat.category_name}
                  </span>
                </div>
                <span className="text-[10px] opacity-75 block line-clamp-1">
                  {cat.description || 'Polymer research domain'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Literature Discoveries with Interactive Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="heading-gradient-blue">Recent Literature Updates ({isPOx ? 'POx Scope' : 'Universal Polymer Scope'})</span>
              <span className="text-[10px] font-semibold font-mono text-teal-800 dark:text-teal-300 bg-teal-500/15 dark:bg-teal-500/10 border border-teal-500/30 px-2 py-0.5 rounded-full">
                Date (Newest First)
              </span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Chronologically ordered by publication date with the most recent articles appearing first
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Filter Tabs */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800/90 rounded-xl p-1 border border-slate-300 dark:border-slate-700/80 text-xs">
              <button
                type="button"
                onClick={() => setRecentTab('all')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  recentTab === 'all'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                All Recent
              </button>
              <button
                type="button"
                onClick={() => setRecentTab('2026')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  recentTab === '2026'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                2026 ASAP
              </button>
              <button
                type="button"
                onClick={() => setRecentTab('ai')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  recentTab === 'ai'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                AI Analyzed
              </button>
            </div>

            <button
              onClick={onOpenCollectorModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 transition-colors shadow-sm"
              title="Collect new papers from OpenAlex & Crossref"
            >
              <RefreshCw className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Ingest More Papers</span>
            </button>
            <button
              onClick={() => onNavigateToSearch && onNavigateToSearch('')}
              className="flex items-center gap-1 text-xs text-teal-700 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 font-semibold"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 animate-pulse space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-800/60 rounded w-1/3"></div>
                <div className="h-12 bg-slate-200 dark:bg-slate-800/30 rounded w-full"></div>
                <div className="flex gap-2 pt-2">
                  <div className="h-5 bg-slate-200 dark:bg-slate-800/50 rounded-full w-20"></div>
                  <div className="h-5 bg-slate-200 dark:bg-slate-800/50 rounded-full w-24"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredRecentPapers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRecentPapers.map(paper => (
              <PaperCard
                key={paper.id}
                paper={paper}
                isSelected={selectedPaperIds?.includes(paper.id)}
                onToggleSelect={onToggleSelectPaper}
                onOpenDetails={onOpenDetails}
                onOpenSummary={onOpenSummary}
                onToggleFavourite={onToggleFavourite}
                onUpdateReadingStatus={onUpdateReadingStatus}
                onUpdateScreening={onUpdateScreening}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              No publications matching the selected tab.
            </p>
            <button
              onClick={() => onNavigateToSearch && onNavigateToSearch('')}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-sm inline-flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Explore All Publications</span>
            </button>
          </div>
        )}
      </div>

      {/* Developer & Platform Architecture Footer Attribution */}
      <div className="rounded-3xl card-glossy border-amber-500/25 p-6 sm:p-7 shadow-xl bg-gradient-to-r from-amber-50/80 via-white to-amber-50/40 dark:from-slate-900/95 dark:via-slate-900/90 dark:to-amber-950/30">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-amber-500/30 shrink-0 border border-amber-400/40">
            SB
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-amber-950 dark:text-amber-100">
                Developed &amp; Engineered by Sumit Barik
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-500/30">
                Platform Developer &amp; Researcher
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">
              Polymer Chemist at <span className="font-semibold text-slate-900 dark:text-slate-100">Indian Association for the Cultivation of Science (IACS), Kolkata</span>. Researcher on stimuli-responsive cyclic imino ether architectures for biomedical applications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
