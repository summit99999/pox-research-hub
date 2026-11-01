/**
 * DOI Normalization and URL Resolution Utility
 * Ensures all DOIs across the POx Research Hub resolve directly to the publisher
 * without double-prefixing ('https://doi.org/https://doi.org/10.xxxx') or 404 errors.
 */

export function cleanDoi(doi) {
  if (!doi) return '';
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

export function getPaperDoiUrl(paper) {
  if (!paper) return '';

  // 1. If explicit clean doi_url is present, check and sanitize
  if (paper.doi_url && typeof paper.doi_url === 'string') {
    if (paper.doi_url.includes('doi.org/https:') || paper.doi_url.includes('doi.org/http:')) {
      const extracted = paper.doi_url.replace(/https?:\/\/doi\.org\//g, '');
      return `https://doi.org/${cleanDoi(extracted)}`;
    }
    if (paper.doi_url.startsWith('http://') || paper.doi_url.startsWith('https://')) {
      return paper.doi_url;
    }
  }

  // 2. Clean DOI string
  const rawDoi = paper.doi || paper.doi_normalized || '';
  const cleaned = cleanDoi(rawDoi);

  if (cleaned && cleaned.startsWith('10.')) {
    return `https://doi.org/${cleaned}`;
  }

  // 3. Fallback to direct landing page URL
  if (paper.landing_page_url && (paper.landing_page_url.startsWith('http://') || paper.landing_page_url.startsWith('https://'))) {
    return paper.landing_page_url;
  }

  // 4. Fallback to open access URL
  if (paper.open_access_url && (paper.open_access_url.startsWith('http://') || paper.open_access_url.startsWith('https://'))) {
    return paper.open_access_url;
  }

  // 5. Fallback if cleaned is not empty
  if (cleaned) {
    return `https://doi.org/${cleaned}`;
  }

  // 6. Universal fallback: Google Scholar search
  if (paper.title) {
    return `https://scholar.google.com/scholar?q=${encodeURIComponent(paper.title)}`;
  }

  return '';
}
