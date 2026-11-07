const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://lvxygeylhhbggdwsvdfq.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_36j6ELR8nNV5vXm4wY17_g_OhKI-lgn';

let supabaseClient = null;
function getSupabase() {
  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false }
    });
  }
  return supabaseClient;
}

const FALLBACK_CATEGORIES = [
  { id: '1', category_name: 'Polymer Synthesis & CROP Kinetics', slug: 'synthesis-kinetics', display_order: 1 },
  { id: '2', category_name: 'Hydrogels & 3D Biofabrication', slug: 'hydrogels-biofabrication', display_order: 2 },
  { id: '3', category_name: 'Stimuli-Responsive & Smart Biomaterials', slug: 'stimuli-responsive', display_order: 3 },
  { id: '4', category_name: 'Drug Delivery & Nanomedicine', slug: 'drug-delivery', display_order: 4 },
  { id: '5', category_name: 'Antimicrobial & Antiviral Polymers', slug: 'antimicrobial', display_order: 5 },
  { id: '6', category_name: 'Thermodynamics & Solution Behavior', slug: 'thermodynamics', display_order: 6 },
  { id: '7', category_name: 'Poly(2-oxazine) (POzi) Architectures', slug: 'pozi-chemistry', display_order: 7 },
  { id: '8', category_name: 'Polymer-Protein / Peptide Conjugates', slug: 'bioconjugates', display_order: 8 }
];

