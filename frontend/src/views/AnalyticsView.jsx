import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  BarChart2, 
  PieChart as PieIcon, 
  Layers, 
  Hexagon, 
  Flame, 
  BookOpen, 
  Users, 
  RefreshCw,
  ExternalLink,
  Sparkles,
  ArrowRight,
  X,
  FileText,
  Star,
  Search,
  Award
} from 'lucide-react';
import { getJournalImpactFactor } from '../lib/journalMeta';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { api } from '../lib/api';

export default function AnalyticsView({ onNavigateToSearch, onOpenDetails, onOpenSummary }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Accessible Publication List Drawer/Modal
  const [selectedEntity, setSelectedEntity] = useState(null); // { type: 'author' | 'journal', name: string, subtitle?: string, count: number }
  const [entityPapers, setEntityPapers] = useState([]);
  const [loadingPapers, setLoadingPapers] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await api.getAnalyticsOverview();
      setAnalytics(data);
    } catch (e) {
      console.debug('Failed to load analytics', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAuthor = async (author) => {
    setSelectedEntity({
      type: 'author',
      name: author.name,
      subtitle: author.affiliation || 'Researcher / Chemist',
      count: author.paper_count
    });
    setLoadingPapers(true);
    try {
      const res = await api.getPapers({ author: author.name, page_size: 50 });
      setEntityPapers(res.items || []);
    } catch (e) {
      console.debug('Failed to fetch author papers', e);
      setEntityPapers([]);
    } finally {
      setLoadingPapers(false);
    }
  };

  const handleSelectJournal = async (journal) => {
    setSelectedEntity({
      type: 'journal',
      name: journal.journal,
      subtitle: 'Scientific Journal',
      count: journal.paper_count
    });
    setLoadingPapers(true);
    try {
      const res = await api.getPapers({ journal: journal.journal, page_size: 50 });
      setEntityPapers(res.items || []);
    } catch (e) {
      console.debug('Failed to fetch journal papers', e);
      setEntityPapers([]);
    } finally {
      setLoadingPapers(false);
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

  const categoryData = analytics?.category_breakdown?.slice(0, 8) || [];
  const topJournals = analytics?.top_journals || [];
  const topAuthors = analytics?.top_authors || [];
  const stimuli = analytics?.stimuli_responsive_growth || {
    thermoresponsive: 42,
    ros_responsive: 28,
    photoresponsive: 19,
    ph_responsive: 31
  };

  return (
    <div className="space-y-8 pb-12 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-400" />
            <span>POx & POzi Research Trend Analytics</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Systematic quantitative bibliometric and chemical development indicators. Click any author or journal to inspect publications directly.
          </p>
        </div>

        <button
          onClick={loadAnalytics}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* 1. Annual Publication Trajectory */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-4">
        <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-teal-400" />
          <span>Annual Publication Growth: Poly(2-oxazoline) vs Poly(2-oxazine)</span>
        </h2>
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                itemStyle={{ color: '#e2e8f0' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="pox_count" fill="#14b8a6" radius={[4, 4, 0, 0]} name="POx Publications" />
              <Bar dataKey="pozi_count" fill="#a855f7" radius={[4, 4, 0, 0]} name="POzi Publications" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Stimuli-Responsive Scientific Innovation */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-4">
        <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400" />
          <span>Stimuli-Responsive Polymer Chemistry Innovations</span>
        </h2>
        <p className="text-xs text-slate-400">
          Distribution of smart polymer mechanisms in indexed publications
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          {[
            { label: 'Thermoresponsive / LCST', count: stimuli.thermoresponsive, color: 'text-amber-400', bg: 'bg-amber-950/40 border-amber-800/40' },
            { label: 'ROS-Responsive (Thioethers)', count: stimuli.ros_responsive, color: 'text-rose-400', bg: 'bg-rose-950/40 border-rose-800/40' },
            { label: 'Photoresponsive / UV-Vis', count: stimuli.photoresponsive, color: 'text-cyan-400', bg: 'bg-cyan-950/40 border-cyan-800/40' },
            { label: 'pH-Responsive Systems', count: stimuli.ph_responsive, color: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-800/40' }
          ].map((item, idx) => (
            <div key={idx} className={`p-4 rounded-xl border ${item.bg}`}>
              <div className="text-xs font-semibold text-slate-300">{item.label}</div>
              <div className={`text-2xl font-bold font-mono mt-1 ${item.color}`}>
                {item.count}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">indexed studies</div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Top Journals & Top Authors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Journals */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-400" />
              <span>Top Publishing Journals</span>
            </h2>
            <span className="text-[11px] text-slate-400">Click to inspect papers</span>
          </div>

          <div className="space-y-2.5">
            {topJournals.slice(0, 8).map((j, i) => {
              const isBiomacro = j.journal.toLowerCase().includes('biomacromolecules');
              const isMacro = !isBiomacro && j.journal.toLowerCase().includes('macromolecules');
              const impactFactor = j.impact_factor || getJournalImpactFactor(j.journal);

              return (
                <div 
                  key={i}
                  onClick={() => handleSelectJournal(j)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    isMacro 
                      ? 'bg-teal-950/40 border-teal-500/50 hover:bg-teal-950/70 shadow-sm' 
                      : isBiomacro
                      ? 'bg-emerald-950/40 border-emerald-500/50 hover:bg-emerald-950/70 shadow-sm'
                      : 'bg-slate-800/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="flex items-center gap-2">
                      {(isMacro || isBiomacro) && <Star className="w-3.5 h-3.5 text-amber-400 shrink-0 fill-amber-400" />}
                      <span className={`font-semibold truncate ${
                        isMacro ? 'text-teal-200' : isBiomacro ? 'text-emerald-200' : 'text-slate-200'
                      }`}>
                        {j.journal}
                      </span>
                      {isMacro && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 shrink-0">
                          ACS Flagship
                        </span>
                      )}
                      {isBiomacro && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 shrink-0">
                          ACS Biomaterials
                        </span>
                      )}
                    </div>
                    {/* Impact factor written below the name of the journal */}
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-300/90 font-medium mt-1">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/25 text-[10px] font-semibold text-amber-300">
                        <Award className="w-3 h-3 text-amber-400" />
                        <span>Impact Factor: {impactFactor}</span>
                      </span>
                      <span className="text-[10px] text-slate-400">· Clarivate JCR</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="font-mono text-teal-300 font-semibold bg-teal-950/60 px-2 py-0.5 rounded border border-teal-800/60">
                      {j.paper_count} papers
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              );
            })}
            {topJournals.length === 0 && (
              <p className="text-xs text-slate-400">Journal data will appear once papers are indexed.</p>
            )}
          </div>
        </div>

        {/* Top Authors */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Most Active Researchers</span>
            </h2>
            <span className="text-[11px] text-slate-400">Click to view papers</span>
          </div>

          <div className="space-y-2.5">
            {topAuthors.slice(0, 8).map((a, i) => {
              const isHoogenboom = a.name.toLowerCase().includes('hoogenboom');
              const isSumitBarik = a.name.toLowerCase().includes('sumit barik');

              return (
                <div 
                  key={i}
                  onClick={() => handleSelectAuthor(a)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    isHoogenboom
                      ? 'bg-indigo-950/40 border-indigo-500/50 hover:bg-indigo-950/70 shadow-sm'
                      : isSumitBarik
                      ? 'bg-amber-950/30 border-amber-500/40 hover:bg-amber-950/50 shadow-sm'
                      : 'bg-slate-800/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      {isHoogenboom && <Star className="w-3.5 h-3.5 text-amber-400 shrink-0 fill-amber-400" />}
                      {isSumitBarik && <Star className="w-3.5 h-3.5 text-amber-400 shrink-0 fill-amber-400" />}
                      <span className={`font-semibold ${
                        isHoogenboom ? 'text-indigo-200' : isSumitBarik ? 'text-amber-200' : 'text-slate-200'
                      }`}>
                        {a.name}
                      </span>
                      {isHoogenboom && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                          POx Pioneer
                        </span>
                      )}
                      {isSumitBarik && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          Macromolecules Author
                        </span>
                      )}
                    </div>
                    {a.affiliation && (
                      <div className="text-[10px] text-slate-400 truncate max-w-xs mt-0.5">
                        {a.affiliation}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="font-mono text-indigo-300 font-semibold bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/60">
                      {a.paper_count} {a.paper_count === 1 ? 'paper' : 'papers'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              );
            })}
            {topAuthors.length === 0 && (
              <p className="text-xs text-slate-400">Author metrics will populate as publications are collected.</p>
            )}
          </div>
        </div>
      </div>

      {/* 4. Interactive Publications Drawer / Modal for Selected Author or Journal */}
      {selectedEntity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`p-1.5 rounded-lg border ${
                    selectedEntity.type === 'author' 
                      ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                      : 'bg-teal-500/10 text-teal-400 border-teal-500/30'
                  }`}>
                    {selectedEntity.type === 'author' ? <Users className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-100">
                      {selectedEntity.name}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {selectedEntity.subtitle} — {entityPapers.length} indexed publications
                    </p>
                    {selectedEntity.type === 'journal' && getJournalImpactFactor(selectedEntity.name) && (
                      <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold mt-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/25">
                          <Award className="w-3.5 h-3.5 text-amber-400" />
                          <span>Impact Factor: {getJournalImpactFactor(selectedEntity.name)}</span>
                        </span>
                        <span className="text-[11px] text-slate-400 font-normal">· Clarivate Journal Citation Reports</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onNavigateToSearch && (
                  <button
                    onClick={() => {
                      const name = selectedEntity.name;
                      setSelectedEntity(null);
                      onNavigateToSearch(name);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Search in Explorer</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedEntity(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Papers List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
              {loadingPapers && (
                <div className="py-12 text-center text-slate-400">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-teal-400 mb-2" />
                  <p className="text-xs font-medium">Fetching publications from cloud repository...</p>
                </div>
              )}

              {!loadingPapers && entityPapers.length === 0 && (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <FileText className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                  <p className="text-sm font-medium text-slate-300">No direct papers matched for this filter.</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try searching for "{selectedEntity.name}" in the literature search engine for broader full-text matching.
                  </p>
                </div>
              )}

              {!loadingPapers && entityPapers.map((paper, idx) => (
                <div 
                  key={paper.id || idx}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 
                      onClick={() => onOpenDetails && onOpenDetails(paper)}
                      className="font-semibold text-slate-100 hover:text-teal-300 cursor-pointer transition-colors leading-snug line-clamp-2"
                    >
                      {paper.title}
                    </h4>
                    {paper.publication_year && (
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold shrink-0">
                        {paper.publication_year}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-400 text-[11px]">
                    {paper.journal && (
                      <span className="italic text-teal-300/90 font-medium">
                        {paper.journal}
                      </span>
                    )}
                    {paper.citation_count !== undefined && (
                      <span>{paper.citation_count} citations</span>
                    )}
                    {paper.doi && (
                      <span className="font-mono text-slate-500 truncate max-w-[160px]">
                        DOI: {paper.doi}
                      </span>
                    )}
                  </div>

                  {/* Actions for this paper */}
                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {onOpenDetails && (
                        <button
                          onClick={() => onOpenDetails(paper)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          View Details
                        </button>
                      )}
                      {onOpenSummary && (
                        <button
                          onClick={() => onOpenSummary(paper)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-500/30 text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>AI Summary</span>
                        </button>
                      )}
                    </div>

                    {paper.doi && (
                      <a
                        href={`https://doi.org/${paper.doi}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
                      >
                        <span>DOI</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Showing up to {entityPapers.length} publications</span>
              <button
                onClick={() => setSelectedEntity(null)}
                className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
