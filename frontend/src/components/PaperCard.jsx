import React, { useState, useEffect } from 'react';
import { 
  Star, 
  ExternalLink, 
  Sparkles, 
  BookMarked, 
  Bookmark,
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Quote, 
  BookOpen,
  Clock,
  Calendar,
  Award,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import { getJournalImpactFactor } from '../lib/journalMeta';
import { getPaperDoiUrl, getOfficialPublisherUrl, formatDoiDisplay, cleanDoi } from '../lib/doiHelper';
import { api } from '../lib/api';

export default function PaperCard({ 
  paper, 
  isSelected, 
  onToggleSelect, 
  onOpenDetails, 
  onOpenSummary, 
  onToggleFavourite, 
  onUpdateReadingStatus, 
  onUpdateScreening 
}) {
  const [expandedAbstract, setExpandedAbstract] = useState(false);
  const [isWatchlisted, setIsWatchlisted] = useState(Boolean(paper.is_watchlisted));
  const [hasPdf, setHasPdf] = useState(Boolean(paper.has_pdf));

  useEffect(() => {
    setIsWatchlisted(Boolean(paper.is_watchlisted || api.isArticleInWatchlist(paper.id)));
    setHasPdf(Boolean(paper.has_pdf));
  }, [paper.id, paper.is_watchlisted, paper.has_pdf]);

  useEffect(() => {
    const handleWatchlistChange = (e) => {
      if (e.detail?.articleId === paper.id || (paper.doi && cleanDoi(e.detail?.doi) === cleanDoi(paper.doi))) {
        if (e.detail.isWatchlisted !== undefined) {
          setIsWatchlisted(e.detail.isWatchlisted);
        }
      }
    };
    const handlePdfChange = (e) => {
      if (e.detail?.articleId === paper.id || (paper.doi && cleanDoi(e.detail?.doi) === cleanDoi(paper.doi))) {
        setHasPdf(!e.detail.deleted);
      }
    };

    window.addEventListener('prih-watchlist-updated', handleWatchlistChange);
    window.addEventListener('prih-pdf-library-updated', handlePdfChange);
    return () => {
      window.removeEventListener('prih-watchlist-updated', handleWatchlistChange);
      window.removeEventListener('prih-pdf-library-updated', handlePdfChange);
    };
  }, [paper.id, paper.doi]);

  const handleToggleWatchlist = async (e) => {
    e.stopPropagation();
    if (isWatchlisted) {
      await api.removeFromWatchlist(paper.id);
      setIsWatchlisted(false);
    } else {
      await api.addToWatchlist(paper.id, { paper, reading_status: 'to_read' });
      setIsWatchlisted(true);
    }
  };

  const authorsList = paper.authors?.map(a => a.name).join(', ') || 'Authors not listed';
  const publisherUrl = getOfficialPublisherUrl(paper);
  const displayDoi = formatDoiDisplay(paper.doi);
  const impactFactor = getJournalImpactFactor(paper.journal);

  const hasLongAbstract = paper.abstract && paper.abstract.length > 220;

  return (
    <article 
      onClick={() => onOpenDetails && onOpenDetails(paper)}
      className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 group relative cursor-pointer card-glossy shimmer-hover ${
        isSelected 
          ? 'card-glossy-teal ring-1 ring-teal-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950/40' 
          : 'border-slate-800/80 hover:border-teal-500/40'
      }`}
    >
      <div className="flex items-start gap-3 sm:gap-3.5">
        {/* Selection Checkbox */}
        <div className="pt-1" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={isSelected || false}
            onChange={() => onToggleSelect && onToggleSelect(paper.id)}
            className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-teal-600 focus:ring-teal-500/40 focus:ring-offset-0 cursor-pointer transition-colors"
            title="Select for batch actions / systematic review"
          />
        </div>

        <div className="flex-1 min-w-0">
          {/* Top Metadata Bar */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 text-xs">
            {/* Publication Date Badge */}
            {(paper.publication_date || paper.publication_year) && (
              <span 
                className="font-semibold text-teal-400 font-mono bg-teal-950/60 border border-teal-800/50 px-2 py-0.5 rounded-lg inline-flex items-center gap-1 shadow-sm"
                title={`Publication Date: ${paper.publication_date || paper.publication_year}`}
              >
                <Calendar className="w-3 h-3 text-teal-400 shrink-0" />
                <span>{paper.publication_date || paper.publication_year}</span>
              </span>
            )}

            {/* Journal Name & Impact Factor */}
            {paper.journal && (
              <div className="flex items-center gap-1.5 shrink-0 max-w-full">
                <span 
                  className="text-slate-300 font-medium truncate max-w-[220px] sm:max-w-xs" 
                  title={paper.journal}
                >
                  {paper.journal}
                </span>
                {impactFactor && (
                  <span 
                    className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm"
                    title={`${paper.journal} Impact Factor: ${impactFactor} (Clarivate JCR)`}
                  >
                    IF {impactFactor}
                  </span>
                )}
              </div>
            )}

            {/* Citations Count */}
            {paper.citation_count > 0 && (
              <span 
                className="flex items-center gap-1 text-[11px] text-slate-400 font-mono bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/60"
                title={`${paper.citation_count} cross-platform citations`}
              >
                <Quote className="w-2.5 h-2.5 text-slate-400" />
                <span>{paper.citation_count}</span>
              </span>
            )}

            {/* Open Access Badge */}
            {paper.open_access_url && (
              <span className="text-[11px] font-medium text-emerald-300 bg-emerald-950/60 border border-emerald-700/50 px-2 py-0.5 rounded-md shadow-sm">
                Open Access
              </span>
            )}

            {/* PDF Available in Library Indicator */}
            {hasPdf && (
              <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-300 bg-emerald-950/70 border border-emerald-600/50 px-2 py-0.5 rounded-md shadow-sm" title="Full-text PDF saved in personal library">
                <FileText className="w-3 h-3 text-emerald-400" />
                <span>PDF Stored</span>
              </span>
            )}

            {/* AI Summary Indicator */}
            {paper.has_summary && (
              <span className="flex items-center gap-1 text-[11px] font-medium text-indigo-300 bg-indigo-950/60 border border-indigo-700/50 px-2 py-0.5 rounded-md shadow-sm">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span>AI Analyzed</span>
              </span>
            )}
          </div>

          {/* Paper Title */}
          <h3 
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails && onOpenDetails(paper);
            }}
            className="text-base sm:text-lg font-bold text-slate-100 hover:text-teal-300 transition-colors cursor-pointer leading-snug tracking-tight"
          >
            {paper.title}
          </h3>

          {/* Authors */}
          <p className="text-xs text-slate-400 mt-1 line-clamp-1 font-sans">
            {authorsList}
          </p>

          {/* Abstract Snippet with Expand / Collapse */}
          {paper.abstract && (
            <div className="mt-2.5">
              <p className={`text-xs text-slate-300 leading-relaxed ${expandedAbstract ? '' : 'line-clamp-2'}`}>
                {paper.abstract}
              </p>
              {hasLongAbstract && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedAbstract(prev => !prev);
                  }}
                  className="text-[11px] font-medium text-teal-400 hover:text-teal-300 mt-1 inline-flex items-center gap-0.5 transition-colors"
                >
                  <span>{expandedAbstract ? 'Collapse abstract' : 'Read full abstract'}</span>
                  {expandedAbstract ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              )}
            </div>
          )}

          {/* Categories / Topic Tags */}
          {paper.categories && paper.categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mt-3">
              {paper.categories.slice(0, 4).map(cat => (
                <span 
                  key={cat.id || cat.slug}
                  className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800/90 text-slate-300 border border-slate-700/70 hover:border-teal-500/40 transition-colors"
                >
                  {cat.category_name}
                </span>
              ))}
              {paper.categories.length > 4 && (
                <span className="text-[10px] text-slate-400 font-medium">
                  +{paper.categories.length - 4} more
                </span>
              )}
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3.5 border-t border-slate-800/80">
            {/* Quick Actions (Publisher Link, Details, AI Summary) */}
            <div className="flex items-center gap-2 flex-wrap">
              {publisherUrl ? (
                <a
                  href={publisherUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 font-mono transition-colors px-2.5 py-1 rounded-lg bg-teal-950/30 border border-teal-800/40 hover:bg-teal-900/40"
                  title="Direct verified publisher article DOI link"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>DOI</span>
                </a>
              ) : null}

              {/* Prominent TOC / Graphical Abstract Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDetails(paper);
                }}
                className="flex items-center gap-1.5 text-xs text-slate-200 hover:text-teal-300 font-semibold transition-all px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-750 border border-slate-700/80 hover:border-teal-500/40 shadow-sm"
                title="View Table of Contents (TOC) & Journal Graphical Abstract"
              >
                <ImageIcon className="w-3.5 h-3.5 text-teal-400" />
                <span>TOC / Graphical Abstract</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenSummary(paper);
                }}
                className="flex items-center gap-1 text-xs text-indigo-300 hover:text-indigo-200 transition-colors px-2 py-1 rounded-lg bg-indigo-950/40 border border-indigo-800/40 hover:bg-indigo-900/40 font-medium"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>{paper.has_summary ? 'View Summary' : 'AI Summary'}</span>
              </button>
            </div>

            {/* Research Management (Screening, Status, Favourite) */}
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              {/* Systematic Screening decision buttons */}
              <div className="flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700/80 text-xs shadow-inner">
                <button
                  type="button"
                  onClick={() => onUpdateScreening && onUpdateScreening(paper.id, 'included')}
                  title="Screen: Include in Systematic Review"
                  className={`px-1.5 py-1 rounded transition-colors ${
                    paper.screening_status === 'included' 
                      ? 'bg-emerald-600 text-white font-medium shadow-sm' 
                      : 'text-slate-400 hover:text-emerald-300'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateScreening && onUpdateScreening(paper.id, 'excluded')}
                  title="Screen: Exclude from Systematic Review"
                  className={`px-1.5 py-1 rounded transition-colors ${
                    paper.screening_status === 'excluded' 
                      ? 'bg-rose-600 text-white font-medium shadow-sm' 
                      : 'text-slate-400 hover:text-rose-300'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateScreening && onUpdateScreening(paper.id, 'maybe')}
                  title="Screen: Mark as Uncertain / Review Full Text"
                  className={`px-1.5 py-1 rounded transition-colors ${
                    paper.screening_status === 'maybe' 
                      ? 'bg-amber-600 text-white font-medium shadow-sm' 
                      : 'text-slate-400 hover:text-amber-300'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Reading Status Selector */}
              <select
                value={paper.reading_status || 'unread'}
                onChange={(e) => onUpdateReadingStatus && onUpdateReadingStatus(paper.id, e.target.value)}
                className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-teal-500 cursor-pointer shadow-sm"
              >
                <option value="unread">Unread</option>
                <option value="in_progress">Reading</option>
                <option value="completed">Read</option>
              </select>

              {/* Watchlist Toggle Button */}
              <button
                type="button"
                onClick={handleToggleWatchlist}
                className={`p-1.5 rounded-lg border transition-all ${
                  isWatchlisted 
                    ? 'bg-violet-600/20 border-violet-500/50 text-violet-300 shadow-sm' 
                    : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-violet-300'
                }`}
                title={isWatchlisted ? 'In Watchlist (Click to remove)' : 'Add to Watchlist'}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isWatchlisted ? 'fill-violet-400 text-violet-400' : ''}`} />
              </button>

              {/* Favourite Star Toggle */}
              <button
                type="button"
                onClick={() => onToggleFavourite && onToggleFavourite(paper.id, !paper.is_favourite)}
                className={`p-1.5 rounded-lg border transition-colors ${
                  paper.is_favourite 
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-400 shadow-sm' 
                    : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-amber-400'
                }`}
                title={paper.is_favourite ? 'Remove from favourites' : 'Save to favourites'}
              >
                <Star className={`w-3.5 h-3.5 ${paper.is_favourite ? 'fill-amber-400' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
