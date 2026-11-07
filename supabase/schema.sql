-- ==============================================================================
-- POx Research Hub - Comprehensive Database Schema (Supabase PostgreSQL)
-- Target Platform: Poly(2-oxazoline) and Poly(2-oxazine) Scientific Literature
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 1. PAPERS TABLE
CREATE TABLE IF NOT EXISTS public.papers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doi TEXT UNIQUE,
    doi_normalized TEXT UNIQUE,
    title TEXT NOT NULL,
    abstract TEXT,
    publication_year INT CHECK (publication_year >= 1900 AND publication_year <= 2100),
    publication_date DATE,
    journal TEXT,
    publisher TEXT,
    landing_page_url TEXT,
    open_access_url TEXT,
    citation_count INT DEFAULT 0,
    source TEXT NOT NULL DEFAULT 'openalex', -- 'openalex', 'crossref', 'semanticscholar', 'europepmc', 'manual'
    source_id TEXT,
    raw_metadata JSONB DEFAULT '{}'::jsonb,
    is_screened BOOLEAN DEFAULT FALSE,
    search_vector TSVECTOR,
    collected_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Full-text search index and performance indexes on papers
CREATE INDEX IF NOT EXISTS idx_papers_doi_norm ON public.papers (doi_normalized);
CREATE INDEX IF NOT EXISTS idx_papers_year ON public.papers (publication_year DESC);
CREATE INDEX IF NOT EXISTS idx_papers_citation_count ON public.papers (citation_count DESC);
CREATE INDEX IF NOT EXISTS idx_papers_journal ON public.papers (journal);
CREATE INDEX IF NOT EXISTS idx_papers_collected_at ON public.papers (collected_at DESC);
CREATE INDEX IF NOT EXISTS idx_papers_search_vector ON public.papers USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_papers_title_trgm ON public.papers USING GIN (title gin_trgm_ops);

-- Trigger to automatically maintain TSVECTOR search index
CREATE OR REPLACE FUNCTION public.papers_search_vector_update() RETURNS trigger AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.journal, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.abstract, '')), 'C');
    IF NEW.doi IS NOT NULL THEN
        NEW.doi_normalized := lower(trim(NEW.doi));
    END IF;
    NEW.updated_at := timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_papers_search_vector ON public.papers;
CREATE TRIGGER trg_papers_search_vector
BEFORE INSERT OR UPDATE ON public.papers
FOR EACH ROW EXECUTE FUNCTION public.papers_search_vector_update();


-- 2. AUTHORS TABLE
CREATE TABLE IF NOT EXISTS public.authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    affiliation TEXT,
    orcid TEXT,
    external_author_id TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_authors_name ON public.authors (name);
CREATE INDEX IF NOT EXISTS idx_authors_orcid ON public.authors (orcid);


