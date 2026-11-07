import React, { useState, useEffect } from 'react';
import { 
  BookMarked, 
  Bookmark, 
  Search, 
  Check, 
  Clock, 
  CheckCircle2, 
  BookOpen, 
  FileText, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Filter, 
  Sparkles, 
  AlertCircle,
  Plus,
  ArrowRight
} from 'lucide-react';
import { api } from '../lib/api';
import PDFReaderModal from '../components/PDFReaderModal';
import PDFUploadModal from '../components/PDFUploadModal';

export default function WatchlistView({ onOpenDetails, onNavigateToSearch }) {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ total: 0, to_read: 0, reading: 0, read: 0, with_pdf: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'to_read', 'reading', 'read'
  const [searchQuery, setSearchQuery] = useState('');

  // Note editing state
  const [editingItemId, setEditingItemId] = useState(null);
  const [noteDraft, setNoteDraft] = useState('');

  // Reader Modal State
  const [activePdf, setActivePdf] = useState(null);
  const [activePaper, setActivePaper] = useState(null);
  const [pdfReaderUrl, setPdfReaderUrl] = useState('');
  const [isReaderOpen, setIsReaderOpen] = useState(false);

  // Upload Modal State
  const [uploadPaper, setUploadPaper] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  useEffect(() => {
    loadWatchlist();
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    const handleUpdate = () => loadWatchlist();
    window.addEventListener('prih-watchlist-updated', handleUpdate);
    window.addEventListener('prih-pdf-library-updated', handleUpdate);
    return () => {
      window.removeEventListener('prih-watchlist-updated', handleUpdate);
      window.removeEventListener('prih-pdf-library-updated', handleUpdate);
    };
  }, []);

  const loadWatchlist = async () => {
    setLoading(true);
    try {
      const [list, s] = await Promise.all([
        api.getWatchlist({
          reading_status: statusFilter,
          query: searchQuery
        }),
        api.getWatchlistStats()
      ]);
      setItems(list || []);
      setStats(s || { total: 0, to_read: 0, reading: 0, read: 0, with_pdf: 0 });
    } catch (err) {
      console.error('Failed to load watchlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (articleId, newStatus) => {
    try {
      await api.updateWatchlist(articleId, { reading_status: newStatus });
      loadWatchlist();
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const handleSaveNote = async (articleId) => {
    try {
      await api.updateWatchlist(articleId, { personal_note: noteDraft });
      setEditingItemId(null);
      loadWatchlist();
    } catch (err) {
      console.error('Note update failed:', err);
    }
  };

  const handleRemove = async (articleId) => {
    try {
      await api.removeFromWatchlist(articleId);
      loadWatchlist();
    } catch (err) {
      console.error('Remove failed:', err);
    }
  };

  const handleOpenReader = async (item) => {
    try {
      const res = await api.getSignedPdfUrl(item.pdf_id || item.article_id, 'read');
      if (res?.url) {
        setActivePdf(item.pdf || { original_filename: `${(item.paper?.title || 'article').slice(0, 30)}.pdf` });
        setActivePaper(item.paper);
        setPdfReaderUrl(res.url);
        setIsReaderOpen(true);
      }
    } catch (err) {
      console.error('Reader launch error:', err);
      if (item.paper?.open_access_url) {
        setActivePdf(item.pdf);
        setActivePaper(item.paper);
        setPdfReaderUrl(item.paper.open_access_url);
        setIsReaderOpen(true);
      } else {
        alert('Could not open PDF reader: ' + (err.message || 'File unavailable'));
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-violet-500/10 border border-violet-500/30 text-violet-400">
              <BookMarked className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white tracking-tight">
                  My Research Watchlist
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/40">
                  Priority Queue
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Curate reading targets, log experimental notes, and track literature progression
              </p>
            </div>
          </div>
        </div>

        {onNavigateToSearch && (
          <button
            type="button"
            onClick={() => onNavigateToSearch('')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all shadow-sm"
          >
            <Search className="w-4 h-4 text-violet-400" />
            <span>Discover More Papers</span>
          </button>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl card-glossy card-glossy-purple shimmer-hover">
          <span className="text-xs font-medium text-slate-400">Total Watchlisted</span>
          <p className="text-2xl font-black text-white mt-1 font-mono">{stats.total}</p>
          <span className="text-[11px] text-slate-500">Tracked articles</span>
        </div>

        <div className="p-4 rounded-2xl card-glossy card-glossy-amber shimmer-hover">
          <span className="text-xs font-medium text-amber-400">To Read</span>
          <p className="text-2xl font-black text-amber-300 mt-1 font-mono">{stats.to_read}</p>
          <span className="text-[11px] text-slate-500">High priority queue</span>
        </div>

        <div className="p-4 rounded-2xl card-glossy card-glossy-cyan shimmer-hover">
          <span className="text-xs font-medium text-cyan-400">Reading</span>
          <p className="text-2xl font-black text-cyan-300 mt-1 font-mono">{stats.reading}</p>
          <span className="text-[11px] text-slate-500">Currently studying</span>
        </div>

        <div className="p-4 rounded-2xl card-glossy card-glossy-emerald shimmer-hover">
          <span className="text-xs font-medium text-emerald-400">Read / Analyzed</span>
          <p className="text-2xl font-black text-emerald-300 mt-1 font-mono">{stats.read}</p>
          <span className="text-[11px] text-slate-500">Completed readings</span>
        </div>

        <div className="p-4 rounded-2xl card-glossy card-glossy-indigo shimmer-hover">
          <span className="text-xs font-medium text-indigo-400">Full-Text PDFs Ready</span>
          <p className="text-2xl font-black text-indigo-300 mt-1 font-mono">{stats.with_pdf}</p>
          <span className="text-[11px] text-slate-500">Saved in cloud vault</span>
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="p-3 card-glossy rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 shadow-md">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800/80 w-full md:w-auto">
          {[
            { id: 'all', label: 'All Items', count: stats.total },
            { id: 'to_read', label: 'To Read', count: stats.to_read },
            { id: 'reading', label: 'Reading', count: stats.reading },
            { id: 'read', label: 'Read', count: stats.read }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === tab.id
                  ? 'bg-violet-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                statusFilter === tab.id ? 'bg-violet-900/80 text-violet-200' : 'bg-slate-800 text-slate-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search title, notes, journal..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 font-sans"
          />
        </div>
      </div>

      {/* Watchlist Cards */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-32 bg-slate-900/60 rounded-2xl border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="space-y-4">
          {items.map((item) => {
            const paper = item.paper || {};
            const title = paper.title || 'Research Publication';
            const journal = paper.journal || 'Academic Journal';
            const year = paper.publication_year || new Date(item.added_at).getFullYear();
            const authors = (paper.authors || []).map(a => a.name || a.author || a).join(', ');

            return (
              <div
                key={item.id || item.article_id}
                className="p-5 rounded-2xl card-glossy card-glossy-purple shimmer-hover transition-all duration-300 flex flex-col md:flex-row items-start justify-between gap-5 group"
              >
                {/* Main Left Content */}
                <div className="space-y-2.5 flex-1 min-w-0">
                  {/* Badges Bar */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {/* Status Badge */}
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                      item.reading_status === 'to_read' 
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' 
                        : item.reading_status === 'reading' 
                          ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' 
                          : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    }`}>
                      {item.reading_status === 'to_read' ? 'To Read' : item.reading_status === 'reading' ? 'Reading' : 'Completed'}
                    </span>

                    <span className="font-semibold text-teal-400 bg-teal-950/40 border border-teal-800/40 px-2 py-0.5 rounded-lg text-[11px]">
                      {journal}
                    </span>

                    <span className="text-slate-400 font-mono text-[11px]">
                      {year}
                    </span>

                    {/* PDF Availability Indicator */}
                    {item.has_pdf ? (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold flex items-center gap-1">
                        <FileText className="w-3 h-3 text-emerald-400" />
                        <span>PDF Stored</span>
                      </span>
                    ) : paper.open_access_url ? (
                      <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 text-[10px] font-medium">
                        Open Access PDF
                      </span>
                    ) : null}
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => onOpenDetails && onOpenDetails(paper)}
                    className="text-base font-bold text-white hover:text-violet-300 transition-colors cursor-pointer leading-snug tracking-tight"
                  >
                    {title}
                  </h3>

                  {/* Authors */}
                  {authors && (
                    <p className="text-xs text-slate-400 line-clamp-1 font-sans">
                      {authors}
                    </p>
                  )}

                  {/* Personal Research Note */}
                  <div className="pt-1">
                    {editingItemId === item.article_id ? (
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-750 space-y-2">
                        <textarea
                          rows={2}
                          value={noteDraft}
                          onChange={(e) => setNoteDraft(e.target.value)}
                          placeholder="Record key observations, reaction notes, LCST values..."
                          className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-violet-500 resize-none font-sans"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingItemId(null)}
                            className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveNote(item.article_id)}
                            className="px-3 py-1 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg shadow-sm"
                          >
                            Save Note
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        onClick={() => {
                          setEditingItemId(item.article_id);
                          setNoteDraft(item.personal_note || '');
                        }}
                        className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800/80 hover:border-slate-700 text-xs text-slate-300 flex items-start gap-2 cursor-pointer group/note transition-colors"
                        title="Click to edit research note"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
                        <span className={item.personal_note ? 'text-slate-200 italic' : 'text-slate-500'}>
                          {item.personal_note || 'Add personal research observations or synthesis notes...'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Action Column */}
                <div className="flex flex-row md:flex-col items-end justify-between gap-3 shrink-0 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                  {/* Status Dropdown */}
                  <select
                    value={item.reading_status || 'to_read'}
                    onChange={(e) => handleUpdateStatus(item.article_id, e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-xs rounded-xl px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-violet-500 cursor-pointer shadow-sm"
                  >
                    <option value="to_read">Mark To Read</option>
                    <option value="reading">Mark Reading</option>
                    <option value="read">Mark Completed</option>
                  </select>

                  {/* Actions Row */}
                  <div className="flex items-center gap-1.5">
                    {/* Read PDF Button */}
                    {item.has_pdf ? (
                      <button
                        type="button"
                        onClick={() => handleOpenReader(item)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                        title="Open full-text in-app PDF reader"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Read PDF</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setUploadPaper(paper);
                          setIsUploadOpen(true);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
                        title="Upload PDF file"
                      >
                        <FileText className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Upload PDF</span>
                      </button>
                    )}

                    {/* Article Details Link */}
                    {onOpenDetails && (
                      <button
                        type="button"
                        onClick={() => onOpenDetails(paper)}
                        className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                        title="View Article Details & TOC"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Remove from Watchlist */}
                    <button
                      type="button"
                      onClick={() => handleRemove(item.article_id)}
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
                      title="Remove from Watchlist"
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
        <div className="py-16 px-6 text-center rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-violet-500/10 border border-violet-500/25 flex items-center justify-center mx-auto text-violet-400 shadow-inner">
            <BookMarked className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">Your Watchlist is Empty</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
              Add research publications from POx Search, Polymer Search, Journal Trackers, or Article Detail pages by clicking the bookmark icon.
            </p>
          </div>
          {onNavigateToSearch && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigateToSearch('')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-600/25 transition-all"
              >
                <span>Browse Research Papers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
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

      {/* Upload Modal */}
      <PDFUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        paper={uploadPaper}
        onUploadSuccess={() => {
          setIsUploadOpen(false);
          loadWatchlist();
        }}
      />
    </div>
  );
}
