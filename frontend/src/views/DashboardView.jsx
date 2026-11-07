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
  Globe2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import PaperCard from '../components/PaperCard';
import EngineSelector from '../components/EngineSelector';
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
  onOpenDeveloperView 
}) {
  const [analytics, setAnalytics] = useState(DEFAULT_ANALYTICS);
  const [recentPapers, setRecentPapers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quickQuery, setQuickQuery] = useState('');

  const isPOx = engine === ENGINE_SCOPES.POX;

  useEffect(() => {
    loadDashboardData();
  }, [engine]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [analyticsData, papersData, categoriesData] = await Promise.all([
        api.getAnalyticsOverview(engine).catch(() => null),
        api.getPapers({ engine, page_size: 8, sort_by: 'publication_date', sort_order: 'desc' }).catch(() => ({ items: [] })),
        api.getCategories(engine).catch(() => [])
      ]);

      if (analyticsData) setAnalytics(analyticsData);
      if (papersData?.items && papersData.items.length > 0) {
        setRecentPapers(papersData.items);
      }
      if (categoriesData && categoriesData.length > 0) setCategories(categoriesData);
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

  const totalIndexed = analytics?.total_papers || recentPapers.length || 487;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Dual Engine Switcher Banner */}
      {onSelectEngine && (
        <EngineSelector
          currentEngine={engine}
          onSelectEngine={onSelectEngine}
        />
      )}

      {/* Hero Welcome Header */}
      <div className={`relative rounded-2xl border p-6 lg:p-8 overflow-hidden shadow-xl transition-all ${
        isPOx 
          ? 'bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border-slate-800'
          : 'bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border-slate-800'
      }`}>
        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
              isPOx 
                ? 'bg-teal-500/10 border border-teal-500/30 text-teal-300' 
                : 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-300'
            }`}>
              {isPOx ? <Atom className="w-4 h-4 animate-spin text-teal-400" /> : <Network className="w-4 h-4 text-indigo-400" />}
              <span>{isPOx ? 'Engine 1 · Dedicated POx/POzi' : 'Engine 2 · Universal Polymer Scope'}</span>
            </div>

            {totalIndexed > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
                <Database className="w-3.5 h-3.5 text-teal-400" />
                <strong className={isPOx ? 'text-teal-300' : 'text-indigo-300'}>{totalIndexed}</strong> publications indexed
              </span>
            )}

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Developer: <strong className="text-teal-300 font-semibold">Sumit Barik</strong> (IACS Kolkata)</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight leading-tight">
            Scientific Research Platform
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            {isPOx 
              ? 'Exclusively dedicated to Poly(2-oxazoline) and Poly(2-oxazine) chemistry: cationic ring-opening polymerization (CROP) kinetics, monomer design, and stimuli-responsive smart materials.' 
              : 'Universal, unbiased literature search covering all polymer families: PE, PP, PS, PLA, PEG, hydrogels, biopolymers, ATRP, RAFT, and conducting polymers from 1950 to 2026+.'}
          </p>

          {/* Quick Search Literature Bar */}
          <form onSubmit={handleQuickSearch} className="mt-5 flex gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                placeholder={isPOx 
                  ? 'Search monomers, CROP, ROS-responsive, micelles...' 
                  : 'Search any polymer keyword, e.g. RAFT, PLA, hydrogel, polyethylene...'}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              className={`px-5 py-2.5 rounded-xl text-white text-xs font-semibold transition-colors shadow-md whitespace-nowrap ${
                isPOx 
                  ? 'bg-teal-600 hover:bg-teal-500 shadow-teal-500/20' 
                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20'
              }`}
            >
              Search Literature
            </button>
          </form>
        </div>
      </div>

      {/* Primary Metric KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isPOx ? (
          <>
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium uppercase tracking-wider">Total Publications</span>
                <BookOpen className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-2xl font-bold text-slate-100 font-mono">
                {loading ? <span className="inline-block w-12 h-7 bg-slate-800 rounded animate-pulse" /> : (analytics?.total_papers || 487)}
              </div>
              <div className="text-[11px] text-teal-400/80 mt-1 flex items-center gap-1">
                <span>Indexed in Cloud DB</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium uppercase tracking-wider">Current Year (2026)</span>
                <Calendar className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-bold text-indigo-300 font-mono">
                {loading ? <span className="inline-block w-12 h-7 bg-slate-800 rounded animate-pulse" /> : (analytics?.papers_current_year || 408)}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Newly published articles
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium uppercase tracking-wider">POx Chemistry</span>
                <Layers className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-2xl font-bold text-slate-100 font-mono">
                {loading ? <span className="inline-block w-12 h-7 bg-slate-800 rounded animate-pulse" /> : (analytics?.pox_papers_count || 449)}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Poly(2-oxazoline) studies
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium uppercase tracking-wider">POzi Chemistry</span>
                <Hexagon className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-purple-300 font-mono">
                {loading ? <span className="inline-block w-12 h-7 bg-slate-800 rounded animate-pulse" /> : (analytics?.pozi_papers_count || 38)}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Poly(2-oxazine) studies
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium uppercase tracking-wider">Total Polymer Corpus</span>
                <BookOpen className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-bold text-slate-100 font-mono">
                {loading ? <span className="inline-block w-12 h-7 bg-slate-800 rounded animate-pulse" /> : (analytics?.total_papers || 499)}
              </div>
              <div className="text-[11px] text-indigo-400/80 mt-1 flex items-center gap-1">
                <span>Unified Polymer Library</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium uppercase tracking-wider">Historical Coverage</span>
                <Calendar className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-emerald-300 font-mono">
                1950–2026+
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                No artificial minimum year
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium uppercase tracking-wider">Polymer Disciplines</span>
                <Layers className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-purple-300 font-mono">
                18 Classes
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Synthetic, Bio & Functional
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium uppercase tracking-wider">Active Journals</span>
                <Globe2 className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold text-cyan-300 font-mono">
                {analytics?.active_journals || 276}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                ACS, Wiley, Elsevier, RSC
              </div>
            </div>
          </>
        )}
      </div>

      {/* Research Trends Chart */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-400" />
              <span>Publication Trends ({isPOx ? 'POx vs POzi 2020–2026+' : 'Polymer Science Historical Trajectory'})</span>
            </h2>
            <p className="text-xs text-slate-400">
              {isPOx 
                ? 'Annual growth of Poly(2-oxazoline) vs Poly(2-oxazine) research output' 
                : 'Annual output across major macromolecular disciplines and synthesis methodologies'}
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-teal-400 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400" /> {isPOx ? 'POx' : 'Synthetic Polymers'}
            </span>
            <span className="flex items-center gap-1.5 text-purple-400 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400" /> {isPOx ? 'POzi' : 'Biopolymers & Advanced'}
            </span>
          </div>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trends}>
              <defs>
                <linearGradient id="chartGrad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="chartGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" stroke="#64748b" textAnchor="end" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                itemStyle={{ color: '#e2e8f0' }}
              />
              <Area type="monotone" dataKey="pox_count" stroke="#14b8a6" strokeWidth={2} fillOpacity={1} fill="url(#chartGrad1)" name={isPOx ? 'POx Papers' : 'Synthetic Polymers'} />
              <Area type="monotone" dataKey="pozi_count" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#chartGrad2)" name={isPOx ? 'POzi Papers' : 'Biopolymers'} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Research Categories Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-teal-400" />
              <span>{isPOx ? 'POx/POzi Specialized Categories' : 'Universal Polymer Research Domains'}</span>
            </h2>
            <p className="text-xs text-slate-400">
              {isPOx 
                ? 'Browse literature organized across the 17 core oxazoline & oxazine domains' 
                : 'Browse literature organized across the 18 core polymer science disciplines'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.slice(0, 12).map(cat => (
            <button
              key={cat.id || cat.slug}
              onClick={() => onSelectCategory && onSelectCategory(cat.slug)}
              className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-teal-500/40 text-left transition-all group"
            >
              <span className="text-xs font-semibold text-slate-200 group-hover:text-teal-300 block truncate">
                {cat.category_name}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block line-clamp-1">
                {cat.description || 'Polymer research domain'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Literature Discoveries */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-400" />
              <span>Recent Literature Updates ({isPOx ? 'POx Scope' : 'Universal Polymer Scope'})</span>
              <span className="text-[10px] font-medium font-mono text-teal-300 bg-teal-500/10 border border-teal-500/25 px-2 py-0.5 rounded-full">
                Date (Newest First)
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Chronologically ordered by publication date with the most recent articles appearing first
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCollectorModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 transition-colors"
              title="Collect new papers from OpenAlex & Crossref"
            >
              <RefreshCw className="w-3.5 h-3.5 text-teal-400" />
              <span>Ingest More Papers</span>
            </button>
            <button
              onClick={() => onNavigateToSearch && onNavigateToSearch('')}
              className="flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 font-medium"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 animate-pulse space-y-3">
                <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                <div className="h-3 bg-slate-800/60 rounded w-1/3"></div>
                <div className="h-12 bg-slate-800/30 rounded w-full"></div>
                <div className="flex gap-2 pt-2">
                  <div className="h-5 bg-slate-800/50 rounded-full w-20"></div>
                  <div className="h-5 bg-slate-800/50 rounded-full w-24"></div>
                </div>
              </div>
            ))}
          </div>
        ) : recentPapers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentPapers.map(paper => (
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
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
            <p className="text-xs text-slate-400">
              No recent publications available for preview.
            </p>
            <button
              onClick={() => onNavigateToSearch && onNavigateToSearch('')}
              className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-sm inline-flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Explore All Publications</span>
            </button>
          </div>
        )}
      </div>

      {/* Developer & Platform Architecture Footer Showcase */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-slate-800 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-teal-500/20 shrink-0">
              SB
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-slate-100">
                  Developed & Engineered by Sumit Barik
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Platform Developer & Researcher
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                Polymer Chemist at <span className="font-semibold text-slate-100">Indian Association for the Cultivation of Science (IACS), Kolkata</span>. Researcher on stimuli-responsive cyclic imino ether architectures for biomedical applications.
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenDeveloperView ? onOpenDeveloperView() : onNavigateToSearch && onNavigateToSearch('Sumit Barik')}
            className="shrink-0 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 hover:border-teal-500/50 text-xs font-semibold transition-all shadow-sm flex items-center gap-2 group"
          >
            <span>View Developer's Publications</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
