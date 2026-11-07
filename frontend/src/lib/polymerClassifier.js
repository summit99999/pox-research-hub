/**
 * Polymer Research Intelligence Hub (PRIH)
 * Strict Polymer-Only Scientific Article Classification & Knowledge Taxonomy Engine
 * 
 * Features:
 * - 4-Stage Multi-Level Evidence-Based Classification
 * - 11 Comprehensive Polymer Knowledge Families (Synthetic, Bio, Functional)
 * - Polymerization Method, Architecture, Property, and Application Detection
 * - Strict False-Positive Exclusion (PCR enzymes, substrates, background aids, non-polymer catalysis/small molecules)
 * - Exact Evidence Phrase Extraction from Title/Abstract
 * - Conservative Missing Abstract Handling
 * - ASAP & Online Publication Date Chronological Sorting
 */

export const RELEVANCE_LEVELS = {
  POLYMER_RELATED: 'polymer_related',         // Included by default (Categories A & B)
  POSSIBLY_RELATED: 'possibly_polymer_related', // Excluded by default; optional toggle (Category C)
  NOT_RELATED: 'not_polymer_related'          // Strictly excluded (Category D)
};

export const CLASSIFICATION_CATEGORIES = {
  CORE_POLYMER: 'core_polymer',             // Category A: Direct investigation of synthesis, physics, architecture
  POLYMER_APPLICATION: 'polymer_application', // Category B: Polymer as central functional platform (delivery, membranes, etc.)
  BORDERLINE: 'borderline',                 // Category C: Weak/passing mention or minor experimental material
  NOT_POLYMER: 'not_polymer'                // Category D: No meaningful polymer science contribution
};

export const POLYMER_FAMILIES = [
  'Poly(2-oxazoline)s & Cyclic Imino Ethers (POx/POzi)',
  'Polyolefins (PE, PP, PIB)',
  'Vinyl & Acrylic Polymers (PS, PMMA, PNIPAM, PVA)',
  'Polyesters & Biodegradable Polymers (PLA, PCL, PLGA, PET)',
  'Polyamides & Polypeptides (Nylon, Aramids, Polypeptoids)',
  'Polyethers & Polyalkylene Glycols (PEG, PEO, PEEK)',
  'High-Performance & Engineering Polymers (PI, PC, PU, PSU)',
  'Sulfur- & Silicon-Containing Polymers (PDMS, Polysulfides)',
  'Conducting & Conjugated Polymers (PEDOT, PANI, PPy)',
  'Natural & Biopolymers (Cellulose, Chitosan, Alginate, HA)',
  'General Macromolecules & Dynamic Networks'
];

export const POLYMERIZATION_METHODS = [
  'Radical & Controlled Radical (ATRP, RAFT, NMP)',
  'Ionic & Ring-Opening (CROP, ROP, ROMP, Anionic)',
  'Step-Growth & Polycondensation (Polyaddition, Interfacial)',
  'Photopolymerization & Radiation Curing',
  'Emulsion, Dispersion & Precipitation (PISA)',
  'Post-Polymerization Modification & Functionalization'
];

export const POLYMER_APPLICATIONS = [
  'Biomedical, Therapeutics & Drug/Gene Delivery',
  'Hydrogels, Biomaterials & Tissue Scaffolds',
  'Membranes, Separations & Water Purification',
  'Energy, Batteries & Polymer Electrolytes',
  'Coatings, Adhesives, Films & Antifouling',
  'Nanotechnology, Micelles & Nanocomposites',
  'Sustainable Polymers, Degradation & Chemical Recycling',
  'Smart, Responsive, Actuators & Soft Robotics'
];

export const POLYMER_PROPERTIES = [
  'Molecular Weight & Dispersity (SEC/GPC, MALDI)',
  'Thermal, Mechanical & Rheology (DSC, TGA, DMA)',
  'Stimuli-Responsive Transitions (LCST/UCST, ROS, pH)',
  'Self-Assembly, Phase Separation & Morphology'
];

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

// ============================================================================
// 1. COMPREHENSIVE TAXONOMY LEXICONS
// ============================================================================

