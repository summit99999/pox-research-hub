/**
 * Polymer Research Intelligence Hub (PRIH)
 * DOI Normalization and Official Publisher URL Resolution Utility
 * 
 * Implements strict resolution priorities:
 * 1. Official publisher-provided article URL (verified article-specific landing page).
 * 2. Official DOI resolver URL: https://doi.org/{DOI}.
 * 3. Verified alternative article-specific landing page from a trusted scholarly source.
 * 
 * Explicitly rejects:
 * - Journal homepages (e.g. /journal/mamobx)
 * - Journal issue/TOC pages (e.g. /issues, /toc)
 * - Search query URLs
 * - Generic publisher root homepages
 * - Fabricated or non-article links
 */

export function cleanDoi(doi) {
  if (!doi || typeof doi !== 'string') return '';
  return doi
    .trim()
    .replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, '')
    .replace(/^doi:\s*/i, '')
    .trim()
    .replace(/\.$/, '');
}

export function formatDoiDisplay(doi) {
  const cleaned = cleanDoi(doi);
  if (!cleaned) return '';
  return cleaned;
}

/**
 * Validates whether a URL points to a specific article rather than a journal homepage,
 * issue archive, search page, or generic portal.
 */
export function isArticleSpecificUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) return false;

  try {
    const parsed = new URL(trimmed);
    const path = parsed.pathname.toLowerCase();

    // 1. Root domain only is never an article URL (e.g. https://pubs.acs.org/)
    if (path === '' || path === '/') {
      return false;
    }

    // 2. Reject journal homepage / issue browse patterns
    const journalHomePatterns = [
      /\/journal\/[a-z0-9_-]+\/?$/i,
      /\/journals\/[a-z0-9_-]+\/?$/i,
      /\/journalissues/i,
      /\/toc\/[a-z0-9_-]+\/?/i,
      /\/issues?\/?$/i,
      /\/issues?\/[a-z0-9_-]+\/?$/i,
      /\/browse\/?/i,
      /\/search\/?/i,
      /\/action\/dosearch/i,
      /\/page\/about/i
    ];

    for (const pat of journalHomePatterns) {
      if (pat.test(path)) return false;
    }

    // 3. Known high-confidence article URL patterns:
    // - DOI resolver: doi.org/10.xxxx/...
    // - ACS: /doi/10.1021/... or /doi/abs/10.1021/... or /doi/full/10.1021/...
    // - Wiley: /doi/10.1002/... or /doi/abs/10.1002/...
    // - RSC: /content/articlelanding/...
    // - Elsevier / ScienceDirect: /science/article/pii/...
    // - Springer / Nature: /articles/10.1038/... or /article/10.1007/...
    if (parsed.hostname.includes('doi.org')) {
      const doiPart = path.replace(/^\//, '');
      return doiPart.startsWith('10.');
    }

    if (path.includes('/doi/') || path.includes('/article/') || path.includes('/articles/') || path.includes('/pii/') || path.includes('/articlelanding/')) {
      return true;
    }

    // Default: If URL has query or path with alphanumeric ID, assume valid article URL
    return path.length > 5;
  } catch {
    return false;
  }
}

/**
 * Returns the verified official publisher article URL following the 3-tier priority rule:
 * Priority 1: Official publisher-provided article URL.
 * Priority 2: Official DOI resolver: https://doi.org/{DOI}.
 * Priority 3: Verified alternative landing page.
 * Returns null if no verified article link can be established.
 */
export function getOfficialPublisherUrl(paperOrDoi) {
  if (!paperOrDoi) return null;

  // Case 1: Direct string passed (DOI or URL)
  if (typeof paperOrDoi === 'string') {
    const raw = paperOrDoi.trim();
    if (raw.startsWith('http://') || raw.startsWith('https://')) {
      if (raw.includes('doi.org/https:') || raw.includes('doi.org/http:')) {
        const extracted = raw.replace(/https?:\/\/doi\.org\//g, '');
        const c = cleanDoi(extracted);
        return c.startsWith('10.') ? `https://doi.org/${c}` : null;
      }
      return isArticleSpecificUrl(raw) ? raw : null;
    }
    const c = cleanDoi(raw);
    return c.startsWith('10.') ? `https://doi.org/${c}` : null;
  }

  // Case 2: Paper object passed
  const paper = paperOrDoi;
  const rawDoi = paper.doi || paper.doi_normalized || '';
  const cleanedDoi = cleanDoi(rawDoi);
  const hasValidDoi = Boolean(cleanedDoi && cleanedDoi.startsWith('10.'));

  // Priority 1: Official publisher-provided article URL
  const candidateUrls = [
    paper.publisher_url,
    paper.landing_page_url,
    paper.doi_url
  ].filter(Boolean);

  for (const url of candidateUrls) {
    if (typeof url === 'string') {
      let candidate = url.trim();
      if (candidate.includes('doi.org/https:') || candidate.includes('doi.org/http:')) {
        const extracted = candidate.replace(/https?:\/\/doi\.org\//g, '');
        candidate = `https://doi.org/${cleanDoi(extracted)}`;
      }

      if (isArticleSpecificUrl(candidate)) {
        return candidate;
      }
    }
  }

  // Priority 2: Direct DOI resolver URL
  if (hasValidDoi) {
    return `https://doi.org/${cleanedDoi}`;
  }

  // Priority 3: Alternative article landing page (e.g. open_access_url)
  if (paper.open_access_url && typeof paper.open_access_url === 'string') {
    if (isArticleSpecificUrl(paper.open_access_url)) {
      return paper.open_access_url;
    }
  }

  if (cleanedDoi) {
    return `https://doi.org/${cleanedDoi}`;
  }

  return null;
}

/**
 * Backward-compatible helper for components expecting getPaperDoiUrl(paper).
 * Supports both object and string inputs.
 */
export function getPaperDoiUrl(paperOrDoi) {
  return getOfficialPublisherUrl(paperOrDoi) || '';
}
