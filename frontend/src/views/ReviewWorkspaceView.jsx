import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Sparkles, 
  RefreshCw, 
  ShieldAlert, 
  Check, 
  Download, 
  Table, 
  BookOpen, 
  BookMarked,
  ExternalLink,
  Layers,
  Copy,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { api } from '../lib/api';
import PaperCard from '../components/PaperCard';

export default function ReviewWorkspaceView({ 
  selectedPaperIds = [], 
  onOpenSearch,
  onOpenDetails,
  onOpenSummary,
  onToggleSelectPaper,
  onClearSelection,
  onToggleFavourite,
  onUpdateReadingStatus,
  onUpdateScreening,
  initialTab = 'published' // 'published' or 'synthesis'
}) {
  const [activeMainTab, setActiveMainTab] = useState(initialTab); // 'published' | 'synthesis'

  // Published reviews state
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewSearchQuery, setReviewSearchQuery] = useState('');
  const [selectedJournal, setSelectedJournal] = useState('');
  const [reviewSortBy, setReviewSortBy] = useState('citation_count'); // 'citation_count' | 'publication_year'
  const [totalReviews, setTotalReviews] = useState(0);

  // Synthesis workspace state
  const [topic, setTopic] = useState('Comparative CROP kinetics, architectures, and thermoresponsive properties of poly(2-oxazoline)s and poly(2-oxazine)s');
  const [title, setTitle] = useState('Synthesis, Stimuli-Responsive Architectures, and Biomedical Potential of Cyclic Imino Ether Polymers: A Critical Review');
  const [selectedPapers, setSelectedPapers] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [reviewResult, setReviewResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [copied, setCopied] = useState(false);
  const [activeOutputTab, setActiveOutputTab] = useState('markdown'); // markdown, matrix

  useEffect(() => {
    loadPublishedReviews();
  }, [reviewSortBy, selectedJournal]);

  useEffect(() => {
    if (selectedPaperIds.length > 0) {
      loadSelectedPapers();
    } else {
      setSelectedPapers([]);
    }
  }, [selectedPaperIds]);

  const loadPublishedReviews = async () => {
    setLoadingReviews(true);
    try {
      const params = {
        is_review: true,
        year_from: 2000,
        year_to: 2026,
        page_size: 60,
        sort_by: reviewSortBy,
        sort_order: 'desc'
      };
      if (reviewSearchQuery.trim()) {
        params.query = reviewSearchQuery.trim();
      }
      if (selectedJournal) {
        params.journal = selectedJournal;
      }
      const res = await api.getPapers(params);
      const items = res.items || res.papers || [];
      setReviews(items);
      setTotalReviews(res.total || res.total_count || items.length);
    } catch (err) {
      console.debug('Failed to load published reviews', err);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleReviewSearchSubmit = (e) => {
    e.preventDefault();
    loadPublishedReviews();
  };

  const loadSelectedPapers = async () => {
    try {
      const papers = await Promise.all(
        selectedPaperIds.map(id => api.getPaper(id).catch(() => null))
      );
      setSelectedPapers(papers.filter(Boolean));
    } catch (e) {
      console.debug('Failed to load selected papers for review', e);
    }
  };

  const handleGenerateReview = async (e) => {
    e.preventDefault();
    if (selectedPaperIds.length === 0) {
      setErrorMsg('Please select at least one publication to synthesize a literature review.');
      return;
    }

    setGenerating(true);
    setErrorMsg(null);
    try {
      const res = await api.generateReviewDraft({
        title,
        topic,
        paper_ids: selectedPaperIds
      });
      setReviewResult(res);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to synthesize literature review.');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyMarkdown = () => {
    if (!reviewResult?.review_markdown) return;
    navigator.clipboard.writeText(reviewResult.review_markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Tab Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/30">
              <BookMarked className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-100">
              Poly(2-oxazoline) Literature Review Suite
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Dedicated repository of published peer-reviewed reviews and AI comparative synthesis workspace.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveMainTab('published')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeMainTab === 'published'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5" />
            <span>Published Review Articles</span>
            {totalReviews > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
                {totalReviews}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveMainTab('synthesis')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeMainTab === 'synthesis'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Synthesis Workspace</span>
            {selectedPaperIds.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-500/30 text-indigo-200 font-mono">
                {selectedPaperIds.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* TAB 1: PUBLISHED REVIEWS */}
      {activeMainTab === 'published' && (
        <div className="space-y-6">
          {/* Informational Banner */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                  Authoritative Secondary Literature
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30 font-medium">
                  Peer-Reviewed Reviews Only
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Browse comprehensive reviews from high-impact journals including <span className="font-semibold text-slate-100">Progress in Polymer Science (IF: 27.1)</span>, <span className="font-semibold text-slate-100">Angewandte Chemie (IF: 16.6)</span>, <span className="font-semibold text-slate-100">Biomacromolecules (IF: 6.2)</span>, and <span className="font-semibold text-slate-100">Macromolecules (IF: 5.5)</span>.
              </p>
            </div>

            {selectedPaperIds.length > 0 && (
              <button
                onClick={() => setActiveMainTab('synthesis')}
                className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Synthesize {selectedPaperIds.length} Selected Papers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search & Filter Toolbar */}
          <form onSubmit={handleReviewSearchSubmit} className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search reviews by title, author (e.g., Hoogenboom, Luxenhofer), or concept..."
                value={reviewSearchQuery}
                onChange={(e) => setReviewSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-teal-500 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none"
              />
            </div>

            <select
              value={selectedJournal}
              onChange={(e) => setSelectedJournal(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-teal-500"
            >
              <option value="">All Publishing Journals</option>
              <option value="Biomacromolecules">Biomacromolecules (IF: 6.2)</option>
              <option value="Macromolecules">Macromolecules (IF: 5.5)</option>
              <option value="Progress in Polymer Science">Progress in Polymer Science (IF: 27.1)</option>
              <option value="Angewandte Chemie International Edition">Angewandte Chemie (IF: 16.6)</option>
              <option value="Chemical Society Reviews">Chemical Society Reviews (IF: 40.4)</option>
              <option value="European Polymer Journal">European Polymer Journal (IF: 6.0)</option>
              <option value="Polymer Chemistry">Polymer Chemistry (IF: 4.6)</option>
            </select>

            <select
              value={reviewSortBy}
              onChange={(e) => setReviewSortBy(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-teal-500"
            >
              <option value="citation_count">Sort: Most Cited</option>
              <option value="publication_year">Sort: Most Recent</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-medium"
            >
              Filter
            </button>

            {reviewSearchQuery && (
              <button
                type="button"
                onClick={() => {
                  setReviewSearchQuery('');
                  loadPublishedReviews();
                }}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Clear Search
              </button>
            )}
          </form>

          {/* Reviews List */}
          {loadingReviews ? (
            <div className="py-16 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-teal-400" />
              <span>Loading authoritative POx review articles...</span>
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-3">
              {reviews.map((paper) => (
                <PaperCard
                  key={paper.id}
                  paper={paper}
                  isSelected={selectedPaperIds.includes(paper.id)}
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
            <div className="py-16 text-center text-slate-400 text-xs bg-slate-900/50 rounded-2xl border border-slate-800">
              No review articles found matching your criteria. Try adjusting your search query or filters.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AI SYNTHESIS WORKSPACE */}
      {activeMainTab === 'synthesis' && (
        <div className="space-y-8">
          {/* Critical Scientific Verification Warning */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1.5">
            <div className="flex items-center gap-2 font-semibold">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Mandatory Verification Notice (Section 12)</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              AI-generated literature review drafts and comparative tables require verification against the original peer-reviewed papers. Never submit or cite unverified machine-generated text. Verify all chemical architectures, polymerization yields, and cloud points directly from primary sources.
            </p>
          </div>

          {/* Workspace Controls */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-200">
                  Selected Publications for Synthesis ({selectedPapers.length})
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Papers chosen from Published Reviews, Literature Search, or My Library
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveMainTab('published')}
                  className="px-3 py-1.5 rounded-lg bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-500/30 text-xs font-medium"
                >
                  + Select From Reviews
                </button>
                <button
                  onClick={onOpenSearch}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium"
                >
                  + Select From All Papers
                </button>
              </div>
            </div>

            {/* Selected Papers Pills */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {selectedPapers.map((p, idx) => (
                <div key={p.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 text-xs">
                  <div className="truncate max-w-xl">
                    <span className="font-mono text-teal-400 mr-2">[{idx + 1}]</span>
                    <span className="text-slate-200 font-medium">{p.title}</span>
                    <span className="text-slate-400 ml-2 italic">{p.journal} ({p.publication_year})</span>
                  </div>
                  {p.doi && (
                    <span className="text-[11px] font-mono text-slate-400 shrink-0 ml-2">
                      {p.doi}
                    </span>
                  )}
                </div>
              ))}
              {selectedPapers.length === 0 && (
                <div className="py-6 text-center text-xs text-slate-400">
                  No publications selected. Check papers in "Published Review Articles" or "Literature Search" to add them to this workspace.
                </div>
              )}
            </div>

            {/* Review Form */}
            <form onSubmit={handleGenerateReview} className="space-y-4 pt-4 border-t border-slate-800">
              <div>
                <label className="text-xs font-semibold text-slate-200 block mb-1.5">
                  Review Section Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 focus:border-teal-500 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-200 block mb-1.5">
                  Specific Topic / Synthetic Angle
                </label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 focus:border-teal-500 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none"
                />
              </div>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={generating || selectedPapers.length === 0}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{generating ? 'Synthesizing Literature with Gemini...' : 'Synthesize Literature Review'}</span>
              </button>
            </form>
          </div>

          {/* Synthesis Result */}
          {reviewResult && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveOutputTab('markdown')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      activeOutputTab === 'markdown'
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Structured Review Text (Markdown)
                  </button>
                  <button
                    onClick={() => setActiveOutputTab('matrix')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      activeOutputTab === 'matrix'
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Comparative Properties Matrix
                  </button>
                </div>

                <button
                  onClick={handleCopyMarkdown}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
                </button>
              </div>

              {activeOutputTab === 'markdown' && (
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-line shadow-xl">
                  {reviewResult.review_markdown}
                </div>
              )}

              {activeOutputTab === 'matrix' && (
                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="p-3">Publication</th>
                        <th className="p-3">Polymer Class</th>
                        <th className="p-3">Monomers / Initiator</th>
                        <th className="p-3">Molecular Weight & Đ</th>
                        <th className="p-3">Stimuli / Cloud Point</th>
                        <th className="p-3">Main Finding</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {reviewResult.comparison_table?.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40">
                          <td className="p-3 font-medium text-slate-200 max-w-xs">
                            <div>{row.paper_title}</div>
                            {row.doi && (
                              <div className="text-[10px] font-mono text-teal-400 mt-0.5">{row.doi}</div>
                            )}
                          </td>
                          <td className="p-3 text-slate-300">{row.polymer_type}</td>
                          <td className="p-3 text-slate-300">{row.monomers_initiators}</td>
                          <td className="p-3 text-slate-300 font-mono">{row.reported_mw_dispersity}</td>
                          <td className="p-3 text-teal-300 font-medium">{row.stimuli_response_or_cloud_point}</td>
                          <td className="p-3 text-slate-400 leading-relaxed max-w-sm">{row.main_findings}</td>
                        </tr>
                      ))}
                      {(!reviewResult.comparison_table || reviewResult.comparison_table.length === 0) && (
                        <tr>
                          <td colSpan={6} className="p-6 text-center text-slate-400">
                            No matrix items available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
