import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Search, 
  RefreshCw, 
  Layers, 
  FlaskConical,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { api } from '../lib/api';

export default function AISummariesView({ onOpenDetails, onOpenSummary }) {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingId, setGeneratingId] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'summarized', 'pending'

  useEffect(() => {
    loadPapers();
  }, []);

  const loadPapers = async () => {
    setLoading(true);
    try {
      const res = await api.getPapers({ page_size: 50, sort_by: 'collected_at', sort_order: 'desc' });
      setPapers(res?.items || []);
    } catch (e) {
      console.debug('Failed to load papers for summaries view', e);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSummary = async (paper) => {
    setGeneratingId(paper.id);
    try {
      await api.generateSummary(paper.id);
      // Reload papers to update has_summary status
      await loadPapers();
      if (onOpenSummary) {
        onOpenSummary(paper);
      }
    } catch (err) {
      alert(`Summary generation failed: ${err.message || 'Error communicating with AI engine'}`);
    } finally {
      setGeneratingId(null);
    }
  };

  const filteredPapers = papers.filter(p => {
    const matchesText = !searchFilter || 
      p.title?.toLowerCase().includes(searchFilter.toLowerCase()) || 
      p.journal?.toLowerCase().includes(searchFilter.toLowerCase());
    
    if (!matchesText) return false;
    if (filterMode === 'summarized') return p.has_summary;
    if (filterMode === 'pending') return !p.has_summary;
    return true;
  });

  const summarizedCount = papers.filter(p => p.has_summary).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl surface-gradient-lavender dark:from-slate-900 dark:via-indigo-950/40 dark:to-slate-900 border border-purple-200/80 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4 card-glossy">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              AI Scientific Synthesis Suite
            </div>
            <h1 className="text-xl sm:text-2xl font-bold heading-gradient-purple">
              13-Section Structured Scientific Summaries
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Automated AI extraction across 13 standardized research sections: chemical architecture, CROP conditions, characterization (NMR, SEC, DLS), quantitative results, scientific novelty, limitations, and relevance to POx/POzi chemistry.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-xl bg-white/95 dark:bg-slate-900/90 border border-purple-200/80 dark:border-slate-800 text-center shadow-sm">
              <div className="text-xl font-bold font-mono text-purple-600 dark:text-purple-400">{summarizedCount}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">Summaries Ready</div>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-white/95 dark:bg-slate-900/90 border border-teal-200/80 dark:border-slate-800 text-center shadow-sm">
              <div className="text-xl font-bold font-mono text-teal-600 dark:text-teal-400">{papers.length}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Indexed</div>
            </div>
          </div>
        </div>

        {/* Anti-Hallucination Policy Badge */}
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
          <span>
            <strong>Grounded Synthesis Protocol:</strong> Missing values are strictly recorded as <em>"Not reported in the accessible source"</em> with author-reported limitations cleanly separated from AI inference.
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter publications by title or journal..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2 text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              filterMode === 'all' ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Publications ({papers.length})
          </button>
          <button
            onClick={() => setFilterMode('summarized')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              filterMode === 'summarized' ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Summarized ({summarizedCount})
          </button>
          <button
            onClick={() => setFilterMode('pending')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              filterMode === 'pending' ? 'bg-slate-700 dark:bg-slate-700 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Ready to Generate ({papers.length - summarizedCount})
          </button>
        </div>
      </div>

      {/* Publications Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="p-5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 animate-pulse space-y-3">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
              <div className="h-3 bg-slate-200 dark:bg-slate-800/60 rounded w-1/3"></div>
              <div className="h-12 bg-slate-200 dark:bg-slate-800/30 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : filteredPapers.length > 0 ? (
        <div className="space-y-3">
          {filteredPapers.map(paper => (
            <div
              key={paper.id}
              className="p-5 rounded-xl bg-white/95 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 hover:border-teal-400 dark:hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm card-glossy"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
                    {paper.publication_year || 2026}
                  </span>
                  {paper.journal && (
                    <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium truncate max-w-xs">
                      {paper.journal}
                    </span>
                  )}
                  {paper.has_summary && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/30 text-purple-700 dark:text-purple-300 text-[10px] font-semibold">
                      <CheckCircle2 className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                      13-Section Summary Ready
                    </span>
                  )}
                </div>

                <h3 
                  onClick={() => onOpenDetails && onOpenDetails(paper)}
                  className="text-sm font-semibold text-slate-900 dark:text-slate-100 hover:text-teal-600 dark:hover:text-teal-300 cursor-pointer transition-colors line-clamp-2"
                >
                  {paper.title}
                </h3>

                {paper.abstract && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {paper.abstract}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {paper.has_summary ? (
                  <button
                    onClick={() => onOpenSummary && onOpenSummary(paper)}
                    className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>View 13-Section Summary</span>
                  </button>
                ) : (
                  <button
                    disabled={generatingId === paper.id}
                    onClick={() => handleGenerateSummary(paper)}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {generatingId === paper.id ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Analyzing with Gemini...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Generate AI Summary</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={() => onOpenDetails && onOpenDetails(paper)}
                  className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer shadow-sm"
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <BookOpen className="w-8 h-8 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-300">No matching publications found</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Try clearing search filters or changing the summary filter mode.</p>
        </div>
      )}
    </div>
  );
}
