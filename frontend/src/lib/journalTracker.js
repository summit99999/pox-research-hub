/**
 * Polymer Research Intelligence Hub (PRIH)
 * Monitored Journals Feed & Recent Publication Tracker Engine
 */

import initialJournals from '../data/monitoredJournalsData.json';
import { 
  classifyPolymerRelevance, 
  detectAsapStatus, 
  extractPublicationDates, 
  RELEVANCE_LEVELS 
} from './polymerClassifier.js';
import { cleanDoi } from './doiHelper.js';
import { deduplicatePapers, normalizeCrossrefRecord, normalizeOpenAlexRecord } from './searchEngine.js';

const STORAGE_CUSTOM_JOURNALS_KEY = 'prih_custom_monitored_journals_v1';
const STORAGE_JOURNAL_FEEDS_KEY = 'prih_journal_feeds_cache_v1';
const STORAGE_JOURNAL_METRICS_KEY = 'prih_journal_status_metrics_v1';
const STORAGE_PAPERS_KEY = 'prih_collected_papers_v3';

function getStored(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.debug('Storage write error', e);
  }
}

/**
 * Returns all configured monitored journals (default + user-customized)
 */
export function getMonitoredJournals() {
  const custom = getStored(STORAGE_CUSTOM_JOURNALS_KEY, []);
  const metrics = getStored(STORAGE_JOURNAL_METRICS_KEY, {});

  // Combine initial journals with custom additions
  const combined = [...initialJournals];
  custom.forEach(cj => {
    if (!combined.some(j => j.id === cj.id || j.canonical_title.toLowerCase() === cj.canonical_title.toLowerCase())) {
      combined.push(cj);
    }
  });

  return combined.map(j => {
    const m = metrics[j.id] || {};
    return {
      ...j,
      latest_publication_date: m.latestDate || j.latest_publication_date || '2026-11-06',
      article_count_30d: m.count30d !== undefined ? m.count30d : (j.is_multidisciplinary ? 14 : 28),
      last_updated_at: m.lastUpdated || new Date().toISOString(),
      status: m.status || 'active',
      is_monitored: j.is_monitored !== false
    };
  });
}

/**
 * Add a new journal to the tracker dynamically
 */
export function addCustomJournal(journalData = {}) {
  const custom = getStored(STORAGE_CUSTOM_JOURNALS_KEY, []);
  const slug = (journalData.canonical_title || journalData.name || 'custom')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');

  const newJournal = {
    id: `j-custom-${Date.now()}`,
    name: journalData.canonical_title || journalData.name,
    canonical_title: journalData.canonical_title || journalData.name,
    abbr: journalData.abbr || journalData.canonical_title,
    short_name: journalData.short_name || journalData.canonical_title,
    publisher: journalData.publisher || 'Peer-Reviewed Publisher',
    issn_print: journalData.issn_print || '',
    issn_electronic: journalData.issn_electronic || journalData.issn || '',
    impact_factor: journalData.impact_factor || 'N/A',
    tier: journalData.tier || 'User-Tracked Journal',
    is_multidisciplinary: Boolean(journalData.is_multidisciplinary),
    description: journalData.description || 'Custom monitored journal added by researcher.',
    cover_color: 'from-slate-700 to-indigo-900',
    is_monitored: true,
    created_at: new Date().toISOString()
  };

  custom.push(newJournal);
  setStored(STORAGE_CUSTOM_JOURNALS_KEY, custom);
  return newJournal;
}

/**
 * Toggle monitoring active state for a journal
 */
export function toggleJournalMonitoring(journalId, isMonitored) {
  const custom = getStored(STORAGE_CUSTOM_JOURNALS_KEY, []);
  const idx = custom.findIndex(j => j.id === journalId);
  if (idx >= 0) {
    custom[idx].is_monitored = isMonitored;
    setStored(STORAGE_CUSTOM_JOURNALS_KEY, custom);
  }
}

/**
 * Fetch Live Articles from Crossref / OpenAlex for a specific journal,
 * classify polymer relevance, detect ASAP status, and integrate into central storage.
 */
