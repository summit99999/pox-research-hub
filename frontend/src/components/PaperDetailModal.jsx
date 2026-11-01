import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Calendar, 
  BookOpen, 
  Quote, 
  Tag, 
  Sparkles, 
  Building2,
  Check,
  FileText
} from 'lucide-react';
import PaperTOC from './PaperTOC';
import AISummaryViewer from './AISummaryViewer';
import { api } from '../lib/api';
import { getPaperDoiUrl, formatDoiDisplay } from '../lib/doiHelper';
import { getJournalImpactFactor } from '../lib/journalMeta';

export default function PaperDetailModal({ 
  paper, 
  allCategories, 
  initialTab = 'toc', 
  onClose, 
  onCategoriesUpdated 
}) {
  const [activeTab, setActiveTab] = useState(initialTab || 'toc');

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, paper?.id]);

  const [selectedCategories, setSelectedCategories] = useState(
    paper?.categories?.map(c => c.slug) || []
  );
  const [savingCategories, setSavingCategories] = useState(false);
  const [categorySuccess, setCategorySuccess] = useState(false);

  if (!paper) return null;

  const doiUrl = getPaperDoiUrl(paper);
  const displayDoi = formatDoiDisplay(paper.doi);
  const ifScore = getJournalImpactFactor(paper.journal);

  const handleToggleCategory = (slug) => {
    if (selectedCategories.includes(slug)) {
      setSelectedCategories(selectedCategories.filter(s => s !== slug));
    } else {
      setSelectedCategories([...selectedCategories, slug]);
    }
  };

  const handleSaveCategories = async () => {
    setSavingCategories(true);
    setCategorySuccess(false);
    try {
      await api.assignCategories(paper.id, selectedCategories);
      setCategorySuccess(true);
      if (onCategoriesUpdated) onCategoriesUpdated();
      setTimeout(() => setCategorySuccess(false), 2000);
    } catch (err) {
      alert(`Error updating categories: ${err.message}`);
    } finally {
      setSavingCategories(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950/80">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* Table of Contents (TOC) Tab */}
            <button
              onClick={() => setActiveTab('toc')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'toc'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Table of Contents (TOC)</span>
            </button>

            {/* Publication Details Tab */}
            <button
              onClick={() => setActiveTab('metadata')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'metadata'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Publication Details</span>
            </button>

            {/* 13-Section AI Summary Tab */}
            <button
              onClick={() => setActiveTab('summary')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'summary'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>13-Section Summary</span>
            </button>

            {/* Category Manager Tab */}
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'categories'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Categories</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors shrink-0 ml-2"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: TABLE OF CONTENTS (TOC) */}
          {activeTab === 'toc' && (
            <PaperTOC 
              paper={paper} 
              onOpenSummary={() => setActiveTab('summary')} 
            />
          )}

          {/* TAB 2: METADATA / PUBLICATION DETAILS */}
          {activeTab === 'metadata' && (
            <div className="space-y-6">
              {/* Paper Title & DOI */}
              <div>
                <h2 className="text-xl font-bold text-slate-100 leading-snug">
                  {paper.title}
                </h2>
                <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
                  {doiUrl && (
                    <a
                      href={doiUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-teal-400 hover:text-teal-300 font-mono font-medium"
                      title="Open full-text paper via publisher DOI resolver"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{displayDoi ? `doi:${displayDoi}` : 'Publisher Article Link'}</span>
                    </a>
                  )}
                  {paper.open_access_url && (
                    <a
                      href={paper.open_access_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800 font-medium"
                    >
                      Open Access PDF
                    </a>
                  )}
                  {paper.citation_count > 0 && (
                    <span className="flex items-center gap-1 text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      <Quote className="w-3 h-3" />
                      <span>{paper.citation_count} Citations</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Journal, Publisher, Publication Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-800/40 border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Journal / Venue:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-200 font-medium">{paper.journal || 'Not specified'}</span>
                    {ifScore && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        IF: {ifScore}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Publication Year:</span>
                  <span className="text-slate-200 font-medium font-mono">
                    {paper.publication_date || paper.publication_year || 'Not specified'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Publisher:</span>
                  <span className="text-slate-200 font-medium">{paper.publisher || 'Not specified'}</span>
                </div>
              </div>

              {/* Authors & Affiliations */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Authors & Institutional Affiliations
                </h3>
                <div className="space-y-2">
                  {paper.authors?.map((a, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-800/30 border border-slate-800/60 text-xs flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-slate-300 font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-200">{a.name}</span>
                        {a.affiliation && (
                          <div className="text-slate-400 flex items-center gap-1 mt-0.5 text-[11px]">
                            <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{a.affiliation}</span>
                          </div>
                        )}
                        {a.orcid && (
                          <span className="text-[11px] text-teal-400 font-mono mt-0.5 block">
                            ORCID: {a.orcid}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {(!paper.authors || paper.authors.length === 0) && (
                    <p className="text-xs text-slate-400">Authors metadata unavailable.</p>
                  )}
                </div>
              </div>

              {/* Abstract */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Scientific Abstract
                </h3>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                  {paper.abstract || 'No abstract text available in indexed record.'}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AI SUMMARY */}
          {activeTab === 'summary' && (
            <AISummaryViewer paper={paper} onClose={onClose} />
          )}

          {/* TAB 4: CATEGORY MANAGER */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-100">
                  Manage Scientific Classifications
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Adjust or augment the automatically detected POx/POzi research categories for this paper.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                {allCategories?.map(cat => {
                  const isChecked = selectedCategories.includes(cat.slug);
                  return (
                    <button
                      key={cat.id || cat.slug}
                      type="button"
                      onClick={() => handleToggleCategory(cat.slug)}
                      className={`flex items-start gap-3 p-3 rounded-xl border text-left text-xs transition-all ${
                        isChecked
                          ? 'bg-teal-500/10 border-teal-500/50 text-teal-200'
                          : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center shrink-0 ${
                        isChecked ? 'bg-teal-500 border-teal-500 text-slate-950' : 'border-slate-600 bg-slate-800'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div>
                        <div className="font-semibold">{cat.category_name}</div>
                        {cat.description && (
                          <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                            {cat.description}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-800">
                <span className="text-xs text-slate-400">
                  {selectedCategories.length} categories selected
                </span>
                <div className="flex items-center gap-2">
                  {categorySuccess && (
                    <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                      <Check className="w-3.5 h-3.5" /> Saved!
                    </span>
                  )}
                  <button
                    onClick={handleSaveCategories}
                    disabled={savingCategories}
                    className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold transition-colors shadow-sm"
                  >
                    {savingCategories ? 'Saving...' : 'Save Categories'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