// Core Polymer Indicators (Weight: +5 in Title, +3 in Abstract)
const CORE_POLYMER_TERMS = [
  'polymer', 'polymers', 'polymerization', 'polymerizations', 'polymerized', 'polymerising',
  'copolymer', 'copolymers', 'copolymerization', 'block copolymer', 'block copolymers',
  'macromolecule', 'macromolecules', 'macromolecular',
  'poly(2-oxazoline', 'poly(2-oxazine', 'polyoxazoline', 'polyoxazine', 'petox', 'pmox', 'piprox',
  'cationic ring-opening polymerization', 'crop', 'ring-opening polymerization', 'rop', 'romp',
  'atom transfer radical polymerization', 'atrp', 'reversible addition-fragmentation', 'raft polymerization',
  'nitroxide-mediated polymerization', 'nmp', 'living radical polymerization', 'controlled radical polymerization',
  'living polymerization', 'anionic polymerization', 'cationic polymerization',
  'polycondensation', 'step-growth polymerization', 'photopolymerization',
  'polymerization-induced self-assembly', 'pisa',
  'hydrogel', 'hydrogels', 'microgel', 'microgels', 'nanogel', 'nanogels', 'polymer network', 'polymer networks',
  'polyester', 'polyesters', 'polyolefin', 'polyolefins', 'polyacrylate', 'polyacrylates', 'polymethacrylate',
  'polyacrylamide', 'poly(acrylic acid)', 'poly(methyl methacrylate)', 'pmma', 'polystyrene',
  'poly(lactic acid)', 'polylactide', 'pla', 'plga', 'polycaprolactone', 'pcl', 'poly(ethylene glycol)', 'peg',
  'polyurethane', 'polyurethanes', 'polyimide', 'polyimides', 'polycarbonate', 'polycarbonates',
  'chitosan', 'cellulose', 'nanocellulose', 'alginate', 'hyaluronic acid', 'biomacromolecule',
  'conducting polymer', 'conjugated polymer', 'pedot', 'polyaniline', 'polythiophene',
  'vitrimer', 'vitrimers', 'covalent adaptable network', 'polymer brush', 'polymer brushes',
  'dendrimer', 'dendrimers', 'hyperbranched polymer', 'star polymer', 'graft polymer',
  'polymersome', 'polymersomes', 'polymeric micelle', 'polymeric nanoparticles', 'polyplex', 'polyplexes',
  'polymer electrolyte', 'solid polymer electrolyte', 'depolymerization', 'chemical recycling of polymer'
];

