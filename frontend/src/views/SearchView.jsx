import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw,
  X,
  Bookmark,
  History,
  Globe2,
  Atom,
  Network,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import PaperCard from '../components/PaperCard';
import BooleanQueryBar from '../components/BooleanQueryBar';
import YearRangeSelector from '../components/YearRangeSelector';
import JournalSelector from '../components/JournalSelector';
import EngineSelector from '../components/EngineSelector';
import { api } from '../lib/api';
import { ENGINE_SCOPES } from '../lib/searchEngine';

export default function SearchView({ 
  title,
  subtitle,
  initialQuery = '', 
  initialCategory = '',
  initialIsReview = null,
  initialYearFrom = null,
  initialYearTo = null,
  initialEngine = ENGINE_SCOPES.POX,
  onOpenDetails, 
  onOpenSummary,
  selectedPaperIds = [],
  onToggleSelectPaper,
  onClearSelection,
  onOpenReviewWorkspace,
  onToggleFavourite,
  onUpdateReadingStatus,
  onUpdateScreening 
}) {
  const [engine, setEngine] = useState(initialEngine);
  const [query, setQuery] = useState(initialQuery);
  const [targetField, setTargetField] = useState('all');
  const [yearFrom, setYearFrom] = useState(initialYearFrom !== null && initialYearFrom !== undefined ? initialYearFrom : 1950);
  const [yearTo, setYearTo] = useState(initialYearTo !== null && initialYearTo !== undefined ? initialYearTo : 2026);
  const [selectedJournals, setSelectedJournals] = useState([]);
  const [excludedJournals, setExcludedJournals] = useState([]);
  const [categorySlug, setCategorySlug] = useState(initialCategory || '');
  const [isReview, setIsReview] = useState(initialIsReview);
  const [sortBy, setSortBy] = useState('publication_year');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [liveQuery, setLiveQuery] = useState(false);

  const [papers, setPapers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Saved Searches & History
  const [savedSearches, setSavedSearches] = useState([]);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [savedSearchName, setSavedSearchName] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Reload categories whenever engine switches
  useEffect(() => {
    loadCategories(engine);
    loadSavedSearches();
    loadSearchHistory();
  }, [engine]);

  // Execute search when filters or pagination change
  useEffect(() => {
    searchPapers();
  }, [page, sortBy, sortOrder, categorySlug, isReview, yearFrom, yearTo, selectedJournals, excludedJournals, engine]);

  const loadCategories = async (eng) => {
    try {
      const data = await api.getCategories(eng);
      setCategories(data || []);
    } catch (e) {
      console.debug('Failed to load categories', e);
    }
  };

  const loadSavedSearches = async () => {
    try {
      const data = await api.getSavedSearches();
      setSavedSearches(data || []);
    } catch (e) {
      console.debug('Failed to load saved searches', e);
    }
  };

  const loadSearchHistory = async () => {
    try {
      const data = await api.getSearchHistory();
      setSearchHistory(data || []);
    } catch (e) {
      console.debug('Failed to load search history', e);
    }
  };

  const searchPapers = async (overrideLive = liveQuery) => {
    setLoading(true);
    try {
      const res = await api.getPapers({
        engine,
        query: query.trim() || undefined,
        target_field: targetField,
        year_from: yearFrom,
        year_to: yearTo,
        category_slug: categorySlug || undefined,
        journal: selectedJournals.length > 0 ? selectedJournals : undefined,
        journal_exclude: excludedJournals.length > 0 ? excludedJournals : undefined,
        is_review: isReview !== null ? isReview : undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
        page,
        page_size: pageSize,
        live: overrideLive
      });

      setPapers(res.items || []);
      setTotalCount(res.total || 0);
      setTotalPages(res.total_pages || 0);

      // Record to history if query exists
      if (query.trim()) {
        api.addSearchHistory({
          query: query.trim(),
          engine,
          totalResults: res.total || 0
        });
      }
    } catch (err) {
      console.debug('Search error', err);
      setPapers([]);
      setTotalCount(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = () => {
    setPage(1);
    searchPapers();
  };

  const handleResetFilters = () => {
    setQuery('');
    setYearFrom(1950);
    setYearTo(2026);
    setSelectedJournals([]);
    setExcludedJournals([]);
    setCategorySlug('');
    setTargetField('all');
    setIsReview(null);
    setSortBy('publication_year');
    setSortOrder('desc');
    setPage(1);
    setLiveQuery(false);
  };

  const handleSaveCurrentSearch = async (e) => {
    e.preventDefault();
    if (!query && selectedJournals.length === 0 && !categorySlug) {
      alert('Please enter a query or select filters to save this search.');
      return;
    }
    const name = savedSearchName.trim() || `${engine.toUpperCase()}: ${query || 'Custom Filters'}`;
    await api.saveSearch({
      name,
      query,
      engine,
      yearFrom,
      yearTo,
      journals: selectedJournals,
      targetField
    });
    setSavedSearchName('');
    setShowSavedModal(false);
    loadSavedSearches();
  };

  const handleRestoreSavedSearch = (saved) => {
    if (saved.engine && saved.engine !== engine) {
      setEngine(saved.engine);
    }
    setQuery(saved.query || '');
    setYearFrom(saved.yearFrom || 1950);
    setYearTo(saved.yearTo || 2026);
    setSelectedJournals(saved.journals || []);
    setTargetField(saved.targetField || 'all');
    setPage(1);
    setShowSavedModal(false);
  };

  const handleRestoreHistory = (h) => {
    if (h.engine && h.engine !== engine) {
      setEngine(h.engine);
    }
    setQuery(h.query);
    setPage(1);
    setShowHistoryModal(false);
  };

  const handleExportCSV = async () => {
    const ids = selectedPaperIds.length > 0 ? selectedPaperIds : papers.map(p => p.id);
    if (ids.length === 0) return;
    setExporting(true);
    try {
      await api.exportCSV(ids);
    } catch (e) {
      alert(`CSV Export failed: ${e.message}`);
    } finally {
      setExporting(false);
    }
  };

  const handleExportBibTeX = async () => {
    const ids = selectedPaperIds.length > 0 ? selectedPaperIds : papers.map(p => p.id);
    if (ids.length === 0) return;
    setExporting(true);
    try {
      await api.exportBibTeX(ids);
    } catch (e) {
      alert(`BibTeX Export failed: ${e.message}`);
    } finally {
      setExporting(false);
    }
  };

  const isPOx = engine === ENGINE_SCOPES.POX;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Engine Switcher & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              {isPOx ? (
                <Atom className="w-5 h-5 text-teal-400" />
              ) : (
                <Network className="w-5 h-5 text-indigo-400" />
              )}
              <span>
                {isPOx ? 'POx & POzi Dedicated Literature Search' : 'Universal Polymer Science Search Engine'}
              </span>
            </h1>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
              isPOx 
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' 
                : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
            }`}>
              {isPOx ? 'Engine 1 · Dedicated POx/POzi' : 'Engine 2 · Complete Polymer Field'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            {isPOx 
              ? 'Exclusively scoped to Poly(2-oxazoline), Poly(2-oxazine), CROP kinetics, and stimuli-responsive biomaterials.' 
              : 'Unbiased scientific search covering all polymer families: PE, PP, PS, PLA, PEG, hydrogels, biopolymers, ATRP, RAFT, and conducting polymers.'}
          </p>
        </div>

        {/* Engine Switcher */}
        <div className="shrink-0 flex items-center gap-2">
          <EngineSelector
            currentEngine={engine}
            onSelectEngine={(newEngine) => {
              setEngine(newEngine);
              setCategorySlug('');
              setPage(1);
            }}
            compact={true}
          />
        </div>
      </div>

      {/* Main Search Bar & Boolean Engine */}
      <div className={`p-5 rounded-3xl border shadow-xl space-y-4 transition-all duration-300 card-glossy ${
        isPOx 
          ? 'card-glossy-teal' 
          : 'card-glossy-indigo'
      }`}>
        <BooleanQueryBar
          query={query}
          onChangeQuery={setQuery}
          onSearch={handleSearchSubmit}
          targetField={targetField}
          onChangeTargetField={setTargetField}
          engine={engine}
          loading={loading}
        />

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-3 border-t border-slate-800 text-xs">
          {/* Year Range (No 2020 limit, supports all years 1950–2026+) */}
          <div>
            <label className="text-slate-400 block font-medium mb-1">Publication Years</label>
            <YearRangeSelector
              yearFrom={yearFrom}
              yearTo={yearTo}
              onChangeYears={(f, t) => { setYearFrom(f); setYearTo(t); setPage(1); }}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onChangeSort={(sb, so) => { setSortBy(sb); setSortOrder(so); setPage(1); }}
            />
          </div>

          {/* Journal Selection (Include/Exclude/Multi) */}
          <div>
            <label className="text-slate-400 block font-medium mb-1">Scientific Journals</label>
            <JournalSelector
              selectedJournals={selectedJournals}
              excludedJournals={excludedJournals}
              onSelectJournals={(list) => { setSelectedJournals(list); setPage(1); }}
              onExcludeJournals={(list) => { setExcludedJournals(list); setPage(1); }}
              onClearJournals={() => { setSelectedJournals([]); setExcludedJournals([]); setPage(1); }}
            />
          </div>

          {/* Category Filter (POx vs Universal) */}
          <div>
            <label className="text-slate-400 block font-medium mb-1">
              {isPOx ? 'POx Research Domain' : 'Polymer Science Category'}
            </label>
            <select
              value={categorySlug}
              onChange={(e) => { setCategorySlug(e.target.value); setPage(1); }}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-slate-200 focus:outline-none focus:border-teal-500 font-medium"
            >
              <option value="">All Categories ({categories.length})</option>
              {categories.map(c => (
                <option key={c.id || c.slug} value={c.slug}>{c.category_name}</option>
              ))}
            </select>
          </div>

          {/* Article Type */}
          <div>
            <label className="text-slate-400 block font-medium mb-1">Publication Type</label>
            <select
              value={isReview === null ? '' : isReview ? 'review' : 'research'}
              onChange={(e) => {
                const val = e.target.value;
                setIsReview(val === 'review' ? true : val === 'research' ? false : null);
                setPage(1);
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-slate-200 focus:outline-none focus:border-teal-500 font-medium"
            >
              <option value="">All Articles</option>
              <option value="review">Reviews & Progress Reports</option>
              <option value="research">Primary Research Articles</option>
            </select>
          </div>

          {/* Actions: Reset & Live API Search Toggle */}
          <div className="flex items-center gap-2 pt-5">
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors font-medium text-center"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={() => {
                const nextLive = !liveQuery;
                setLiveQuery(nextLive);
                searchPapers(nextLive);
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                liveQuery
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
              title="Query OpenAlex, Crossref, and Europe PMC in real-time"
            >
              <Globe2 className={`w-3.5 h-3.5 ${liveQuery ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
              <span>{liveQuery ? 'Live APIs: ON' : 'Live APIs'}</span>
            </button>
          </div>
        </div>

        {/* Auxiliary Controls: Saved Searches, History, Reset */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowSavedModal(true)}
              className="flex items-center gap-1 hover:text-teal-300 transition-colors"
            >
              <Bookmark className="w-3.5 h-3.5 text-teal-400" />
              <span>Saved Searches ({savedSearches.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setShowHistoryModal(true)}
              className="flex items-center gap-1 hover:text-teal-300 transition-colors"
            >
              <History className="w-3.5 h-3.5 text-indigo-400" />
              <span>History ({searchHistory.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-slate-400">
              Active Scope: <strong className={isPOx ? 'text-teal-400' : 'text-indigo-400'}>{isPOx ? 'POx/POzi Dedicated' : 'Universal Polymer'}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Results Header & Batch Operations Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs shadow-md">
        <div className="text-slate-300 font-medium flex items-center gap-2">
          <span>
            Found <strong className={isPOx ? 'text-teal-400' : 'text-indigo-400'}>{totalCount}</strong> publications matching criteria
          </span>
          {selectedPaperIds.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 font-semibold">
              {selectedPaperIds.length} selected
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {selectedPaperIds.length > 0 && (
            <>
              <button
                onClick={onOpenReviewWorkspace}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors shadow-sm"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Review Workspace ({selectedPaperIds.length})</span>
              </button>
              <button
                onClick={onClearSelection}
                className="px-2 py-1.5 rounded-lg text-slate-400 hover:text-slate-200"
              >
                Clear
              </button>
            </>
          )}

          <button
            onClick={handleExportCSV}
            disabled={exporting || papers.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium transition-colors disabled:opacity-50"
            title="Export results as CSV spreadsheet"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          <button
            onClick={handleExportBibTeX}
            disabled={exporting || papers.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium transition-colors disabled:opacity-50"
            title="Export results as BibTeX bibliography"
          >
            <Download className="w-3.5 h-3.5" />
            <span>BibTeX</span>
          </button>
        </div>
      </div>

      {/* Publications Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse space-y-3">
              <div className="h-5 bg-slate-800 rounded w-3/4"></div>
              <div className="h-3 bg-slate-800/60 rounded w-1/3"></div>
              <div className="h-16 bg-slate-800/30 rounded w-full"></div>
              <div className="flex gap-2 pt-2">
                <div className="h-5 bg-slate-800/50 rounded-full w-20"></div>
                <div className="h-5 bg-slate-800/50 rounded-full w-24"></div>
              </div>
            </div>
          ))}
        </div>
      ) : papers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {papers.map(paper => (
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
        <div className="p-12 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-200">No Publications Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              No articles matched your active search query in the {isPOx ? 'POx/POzi Dedicated Engine' : 'Universal Polymer Engine'}.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setLiveQuery(true);
                searchPapers(true);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5"
            >
              <Globe2 className="w-4 h-4" />
              <span>Query Live Literature APIs</span>
            </button>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium border border-slate-700"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="font-mono text-slate-400">
            Page <strong className="text-slate-200">{page}</strong> of <strong className="text-slate-200">{totalPages}</strong>
          </span>

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 disabled:opacity-40 transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Saved Searches Modal */}
      {showSavedModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-teal-400" />
                <span>Saved Search Queries</span>
              </h3>
              <button onClick={() => setShowSavedModal(false)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>

            {/* Save Current Form */}
            <form onSubmit={handleSaveCurrentSearch} className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Save Current Query & Filters
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={savedSearchName}
                  onChange={(e) => setSavedSearchName(e.target.value)}
                  placeholder="Search name (e.g. Living CROP Kinetics)..."
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:border-teal-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold"
                >
                  Save
                </button>
              </div>
            </form>

            {/* List of Saved Searches */}
            <div className="space-y-2 pt-2 border-t border-slate-800 max-h-60 overflow-y-auto pr-1">
              {savedSearches.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">No saved searches yet.</p>
              ) : (
                savedSearches.map(s => (
                  <div
                    key={s.id}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-teal-500/40 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="min-w-0 flex-1 cursor-pointer" onClick={() => handleRestoreSavedSearch(s)}>
                      <div className="font-semibold text-slate-200 truncate flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${s.engine === 'universal' ? 'bg-indigo-400' : 'bg-teal-400'}`} />
                        <span>{s.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                        {s.query || 'All literature'} · {s.yearFrom}–{s.yearTo}
                      </div>
                    </div>
                    <button
                      onClick={async () => {
                        await api.deleteSavedSearch(s.id);
                        loadSavedSearches();
                      }}
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title="Delete saved search"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-400" />
                <span>Search Query History</span>
              </h3>
              <button onClick={() => setShowHistoryModal(false)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>

            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {searchHistory.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">No recent queries.</p>
              ) : (
                searchHistory.map(h => (
                  <button
                    key={h.id}
                    onClick={() => handleRestoreHistory(h)}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 text-xs transition-colors flex items-center justify-between"
                  >
                    <div className="min-w-0 flex-1 mr-2">
                      <div className="font-mono text-slate-200 truncate">{h.query}</div>
                      <div className="text-[10px] text-slate-500">
                        {h.engine === 'universal' ? 'Universal Engine' : 'POx Engine'} · {new Date(h.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-800 rounded text-slate-400 shrink-0">
                      {h.totalResults} results
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