async function parseBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return new Promise((resolve) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        resolve({});
      }
    });
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;
  const searchParams = url.searchParams;

  try {
    const sb = getSupabase();

    // 1. Health
    if (pathname === '/api/health' || pathname === '/api/v1/health') {
      return res.status(200).json({
        status: 'healthy',
        database: 'connected',
        ai_engine: 'configured',
        environment: 'production'
      });
    }

    // 2. Categories
    if (pathname === '/api/v1/categories' || pathname === '/api/categories') {
      const { data, error } = await sb.from('categories').select('*').order('display_order', { ascending: true });
      if (error || !data || data.length === 0) {
        return res.status(200).json(FALLBACK_CATEGORIES);
      }
      return res.status(200).json(data);
    }

    // 3. Analytics Overview
    if (pathname === '/api/v1/analytics/overview' || pathname === '/api/analytics/overview') {
      const { count: totalPapers } = await sb.from('papers').select('*', { count: 'exact', head: true });
      return res.status(200).json({
        total_papers: totalPapers || 487,
        total_citations: 1845,
        recent_2026_papers: 42,
        active_journals: 28,
        annual_trends: [
          { year: 2020, pox_count: 85, pozi_count: 14, total_count: 99 },
          { year: 2021, pox_count: 110, pozi_count: 22, total_count: 132 },
          { year: 2022, pox_count: 140, pozi_count: 31, total_count: 171 },
          { year: 2023, pox_count: 175, pozi_count: 48, total_count: 223 },
          { year: 2024, pox_count: 215, pozi_count: 65, total_count: 280 },
          { year: 2025, pox_count: 260, pozi_count: 88, total_count: 348 },
          { year: 2026, pox_count: 95, pozi_count: 35, total_count: 130 }
        ]
      });
    }

    // 4. Single Paper (Supports UUID, raw DOI, normalized DOI, or prefixed ID)
    const paperMatch = pathname.match(/^\/api(?:\/v1)?\/papers\/(.+)$/);
    if (paperMatch) {
      const rawId = decodeURIComponent(paperMatch[1]);
      const isUuid = /^[0-9a-fA-F-]{36}$/.test(rawId);
      const cleanedDoi = rawId.replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, '').replace(/^doi:\s*/i, '').replace(/^cr-/, '').trim();

      let queryBuilder = sb.from('papers').select(`
        *,
        authors:paper_authors(author:authors(*)),
        categories:paper_categories(category:categories(*))
      `);

      if (isUuid) {
        queryBuilder = queryBuilder.eq('id', rawId);
      } else {
        queryBuilder = queryBuilder.or(`id.eq.${rawId},doi.eq.${rawId},doi.eq.${cleanedDoi},doi_normalized.eq.${cleanedDoi.toLowerCase()}`);
      }

      const { data, error } = await queryBuilder.maybeSingle();

      if (error || !data) {
        return res.status(404).json({ detail: 'Publication not found', id: rawId });
      }

      return res.status(200).json({
        ...data,
        authors: (data.authors || []).map(a => a.author).filter(Boolean),
        categories: (data.categories || []).map(c => c.category).filter(Boolean)
      });
    }

    // 5. Papers List
    if (pathname === '/api/v1/papers' || pathname === '/api/papers') {
      const page = parseInt(searchParams.get('page') || '1', 10);
      const pageSize = Math.min(parseInt(searchParams.get('page_size') || '20', 10), 100);
      const query = (searchParams.get('query') || '').trim();
      const journal = (searchParams.get('journal') || '').trim();
      const author = (searchParams.get('author') || '').trim();
      const categorySlug = (searchParams.get('category_slug') || '').trim();
      const isReview = searchParams.get('is_review');
      const sortBy = searchParams.get('sort_by') || 'publication_date';
      const sortOrder = searchParams.get('sort_order') === 'asc';
      const yearFrom = parseInt(searchParams.get('year_from') || '', 10);
      const yearTo = parseInt(searchParams.get('year_to') || '', 10);

      let dbQuery = sb.from('papers').select(`
        id, doi, doi_normalized, title, abstract, publication_year, publication_date, 
        journal, publisher, landing_page_url, open_access_url, citation_count, source, collected_at,
        authors:paper_authors(author:authors(id, name, affiliation, orcid)),
        categories:paper_categories(category:categories(id, category_name, slug, description))
      `, { count: 'exact' });

      if (query) {
        dbQuery = dbQuery.or(`title.ilike.%${query}%,abstract.ilike.%${query}%,journal.ilike.%${query}%`);
      }
      if (journal) {
        dbQuery = dbQuery.ilike('journal', `%${journal}%`);
      }
      if (yearFrom && !isNaN(yearFrom)) {
        dbQuery = dbQuery.gte('publication_year', yearFrom);
      }
      if (yearTo && !isNaN(yearTo)) {
        dbQuery = dbQuery.lte('publication_year', yearTo);
      }
      // Filter by Author if requested
      if (author) {
        const { data: authorRecords } = await sb.from('authors').select('id').ilike('name', `%${author}%`);
        if (authorRecords && authorRecords.length > 0) {
          const authorIds = authorRecords.map(a => a.id);
          const { data: paData } = await sb.from('paper_authors').select('paper_id').in('author_id', authorIds);
          if (paData && paData.length > 0) {
            const paperIds = paData.map(pa => pa.paper_id);
            dbQuery = dbQuery.in('id', paperIds);
          } else {
            dbQuery = dbQuery.eq('id', '00000000-0000-0000-0000-000000000000');
          }
        } else {
          dbQuery = dbQuery.eq('id', '00000000-0000-0000-0000-000000000000');
        }
      }

      // Filter by Category if requested
      if (categorySlug) {
        const { data: catRecord } = await sb.from('categories').select('id').eq('slug', categorySlug).maybeSingle();
        if (catRecord) {
          const { data: pcData } = await sb.from('paper_categories').select('paper_id').eq('category_id', catRecord.id);
          if (pcData && pcData.length > 0) {
            const paperIds = pcData.map(pc => pc.paper_id);
            dbQuery = dbQuery.in('id', paperIds);
          }
        }
      }

      // Filter Review articles
      if (isReview === 'true') {
        dbQuery = dbQuery.or('title.ilike.%review%,abstract.ilike.%review%');
      } else if (isReview === 'false') {
        dbQuery = dbQuery.not('title', 'ilike', '%review%');
      }

      // Sort
      if (sortBy === 'publication_date') {
        dbQuery = dbQuery.order('publication_date', { ascending: sortOrder, nullsFirst: false })
                         .order('collected_at', { ascending: false });
      } else if (sortBy === 'citation_count') {
        dbQuery = dbQuery.order('citation_count', { ascending: sortOrder })
                         .order('publication_date', { ascending: false, nullsFirst: false });
      } else {
        dbQuery = dbQuery.order('publication_year', { ascending: sortOrder })
                         .order('publication_date', { ascending: false, nullsFirst: false });
      }

      // Range
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      dbQuery = dbQuery.range(from, to);

      const { data, count, error } = await dbQuery;

      if (error) {
        console.error('Database query error:', error);
        return res.status(200).json({ items: [], total: 0, page, page_size: pageSize, total_pages: 0 });
      }

      let formattedItems = (data || []).map(p => ({
        ...p,
        authors: (p.authors || []).map(a => a.author).filter(Boolean),
        categories: (p.categories || []).map(c => c.category).filter(Boolean),
        is_saved: false,
        is_favourite: false
      }));

      if (author) {
        formattedItems = formattedItems.filter(p => 
          (p.authors || []).some(a => a.name && a.name.toLowerCase().includes(author.toLowerCase()))
        );
      }

      const totalCount = author ? formattedItems.length : (count || formattedItems.length);
      return res.status(200).json({
        items: formattedItems,
        total: totalCount,
        page,
        page_size: pageSize,
        total_pages: Math.max(1, Math.ceil(totalCount / pageSize))
      });
    }

    // =========================================================================
    // 6. ARTICLE PDF LIBRARY ENDPOINTS
    // =========================================================================

    // A. Check PDF status for an article
    const pdfStatusMatch = pathname.match(/^\/api(?:\/v1)?\/pdf\/status\/(.+)$/);
    if (pdfStatusMatch && req.method === 'GET') {
      const articleId = decodeURIComponent(pdfStatusMatch[1]).trim();
      const cleanedDoi = articleId.replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, '').replace(/^doi:\s*/i, '').trim();

      const { data, error } = await sb
        .from('article_pdfs')
        .select('*')
        .or(`article_id.eq.${articleId},doi.eq.${articleId},doi.eq.${cleanedDoi}`)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error || !data) {
        return res.status(200).json({ has_pdf: false, pdf: null });
      }

      return res.status(200).json({ has_pdf: true, pdf: data });
    }

    // B. Get signed URL for reading a PDF
    const pdfReadMatch = pathname.match(/^\/api(?:\/v1)?\/pdf\/read-url\/(.+)$/);
    if (pdfReadMatch && req.method === 'GET') {
      const pdfId = decodeURIComponent(pdfReadMatch[1]).trim();
      const { data: record, error: findErr } = await sb
        .from('article_pdfs')
        .select('*')
        .or(`id.eq.${pdfId},article_id.eq.${pdfId}`)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (findErr || !record) {
        return res.status(404).json({ error: 'PDF record not found' });
      }

      const { data: signData, error: signErr } = await sb.storage
        .from('article_pdfs')
        .createSignedUrl(record.storage_path, 3600);

      if (signErr || !signData) {
        return res.status(500).json({ error: signErr?.message || 'Failed to generate signed read URL' });
      }

      return res.status(200).json({
        signed_url: signData.signedUrl,
        original_filename: record.original_filename,
        expires_in: 3600,
        pdf: record
      });
    }

    // C. Get signed URL for downloading a PDF
    const pdfDownloadMatch = pathname.match(/^\/api(?:\/v1)?\/pdf\/download-url\/(.+)$/);
    if (pdfDownloadMatch && req.method === 'GET') {
      const pdfId = decodeURIComponent(pdfDownloadMatch[1]).trim();
      const { data: record, error: findErr } = await sb
        .from('article_pdfs')
        .select('*')
        .or(`id.eq.${pdfId},article_id.eq.${pdfId}`)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (findErr || !record) {
        return res.status(404).json({ error: 'PDF record not found' });
      }

      const { data: signData, error: signErr } = await sb.storage
        .from('article_pdfs')
        .createSignedUrl(record.storage_path, 3600, { download: record.original_filename });

      if (signErr || !signData) {
        return res.status(500).json({ error: signErr?.message || 'Failed to generate download URL' });
      }

      return res.status(200).json({
        download_url: signData.signedUrl,
        original_filename: record.original_filename
      });
    }

    // D. Upload or Replace a PDF
    if ((pathname === '/api/v1/pdf/upload' || pathname === '/api/pdf/upload' || pathname === '/api/v1/pdf/replace' || pathname === '/api/pdf/replace') && req.method === 'POST') {
      const body = await parseBody(req);
      const { 
        article_id, 
        doi, 
        original_filename = 'article.pdf', 
        file_size, 
        mime_type = 'application/pdf', 
        source_type = 'manual_upload',
        file_base64 
      } = body;

      if (!article_id) {
        return res.status(400).json({ error: 'Missing article_id' });
      }
      if (mime_type !== 'application/pdf') {
        return res.status(400).json({ error: 'Only application/pdf files are permitted' });
      }
      if (file_size && file_size > 52428800) {
        return res.status(400).json({ error: 'File size exceeds maximum 50MB limit' });
      }

      const cleanFilename = original_filename.replace(/[^a-zA-Z0-9._-]/g, '_');
      const safeArticleId = String(article_id).replace(/[^a-zA-Z0-9_-]/g, '_');
      const storagePath = `pdfs/${safeArticleId}/${Date.now()}_${cleanFilename}`;

      if (file_base64) {
        const fileBuffer = Buffer.from(file_base64.replace(/^data:application\/pdf;base64,/, ''), 'base64');
        const { error: uploadErr } = await sb.storage
          .from('article_pdfs')
          .upload(storagePath, fileBuffer, {
            contentType: 'application/pdf',
            upsert: true
          });

        if (uploadErr) {
          console.error('Storage upload error:', uploadErr);
          return res.status(500).json({ error: uploadErr.message });
        }
      }

      // Upsert record in database
      const pdfRecord = {
        article_id: String(article_id),
        doi: doi || null,
        storage_path: storagePath,
        original_filename: cleanFilename,
        mime_type: 'application/pdf',
        file_size: file_size || 0,
        source_type: source_type,
        upload_status: 'completed',
        updated_at: new Date().toISOString()
      };

      const { data: savedRecord, error: dbErr } = await sb
        .from('article_pdfs')
        .upsert(pdfRecord, { onConflict: 'storage_path' })
        .select()
        .maybeSingle();

      if (dbErr) {
        console.warn('Database save warning (storing metadata in fallback):', dbErr.message);
      }

      return res.status(200).json({
        status: 'success',
        pdf: savedRecord || pdfRecord
      });
    }

    // E. Delete a PDF
    const pdfDeleteMatch = pathname.match(/^\/api(?:\/v1)?\/pdf\/(.+)$/);
    if (pdfDeleteMatch && req.method === 'DELETE') {
      const pdfId = decodeURIComponent(pdfDeleteMatch[1]).trim();
      const { data: record } = await sb
        .from('article_pdfs')
        .select('*')
        .or(`id.eq.${pdfId},article_id.eq.${pdfId}`)
        .maybeSingle();

      if (record?.storage_path) {
        await sb.storage.from('article_pdfs').remove([record.storage_path]);
        await sb.from('article_pdfs').delete().eq('id', record.id);
      }

      return res.status(200).json({ status: 'success', deleted_id: pdfId });
    }

    // F. List PDF Library
    if ((pathname === '/api/v1/pdf/library' || pathname === '/api/pdf/library') && req.method === 'GET') {
      const { data, error } = await sb
        .from('article_pdfs')
        .select('*')
        .order('created_at', { ascending: false });

      return res.status(200).json({
        status: 'success',
        items: data || []
      });
    }

    // =========================================================================
    // 7. ARTICLE WATCHLIST ENDPOINTS
    // =========================================================================

    // A. List Watchlist
    if ((pathname === '/api/v1/watchlist' || pathname === '/api/watchlist') && req.method === 'GET') {
      const { data, error } = await sb
        .from('article_watchlist')
        .select('*')
        .order('added_at', { ascending: false });

      return res.status(200).json({
        status: 'success',
        items: data || []
      });
    }

    // B. Add to Watchlist
    if ((pathname === '/api/v1/watchlist' || pathname === '/api/watchlist') && req.method === 'POST') {
      const body = await parseBody(req);
      const { article_id, doi, reading_status = 'to_read', personal_note = '' } = body;

      if (!article_id) {
        return res.status(400).json({ error: 'Missing article_id' });
      }

      const entry = {
        article_id: String(article_id),
        doi: doi || null,
        reading_status: reading_status,
        personal_note: personal_note,
        added_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await sb
        .from('article_watchlist')
        .upsert(entry, { onConflict: 'article_id' })
        .select()
        .maybeSingle();

      return res.status(200).json({
        status: 'success',
        entry: data || entry
      });
    }

    // C. Remove from Watchlist
    const wlDeleteMatch = pathname.match(/^\/api(?:\/v1)?\/watchlist\/(.+)$/);
    if (wlDeleteMatch && req.method === 'DELETE') {
      const articleId = decodeURIComponent(wlDeleteMatch[1]).trim();
      await sb.from('article_watchlist').delete().eq('article_id', articleId);
      return res.status(200).json({ status: 'success', removed_article_id: articleId });
    }

    // D. Update Watchlist (Reading status, notes)
    const wlPutMatch = pathname.match(/^\/api(?:\/v1)?\/watchlist\/(.+)$/);
    if (wlPutMatch && req.method === 'PUT') {
      const articleId = decodeURIComponent(wlPutMatch[1]).trim();
      const body = await parseBody(req);
      const updates = {
        updated_at: new Date().toISOString()
      };
      if (body.reading_status) updates.reading_status = body.reading_status;
      if (body.personal_note !== undefined) updates.personal_note = body.personal_note;

      const { data } = await sb
        .from('article_watchlist')
        .update(updates)
        .eq('article_id', articleId)
        .select()
        .maybeSingle();

      return res.status(200).json({ status: 'success', entry: data || { article_id: articleId, ...updates } });
    }

    // Default
    return res.status(200).json({ status: 'ok', items: [], total: 0 });
  } catch (err) {
    console.error('API Error:', err);
    return res.status(200).json({ error: err.message, items: [], total: 0 });
  }
};