// Specific Polymer Family Patterns for Tagging & Validation
const FAMILY_RULES = [
  {
    family: 'Poly(2-oxazoline)s & Cyclic Imino Ethers (POx/POzi)',
    terms: ['poly(2-oxazoline', 'poly(2-oxazine', 'polyoxazoline', 'polyoxazine', 'petox', 'pmox', 'pmeox', 'piprox', 'pphox', '2-ethyl-2-oxazoline', '2-methyl-2-oxazoline', '2-isopropyl-2-oxazoline', '2-oxazoline', '2-oxazine', 'oxazoline monomer', 'oxazine monomer', 'cyclic imino ether', 'oxazoline polymerization']
  },
  {
    family: 'Polyolefins (PE, PP, PIB)',
    terms: ['polyethylene', 'polypropylene', 'polyolefin', 'polyolefins', 'polyisobutylene', 'hdpe', 'ldpe', 'lldpe', 'poly(1-butene)', 'poly(4-methyl-1-pentene)', 'olefin elastomer', 'ziegler-natta']
  },
  {
    family: 'Vinyl & Acrylic Polymers (PS, PMMA, PNIPAM, PVA)',
    terms: ['polystyrene', 'poly(methyl methacrylate)', 'pmma', 'poly(acrylic acid)', 'paa', 'poly(methacrylic acid)', 'pmaa', 'polyacrylamide', 'pam', 'pnipam', 'poly(n-isopropylacrylamide)', 'pdma', 'polyvinyl alcohol', 'pva', 'polyvinyl acetate', 'pvac', 'polyvinylpyrrolidone', 'pvp', 'polyacrylonitrile', 'pan', 'polyvinyl chloride', 'pvc', 'pvdf', 'polyvinylidene fluoride', 'ptfe', 'polytetrafluoroethylene', 'phema', 'fluoropolymer']
  },
  {
    family: 'Polyesters & Biodegradable Polymers (PLA, PCL, PLGA, PET)',
    terms: ['poly(lactic acid)', 'polylactide', 'pla', 'plla', 'pdla', 'pdlla', 'poly(glycolic acid)', 'pga', 'plga', 'poly(lactic-co-glycolic acid)', 'polycaprolactone', 'pcl', 'poly(butylene succinate)', 'pbs', 'polyhydroxyalkanoate', 'pha', 'poly(3-hydroxybutyrate)', 'phb', 'poly(ethylene terephthalate)', 'pet', 'poly(butylene terephthalate)', 'pbt', 'aliphatic polyester', 'biodegradable polyester']
  },
  {
    family: 'Polyamides & Polypeptides (Nylon, Aramids, Polypeptoids)',
    terms: ['polyamide', 'nylon', 'nylon-6', 'nylon-6,6', 'nylon-11', 'nylon-12', 'aramid', 'aramids', 'kevlar', 'polyaspartamide', 'polypeptoid', 'polypeptoids', 'synthetic polypeptide', 'poly(amino acid)']
  },
  {
    family: 'Polyethers & Polyalkylene Glycols (PEG, PEO, PEEK)',
    terms: ['poly(ethylene glycol)', 'poly(ethylene oxide)', 'peo', 'poly(propylene oxide)', 'ppo', 'ptmeg', 'polyether ether ketone', 'peek', 'polyethersulfone', 'pes', 'poly(arylene ether)', 'polyether']
  },
  {
    family: 'High-Performance & Engineering Polymers (PI, PC, PU, PSU)',
    terms: ['polyimide', 'polyimides', 'polyamide-imide', 'pai', 'polycarbonate', 'polycarbonates', 'polyurethane', 'polyurethanes', 'polyurea', 'polyureas', 'polysulfone', 'polysulfones', 'psu', 'polybenzimidazole', 'pbi', 'polyphosphazene', 'liquid-crystalline polymer']
  },
  {
    family: 'Sulfur- & Silicon-Containing Polymers (PDMS, Polysulfides)',
    terms: ['polysulfide', 'polysulfides', 'polythioether', 'polythioethers', 'polysulfonium', 'polysiloxane', 'polysiloxanes', 'polydimethylsiloxane', 'pdms', 'silicone elastomer', 'polysilane']
  },
  {
    family: 'Conducting & Conjugated Polymers (PEDOT, PANI, PPy)',
    terms: ['polyaniline', 'pani', 'polypyrrole', 'ppy', 'polythiophene', 'polythiophenes', 'pedot', 'pedot:pss', 'polyacetylene', 'conjugated polymer', 'conjugated polymers', 'organic semiconductor polymer', 'electroactive polymer']
  },
  {
    family: 'Natural & Biopolymers (Cellulose, Chitosan, Alginate, HA)',
    terms: ['cellulose', 'nanocellulose', 'bacterial cellulose', 'chitin', 'chitosan', 'alginate', 'hyaluronic acid', 'dextran', 'pullulan', 'agarose', 'carrageenan', 'gelatin', 'collagen', 'silk fibroin', 'biomacromolecule', 'biomacromolecules', 'natural rubber', 'polysaccharide']
  },
  {
    family: 'General Macromolecules & Dynamic Networks',
    terms: ['macromolecule', 'macromolecules', 'vitrimer', 'vitrimers', 'covalent adaptable network', 'polymer brush', 'bottlebrush polymer', 'hyperbranched polymer', 'dendrimer', 'supramolecular polymer']
  }
];

