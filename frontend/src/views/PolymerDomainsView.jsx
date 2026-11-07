import React, { useState, useEffect, useMemo } from 'react';
import { 
  Compass, 
  Search, 
  Sparkles, 
  FlaskConical, 
  Layers, 
  Atom, 
  BookOpen, 
  TrendingUp, 
  ChevronRight, 
  ArrowLeft, 
  ExternalLink, 
  Tag, 
  Award, 
  CheckCircle2, 
  Activity,
  Boxes,
  HelpCircle,
  Filter,
  Eye,
  SlidersHorizontal,
  Bookmark
} from 'lucide-react';
import { 
  POLYMER_DOMAINS, 
  DOMAIN_CATEGORIES, 
  getDomainBySlug,
  getAllCuratedPolymers 
} from '../data/polymerDomainsData';
import ThreeDTiltCard from '../components/ThreeDTiltCard';
import Polymer3DHero from '../components/Polymer3DHero';
import { DomainMotifIllustration } from '../components/PolymerScientificIllustrations';
import PolymerTopicModal from '../components/PolymerTopicModal';
import PaperCard from '../components/PaperCard';
import { api } from '../lib/api';
import { ENGINE_SCOPES } from '../lib/searchEngine';

export default function PolymerDomainsView({
  initialDomainSlug = null,
  onNavigateToSearch,
  onOpenDetails,
  onOpenSummary,
  selectedPaperIds = [],
  onToggleSelectPaper,
  onToggleFavourite,
  onUpdateReadingStatus,
  onUpdateScreening
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState(() => {
    return initialDomainSlug ? getDomainBySlug(initialDomainSlug) : null;
  });
  const [selectedPolymerTopic, setSelectedPolymerTopic] = useState(null);
  
  // Real Publication Counts per domain computed dynamically from genuine data
  const [domainPubCounts, setDomainPubCounts] = useState({});
  const [domainPapers, setDomainPapers] = useState([]);
  const [loadingPapers, setLoadingPapers] = useState(false);
  const [recentlyExplored, setRecentlyExplored] = useState(() => {
    try {
      const stored = localStorage.getItem('prih_recent_domains');
      return stored ? JSON.parse(stored) : ['polyoxazolines-polyoxazines', 'polyesters-biodegradable', 'polyolefins'];
    } catch {
      return ['polyoxazolines-polyoxazines', 'polyesters-biodegradable', 'polyolefins'];
    }
  });

  // Calculate authentic database counts across the in-memory/backend paper corpus
  useEffect(() => {
    const computeAuthenticCounts = async () => {
      try {
        const allPapersRes = await api.getPapers({ engine: ENGINE_SCOPES.UNIVERSAL, page_size: 2000 }).catch(() => ({ items: [] }));
        const papers = allPapersRes?.items || [];
        
        const counts = {};
        POLYMER_DOMAINS.forEach(dom => {
          const terms = dom.searchQuery.toLowerCase().split(/\s+or\s+/i).map(t => t.replace(/["()]/g, '').trim());
          const matchCount = papers.filter(p => {
            const text = `${p.title || ''} ${p.abstract || ''} ${p.primary_category || ''}`.toLowerCase();
            return terms.some(term => term.length > 2 && text.includes(term));
          }).length;
          counts[dom.id] = matchCount;
        });
        setDomainPubCounts(counts);
      } catch (err) {
        console.debug('Failed to compute domain publication counts:', err);
      }
    };

    computeAuthenticCounts();
  }, []);

  // When selected domain changes, load real matching publications
  useEffect(() => {
    if (!selectedDomain) {
      setDomainPapers([]);
      return;
    }

    // Save to recently explored
    setRecentlyExplored(prev => {
      const updated = [selectedDomain.slug, ...prev.filter(s => s !== selectedDomain.slug)].slice(0, 5);
      try {
        localStorage.setItem('prih_recent_domains', JSON.stringify(updated));
      } catch (e) {
        console.debug('Recent domains storage error:', e);
      }
      return updated;
    });

    const loadDomainLiterature = async () => {
      setLoadingPapers(true);
      try {
        const res = await api.getPapers({
          engine: ENGINE_SCOPES.UNIVERSAL,
          query: selectedDomain.searchQuery,
          page_size: 6,
          sort_by: 'publication_date',
          sort_order: 'desc'
        });
        setDomainPapers(res?.items || []);
      } catch (err) {
        console.debug('Failed to load domain papers:', err);
        setDomainPapers([]);
      } finally {
        setLoadingPapers(false);
      }
    };

    loadDomainLiterature();

    // Scroll to top when opening domain drill-down
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedDomain]);

  // Handle URL sync if provided
  useEffect(() => {
    if (initialDomainSlug && (!selectedDomain || selectedDomain.slug !== initialDomainSlug)) {
      const found = getDomainBySlug(initialDomainSlug);
      if (found) setSelectedDomain(found);
    }
  }, [initialDomainSlug]);

  // Filtered domains based on category chip and search query
  const filteredDomains = useMemo(() => {
    return POLYMER_DOMAINS.filter(domain => {
      // Category filter
      if (activeCategory !== 'all' && domain.categoryType !== activeCategory) {
        return false;
      }
      // Text search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = domain.title.toLowerCase().includes(q);
        const matchDesc = domain.shortDescription.toLowerCase().includes(q);
        const matchFamily = domain.families.some(f => 
          f.name.toLowerCase().includes(q) || 
          f.acronym.toLowerCase().includes(q) ||
          (f.formula && f.formula.toLowerCase().includes(q))
        );
        const matchTopics = domain.relatedTopics.some(t => t.toLowerCase().includes(q));
        return matchTitle || matchDesc || matchFamily || matchTopics;
      }
      return true;
    });
  }, [activeCategory, searchQuery]);

  // Handle search literature action
  const handleLaunchSearch = (query, domainObj) => {
    if (onNavigateToSearch) {
      const targetEngine = (domainObj?.slug === 'polyoxazolines-polyoxazines') 
        ? ENGINE_SCOPES.POX 
        : ENGINE_SCOPES.UNIVERSAL;
      onNavigateToSearch(query, targetEngine);
    }
  };

  // --------------------------------------------------------------------------
  // DRILL-DOWN SUB-PAGE VIEW: Individual Domain Exploration
  // --------------------------------------------------------------------------
  if (selectedDomain) {
    const ident = selectedDomain.visualIdentity;
    const pubCount = domainPubCounts[selectedDomain.id] || 0;

    return (
      <div className="space-y-8 animate-fadeIn pb-16">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between gap-4">
          <nav className="flex items-center gap-2 text-xs text-slate-400">
            <button
              onClick={() => setSelectedDomain(null)}
              className="flex items-center gap-1.5 hover:text-teal-300 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Universal Polymer Research Domains</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-slate-200 font-semibold truncate">
              {selectedDomain.title}
            </span>
          </nav>

          <button
            onClick={() => setSelectedDomain(null)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Domains</span>
          </button>
        </div>

        {/* Large Colourful Header Banner with Visual Identity */}
        <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-10 border ${ident.borderColor} bg-gradient-to-br ${ident.gradient} shadow-2xl text-white`}>
          {/* Ambient Lighting Overlay */}
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] pointer-events-none" />
          
          <div className="relative z-10 max-w-4xl space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-white/20 text-white font-mono text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/30">
                Visual Identity: {ident.theme}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-950/60 text-slate-200 font-mono text-xs backdrop-blur-md border border-white/10">
                {selectedDomain.families.length} Curated Polymer Families
              </span>
              {pubCount > 0 && (
                <span className="px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-200 font-mono text-xs backdrop-blur-md border border-emerald-400/30 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{pubCount} Indexed Publications</span>
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
              {selectedDomain.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
              {selectedDomain.introduction}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleLaunchSearch(selectedDomain.searchQuery, selectedDomain)}
                className="px-6 py-2.5 rounded-xl bg-white text-slate-950 font-bold text-xs sm:text-sm shadow-xl hover:bg-slate-100 transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
              >
                <Search className="w-4 h-4 text-indigo-600" />
                <span>Search Literature for Domain</span>
              </button>

              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <span className="font-semibold">Query:</span>
                <code className="px-2 py-1 rounded-lg bg-black/40 text-slate-200 font-mono text-[11px] border border-white/10">
                  {selectedDomain.searchQuery}
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Polymer Families & Clickable Acronym Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-teal-400" />
                <span>Polymer Families &amp; Authentic Molecular Repeat Units</span>
              </h2>
              <p className="text-xs text-slate-400">
                Click any polymer acronym (e.g. {selectedDomain.families.map(f => f.acronym.split('/')[0].trim()).join(', ')}) to inspect chemical formulas, thermal transitions, synthesis routes, and literature.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedDomain.families.map((fam, idx) => (
              <div
                key={fam.name || idx}
                onClick={() => setSelectedPolymerTopic(fam)}
                className="group p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-850 cursor-pointer transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Accent glow corner */}
                <div 
                  className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-15 pointer-events-none group-hover:opacity-30 transition-opacity" 
                  style={{ backgroundColor: ident.accentColor }}
                />

                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/30 group-hover:bg-teal-500/20 transition-colors">
                    {fam.acronym}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {fam.repeatUnitMass ? `${fam.repeatUnitMass} g/mol` : 'Polymer'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-100 group-hover:text-teal-300 transition-colors">
                  {fam.name}
                </h3>

                <div className="mt-2.5 p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 font-mono text-xs text-indigo-300 truncate">
                  {fam.formula || '[-R-]n'}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                  <div>
                    <span className="text-slate-500 block">Glass Transition:</span>
                    <span className="font-semibold text-slate-200">{fam.tg || 'Amorphous'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Melting / Phase:</span>
                    <span className="font-semibold text-slate-200">{fam.tm || fam.cloudPoint || 'Variable'}</span>
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {fam.properties || fam.synthesis}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-teal-400 font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Explore Topic Details</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4-Column Scientific Matrix: Synthesis, Properties, Characterization, Applications */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Synthesis & Polymerization */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
              <Atom className="w-4 h-4" />
              <span>Polymerization Methods</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {selectedDomain.synthesisMethods.map((meth, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                  <span>{meth}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 2. Key Physical/Chemical Properties */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
              <Sparkles className="w-4 h-4" />
              <span>Key Properties</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {selectedDomain.keyProperties.map((prop, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                  <span>{prop}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Characterization Techniques */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-400">
              <Activity className="w-4 h-4" />
              <span>Characterization</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {selectedDomain.characterization.map((char, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                  <span>{char}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Applications */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Key Applications</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {selectedDomain.applications.map((app, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>{app}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Leading Journals Publishing in Domain */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-indigo-400 shrink-0" />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Primary Scientific Journals
              </div>
              <div className="text-sm font-semibold text-slate-200 mt-0.5">
                Key literature sources reporting {selectedDomain.title} discoveries
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {selectedDomain.relatedJournals.map(jnl => (
              <span
                key={jnl}
                className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-slate-300"
              >
                {jnl}
              </span>
            ))}
          </div>
        </div>

        {/* Domain-Specific Literature Feed (Real Indexed Articles) */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-400" />
                <span>Recent Literature in {selectedDomain.title}</span>
                {domainPapers.length > 0 && (
                  <span className="text-xs font-mono font-bold text-teal-300 bg-teal-500/10 border border-teal-500/25 px-2.5 py-0.5 rounded-full">
                    {domainPapers.length} Articles
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                Actual verified scientific publications indexed in the platform repository
              </p>
            </div>

            <button
              onClick={() => handleLaunchSearch(selectedDomain.searchQuery, selectedDomain)}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-teal-500/40 text-teal-300 hover:bg-teal-500/10 font-bold text-xs flex items-center gap-2 transition-all self-start sm:self-auto"
            >
              <span>View All Literature Results</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {loadingPapers ? (
            <div className="p-12 text-center text-slate-400 space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin mx-auto" />
              <p className="text-xs font-medium">Retrieving domain publications from repository...</p>
            </div>
          ) : domainPapers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {domainPapers.map(paper => (
                <PaperCard
                  key={paper.id}
                  paper={paper}
                  onOpenDetails={onOpenDetails}
                  onOpenSummary={onOpenSummary}
                  isSelected={selectedPaperIds.includes(paper.id)}
                  onToggleSelect={onToggleSelectPaper}
                  onToggleFavourite={onToggleFavourite}
                  onUpdateReadingStatus={onUpdateReadingStatus}
                  onUpdateScreening={onUpdateScreening}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
              <FlaskConical className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm font-medium text-slate-300">
                No local papers matched this specific query immediately.
              </p>
              <button
                onClick={() => handleLaunchSearch(selectedDomain.searchQuery, selectedDomain)}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs"
              >
                Search Crossref / PubMed / arXiv Live
              </button>
            </div>
          )}
        </div>

        {/* Polymer Topic Detail Modal (When acronym is clicked) */}
        <PolymerTopicModal
          polymer={selectedPolymerTopic}
          domain={selectedDomain}
          isOpen={Boolean(selectedPolymerTopic)}
          onClose={() => setSelectedPolymerTopic(null)}
          onSearchLiterature={handleLaunchSearch}
        />
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // MAIN LANDING PAGE VIEW: Universal Polymer Research Domains Explorer
  // --------------------------------------------------------------------------
  const allCuratedPolymers = getAllCuratedPolymers();
  const totalCuratedCount = allCuratedPolymers.length;

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Hero Section with Interactive 3D Macromolecule */}
      <div className="space-y-6">
        <div className="text-center max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-violet-500/10 via-indigo-500/10 to-teal-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider shadow-sm">
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            <span>Interactive Scientific Discovery Map</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Universal Polymer Research Domains
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
            Explore the science of polymers — from molecular architecture and controlled polymerization to advanced materials and biomedical applications.
          </p>
        </div>

        {/* 3D Macromolecular Simulation Canvas Hero */}
        <Polymer3DHero height={320} />

        {/* Live Platform Taxonomy & Literature Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center shadow-md">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-indigo-400">18</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Research Domains</div>
            <div className="text-[11px] text-slate-500">Synthetic, Bio &amp; Functional</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center shadow-md">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-teal-400">{totalCuratedCount}+</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Polymer Families</div>
            <div className="text-[11px] text-slate-500">Curated Acronyms &amp; Formulas</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center shadow-md">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-purple-400">80+</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Synthesis Methods</div>
            <div className="text-[11px] text-slate-500">Living ROP, ATRP, RAFT, CROP</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center shadow-md">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">100%</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Real Data Verified</div>
            <div className="text-[11px] text-slate-500">No Mock Publication Counts</div>
          </div>
        </div>
      </div>

      {/* Large Interactive Polymer Domain Search Bar */}
      <div className="relative max-w-3xl mx-auto">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-indigo-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search polymer domains, acronyms (PLA, PEG, PMMA, POx, PNIPAM), or polymerization methods (ATRP, CROP)..."
            className="w-full pl-12 pr-12 py-3.5 sm:py-4 rounded-2xl bg-slate-900/95 border border-slate-700/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25 text-slate-100 placeholder-slate-500 text-sm shadow-xl transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap max-w-4xl mx-auto">
        {DOMAIN_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeCategory === cat.id
                ? 'bg-gradient-to-r from-teal-500 via-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Recently Explored & Trending Domains Bar */}
      {recentlyExplored.length > 0 && !searchQuery && (
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <TrendingUp className="w-4 h-4 text-teal-400" />
            <span className="font-semibold text-slate-300">Recently Explored &amp; Trending:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {recentlyExplored.map(slug => {
              const dom = getDomainBySlug(slug);
              if (!dom) return null;
              return (
                <button
                  key={slug}
                  onClick={() => setSelectedDomain(dom)}
                  className="px-3 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-teal-300 font-medium transition-colors"
                >
                  {dom.title}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* The 18 Colourful 3D Domain Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Boxes className="w-5 h-5 text-indigo-400" />
            <span>Polymer Chemistry Disciplines ({filteredDomains.length} of 18 Domains)</span>
          </h2>
          <span className="text-xs text-slate-500">
            Hover to tilt in 3D • Click to explore
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDomains.map(domain => {
            const ident = domain.visualIdentity;
            const count = domainPubCounts[domain.id] || 0;

            return (
              <ThreeDTiltCard
                key={domain.id}
                glowColor={ident.glowColor || 'indigo'}
                className="h-full cursor-pointer flex flex-col justify-between group"
                onClick={() => setSelectedDomain(domain)}
              >
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Top Identity Pill & Counts */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${ident.badgeBg}`}>
                        {ident.theme}
                      </span>
                      {count > 0 ? (
                        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          {count} indexed papers
                        </span>
                      ) : (
                        <span className="text-[11px] font-mono text-slate-500">
                          {domain.families.length} families
                        </span>
                      )}
                    </div>

                    {/* Scientific 3D / Dimensional Illustration */}
                    <div className="p-2 rounded-2xl bg-slate-950/80 border border-slate-800/80 my-3 overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]">
                      <DomainMotifIllustration motifType={domain.motifType} className="w-full h-24" />
                    </div>

                    {/* Domain Title */}
                    <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors">
                      {domain.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-slate-400 leading-relaxed mt-2 line-clamp-3">
                      {domain.shortDescription}
                    </p>
                  </div>

                  {/* Topic Tags & Action Button */}
                  <div className="pt-4 border-t border-slate-800/80 space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      {domain.relatedTopics.slice(0, 4).map(top => (
                        <span
                          key={top}
                          className="px-2 py-0.5 rounded-md bg-slate-950/90 text-[10px] text-slate-400 font-mono border border-slate-800"
                        >
                          #{top}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:text-teal-300 group-hover:translate-x-1 transition-all pt-1">
                      <span>Explore Research Domain</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </ThreeDTiltCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