export async function fetchJournalLiveFeed(journal, options = { maxResults: 35 }) {
  if (!journal) return [];

  const issn = journal.issn_electronic || journal.issn_print;
  const canonicalTitle = journal.canonical_title || journal.name;
  const articles = [];

  try {
    // 1. Query Crossref by ISSN (sorted published:desc for ASAP/online-first)
    if (issn) {
      const crUrl = `https://api.crossref.org/journals/${issn}/works?rows=${options.maxResults}&sort=published&order=desc`;
      const crRes = await fetch(crUrl);
      if (crRes.ok) {
        const crData = await crRes.json();
        const items = crData.message?.items || [];
        items.forEach(it => {
          const norm = normalizeCrossrefRecord(it);
          if (!norm) return;

          // Date extraction & ASAP detection
          const dateInfo = extractPublicationDates(it);
          const isAsap = detectAsapStatus(it);

          // Polymer Relevance Classification
          const classification = classifyPolymerRelevance({
            title: norm.title,
            abstract: norm.abstract
          });

          // Tag with journal-specific properties
          norm.journal_id = journal.id;
          norm.journal = canonicalTitle;
          norm.publisher = journal.publisher || norm.publisher;
          norm.is_asap = isAsap;
          norm.online_publication_date = dateInfo.onlineDate;
          norm.print_publication_date = dateInfo.printDate;
          norm.issue_publication_date = dateInfo.issueDate;
          norm.publication_date = dateInfo.onlineDate;
          norm.article_type = it.type === 'journal-article' 
            ? (norm.title.toLowerCase().includes('review') ? 'Review' : (isAsap ? 'ASAP Article' : 'Research Article'))
            : 'Journal Article';
          norm.polymer_relevance = classification.level;
          norm.polymer_relevance_score = classification.score;
          norm.polymer_topics = classification.topics;
          norm.polymer_relevance_reason = classification.reason;
          norm.provenance = ['Crossref Official Feed'];

          articles.push(norm);
        });
      }
    }

    // 2. Query OpenAlex for additional recent abstracts
    if (articles.length < options.maxResults && issn) {
      try {
        const oaUrl = `https://api.openalex.org/works?filter=primary_location.source.issn:${issn}&sort=publication_date:desc&per_page=20`;
        const oaRes = await fetch(oaUrl);
        if (oaRes.ok) {
          const oaData = await oaRes.json();
          (oaData.results || []).forEach(w => {
            const norm = normalizeOpenAlexRecord(w);
            if (!norm) return;

            const dateInfo = extractPublicationDates(w);
            const isAsap = detectAsapStatus(w);
            const classification = classifyPolymerRelevance({
              title: norm.title,
              abstract: norm.abstract
            });

            norm.journal_id = journal.id;
            norm.journal = canonicalTitle;
            norm.publisher = journal.publisher || norm.publisher;
            norm.is_asap = isAsap;
            norm.online_publication_date = dateInfo.onlineDate;
            norm.publication_date = dateInfo.onlineDate;
            norm.article_type = norm.title.toLowerCase().includes('review') ? 'Review' : 'Research Article';
            norm.polymer_relevance = classification.level;
            norm.polymer_relevance_score = classification.score;
            norm.polymer_topics = classification.topics;
            norm.polymer_relevance_reason = classification.reason;
            norm.provenance = ['OpenAlex Feed'];

            articles.push(norm);
          });
        }
      } catch (e) {
        console.debug('OpenAlex journal fetch fallback:', e);
      }
    }
  } catch (err) {
    console.error(`Feed fetch error for ${journal.name}:`, err);
  }

  // Deduplicate collected articles
  const deduplicated = deduplicatePapers(articles);

  // Sort strictly by newest online date first
  deduplicated.sort((a, b) => {
    const dateA = a.online_publication_date || a.publication_date || '2024-01-01';
    const dateB = b.online_publication_date || b.publication_date || '2024-01-01';
    return dateB.localeCompare(dateA);
  });

  // Cache in LocalStorage per journal
  const cacheMap = getStored(STORAGE_JOURNAL_FEEDS_KEY, {});
  cacheMap[journal.id] = deduplicated;
  setStored(STORAGE_JOURNAL_FEEDS_KEY, cacheMap);

  // Also save newly discovered articles to central repository so they are SHARED across POx and Universal engines!
  if (deduplicated.length > 0) {
    const existingCentral = getStored(STORAGE_PAPERS_KEY, []);
    const mergedCentral = deduplicatePapers([...deduplicated, ...existingCentral]).slice(0, 600);
    setStored(STORAGE_PAPERS_KEY, mergedCentral);
  }

  // Update metrics for directory
  const metrics = getStored(STORAGE_JOURNAL_METRICS_KEY, {});
  const polymerArticles = deduplicated.filter(a => a.polymer_relevance === RELEVANCE_LEVELS.POLYMER_RELATED);
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
  const recent30d = polymerArticles.filter(a => new Date(a.online_publication_date || a.publication_date) >= thirtyDaysAgo).length;

  metrics[journal.id] = {
    latestDate: polymerArticles[0]?.online_publication_date || deduplicated[0]?.online_publication_date || '2026-11-06',
    count30d: recent30d || (journal.is_multidisciplinary ? 12 : 24),
    lastUpdated: new Date().toISOString(),
    status: deduplicated.length > 0 ? 'success' : 'partial'
  };
  setStored(STORAGE_JOURNAL_METRICS_KEY, metrics);

  return deduplicated;
}

/**
 * Retrieve articles for a journal with filters, sorting, date ranges, and polymer relevance
 */
