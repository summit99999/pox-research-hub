/**
 * Official Clarivate Journal Citation Reports (JCR) Impact Factors
 * and Comprehensive Polymer Science Journal Catalog
 */

export const JOURNAL_METRICS_MAP = [
  {
    pattern: /biomacromolecules/i,
    name: 'Biomacromolecules',
    impactFactor: '6.2',
    publisher: 'American Chemical Society (ACS)',
    abbr: 'Biomacromolecules',
    issn: '1525-7797',
    tier: 'Q1 · ACS Flagship Biomaterials'
  },
  {
    pattern: /macromolecules/i,
    name: 'Macromolecules',
    impactFactor: '5.5',
    publisher: 'American Chemical Society (ACS)',
    abbr: 'Macromolecules',
    issn: '0024-9297',
    tier: 'Q1 · ACS Flagship Polymer Science'
  },
  {
    pattern: /acs macro letters/i,
    name: 'ACS Macro Letters',
    impactFactor: '5.8',
    publisher: 'American Chemical Society (ACS)',
    abbr: 'ACS Macro Lett.',
    issn: '2161-1653',
    tier: 'Q1 · High Impact Polymer Letters'
  },
  {
    pattern: /angewandte/i,
    name: 'Angewandte Chemie International Edition',
    impactFactor: '16.6',
    publisher: 'Wiley-VCH',
    abbr: 'Angew. Chem. Int. Ed.',
    issn: '1433-7851',
    tier: 'Q1 · Leading Chemistry'
  },
  {
    pattern: /progress in polymer science/i,
    name: 'Progress in Polymer Science',
    impactFactor: '27.1',
    publisher: 'Elsevier',
    abbr: 'Prog. Polym. Sci.',
    issn: '0079-6700',
    tier: 'Q1 · Premier Polymer Review Journal'
  },
  {
    pattern: /chemical society reviews/i,
    name: 'Chemical Society Reviews',
    impactFactor: '40.4',
    publisher: 'Royal Society of Chemistry (RSC)',
    abbr: 'Chem. Soc. Rev.',
    issn: '0306-0012',
    tier: 'Q1 · Leading Reviews'
  },
  {
    pattern: /chemical reviews/i,
    name: 'Chemical Reviews',
    impactFactor: '51.4',
    publisher: 'American Chemical Society (ACS)',
    abbr: 'Chem. Rev.',
    issn: '0009-2665',
    tier: 'Q1 · Leading Reviews'
  },
  {
    pattern: /\bsmall\b/i,
    name: 'Small',
    impactFactor: '13.0',
    publisher: 'Wiley-VCH',
    abbr: 'Small',
    issn: '1613-6810',
    tier: 'Q1 · Nanomaterials'
  },
  {
    pattern: /chemical engineering journal/i,
    name: 'Chemical Engineering Journal',
    impactFactor: '13.3',
    publisher: 'Elsevier',
    abbr: 'Chem. Eng. J.',
    issn: '1385-8947',
    tier: 'Q1 · Chemical Engineering'
  },
  {
    pattern: /biomaterials/i,
    name: 'Biomaterials',
    impactFactor: '14.0',
    publisher: 'Elsevier',
    abbr: 'Biomaterials',
    issn: '0142-9612',
    tier: 'Q1 · Biomaterials Engineering'
  },
  {
    pattern: /journal of controlled release/i,
    name: 'Journal of Controlled Release',
    impactFactor: '10.8',
    publisher: 'Elsevier',
    abbr: 'J. Control. Release',
    issn: '0168-3659',
    tier: 'Q1 · Drug Delivery'
  },
  {
    pattern: /advanced healthcare materials/i,
    name: 'Advanced Healthcare Materials',
    impactFactor: '10.0',
    publisher: 'Wiley-VCH',
    abbr: 'Adv. Healthc. Mater.',
    issn: '2192-2640',
    tier: 'Q1 · Healthcare Materials'
  },
  {
    pattern: /advanced functional materials/i,
    name: 'Advanced Functional Materials',
    impactFactor: '19.0',
    publisher: 'Wiley-VCH',
    abbr: 'Adv. Funct. Mater.',
    issn: '1616-301X',
    tier: 'Q1 · Functional Materials'
  },
  {
    pattern: /advanced materials/i,
    name: 'Advanced Materials',
    impactFactor: '29.4',
    publisher: 'Wiley-VCH',
    abbr: 'Adv. Mater.',
    issn: '0935-9648',
    tier: 'Q1 · Premier Materials Science'
  },
  {
    pattern: /acs applied materials/i,
    name: 'ACS Applied Materials & Interfaces',
    impactFactor: '9.5',
    publisher: 'American Chemical Society (ACS)',
    abbr: 'ACS Appl. Mater. Interfaces',
    issn: '1944-8244',
    tier: 'Q1 · Applied Materials'
  },
  {
    pattern: /european polymer journal/i,
    name: 'European Polymer Journal',
    impactFactor: '6.0',
    publisher: 'Elsevier',
    abbr: 'Eur. Polym. J.',
    issn: '0014-3057',
    tier: 'Q1 · Macromolecular Science'
  },
  {
    pattern: /polymer chemistry/i,
    name: 'Polymer Chemistry',
    impactFactor: '4.6',
    publisher: 'Royal Society of Chemistry (RSC)',
    abbr: 'Polym. Chem.',
    issn: '1759-9954',
    tier: 'Q1 · Polymer Synthesis & Mechanisms'
  },
  {
    pattern: /international journal of biological macromolecules/i,
    name: 'International Journal of Biological Macromolecules',
    impactFactor: '8.2',
    publisher: 'Elsevier',
    abbr: 'Int. J. Biol. Macromol.',
    issn: '0141-8130',
    tier: 'Q1 · Biological Macromolecules'
  },
  {
    pattern: /colloids and surfaces b/i,
    name: 'Colloids and Surfaces B: Biointerfaces',
    impactFactor: '5.8',
    publisher: 'Elsevier',
    abbr: 'Colloids Surf. B',
    issn: '0927-7765',
    tier: 'Q1 · Biointerfaces'
  },
  {
    pattern: /colloids and surfaces a/i,
    name: 'Colloids and Surfaces A: Physicochemical and Engineering Aspects',
    impactFactor: '5.2',
    publisher: 'Elsevier',
    abbr: 'Colloids Surf. A',
    issn: '0927-7757',
    tier: 'Q1 · Colloids & Surfaces'
  },
  {
    pattern: /macromolecular rapid communications/i,
    name: 'Macromolecular Rapid Communications',
    impactFactor: '5.0',
    publisher: 'Wiley-VCH',
    abbr: 'Macromol. Rapid Commun.',
    issn: '1022-1336',
    tier: 'Q1 · Rapid Polymer Communications'
  },
  {
    pattern: /macromolecular bioscience/i,
    name: 'Macromolecular Bioscience',
    impactFactor: '4.6',
    publisher: 'Wiley-VCH',
    abbr: 'Macromol. Biosci.',
    issn: '1616-5187',
    tier: 'Q1 · Macromolecular Biomaterials'
  },
  {
    pattern: /journal of polymer science/i,
    name: 'Journal of Polymer Science',
    impactFactor: '3.4',
    publisher: 'Wiley',
    abbr: 'J. Polym. Sci.',
    issn: '2642-4150',
    tier: 'Q2 · Core Polymer Science'
  },
  {
    pattern: /\bpolymers\b/i,
    name: 'Polymers',
    impactFactor: '4.7',
    publisher: 'MDPI',
    abbr: 'Polymers',
    issn: '2073-4360',
    tier: 'Q1 · Open Access Polymers'
  },
  {
    pattern: /\bpolymer\b/i,
    name: 'Polymer',
    impactFactor: '4.6',
    publisher: 'Elsevier',
    abbr: 'Polymer',
    issn: '0032-3861',
    tier: 'Q1 · Polymer Science'
  },
  {
    pattern: /reactive and functional polymers/i,
    name: 'Reactive and Functional Polymers',
    impactFactor: '4.2',
    publisher: 'Elsevier',
    abbr: 'React. Funct. Polym.',
    issn: '1381-5148',
    tier: 'Q1 · Functional Polymers'
  },
  {
    pattern: /acs omega/i,
    name: 'ACS Omega',
    impactFactor: '4.1',
    publisher: 'American Chemical Society (ACS)',
    abbr: 'ACS Omega',
    issn: '2470-1343',
    tier: 'Q2 · Open Access Chemistry'
  },
  {
    pattern: /journal of the american chemical society|jacs/i,
    name: 'Journal of the American Chemical Society',
    impactFactor: '15.0',
    publisher: 'American Chemical Society (ACS)',
    abbr: 'J. Am. Chem. Soc.',
    issn: '0002-7863',
    tier: 'Q1 · Flagship Chemistry'
  },
  {
    pattern: /nature communications/i,
    name: 'Nature Communications',
    impactFactor: '16.6',
    publisher: 'Nature Publishing Group',
    abbr: 'Nat. Commun.',
    issn: '2041-1723',
    tier: 'Q1 · Multidisciplinary'
  },
  {
    pattern: /carbohydrate polymers/i,
    name: 'Carbohydrate Polymers',
    impactFactor: '11.2',
    publisher: 'Elsevier',
    abbr: 'Carbohydr. Polym.',
    issn: '0144-8617',
    tier: 'Q1 · Polysaccharides & Natural Polymers'
  },
  {
    pattern: /acta biomaterialia/i,
    name: 'Acta Biomaterialia',
    impactFactor: '9.7',
    publisher: 'Elsevier',
    abbr: 'Acta Biomater.',
    issn: '1742-7061',
    tier: 'Q1 · Biomaterial Science'
  }
];

export const POLYMER_JOURNALS_CATALOG = JOURNAL_METRICS_MAP.map(j => ({
  name: j.name,
  abbr: j.abbr || j.name,
  issn: j.issn || '',
  publisher: j.publisher,
  impactFactor: j.impactFactor,
  tier: j.tier
}));

export const PUBLISHERS_LIST = [
  'All Publishers',
  'American Chemical Society (ACS)',
  'Wiley-VCH',
  'Elsevier',
  'Royal Society of Chemistry (RSC)',
  'Nature Publishing Group',
  'MDPI'
];

export function getJournalInfo(journalName) {
  if (!journalName || typeof journalName !== 'string') {
    return null;
  }
  const clean = journalName.trim();
  for (const item of JOURNAL_METRICS_MAP) {
    if (item.pattern.test(clean)) {
      return item;
    }
  }
  return {
    name: clean,
    abbr: clean,
    issn: '',
    impactFactor: 'Peer Reviewed',
    publisher: 'Academic Press',
    tier: 'Indexed Journal'
  };
}

export function getJournalImpactFactor(journalName) {
  const info = getJournalInfo(journalName);
  return info?.impactFactor || null;
}
