import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  ExternalLink, 
  RefreshCw, 
  Filter, 
  Calendar, 
  Search, 
  Plus, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Bookmark, 
  SlidersHorizontal, 
  AlertCircle,
  ShieldCheck,
  TrendingUp,
  Tag,
  ChevronRight,
  Layers,
  Flame,
  FileText
} from 'lucide-react';
import { 
  getMonitoredJournals, 
  fetchJournalLiveFeed, 
  getJournalArticles, 
  addCustomJournal 
} from '../lib/journalTracker.js';
import { POLYMER_TOPICS, RELEVANCE_LEVELS } from '../lib/polymerClassifier.js';
import { getPaperDoiUrl } from '../lib/doiHelper.js';
import PaperDetailModal from '../components/PaperDetailModal';

export default function JournalsTrackerView({ 
  onOpenDetails, 
  onOpenSummary,
  onToggleFavourite,
  initialJournalId = null 
}) {
  const [journals, setJournals] = useState([]);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [feedData, setFeedData] = useState({ articles: [], total: 0, asapCount: 0, recent30dCount: 0 });
  const [loading, setLoading] = useState(false);
  const [refreshingFeed, setRefreshingFeed] = useState(false);

  // Filters for individual journal feed
  const [dateRange, setDateRange] = useState('all'); // '7d' | '30d' | '3m' | '6m' | '12m' | 'all'
  const [sortBy, setSortBy] = useState('newest_first'); // 'newest_first' | 'oldest_first' | 'citations'
  const [articleType, setArticleType] = useState('all'); // 'all' | 'research' | 'review' | 'asap'
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [inJournalKeyword, setInJournalKeyword] = useState('');
  const [includePossiblyRelated, setIncludePossiblyRelated] = useState(false);

  // Directory Search & Add Journal Modal
  const [dirSearch, setDirSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newJournalForm, setNewJournalForm] = useState({
    canonical_title: '',
    publisher: '',
    issn: '',
    impact_factor: '',
    is_multidisciplinary: false
  });

  useEffect(() => {
    loadJournals();
  }, []);

  const loadJournals = () => {
    const list = getMonitoredJournals();
    setJournals(list);

    if (initialJournalId) {
      const match = list.find(j => j.id === initialJournalId || j.canonical_title.toLowerCase().includes(initialJournalId.toLowerCase()));
      if (match) {
        handleOpenJournal(match);
      }
    }
  };

  const handleOpenJournal = async (journal) => {
    setSelectedJournal(journal);
    setLoading(true);
    setInJournalKeyword('');
    setDateRange('all');
    setArticleType('all');
    setSelectedTopic('all');

    // Load cached or existing articles immediately
    const cached = getJournalArticles(journal.id, { includePossiblyRelated: false });
    setFeedData(cached);
    setLoading(false);

    // If feed is empty, trigger initial live fetch automatically
    if (cached.articles.length === 0) {
      await handleRefreshFeed(journal);
    }
  };

  const handleRefreshFeed = async (journal = selectedJournal) => {
    if (!journal) return;
    setRefreshingFeed(true);
    try {
      await fetchJournalLiveFeed(journal, { maxResults: 35 });
      const updated = getJournalArticles(journal.id, {
        dateRange,
        sortBy,
        articleType,
        polymerTopic: selectedTopic,
        keyword: inJournalKeyword,
        includePossiblyRelated
      });
      setFeedData(updated);
      loadJournals(); // update metrics in directory
    } catch (e) {
      console.debug('Failed to refresh journal feed', e);
    } finally {
      setRefreshingFeed(false);
    }
  };

  // Re-filter feed whenever controls change
  useEffect(() => {
    if (selectedJournal) {
      const res = getJournalArticles(selectedJournal.id, {
        dateRange,
        sortBy,
        articleType,
        polymerTopic: selectedTopic,
        keyword: inJournalKeyword,
        includePossiblyRelated
      });
      setFeedData(res);
    }
  }, [dateRange, sortBy, articleType, selectedTopic, inJournalKeyword, includePossiblyRelated]);

  const handleAddJournalSubmit = (e) => {
    e.preventDefault();
    if (!newJournalForm.canonical_title.trim()) return;

    addCustomJournal(newJournalForm);
    setNewJournalForm({ canonical_title: '', publisher: '', issn: '', impact_factor: '', is_multidisciplinary: false });
    setShowAddModal(false);
    loadJournals();
  };

  const filteredJournals = journals.filter(j => {
    const q = dirSearch.toLowerCase().trim();
    if (!q) return true;
    return j.canonical_title.toLowerCase().includes(q) ||
           j.publisher.toLowerCase().includes(q) ||
           (j.issn_electronic && j.issn_electronic.includes(q)) ||
           (j.issn_print && j.issn_print.includes(q));
  });

  // ==========================================================================
  // VIEW 1: INDIVIDUAL JOURNAL PUBLICATION FEED
  // ==========================================================================
  if (selectedJournal) {
    return (
      <div className="space-y-6 pb-12">
        {/* Navigation Breadcrumb & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <button
              onClick={() => setSelectedJournal(null)}
              className="inline-flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 font-semibold mb-1 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Monitored Journals Directory</span>
            </button>

            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-bold text-slate-100">
                {selectedJournal.canonical_title}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Recent Polymer Publications
              </span>
            </div>

            <p className="text-xs text-slate-400">
              {selectedJournal.publisher} · {selectedJournal.tier} · ISSN: {selectedJournal.issn_electronic || selectedJournal.issn_print || 'N/A'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleRefreshFeed()}
              disabled={refreshingFeed}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer disabled:opacity-50"
              title="Query publisher feeds & Crossref in real-time"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshingFeed ? 'animate-spin' : ''}`} />
              <span>{refreshingFeed ? 'Checking Feeds...' : 'Refresh Live Feed'}</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Pill Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Polymer Articles</span>
            <span className="text-xl font-bold text-slate-100 font-mono mt-0.5 block">{feedData.total}</span>
            <span className="text-[10px] text-emerald-400">Filtered for polymer science</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">ASAP / Online-First</span>
            <span className="text-xl font-bold text-teal-300 font-mono mt-0.5 block">{feedData.asapCount}</span>
            <span className="text-[10px] text-teal-400">Ahead-of-print articles</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Last 30 Days</span>
            <span className="text-xl font-bold text-indigo-300 font-mono mt-0.5 block">{feedData.recent30dCount}</span>
            <span className="text-[10px] text-indigo-400">Newly indexed publications</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Feed Integrity</span>
            <span className="text-xs font-semibold text-emerald-300 mt-1.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Crossref & OpenAlex Live</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
              Updated: {new Date(selectedJournal.last_updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3.5 shadow-md">
          {/* Top row: Keyword Search + Topic Filter */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={inJournalKeyword}
                onChange={(e) => setInJournalKeyword(e.target.value)}
                placeholder={`Search within ${selectedJournal.short_name || selectedJournal.canonical_title} (e.g. CROP, hydrogel, PLA)...`}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>

            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-teal-500 font-medium shrink-0"
            >
              <option value="all">All Polymer Topics</option>
              {POLYMER_TOPICS.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>

          {/* Quick Date Range Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-2 border-t border-slate-800">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-slate-400 text-[11px] mr-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-teal-400" />
                <span>Date:</span>
              </span>
              {[
                { id: '7d', label: 'Last 7 Days' },
                { id: '30d', label: 'Last 30 Days' },
                { id: '3m', label: 'Last 3 Months' },
                { id: '6m', label: 'Last 6 Months' },
                { id: '12m', label: 'Last 12 Months' },
                { id: 'all', label: 'All Available' }
              ].map(d => (
                <button
                  key={d.id}
                  onClick={() => setDateRange(d.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    dateRange === d.id
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* Article Type Selector & Sort Order */}
            <div className="flex items-center gap-2">
              <select
                value={articleType}
                onChange={(e) => setArticleType(e.target.value)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-teal-500"
              >
                <option value="all">All Article Types</option>
                <option value="asap">ASAP / Online-First Only</option>
                <option value="research">Research Articles</option>
                <option value="review">Reviews Only</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 focus:outline-none focus:border-teal-500"
              >
                <option value="newest_first">Newest Online ↓</option>
                <option value="oldest_first">Oldest Online ↑</option>
                <option value="citations">Most Cited</option>
              </select>
            </div>
          </div>

          {/* Transparent Polymer Relevance Toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includePossiblyRelated}
                onChange={(e) => setIncludePossiblyRelated(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-teal-500 focus:ring-0"
              />
              <span>Include <em>possibly polymer-related</em> articles (exploratory / minor polymer applications)</span>
            </label>

            <span className="font-mono text-teal-400/90">
              Showing <strong>{feedData.articles.length}</strong> classified polymer studies
            </span>
          </div>
        </div>

        {/* Article Cards Feed */}
        {refreshingFeed && feedData.articles.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3 bg-slate-900/50 rounded-2xl border border-slate-800">
            <RefreshCw className="w-8 h-8 animate-spin text-teal-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-200">Retrieving Live Articles from {selectedJournal.canonical_title}...</p>
            <p className="text-xs text-slate-500">Checking ASAP publications and classifying polymer science relevance.</p>
          </div>
        ) : feedData.articles.length > 0 ? (
          <div className="space-y-4">
            {feedData.articles.map(article => {
              const doiUrl = getPaperDoiUrl(article.doi);
              return (
                <div
                  key={article.id || article.doi}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3 relative group"
                >
                  {/* Top Badge Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {article.is_asap && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>ASAP / Online-First</span>
                        </span>
                      )}

                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        {article.article_type || 'Research Article'}
                      </span>

                      {article.polymer_relevance === RELEVANCE_LEVELS.POLYMER_RELATED ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-teal-500/10 text-teal-300 border border-teal-500/30">
                          Polymer-Related
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30">
                          Possibly Polymer-Related
                        </span>
                      )}
                    </div>

                    {/* Date indicators */}
                    <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                      <span title="Earliest reliable online publication date">
                        Online: <strong className="text-slate-200">{article.online_publication_date || article.publication_date}</strong>
                      </span>
                      {article.print_publication_date && (
                        <span className="text-slate-500 hidden sm:inline">
                          · Print: {article.print_publication_date}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Article Title */}
                  <h3 className="text-base font-bold text-slate-100 hover:text-teal-300 transition-colors leading-snug">
                    <a href={doiUrl} target="_blank" rel="noopener noreferrer">
                      {article.title}
                    </a>
                  </h3>

                  {/* Authors List */}
                  <div className="text-xs text-slate-400 line-clamp-1">
                    {(article.authors || []).map(a => a.name || a.author).join(', ') || 'Research Author Consortium'}
                  </div>

                  {/* Abstract Preview */}
                  {article.abstract && (
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 font-sans line-clamp-3">
                      {article.abstract}
                    </p>
                  )}

                  {/* Identified Polymer Topic Badges */}
                  {article.polymer_topics && article.polymer_topics.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {article.polymer_topics.map(t => (
                        <span key={t} className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-teal-300 border border-slate-700/80">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions & Links Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
                    <div className="flex items-center gap-2">
                      {article.doi && (
                        <a
                          href={doiUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold transition-colors"
                        >
                          <span>Open Publisher Article</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}

                      {onOpenDetails && (
                        <button
                          onClick={() => onOpenDetails(article)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-colors"
                        >
                          TOC / Graphical Abstract
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {onToggleFavourite && (
                        <button
                          onClick={() => onToggleFavourite(article.id, !article.is_favourite)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400 border border-slate-700 transition-colors"
                          title="Save to Library"
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${article.is_favourite ? 'text-amber-400 fill-amber-400' : ''}`} />
                        </button>
                      )}

                      <span className="text-[11px] font-mono text-slate-400 truncate max-w-[200px]">
                        DOI: {article.doi || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 space-y-3 bg-slate-900/50 rounded-2xl border border-slate-800">
            <BookOpen className="w-8 h-8 text-slate-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-200">No Publications Matched Active Filters</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Try adjusting the date range, clearing the keyword search, or checking "Include possibly polymer-related articles".
            </p>
            <button
              onClick={() => handleRefreshFeed()}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold shadow-sm inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Query Latest Live Crossref Feed</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // ==========================================================================
  // VIEW 2: MONITORED JOURNALS DIRECTORY (LANDING PAGE)
  // ==========================================================================
  return (
    <div className="space-y-8 pb-12">
      {/* Directory Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30">
              <BookOpen className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-100">
              Journals — Recent Polymer Publication Tracker
            </h1>
          </div>
          <p className="text-xs text-slate-400 max-w-3xl">
            Autonomous journal-wise monitoring of newly published polymer-related research in leading international journals. Prioritizes ASAP and online-first articles with verified polymer relevance classification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 hover:border-teal-500/40 text-xs font-semibold transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Journal to Tracker</span>
          </button>
        </div>
      </div>

      {/* Directory Search & Summary Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={dirSearch}
            onChange={(e) => setDirSearch(e.target.value)}
            placeholder="Search journal directory by title, publisher (e.g. ACS, Wiley, RSC), or ISSN..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-500 font-sans"
          />
        </div>

        <div className="text-xs text-slate-400 font-mono shrink-0">
          Tracking <strong className="text-teal-300">{journals.length}</strong> International Polymer Venues
        </div>
      </div>

      {/* Journals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredJournals.map(journal => {
          return (
            <div
              key={journal.id}
              onClick={() => handleOpenJournal(journal)}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/40 hover:bg-slate-850/80 transition-all cursor-pointer group flex flex-col justify-between shadow-md"
            >
              <div className="space-y-2.5">
                {/* Top Badges */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                    {journal.publisher}
                  </span>

                  <span className="px-2 py-0.5 rounded-md bg-teal-500/10 border border-teal-500/30 text-teal-300 font-mono text-[11px] font-bold">
                    IF {journal.impact_factor}
                  </span>
                </div>

                {/* Canonical Title */}
                <div>
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-teal-300 transition-colors">
                    {journal.canonical_title}
                  </h3>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {journal.abbr} · {journal.tier}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {journal.description}
                </p>
              </div>

              {/* Bottom Metrics Bar */}
              <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="text-[11px] text-slate-400">
                    Latest Polymer Publication: <strong className="text-slate-200 font-mono">{journal.latest_publication_date || 'Recent'}</strong>
                  </div>
                  <div className="text-[10px] text-teal-400/90 font-medium">
                    ~{journal.article_count_30d} new polymer articles in last 30 days
                  </div>
                </div>

                <div className="flex items-center gap-1 text-teal-400 font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Open Feed</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Journal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-teal-400" />
                <span>Add Journal to Polymer Publication Tracker</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>

            <form onSubmit={handleAddJournalSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Official Canonical Journal Title *</label>
                <input
                  type="text"
                  required
                  value={newJournalForm.canonical_title}
                  onChange={(e) => setNewJournalForm({ ...newJournalForm, canonical_title: e.target.value })}
                  placeholder="e.g. Advanced Functional Materials"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-teal-500 font-medium"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Publisher</label>
                <input
                  type="text"
                  value={newJournalForm.publisher}
                  onChange={(e) => setNewJournalForm({ ...newJournalForm, publisher: e.target.value })}
                  placeholder="e.g. Wiley-VCH, Springer Nature, Elsevier"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">ISSN / eISSN *</label>
                  <input
                    type="text"
                    required
                    value={newJournalForm.issn}
                    onChange={(e) => setNewJournalForm({ ...newJournalForm, issn: e.target.value })}
                    placeholder="e.g. 1616-3028"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-teal-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Impact Factor</label>
                  <input
                    type="text"
                    value={newJournalForm.impact_factor}
                    onChange={(e) => setNewJournalForm({ ...newJournalForm, impact_factor: e.target.value })}
                    placeholder="e.g. 19.0"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-teal-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={newJournalForm.is_multidisciplinary}
                    onChange={(e) => setNewJournalForm({ ...newJournalForm, is_multidisciplinary: e.target.checked })}
                    className="rounded border-slate-700 bg-slate-800 text-teal-500"
                  />
                  <span className="text-slate-300">Multidisciplinary journal (apply strict polymer classification)</span>
                </label>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-semibold shadow-md"
                >
                  Add Journal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