-- 3. PAPER_AUTHORS JUNCTION TABLE
CREATE TABLE IF NOT EXISTS public.paper_authors (
    paper_id UUID NOT NULL REFERENCES public.papers(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.authors(id) ON DELETE CASCADE,
    author_order INT DEFAULT 1,
    PRIMARY KEY (paper_id, author_id)
);

CREATE INDEX IF NOT EXISTS idx_paper_authors_author ON public.paper_authors(author_id);
CREATE INDEX IF NOT EXISTS idx_paper_authors_paper ON public.paper_authors(paper_id);


-- 4. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Pre-seed core scientific categories according to Section 8
INSERT INTO public.categories (category_name, slug, description, display_order)
VALUES
    ('Monomer Synthesis', 'monomer-synthesis', 'Synthesis of 2-substituted 2-oxazolines/oxazines, functional, thiol, ester, and stimuli-responsive monomers', 1),
    ('Polymer Synthesis', 'polymer-synthesis', 'General polymerization methods, catalysts, and synthetic protocols for POx and POzi', 2),
    ('CROP & Polymerization Kinetics', 'crop-kinetics', 'Cationic ring-opening polymerization kinetics, living character, initiators, termination chemistry, molecular weight/dispersity control', 3),
    ('Functionalization', 'functionalization', 'End-group functionalization, post-polymerization modification, click chemistry, side-chain alterations', 4),
    ('Block Copolymers', 'block-copolymers', 'Diblock, triblock, multiblock, gradient, and star architectures based on POx/POzi or hybrid blocks', 5),
    ('Thermoresponsive Polymers', 'thermoresponsive', 'Polymers exhibiting temperature sensitivity, phase transitions, and temperature-dependent self-assembly', 6),
    ('UCST / LCST Behavior', 'ucst-lcst', 'Lower Critical Solution Temperature and Upper Critical Solution Temperature cloud point behavior in aqueous and organic media', 7),
    ('ROS-Responsive Polymers', 'ros-responsive', 'Reactive oxygen species sensitive systems containing thioethers, selenium, or tellurium switches', 8),
    ('Photoresponsive Polymers', 'photoresponsive', 'Polymers with light-triggered isomerization, cleavage, crosslinking, or photodynamic properties', 9),
    ('Drug Delivery', 'drug-delivery', 'Formulation of poorly soluble drugs, polymeric micelles, drug conjugates, and controlled release systems', 10),
    ('Gene Delivery', 'gene-delivery', 'Polyplexes, nucleic acid complexation, pDNA, siRNA, mRNA delivery systems', 11),
    ('Biomedical Applications', 'biomedical-applications', 'Antimicrobial materials, tissue engineering scaffolds, antifouling surfaces, and in vivo biocompatibility', 12),
    ('Hydrogels', 'hydrogels', 'Chemical and physical crosslinked hydrogels, cryogels, 3D cell culture matrices, wound healing dressings', 13),
    ('Nanomaterials', 'nanomaterials', 'Nanoparticles, polymersomes, worm-like micelles, nano-assemblies, and hybrid organic-inorganic hybrids', 14),
    ('Poly(2-oxazine)', 'poly-2-oxazine', 'Six-membered cyclic imino ether polymer (POzi) chemistry, synthesis, comparative studies vs POx', 15),
    ('Computational & Theoretical Studies', 'computational-theoretical', 'Molecular dynamics, DFT calculations, kinetic simulations, machine learning models', 16),
    ('Other Related Polymer Chemistry', 'other-polymer-chemistry', 'Other related cyclic imino ethers, degradable analogs, and sustainable polymer materials', 17)
ON CONFLICT (slug) DO NOTHING;


-- 5. PAPER_CATEGORIES JUNCTION TABLE
CREATE TABLE IF NOT EXISTS public.paper_categories (
    paper_id UUID NOT NULL REFERENCES public.papers(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    classification_confidence NUMERIC(4,3) DEFAULT 1.000,
    classification_source TEXT DEFAULT 'keyword_rule', -- 'ai_gemini', 'manual', 'keyword_rule'
    assigned_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (paper_id, category_id)
);

CREATE INDEX IF NOT EXISTS idx_paper_categories_cat ON public.paper_categories (category_id);
CREATE INDEX IF NOT EXISTS idx_paper_categories_paper ON public.paper_categories (paper_id);


-- 6. PAPER_SUMMARIES TABLE (Structured 13-Section AI Summaries)
CREATE TABLE IF NOT EXISTS public.paper_summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paper_id UUID NOT NULL REFERENCES public.papers(id) ON DELETE CASCADE UNIQUE,
    model_name TEXT NOT NULL,
    summary_json JSONB NOT NULL,
    source_content_type TEXT DEFAULT 'abstract_and_metadata', -- 'abstract_and_metadata', 'open_access_full_text'
    generated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_paper_summaries_paper ON public.paper_summaries (paper_id);


-- 7. USER_LIBRARY TABLE (Personal Reading Management)
CREATE TABLE IF NOT EXISTS public.user_library (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    paper_id UUID NOT NULL REFERENCES public.papers(id) ON DELETE CASCADE,
    favourite BOOLEAN DEFAULT FALSE,
    reading_status TEXT DEFAULT 'unread' CHECK (reading_status IN ('unread', 'in_progress', 'completed')),
    personal_notes TEXT,
    tags TEXT[] DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (user_id, paper_id)
);

CREATE INDEX IF NOT EXISTS idx_user_library_user ON public.user_library (user_id);
CREATE INDEX IF NOT EXISTS idx_user_library_status ON public.user_library (user_id, reading_status);
CREATE INDEX IF NOT EXISTS idx_user_library_fav ON public.user_library (user_id, favourite);


-- 8. SCREENING_RECORDS TABLE (Systematic Review Screening)
CREATE TABLE IF NOT EXISTS public.screening_records (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    paper_id UUID NOT NULL REFERENCES public.papers(id) ON DELETE CASCADE,
    screening_status TEXT NOT NULL CHECK (screening_status IN ('included', 'excluded', 'maybe')),
    screening_notes TEXT,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (user_id, paper_id)
);

CREATE INDEX IF NOT EXISTS idx_screening_records_user ON public.screening_records (user_id);
CREATE INDEX IF NOT EXISTS idx_screening_records_status ON public.screening_records (user_id, screening_status);


-- 9. SEARCH_HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.search_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    filters JSONB DEFAULT '{}'::jsonb,
    result_count INT DEFAULT 0,
    searched_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_search_history_user ON public.search_history (user_id, searched_at DESC);


-- 10. COLLECTION_LOGS TABLE
CREATE TABLE IF NOT EXISTS public.collection_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source TEXT NOT NULL, -- 'openalex', 'crossref', 'scheduled_cron', 'manual'
    query TEXT,
    started_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at TIMESTAMPTZ,
    status TEXT DEFAULT 'running' CHECK (status IN ('running', 'success', 'failed', 'partial')),
    records_found INT DEFAULT 0,
    records_saved INT DEFAULT 0,
    error_message TEXT
);

CREATE INDEX IF NOT EXISTS idx_collection_logs_started ON public.collection_logs (started_at DESC);


-- 11. RESEARCH_GAP_REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.research_gap_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    query_context TEXT,
    report_json JSONB NOT NULL,
    generated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_research_gap_reports_user ON public.research_gap_reports (user_id, generated_at DESC);


-- 12. LITERATURE_REVIEWS TABLE (Review Workspace)
CREATE TABLE IF NOT EXISTS public.literature_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    topic TEXT,
    paper_ids UUID[] DEFAULT '{}',
    review_markdown TEXT,
    comparison_table_json JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_literature_reviews_user ON public.literature_reviews (user_id, updated_at DESC);


-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS across all tables
ALTER TABLE public.papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screening_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_gap_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.literature_reviews ENABLE ROW LEVEL SECURITY;

-- 1. Papers: Readable by authenticated users; Writable by service role (backend collector)
CREATE POLICY "Authenticated users can read papers"
    ON public.papers FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Service role has full access to papers"
    ON public.papers FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 2. Authors: Readable by authenticated users; Writable by service role
CREATE POLICY "Authenticated users can read authors"
    ON public.authors FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Service role has full access to authors"
    ON public.authors FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 3. Paper_Authors: Readable by authenticated users; Writable by service role
CREATE POLICY "Authenticated users can read paper_authors"
    ON public.paper_authors FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Service role has full access to paper_authors"
    ON public.paper_authors FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 4. Categories: Readable by authenticated users; Writable by service role
CREATE POLICY "Authenticated users can read categories"
    ON public.categories FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Service role has full access to categories"
    ON public.categories FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 5. Paper_Categories: Readable by authenticated users; Writable by service role
CREATE POLICY "Authenticated users can read paper_categories"
    ON public.paper_categories FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Service role has full access to paper_categories"
    ON public.paper_categories FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 6. Paper_Summaries: Readable by authenticated users; Writable by service role
CREATE POLICY "Authenticated users can read paper_summaries"
    ON public.paper_summaries FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Service role has full access to paper_summaries"
    ON public.paper_summaries FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 7. User Library: Private to each user
CREATE POLICY "Users can manage their own library"
    ON public.user_library FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role has full access to user_library"
    ON public.user_library FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 8. Screening Records: Private to each user
CREATE POLICY "Users can manage their own screening records"
    ON public.screening_records FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role has full access to screening_records"
    ON public.screening_records FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 9. Search History: Private to each user
CREATE POLICY "Users can manage their own search history"
    ON public.search_history FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role has full access to search_history"
    ON public.search_history FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 10. Collection Logs: Readable by authenticated users, manageable by service role
CREATE POLICY "Authenticated users can read collection logs"
    ON public.collection_logs FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Service role has full access to collection_logs"
    ON public.collection_logs FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 11. Research Gap Reports: Accessible by creator or service role
CREATE POLICY "Users can manage their own research gap reports"
    ON public.research_gap_reports FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role has full access to research_gap_reports"
    ON public.research_gap_reports FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 12. Literature Reviews: Accessible by creator or service role
CREATE POLICY "Users can manage their own literature reviews"
    ON public.literature_reviews FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role has full access to literature_reviews"
    ON public.literature_reviews FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ==============================================================================
-- 13. JOURNALS: RECENT POLYMER PUBLICATION TRACKER EXTENSIONS
-- ==============================================================================

-- Alter papers table with ASAP detection & polymer relevance classification fields
ALTER TABLE public.papers ADD COLUMN IF NOT EXISTS is_asap BOOLEAN DEFAULT FALSE;
ALTER TABLE public.papers ADD COLUMN IF NOT EXISTS online_publication_date DATE;
ALTER TABLE public.papers ADD COLUMN IF NOT EXISTS print_publication_date DATE;
ALTER TABLE public.papers ADD COLUMN IF NOT EXISTS polymer_relevance TEXT DEFAULT 'polymer_related';
ALTER TABLE public.papers ADD COLUMN IF NOT EXISTS polymer_topics TEXT[] DEFAULT ARRAY[]::TEXT[];

CREATE INDEX IF NOT EXISTS idx_papers_is_asap ON public.papers (is_asap) WHERE is_asap = TRUE;
CREATE INDEX IF NOT EXISTS idx_papers_online_pub_date ON public.papers (online_publication_date DESC);
CREATE INDEX IF NOT EXISTS idx_papers_polymer_relevance ON public.papers (polymer_relevance);

-- MONITORED JOURNALS DIRECTORY TABLE
CREATE TABLE IF NOT EXISTS public.journals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    canonical_title TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    abbr TEXT,
    short_name TEXT,
    publisher TEXT NOT NULL,
    issn_print TEXT,
    issn_electronic TEXT,
    impact_factor TEXT,
    tier TEXT,
    is_multidisciplinary BOOLEAN DEFAULT FALSE,
    description TEXT,
    is_monitored BOOLEAN DEFAULT TRUE,
    cover_color TEXT DEFAULT 'from-blue-600 to-indigo-800',
    last_scanned_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_journals_canonical_title ON public.journals (canonical_title);
CREATE INDEX IF NOT EXISTS idx_journals_issn_electronic ON public.journals (issn_electronic);

-- JOURNAL TRACKER AUTOMATION LOGS TABLE
CREATE TABLE IF NOT EXISTS public.journal_tracker_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journal_id UUID REFERENCES public.journals(id) ON DELETE CASCADE,
    run_timestamp TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    articles_fetched INT DEFAULT 0,
    polymer_articles_identified INT DEFAULT 0,
    asap_articles_found INT DEFAULT 0,
    status TEXT DEFAULT 'success',
    error_message TEXT
);