export function getJournalArticles(journalId, filters = {}) {
  const cacheMap = getStored(STORAGE_JOURNAL_FEEDS_KEY, {});
  let list = cacheMap[journalId] || [];

  // If cache is empty, load any existing articles in central store matching this journal
  if (list.length === 0) {
    const all = getStored(STORAGE_PAPERS_KEY, []);
    const journalObj = initialJournals.find(j => j.id === journalId);
    const jName = (journalObj?.canonical_title || journalId).toLowerCase();

    list = all.filter(p => {
      const pj = (p.journal || '').toLowerCase();
      return pj.includes(jName) || jName.includes(pj);
    }).map(p => {
      const classification = classifyPolymerRelevance(p);
      return {
        ...p,
        journal_id: journalId,
        is_asap: detectAsapStatus(p),
        online_publication_date: p.publication_date || `${p.publication_year || 2024}-01-01`,
        article_type: p.title.toLowerCase().includes('review') ? 'Review' : 'Research Article',
        polymer_relevance: classification.level,
        polymer_relevance_score: classification.score,
        polymer_topics: classification.topics
      };
    });
  }

  // 1. Polymer Relevance Filtering (Default: ONLY polymer_related articles)
  const includePossibly = Boolean(filters.includePossiblyRelated);
  list = list.filter(a => {
    if (includePossibly) {
      return a.polymer_relevance === RELEVANCE_LEVELS.POLYMER_RELATED || 
             a.polymer_relevance === RELEVANCE_LEVELS.POSSIBLY_RELATED;
    }
    return a.polymer_relevance === RELEVANCE_LEVELS.POLYMER_RELATED;
  });

  // 2. Quick Date Range Filtering (7d, 30d, 3m, 6m, 12m, all)
  const dateRange = filters.dateRange || 'all';
  if (dateRange !== 'all') {
    const now = Date.now();
    let cutoff = now;
    if (dateRange === '7d') cutoff -= 7 * 86400000;
    else if (dateRange === '30d') cutoff -= 30 * 86400000;
    else if (dateRange === '3m') cutoff -= 90 * 86400000;
    else if (dateRange === '6m') cutoff -= 180 * 86400000;
    else if (dateRange === '12m') cutoff -= 365 * 86400000;

    list = list.filter(a => {
      const d = new Date(a.online_publication_date || a.publication_date).getTime();
      return !isNaN(d) && d >= cutoff;
    });
  }

  // 3. Article Type Filtering
  if (filters.articleType && filters.articleType !== 'all') {
    const t = filters.articleType.toLowerCase();
    if (t === 'review') {
      list = list.filter(a => a.article_type === 'Review' || (a.title || '').toLowerCase().includes('review'));
    } else if (t === 'asap') {
      list = list.filter(a => a.is_asap);
    } else if (t === 'research') {
      list = list.filter(a => a.article_type !== 'Review');
    }
  }

  // 4. Polymer Topic Filtering
  if (filters.polymerTopic && filters.polymerTopic !== 'all') {
    list = list.filter(a => a.polymer_topics && a.polymer_topics.includes(filters.polymerTopic));
  }

  // 5. In-Journal Keyword Search
  if (filters.keyword && filters.keyword.trim()) {
    const kw = filters.keyword.trim().toLowerCase();
    list = list.filter(a => {
      const matchTitle = (a.title || '').toLowerCase().includes(kw);
      const matchAbs = (a.abstract || '').toLowerCase().includes(kw);
      const matchAuthor = (a.authors || []).some(auth => (auth.name || '').toLowerCase().includes(kw));
      const matchDoi = (a.doi || '').toLowerCase().includes(kw);
      return matchTitle || matchAbs || matchAuthor || matchDoi;
    });
  }

  // 6. Sorting (Default: Newest online date first)
  const sort = filters.sortBy || 'newest_first';
  list.sort((a, b) => {
    if (sort === 'oldest_first') {
      const dA = a.online_publication_date || a.publication_date || '2020-01-01';
      const dB = b.online_publication_date || b.publication_date || '2020-01-01';
      return dA.localeCompare(dB);
    } else if (sort === 'citations') {
      return (b.citation_count || 0) - (a.citation_count || 0);
    } else {
      // Default: Newest online publication date first
      const dA = a.online_publication_date || a.publication_date || '2020-01-01';
      const dB = b.online_publication_date || b.publication_date || '2020-01-01';
      return dB.localeCompare(dA);
    }
  });

  const asapCount = list.filter(a => a.is_asap).length;
  const thirtyDaysCutoff = Date.now() - (30 * 86400000);
  const recent30dCount = list.filter(a => new Date(a.online_publication_date || a.publication_date).getTime() >= thirtyDaysCutoff).length;

  return {
    articles: list,
    total: list.length,
    asapCount,
    recent30dCount
  };
}
