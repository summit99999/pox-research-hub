/**
 * Polymer Research Intelligence Hub (PRIH)
 * Polymer-Specific Scientific Article Classification & ASAP Detection Engine
 */

export const RELEVANCE_LEVELS = {
  POLYMER_RELATED: 'polymer_related',
  POSSIBLY_RELATED: 'possibly_polymer_related',
  NOT_RELATED: 'not_polymer_related'
};

export const POLYMER_TOPICS = [
  'Polymer Synthesis & Polymerization',
  'Macromolecular & Polymer Chemistry',
  'Poly(2-oxazoline) & Poly(2-oxazine)',
  'Biopolymers & Biomacromolecules',
  'Functionalization & Modification',
  'Polymer Characterization & SEC/NMR',
  'Polymer Physics & Self-Assembly',
  'Stimuli-Responsive & Smart Polymers',
  'Hydrogels & Polymer Networks',
  'Nanoparticles, Micelles & Vesicles',
  'Polymer Drug & Gene Delivery',
  'Polymer Therapeutics & Biomaterials',
  'Polymer Membranes & Coatings',
  'Polymer Composites & Nanocomposites',
  'Conducting & Electronic Polymers',
  'Degradable & Sustainable Polymers',
  'Polymer Sensors & Bioelectronics'
];

// Weighted Lexicon for Evidence-Based Classification
const HIGH_WEIGHT_TERMS = [
  'polymer', 'polymerization', 'polymerized', 'polymeric', 'macromolecule', 'macromolecular',
  'copolymer', 'copolymers', 'block copolymer', 'graft copolymer', 'star polymer', 'homopolymer', 'terpolymer',
  'ring-opening polymerization', 'rop', 'crop', 'romp', 'atrp', 'raft', 'nmp', 'living radical',
  'cationic ring-opening', 'anionic polymerization', 'coordination polymerization',
  'hydrogel', 'hydrogels', 'microgel', 'nanogel', 'cryogel', 'polymer network',
  'poly(2-oxazoline', 'poly(2-oxazine', 'polyoxazoline', 'polyoxazine', 'oxazoline monomer', 'oxazine monomer',
  'polyester', 'polyolefin', 'polyacrylate', 'polymethacrylate', 'polyether', 'polyamide', 'polyimide', 'polyurethane',
  'polyethylene', 'polypropylene', 'polystyrene', 'poly(lactic acid)', 'polylactide', 'pla', 'pcl', 'plga', 'pet', 'pmma',
  'poly(ethylene glycol)', 'peg', 'peo', 'pnipam', 'poly(n-isopropylacrylamide)',
  'chitosan', 'cellulose', 'dextran', 'alginate', 'hyaluronic acid', 'biomacromolecule', 'biopolymer',
  'conducting polymer', 'conjugated polymer', 'pedot', 'polyaniline', 'polythiophene',
  'stimuli-responsive polymer', 'thermoresponsive', 'lcst', 'ucst', 'shape-memory polymer',
  'polymeric micelle', 'polymersome', 'polyplex', 'polymer electrolyte', 'vitrimer', 'covalent adaptable network'
];

const MEDIUM_WEIGHT_TERMS = [
  'monomer', 'monomers', 'initiator', 'chain transfer', 'macroinitiator', 'telomerization',
  'molecular weight distribution', 'dispersity', 'polydispersity', 'pdi', 'sec', 'gpc',
  'gel permeation', 'degree of polymerization', 'chain growth', 'step growth',
  'crosslinked', 'crosslinker', 'cross-linking', 'interpenetrating network',
  'antifouling coating', 'nanocomposite', 'biodegradable film', 'drug conjugate'
];

const PASSING_MENTION_TERMS = [
  'in a polymer matrix', 'polymeric substrate', 'polymer support', 'coated with peg',
  'pegylated', 'plastic holder', 'polymer syringe', 'polymer tube'
];

/**
 * Classifies an article's relevance to polymer science
 */
