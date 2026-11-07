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
  ChevronDown,
  Layers,
  Flame,
  FileText,
  Quote,
  HelpCircle,
  Boxes,
  Zap,
  Check
} from 'lucide-react';
import { 
  getMonitoredJournals, 
  fetchJournalLiveFeed, 
  getJournalArticles, 
  addCustomJournal,
  reclassifyAllStoredArticles
} from '../lib/journalTracker.js';
import { 
  POLYMER_FAMILIES,
  POLYMERIZATION_METHODS,
  POLYMER_APPLICATIONS,
  POLYMER_PROPERTIES,
  POLYMER_TOPICS, 
  RELEVANCE_LEVELS,
  CLASSIFICATION_CATEGORIES
} from '../lib/polymerClassifier.js';
import { 
  getPaperDoiUrl, 
  getOfficialPublisherUrl, 
  cleanDoi, 
  formatDoiDisplay 
} from '../lib/doiHelper.js';
import { api } from '../lib/api.js';
import PaperDetailModal from '../components/PaperDetailModal';
import ThreeDTiltCard from '../components/ThreeDTiltCard';

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
  const [reclassifying, setReclassifying] = useState(false);
  const [auditMessage, setAuditMessage] = useState(null);

  // Watchlist & PDF Library Sync
  const [watchlistMap, setWatchlistMap] = useState(new Set());
  const [pdfMap, setPdfMap] = useState(new Set());

  const syncWatchlistAndPdfs = async () => {
    try {
      const [wList, pList] = await Promise.all([
        api.getWatchlist(),
        api.getPdfLibrary()
      ]);
      const wSet = new Set();
      wList.forEach(w => {
        if (w.article_id) wSet.add(String(w.article_id));
        if (w.doi) wSet.add(cleanDoi(w.doi).toLowerCase());
      });
      setWatchlistMap(wSet);

      const pSet = new Set();
      pList.forEach(p => {
        if (p.article_id) pSet.add(String(p.article_id));
        if (p.doi) pSet.add(cleanDoi(p.doi).toLowerCase());
      });
      setPdfMap(pSet);
    } catch (e) {
      console.debug('Failed to sync watchlist/pdf maps:', e);
    }
  };

  useEffect(() => {
    syncWatchlistAndPdfs();
    const handleWChange = () => syncWatchlistAndPdfs();
    const handlePChange = () => syncWatchlistAndPdfs();
    window.addEventListener('prih-watchlist-updated', handleWChange);
    window.addEventListener('prih-pdf-library-updated', handlePChange);
    return () => {
      window.removeEventListener('prih-watchlist-updated', handleWChange);
      window.removeEventListener('prih-pdf-library-updated', handlePChange);
    };
  }, []);

  const handleToggleWatchlist = async (e, article) => {
    e.stopPropagation();
    const artId = String(article.id);
    const cleaned = article.doi ? cleanDoi(article.doi).toLowerCase() : '';
    const isW = watchlistMap.has(artId) || (cleaned && watchlistMap.has(cleaned));

    if (isW) {
      await api.removeFromWatchlist(artId);
      setWatchlistMap(prev => {
        const next = new Set(prev);
        next.delete(artId);
        if (cleaned) next.delete(cleaned);
        return next;
      });
    } else {
      await api.addToWatchlist(artId, { paper: article, reading_status: 'to_read' });
      setWatchlistMap(prev => {
        const next = new Set(prev);
        next.add(artId);
        if (cleaned) next.add(cleaned);
        return next;
      });
    }
  };

  // Filters for individual journal feed
  const [dateRange, setDateRange] = useState('all'); // '7d' | '30d' | '3m' | '6m' | '12m' | 'all'
  const [sortBy, setSortBy] = useState('newest_first'); // 'newest_first' | 'oldest_first' | 'citations'
  const [articleType, setArticleType] = useState('all'); // 'all' | 'research' | 'review' | 'asap'
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedFamily, setSelectedFamily] = useState('all');
  const [selectedMethod, setSelectedMethod] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState('all');
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [inJournalKeyword, setInJournalKeyword] = useState('');
  
  // Mandatory Strict Relevance Flags
  const [polymerRelatedOnly, setPolymerRelatedOnly] = useState(true); // Default ON
  const [includePossiblyRelated, setIncludePossiblyRelated] = useState(false); // Default OFF
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Accordion for "Why is this paper included?"
  const [expandedEvidence, setExpandedEvidence] = useState({});

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
    setSelectedFamily('all');
    setSelectedMethod('all');
    setSelectedApplication('all');
    setSelectedProperty('all');
    setIncludePossiblyRelated(false);
    setExpandedEvidence({});

    // Load cached or existing articles immediately
    const cached = getJournalArticles(journal.id, { 
      includePossiblyRelated: false,
      polymerFamily: 'all',
      polymerizationMethod: 'all',
      polymerApplication: 'all',
      polymerProperty: 'all',
      polymerTopic: 'all'
    });
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
      await fetchJournalLiveFeed(journal, { maxResults: 40 });
      const updated = getJournalArticles(journal.id, {
        dateRange,
        sortBy,
        articleType,
        polymerTopic: selectedTopic,
        polymerFamily: selectedFamily,
        polymerizationMethod: selectedMethod,
        polymerApplication: selectedApplication,
        polymerProperty: selectedProperty,
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
        polymerFamily: selectedFamily,
        polymerizationMethod: selectedMethod,
        polymerApplication: selectedApplication,
        polymerProperty: selectedProperty,
        keyword: inJournalKeyword,
        includePossiblyRelated
      });
      setFeedData(res);
    }
  }, [
    dateRange, 
    sortBy, 
    articleType, 
    selectedTopic, 
    selectedFamily, 
    selectedMethod, 
    selectedApplication, 
    selectedProperty, 
    inJournalKeyword, 
    includePossiblyRelated
  ]);

  const handleAddJournalSubmit = (e) => {
    e.preventDefault();
    if (!newJournalForm.canonical_title.trim()) return;

    addCustomJournal(newJournalForm);
    setNewJournalForm({ canonical_title: '', publisher: '', issn: '', impact_factor: '', is_multidisciplinary: false });
    setShowAddModal(false);
    loadJournals();
  };

  const handleReclassifyAll = () => {
    setReclassifying(true);
    try {
      const res = reclassifyAllStoredArticles();
      setAuditMessage(`Successfully reclassified and audited ${res.updatedCount} database publications with strict taxonomy.`);
      setTimeout(() => setAuditMessage(null), 5000);
      loadJournals();
      if (selectedJournal) {
        const refreshed = getJournalArticles(selectedJournal.id, {
          includePossiblyRelated
        });
        setFeedData(refreshed);
      }
    } finally {
      setReclassifying(false);
    }
  };

  const toggleEvidence = (articleId) => {
    setExpandedEvidence(prev => ({
      ...prev,
      [articleId]: !prev[articleId]
    }));
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-teal-400" />
                <span>Strict Polymer Science Feed</span>
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
              title="Query publisher feeds & Crossref in real-time with targeted polymer taxonomy"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshingFeed ? 'animate-spin' : ''}`} />
              <span>{refreshingFeed ? 'Targeted Ingestion...' : 'Refresh Live Feed'}</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Pill Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Confirmed Polymer Articles</span>
            <span className="text-xl font-bold text-slate-100 font-mono mt-0.5 block">{feedData.total}</span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <Check className="w-3 h-3" />
              <span>Mandatory polymer relevance</span>
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">ASAP / Online-First</span>
            <span className="text-xl font-bold text-teal-300 font-mono mt-0.5 block">{feedData.asapCount}</span>
            <span className="text-[10px] text-teal-400">Ahead-of-print publications</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Last 30 Days</span>
            <span className="text-xl font-bold text-indigo-300 font-mono mt-0.5 block">{feedData.recent30dCount}</span>
            <span className="text-[10px] text-indigo-400">Newly indexed polymer works</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Inclusion Integrity</span>
            <span className="text-xs font-semibold text-emerald-300 mt-1.5 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Non-Polymer Filter Active</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
              Exclusions: Catalysis, MOFs, small molecules
            </span>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3.5 shadow-md">
          {/* Top row: Keyword Search + Family + Topic */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={inJournalKeyword}
                onChange={(e) => setInJournalKeyword(e.target.value)}
                placeholder={`Search within ${selectedJournal.short_name || selectedJournal.canonical_title} (e.g. CROP, PLA, hydrogel, RAFT)...`}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>

            {/* Polymer Family Filter Dropdown */}
            <select
              value={selectedFamily}
              onChange={(e) => setSelectedFamily(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-teal-500 font-medium shrink-0 max-w-xs truncate"
            >
              <option value="all">All Polymer Families (11)</option>
              {POLYMER_FAMILIES.map(fam => (
                <option key={fam} value={fam}>{fam}</option>
              ))}
            </select>

            {/* Polymer Topic Filter */}
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

            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
                showAdvancedFilters 
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/40' 
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Taxonomy Filters</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Advanced Taxonomy Filters (Method, Application, Property) */}
          {showAdvancedFilters && (
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Polymerization Method</label>
                <select
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-teal-500"
                >
                  <option value="all">All Polymerization Methods</option>
                  {POLYMERIZATION_METHODS.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Polymer Application</label>
                <select
                  value={selectedApplication}
                  onChange={(e) => setSelectedApplication(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-teal-500"
                >
                  <option value="all">All Functional Applications</option>
                  {POLYMER_APPLICATIONS.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Properties & Characterization</label>
                <select
                  value={selectedProperty}
                  onChange={(e) => setSelectedProperty(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-teal-500"
                >
                  <option value="all">All Properties (SEC/DSC/Rheology)</option>
                  {POLYMER_PROPERTIES.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Quick Date Range Pills & Sorting */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-2 border-t border-slate-800">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-slate-400 text-[11px] mr-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-teal-400" />
                <span>Online Date:</span>
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

          {/* Mandatory Inclusion Toggle: Polymer-Related Only (Default ON) & Borderline Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold select-none">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Polymer-related only (Mandatory active)</span>
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-400 hover:text-slate-300">
                <input
                  type="checkbox"
                  checked={includePossiblyRelated}
                  onChange={(e) => setIncludePossiblyRelated(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-0"
                />
                <span>Include <em>possibly polymer-related</em> (borderline / minor experimental mentions)</span>
              </label>
            </div>

            <span className="font-mono text-teal-400/90 text-right">
              Displaying <strong>{feedData.articles.length}</strong> verified polymer studies
            </span>
          </div>
        </div>

        {/* Article Cards Feed */}
        {refreshingFeed && feedData.articles.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3 bg-slate-900/50 rounded-2xl border border-slate-800">
            <RefreshCw className="w-8 h-8 animate-spin text-teal-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-200">Executing Targeted Taxonomy Ingestion for {selectedJournal.canonical_title}...</p>
            <p className="text-xs text-slate-500">Retrieving online-first publications and strictly filtering non-polymer science.</p>
          </div>
        ) : feedData.articles.length > 0 ? (
          <div className="space-y-4">
            {feedData.articles.map(article => {
              const publisherUrl = getOfficialPublisherUrl(article);
              const displayDoi = formatDoiDisplay(article.doi);
              const articleKey = article.id || (article.doi ? `doi-${cleanDoi(article.doi)}` : Math.random().toString());
              const isEvidenceExpanded = Boolean(expandedEvidence[articleKey]);

              return (
                <div
                  key={articleKey}
                  onClick={() => onOpenDetails && onOpenDetails(article)}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850/60 transition-all space-y-3 relative group cursor-pointer"
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

                      {/* Classification Category Badge */}
                      {article.polymer_category === CLASSIFICATION_CATEGORIES.CORE_POLYMER ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Core Polymer Research</span>
                        </span>
                      ) : article.polymer_category === CLASSIFICATION_CATEGORIES.POLYMER_APPLICATION ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-teal-500/15 text-teal-300 border border-teal-500/30 flex items-center gap-1">
                          <Boxes className="w-3 h-3" />
                          <span>Polymer Application Platform</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>Possibly Polymer-Related</span>
                        </span>
                      )}

                      {/* Detected Family Badge */}
                      {article.polymer_family && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-slate-800 text-teal-300 border border-slate-700">
                          {article.polymer_family}
                        </span>
                      )}

                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        {article.article_type || 'Research Article'}
                      </span>

                      {/* PDF Available in Library Badge */}
                      {(pdfMap.has(String(article.id)) || (article.doi && pdfMap.has(cleanDoi(article.doi).toLowerCase()))) && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-950/70 border border-emerald-600/50 text-emerald-300 flex items-center gap-1 shadow-sm" title="Full-text PDF saved in personal library">
                          <FileText className="w-3 h-3 text-emerald-400" />
                          <span>PDF Stored</span>
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

                  {/* Article Title: Opens Internal Article Details */}
                  <h3 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenDetails) onOpenDetails(article);
                    }}
                    className="text-base font-bold text-slate-100 hover:text-teal-300 transition-colors leading-snug cursor-pointer"
                  >
                    {article.title}
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

                  {/* Identified Taxonomy Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {article.polymer_topic && (
                      <span className="px-2 py-0.5 rounded-md bg-teal-500/10 text-[10px] text-teal-300 border border-teal-500/20 font-medium">
                        #{article.polymer_topic}
                      </span>
                    )}
                    {article.polymerization_method && (
                      <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-[10px] text-indigo-300 border border-indigo-500/20 font-medium">
                        Method: {article.polymerization_method}
                      </span>
                    )}
                    {article.polymer_application && (
                      <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-[10px] text-purple-300 border border-purple-500/20 font-medium">
                        App: {article.polymer_application}
                      </span>
                    )}
                  </div>

                  {/* "Why is this paper included?" Accordion Toggle */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleEvidence(articleKey);
                      }}
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-teal-400 hover:text-teal-300 transition-colors cursor-pointer group/evid"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-teal-400 group-hover/evid:scale-110 transition-transform" />
                      <span>Why is this paper included in the polymer feed?</span>
                      <ChevronDown className={`w-3 h-3 transition-transform ${isEvidenceExpanded ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Expandable Evidence Card */}
                    {isEvidenceExpanded && (
                      <div 
                        onClick={(e) => e.stopPropagation()}
                        className="mt-2 p-3.5 rounded-xl bg-slate-950 border border-teal-500/30 text-xs space-y-2.5 font-sans shadow-lg animate-in fade-in duration-200"
                      >
                        <div className="flex items-center justify-between gap-2 flex-wrap text-[11px] border-b border-slate-800 pb-2">
                          <span className="font-semibold text-teal-300 flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span>Classification: <strong>{article.polymer_category === CLASSIFICATION_CATEGORIES.CORE_POLYMER ? 'Core Polymer Science Investigation' : 'Polymer Application Platform'}</strong></span>
                          </span>

                          <span className="text-slate-400 font-mono text-[10px]">
                            Confidence: <strong className="text-emerald-400 uppercase">{article.polymer_confidence || 'High'}</strong> · Evidence from: {(article.source_fields || ['Title']).join(' & ')}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Relevance Rationale</span>
                          <p className="text-slate-200 text-xs leading-relaxed">
                            {article.relevance_reason || 'Investigates macromolecular structure, synthesis, or functional polymeric platforms.'}
                          </p>
                        </div>

                        {article.evidence_phrase && (
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Verbatim Evidence Quote</span>
                            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-teal-200 font-sans italic flex items-start gap-2">
                              <Quote className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                              <span>"{article.evidence_phrase}"</span>
                            </div>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400 pt-1 border-t border-slate-800/80 font-mono">
                          <span><strong>Family:</strong> <span className="text-slate-200">{article.polymer_family}</span></span>
                          {article.polymerization_method && <span>· <strong>Method:</strong> <span className="text-slate-200">{article.polymerization_method}</span></span>}
                          {article.polymer_application && <span>· <strong>Application:</strong> <span className="text-slate-200">{article.polymer_application}</span></span>}
                          {article.polymer_property && <span>· <strong>Property:</strong> <span className="text-slate-200">{article.polymer_property}</span></span>}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions & Links Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Official Publisher Link: Opens verified external article page in new tab */}
                      {publisherUrl ? (
                        <a
                          href={publisherUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold transition-colors"
                          title="Open official publisher article page in a new browser tab"
                        >
                          <span>Open Publisher Article</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <button
                          type="button"
                          disabled
                          onClick={(e) => e.stopPropagation()}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-500 border border-slate-700/60 text-xs font-medium cursor-not-allowed"
                          title="Official publisher link is unavailable for this record"
                        >
                          <span>Publisher Link Unavailable</span>
                        </button>
                      )}

                      {/* Internal Article Details / TOC Button */}
                      {onOpenDetails && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenDetails(article);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-teal-300 border border-slate-700 text-xs font-medium transition-colors"
                          title="View complete article details and TOC"
                        >
                          Article Details / TOC
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Watchlist Toggle Button */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleWatchlist(e, article)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          watchlistMap.has(String(article.id)) || (article.doi && watchlistMap.has(cleanDoi(article.doi).toLowerCase()))
                            ? 'bg-violet-600/25 border-violet-500/60 text-violet-300 shadow-sm'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-violet-300 border-slate-700'
                        }`}
                        title={
                          watchlistMap.has(String(article.id)) || (article.doi && watchlistMap.has(cleanDoi(article.doi).toLowerCase()))
                            ? 'In Watchlist (Click to remove)'
                            : 'Add to Watchlist'
                        }
                      >
                        <Bookmark
                          className={`w-3.5 h-3.5 ${
                            watchlistMap.has(String(article.id)) || (article.doi && watchlistMap.has(cleanDoi(article.doi).toLowerCase()))
                              ? 'text-violet-400 fill-violet-400'
                              : ''
                          }`}
                        />
                      </button>

                      {onToggleFavourite && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavourite(article.id, !article.is_favourite);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400 border border-slate-700 transition-colors"
                          title="Save to Library"
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${article.is_favourite ? 'text-amber-400 fill-amber-400' : ''}`} />
                        </button>
                      )}

                      {displayDoi && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(article.doi);
                          }}
                          className="text-[11px] font-mono text-slate-400 hover:text-teal-300 transition-colors truncate max-w-[200px]"
                          title="Click to copy DOI string"
                        >
                          DOI: {displayDoi}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 space-y-3 bg-slate-900/50 rounded-2xl border border-slate-800">
            <BookOpen className="w-8 h-8 text-slate-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-200">No Polymer Publications Matched Active Filters</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Non-polymer articles are strictly excluded. Try adjusting the date range, resetting filters, or checking "Include possibly polymer-related".
            </p>
            <button
              onClick={() => handleRefreshFeed()}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Query Latest Targeted Polymer Feed</span>
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
              Journals — Strict Polymer Publication Tracker
            </h1>
          </div>
          <p className="text-xs text-slate-400 max-w-3xl">
            Autonomous journal-wise monitoring of newly published polymer-related research in leading international journals. Strictly filters out non-polymer articles (catalysis, small-molecule synthesis, inorganic materials, PCR) and highlights verified polymer research.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleReclassifyAll}
            disabled={reclassifying}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors cursor-pointer shadow-sm disabled:opacity-50"
            title="Audit and reclassify all database records using the new strict polymer taxonomy"
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${reclassifying ? 'animate-spin text-teal-400' : 'text-emerald-400'}`} />
            <span>{reclassifying ? 'Auditing Database...' : 'Re-Audit Taxonomy'}</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Journal to Tracker</span>
          </button>
        </div>
      </div>

      {auditMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{auditMessage}</span>
        </div>
      )}

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

        <div className="text-xs text-slate-400 font-mono shrink-0 flex items-center gap-2">
          <span>Tracking <strong className="text-teal-300">{journals.length}</strong> International Venues</span>
          <span className="text-emerald-400 border-l border-slate-800 pl-2">Strict Polymer Filter Active</span>
        </div>
      </div>

      {/* Journals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredJournals.map(journal => {
          return (
            <ThreeDTiltCard
              key={journal.id}
              glowColor={journal.is_multidisciplinary ? 'indigo' : 'teal'}
              onClick={() => handleOpenJournal(journal)}
              className="p-5 rounded-3xl glass-card cursor-pointer group flex flex-col justify-between shadow-lg"
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

              {/* Bottom Metadata & Status */}
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                  <span>{journal.is_multidisciplinary ? 'Targeted Polymer Filter' : 'Dedicated Polymer Venue'}</span>
                  <span>·</span>
                  <span>~{journal.article_count_30d || 15} works/mo</span>
                </div>

                <div className="flex items-center gap-1 text-teal-400 group-hover:text-teal-300 font-semibold text-xs">
                  <span>View Polymer Feed</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </ThreeDTiltCard>
          );
        })}
      </div>

      {/* Add Custom Journal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-100">Add Monitored Journal to Tracker</h3>
            <p className="text-xs text-slate-400">
              Provide canonical title and ISSN to automatically ingest and classify recent polymer science publications.
            </p>

            <form onSubmit={handleAddJournalSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Official Canonical Journal Title</label>
                <input
                  type="text"
                  required
                  value={newJournalForm.canonical_title}
                  onChange={(e) => setNewJournalForm({ ...newJournalForm, canonical_title: e.target.value })}
                  placeholder="e.g. Journal of Polymer Science"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Publisher</label>
                  <input
                    type="text"
                    value={newJournalForm.publisher}
                    onChange={(e) => setNewJournalForm({ ...newJournalForm, publisher: e.target.value })}
                    placeholder="e.g. Wiley, ACS, RSC"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Electronic ISSN</label>
                  <input
                    type="text"
                    value={newJournalForm.issn}
                    onChange={(e) => setNewJournalForm({ ...newJournalForm, issn: e.target.value })}
                    placeholder="e.g. 2642-4169"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-teal-500 font-mono"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 pt-1">
                <input
                  type="checkbox"
                  checked={newJournalForm.is_multidisciplinary}
                  onChange={(e) => setNewJournalForm({ ...newJournalForm, is_multidisciplinary: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-800 text-teal-500 focus:ring-0"
                />
                <span>Multidisciplinary / Broad Chemistry (applies targeted polymer filtering)</span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-sm transition-colors"
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
