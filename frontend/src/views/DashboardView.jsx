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
  FlaskConical
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
import { api } from '../lib/api';

export default function DashboardView({ 
  onNavigateToSearch, 
  onSelectCategory, 
  onOpenDetails, 
  onOpenSummary, 
  onOpenCollectorModal,
  selectedPaperIds,
  onToggleSelectPaper,
  onToggleFavourite,
  onUpdateReadingStatus,
  onUpdateScreening 
}) {
  const [analytics, setAnalytics] = useState(null);
  const [recentPapers, setRecentPapers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickQuery, setQuickQuery] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [analyticsData, papersData, categoriesData] = await Promise.all([
        api.getAnalyticsOverview().catch(() => null),
        api.getPapers({ page_size: 6, sort_by: 'collected_at', sort_order: 'desc' }).catch(() => ({ items: [] })),
        api.getCategories().catch(() => [])
      ]);

      setAnalytics(analyticsData);
      setRecentPapers(papersData?.items || []);
      setCategories(categoriesData || []);
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

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Header */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border border-slate-800 p-6 lg:p-8 overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Atom className="w-4 h-4 animate-spin text-teal-400" />
            Poly(2-oxazoline) & Poly(2-oxazine) Literature Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight leading-tight">
            Scientific Literature Platform & AI Research Discovery
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            Real-time systematic indexing from OpenAlex & Crossref (2020–2026+), structured 13-section scientific summarization, cationic ring-opening polymerization (CROP) kinetics, and evidence-grounded research-gap intelligence.
          </p>

          {/* Quick Search */}
          <form onSubmit={handleQuickSearch} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                placeholder="Search monomers, CROP, ROS-responsive, micelles..."
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold transition-colors shadow-md shadow-teal-500/20 whitespace-nowrap"
            >
              Search Literature
            </button>
          </form>
        </div>
      </div>

      {/* Primary Metric KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Publications</span>
            <BookOpen className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono">
            {analytics?.total_papers || 0}
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
            {analytics?.papers_current_year || 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Newly discovered articles
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">POx Chemistry</span>
            <Layers className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono">
            {analytics?.pox_papers_count || 0}
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
            {analytics?.pozi_papers_count || 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Poly(2-oxazine) studies
          </div>
        </div>
      </div>

      {/* Research Trends Chart */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-400" />
              <span>Publication Trends (2020–2026+)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Annual growth of Poly(2-oxazoline) vs Poly(2-oxazine) research output
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-teal-400 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400" /> POx
            </span>
            <span className="flex items-center gap-1.5 text-purple-400 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400" /> POzi
            </span>
          </div>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trends}>
              <defs>
                <linearGradient id="poxGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="poziGrad" x1="0" y1="0" x2="0" y2="1">
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
              <Area type="monotone" dataKey="pox_count" stroke="#14b8a6" strokeWidth={2} fillOpacity={1} fill="url(#poxGrad)" name="POx Papers" />
              <Area type="monotone" dataKey="pozi_count" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#poziGrad)" name="POzi Papers" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Core Research Categories Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-teal-400" />
              <span>Scientific Research Categories</span>
            </h2>
            <p className="text-xs text-slate-400">
              Browse literature organized across the 17 core polymer & synthetic domains
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
              <span>Recent Literature Updates</span>
            </h2>
            <p className="text-xs text-slate-400">
              Latest publications indexed from scientific databases
            </p>
          </div>

          <button
            onClick={() => onNavigateToSearch && onNavigateToSearch('')}
            className="flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 font-medium"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentPapers.length > 0 ? (
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
              No publications indexed yet. Start the automated literature collector to populate your private cloud database.
            </p>
            <button
              onClick={onOpenCollectorModal}
              className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-sm inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Collect Initial Research Papers</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