// Polymerization Method Rules
const METHOD_RULES = [
  {
    method: 'Radical & Controlled Radical (ATRP, RAFT, NMP)',
    terms: ['atrp', 'atom transfer radical', 'raft', 'reversible addition-fragmentation', 'nmp', 'nitroxide-mediated', 'free-radical polymerization', 'living radical', 'controlled radical polymerization', 'set-lrp']
  },
  {
    method: 'Ionic & Ring-Opening (CROP, ROP, ROMP, Anionic)',
    terms: ['cationic ring-opening', 'crop', 'ring-opening polymerization', 'rop', 'romp', 'ring-opening metathesis', 'anionic polymerization', 'cationic polymerization', 'living anionic', 'living cationic']
  },
  {
    method: 'Step-Growth & Polycondensation (Polyaddition, Interfacial)',
    terms: ['step-growth', 'polycondensation', 'polyaddition', 'interfacial polymerization', 'melt polycondensation', 'click polymerization']
  },
  {
    method: 'Photopolymerization & Radiation Curing',
    terms: ['photopolymerization', 'photo-polymerization', 'photoinduced polymerization', 'light-induced polymerization', 'radiation curing', 'uv polymerization']
  },
  {
    method: 'Emulsion, Dispersion & Precipitation (PISA)',
    terms: ['pisa', 'polymerization-induced self-assembly', 'emulsion polymerization', 'suspension polymerization', 'dispersion polymerization', 'precipitation polymerization', 'miniemulsion']
  },
  {
    method: 'Post-Polymerization Modification & Functionalization',
    terms: ['post-polymerization modification', 'polymer functionalization', 'chain-end functionalization', 'grafting-to', 'grafting-from', 'grafting-through']
  }
];

// Polymer Application Rules
const APPLICATION_RULES = [
  {
    app: 'Biomedical, Therapeutics & Drug/Gene Delivery',
    terms: ['drug delivery', 'controlled release', 'gene delivery', 'polyplex', 'polyplexes', 'polymer therapeutic', 'polymer conjugate', 'nanomedicine', 'polymeric micelle', 'polymeric nanoparticles', 'polymersome', 'polymersomes', 'nanocarrier', 'sirna delivery', 'mrna delivery']
  },
  {
    app: 'Hydrogels, Biomaterials & Tissue Scaffolds',
    terms: ['hydrogel', 'hydrogels', 'tissue engineering', 'scaffold', 'scaffolds', 'wound healing', 'biocompatible polymer', 'injectable hydrogel']
  },
  {
    app: 'Membranes, Separations & Water Purification',
    terms: ['polymer membrane', 'polymeric membrane', 'separation membrane', 'water purification', 'desalination', 'gas separation', 'ion-exchange membrane']
  },
  {
    app: 'Energy, Batteries & Polymer Electrolytes',
    terms: ['polymer electrolyte', 'solid polymer electrolyte', 'gel polymer electrolyte', 'fuel cell membrane', 'battery binder', 'polymer separator', 'organic solar cell', 'polymer solar']
  },
  {
    app: 'Coatings, Adhesives, Films & Antifouling',
    terms: ['polymer coating', 'antifouling coating', 'polymer adhesive', 'polymeric film', 'self-healing coating', 'barrier film']
  },
  {
    app: 'Nanotechnology, Micelles & Nanocomposites',
    terms: ['polymer nanocomposite', 'nanocomposites', 'polymer-graphene', 'nanocellulose composite', 'nanostructured polymer']
  },
  {
    app: 'Sustainable Polymers, Degradation & Chemical Recycling',
    terms: ['chemical recycling', 'depolymerization', 'biodegradable polymer', 'polymer upcycling', 'plastic recycling', 'sustainable polymer', 'bio-based polymer']
  },
  {
    app: 'Smart, Responsive, Actuators & Soft Robotics',
    terms: ['stimuli-responsive', 'thermoresponsive', 'lcst', 'ucst', 'shape-memory polymer', 'soft robotics', 'actuator', 'self-healing polymer']
  }
];

