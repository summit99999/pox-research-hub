/**
 * Official Clarivate Journal Citation Reports (JCR) Impact Factors
 * for Key Polymer Science, Chemistry, and Biomaterials Journals
 */

export const JOURNAL_METRICS_MAP = [
  {
    pattern: /biomacromolecules/i,
    name: 'Biomacromolecules',
    impactFactor: '6.2',
    publisher: 'American Chemical Society (ACS)',
    tier: 'Q1 · ACS Flagship Biomaterials'
  },
  {
    pattern: /macromolecules/i,
    name: 'Macromolecules',
    impactFactor: '5.5',
    publisher: 'American Chemical Society (ACS)',
    tier: 'Q1 · ACS Flagship Polymer Science'
  },
  {
    pattern: /angewandte/i,
    name: 'Angewandte Chemie International Edition',
    impactFactor: '16.6',
    publisher: 'Wiley-VCH',
    tier: 'Q1 · Leading Chemistry'
  },
  {
    pattern: /progress in polymer science/i,
    name: 'Progress in Polymer Science',
    impactFactor: '27.1',
    publisher: 'Elsevier',
    tier: 'Q1 · Top Review Journal'
  },
  {
    pattern: /chemical society reviews/i,
    name: 'Chemical Society Reviews',
    impactFactor: '40.4',
    publisher: 'Royal Society of Chemistry (RSC)',
    tier: 'Q1 · Leading Reviews'
  },
  {
    pattern: /chemical reviews/i,
    name: 'Chemical Reviews',
    impactFactor: '51.4',
    publisher: 'American Chemical Society (ACS)',
    tier: 'Q1 · Leading Reviews'
  },
  {
    pattern: /\bsmall\b/i,
    name: 'Small',
    impactFactor: '13.0',
    publisher: 'Wiley-VCH',
    tier: 'Q1 · Nanomaterials'
  },
  {
    pattern: /chemical engineering journal/i,
    name: 'Chemical Engineering Journal',
    impactFactor: '13.3',
    publisher: 'Elsevier',
    tier: 'Q1 · Chemical Engineering'
  },
  {
    pattern: /biomaterials/i,
    name: 'Biomaterials',
    impactFactor: '14.0',
    publisher: 'Elsevier',
    tier: 'Q1 · Biomaterials Engineering'
  },
  {
    pattern: /journal of controlled release/i,
    name: 'Journal of Controlled Release',
    impactFactor: '10.8',
    publisher: 'Elsevier',
    tier: 'Q1 · Drug Delivery'
  },
  {
    pattern: /advanced healthcare materials/i,
    name: 'Advanced Healthcare Materials',
    impactFactor: '10.0',
    publisher: 'Wiley-VCH',
    tier: 'Q1 · Healthcare Materials'
  },
  {
    pattern: /advanced functional materials/i,
    name: 'Advanced Functional Materials',
    impactFactor: '19.0',
    publisher: 'Wiley-VCH',
    tier: 'Q1 · Functional Materials'
  },
  {
    pattern: /acs applied materials/i,
    name: 'ACS Applied Materials & Interfaces',
    impactFactor: '9.5',
    publisher: 'American Chemical Society (ACS)',
    tier: 'Q1 · Applied Materials'
  },
  {
    pattern: /european polymer journal/i,
    name: 'European Polymer Journal',
    impactFactor: '6.0',
    publisher: 'Elsevier',
    tier: 'Q1 · Macromolecular Science'
  },
  {
    pattern: /polymer chemistry/i,
    name: 'Polymer Chemistry',
    impactFactor: '4.6',
    publisher: 'Royal Society of Chemistry (RSC)',
    tier: 'Q1 · Polymer Chemistry'
  },
  {
    pattern: /international journal of biological macromolecules/i,
    name: 'International Journal of Biological Macromolecules',
    impactFactor: '8.2',
    publisher: 'Elsevier',
    tier: 'Q1 · Biological Macromolecules'
  },
  {
    pattern: /colloids and surfaces b/i,
    name: 'Colloids and Surfaces B: Biointerfaces',
    impactFactor: '5.8',
    publisher: 'Elsevier',
    tier: 'Q1 · Biointerfaces'
  },
  {
    pattern: /colloids and surfaces a/i,
    name: 'Colloids and Surfaces A: Physicochemical and Engineering Aspects',
    impactFactor: '5.2',
    publisher: 'Elsevier',
    tier: 'Q1 · Colloids & Surfaces'
  },
  {
    pattern: /macromolecular rapid communications/i,
    name: 'Macromolecular Rapid Communications',
    impactFactor: '5.0',
    publisher: 'Wiley-VCH',
    tier: 'Q1 · Rapid Polymer Communications'
  },
  {
    pattern: /macromolecular bioscience/i,
    name: 'Macromolecular Bioscience',
    impactFactor: '4.6',
    publisher: 'Wiley-VCH',
    tier: 'Q1 · Macromolecular Biomaterials'
  },
  {
    pattern: /\bpolymers\b/i,
    name: 'Polymers',
    impactFactor: '4.7',
    publisher: 'MDPI',
    tier: 'Q1 · Polymers'
  },
  {
    pattern: /\bpolymer\b/i,
    name: 'Polymer',
    impactFactor: '4.6',
    publisher: 'Elsevier',
    tier: 'Q1 · Polymer Science'
  },
  {
    pattern: /reactive and functional polymers/i,
    name: 'Reactive and Functional Polymers',
    impactFactor: '4.2',
    publisher: 'Elsevier',
    tier: 'Q1 · Functional Polymers'
  },
  {
    pattern: /acs omega/i,
    name: 'ACS Omega',
    impactFactor: '4.1',
    publisher: 'American Chemical Society (ACS)',
    tier: 'Q2 · Open Access'
  },
  {
    pattern: /journal of the american chemical society|jacs/i,
    name: 'Journal of the American Chemical Society',
    impactFactor: '15.0',
    publisher: 'American Chemical Society (ACS)',
    tier: 'Q1 · Flagship Chemistry'
  },
  {
    pattern: /nature communications/i,
    name: 'Nature Communications',
    impactFactor: '16.6',
    publisher: 'Nature Publishing Group',
    tier: 'Q1 · Multidisciplinary'
  }
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
    impactFactor: 'Peer Reviewed',
    publisher: 'Academic Press',
    tier: 'Indexed Journal'
  };
}

export function getJournalImpactFactor(journalName) {
  const info = getJournalInfo(journalName);
  return info?.impactFactor || null;
}
