import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DashboardView from './views/DashboardView';
import SearchView from './views/SearchView';
import AnalyticsView from './views/AnalyticsView';
import GapFinderView from './views/GapFinderView';
import ReviewWorkspaceView from './views/ReviewWorkspaceView';
import LibraryView from './views/LibraryView';
import SettingsView from './views/SettingsView';
import AISummariesView from './views/AISummariesView';
import DeveloperPublicationsView from './views/DeveloperPublicationsView';
import PaperDetailModal from './components/PaperDetailModal';
import CollectorModal from './components/CollectorModal';
import AuthModal from './components/AuthModal';
import { api } from './lib/api';
import { supabase } from './lib/supabase';
import { ENGINE_SCOPES } from './lib/searchEngine';

export default function App() {
  const [currentEngine, setCurrentEngine] = useState(ENGINE_SCOPES.POX);
  const [activeView, setActiveView] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPaperIds, setSelectedPaperIds] = useState([]);
  
  // Folding Sidebar Navigation
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarPinned, setSidebarPinned] = useState(false);
  
  // Modals
  const [detailModalPaper, setDetailModalPaper] = useState(null);
  const [detailModalInitialTab, setDetailModalInitialTab] = useState('toc');
  const [collectorModalOpen, setCollectorModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  
  // System & Auth
  const [allCategories, setAllCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [health, setHealth] = useState(null);

  useEffect(() => {
    loadInitialData();
    checkAuthSession();

    // Read initial URL query parameters for direct navigation, engine selection, & searches
    try {
      const params = new URLSearchParams(window.location.search);
      const engineParam = params.get('engine');
      const viewParam = params.get('view') || params.get('tab');
      const qParam = params.get('q') || params.get('search');
      const catParam = params.get('category');

      if (engineParam === 'universal' || engineParam === 'pox') {
        setCurrentEngine(engineParam);
      }

      if (qParam) {
        setSearchQuery(qParam);
        setActiveView('search');
      } else if (catParam) {
        setSelectedCategory(catParam);
        setActiveView('search');
      } else if (viewParam) {
        setActiveView(viewParam);
      }
    } catch (e) {
      console.debug('Failed to parse URL query params', e);
    }
  }, []);

  // Sync browser URL with active engine, view, and search query
  useEffect(() => {
    try {
      const params = new URLSearchParams();
      if (currentEngine) {
        params.set('engine', currentEngine);
      }
      if (activeView && activeView !== 'dashboard') {
        params.set('view', activeView);
      }
      if (activeView === 'search') {
        if (searchQuery) params.set('q', searchQuery);
        if (selectedCategory) params.set('category', selectedCategory);
      }
      const newQueryString = params.toString();
      const newUrl = newQueryString 
        ? `${window.location.pathname}?${newQueryString}` 
        : window.location.pathname;
      window.history.replaceState(null, '', newUrl);
    } catch (e) {
      console.debug('Failed to update URL search params', e);
    }
  }, [currentEngine, activeView, searchQuery, selectedCategory]);

  const loadInitialData = async () => {
    try {
      const [h, cats] = await Promise.all([
        api.getHealth().catch(() => null),
        api.getCategories(currentEngine).catch(() => [])
      ]);
      setHealth(h);
      setAllCategories(cats || []);
    } catch (e) {
      console.debug('Failed to initialize app state', e);
    }
  };

  const checkAuthSession = async () => {
    if (!supabase) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);

      supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
      });
    } catch (e) {
      console.debug('Auth session error', e);
    }
  };

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  const handleToggleSelectPaper = (paperId) => {
    if (selectedPaperIds.includes(paperId)) {
      setSelectedPaperIds(selectedPaperIds.filter(id => id !== paperId));
    } else {
      setSelectedPaperIds([...selectedPaperIds, paperId]);
    }
  };

  const handleClearSelection = () => {
    setSelectedPaperIds([]);
  };

  const handleOpenDetails = (paper) => {
    setDetailModalPaper(paper);
    setDetailModalInitialTab('toc');
  };

  const handleOpenSummary = (paper) => {
    setDetailModalPaper(paper);
    setDetailModalInitialTab('summary');
  };

  const handleToggleFavourite = async (paperId, isFav) => {
    try {
      await api.updateLibrary(paperId, { favourite: isFav });
    } catch (e) {
      console.debug('Favourite update error', e);
    }
  };

  const handleUpdateReadingStatus = async (paperId, status) => {
    try {
      await api.updateLibrary(paperId, { reading_status: status });
    } catch (e) {
      console.debug('Reading status update error', e);
    }
  };

  const handleUpdateScreening = async (paperId, status) => {
    try {
      await api.setScreeningDecision(paperId, { screening_status: status });
    } catch (e) {
      console.debug('Screening update error', e);
    }
  };

  const handleNavigateToSearch = (query, engineOverride) => {
    if (engineOverride) {
      setCurrentEngine(engineOverride);
    }
    setSearchQuery(query || '');
    setSelectedCategory('');
    setActiveView('search');
  };

  const handleSelectCategory = (catSlug) => {
    setSelectedCategory(catSlug);
    setSearchQuery('');
    setActiveView('search');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar with PRIH Branding and Dual Engine Switcher */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onTriggerSearch={handleNavigateToSearch}
        onOpenCollectorModal={() => setCollectorModalOpen(true)}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        user={user}
        onSignOut={handleSignOut}
        health={health}
        onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        sidebarOpen={sidebarOpen}
        currentEngine={currentEngine}
        onSelectEngine={setCurrentEngine}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto relative">
        {/* Backdrop for folded sidebar */}
        {sidebarOpen && !sidebarPinned && (
          <div 
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 transition-opacity duration-300"
            title="Click to fold sidebar"
          />
        )}

        {/* Sliding & Folding Left Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isPinned={sidebarPinned}
          onTogglePin={() => setSidebarPinned(prev => !prev)}
          activeView={activeView}
          setActiveView={setActiveView}
          currentEngine={currentEngine}
          onSelectEngine={setCurrentEngine}
          onSelectCategory={handleSelectCategory}
        />

        {/* Floating Quick Open Pill */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed left-4 bottom-6 z-30 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-teal-300 border border-slate-700/80 shadow-2xl backdrop-blur-md text-xs font-semibold transition-all group hover:scale-105"
            title="Open Navigation Menu"
          >
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse group-hover:scale-125 transition-transform" />
            <Menu className="w-4 h-4 text-teal-400" />
            <span>Menu & Views</span>
          </button>
        )}

        {/* View Router Content */}
        <main className="flex-1 min-w-0 p-4 lg:p-8 overflow-y-auto">
          {activeView === 'dashboard' && (
            <DashboardView
              engine={currentEngine}
              onSelectEngine={setCurrentEngine}
              onNavigateToSearch={handleNavigateToSearch}
              onSelectCategory={handleSelectCategory}
              onOpenDetails={handleOpenDetails}
              onOpenSummary={handleOpenSummary}
              onOpenCollectorModal={() => setCollectorModalOpen(true)}
              selectedPaperIds={selectedPaperIds}
              onToggleSelectPaper={handleToggleSelectPaper}
              onToggleFavourite={handleToggleFavourite}
              onUpdateReadingStatus={handleUpdateReadingStatus}
              onUpdateScreening={handleUpdateScreening}
              onOpenDeveloperView={() => setActiveView('developer')}
            />
          )}

          {activeView === 'search' && (
            <SearchView
              key={`search-${currentEngine}-${selectedCategory}-${searchQuery}`}
              initialEngine={currentEngine}
              initialQuery={searchQuery}
              initialCategory={selectedCategory}
              onOpenDetails={handleOpenDetails}
              onOpenSummary={handleOpenSummary}
              selectedPaperIds={selectedPaperIds}
              onToggleSelectPaper={handleToggleSelectPaper}
              onClearSelection={handleClearSelection}
              onOpenReviewWorkspace={() => setActiveView('review')}
              onToggleFavourite={handleToggleFavourite}
              onUpdateReadingStatus={handleUpdateReadingStatus}
              onUpdateScreening={handleUpdateScreening}
            />
          )}

          {activeView === 'publications' && (
            <SearchView
              key={`publications-${currentEngine}`}
              title="All Scientific Publications"
              subtitle="Central repository of peer-reviewed publications indexed from OpenAlex, Crossref, and Europe PMC (1950–2026+)."
              initialEngine={currentEngine}
              initialQuery=""
              initialCategory=""
              onOpenDetails={handleOpenDetails}
              onOpenSummary={handleOpenSummary}
              selectedPaperIds={selectedPaperIds}
              onToggleSelectPaper={handleToggleSelectPaper}
              onClearSelection={handleClearSelection}
              onOpenReviewWorkspace={() => setActiveView('review')}
              onToggleFavourite={handleToggleFavourite}
              onUpdateReadingStatus={handleUpdateReadingStatus}
              onUpdateScreening={handleUpdateScreening}
            />
          )}

          {activeView === 'reviews' && (
            <ReviewWorkspaceView
              key="reviews-view"
              selectedPaperIds={selectedPaperIds}
              onOpenSearch={() => setActiveView('search')}
              onOpenDetails={handleOpenDetails}
              onOpenSummary={handleOpenSummary}
              onToggleSelectPaper={handleToggleSelectPaper}
              onClearSelection={handleClearSelection}
              onToggleFavourite={handleToggleFavourite}
              onUpdateReadingStatus={handleUpdateReadingStatus}
              onUpdateScreening={handleUpdateScreening}
              initialTab="published"
            />
          )}

          {activeView === 'developer' && (
            <DeveloperPublicationsView
              onOpenDetails={handleOpenDetails}
              onOpenSummary={handleOpenSummary}
              selectedPaperIds={selectedPaperIds}
              onToggleSelectPaper={handleToggleSelectPaper}
              onToggleFavourite={handleToggleFavourite}
              onUpdateReadingStatus={handleUpdateReadingStatus}
              onUpdateScreening={handleUpdateScreening}
            />
          )}

          {activeView === 'pox' && (
            <SearchView
              key="pox-view"
              title="Poly(2-oxazoline) (POx) Chemistry"
              subtitle="Research on PMOx, PEtOx, PiPOx, PPhOx, amphiphilic copolymers, and CROP synthesis."
              initialEngine={ENGINE_SCOPES.POX}
              initialQuery="oxazoline OR pox OR polyoxazoline"
              initialCategory=""
              onOpenDetails={handleOpenDetails}
              onOpenSummary={handleOpenSummary}
              selectedPaperIds={selectedPaperIds}
              onToggleSelectPaper={handleToggleSelectPaper}
              onClearSelection={handleClearSelection}
              onOpenReviewWorkspace={() => setActiveView('review')}
              onToggleFavourite={handleToggleFavourite}
              onUpdateReadingStatus={handleUpdateReadingStatus}
              onUpdateScreening={handleUpdateScreening}
            />
          )}

          {activeView === 'pozi' && (
            <SearchView
              key="pozi-view"
              title="Poly(2-oxazine) (POzi) Chemistry"
              subtitle="Research on poly(2-oxazine)s, PMOzi, PEtOzi, and POx/POzi comparative studies."
              initialEngine={ENGINE_SCOPES.POX}
              initialQuery="oxazine OR pozi OR polyoxazine"
              initialCategory="poly-2-oxazine"
              onOpenDetails={handleOpenDetails}
              onOpenSummary={handleOpenSummary}
              selectedPaperIds={selectedPaperIds}
              onToggleSelectPaper={handleToggleSelectPaper}
              onClearSelection={handleClearSelection}
              onOpenReviewWorkspace={() => setActiveView('review')}
              onToggleFavourite={handleToggleFavourite}
              onUpdateReadingStatus={handleUpdateReadingStatus}
              onUpdateScreening={handleUpdateScreening}
            />
          )}

          {activeView === 'monomers' && (
            <SearchView
              key="monomers-view"
              title="Oxazoline & Oxazine Monomer Database"
              subtitle="Synthesis and functionalization of 2-substituted monomers, thiols, esters, and stimuli-responsive monomers."
              initialEngine={ENGINE_SCOPES.POX}
              initialQuery="monomer OR 2-oxazoline OR 2-oxazine"
              initialCategory="monomer-synthesis"
              onOpenDetails={handleOpenDetails}
              onOpenSummary={handleOpenSummary}
              selectedPaperIds={selectedPaperIds}
              onToggleSelectPaper={handleToggleSelectPaper}
              onClearSelection={handleClearSelection}
              onOpenReviewWorkspace={() => setActiveView('review')}
              onToggleFavourite={handleToggleFavourite}
              onUpdateReadingStatus={handleUpdateReadingStatus}
              onUpdateScreening={handleUpdateScreening}
            />
          )}

          {activeView === 'polymerization' && (
            <SearchView
              key="polymerization-view"
              title="Polymerization Chemistry & CROP Kinetics"
              subtitle="Cationic ring-opening polymerization (CROP), initiator development, termination kinetics, and living control."
              initialEngine={ENGINE_SCOPES.POX}
              initialQuery="polymerization OR crop OR ring-opening"
              initialCategory="crop-kinetics"
              onOpenDetails={handleOpenDetails}
              onOpenSummary={handleOpenSummary}
              selectedPaperIds={selectedPaperIds}
              onToggleSelectPaper={handleToggleSelectPaper}
              onClearSelection={handleClearSelection}
              onOpenReviewWorkspace={() => setActiveView('review')}
              onToggleFavourite={handleToggleFavourite}
              onUpdateReadingStatus={handleUpdateReadingStatus}
              onUpdateScreening={handleUpdateScreening}
            />
          )}

          {activeView === 'stimuli' && (
            <SearchView
              key="stimuli-view"
              title="Stimuli-Responsive & Smart Polymers"
              subtitle="Thermoresponsive (LCST/UCST), ROS-responsive, photoresponsive, and dual-responsive polymer architectures."
              initialEngine={currentEngine}
              initialQuery="responsive OR thermoresponsive OR ros OR photoresponsive OR lcst OR ucst"
              initialCategory="thermoresponsive"
              onOpenDetails={handleOpenDetails}
              onOpenSummary={handleOpenSummary}
              selectedPaperIds={selectedPaperIds}
              onToggleSelectPaper={handleToggleSelectPaper}
              onClearSelection={handleClearSelection}
              onOpenReviewWorkspace={() => setActiveView('review')}
              onToggleFavourite={handleToggleFavourite}
              onUpdateReadingStatus={handleUpdateReadingStatus}
              onUpdateScreening={handleUpdateScreening}
            />
          )}

          {activeView === 'biomedical' && (
            <SearchView
              key="biomedical-view"
              title="Biomedical & Delivery Systems"
              subtitle="Drug delivery, gene delivery, micelles, nanoparticles, hydrogels, and polymer therapeutics."
              initialEngine={currentEngine}
              initialQuery="delivery OR biomedical OR micelle OR nanoparticle OR hydrogel"
              initialCategory="drug-delivery"
              onOpenDetails={handleOpenDetails}
              onOpenSummary={handleOpenSummary}
              selectedPaperIds={selectedPaperIds}
              onToggleSelectPaper={handleToggleSelectPaper}
              onClearSelection={handleClearSelection}
              onOpenReviewWorkspace={() => setActiveView('review')}
              onToggleFavourite={handleToggleFavourite}
              onUpdateReadingStatus={handleUpdateReadingStatus}
              onUpdateScreening={handleUpdateScreening}
            />
          )}

          {activeView === 'summaries' && (
            <AISummariesView
              onOpenDetails={handleOpenDetails}
              onOpenSummary={handleOpenSummary}
            />
          )}

          {activeView === 'trends' && (
            <AnalyticsView
              initialEngine={currentEngine}
              onNavigateToSearch={handleNavigateToSearch}
              onOpenDetails={handleOpenDetails}
              onOpenSummary={handleOpenSummary}
            />
          )}

          {activeView === 'gaps' && (
            <GapFinderView
              initialEngine={currentEngine}
            />
          )}

          {activeView === 'review' && (
            <ReviewWorkspaceView
              key="synthesis-view"
              selectedPaperIds={selectedPaperIds}
              onOpenSearch={() => setActiveView('search')}
              onOpenDetails={handleOpenDetails}
              onOpenSummary={handleOpenSummary}
              onToggleSelectPaper={handleToggleSelectPaper}
              onClearSelection={handleClearSelection}
              onToggleFavourite={handleToggleFavourite}
              onUpdateReadingStatus={handleUpdateReadingStatus}
              onUpdateScreening={handleUpdateScreening}
              initialTab="synthesis"
            />
          )}

          {activeView === 'library' && (
            <LibraryView
              onOpenDetails={handleOpenDetails}
              onOpenSummary={handleOpenSummary}
              onNavigateToSearch={() => setActiveView('search')}
            />
          )}

          {activeView === 'settings' && (
            <SettingsView
              health={health}
              onRefreshHealth={loadInitialData}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      {detailModalPaper && (
        <PaperDetailModal
          paper={detailModalPaper}
          allCategories={allCategories}
          initialTab={detailModalInitialTab}
          onClose={() => setDetailModalPaper(null)}
          onCategoriesUpdated={loadInitialData}
        />
      )}

      {collectorModalOpen && (
        <CollectorModal
          onClose={() => setCollectorModalOpen(false)}
          onCollectionComplete={loadInitialData}
        />
      )}

      {authModalOpen && (
        <AuthModal
          onClose={() => setAuthModalOpen(false)}
          onAuthSuccess={(u) => setUser(u)}
        />
      )}
    </div>
  );
}