CREATE INDEX IF NOT EXISTS idx_journal_tracker_logs_timestamp ON public.journal_tracker_logs (run_timestamp DESC);

-- Enable RLS for Journals and Tracker Logs
ALTER TABLE public.journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_tracker_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to journals"
    ON public.journals FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to manage journals"
    ON public.journals FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow service role full access to journals"
    ON public.journals FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read tracker logs"
    ON public.journal_tracker_logs FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow service role full access to tracker logs"
    ON public.journal_tracker_logs FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Seed Initial 10 Canonical Journals
INSERT INTO public.journals (canonical_title, name, abbr, short_name, publisher, issn_print, issn_electronic, impact_factor, tier, is_multidisciplinary, description, cover_color)
VALUES
    ('Journal of the American Chemical Society', 'Journal of the American Chemical Society', 'J. Am. Chem. Soc.', 'JACS', 'American Chemical Society (ACS)', '0002-7863', '1520-5126', '15.0', 'Q1 · Flagship Chemistry', TRUE, 'Premier global venue for fundamental discoveries across chemical sciences. Monitored strictly for high-impact macromolecular, supramolecular, and polymer chemistry breakthroughs.', 'from-blue-600 to-indigo-800'),
    ('Chemical Science', 'Chemical Science', 'Chem. Sci.', 'Chemical Science', 'Royal Society of Chemistry (RSC)', '2041-6520', '2041-6539', '8.4', 'Q1 · Flagship Open Access Chemistry', TRUE, 'RSC''s flagship diamond open access journal publishing findings of exceptional significance across chemical sciences, filtered for innovative polymer and macromolecular studies.', 'from-teal-600 to-cyan-800'),
    ('Macromolecules', 'Macromolecules', 'Macromolecules', 'Macromolecules', 'American Chemical Society (ACS)', '0024-9297', '1520-5835', '5.5', 'Q1 · ACS Flagship Polymer Science', FALSE, 'The definitive benchmark journal for fundamental macromolecular research: polymer synthesis, living polymerization kinetics, polymer physics, self-assembly, and rheology.', 'from-emerald-600 to-teal-800'),
    ('Biomacromolecules', 'Biomacromolecules', 'Biomacromolecules', 'Biomacromolecules', 'American Chemical Society (ACS)', '1525-7797', '1526-4602', '6.2', 'Q1 · ACS Flagship Biomaterials & Bio-polymers', FALSE, 'Primary journal for the interface of polymer science and biology: biomaterials, drug and gene delivery, polypeptides, polysaccharides, and stimuli-responsive smart bio-networks.', 'from-emerald-700 to-green-900'),
    ('Polymer Chemistry', 'Polymer Chemistry', 'Polym. Chem.', 'Polymer Chemistry', 'Royal Society of Chemistry (RSC)', '1759-9954', '1759-9962', '4.6', 'Q1 · Synthetic & Mechanistic Polymer Science', FALSE, 'Leading RSC journal dedicated to innovative synthetic methodologies, living controlled radical polymerizations (ATRP, RAFT, CROP), and macromolecular architecture design.', 'from-purple-600 to-indigo-900'),
    ('Progress in Polymer Science', 'Progress in Polymer Science', 'Prog. Polym. Sci.', 'Prog. Polym. Sci.', 'Elsevier', '0079-6700', '1873-1619', '27.1', 'Q1 · Premier Macromolecular Review Journal', FALSE, 'Top-ranked review journal in polymer science providing authoritative, critical reviews of state-of-the-art advances in polymer synthesis, physics, and bio-applications.', 'from-amber-600 to-orange-800'),
    ('ACS Applied Polymer Materials', 'ACS Applied Polymer Materials', 'ACS Appl. Polym. Mater.', 'ACS Appl. Polym. Mater.', 'American Chemical Society (ACS)', '2637-6105', '2637-6105', '4.4', 'Q1 · Applied Polymer Materials & Engineering', FALSE, 'ACS journal focused on engineered polymers, functional coatings, polymer nanocomposites, separation membranes, and polymer electrolytes for energy applications.', 'from-blue-700 to-cyan-900'),
    ('Angewandte Chemie International Edition', 'Angewandte Chemie International Edition', 'Angew. Chem. Int. Ed.', 'Angewandte Chemie', 'Wiley-VCH', '1433-7851', '1521-3773', '16.6', 'Q1 · Leading Chemistry Worldwide', TRUE, 'One of the world''s premier chemistry journals. Filtered strictly to track landmark discoveries in controlled living polymerizations, dynamic polymer networks, and macromolecular materials.', 'from-sky-600 to-blue-900'),
    ('Small', 'Small', 'Small', 'Small', 'Wiley-VCH', '1613-6810', '1613-6829', '13.0', 'Q1 · Micro & Nano Macromolecular Systems', TRUE, 'Very high-impact micro- and nano-science journal, tracked specifically for polymeric nanocarriers, block copolymer lithography, polymer brushes, and nanostructured biomaterials.', 'from-red-600 to-rose-900'),
    ('ACS Applied Materials & Interfaces', 'ACS Applied Materials & Interfaces', 'ACS Appl. Mater. Interfaces', 'ACS Appl. Mater. Interfaces', 'American Chemical Society (ACS)', '1944-8244', '1944-8252', '9.5', 'Q1 · Functional Materials & Interfacial Science', TRUE, 'Leading ACS journal dedicated to functional materials and interfacial systems. Monitored strictly for polymer coatings, antifouling surfaces, hydrogel adhesives, and polymer composites.', 'from-indigo-600 to-slate-900')
