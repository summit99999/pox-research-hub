import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ExternalLink, 
  Copy, 
  Check, 
  Bookmark, 
  Star, 
  Calendar, 
  BookOpen, 
  Sparkles, 
  ShieldCheck, 
  Boxes, 
  AlertCircle, 
  Quote, 
  FileText, 
  Image as ImageIcon, 
  Layers, 
  Share2, 
  Building2, 
  CheckCircle2, 
  FlaskConical, 
  RefreshCw 
} from 'lucide-react';
import { api } from '../lib/api';
import { getOfficialPublisherUrl, formatDoiDisplay, cleanDoi } from '../lib/doiHelper';
import { getJournalImpactFactor } from '../lib/journalMeta';
import { CLASSIFICATION_CATEGORIES } from '../lib/polymerClassifier';
import PaperTOC from '../components/PaperTOC';
import AISummaryViewer from '../components/AISummaryViewer';

export default function ArticleDetailView({ 
  articleId, 
  onBack, 
  onNavigateToJournal,
  onNavigateToSearch,
  onToggleFavourite,
  onUpdateReadingStatus,
  onUpdateScreening 
}) {
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'toc' | 'summary'
  const [copiedDoi, setCopiedDoi] = useState(false);
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [citationFormat, setCitationFormat] = useState('apa'); // 'apa' | 'bibtex' | 'ris'
  const [isSaved, setIsSaved] = useState(false);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    loadArticle();
  }, [articleId]);

  const loadArticle = async () => {
    if (!articleId) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setNotFound(false);

    try {
      const data = await api.getPaper(articleId);
      if (data) {
        setPaper(data);
        setIsSaved(Boolean(data.is_saved));
        setIsFav(Boolean(data.is_favourite));
      } else {
        setNotFound(true);
      }
    } catch (err) {
      console.error('Failed to load article details:', err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const publisherUrl = getOfficialPublisherUrl(paper);
  const displayDoi = formatDoiDisplay(paper?.doi);
  const impactFactor = getJournalImpactFactor(paper?.journal);

  const handleCopyDoi = () => {
    if (!paper?.doi) return;
    navigator.clipboard.writeText(paper.doi);
    setCopiedDoi(true);
    setTimeout(() => setCopiedDoi(false), 2000);
  };

  const handleCopyCitation = () => {
    if (!paper) return;
    let citation = '';
    const authors = (paper.authors || []).map(a => a.name).join(', ') || 'Anonymous';
    const year = paper.publication_year || new Date().getFullYear();
    const title = paper.title || 'Untitled';
    const journal = paper.journal || 'Journal';
    const doi = paper.doi ? `https://doi.org/${paper.doi}` : '';

    if (citationFormat === 'apa') {
      citation = `${authors} (${year}). ${title}. ${journal}. ${doi}`;
    } else if (citationFormat === 'bibtex') {
      const citeKey = `${(paper.authors?.[0]?.name || 'Author').split(' ')[0].toLowerCase()}${year}${title.slice(0, 5).replace(/[^a-zA-Z]/g, '')}`;
      citation = `@article{${citeKey},\n  title={${title}},\n  author={${authors}},\n  journal={${journal}},\n  year={${year}},\n  doi={${paper.doi || ''}}\n}`;
    } else if (citationFormat === 'ris') {
      citation = `TY  - JOUR\nTI  - ${title}\nAU  - ${authors.replace(/, /g, '\nAU  - ')}\nJO  - ${journal}\nPY  - ${year}\nDO  - ${paper.doi || ''}\nER  - `;
    }

    navigator.clipboard.writeText(citation);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
  };

  const handleToggleSave = async () => {
    if (!paper) return;
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    try {
      await api.updateLibrary(paper.id, { saved: nextSaved });
    } catch (e) {
      console.debug('Failed to update library', e);
    }
  };

  const handleToggleFav = async () => {
    if (!paper) return;
    const nextFav = !isFav;
    setIsFav(nextFav);
    if (onToggleFavourite) {
      onToggleFavourite(paper.id, nextFav);
    }
  };

  // =========================================================================
  // LOADING STATE
  // =========================================================================
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 py-8">
        <div className="h-6 w-48 bg-slate-800 rounded-lg animate-pulse" />
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 animate-pulse">
          <div className="h-4 bg-slate-800 rounded w-1/3" />
          <div className="h-8 bg-slate-800 rounded w-4/5" />
          <div className="h-4 bg-slate-800 rounded w-2/5" />
          <div className="h-24 bg-slate-800/60 rounded-2xl w-full" />
        </div>
      </div>
    );
  }

  // =========================================================================
  // 404 NOT FOUND STATE
  // =========================================================================
  if (notFound || !paper) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16 px-4 space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-100">Publication Not Found</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
          The requested article identifier (<code className="font-mono text-teal-300 bg-slate-800 px-1.5 py-0.5 rounded">{articleId}</code>) could not be located in the local corpus, cached journal feeds, or remote database.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Go Back</span>
            </button>
          )}
          {onNavigateToJournal && (
            <button
              onClick={() => onNavigateToJournal(null)}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Browse Monitored Journals</span>
            </button>
          )}
          {onNavigateToSearch && (
            <button
              onClick={() => onNavigateToSearch('')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
            >
              <span>Search All Literature</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // ARTICLE DETAIL FULL PAGE VIEW
  // =========================================================================
  const authorsList = paper.authors || [];
  const onlineDate = paper.online_publication_date || paper.publication_date || 'Unavailable';
  const printDate = paper.print_publication_date || 'Unavailable';
  const issueDate = paper.issue_publication_date || 'Pending regular issue assignment';
  const articleType = paper.article_type || (paper.is_asap ? 'ASAP Publication' : 'Research Article');

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Breadcrumb Navigation & Top Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium flex-wrap">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1 text-teal-400 hover:text-teal-300 font-semibold mr-2 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}

          {paper.journal && onNavigateToJournal ? (
            <button
              onClick={() => onNavigateToJournal(paper.journal_id || paper.journal)}
              className="text-slate-300 hover:text-teal-300 hover:underline transition-colors"
            >
              {paper.journal}
            </button>
          ) : (
            <span>{paper.journal || 'Journal'}</span>
          )}

          <span className="text-slate-600">/</span>
          <span className="text-slate-300 truncate max-w-xs font-semibold">
            {paper.title}
          </span>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Official Publisher Link */}
          {publisherUrl ? (
            <a
              href={publisherUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-md transition-all group"
              title="Open official publisher article page in a new tab"
            >
              <span>Open Publisher Article</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          ) : (
            <button
              disabled
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-500 border border-slate-700/60 text-xs font-medium cursor-not-allowed"
              title="Official publisher article URL is unavailable for this record"
            >
              <span>Publisher Link Unavailable</span>
            </button>
          )}

          {/* Save / Library Toggle */}
          <button
            onClick={handleToggleSave}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              isSaved
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                : 'bg-slate-800/90 hover:bg-slate-750 text-slate-300 border-slate-700'
            }`}
            title={isSaved ? 'Saved in personal library' : 'Save article to library'}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>

          {/* Favourite Star */}
          <button
            onClick={handleToggleFav}
            className={`p-2 rounded-xl border transition-colors ${
              isFav 
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-400' 
                : 'bg-slate-800/90 border-slate-700 text-slate-400 hover:text-amber-400'
            }`}
            title={isFav ? 'Remove favourite' : 'Mark as favourite'}
          >
            <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Metadata Banner Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        {/* Badges Bar */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {paper.is_asap && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>ASAP / Online-First</span>
            </span>
          )}

          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-200 border border-slate-700">
            {articleType}
          </span>

          {paper.journal && (
            <div className="flex items-center gap-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-teal-300 border border-slate-700">
                {paper.journal}
              </span>
              {impactFactor && (
                <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold text-[10px]">
                  IF {impactFactor}
                </span>
              )}
            </div>
          )}

          {paper.publisher && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-slate-400 bg-slate-800/80 border border-slate-700/60 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-slate-400" />
              <span>{paper.publisher}</span>
            </span>
          )}

          {paper.citation_count > 0 && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono text-[11px] border border-slate-700">
              <Quote className="w-3 h-3 text-slate-400" />
              <span>{paper.citation_count} citations</span>
            </span>
          )}
        </div>

        {/* Article Full Title */}
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-100 tracking-tight leading-snug">
          {paper.title}
        </h1>

        {/* Authors with Affiliations */}
        <div className="space-y-1.5 pt-1">
          <div className="text-xs sm:text-sm text-slate-300 font-medium flex flex-wrap gap-x-3 gap-y-1">
            {authorsList.map((auth, idx) => (
              <span key={idx} className="hover:text-teal-300 transition-colors">
                {auth.name || auth.author || 'Author'}
                {idx < authorsList.length - 1 ? ',' : ''}
              </span>
            ))}
          </div>
          {authorsList.some(a => a.affiliation) && (
            <p className="text-[11px] text-slate-400 italic line-clamp-2">
              {authorsList.map(a => a.affiliation).filter(Boolean).filter((v, i, arr) => arr.indexOf(v) === i).join(' · ')}
            </p>
          )}
        </div>

        {/* Publication Dates and DOI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800/80 text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Online Publication</span>
            <span className="font-mono text-slate-200 font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-teal-400" />
              <span>{onlineDate}</span>
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Print / Issue</span>
            <span className="font-mono text-slate-300 block truncate">
              {printDate !== 'Unavailable' ? printDate : issueDate}
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Verified DOI</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-teal-300 truncate text-[11px]">
                {displayDoi || 'Unavailable'}
              </span>
              {displayDoi && (
                <button
                  type="button"
                  onClick={handleCopyDoi}
                  className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Copy DOI string"
                >
                  {copiedDoi ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation (Overview & Abstract, TOC / Graphical Abstract, AI Summary) */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'overview'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Overview & Taxonomy</span>
        </button>

        <button
          onClick={() => setActiveTab('toc')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'toc'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>TOC / Graphical Abstract</span>
        </button>

        <button
          onClick={() => setActiveTab('summary')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'summary'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI 13-Section Summary</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & TAXONOMY */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Abstract Section */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-400" />
              <span>Abstract</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              {paper.abstract || 'No abstract text available for this publication record.'}
            </p>
          </div>

          {/* Polymer Taxonomy & Evidence Classification Card */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Polymer Science Classification & Inclusion Evidence</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-full font-semibold">
                Confidence: {(paper.polymer_confidence || 'High').toUpperCase()}
              </span>
            </div>

            {/* Relevance Rationale & Evidence Quote */}
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Why this paper was selected
                </span>
                <p className="text-slate-200 leading-relaxed bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
                  {paper.relevance_reason || 'Investigates macromolecular structure, synthesis kinetics, or polymeric material applications.'}
                </p>
              </div>

              {paper.evidence_phrase && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Verbatim Text Evidence
                  </span>
                  <div className="p-3 rounded-xl bg-slate-950 border border-teal-500/30 text-teal-200 italic flex items-start gap-2.5 font-sans">
                    <Quote className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span>"{paper.evidence_phrase}"</span>
                  </div>
                </div>
              )}
            </div>

            {/* Identified Taxonomy Dimensions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Polymer Family</span>
                <span className="font-semibold text-teal-300 mt-1 block">
                  {paper.polymer_family || 'Macromolecular Platform'}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Polymerization Method</span>
                <span className="font-semibold text-indigo-300 mt-1 block">
                  {paper.polymerization_method || 'Unavailable'}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Application Domain</span>
                <span className="font-semibold text-purple-300 mt-1 block">
                  {paper.polymer_application || 'Polymer Science Research'}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Property / Mechanism</span>
                <span className="font-semibold text-emerald-300 mt-1 block">
                  {paper.polymer_property || 'Material Characterization'}
                </span>
              </div>
            </div>

            {/* Topic Tags */}
            {paper.polymer_topics && paper.polymer_topics.length > 0 && (
              <div className="pt-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                  Taxonomy Topic Tags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {paper.polymer_topics.map((t, i) => (
                    <span key={i} className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Data Source Provenance */}
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-mono flex items-center justify-between">
              <span>Source Provenance: {(paper.provenance || ['Crossref / OpenAlex']).join(' · ')}</span>
              <span>Collected: {paper.collected_at ? new Date(paper.collected_at).toLocaleDateString() : 'Active Index'}</span>
            </div>
          </div>

          {/* Citation Generator Bar */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Quote className="w-3.5 h-3.5 text-teal-400" />
                <span>Export Citation</span>
              </span>

              <div className="flex items-center bg-slate-800 rounded-lg p-0.5 text-xs font-mono">
                {['apa', 'bibtex', 'ris'].map(fmt => (
                  <button
                    key={fmt}
                    onClick={() => setCitationFormat(fmt)}
                    className={`px-2.5 py-0.5 rounded uppercase text-[10px] font-semibold transition-colors ${
                      citationFormat === fmt 
                        ? 'bg-teal-600 text-white shadow-sm' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 truncate">
                {citationFormat === 'apa' 
                  ? `${(paper.authors || []).map(a => a.name).join(', ') || 'Author'} (${paper.publication_year || 2026}). ${paper.title}. ${paper.journal}.`
                  : `@article{${paper.id || 'citeKey'}, title={${paper.title}}, year={${paper.publication_year}}...}`}
              </div>
              <button
                onClick={handleCopyCitation}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0"
              >
                {copiedCitation ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCitation ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TOC / GRAPHICAL ABSTRACT */}
      {activeTab === 'toc' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <PaperTOC paper={paper} />
        </div>
      )}

      {/* TAB 3: AI RESEARCH SUMMARY */}
      {activeTab === 'summary' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <AISummaryViewer paper={paper} />
        </div>
      )}
    </div>
  );
}
