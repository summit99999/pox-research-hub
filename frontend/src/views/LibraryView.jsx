import React, { useState, useEffect } from 'react';
import { 
  Bookmark, 
  Star, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Download, 
  Trash2, 
  Edit3, 
  ExternalLink,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { api } from '../lib/api';

export default function LibraryView({ onOpenDetails, onOpenSummary, onNavigateToSearch }) {
  const [activeTab, setActiveTab] = useState('all'); // all, favourites, reading, screening
  const [screeningFilter, setScreeningFilter] = useState('included');
  const [libraryItems, setLibraryItems] = useState([]);
  const [screeningItems, setScreeningItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingNotesId, setEditingNotesId] = useState(null);
  const [notesText, setNotesText] = useState('');

  useEffect(() => {
    if (activeTab === 'screening') {
      loadScreening();
    } else {
      loadLibrary();
    }
  }, [activeTab, screeningFilter]);

  const loadLibrary = async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeTab === 'favourites') params.favourite_only = true;
      if (activeTab === 'reading') params.reading_status = 'in_progress';
      const data = await api.getLibrary(params);
      setLibraryItems(data || []);
    } catch (e) {
      console.debug('Failed to load library', e);
      setLibraryItems([]);
    } finally {
      setLoading(false);
    }
  };

  const loadScreening = async () => {
    setLoading(true);
    try {
      const data = await api.getScreening(screeningFilter);
      setScreeningItems(data || []);
    } catch (e) {
      console.debug('Failed to load screening records', e);
      setScreeningItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (paperId) => {
    if (!window.confirm('Remove paper from personal library?')) return;
    try {
      await api.removeFromLibrary(paperId);
      setLibraryItems(libraryItems.filter(i => i.paper_id !== paperId));
    } catch (e) {
      alert(`Failed to remove: ${e.message}`);
    }
  };

  const handleSaveNotes = async (paperId) => {
    try {
      await api.updateLibrary(paperId, { personal_notes: notesText });
      setEditingNotesId(null);
      await loadLibrary();
    } catch (e) {
      alert(`Failed to save notes: ${e.message}`);
    }
  };

  const handleExportCSV = async () => {
    const ids = libraryItems.map(i => i.paper_id);
    if (ids.length === 0) return;
    try {
      await api.exportCSV(ids);
    } catch (e) {
      alert(`Export failed: ${e.message}`);
    }
  };

  const handleExportBibTeX = async () => {
    const ids = libraryItems.map(i => i.paper_id);
    if (ids.length === 0) return;
    try {
      await api.exportBibTeX(ids);
    } catch (e) {
      alert(`Export failed: ${e.message}`);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30">
              <Bookmark className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Personal Research Library & Screening Workspace
            </h1>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Private cloud repository for saved publications, personal research notes, and systematic review screening decisions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            disabled={libraryItems.length === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 text-xs font-medium cursor-pointer shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportBibTeX}
            disabled={libraryItems.length === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 text-xs font-medium cursor-pointer shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export BibTeX</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2">
        {[
          { id: 'all', label: 'All Saved Papers' },
          { id: 'favourites', label: 'Favourites' },
          { id: 'reading', label: 'Currently Reading' },
          { id: 'screening', label: 'Systematic Screening' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'border-teal-500 text-teal-700 dark:text-teal-300 font-semibold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Systematic Screening Sub-Filters */}
      {activeTab === 'screening' && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium mr-1">Status:</span>
          {['included', 'maybe', 'excluded'].map(st => (
            <button
              key={st}
              onClick={() => setScreeningFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs capitalize transition-colors cursor-pointer ${
                screeningFilter === st
                  ? 'bg-teal-500/20 text-teal-800 dark:text-teal-300 border border-teal-500/40 font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-300 dark:border-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      )}

      {/* Content List */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 dark:text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-teal-500 mb-3" />
          <p className="text-sm">Loading library data...</p>
        </div>
      ) : activeTab === 'screening' ? (
        <div className="space-y-4">
          {screeningItems.map((item, idx) => {
            const p = item.papers;
            if (!p) return null;
            return (
              <div key={idx} className="p-4 rounded-xl bg-white/90 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2 card-glossy">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 
                      onClick={() => onOpenDetails && onOpenDetails(p)}
                      className="text-sm font-semibold text-slate-900 dark:text-slate-100 hover:text-teal-600 dark:hover:text-teal-300 cursor-pointer"
                    >
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      {p.journal} ({p.publication_year}) — DOI: {p.doi || 'N/A'}
                    </p>
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border shrink-0 ${
                    item.screening_status === 'included'
                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                      : item.screening_status === 'maybe'
                      ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800'
                      : 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-800'
                  }`}>
                    {item.screening_status}
                  </span>
                </div>
                {item.screening_notes && (
                  <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/40 p-2 rounded border border-slate-200 dark:border-slate-800 italic">
                    Note: {item.screening_notes}
                  </p>
                )}
              </div>
            );
          })}
          {screeningItems.length === 0 && (
            <div className="py-16 text-center text-slate-500 dark:text-slate-400 bg-white/60 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800">
              No papers screened as "{screeningFilter}" yet.
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {libraryItems.map(item => {
            const p = item.paper;
            if (!p) return null;
            const isEditing = editingNotesId === item.paper_id;
            return (
              <div key={item.paper_id} className="p-5 rounded-2xl bg-white/95 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3 card-glossy">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      {p.publication_year && (
                        <span className="font-mono text-teal-700 dark:text-teal-400 font-semibold bg-teal-50 dark:bg-teal-950/60 px-1.5 py-0.2 rounded border border-teal-200 dark:border-teal-800/60">
                          {p.publication_year}
                        </span>
                      )}
                      <span className="text-slate-600 dark:text-slate-400">{p.journal}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 capitalize">
                        {item.reading_status}
                      </span>
                    </div>

                    <h3 
                      onClick={() => onOpenDetails && onOpenDetails(p)}
                      className="text-base font-semibold text-slate-900 dark:text-slate-100 hover:text-teal-600 dark:hover:text-teal-300 cursor-pointer"
                    >
                      {p.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => onOpenSummary && onOpenSummary(p)}
                      className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                      title="View AI Summary"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemove(item.paper_id)}
                      className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                      title="Remove from library"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Personal Notes Section */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800/60 text-xs">
                  {isEditing ? (
                    <div className="space-y-2">
                      <textarea
                        value={notesText}
                        onChange={(e) => setNotesText(e.target.value)}
                        placeholder="Add personal notes, synthesis observations, or questions..."
                        rows={2}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-500"
                      />
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => setEditingNotesId(null)}
                          className="px-2.5 py-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 text-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveNotes(item.paper_id)}
                          className="px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-sm"
                        >
                          Save Notes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-2 group">
                      <p className="text-slate-600 dark:text-slate-400 italic">
                        {item.personal_notes || 'No personal notes recorded yet.'}
                      </p>
                      <button
                        onClick={() => { setEditingNotesId(item.paper_id); setNotesText(item.personal_notes || ''); }}
                        className="text-slate-400 dark:text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Edit notes"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {libraryItems.length === 0 && (
            <div className="py-16 text-center text-slate-600 dark:text-slate-400 bg-white/70 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <Bookmark className="w-8 h-8 text-teal-600 dark:text-teal-500/60 mx-auto mb-1" />
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Your Personal Research Library is Ready</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Bookmark publications, add personal research notes, and track your reading and systematic screening progress here.
              </p>
              {onNavigateToSearch && (
                <button
                  onClick={onNavigateToSearch}
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer"
                >
                  Browse Indexed Publications to Add
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
