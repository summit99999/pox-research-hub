import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Download, 
  BookOpen, 
  Trash2, 
  RefreshCw, 
  Upload, 
  ExternalLink, 
  HardDrive, 
  Layers, 
  Calendar, 
  ShieldCheck, 
  Filter, 
  ArrowUpDown, 
  AlertCircle,
  Clock,
  Sparkles,
  Bookmark
} from 'lucide-react';
import { api } from '../lib/api';
import PDFReaderModal from '../components/PDFReaderModal';
import PDFUploadModal from '../components/PDFUploadModal';

export default function PdfLibraryView({ onOpenDetails, onNavigateToSearch }) {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ total_pdfs: 0, total_bytes: 0, journals_count: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [journalFilter, setJournalFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at'); // 'created_at', 'title', 'year', 'file_size'
  const [sortOrder, setSortOrder] = useState('desc');

  // Reader & Upload Modal States
  const [activePdf, setActivePdf] = useState(null);
  const [activePaper, setActivePaper] = useState(null);
  const [pdfReaderUrl, setPdfReaderUrl] = useState('');
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isReplacing, setIsReplacing] = useState(false);
  const [selectedForAction, setSelectedForAction] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    loadLibrary();
  }, [searchQuery, journalFilter, sortBy, sortOrder]);

  useEffect(() => {
    const handleUpdate = () => loadLibrary();
    window.addEventListener('prih-pdf-library-updated', handleUpdate);
    return () => window.removeEventListener('prih-pdf-library-updated', handleUpdate);
  }, []);

  const loadLibrary = async () => {
    setLoading(true);
    try {
      const [list, s] = await Promise.all([
        api.getPdfLibrary({
          query: searchQuery,
          journal: journalFilter === 'all' ? '' : journalFilter,
          sort_by: sortBy,
          sort_order: sortOrder
        }),
        api.getPdfLibraryStats()
      ]);
      setItems(list || []);
      setStats(s || { total_pdfs: 0, total_bytes: 0, journals_count: 0 });
    } catch (err) {
      console.error('Failed to load PDF library:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReader = async (item) => {
    try {
      const res = await api.getSignedPdfUrl(item.id || item.article_id, 'read');
      if (res?.url) {
        setActivePdf(item);
        setActivePaper(item.paper);
        setPdfReaderUrl(res.url);
        setIsReaderOpen(true);
      }
    } catch (err) {
      console.error('Reader launch error:', err);
      if (item.paper?.open_access_url) {
        setActivePdf(item);
        setActivePaper(item.paper);
        setPdfReaderUrl(item.paper.open_access_url);
        setIsReaderOpen(true);
      } else {
        alert('Could not open PDF reader: ' + (err.message || 'File unavailable'));
      }
    }
  };

  const handleDownloadPdf = async (item) => {
    try {
      const res = await api.getSignedPdfUrl(item.id || item.article_id, 'download');
      if (res?.url) {
        const a = document.createElement('a');
        a.href = res.url;
        a.download = item.original_filename || res.filename || `${(item.paper?.title || 'article').slice(0, 30)}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error('Download error:', err);
      if (item.paper?.open_access_url) {
        window.open(item.paper.open_access_url, '_blank');
      } else {
        alert('Could not download PDF: ' + (err.message || 'File unavailable'));
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await api.removeArticlePdf(deleteConfirmId, deleteConfirmId);
      setDeleteConfirmId(null);
      loadLibrary();
    } catch (err) {
      alert('Failed to remove PDF: ' + err.message);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 KB';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Distinct journal list for filter dropdown
  const availableJournals = Array.from(new Set(items.map(i => i.paper?.journal).filter(Boolean)));

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  My PDF Library
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 border border-indigo-500/40">
                  Cloud Secured
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Personal collection of research papers, in-app viewer, and offline reading library
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setSelectedForAction(null);
              setIsReplacing(false);
              setIsUploadOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Article PDF</span>
          </button>
        </div>
      </div>

      {/* Metrics Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl card-glossy card-glossy-indigo shimmer-hover border-slate-200/80 dark:border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Stored PDFs</span>
            <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
            {stats.total_pdfs}
          </p>
          <span className="text-[11px] text-slate-500">Indexed full-text articles</span>
        </div>

        <div className="p-4 rounded-2xl card-glossy card-glossy-teal shimmer-hover border-slate-200/80 dark:border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Cloud Storage Used</span>
            <HardDrive className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <p className="text-2xl font-black text-teal-700 dark:text-teal-300 mt-1 font-mono">
            {formatFileSize(stats.total_bytes)}
          </p>
          <span className="text-[11px] text-slate-500">Across encrypted storage buckets</span>
        </div>

        <div className="p-4 rounded-2xl card-glossy card-glossy-purple shimmer-hover border-slate-200/80 dark:border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Journals</span>
            <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-2xl font-black text-purple-700 dark:text-purple-300 mt-1 font-mono">
            {stats.journals_count}
          </p>
          <span className="text-[11px] text-slate-500">Different publisher sources</span>
        </div>

        <div className="p-4 rounded-2xl card-glossy card-glossy-emerald shimmer-hover border-slate-200/80 dark:border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Institutional / Subscribed</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1 font-mono">
            100%
          </p>
          <span className="text-[11px] text-slate-500">Directly accessible full-text</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl card-glossy flex flex-col md:flex-row items-center justify-between gap-3 shadow-md border-slate-200/80 dark:border-slate-800/80">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved PDFs by title, author, journal, or filename..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-sans"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Journal Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={journalFilter}
              onChange={(e) => setJournalFilter(e.target.value)}
              className="bg-transparent border-none text-xs text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all">All Journals</option>
              {availableJournals.map(j => (
                <option key={j} value={j}>{j}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none text-xs text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="created_at">Recently Added</option>
              <option value="title">Title (A-Z)</option>
              <option value="year">Publication Year</option>
              <option value="file_size">File Size</option>
            </select>
          </div>
        </div>
      </div>

      {/* PDF List / Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-44 bg-slate-100 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse p-5 space-y-3">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-4/5" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {items.map((item) => {
            const paper = item.paper || {};
            const title = paper.title || item.original_filename || 'Research Article';
            const journal = paper.journal || 'Journal Publication';
            const year = paper.publication_year || new Date(item.created_at).getFullYear();
            const authors = (paper.authors || []).map(a => a.name || a.author || a).join(', ');

            return (
              <div
                key={item.id || item.article_id}
                className="p-5 rounded-2xl card-glossy card-glossy-emerald shimmer-hover transition-all duration-300 flex flex-col justify-between space-y-4 group border-slate-200/80 dark:border-slate-800/80 shadow-md hover:shadow-xl"
              >
                <div className="space-y-2.5">
                  {/* Top Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-cyan-800 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-800/40 px-2.5 py-0.5 rounded-lg text-[11px]">
                        {journal}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                        {year}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {formatFileSize(item.file_size)}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-400 font-medium">
                        {item.source_type === 'institutional_access' ? 'Institutional' : item.source_type === 'open_access' ? 'Open Access' : 'Cloud Saved'}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 
                    onClick={() => {
                      if (onOpenDetails && paper.id) {
                        onOpenDetails(paper);
                      } else {
                        handleOpenReader(item);
                      }
                    }}
                    className="text-base font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors cursor-pointer line-clamp-2 leading-snug"
                    title={title}
                  >
                    {title}
                  </h3>

                  {/* Authors */}
                  {authors && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 font-sans">
                      {authors}
                    </p>
                  )}

                  {/* Filename & Timestamp */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono pt-1">
                    <span className="truncate max-w-[240px] text-slate-600 dark:text-slate-400">{item.original_filename}</span>
                    <span>•</span>
                    <span>Added {new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Bottom Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-200 dark:border-slate-800/80">
                  <div className="flex items-center gap-2">
                    {/* Read PDF Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenReader(item)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                      title="Open full-text in-app PDF reader"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Read PDF</span>
                    </button>

                    {/* Download to Computer */}
                    <button
                      type="button"
                      onClick={() => handleDownloadPdf(item)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                      title="Download PDF directly to your computer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Details Link */}
                    {onOpenDetails && paper.id && (
                      <button
                        type="button"
                        onClick={() => onOpenDetails(paper)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 text-xs font-medium transition-colors"
                        title="View Article Details & TOC"
                      >
                        Details
                      </button>
                    )}

                    {/* Replace Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedForAction(paper);
                        setIsReplacing(true);
                        setIsUploadOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-300 dark:border-slate-700 transition-colors"
                      title="Replace PDF with newer version"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(item.id || item.article_id)}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-500/20 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-300 dark:border-slate-700 transition-colors"
                      title="Remove PDF from library"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 px-6 text-center rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4 max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400 shadow-inner">
            <FileText className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your PDF Library is Ready</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
              Save research papers, upload university-authorized full texts, and read articles with the in-app scientific PDF reader.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setSelectedForAction(null);
                setIsReplacing(false);
                setIsUploadOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Upload PDF Document</span>
            </button>
            {onNavigateToSearch && (
              <button
                type="button"
                onClick={() => onNavigateToSearch('')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-300 dark:border-slate-700 transition-all"
              >
                <Search className="w-4 h-4" />
                <span>Search Papers</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Reader Modal */}
      <PDFReaderModal
        isOpen={isReaderOpen}
        onClose={() => setIsReaderOpen(false)}
        pdf={activePdf}
        paper={activePaper}
        pdfUrl={pdfReaderUrl}
      />

      {/* Upload / Replace Modal */}
      <PDFUploadModal
        isOpen={isUploadOpen}
        onClose={() => {
          setIsUploadOpen(false);
          setIsReplacing(false);
        }}
        paper={selectedForAction || { id: `manual-${Date.now()}`, title: 'Manual Research Paper Upload', journal: 'Custom Document', publication_year: 2026 }}
        isReplacement={isReplacing}
        onUploadSuccess={() => {
          setIsUploadOpen(false);
          loadLibrary();
        }}
      />

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md bg-slate-900 border border-slate-750 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Remove PDF from Library?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to remove this PDF from your private cloud storage? You can re-upload it at any time.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/20 transition-all"
              >
                Yes, Remove PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
