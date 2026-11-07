/**
 * Polymer Research Intelligence Hub (PRIH)
 * Advanced Boolean Search Engine & Multi-Provider Ingestion Engine
 * 
 * Supports:
 * - Boolean AND, OR, NOT (case-insensitive)
 * - Exact phrases with quotes: "poly(2-oxazoline)", "cationic ring-opening polymerization"
 * - Parentheses and nested expressions: ((polymer OR copolymer) AND (ROS OR oxidation)) NOT review
 * - Field-specific prefixes: title:, abstract:, author:, journal:, doi:, year:
 * - Universal Polymer scope vs Dedicated POx/POzi scope
 * - Multi-provider translation & live querying (OpenAlex, Crossref, Europe PMC)
 * - High-fidelity deduplication (DOI normalization + title/author/year fuzzy hash)
 */

import { cleanDoi } from './doiHelper.js';

// ============================================================================
// 1. BOOLEAN QUERY TOKENIZER & AST PARSER
// ============================================================================

export const TOKEN_TYPES = {
  TERM: 'TERM',
  PHRASE: 'PHRASE',
  FIELD_TERM: 'FIELD_TERM',
  AND: 'AND',
  OR: 'OR',
  NOT: 'NOT',
  LPAREN: 'LPAREN',
  RPAREN: 'RPAREN'
};

/**
 * Tokenize a raw search string
 */
export function tokenizeQuery(rawQuery = '') {
  const query = rawQuery.trim();
  if (!query) return [];

  const tokens = [];
  let i = 0;

  while (i < query.length) {
    const char = query[i];

    // Whitespace
    if (/\s/.test(char)) {
      i++;
      continue;
    }

    // Parentheses
    if (char === '(') {
      tokens.push({ type: TOKEN_TYPES.LPAREN, value: '(' });
      i++;
      continue;
    }
    if (char === ')') {
      tokens.push({ type: TOKEN_TYPES.RPAREN, value: ')' });
      i++;
      continue;
    }

    // Quoted exact phrase
    if (char === '"' || char === "'") {
      const quoteChar = char;
      let phrase = '';
      i++; // skip opening quote
      while (i < query.length && query[i] !== quoteChar) {
        phrase += query[i];
        i++;
      }
      if (i < query.length) i++; // skip closing quote
      if (phrase.trim()) {
        tokens.push({ type: TOKEN_TYPES.PHRASE, value: phrase.trim() });
      }
      continue;
    }

    // Check for field-specific prefixes e.g. title:hydrogel, abstract:"living polymerization"
    const fieldMatch = query.slice(i).match(/^(title|abstract|author|journal|doi|year):/i);
    if (fieldMatch) {
      const field = fieldMatch[1].toLowerCase();
      i += fieldMatch[0].length;

      // Check if value is quoted
      if (i < query.length && (query[i] === '"' || query[i] === "'")) {
        const quoteChar = query[i];
        let val = '';
        i++;
        while (i < query.length && query[i] !== quoteChar) {
          val += query[i];
          i++;
        }
        if (i < query.length) i++;
        tokens.push({ type: TOKEN_TYPES.FIELD_TERM, field, value: val.trim() });
        continue;
      } else {
        // Unquoted word
        let val = '';
        while (i < query.length && !/[\s()]/.test(query[i])) {
          val += query[i];
          i++;
        }
        if (val.trim()) {
          tokens.push({ type: TOKEN_TYPES.FIELD_TERM, field, value: val.trim() });
        }
        continue;
      }
    }

    // Regular word or operator
    let word = '';
    while (i < query.length && !/[\s()]/.test(query[i]) && query[i] !== '"' && query[i] !== "'") {
      word += query[i];
      i++;
    }

    if (!word) {
      i++;
      continue;
    }

    const upper = word.toUpperCase();
    if (upper === 'AND' || upper === '&&') {
      tokens.push({ type: TOKEN_TYPES.AND, value: 'AND' });
    } else if (upper === 'OR' || upper === '||') {
      tokens.push({ type: TOKEN_TYPES.OR, value: 'OR' });
    } else if (upper === 'NOT' || word === '!') {
      tokens.push({ type: TOKEN_TYPES.NOT, value: 'NOT' });
    } else {
      tokens.push({ type: TOKEN_TYPES.TERM, value: word });
    }
  }

  // Insert implicit AND between adjacent terms/phrases/groups without explicit operators
  const withImplicitAnd = [];
  for (let k = 0; k < tokens.length; k++) {
    const cur = tokens[k];
    withImplicitAnd.push(cur);

    if (k < tokens.length - 1) {
      const next = tokens[k + 1];
      const isCurOperand = [TOKEN_TYPES.TERM, TOKEN_TYPES.PHRASE, TOKEN_TYPES.FIELD_TERM, TOKEN_TYPES.RPAREN].includes(cur.type);
      const isNextOperand = [TOKEN_TYPES.TERM, TOKEN_TYPES.PHRASE, TOKEN_TYPES.FIELD_TERM, TOKEN_TYPES.LPAREN, TOKEN_TYPES.NOT].includes(next.type);

      if (isCurOperand && isNextOperand && next.type !== TOKEN_TYPES.NOT) {
        withImplicitAnd.push({ type: TOKEN_TYPES.AND, value: 'AND', implicit: true });
      }
    }
  }

  return withImplicitAnd;
}

