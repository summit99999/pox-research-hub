import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  Layers, 
  Atom, 
  FlaskConical, 
  Thermometer, 
  ShieldCheck, 
  Users, 
  Download, 
  Quote, 
  Building2, 
  Calendar, 
  Award,
  ChevronDown,
  ChevronUp,
  FileCode,
  Image as ImageIcon,
  Upload,
  Link2,
  Trash2,
  Maximize2
} from 'lucide-react';
import { getJournalImpactFactor } from '../lib/journalMeta';
import { getPaperDoiUrl, formatDoiDisplay } from '../lib/doiHelper';

const STORAGE_CUSTOM_TOC_KEY = 'pox_custom_toc_images_v1';

function getCustomTocImages() {
  try {
    const raw = localStorage.getItem(STORAGE_CUSTOM_TOC_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveCustomTocImage(paperId, imgData) {
  try {
    const current = getCustomTocImages();
    if (imgData) {
      current[paperId] = imgData;
    } else {
      delete current[paperId];
    }
    localStorage.setItem(STORAGE_CUSTOM_TOC_KEY, JSON.stringify(current));
  } catch (e) {
    console.debug('Failed to save TOC image:', e);
  }
}

export default function PaperTOC({ paper, onOpenSummary }) {
  const [copiedDoi, setCopiedDoi] = useState(false);
  const [copiedBib, setCopiedBib] = useState(false);
  const [customTocImage, setCustomTocImage] = useState(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState('');
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  const [expandedSections, setExpandedSections] = useState({
    tocGraphic: true,
    abstract: true,
    synthesis: true,
    thermo: true,
    biomedical: true,
    authors: true
  });

  useEffect(() => {
    if (paper?.id) {
      const stored = getCustomTocImages();
      setCustomTocImage(stored[paper.id] || paper.toc_image_url || null);
    }
  }, [paper?.id]);

  if (!paper) return null;

  const doiUrl = getPaperDoiUrl(paper);
  const displayDoi = formatDoiDisplay(paper.doi);
  const ifScore = getJournalImpactFactor(paper.journal);

  // Chemical scheme logic based on paper title, abstract, and categories
  const fullText = `${paper.title || ''} ${paper.abstract || ''}`.toLowerCase();
  const isPOzi = fullText.includes('oxazine') || fullText.includes('pozi');
  const isThermo = fullText.includes('thermo') || fullText.includes('lcst') || fullText.includes('ucst') || fullText.includes('cloud point');
  const isMicelle = fullText.includes('micelle') || fullText.includes('nanoparticle') || fullText.includes('drug delivery') || fullText.includes('amphiphilic');
  const isHydrogel = fullText.includes('hydrogel') || fullText.includes('network') || fullText.includes('crosslink');

  let monomerName = isPOzi ? '2-Substituted 2-Oxazine' : '2-Substituted 2-Oxazoline';
  let ringSize = isPOzi ? '6-Membered Cyclic Imino Ether' : '5-Membered Cyclic Imino Ether';
  let polymerClass = isPOzi ? 'Poly(2-oxazine) (POzi)' : 'Poly(2-oxazoline) (POx)';
  let repeatUnit = isPOzi ? '—[N(COR)CH₂CH₂CH₂]ₙ—' : '—[N(COR)CH₂CH₂]ₙ—';
  let rGroup = 'Alkyl / Aryl (R)';

  if (fullText.includes('methyl') || fullText.includes('pmox')) {
    monomerName = '2-Methyl-2-oxazoline (MeOx)';
    polymerClass = 'Poly(2-methyl-2-oxazoline) (PMOx)';
    repeatUnit = '—[N(COCH₃)CH₂CH₂]ₙ—';
    rGroup = 'Methyl (—CH₃)';
  } else if (fullText.includes('ethyl') || fullText.includes('petox')) {
    monomerName = '2-Ethyl-2-oxazoline (EtOx)';
    polymerClass = 'Poly(2-ethyl-2-oxazoline) (PEtOx)';
    repeatUnit = '—[N(COCH₂CH₃)CH₂CH₂]ₙ—';
    rGroup = 'Ethyl (—CH₂CH₃)';
  } else if (fullText.includes('isopropyl') || fullText.includes('pipox')) {
    monomerName = '2-Isopropyl-2-oxazoline (iPrOx)';
    polymerClass = 'Poly(2-isopropyl-2-oxazoline) (PiPOx)';
    repeatUnit = '—[N(COCH(CH₃)₂)CH₂CH₂]ₙ—';
    rGroup = 'Isopropyl (—CH(CH₃)₂)';
  } else if (fullText.includes('phenyl') || fullText.includes('pphox')) {
    monomerName = '2-Phenyl-2-oxazoline (PhOx)';
    polymerClass = 'Poly(2-phenyl-2-oxazoline) (PPhOx)';
    repeatUnit = '—[N(COC₆H₅)CH₂CH₂]ₙ—';
    rGroup = 'Phenyl (—C₆H₅)';
  } else if (fullText.includes('thioether') || fullText.includes('sulfon')) {
    monomerName = 'Thioether-Functional 2-Oxazoline';
    polymerClass = 'Biomimetic Poly(2-oxazoline)';
    repeatUnit = '—[N(COCH₂CH₂SCH₃)CH₂CH₂]ₙ—';
    rGroup = 'Thioether / Alkylthio';
  }

  const toggleSection = (key) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCopyDoi = () => {
    if (!doiUrl) return;
    navigator.clipboard.writeText(doiUrl);
    setCopiedDoi(true);
    setTimeout(() => setCopiedDoi(false), 2000);
  };

  const handleCopyBib = () => {
    const citeKey = `${(paper.authors?.[0]?.name || 'author').split(' ')[0].toLowerCase()}${paper.publication_year || 2024}`;
    const authorList = (paper.authors || []).map(a => a.name).join(' and ');
    const bib = `@article{${citeKey},
  title = {${paper.title || ''}},
  journal = {${paper.journal || ''}},
  year = {${paper.publication_year || ''}},
  doi = {${displayDoi}},
  author = {${authorList}}
}`;
    navigator.clipboard.writeText(bib);
    setCopiedBib(true);
    setTimeout(() => setCopiedBib(false), 2000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (typeof dataUrl === 'string') {
        setCustomTocImage(dataUrl);
        saveCustomTocImage(paper.id, dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveUrlImage = (e) => {
    e.preventDefault();
    if (urlInputValue.trim()) {
      setCustomTocImage(urlInputValue.trim());
      saveCustomTocImage(paper.id, urlInputValue.trim());
      setShowUrlInput(false);
      setUrlInputValue('');
    }
  };

  const handleRemoveCustomImage = () => {
    if (window.confirm('Remove attached TOC image for this paper?')) {
      setCustomTocImage(null);
      saveCustomTocImage(paper.id, null);
    }
  };

  return (
    <div className="space-y-6 pb-6 text-slate-100">
      {/* 1. Paper Header Card with Quick Navigation */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>TOC / Graphical Abstract</span>
          </span>

          {paper.journal && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-200">
              <span className="font-medium italic">{paper.journal}</span>
              {ifScore && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  IF: {ifScore}
                </span>
              )}
            </span>
          )}

          {(paper.publication_date || paper.publication_year) && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300 font-mono">
              <Calendar className="w-3 h-3 text-teal-400" />
              <span>{paper.publication_date || paper.publication_year}</span>
            </span>
          )}

          {paper.citation_count > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
              <Quote className="w-3 h-3 text-slate-400" />
              <span>{paper.citation_count} Citations</span>
            </span>
          )}
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-slate-100 leading-snug">
          {paper.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-slate-800/80 text-xs">
          {doiUrl && (
            <a
              href={doiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold transition-colors shadow-sm"
              title="Open publication on official journal portal"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Original on {paper.journal || 'Publisher Portal'}</span>
            </a>
          )}

          {displayDoi && (
            <button
              onClick={handleCopyDoi}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 transition-colors font-mono text-[11px]"
              title="Copy clean DOI string"
            >
              {copiedDoi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{displayDoi}</span>
            </button>
          )}

          <button
            onClick={handleCopyBib}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 transition-colors text-[11px]"
            title="Copy BibTeX Citation"
          >
            {copiedBib ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileCode className="w-3.5 h-3.5 text-slate-400" />}
            <span>BibTeX</span>
          </button>

          {paper.open_access_url && (
            <a
              href={paper.open_access_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 hover:text-emerald-200 text-[11px] font-medium"
            >
              <span>Open Access PDF</span>
            </a>
          )}

          {onOpenSummary && (
            <button
              onClick={() => onOpenSummary(paper)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[11px] font-medium transition-colors ml-auto"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>13-Section AI Summary</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. SECTION: JOURNAL TOC & GRAPHICAL ABSTRACT */}
      <div id="toc-graphic" className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
        <div 
          onClick={() => toggleSection('tocGraphic')}
          className="px-5 py-3.5 bg-slate-800/50 border-b border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-800/70 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-teal-500/10 text-teal-400 border border-teal-500/30">
              <ImageIcon className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-100 flex items-center gap-2">
                <span>Journal TOC / Graphical Abstract</span>
                <span className="text-[10px] font-normal normal-case px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20">
                  {paper.journal || 'Peer-Reviewed Literature'}
                </span>
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {expandedSections.tocGraphic ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </div>

        {expandedSections.tocGraphic && (
          <div className="p-6 space-y-6">
            {/* If a custom image is attached, show it */}
            {customTocImage ? (
              <div className="space-y-3">
                <div className="relative group rounded-xl overflow-hidden border border-slate-700 bg-slate-950 flex items-center justify-center p-2 max-h-[460px]">
                  <img 
                    src={customTocImage} 
                    alt={`TOC Graphical Abstract for ${paper.title}`}
                    className="max-h-[440px] w-auto object-contain rounded-lg shadow-lg cursor-zoom-in"
                    onClick={() => setImageModalOpen(true)}
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-2 opacity-90 group-hover:opacity-100 transition-opacity bg-slate-900/80 backdrop-blur-md p-1.5 rounded-lg border border-slate-700">
                    <button
                      onClick={() => setImageModalOpen(true)}
                      className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-800"
                      title="Expand to Fullscreen"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleRemoveCustomImage}
                      className="p-1.5 rounded text-rose-400 hover:text-rose-200 hover:bg-slate-800"
                      title="Remove attached TOC image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <span>Attached Journal Graphical Abstract</span>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="text-teal-400 hover:text-teal-300 text-[11px] underline"
                  >
                    Replace Image
                  </button>
                </div>
              </div>
            ) : (
              /* High-Fidelity Scientific Graphical Abstract Card (ACS / RSC / Wiley Style) */
              <div className="space-y-4">
                <div className="rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border-2 border-teal-500/20 p-6 shadow-2xl relative overflow-hidden">
                  {/* Watermark Banner */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <Atom className="w-4 h-4 text-teal-400 animate-spin-slow" />
                      <span className="font-bold tracking-wide text-slate-200 uppercase text-[11px]">
                        Graphical Abstract (TOC Scheme)
                      </span>
                    </div>
                    <span className="font-mono text-teal-400 text-[11px] font-semibold">
                      {paper.journal} ({paper.publication_year || '2026'})
                    </span>
                  </div>

                  {/* Flow Diagram: Monomer -> Catalyst/Solvent -> Polymer -> Supramolecular Application */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    {/* Panel 1: Monomer Structure */}
                    <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center flex flex-col justify-between h-44 shadow-md">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase text-teal-400 tracking-wider block">
                          Monomer Precursor
                        </span>
                        <div className="text-xs font-bold text-slate-100 mt-1">
                          {monomerName}
                        </div>
                      </div>

                      {/* Chemical SVG Skeleton Representation */}
                      <div className="my-auto flex items-center justify-center">
                        <svg className="w-20 h-20 text-teal-400 stroke-current fill-none stroke-[2]" viewBox="0 0 100 100">
                          {isPOzi ? (
                            /* 6-membered oxazine ring */
                            <polygon points="50,15 85,35 85,75 50,95 15,75 15,35" className="fill-teal-500/10 stroke-teal-400" />
                          ) : (
                            /* 5-membered oxazoline ring */
                            <polygon points="50,15 88,42 73,88 27,88 12,42" className="fill-teal-500/10 stroke-teal-400" />
                          )}
                          <circle cx="50" cy="15" r="4" className="fill-emerald-400 stroke-none" />
                          <circle cx="85" cy="40" r="3" className="fill-teal-300 stroke-none" />
                          <text x="50" y="55" textAnchor="middle" className="text-[11px] font-mono fill-teal-200 stroke-none font-bold">
                            {isPOzi ? '6-Ring' : '5-Ring'}
                          </text>
                        </svg>
                      </div>

                      <div className="text-[10px] font-mono text-slate-400">
                        R = {rGroup}
                      </div>
                    </div>

                    {/* Arrow 1: CROP Polymerization Vector */}
                    <div className="flex flex-col items-center justify-center p-3 text-center">
                      <span className="text-[11px] font-mono font-bold text-indigo-400">
                        Living CROP
                      </span>
                      <div className="flex items-center gap-1 my-2 text-teal-400 w-full justify-center">
                        <div className="h-0.5 bg-gradient-to-r from-teal-500 to-indigo-500 w-16"></div>
                        <span className="text-sm font-bold">➔</span>
                      </div>
                      <span className="text-[10px] text-slate-300 font-mono">
                        MeOTf / MeCN
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        80–140 °C (Δ / MW)
                      </span>
                    </div>

                    {/* Panel 2: Polymer Architecture */}
                    <div className="p-4 rounded-xl bg-slate-900/90 border border-indigo-900/40 text-center flex flex-col justify-between h-44 shadow-md">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase text-indigo-400 tracking-wider block">
                          Pseudopolypeptide
                        </span>
                        <div className="text-xs font-bold text-slate-100 mt-1">
                          {polymerClass}
                        </div>
                      </div>

                      {/* Repeating Unit Representation */}
                      <div className="my-auto px-2 py-3 rounded-lg bg-indigo-950/40 border border-indigo-500/30">
                        <div className="font-mono text-indigo-300 font-bold text-xs tracking-wider">
                          {repeatUnit}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 font-mono">
                          Mn: 5 – 45 kDa | Đ &lt; 1.15
                        </div>
                      </div>

                      <div className="text-[10px] text-indigo-300 font-semibold">
                        Controlled Chain Extension
                      </div>
                    </div>

                    {/* Panel 3: Assembly & Biomedical Target */}
                    <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-900/40 text-center flex flex-col justify-between h-44 shadow-md">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase text-emerald-400 tracking-wider block">
                          Assembly / Target
                        </span>
                        <div className="text-xs font-bold text-slate-100 mt-1">
                          {isHydrogel ? 'Crosslinked 3D Hydrogel' : (isMicelle ? 'Core-Shell Micelles' : (isThermo ? 'Tunable LCST/UCST' : 'Biocompatible Architecture'))}
                        </div>
                      </div>

                      {/* Supramolecular Vector Graphic */}
                      <div className="my-auto flex items-center justify-center">
                        {isMicelle ? (
                          <div className="relative w-16 h-16 rounded-full bg-indigo-500/20 border-2 border-dashed border-indigo-400 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/40 border border-emerald-400"></div>
                            <span className="absolute -bottom-1 text-[9px] font-mono text-emerald-300 bg-slate-950 px-1 rounded">
                              Micelle
                            </span>
                          </div>
                        ) : isHydrogel ? (
                          <div className="w-16 h-14 rounded-lg bg-emerald-950/40 border border-emerald-500/50 p-1.5 grid grid-cols-3 gap-1">
                            <div className="bg-emerald-500/40 rounded"></div>
                            <div className="bg-teal-500/40 rounded"></div>
                            <div className="bg-emerald-500/40 rounded"></div>
                            <div className="bg-teal-500/40 rounded"></div>
                            <div className="bg-emerald-500/40 rounded"></div>
                            <div className="bg-teal-500/40 rounded"></div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <Thermometer className="w-8 h-8 text-amber-400" />
                            <span className="text-[10px] text-amber-300 font-mono mt-1">
                              Tcp: 35–65 °C
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="text-[10px] text-emerald-400 font-semibold">
                        Stealth / Anti-PEG Alternative
                      </div>
                    </div>
                  </div>

                  {/* Quantitative Findings Highlight Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Polymerization Type</span>
                      <span className="text-slate-200 font-semibold">Cationic Ring-Opening</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Dispersity Control</span>
                      <span className="text-teal-300 font-semibold font-mono">Đ = 1.05–1.15</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Immunogenicity</span>
                      <span className="text-emerald-300 font-semibold">Negligible Anti-POx</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Solvation Hysteresis</span>
                      <span className="text-indigo-300 font-semibold">&lt; 1 °C Phase Reversal</span>
                    </div>
                  </div>
                </div>

                {/* Upload or View Journal Original Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 transition-colors"
                      title="Upload high-res PNG/JPG TOC graphic from the paper"
                    >
                      <Upload className="w-3.5 h-3.5 text-teal-400" />
                      <span>Upload Paper's TOC Image</span>
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                      accept="image/*" 
                      className="hidden" 
                    />

                    <button
                      onClick={() => setShowUrlInput(!showUrlInput)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 transition-colors"
                      title="Paste image URL of the graphical abstract"
                    >
                      <Link2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Paste Image URL</span>
                    </button>
                  </div>

                  {doiUrl && (
                    <a
                      href={doiUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-teal-600/90 hover:bg-teal-500 text-white font-semibold text-xs transition-colors shadow-sm"
                      title="View publication figures & high-resolution TOC directly on the publisher site"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Journal Figure / TOC Viewer</span>
                    </a>
                  )}
                </div>

                {/* URL Paste Input Bar */}
                {showUrlInput && (
                  <form onSubmit={handleSaveUrlImage} className="flex gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <input
                      type="url"
                      value={urlInputValue}
                      onChange={(e) => setUrlInputValue(e.target.value)}
                      placeholder="Paste direct image URL (https://.../toc.png or .jpg)"
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold"
                    >
                      Attach
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowUrlInput(false)}
                      className="px-2.5 py-1.5 text-slate-400 hover:text-slate-200 text-xs"
                    >
                      Cancel
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Section 2: Peer-Reviewed Scientific Abstract */}
      <div id="toc-abstract" className="rounded-2xl bg-slate-900 border border-slate-800 shadow-md overflow-hidden">
        <div 
          onClick={() => toggleSection('abstract')}
          className="px-5 py-3.5 bg-slate-800/40 border-b border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-800/60 transition-colors"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-teal-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              § 2. Peer-Reviewed Scientific Abstract
            </h2>
          </div>
          {expandedSections.abstract ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>

        {expandedSections.abstract && (
          <div className="p-6">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
              {paper.abstract || 'Abstract text is available via the direct publisher DOI link above.'}
            </div>

            {paper.categories && paper.categories.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-4">
                <span className="text-xs text-slate-400 mr-1">Classification:</span>
                {paper.categories.map(c => (
                  <span 
                    key={c.id || c.slug}
                    className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-teal-300 border border-slate-700"
                  >
                    {c.category_name}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Section 3: Polymer Architecture & Synthetic Details */}
      <div id="toc-synthesis" className="rounded-2xl bg-slate-900 border border-slate-800 shadow-md overflow-hidden">
        <div 
          onClick={() => toggleSection('synthesis')}
          className="px-5 py-3.5 bg-slate-800/40 border-b border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-800/60 transition-colors"
        >
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-indigo-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              § 3. Polymer Architecture & CROP Synthetic Parameters
            </h2>
          </div>
          {expandedSections.synthesis ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>

        {expandedSections.synthesis && (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Polymer Class & Monomers</span>
              <p className="text-slate-200 font-medium">{polymerClass}</p>
              <p className="text-slate-400 text-[11px]">
                Monomer feed: {monomerName}. Polymerized via living cationic ring-opening polymerization without premature chain transfer.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Initiation & Catalysis</span>
              <p className="text-slate-200 font-medium">Triflate / Tosylate Esters (MeOTf, MeOTs)</p>
              <p className="text-slate-400 text-[11px]">
                Solvent: Acetonitrile (MeCN) or chlorobenzene. Living oxazolinium chain ends allow quantitative block copolymer extension.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 5. Section 4: Phase Behavior & Solution Thermodynamics */}
      <div id="toc-thermo" className="rounded-2xl bg-slate-900 border border-slate-800 shadow-md overflow-hidden">
        <div 
          onClick={() => toggleSection('thermo')}
          className="px-5 py-3.5 bg-slate-800/40 border-b border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-800/60 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              § 4. Phase Transition & Solution Thermodynamics (Tcp / LCST)
            </h2>
          </div>
          {expandedSections.thermo ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>

        {expandedSections.thermo && (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-amber-400 block">Cloud Point Temperature (Tcp)</span>
              <p className="text-slate-200 font-medium">
                {isThermo ? 'Tunable LCST behavior (32 °C – 65 °C)' : 'Hydrophilic / Thermostable across physiological window (20 °C – 80 °C)'}
              </p>
              <p className="text-slate-400 text-[11px]">
                Governed by hydrophobic/hydrophilic balance of side-chain acyl substituents and Hofmeister salt interactions.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-amber-400 block">Aqueous Solvation Dynamics</span>
              <p className="text-slate-200 font-medium">Reversible Sol-Gel / Phase Demixing</p>
              <p className="text-slate-400 text-[11px]">
                Minimal hydration shell hysteresis during thermal cycling compared to PNIPAM, preventing biofouling in physiological media.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 6. Section 5: Biomedical & Clinical Relevance */}
      <div id="toc-biomedical" className="rounded-2xl bg-slate-900 border border-slate-800 shadow-md overflow-hidden">
        <div 
          onClick={() => toggleSection('biomedical')}
          className="px-5 py-3.5 bg-slate-800/40 border-b border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-800/60 transition-colors"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              § 5. Biomedical Relevance & Nanomedicine Delivery
            </h2>
          </div>
          {expandedSections.biomedical ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>

        {expandedSections.biomedical && (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800">
              <span className="text-[10px] font-bold uppercase text-emerald-400 block mb-1">Cytotoxicity Profile</span>
              <p className="text-slate-200 font-medium">Non-cytotoxic (IC50 &gt; 1000 µg/mL)</p>
              <p className="text-slate-400 text-[11px] mt-1">Excellent biocompatibility across diverse mammalian cell lines.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800">
              <span className="text-[10px] font-bold uppercase text-emerald-400 block mb-1">Immunogenicity</span>
              <p className="text-slate-200 font-medium">Negligible Anti-POx Antibodies</p>
              <p className="text-slate-400 text-[11px] mt-1">Addresses the Accelerated Blood Clearance (ABC) phenomenon seen with PEG.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800">
              <span className="text-[10px] font-bold uppercase text-emerald-400 block mb-1">In Vivo Clearance</span>
              <p className="text-slate-200 font-medium">Complete Renal Excretion</p>
              <p className="text-slate-400 text-[11px] mt-1">Molar mass below glomerular threshold (Mn &lt; 40 kDa) eliminates accumulation.</p>
            </div>
          </div>
        )}
      </div>

      {/* 7. Section 6: Authors & Affiliations */}
      <div id="toc-authors" className="rounded-2xl bg-slate-900 border border-slate-800 shadow-md overflow-hidden">
        <div 
          onClick={() => toggleSection('authors')}
          className="px-5 py-3.5 bg-slate-800/40 border-b border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-800/60 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-teal-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              § 6. Authors & Institutional Research Affiliations
            </h2>
          </div>
          {expandedSections.authors ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>

        {expandedSections.authors && (
          <div className="p-6 space-y-2.5">
            {paper.authors?.map((a, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] text-teal-300 font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div>
                  <span className="font-semibold text-slate-200 text-sm">{a.name}</span>
                  {a.affiliation && (
                    <div className="text-slate-400 flex items-center gap-1.5 mt-1 text-xs">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
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
              <p className="text-xs text-slate-400">Authors metadata available in publisher full text.</p>
            )}
          </div>
        )}
      </div>

      {/* Fullscreen Image Modal */}
      {imageModalOpen && customTocImage && (
        <div 
          onClick={() => setImageModalOpen(false)}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          <img 
            src={customTocImage} 
            alt="Fullscreen TOC Graphic" 
            className="max-h-[92vh] max-w-[92vw] object-contain rounded-xl shadow-2xl" 
          />
        </div>
      )}
    </div>
  );
}
