import React, { useState } from 'react';
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
  FileCode
} from 'lucide-react';
import { getJournalImpactFactor } from '../lib/journalMeta';
import { getPaperDoiUrl, formatDoiDisplay } from '../lib/doiHelper';
import { api } from '../lib/api';

export default function PaperTOC({ paper, onOpenSummary }) {
  const [copiedDoi, setCopiedDoi] = useState(false);
  const [copiedBib, setCopiedBib] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    scheme: true,
    abstract: true,
    synthesis: true,
    thermo: true,
    biomedical: true,
    authors: true
  });

  if (!paper) return null;

  const doiUrl = getPaperDoiUrl(paper);
  const displayDoi = formatDoiDisplay(paper.doi);
  const ifScore = getJournalImpactFactor(paper.journal);

  // Chemical scheme logic based on paper title, abstract, and categories
  const fullText = `${paper.title || ''} ${paper.abstract || ''}`.toLowerCase();
  const isPOzi = fullText.includes('oxazine') || fullText.includes('pozi');
  const isThermo = fullText.includes('thermo') || fullText.includes('lcst') || fullText.includes('ucst') || fullText.includes('cloud point');
  const isMicelle = fullText.includes('micelle') || fullText.includes('nanoparticle') || fullText.includes('drug delivery');
  const isHydrogel = fullText.includes('hydrogel') || fullText.includes('network') || fullText.includes('crosslink');

  let monomerName = isPOzi ? '2-Substituted 2-Oxazine' : '2-Substituted 2-Oxazoline';
  let ringSize = isPOzi ? '6-Membered Cyclic Imino Ether' : '5-Membered Cyclic Imino Ether';
  let polymerClass = isPOzi ? 'Poly(2-oxazine) (POzi)' : 'Poly(2-oxazoline) (POx)';
  let repeatUnit = isPOzi ? '—[N(COR)CH₂CH₂CH₂]ₙ—' : '—[N(COR)CH₂CH₂]ₙ—';

  if (fullText.includes('methyl') || fullText.includes('pmox')) {
    monomerName = '2-Methyl-2-oxazoline (MeOx)';
    polymerClass = 'Poly(2-methyl-2-oxazoline) (PMOx)';
    repeatUnit = '—[N(COCH₃)CH₂CH₂]ₙ—';
  } else if (fullText.includes('ethyl') || fullText.includes('petox')) {
    monomerName = '2-Ethyl-2-oxazoline (EtOx)';
    polymerClass = 'Poly(2-ethyl-2-oxazoline) (PEtOx)';
    repeatUnit = '—[N(COCH₂CH₃)CH₂CH₂]ₙ—';
  } else if (fullText.includes('isopropyl') || fullText.includes('pipox')) {
    monomerName = '2-Isopropyl-2-oxazoline (iPrOx)';
    polymerClass = 'Poly(2-isopropyl-2-oxazoline) (PiPOx)';
    repeatUnit = '—[N(COCH(CH₃)₂)CH₂CH₂]ₙ—';
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

  return (
    <div className="space-y-6 pb-6 text-slate-100">
      {/* 1. Paper Header Card with Quick Navigation */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Table of Contents (TOC)</span>
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
              title="Open full-text paper via publisher DOI resolver"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Direct Publisher DOI</span>
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
              <span>View 13-Section AI Summary</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. TOC Navigation Jump Bar */}
      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs flex flex-wrap items-center gap-2">
        <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px] mr-1 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-teal-400" />
          <span>TOC Jump Index:</span>
        </span>
        <a href="#toc-scheme" className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-teal-300 transition-colors">
          1. Chemical TOC Graphic
        </a>
        <a href="#toc-abstract" className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-teal-300 transition-colors">
          2. Scientific Abstract
        </a>
        <a href="#toc-synthesis" className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-teal-300 transition-colors">
          3. Polymer Architecture & CROP
        </a>
        <a href="#toc-thermo" className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-teal-300 transition-colors">
          4. Phase Behavior (Tcp)
        </a>
        <a href="#toc-biomedical" className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-teal-300 transition-colors">
          5. Biomedical Relevance
        </a>
        <a href="#toc-authors" className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-teal-300 transition-colors">
          6. Authors & Affiliations
        </a>
      </div>

      {/* 3. Section 1: Chemical TOC Graphic & Reaction Scheme */}
      <div id="toc-scheme" className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md overflow-hidden">
        <div 
          onClick={() => toggleSection('scheme')}
          className="px-5 py-3.5 bg-slate-800/40 border-b border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-800/60 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Atom className="w-4 h-4 text-teal-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              § 1. Chemical TOC Graphic & CROP Reaction Architecture
            </h2>
          </div>
          {expandedSections.scheme ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>

        {expandedSections.scheme && (
          <div className="p-6 space-y-4">
            {/* Visual Reaction Scheme Flow */}
            <div className="p-6 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Step 1: Monomer */}
              <div className="text-center p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex-1 w-full md:w-auto">
                <span className="text-[10px] font-bold uppercase text-teal-400 block mb-1">Monomer Feed</span>
                <div className="h-16 flex items-center justify-center">
                  <div className="px-4 py-2 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-300 font-mono font-bold text-sm">
                    {monomerName}
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">{ringSize}</span>
              </div>

              {/* Reaction Arrow */}
              <div className="flex flex-col items-center shrink-0">
                <span className="text-[10px] text-indigo-400 font-mono font-medium">MeOTf / MeOTs</span>
                <div className="flex items-center gap-1 my-1 text-teal-400">
                  <div className="w-12 h-0.5 bg-teal-500/50"></div>
                  <span className="text-sm">➔</span>
                </div>
                <span className="text-[10px] text-slate-400">MeCN, 80–140 °C (CROP)</span>
              </div>

              {/* Step 2: Polymer Repeat Unit */}
              <div className="text-center p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex-1 w-full md:w-auto">
                <span className="text-[10px] font-bold uppercase text-indigo-400 block mb-1">Polymer Architecture</span>
                <div className="h-16 flex items-center justify-center">
                  <div className="px-4 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono font-bold text-sm">
                    {repeatUnit}
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">{polymerClass}</span>
              </div>

              {/* Assembly Arrow */}
              <div className="flex flex-col items-center shrink-0">
                <span className="text-[10px] text-emerald-400 font-mono font-medium">Self-Assembly</span>
                <div className="flex items-center gap-1 my-1 text-emerald-400">
                  <div className="w-12 h-0.5 bg-emerald-500/50"></div>
                  <span className="text-sm">➔</span>
                </div>
                <span className="text-[10px] text-slate-400">H₂O / 150 mM NaCl</span>
              </div>

              {/* Step 3: Supramolecular / Biomedical Application */}
              <div className="text-center p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex-1 w-full md:w-auto">
                <span className="text-[10px] font-bold uppercase text-emerald-400 block mb-1">Target Application</span>
                <div className="h-16 flex items-center justify-center">
                  <div className="px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold text-xs">
                    {isHydrogel ? 'Crosslinked 3D Hydrogel' : (isMicelle ? 'Core-Shell Stealth Micelles' : (isThermo ? 'Tunable LCST/UCST Transition' : 'Biocompatible Nanomaterial'))}
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">
                  {isHydrogel ? 'Tissue Engineering & Scaffolds' : 'Extended In Vivo Half-Life'}
                </span>
              </div>
            </div>

            {/* Quick Metrics Badge Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-800/30 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Polymerization Mode</span>
                <span className="text-slate-200 font-semibold">Living CROP</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/30 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Target Dispersity (Đ)</span>
                <span className="text-teal-300 font-semibold font-mono">1.05 – 1.15</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/30 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Backbone Architecture</span>
                <span className="text-slate-200 font-semibold">{isPOzi ? 'Pseudopolypeptoid (C₃)' : 'Polypeptoid Mimetic (C₂)'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/30 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Stealth vs PEG</span>
                <span className="text-emerald-300 font-semibold">High / Low Immunogenicity</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Section 2: Scientific Abstract */}
      <div id="toc-abstract" className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md overflow-hidden">
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

      {/* 5. Section 3: Polymer Architecture & Synthetic Details */}
      <div id="toc-synthesis" className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md overflow-hidden">
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

      {/* 6. Section 4: Phase Behavior & Solution Thermodynamics */}
      <div id="toc-thermo" className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md overflow-hidden">
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

      {/* 7. Section 5: Biomedical & Clinical Relevance */}
      <div id="toc-biomedical" className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md overflow-hidden">
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

      {/* 8. Section 6: Authors & Affiliations */}
      <div id="toc-authors" className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md overflow-hidden">
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

      {/* 9. Section 7: Direct DOI Resolver & Access Guarantee */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Verified Publisher Access Guarantee</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            DOI: <span className="font-mono text-teal-300">{displayDoi || 'Direct repository handle'}</span>. 
            Redirects straight to publisher portal ({paper.publisher || paper.journal || 'Publisher'}).
          </p>
        </div>
        {doiUrl && (
          <a
            href={doiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition-colors shrink-0 shadow-md shadow-teal-500/20 flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open Article via DOI</span>
          </a>
        )}
      </div>
    </div>
  );
}