ON CONFLICT (canonical_title) DO NOTHING;


-- 13. ARTICLE_PDFS TABLE (Personal Article PDF Cloud Storage)
CREATE TABLE IF NOT EXISTS public.article_pdfs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id TEXT NOT NULL,
    doi TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    storage_path TEXT NOT NULL UNIQUE,
    original_filename TEXT NOT NULL,
    mime_type TEXT NOT NULL DEFAULT 'application/pdf',
    file_size BIGINT NOT NULL,
    checksum TEXT,
    source_type TEXT NOT NULL DEFAULT 'manual_upload' CHECK (source_type IN ('publisher_authorized', 'manual_upload', 'institutional_proxy', 'open_access')),
    upload_status TEXT NOT NULL DEFAULT 'completed' CHECK (upload_status IN ('pending', 'completed', 'failed')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_article_pdfs_article ON public.article_pdfs (article_id);
CREATE INDEX IF NOT EXISTS idx_article_pdfs_doi ON public.article_pdfs (doi);
CREATE INDEX IF NOT EXISTS idx_article_pdfs_user ON public.article_pdfs (user_id);
CREATE INDEX IF NOT EXISTS idx_article_pdfs_created ON public.article_pdfs (created_at DESC);


-- 14. ARTICLE_WATCHLIST TABLE (Personal Research Watchlist)
CREATE TABLE IF NOT EXISTS public.article_watchlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id TEXT NOT NULL,
    doi TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    reading_status TEXT NOT NULL DEFAULT 'to_read' CHECK (reading_status IN ('to_read', 'reading', 'read')),
    personal_note TEXT,
    tags TEXT[] DEFAULT '{}',
    added_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT uq_user_article_watchlist UNIQUE (user_id, article_id)
);

CREATE INDEX IF NOT EXISTS idx_watchlist_user ON public.article_watchlist (user_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_article ON public.article_watchlist (article_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_status ON public.article_watchlist (user_id, reading_status);
CREATE INDEX IF NOT EXISTS idx_watchlist_added ON public.article_watchlist (added_at DESC);


