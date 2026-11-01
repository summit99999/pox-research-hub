import React, { useState, useEffect } from 'react';
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
import PaperDetailModal from './components/PaperDetailModal';
import CollectorModal from './components/CollectorModal';
import AuthModal from './components/AuthModal';
import { api } from './lib/api';
import { supabase } from './lib/supabase';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPaperIds, setSelectedPaperIds] = useState([]);
  
  // Modals
  const [detailModalPaper, setDetailModalPaper] = useState(null);
  const [detailModalInitialTab, setDetailModalInitialTab] = useState('metadata');
  const [collectorModalOpen, setCollectorModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  
  // System & Auth
  const [allCategories, setAllCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [health, setHealth] = useState(null);

  useEffect(() => {
    loadInitialData();
    checkAuthSession();
  }, []);

  const loadInitialData = async () => {
    try {
      const [h, cats] = await Promise.all([
        api.getHealth().catch(() => null),
        api.getCategories().catch(() => [])
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
    setDetailModalInitialTab('metadata');
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

  const handleNavigateToSearch = (query) => {
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
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
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Left Sidebar (15 Scientific Views) */}
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          onSelectCategory={handleSelectCategory}
        />

        {/* View Router Content */}
        <main className="flex-1 min-w-0 p-4 lg:p-8 overflow-y-auto">
          {activeView === 'dashboard' && (
            <DashboardView
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
            />
          )}

          {activeView === 'search' && (
            <SearchView
              key={`search-${selectedCategory}-${searchQuery}`}
              title="Literature Search Engine"
              subtitle="Search across 251 indexed papers by keyword, author, DOI, or category."
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
              key="publications"
              title="All Scientific Publications"
              subtitle="Complete repository of 251 publications indexed from OpenAlex and Crossref (2020–2026+)."
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

          {activeView === 'pox' && (
            <SearchView
              key="pox"
              title="Poly(2-oxazoline) (POx) Chemistry"
              subtitle="Research on PMOx, PEtOx, PiPOx, PPhOx, amphiphilic copolymers, and CROP synthesis."
              initialQuery="oxazoline"
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
              key="pozi"
              title="Poly(2-oxazine) (POzi) Chemistry"
              subtitle="Research on poly(2-oxazine)s, PMOzi, PEtOzi, and POx/POzi comparative studies."
              initialQuery="oxazine"
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
              key="monomers"
              title="Oxazoline & Oxazine Monomer Database"
              subtitle="Synthesis and functionalization of 2-substituted monomers, thiols, esters, and stimuli-responsive monomers."
              initialQuery="monomer"
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
              key="polymerization"
              title="Polymerization Chemistry & CROP Kinetics"
              subtitle="Cationic ring-opening polymerization (CROP), initiator development, termination kinetics, and living control."
              initialQuery="polymerization OR crop OR ring-opening"
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

          {activeView === 'stimuli' && (
            <SearchView
              key="stimuli"
              title="Stimuli-Responsive & Smart Polymers"
              subtitle="Thermoresponsive (LCST/UCST), ROS-responsive, photoresponsive, and dual-responsive polymer architectures."
              initialQuery="responsive OR thermoresponsive OR ros OR photoresponsive OR lcst OR ucst"
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

          {activeView === 'biomedical' && (
            <SearchView
              key="biomedical"
              title="Biomedical & Delivery Systems"
              subtitle="Drug delivery, gene delivery, micelles, nanoparticles, hydrogels, and polymer therapeutics."
              initialQuery="delivery OR biomedical OR micelle OR nanoparticle OR hydrogel"
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

          {activeView === 'summaries' && (
            <AISummariesView
              onOpenDetails={handleOpenDetails}
              onOpenSummary={handleOpenSummary}
            />
          )}

          {activeView === 'trends' && (
            <AnalyticsView />
          )}

          {activeView === 'gaps' && (
            <GapFinderView />
          )}

          {activeView === 'review' && (
            <ReviewWorkspaceView
              selectedPaperIds={selectedPaperIds}
              onOpenSearch={() => setActiveView('search')}
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
