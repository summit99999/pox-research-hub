-- ==============================================================================
-- Migration: Article PDF Storage & Personal Research Watchlist
-- Target: Supabase PostgreSQL (Public Schema)
-- ==============================================================================

-- 1. ARTICLE_PDFS TABLE
-- Stores metadata for user-associated and cloud-stored scientific article PDFs
CREATE TABLE IF NOT EXISTS public.article_pdfs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id TEXT NOT NULL,                -- Supports both UUID and canonical DOI/string IDs
    doi TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    storage_path TEXT NOT NULL UNIQUE,       -- Path inside 'article_pdfs' storage bucket
    original_filename TEXT NOT NULL,
    mime_type TEXT NOT NULL DEFAULT 'application/pdf',
    file_size BIGINT NOT NULL,               -- File size in bytes
    checksum TEXT,                           -- SHA-256 / MD5 digest
    source_type TEXT NOT NULL DEFAULT 'manual_upload' CHECK (source_type IN ('publisher_authorized', 'manual_upload', 'institutional_proxy', 'open_access')),
    upload_status TEXT NOT NULL DEFAULT 'completed' CHECK (upload_status IN ('pending', 'completed', 'failed')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Performance and association indexes
CREATE INDEX IF NOT EXISTS idx_article_pdfs_article ON public.article_pdfs (article_id);
CREATE INDEX IF NOT EXISTS idx_article_pdfs_doi ON public.article_pdfs (doi);
CREATE INDEX IF NOT EXISTS idx_article_pdfs_user ON public.article_pdfs (user_id);
CREATE INDEX IF NOT EXISTS idx_article_pdfs_created ON public.article_pdfs (created_at DESC);

-- Enable RLS on article_pdfs
ALTER TABLE public.article_pdfs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own PDFs, or public shared PDFs
CREATE POLICY "Users can read own or shared PDFs" ON public.article_pdfs
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Policy: Users can insert PDFs with their user_id
CREATE POLICY "Users can insert own PDFs" ON public.article_pdfs
    FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

-- Policy: Users can update their own PDFs
CREATE POLICY "Users can update own PDFs" ON public.article_pdfs
    FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

-- Policy: Users can delete their own PDFs
CREATE POLICY "Users can delete own PDFs" ON public.article_pdfs
    FOR DELETE USING (auth.uid() = user_id OR user_id IS NULL);


-- 2. ARTICLE_WATCHLIST TABLE
-- Stores personally tracked articles, reading progress, and cloud notes
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

-- Indexes for watchlist queries
CREATE INDEX IF NOT EXISTS idx_watchlist_user ON public.article_watchlist (user_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_article ON public.article_watchlist (article_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_status ON public.article_watchlist (user_id, reading_status);
CREATE INDEX IF NOT EXISTS idx_watchlist_added ON public.article_watchlist (added_at DESC);

-- Enable RLS on article_watchlist
ALTER TABLE public.article_watchlist ENABLE ROW LEVEL SECURITY;

-- Watchlist policies
CREATE POLICY "Users can view own watchlist" ON public.article_watchlist
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert into own watchlist" ON public.article_watchlist
    FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Users can update own watchlist" ON public.article_watchlist
    FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete from own watchlist" ON public.article_watchlist
    FOR DELETE USING (auth.uid() = user_id OR user_id IS NULL);


-- 3. STORAGE BUCKET POLICIES FOR 'article_pdfs'
-- Bucket creation is handled via API or dashboard: article_pdfs (private)
-- Allow authenticated users to upload and manage PDFs in article_pdfs bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('article_pdfs', 'article_pdfs', FALSE, 52428800, ARRAY['application/pdf'])
ON CONFLICT (id) DO UPDATE SET
    public = FALSE,
    file_size_limit = 52428800,
    allowed_mime_types = ARRAY['application/pdf'];
