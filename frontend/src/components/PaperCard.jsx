import React from 'react';
import { 
  Star, 
  ExternalLink, 
  Sparkles, 
  BookMarked, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Quote, 
  FileText,
  Clock
} from 'lucide-react';

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
  const authorsList = paper.authors?.map(a => a.name).join(', ') || 'Authors not listed';
  const doiUrl = paper.doi ? `https://doi.org/${paper.doi_normalized || paper.doi}` : paper.landing_page_url;

  return (
    <div className={`p-4 rounded-xl border transition-all ${
      isSelected 
        ? 'bg-teal-950/20 border-teal-500/50 shadow-md shadow-teal-500/10' 
        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:shadow-lg'
    }`}>
      <div className="flex items-start gap-3">
        {/* Selection Checkbox */}
        <input
          type="checkbox"
          checked={isSelected || false}
          onChange={() => onToggleSelect && onToggleSelect(paper.id)}
          className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-800 text-teal-600 focus:ring-teal-500 shrink-0 cursor-pointer"
        />

        <div className="flex-1 min-w-0">
          {/* Top Metadata Bar */}
          <div className="flex flex-wrap items-center gap-2 mb-1 text-xs">
            {paper.publication_year && (
              <span className="font-semibold text-teal-400 font-mono bg-teal-950/60 border border-teal-800/60 px-2 py-0.5 rounded">
                {paper.publication_year}
              </span>
            )}
            {paper.journal && (
              <span className="text-slate-300 font-medium truncate max-w-xs" title={paper.journal}>
                {paper.journal}
              </span>
            )}
            {paper.citation_count > 0 && (
              <span className="flex items-center gap-1 text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700/60">
                <Quote className="w-3 h-3 text-slate-400" />
                <span>{paper.citation_count} citations</span>
              </span>
            )}
            {paper.open_access_url && (
              <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 px-1.5 py-0.5 rounded">
                Open Access
              </span>
            )}
            {paper.has_summary && (
              <span className="flex items-center gap-1 text-[11px] font-medium text-indigo-400 bg-indigo-950/50 border border-indigo-800/50 px-1.5 py-0.5 rounded">
                <Sparkles className="w-3 h-3" />
                <span>AI Analyzed</span>
              </span>
            )}
          </div>

          {/* Paper Title */}
          <h3 
            onClick={() => onOpenDetails(paper)}
            className="text-base font-semibold text-slate-100 hover:text-teal-300 transition-colors cursor-pointer leading-snug"
          >
            {paper.title}
          </h3>

          {/* Authors */}
          <p className="text-xs text-slate-400 mt-1 line-clamp-1">
            {authorsList}
          </p>

          {/* Abstract Snippet */}
          {paper.abstract && (
            <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
              {paper.abstract}
            </p>
          )}

          {/* Categories / Tags */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3">
            {paper.categories?.slice(0, 4).map(cat => (
              <span 
                key={cat.id || cat.slug}
                className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700"
              >
                {cat.category_name}
              </span>
            ))}
            {paper.categories?.length > 4 && (
              <span className="text-[10px] text-slate-400">
                +{paper.categories.length - 4} more
              </span>
            )}
          </div>

          {/* Bottom Action Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-800/80">
            {/* Quick Actions (DOI, Details, AI Summary) */}
            <div className="flex items-center gap-2">
              {doiUrl && (
                <a
                  href={doiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-teal-400 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>DOI</span>
                </a>
              )}
              <button
                onClick={() => onOpenDetails(paper)}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors ml-2"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Details</span>
              </button>
              <button
                onClick={() => onOpenSummary(paper)}
                className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors ml-2 font-medium"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{paper.has_summary ? 'View Summary' : 'AI Summary'}</span>
              </button>
            </div>

            {/* Research Management (Screening, Status, Favourite) */}
            <div className="flex items-center gap-2">
              {/* Systematic Screening decision buttons */}
              <div className="flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700/80 text-xs">
                <button
                  onClick={() => onUpdateScreening && onUpdateScreening(paper.id, 'included')}
                  title="Screen: Include in Systematic Review"
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    paper.screening_status === 'included' 
                      ? 'bg-emerald-600 text-white font-medium' 
                      : 'text-slate-400 hover:text-emerald-300'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onUpdateScreening && onUpdateScreening(paper.id, 'maybe')}
                  title="Screen: Maybe / Ambiguous"
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    paper.screening_status === 'maybe' 
                      ? 'bg-amber-600 text-white font-medium' 
                      : 'text-slate-400 hover:text-amber-300'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onUpdateScreening && onUpdateScreening(paper.id, 'excluded')}
                  title="Screen: Exclude"
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    paper.screening_status === 'excluded' 
                      ? 'bg-rose-600 text-white font-medium' 
                      : 'text-slate-400 hover:text-rose-300'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Reading Status Pill */}
              <select
                value={paper.reading_status || 'unread'}
                onChange={(e) => onUpdateReadingStatus && onUpdateReadingStatus(paper.id, e.target.value)}
                className="bg-slate-800 text-slate-300 border border-slate-700 text-[11px] rounded-lg px-2 py-1 focus:outline-none focus:border-teal-500 cursor-pointer"
              >
                <option value="unread">Unread</option>
                <option value="in_progress">Reading</option>
                <option value="completed">Completed</option>
              </select>

              {/* Favourite Star */}
              <button
                onClick={() => onToggleFavourite && onToggleFavourite(paper.id, !paper.is_favourite)}
                title={paper.is_favourite ? 'Remove from favourites' : 'Add to favourites'}
                className="p-1 text-slate-400 hover:text-amber-400 transition-colors"
              >
                <Star className={`w-4 h-4 ${paper.is_favourite ? 'fill-amber-400 text-amber-400' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