export function classifyPolymerRelevance(article = {}) {
  const title = (article.title || '').toLowerCase();
  const abs = (article.abstract || '').toLowerCase();
  const text = `${title} ${abs}`;

  if (!title && !abs) {
    return {
      level: RELEVANCE_LEVELS.NOT_RELATED,
      score: 0,
      topics: [],
      reason: 'No bibliographic text available for classification'
    };
  }

  let score = 0;
  const matchedHigh = [];
  const matchedMedium = [];

  // Check Title (Title carries 3x weight)
  HIGH_WEIGHT_TERMS.forEach(term => {
    if (title.includes(term)) {
      score += 4;
      matchedHigh.push(term);
    } else if (abs.includes(term)) {
      score += 2;
      matchedHigh.push(term);
    }
  });

  MEDIUM_WEIGHT_TERMS.forEach(term => {
    if (title.includes(term)) {
      score += 2;
      matchedMedium.push(term);
    } else if (abs.includes(term)) {
      score += 1;
      matchedMedium.push(term);
    }
  });

  // Check passing mention penalty
  const hasPassingMention = PASSING_MENTION_TERMS.some(p => text.includes(p));
  if (hasPassingMention && score <= 3) {
    score = Math.max(1, score - 2);
  }

  // Identify Topics
  const topics = [];

  if (text.includes('synthesis') || text.includes('polymerization') || text.includes('crop') || text.includes('atrp') || text.includes('raft') || text.includes('rop')) {
    topics.push('Polymer Synthesis & Polymerization');
  }
  if (text.includes('oxazoline') || text.includes('oxazine') || text.includes('pmox') || text.includes('peox') || text.includes('imino ether')) {
    topics.push('Poly(2-oxazoline) & Poly(2-oxazine)');
  }
  if (text.includes('hydrogel') || text.includes('microgel') || text.includes('cryogel') || text.includes('cross-linked network')) {
    topics.push('Hydrogels & Polymer Networks');
  }
  if (text.includes('biopolymer') || text.includes('polysaccharide') || text.includes('cellulose') || text.includes('chitosan') || text.includes('polypeptide') || text.includes('protein-polymer')) {
    topics.push('Biopolymers & Biomacromolecules');
  }
  if (text.includes('thermoresponsive') || text.includes('lcst') || text.includes('ucst') || text.includes('ros-responsive') || text.includes('photoresponsive') || text.includes('stimuli-responsive')) {
    topics.push('Stimuli-Responsive & Smart Polymers');
  }
  if (text.includes('delivery') || text.includes('micelle') || text.includes('nanocarrier') || text.includes('polyplex') || text.includes('nanomedicine')) {
    topics.push('Polymer Drug & Gene Delivery');
  }
  if (text.includes('conducting') || text.includes('conjugated') || text.includes('pedot') || text.includes('polyaniline') || text.includes('organic semiconductor')) {
    topics.push('Conducting & Electronic Polymers');
  }
  if (text.includes('recycling') || text.includes('biodegradable') || text.includes('depolymerization') || text.includes('vitrimer') || text.includes('upcycling')) {
    topics.push('Degradable & Sustainable Polymers');
  }
  if (text.includes('nanocomposite') || text.includes('graphene-polymer') || text.includes('nanocellulose composite')) {
    topics.push('Polymer Composites & Nanocomposites');
  }
  if (text.includes('membrane') || text.includes('separation') || text.includes('coating') || text.includes('antifouling')) {
    topics.push('Polymer Membranes & Coatings');
  }

  if (topics.length === 0 && score >= 3) {
    topics.push('Macromolecular & Polymer Chemistry');
  }

  // Determine Level
  let level = RELEVANCE_LEVELS.NOT_RELATED;
  let reason = '';

  if (score >= 3) {
    level = RELEVANCE_LEVELS.POLYMER_RELATED;
    reason = `High-confidence polymer research (${matchedHigh.slice(0, 3).join(', ')})`;
  } else if (score >= 1) {
    level = RELEVANCE_LEVELS.POSSIBLY_RELATED;
    reason = `Secondary or exploratory polymer focus (${matchedMedium.slice(0, 2).join(', ') || 'minor mention'})`;
  } else {
    level = RELEVANCE_LEVELS.NOT_RELATED;
    reason = 'No substantive polymer chemistry or macromolecular concepts detected';
  }

  return {
    level,
    score,
    topics,
    matchedTerms: [...new Set([...matchedHigh, ...matchedMedium])],
    reason
  };
}

/**
 * Detects whether an article is an ASAP / Online-First publication
 */
export function detectAsapStatus(rawRecord = {}) {
  // 1. Explicit ASAP subtype or URL flag
  const landingUrl = (rawRecord.landing_page_url || rawRecord.URL || rawRecord.doi_url || '').toLowerCase();
  const rawSubtype = (rawRecord.subtype || rawRecord.type || '').toLowerCase();

  if (landingUrl.includes('asap') || landingUrl.includes('online-first') || landingUrl.includes('/earlyview/')) {
    return true;
  }

  // 2. Crossref / OpenAlex format:
  // An article is ASAP / Ahead-of-Print if published online but not yet assigned to regular volume and issue
  const hasOnlineDate = Boolean(rawRecord['published-online'] || rawRecord.online_publication_date);
  const hasPrintDate = Boolean(rawRecord['published-print'] || rawRecord.print_publication_date);
  const hasVolume = Boolean(rawRecord.volume);
  const hasIssue = Boolean(rawRecord.issue);

  // If already published in print or has both volume and issue assigned, it is not ASAP
  if (hasPrintDate || (hasVolume && hasIssue)) {
    return false;
  }

  // Published online without regular volume or issue assignment
  if (hasOnlineDate && (!hasVolume || !hasIssue)) {
    return true;
  }

  // 3. Fallback flag in metadata
  if (rawRecord.is_asap === true) {
    return true;
  }

  return false;
}

/**
 * Extracts and distinguishes publication dates:
 * - online_publication_date (earliest reliable date for newest-first sorting)
 * - issue_publication_date
 * - print_publication_date
 */
export function extractPublicationDates(rawRecord = {}) {
  let onlineDate = null;
  let printDate = null;
  let issueDate = null;

  // Crossref 'published-online'
  if (rawRecord['published-online']?.['date-parts']?.[0]) {
    const parts = rawRecord['published-online']['date-parts'][0];
    onlineDate = formatDateParts(parts);
  }

  // Crossref 'published-print'
  if (rawRecord['published-print']?.['date-parts']?.[0]) {
    const parts = rawRecord['published-print']['date-parts'][0];
    printDate = formatDateParts(parts);
  }

  // OpenAlex publication_date
  if (rawRecord.publication_date) {
    onlineDate = onlineDate || rawRecord.publication_date;
  }

  // Fallbacks
  const pubYear = rawRecord.publication_year || (rawRecord.published?.['date-parts']?.[0]?.[0]) || new Date().getFullYear();
  onlineDate = onlineDate || rawRecord.online_publication_date || `${pubYear}-01-01`;

  return {
    onlineDate,
    printDate,
    issueDate: issueDate || printDate || null,
    displayDate: onlineDate,
    primarySortTimestamp: new Date(onlineDate).getTime() || Date.now()
  };
}

function formatDateParts(parts = []) {
  if (!parts || parts.length === 0) return null;
  const year = parts[0];
  const month = parts[1] ? String(parts[1]).padStart(2, '0') : '01';
  const day = parts[2] ? String(parts[2]).padStart(2, '0') : '01';
  return `${year}-${month}-${day}`;
}