// Polymer Property / Characterization Rules
const PROPERTY_RULES = [
  {
    prop: 'Molecular Weight & Dispersity (SEC/GPC, MALDI)',
    terms: ['gel permeation chromatography', 'gpc', 'size exclusion chromatography', 'sec', 'molecular weight distribution', 'dispersity', 'pdi', 'maldi-tof', 'number-average molecular weight', 'weight-average molecular weight']
  },
  {
    prop: 'Thermal, Mechanical & Rheology (DSC, TGA, DMA)',
    terms: ['glass transition temperature', 'differential scanning calorimetry', 'dsc', 'thermogravimetric', 'tga', 'dynamic mechanical analysis', 'dma', 'rheology', 'viscoelasticity', 'tensile strength']
  },
  {
    prop: 'Stimuli-Responsive Transitions (LCST/UCST, ROS, pH)',
    terms: ['lcst', 'ucst', 'lower critical solution temperature', 'upper critical solution temperature', 'thermoresponsive', 'ph-responsive', 'ros-responsive', 'redox-responsive']
  },
  {
    prop: 'Self-Assembly, Phase Separation & Morphology',
    terms: ['polymer self-assembly', 'microphase separation', 'phase separation', 'micellization', 'morphology of block copolymer', 'lamellar', 'cylindrical microdomains']
  }
];

// ============================================================================
// 2. EXPLICIT FALSE-POSITIVE EXCLUSIONS & PASSING MENTION TRAPS
// ============================================================================

// Triggers that represent non-polymer biological enzymes, containers, or minor experimental aids
const FALSE_POSITIVE_TRIGGERS = [
  // Biological Polymerase Enzymes (NOT polymer science)
  { phrase: 'polymerase chain reaction', penalty: 8 },
  { phrase: 'dna polymerase', penalty: 8 },
  { phrase: 'rna polymerase', penalty: 8 },
  { phrase: 'taq polymerase', penalty: 8 },
  { phrase: 'reverse transcriptase pcr', penalty: 8 },
  { phrase: 'rt-pcr', penalty: 6 },
  { phrase: 'quantitative pcr', penalty: 6 },
  { phrase: 'qpcr', penalty: 5 },

  // Purely Substrate, Vessel, or Solvent Passing Mentions
  { phrase: 'bis(oxazoline)', penalty: 8 },
  { phrase: 'bisoxazoline', penalty: 8 },
  { phrase: 'pybox', penalty: 8 },
  { phrase: 'box ligand', penalty: 8 },
  { phrase: 'spin-coated on a pmma substrate', penalty: 6 },
  { phrase: 'on a pmma substrate', penalty: 5 },
  { phrase: 'pmma substrate', penalty: 4 },
  { phrase: 'polystyrene culture plate', penalty: 6 },
  { phrase: 'polystyrene petri dish', penalty: 6 },
  { phrase: 'polystyrene 96-well', penalty: 6 },
  { phrase: 'polypropylene tube', penalty: 6 },
  { phrase: 'polypropylene centrifuge', penalty: 6 },
  { phrase: 'polypropylene falcon', penalty: 6 },
  { phrase: 'polymer syringe', penalty: 5 },
  { phrase: 'dialysis with cellulose membrane', penalty: 5 },
  { phrase: 'dialysis using a cellulose membrane', penalty: 5 },
  { phrase: 'filtered through a 0.22', penalty: 4 },
  { phrase: 'filtered through a 0.45', penalty: 4 },
  { phrase: 'ptfe filter', penalty: 4 },
  { phrase: 'nylon filter', penalty: 4 },
  { phrase: 'dissolved in peg-400', penalty: 5 },
  { phrase: 'peg-400 as solvent', penalty: 5 },
  { phrase: 'plastic cuvette', penalty: 5 },
  { phrase: 'plastic vial', penalty: 5 },

  // Unrelated Non-Polymer Chemistry Clues (when no polymer investigation exists)
  { phrase: 'single crystal x-ray diffraction of the copper complex', penalty: 4 },
  { phrase: 'asymmetric total synthesis of (-)-', penalty: 5 },
  { phrase: 'asymmetric total synthesis of (+)-', penalty: 5 },
  { phrase: 'enantioselective total synthesis of', penalty: 5 }
];