/**
 * Validate query syntax & return helpful human explanation
 */
export function validateQuerySyntax(rawQuery = '') {
  const query = rawQuery.trim();
  if (!query) {
    return {
      isValid: true,
      error: null,
      tokensCount: 0,
      explanation: 'Empty query (all literature in active scope will be matched).'
    };
  }

  // Check quotes balance
  const singleQuotes = (query.match(/'/g) || []).length;
  const doubleQuotes = (query.match(/"/g) || []).length;
  if (doubleQuotes % 2 !== 0) {
    return {
      isValid: false,
      error: 'Unclosed double quotation mark ("). Please close all exact phrase quotes.',
      explanation: 'Error: Unbalanced quotes'
    };
  }
  if (singleQuotes % 2 !== 0) {
    return {
      isValid: false,
      error: "Unclosed single quotation mark ('). Please close all exact phrase quotes.",
      explanation: 'Error: Unbalanced quotes'
    };
  }

  // Check parentheses balance
  let parenDepth = 0;
  for (let char of query) {
    if (char === '(') parenDepth++;
    if (char === ')') parenDepth--;
    if (parenDepth < 0) {
      return {
        isValid: false,
        error: 'Unexpected closing parenthesis ")" without corresponding open parenthesis.',
        explanation: 'Error: Mismatched parentheses'
      };
    }
  }
  if (parenDepth !== 0) {
    return {
      isValid: false,
      error: `Missing ${parenDepth} closing parenthesis ")".`,
      explanation: 'Error: Unclosed parentheses'
    };
  }

  const tokens = tokenizeQuery(query);
  const operatorCount = tokens.filter(t => [TOKEN_TYPES.AND, TOKEN_TYPES.OR, TOKEN_TYPES.NOT].includes(t.type) && !t.implicit).length;
  const operandCount = tokens.filter(t => [TOKEN_TYPES.TERM, TOKEN_TYPES.PHRASE, TOKEN_TYPES.FIELD_TERM].includes(t.type)).length;

  return {
    isValid: true,
    error: null,
    tokensCount: tokens.length,
    operandCount,
    operatorCount,
    explanation: operatorCount > 0 
      ? `Valid Boolean Expression (${operandCount} terms/phrases, ${operatorCount} logical operators)`
      : `Standard Keyword/Phrase Search (${operandCount} terms)`
  };
}

/**
 * Recursive descent parser to build AST from tokens
 * Grammar:
 * Expression := OrExpr
 * OrExpr     := AndExpr ( 'OR' AndExpr )*
 * AndExpr    := NotExpr ( 'AND' NotExpr )*
 * NotExpr    := 'NOT'? Primary
 * Primary    := Term | Phrase | FieldTerm | '(' Expression ')'
 */
export function parseQueryToAST(rawQuery = '') {
  const tokens = tokenizeQuery(rawQuery);
  if (!tokens || tokens.length === 0) return null;

  let pos = 0;

  function peek() {
    return tokens[pos] || null;
  }

  function consume(expectedType) {
    const cur = peek();
    if (!cur) return null;
    if (expectedType && cur.type !== expectedType) {
      return null;
    }
    pos++;
    return cur;
  }

  function parseExpression() {
    return parseOr();
  }

  function parseOr() {
    let node = parseAnd();
    while (peek() && peek().type === TOKEN_TYPES.OR) {
      const op = consume(TOKEN_TYPES.OR);
      const right = parseAnd();
      node = {
        type: 'OR',
        left: node,
        right: right
      };
    }
    return node;
  }

  function parseAnd() {
    let node = parseNot();
    while (peek() && peek().type === TOKEN_TYPES.AND) {
      const op = consume(TOKEN_TYPES.AND);
      const right = parseNot();
      node = {
        type: 'AND',
        left: node,
        right: right
      };
    }
    return node;
  }

  function parseNot() {
    if (peek() && peek().type === TOKEN_TYPES.NOT) {
      consume(TOKEN_TYPES.NOT);
      const operand = parsePrimary();
      return {
        type: 'NOT',
        operand: operand
      };
    }
    return parsePrimary();
  }

  function parsePrimary() {
    const token = peek();
    if (!token) return null;

    if (token.type === TOKEN_TYPES.LPAREN) {
      consume(TOKEN_TYPES.LPAREN);
      const expr = parseExpression();
      consume(TOKEN_TYPES.RPAREN);
      return {
        type: 'GROUP',
        expr: expr
      };
    }

    if (token.type === TOKEN_TYPES.TERM) {
      consume();
      return {
        type: 'TERM',
        value: token.value.toLowerCase()
      };
    }

    if (token.type === TOKEN_TYPES.PHRASE) {
      consume();
      return {
        type: 'PHRASE',
        value: token.value.toLowerCase()
      };
    }

    if (token.type === TOKEN_TYPES.FIELD_TERM) {
      consume();
      return {
        type: 'FIELD_TERM',
        field: token.field,
        value: token.value.toLowerCase()
      };
    }

    consume();
    return null;
  }

  try {
    return parseExpression();
  } catch (e) {
    console.debug('AST parse error:', e);
    return null;
  }
}

// ============================================================================
// 2. CLIENT-SIDE AST EVALUATOR AGAINST PAPERS
// ============================================================================

/**
 * Check if a paper matches an AST node
 */
export function evaluatePaperAgainstAST(paper, node, fieldTarget = 'all') {
  if (!node) return true;

  switch (node.type) {
    case 'AND': {
      const left = evaluatePaperAgainstAST(paper, node.left, fieldTarget);
      if (!left) return false;
      return evaluatePaperAgainstAST(paper, node.right, fieldTarget);
    }

    case 'OR': {
      const left = evaluatePaperAgainstAST(paper, node.left, fieldTarget);
      if (left) return true;
      return evaluatePaperAgainstAST(paper, node.right, fieldTarget);
    }

    case 'NOT': {
      return !evaluatePaperAgainstAST(paper, node.operand, fieldTarget);
    }

    case 'GROUP': {
      return evaluatePaperAgainstAST(paper, node.expr, fieldTarget);
    }

    case 'TERM':
    case 'PHRASE': {
      return paperContainsText(paper, node.value, fieldTarget, node.type === 'PHRASE');
    }

    case 'FIELD_TERM': {
      return paperContainsText(paper, node.value, node.field, true);
    }

    default:
      return true;
  }
}

/**
 * Check if target text exists in specified paper fields
 */
function paperContainsText(paper, queryText, fieldTarget = 'all', isPhrase = false) {
  if (!queryText) return true;
  const q = queryText.toLowerCase();

  const title = (paper.title || '').toLowerCase();
  const abs = (paper.abstract || '').toLowerCase();
  const journal = (paper.journal || '').toLowerCase();
  const publisher = (paper.publisher || '').toLowerCase();
  const doi = (paper.doi || '').toLowerCase();
  const authors = (paper.authors || []).map(a => (a.name || a.author || '').toLowerCase()).join(' ');

  switch (fieldTarget) {
    case 'title':
      return title.includes(q);
    case 'abstract':
      return abs.includes(q);
    case 'title_abstract':
      return title.includes(q) || abs.includes(q);
    case 'author':
      return authors.includes(q);
    case 'journal':
      return journal.includes(q);
    case 'publisher':
      return publisher.includes(q);
    case 'doi':
      return doi.includes(q);
    case 'year':
      return String(paper.publication_year || '') === q;
    case 'all':
    default:
      return title.includes(q) || abs.includes(q) || journal.includes(q) || authors.includes(q) || doi.includes(q) || publisher.includes(q);
  }
}

// ============================================================================
// 3. RESEARCH SCOPE ENFORCEMENT (POx DEDICATED vs UNIVERSAL UNBIASED)
// ============================================================================

export const ENGINE_SCOPES = {
  POX: 'pox',
  UNIVERSAL: 'universal'
};

const POX_CORE_TERMS = [
  'oxazoline',
  'oxazine',
  'poly(2-oxazoline',
  'poly(2-oxazine',
  'polyoxazoline',
  'polyoxazine',
  'crop',
  'cationic ring-opening',
  'imino ether',
  '2-oxazoline',
  '2-oxazine',
  'pmox',
  'peox',
  'pippox',
  'pnppox',
  'pbupox',
  'pmeozi',
  'petozi'
];

/**
 * Determines whether a paper belongs to the POx/POzi dedicated scope
 */
export function isPaperPOxRelevant(paper) {
  if (!paper) return false;
  if (paper.is_pox_relevant === true) return true;
  if (paper.is_pox_relevant === false) return false;

  const text = `${paper.title || ''} ${paper.abstract || ''} ${paper.journal || ''}`.toLowerCase();
  return POX_CORE_TERMS.some(t => text.includes(t));
}

/**
 * Determines whether a paper belongs to the Universal Polymer scope
 * (Always true for all valid polymer science publications)
 */
export function isPaperUniversalRelevant(paper) {
  if (!paper) return false;
  return true; // The universal engine covers the complete field of polymer research
}

// ============================================================================
// 4. PROVIDER QUERY TRANSLATORS (OpenAlex, Crossref, Europe PMC)
// ============================================================================

/**
 * Translates Boolean query and filters into OpenAlex search parameters
 */
export function translateToOpenAlex({ query = '', yearFrom, yearTo, journal = '', engine = ENGINE_SCOPES.UNIVERSAL, page = 1, pageSize = 25 }) {
  let searchStr = query.trim();

  // If in dedicated POx engine, ensure query includes POx scope without restricting user
  if (engine === ENGINE_SCOPES.POX) {
    if (!searchStr) {
      searchStr = '"poly(2-oxazoline)" OR "poly(2-oxazine)" OR "2-oxazoline" OR CROP';
    } else {
      const isAlreadyPOx = POX_CORE_TERMS.some(t => searchStr.toLowerCase().includes(t));
      if (!isAlreadyPOx) {
        searchStr = `(${searchStr}) AND ("poly(2-oxazoline)" OR "poly(2-oxazine)" OR "2-oxazoline" OR "2-oxazine" OR CROP)`;
      }
    }
  }

  const filters = [];

  // Historical Year Coverage (Supports any start year e.g. 1950, 1980, 2000)
  if (yearFrom && yearTo) {
    filters.push(`publication_year:${yearFrom}-${yearTo}`);
  } else if (yearFrom) {
    filters.push(`publication_year:>${yearFrom - 1}`);
  } else if (yearTo) {
    filters.push(`publication_year:<${yearTo + 1}`);
  }

  // OpenAlex works endpoint
  const params = new URLSearchParams({
    page: String(page),
    per_page: String(Math.min(pageSize, 50)),
    sort: 'publication_date:desc'
  });

  if (searchStr) {
    params.set('search', searchStr);
  }

  if (filters.length > 0) {
    params.set('filter', filters.join(','));
  }

  return `https://api.openalex.org/works?${params.toString()}`;
}

/**
 * Translates query and filters to Crossref REST API
 */
export function translateToCrossref({ query = '', yearFrom, yearTo, journal = '', engine = ENGINE_SCOPES.UNIVERSAL, page = 1, pageSize = 25 }) {
  let searchStr = query.trim();

  if (engine === ENGINE_SCOPES.POX) {
    if (!searchStr) {
      searchStr = 'poly(2-oxazoline) OR poly(2-oxazine)';
    } else {
      const isAlreadyPOx = POX_CORE_TERMS.some(t => searchStr.toLowerCase().includes(t));
      if (!isAlreadyPOx) {
        searchStr = `${searchStr} polyoxazoline`;
      }
    }
  }

  const offset = (page - 1) * pageSize;
  const params = new URLSearchParams({
    query: searchStr || 'polymer',
    rows: String(Math.min(pageSize, 50)),
    offset: String(offset),
    sort: 'published',
    order: 'desc'
  });

  const filters = [];
  if (yearFrom) {
    filters.push(`from-pub-date:${yearFrom}-01-01`);
  }
  if (yearTo) {
    filters.push(`until-pub-date:${yearTo}-12-31`);
  }
  if (journal) {
    params.set('query.container-title', journal);
  }

  if (filters.length > 0) {
    params.set('filter', filters.join(','));
  }

  return `https://api.crossref.org/works?${params.toString()}`;
}

/**
 * Translates query and filters to Europe PMC REST API
 */
export function translateToEuropePMC({ query = '', yearFrom, yearTo, journal = '', engine = ENGINE_SCOPES.UNIVERSAL, page = 1, pageSize = 25 }) {
  const parts = [];

  let searchStr = query.trim();
  if (engine === ENGINE_SCOPES.POX) {
    if (!searchStr) {
      searchStr = '("poly(2-oxazoline)" OR "poly(2-oxazine)" OR "2-oxazoline")';
    } else {
      const isAlreadyPOx = POX_CORE_TERMS.some(t => searchStr.toLowerCase().includes(t));
      if (!isAlreadyPOx) {
        searchStr = `(${searchStr}) AND ("poly(2-oxazoline)" OR "poly(2-oxazine)")`;
      }
    }
  }

  if (searchStr) {
    parts.push(searchStr);
  } else {
    parts.push('polymer');
  }

  if (journal) {
    parts.push(`JOURNAL:"${journal}"`);
  }

  if (yearFrom && yearTo) {
    parts.push(`PUB_YEAR:[${yearFrom} TO ${yearTo}]`);
  } else if (yearFrom) {
    parts.push(`PUB_YEAR:[${yearFrom} TO 2026]`);
  }

  const fullQuery = parts.join(' AND ');
  const params = new URLSearchParams({
    query: fullQuery,
    format: 'json',
    pageSize: String(Math.min(pageSize, 50)),
    page: String(page),
    resultType: 'core'
  });

  return `https://www.ebi.ac.uk/europepmc/webservices/rest/search?${params.toString()}`;
}

// ============================================================================
// 5. RECORD NORMALIZATION & MULTI-PROVIDER DEDUPLICATION
// ============================================================================

/**
 * Normalizes OpenAlex raw work record
 */
export function normalizeOpenAlexRecord(w) {
  if (!w) return null;

  const rawDoi = w.doi || w.primary_location?.landing_page_url || '';
  const sanitizedDoi = cleanDoi(rawDoi);

  // Invert OpenAlex abstract if stored as inverted index
  let abstract = '';
  if (w.abstract_inverted_index) {
    try {
      const wordPositions = [];
      for (const [word, positions] of Object.entries(w.abstract_inverted_index)) {
        positions.forEach(pos => wordPositions.push({ word, pos }));
      }
      wordPositions.sort((a, b) => a.pos - b.pos);
      abstract = wordPositions.map(wp => wp.word).join(' ');
    } catch {
      abstract = '';
    }
  }

  const authors = (w.authorships || []).map(a => ({
    name: a.author?.display_name || 'Researcher',
    affiliation: a.institutions?.[0]?.display_name || 'Academic Institution'
  }));

  const journal = w.primary_location?.source?.display_name || w.host_venue?.display_name || 'Scientific Journal';
  const pubYear = w.publication_year || new Date().getFullYear();

  const paper = {
    id: w.id ? w.id.replace('https://openalex.org/', '') : `oa-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    doi: sanitizedDoi,
    doi_normalized: sanitizedDoi.toLowerCase(),
    doi_url: sanitizedDoi.startsWith('10.') ? `https://doi.org/${sanitizedDoi}` : (w.doi || ''),
    title: w.title || 'Untitled Polymer Investigation',
    abstract: abstract || 'Abstract available via primary publisher DOI link.',
    publication_year: pubYear,
    publication_date: w.publication_date || `${pubYear}-01-01`,
    journal: journal,
    publisher: w.primary_location?.source?.host_organization_name || 'Peer-Reviewed Publisher',
    landing_page_url: w.doi || w.primary_location?.landing_page_url || '',
    open_access_url: w.open_access?.oa_url || '',
    citation_count: w.cited_by_count || 0,
    source: 'openalex',
    provenance: ['OpenAlex'],
    collected_at: new Date().toISOString(),
    authors: authors.length > 0 ? authors : [{ name: 'Polymer Research Team', affiliation: 'Research Institute' }],
    categories: []
  };

  paper.is_pox_relevant = isPaperPOxRelevant(paper);
  paper.is_universal_relevant = true;

  return paper;
}

/**
 * Normalizes Crossref raw item record
 */
export function normalizeCrossrefRecord(item) {
  if (!item) return null;

  const rawDoi = item.DOI || '';
  const sanitizedDoi = cleanDoi(rawDoi);

  let pubYear = new Date().getFullYear();
  if (item.published?.['date-parts']?.[0]?.[0]) {
    pubYear = item.published['date-parts'][0][0];
  } else if (item.created?.['date-parts']?.[0]?.[0]) {
    pubYear = item.created['date-parts'][0][0];
  }

  const authors = (item.author || []).map(a => ({
    name: [a.given, a.family].filter(Boolean).join(' ') || a.name || 'Researcher',
    affiliation: a.affiliation?.[0]?.name || 'Research Institution'
  }));

  const journal = item['container-title']?.[0] || 'Scientific Journal';
  const title = Array.isArray(item.title) ? item.title[0] : (item.title || 'Untitled Polymer Research');

  const paper = {
    id: `cr-${sanitizedDoi || Math.random().toString(36).substring(2, 9)}`,
    doi: sanitizedDoi,
    doi_normalized: sanitizedDoi.toLowerCase(),
    doi_url: sanitizedDoi.startsWith('10.') ? `https://doi.org/${sanitizedDoi}` : (item.URL || ''),
    title: title,
    abstract: (item.abstract || '').replace(/<[^>]*>?/gm, '').trim() || 'Abstract available via publisher DOI.',
    publication_year: pubYear,
    publication_date: `${pubYear}-01-01`,
    journal: journal,
    publisher: item.publisher || 'Peer-Reviewed Publisher',
    landing_page_url: item.URL || (sanitizedDoi ? `https://doi.org/${sanitizedDoi}` : ''),
    open_access_url: '',
    citation_count: item['is-referenced-by-count'] || 0,
    source: 'crossref',
    provenance: ['Crossref'],
    collected_at: new Date().toISOString(),
    authors: authors.length > 0 ? authors : [{ name: 'Polymer Research Team', affiliation: 'Research Institute' }],
    categories: []
  };

  paper.is_pox_relevant = isPaperPOxRelevant(paper);
  paper.is_universal_relevant = true;

  return paper;
}

/**
 * Normalizes Europe PMC raw item record
 */
export function normalizeEuropePMCRecord(res) {
  if (!res) return null;

  const rawDoi = res.doi || '';
  const sanitizedDoi = cleanDoi(rawDoi);
  const pubYear = parseInt(res.pubYear, 10) || new Date().getFullYear();

  const authors = (res.authorString || '').split(',').map(name => ({
    name: name.trim(),
    affiliation: 'Biomedical / Polymer Research Center'
  })).filter(a => a.name);

  const paper = {
    id: `epmc-${res.id || Math.random().toString(36).substring(2, 9)}`,
    doi: sanitizedDoi,
    doi_normalized: sanitizedDoi.toLowerCase(),
    doi_url: sanitizedDoi.startsWith('10.') ? `https://doi.org/${sanitizedDoi}` : '',
    title: res.title || 'Polymer Science Research',
    abstract: res.abstractText || 'Abstract available via publisher DOI.',
    publication_year: pubYear,
    publication_date: `${pubYear}-01-01`,
    journal: res.journalTitle || 'Europe PMC Indexed Journal',
    publisher: 'Peer-Reviewed Publisher',
    landing_page_url: sanitizedDoi ? `https://doi.org/${sanitizedDoi}` : '',
    open_access_url: res.fullTextUrlList?.fullTextUrl?.[0]?.url || '',
    citation_count: res.citedByCount || 0,
    source: 'europepmc',
    provenance: ['Europe PMC'],
    collected_at: new Date().toISOString(),
    authors: authors.length > 0 ? authors : [{ name: 'Polymer Research Team', affiliation: 'Research Center' }],
    categories: []
  };

  paper.is_pox_relevant = isPaperPOxRelevant(paper);
  paper.is_universal_relevant = true;

  return paper;
}

/**
 * Deduplicate records across providers
 */
export function deduplicatePapers(papers = []) {
  const doiMap = new Map();
  const titleMap = new Map();
  const deduplicated = [];

  for (const paper of papers) {
    if (!paper) continue;

    // 1. Check DOI match
    const clean = cleanDoi(paper.doi || '');
    if (clean && clean.startsWith('10.')) {
      const normalizedDoi = clean.toLowerCase();
      if (doiMap.has(normalizedDoi)) {
        // Merge metadata provenance
        const existing = doiMap.get(normalizedDoi);
        if (paper.source && !existing.provenance.includes(paper.source)) {
          existing.provenance.push(paper.source);
        }
        if (!existing.abstract || existing.abstract.length < 50) {
          existing.abstract = paper.abstract || existing.abstract;
        }
        if ((paper.citation_count || 0) > (existing.citation_count || 0)) {
          existing.citation_count = paper.citation_count;
        }
        continue;
      } else {
        paper.doi = clean;
        paper.doi_normalized = normalizedDoi;
        paper.provenance = paper.provenance || [paper.source || 'Database'];
        doiMap.set(normalizedDoi, paper);
        deduplicated.push(paper);
        continue;
      }
    }

    // 2. Fallback fuzzy title + first author surname + year matching
    const normTitle = (paper.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const firstAuthor = (paper.authors?.[0]?.name || '').toLowerCase().split(' ').pop() || '';
    const fallbackKey = `${normTitle.slice(0, 40)}_${firstAuthor}_${paper.publication_year || ''}`;

    if (fallbackKey.length > 10 && titleMap.has(fallbackKey)) {
      const existing = titleMap.get(fallbackKey);
      if (paper.source && !existing.provenance.includes(paper.source)) {
        existing.provenance.push(paper.source);
      }
      continue;
    }

    paper.provenance = paper.provenance || [paper.source || 'Database'];
    titleMap.set(fallbackKey, paper);
    deduplicated.push(paper);
  }

  return deduplicated;
}

// ============================================================================
// 6. LIVE MULTI-PROVIDER PARALLEL SEARCH AGGREGATOR
// ============================================================================

export async function searchLiveProviders({
  query = '',
  yearFrom = null,
  yearTo = null,
  journal = '',
  engine = ENGINE_SCOPES.UNIVERSAL,
  providers = ['openalex', 'crossref', 'europepmc'],
  pageSize = 20
}) {
  const requests = [];

  if (providers.includes('openalex')) {
    const url = translateToOpenAlex({ query, yearFrom, yearTo, journal, engine, pageSize });
    requests.push(
      fetch(url)
        .then(res => res.ok ? res.json() : null)
        .then(data => (data?.results || []).map(normalizeOpenAlexRecord).filter(Boolean))
        .catch(err => {
          console.debug('OpenAlex fetch failed:', err);
          return [];
        })
    );
  }

  if (providers.includes('crossref')) {
    const url = translateToCrossref({ query, yearFrom, yearTo, journal, engine, pageSize });
    requests.push(
      fetch(url)
        .then(res => res.ok ? res.json() : null)
        .then(data => (data?.message?.items || []).map(normalizeCrossrefRecord).filter(Boolean))
        .catch(err => {
          console.debug('Crossref fetch failed:', err);
          return [];
        })
    );
  }

  if (providers.includes('europepmc')) {
    const url = translateToEuropePMC({ query, yearFrom, yearTo, journal, engine, pageSize });
    requests.push(
      fetch(url)
        .then(res => res.ok ? res.json() : null)
        .then(data => (data?.resultList?.result || []).map(normalizeEuropePMCRecord).filter(Boolean))
        .catch(err => {
          console.debug('Europe PMC fetch failed:', err);
          return [];
        })
    );
  }

  const resultsByProvider = await Promise.allSettled(requests);
  const collected = [];

  resultsByProvider.forEach(p => {
    if (p.status === 'fulfilled' && Array.isArray(p.value)) {
      collected.push(...p.value);
    }
  });

  return deduplicatePapers(collected);
}
