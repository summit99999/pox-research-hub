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
  SlidersHorizontal
} from 'lucide-react';
import PaperCard from '../components/PaperCard';
import { api } from '../lib/api';

export default function SearchView({ 
  initialQuery = '', 
  initialCategory = '',
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
  const [query, setQuery] = useState(initialQuery);
  const [yearFrom, setYearFrom] = useState(2020);
  const [yearTo, setYearTo] = useState(2026);
  const [categorySlug, setCategorySlug] = useState(initialCategory || '');
  const [journal, setJournal] = useState('');
  const [sortBy, setSortBy] = useState('publication_year');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [papers, setPapers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    searchPapers();
  }, [page, sortBy, sortOrder, categorySlug]);

  const loadCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data || []);
    } catch (e) {
      console.debug('Failed to load categories', e);
    }
  };

  const searchPapers = async () => {
    setLoading(true);
    try {
      const res = await api.getPapers({
        query: query.trim() || undefined,
        year_from: parseInt(yearFrom) || 2020,
        year_to: parseInt(yearTo) || 2026,
        category_slug: categorySlug || undefined,
        journal: journal.trim() || undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
        page,
        page_size: pageSize
      });

      setPapers(res.items || []);
      setTotalCount(res.total || 0);
      setTotalPages(res.total_pages || 0);
    } catch (err) {
      console.debug('Search error', err);
      setPapers([]);
      setTotalCount(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    searchPapers();
  };

  const handleResetFilters = () => {
    setQuery('');
    setYearFrom(2020);
    setYearTo(2026);
    setCategorySlug('');
    setJournal('');
    setSortBy('publication_year');
    setSortOrder('desc');
    setPage(1);
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

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Search className="w-5 h-5 text-teal-400" />
          <span>Advanced Literature Search Engine</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Query across titles, abstracts, DOIs, authors, CROP kinetics, monomers, and stimuli-responsive mechanisms.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearchSubmit} className="space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search keywords (e.g. poly(2-oxazoline) AND ROS responsive, thioether, CROP, UCST)..."
            className="w-full bg-slate-900 border border-slate-700 focus:border-teal-500 rounded-xl pl-11 pr-28 py-3 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 shadow-lg transition-colors"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors"
          >
            Search
          </button>
        </div>

        {/* Filter Controls Row */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div>
            <label className="text-slate-400 block font-medium mb-1">Year Range</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={2020}
                max={2030}
                value={yearFrom}
                onChange={(e) => setYearFrom(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-teal-500"
              />
              <span className="text-slate-500">–</span>
              <input
                type="number"
                min={2020}
                max={2030}
                value={yearTo}
                onChange={(e) => setYearTo(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 block font-medium mb-1">Research Category</label>
            <select
              value={categorySlug}
              onChange={(e) => { setCategorySlug(e.target.value); setPage(1); }}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="">All Categories (17)</option>
              {categories.map(c => (
                <option key={c.id || c.slug} value={c.slug}>{c.category_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-400 block font-medium mb-1">Journal Filter</label>
            <input
              type="text"
              value={journal}
              onChange={(e) => setJournal(e.target.value)}
              placeholder="e.g. Macromolecules, Biomacromolecules"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="text-slate-400 block font-medium mb-1">Sort By</label>
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-teal-500"
              >
                <option value="publication_year">Year</option>
                <option value="citation_count">Citations</option>
                <option value="publication_date">Date</option>
                <option value="collected_at">Newly Indexed</option>
              </select>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-20 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-slate-200 focus:outline-none focus:border-teal-500"
              >
                <option value="desc">Desc</option>
                <option value="asc">Asc</option>
              </select>
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={handleResetFilters}
              className="w-full px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors text-xs font-medium"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </form>

      {/* Batch Actions & Results Count Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
        <div className="text-slate-300 font-medium">
          Showing <span className="text-teal-400 font-semibold">{papers.length}</span> of{' '}
          <span className="text-teal-400 font-semibold">{totalCount}</span> publications
          {selectedPaperIds.length > 0 && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 font-semibold">
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
                title="Clear selection"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}

          <button
            onClick={handleExportCSV}
            disabled={exporting || papers.length === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
          <button
            onClick={handleExportBibTeX}
            disabled={exporting || papers.length === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>BibTeX</span>
          </button>
        </div>
      </div>

      {/* Papers Listing Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-teal-500 mb-3" />
          <p className="text-sm font-medium">Searching scientific literature...</p>
        </div>
      ) : papers.length > 0 ? (
        <div className="space-y-4">
          {papers.map(paper => (
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-800 text-xs text-slate-400">
              <div>
                Page <span className="font-semibold text-slate-200">{page}</span> of{' '}
                <span className="font-semibold text-slate-200">{totalPages}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 border border-slate-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 border border-slate-700"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="py-16 text-center text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
          <Search className="w-8 h-8 text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-300">No publications matched your search criteria</p>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Try broadening your search query, clearing filters, or running the literature collector to ingest additional papers from OpenAlex & Crossref.
          </p>
        </div>
      )}
    </div>
  );
}