// Word boundary helper for short acronyms (e.g. rop, atrp, pla, peg, crop) to prevent substring false positives
function matchTerm(text, term) {
  if (!text || !term) return false;
  if (term.length <= 4 && /^[a-z0-9-]+$/i.test(term)) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|[^a-zA-Z0-9-])${escaped}([^a-zA-Z0-9-]|$)`, 'i');
    return regex.test(text);
  }
  return text.includes(term);
}

// Clean text for searching
function normalizeText(str = '') {
  return (str || '')
    .toLowerCase()
    .replace(/[—–]/g, '-')
    .replace(/[\n\r\t]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extracts a verbatim evidence sentence or phrase from title or abstract
 */
function extractEvidencePhrase(rawTitle = '', rawAbstract = '', matchedKeywords = []) {
  if (!matchedKeywords || matchedKeywords.length === 0) return '';

  const titleLower = rawTitle.toLowerCase();
  for (const kw of matchedKeywords) {
    if (matchTerm(titleLower, kw)) {
      return rawTitle.trim();
    }
  }

  // 2. Search Abstract sentences
  if (rawAbstract) {
    const sentences = rawAbstract.split(/(?<=[.?!])\s+/);
    for (const sent of sentences) {
      const sLower = sent.toLowerCase();
      for (const kw of matchedKeywords) {
        if (matchTerm(sLower, kw)) {
          const cleaned = sent.trim();
          if (cleaned.length > 240) {
            return cleaned.slice(0, 237) + '...';
          }
          return cleaned;
        }
      }
    }
  }

  return rawTitle.trim();
}

/**
 * STRICT MULTI-STAGE EVIDENCE-BASED POLYMER CLASSIFIER
 * 
 * Rules:
 * Stage 1: Candidate analysis (Title, Abstract, Keywords)
 * Stage 2: Evidence calculation with positive weights and negative penalty filters
 * Stage 3: Mandatory Evidence Recording (Family, Topic, Method, App, Evidence Phrase)
 * Stage 4: Missing Abstract Handling (Conservatively require strong title indicators)
 */
export function classifyPolymerRelevance(article = {}) {
  const rawTitle = article.title || '';
  const rawAbstract = article.abstract || '';
  const title = normalizeText(rawTitle);
  const abs = normalizeText(rawAbstract);
  const text = `${title} ${abs}`;

  // Stage 4: Missing Abstract Handling
  const hasAbstract = Boolean(abs && abs.length > 40);

  if (!title) {
    return {
      level: RELEVANCE_LEVELS.NOT_RELATED,
      category: CLASSIFICATION_CATEGORIES.NOT_POLYMER,
      confidence: 'low',
      score: 0,
      detectedFamily: 'Unclassified',
      polymerTopic: 'Unclassified',
      evidencePhrase: '',
      relevanceReason: 'No bibliographic text available for classification',
      sourceFields: []
    };
  }

  let positiveScore = 0;
  let penaltyScore = 0;
  const matchedCoreTerms = [];
  const sourceFields = [];

  // 1. Check Negative Penalties & False-Positive Triggers
  FALSE_POSITIVE_TRIGGERS.forEach(t => {
    if (matchTerm(text, t.phrase)) {
      penaltyScore += t.penalty;
    }
  });

  // 2. Score Title (+5 for Title occurrences of core polymer concepts)
  CORE_POLYMER_TERMS.forEach(term => {
    if (matchTerm(title, term)) {
      positiveScore += 5;
      matchedCoreTerms.push(term);
      if (!sourceFields.includes('title')) sourceFields.push('title');
    }
  });

  // 3. Score Abstract (+2 for Abstract occurrences)
  if (hasAbstract) {
    CORE_POLYMER_TERMS.forEach(term => {
      if (matchTerm(abs, term)) {
        positiveScore += 2;
        if (!matchedCoreTerms.includes(term)) matchedCoreTerms.push(term);
        if (!sourceFields.includes('abstract')) sourceFields.push('abstract');
      }
    });
  }

  // 4. Detect Specific Polymer Family
  let detectedFamily = null;
  for (const rule of FAMILY_RULES) {
    const hasFamMatch = rule.terms.some(t => matchTerm(title, t) || matchTerm(abs, t));
    if (hasFamMatch) {
      detectedFamily = rule.family;
      positiveScore += 3;
      break;
    }
  }

  // 5. Detect Polymerization Method
  let polymerizationMethod = null;
  for (const rule of METHOD_RULES) {
    const hasMatch = rule.terms.some(t => matchTerm(title, t) || matchTerm(abs, t));
    if (hasMatch) {
      polymerizationMethod = rule.method;
      positiveScore += 2;
      break;
    }
  }

  // 6. Detect Polymer Application
  let polymerApplication = null;
  for (const rule of APPLICATION_RULES) {
    const hasMatch = rule.terms.some(t => matchTerm(title, t) || matchTerm(abs, t));
    if (hasMatch) {
      polymerApplication = rule.app;
      positiveScore += 2;
      break;
    }
  }

  // 7. Detect Property / Characterization
  let polymerProperty = null;
  for (const rule of PROPERTY_RULES) {
    const hasMatch = rule.terms.some(t => matchTerm(title, t) || matchTerm(abs, t));
    if (hasMatch) {
      polymerProperty = rule.prop;
      positiveScore += 1;
      break;
    }
  }

  // Net Score
  const netScore = positiveScore - penaltyScore;

  // Identify Primary Polymer Topic Tag
  const topics = [];
  if (polymerizationMethod || matchTerm(text, 'polymerization') || matchTerm(text, 'synthesis')) {
    topics.push('Polymer Synthesis & Polymerization');
  }
  if (detectedFamily && detectedFamily.includes('Poly(2-oxazoline)')) {
    topics.push('Poly(2-oxazoline) & Poly(2-oxazine)');
  }
  if (matchTerm(text, 'hydrogel') || matchTerm(text, 'network') || matchTerm(text, 'crosslink')) {
    topics.push('Hydrogels & Polymer Networks');
  }
  if (detectedFamily && detectedFamily.includes('Natural')) {
    topics.push('Biopolymers & Biomacromolecules');
  }
  if (matchTerm(text, 'responsive') || matchTerm(text, 'lcst') || matchTerm(text, 'smart')) {
    topics.push('Stimuli-Responsive & Smart Polymers');
  }
  if (polymerApplication && polymerApplication.includes('Biomedical')) {
    topics.push('Polymer Drug & Gene Delivery');
  }
  if (detectedFamily && detectedFamily.includes('Conducting')) {
    topics.push('Conducting & Electronic Polymers');
  }
  if (matchTerm(text, 'recycling') || matchTerm(text, 'degradable') || matchTerm(text, 'sustainable')) {
    topics.push('Degradable & Sustainable Polymers');
  }
  if (matchTerm(text, 'membrane') || matchTerm(text, 'coating')) {
    topics.push('Polymer Membranes & Coatings');
  }
  if (matchTerm(text, 'nanocomposite')) {
    topics.push('Polymer Composites & Nanocomposites');
  }

  if (topics.length === 0 && positiveScore >= 4) {
    topics.push('Macromolecular & Polymer Chemistry');
  }

  // 8. Assign Classification Category, Level & Confidence
  let level = RELEVANCE_LEVELS.NOT_RELATED;
  let category = CLASSIFICATION_CATEGORIES.NOT_POLYMER;
  let confidence = 'low';
  let relevanceReason = '';

  const isSynthesisOrMethod = Boolean(
    polymerizationMethod || 
    title.includes('synthesis') || 
    title.includes('polymerization') || 
    title.includes('kinetics') || 
    title.includes('living') ||
    matchTerm(title, 'crop') ||
    matchTerm(title, 'atrp') ||
    matchTerm(title, 'raft') ||
    matchTerm(title, 'rop')
  );

  const isApplicationFocus = Boolean(
    polymerApplication ||
    title.includes('delivery') ||
    title.includes('release') ||
    title.includes('carrier') ||
    title.includes('therapeutic') ||
    title.includes('scaffold') ||
    title.includes('membrane') ||
    title.includes('electrolyte') ||
    title.includes('battery') ||
    title.includes('coating') ||
    title.includes('tissue') ||
    title.includes('wound')
  );

  // Rule for missing abstract: Must have strong title match (>= 4 points)
  if (!hasAbstract) {
    const hasStrongTitle = CORE_POLYMER_TERMS.some(t => matchTerm(title, t)) || Boolean(detectedFamily);
    if (hasStrongTitle && netScore >= 4) {
      level = RELEVANCE_LEVELS.POLYMER_RELATED;
      category = (isApplicationFocus && !isSynthesisOrMethod) 
        ? CLASSIFICATION_CATEGORIES.POLYMER_APPLICATION 
        : CLASSIFICATION_CATEGORIES.CORE_POLYMER;
      confidence = 'high';
      relevanceReason = `Confirmed polymer investigation from explicit title metadata (${matchedCoreTerms.slice(0, 2).join(', ')})`;
    } else {
      level = RELEVANCE_LEVELS.NOT_RELATED;
      category = CLASSIFICATION_CATEGORIES.BORDERLINE;
      confidence = 'low';
      relevanceReason = 'Insufficient abstract metadata to confirm dedicated polymer relevance';
    }
  } else {
    // Has full abstract: apply multi-tier threshold
    if (netScore >= 4) {
      level = RELEVANCE_LEVELS.POLYMER_RELATED;
      if (isApplicationFocus && (!isSynthesisOrMethod || title.includes('delivery') || title.includes('carrier'))) {
        category = CLASSIFICATION_CATEGORIES.POLYMER_APPLICATION;
        confidence = netScore >= 6 ? 'high' : 'medium';
        relevanceReason = `Investigates a polymer material platform as primary functional component in ${polymerApplication || 'functional application'}`;
      } else {
        category = CLASSIFICATION_CATEGORIES.CORE_POLYMER;
        confidence = netScore >= 6 ? 'high' : 'medium';
        relevanceReason = `Direct investigation of polymer chemistry, synthesis, architecture, or macromolecular physics`;
      }
    } else if (netScore >= 2) {
      // Borderline relevance (Category C) -> Exclude by default!
      level = RELEVANCE_LEVELS.POSSIBLY_RELATED;
      category = CLASSIFICATION_CATEGORIES.BORDERLINE;
      confidence = 'low';
      relevanceReason = `Borderline or minor polymer application/reference (${matchedCoreTerms.join(', ') || 'minor mention'}); excluded from standard feed`;
    } else {
      level = RELEVANCE_LEVELS.NOT_RELATED;
      category = CLASSIFICATION_CATEGORIES.NOT_POLYMER;
      confidence = 'low';
      relevanceReason = penaltyScore > 0 
        ? 'Excluded: Identified non-polymer biochemical enzyme or background substrate mention'
        : 'Excluded: No substantive macromolecular or polymer research contribution detected';
    }
  }

  // Extract verbatim evidence phrase
  const evidencePhrase = extractEvidencePhrase(rawTitle, rawAbstract, matchedCoreTerms);

  return {
    level,
    category,
    confidence,
    detectedFamily: detectedFamily || 'General Macromolecules & Polymers',
    polymerTopic: topics[0] || 'Macromolecular & Polymer Chemistry',
    topics,
    polymerizationMethod,
    polymerApplication,
    polymerProperty,
    evidencePhrase,
    relevanceReason,
    sourceFields,
    matchedTerms: matchedCoreTerms,
    score: Math.max(0, netScore)
  };
}

/**
 * Detects whether an article is an ASAP / Online-First publication
 */
export function detectAsapStatus(rawRecord = {}) {
  const landingUrl = (rawRecord.landing_page_url || rawRecord.URL || rawRecord.doi_url || '').toLowerCase();
  const rawSubtype = (rawRecord.subtype || rawRecord.type || '').toLowerCase();

  // Explicit URL or subtype indicator
  if (landingUrl.includes('asap') || landingUrl.includes('online-first') || landingUrl.includes('/earlyview/')) {
    return true;
  }

  // Crossref / OpenAlex format:
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
    issueDate: issueDate || printDate || onlineDate
  };
}

function formatDateParts(parts) {
  if (!parts || parts.length === 0) return null;
  const year = parts[0];
  const month = parts[1] ? String(parts[1]).padStart(2, '0') : '01';
  const day = parts[2] ? String(parts[2]).padStart(2, '0') : '01';
  return `${year}-${month}-${day}`;
}
