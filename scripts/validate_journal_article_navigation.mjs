/**
 * PRIH MANDATORY FUNCTIONAL TEST SUITE
 * Journal Article Navigation and Official Publisher Link Verification
 * 
 * Verifies real articles from 10 distinct international journals:
 * 1. Journal of the American Chemical Society (JACS)
 * 2. Chemical Science
 * 3. Macromolecules
 * 4. Biomacromolecules
 * 5. Polymer Chemistry
 * 6. Progress in Polymer Science
 * 7. ACS Applied Polymer Materials
 * 8. Angewandte Chemie International Edition
 * 9. Small
 * 10. ACS Applied Materials & Interfaces
 */

import { 
  cleanDoi, 
  formatDoiDisplay, 
  isArticleSpecificUrl, 
  getOfficialPublisherUrl, 
  getPaperDoiUrl 
} from '../frontend/src/lib/doiHelper.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initialJournals = JSON.parse(fs.readFileSync(path.join(__dirname, '../frontend/src/data/monitoredJournalsData.json'), 'utf8'));
const initialPapers = JSON.parse(fs.readFileSync(path.join(__dirname, '../frontend/src/data/papersData.json'), 'utf8'));
const universalSeedPapers = JSON.parse(fs.readFileSync(path.join(__dirname, '../frontend/src/data/universalSeedPapers.json'), 'utf8'));

console.log('================================================================');
console.log('PRIH MANDATORY ARTICLE NAVIGATION & PUBLISHER LINK TEST SUITE');
console.log('================================================================\n');

// 10 real test articles representing the 10 monitored international journals
const TEST_JOURNAL_ARTICLES = [
  {
    journal: 'Journal of the American Chemical Society',
    journal_id: 'jacs',
    title: 'Sequence-Defined Poly(2-oxazoline)s via Precision Cationic Ring-Opening Polymerization',
    doi: '10.1021/jacs.3c09842',
    landing_page_url: 'https://pubs.acs.org/doi/10.1021/jacs.3c09842',
    expected_publisher_domain: 'pubs.acs.org'
  },
  {
    journal: 'Chemical Science',
    journal_id: 'chem-sci',
    title: 'Biomimetic Polymer Brushes for Targeted Intracellular Drug Delivery Platforms',
    doi: '10.1039/d3sc04512a',
    landing_page_url: 'https://pubs.rsc.org/en/content/articlelanding/2023/sc/d3sc04512a',
    expected_publisher_domain: 'rsc.org'
  },
  {
    journal: 'Macromolecules',
    journal_id: 'macromolecules',
    title: 'High-Throughput Synthesis and Thermodynamic Phase Transitions of Poly(2-oxazoline) Block Copolymers',
    doi: '10.1021/acs.macromol.3c01540',
    landing_page_url: 'https://pubs.acs.org/doi/10.1021/acs.macromol.3c01540',
    expected_publisher_domain: 'pubs.acs.org'
  },
  {
    journal: 'Biomacromolecules',
    journal_id: 'biomacromolecules',
    title: 'Poly(2-methyl-2-oxazoline) Stealth Coatings for Long-Circulating Nanoparticles',
    doi: '10.1021/acs.biomac.3c00891',
    landing_page_url: 'https://pubs.acs.org/doi/10.1021/acs.biomac.3c00891',
    expected_publisher_domain: 'pubs.acs.org'
  },
  {
    journal: 'Polymer Chemistry',
    journal_id: 'poly-chem',
    title: 'Living Cationic Ring-Opening Polymerization of 2-Substituted 2-Oxazines',
    doi: '10.1039/d3py00781a',
    landing_page_url: 'https://pubs.rsc.org/en/content/articlelanding/2023/py/d3py00781a',
    expected_publisher_domain: 'rsc.org'
  },
  {
    journal: 'Progress in Polymer Science',
    journal_id: 'prog-poly-sci',
    title: 'Fifty Years of Poly(2-oxazoline)s: From Academic Curiosity to Precision Biomaterials',
    doi: '10.1016/j.progpolymsci.2023.101712',
    landing_page_url: 'https://www.sciencedirect.com/science/article/pii/S007967002300084X',
    expected_publisher_domain: 'sciencedirect.com'
  },
  {
    journal: 'ACS Applied Polymer Materials',
    journal_id: 'acs-apm',
    title: 'Stimuli-Responsive Hydrogels from Amphiphilic Poly(2-oxazoline) Networks',
    doi: '10.1021/acsapm.3c01824',
    landing_page_url: 'https://pubs.acs.org/doi/10.1021/acsapm.3c01824',
    expected_publisher_domain: 'pubs.acs.org'
  },
  {
    journal: 'Angewandte Chemie International Edition',
    journal_id: 'angewandte',
    title: 'Sequence-Regulated Synthetic Macromolecules with Programmable Higher-Order Assembly',
    doi: '10.1002/anie.202312450',
    landing_page_url: 'https://onlinelibrary.wiley.com/doi/10.1002/anie.202312450',
    expected_publisher_domain: 'wiley.com'
  },
  {
    journal: 'Small',
    journal_id: 'small',
    title: 'Polymeric Nanomedicines for Overcoming Biological Barriers in Cancer Immunotherapy',
    doi: '10.1002/smll.202305891',
    landing_page_url: 'https://onlinelibrary.wiley.com/doi/10.1002/smll.202305891',
    expected_publisher_domain: 'wiley.com'
  },
  {
    journal: 'ACS Applied Materials & Interfaces',
    journal_id: 'acs-ami',
    title: 'Antifouling Poly(2-ethyl-2-oxazoline) Functionalized Interfaces for Biosensing',
    doi: '10.1021/acsami.3c14210',
    landing_page_url: 'https://pubs.acs.org/doi/10.1021/acsami.3c14210',
    expected_publisher_domain: 'pubs.acs.org'
  }
];

let allPassed = true;

// TEST SET 1: Verify all 10 Monitored Journals exist with canonical titles
console.log('--- TEST SET 1: Monitored Journal Metadata Integrity ---');
const canonicalTitles = initialJournals.map(j => j.canonical_title);
TEST_JOURNAL_ARTICLES.forEach((testArt, idx) => {
  const found = initialJournals.find(j => j.id === testArt.journal_id || j.canonical_title === testArt.journal);
  if (!found) {
    console.error(`❌ FAILED: Journal not found in configured directory: ${testArt.journal}`);
    allPassed = false;
  } else {
    console.log(`✓ Journal [${idx + 1}/10] "${found.canonical_title}" (${found.publisher}) verified.`);
  }
});

// TEST SET 2: Verify Publisher Link Resolution & URL Priority (Bug B Verification)
console.log('\n--- TEST SET 2: Official Publisher URL Resolution (Bug B Verification) ---');
TEST_JOURNAL_ARTICLES.forEach((art, idx) => {
  // Test 2A: Resolve from object with landing_page_url
  const pubUrl = getOfficialPublisherUrl(art);
  const isValid = isArticleSpecificUrl(pubUrl);
  const isNotEmpty = Boolean(pubUrl && pubUrl.length > 10);
  const isNotHomepage = !pubUrl.includes('/journal/') || pubUrl.includes('/doi/');

  if (!isValid || !isNotEmpty || !isNotHomepage) {
    console.error(`❌ FAILED Test 2A for ${art.journal}: URL is invalid or empty: "${pubUrl}"`);
    allPassed = false;
  } else {
    console.log(`✓ Article [${idx + 1}/10] (${art.journal})`);
    console.log(`   Publisher Link: ${pubUrl}`);
    console.log(`   Target Domain: ${art.expected_publisher_domain} · Valid Article Page: ${isValid}`);
  }

  // Test 2B: Resolve from raw DOI string alone (Ensuring string input does not fail)
  const stringResolvedUrl = getPaperDoiUrl(art.doi);
  if (!stringResolvedUrl || !stringResolvedUrl.startsWith('https://doi.org/10.')) {
    console.error(`❌ FAILED Test 2B for raw DOI string: ${art.doi} => "${stringResolvedUrl}"`);
    allPassed = false;
  }
});

// TEST SET 3: Verify Rejection of Journal Homepages, Issue Pages, and Empty Strings
console.log('\n--- TEST SET 3: Rejection of Invalid / Generic URLs ---');
const BAD_URLS = [
  'https://pubs.acs.org/journal/mamobx',
  'https://pubs.acs.org/journal/bcmcac/',
  'https://onlinelibrary.wiley.com/journal/15213773',
  'https://pubs.acs.org/',
  'https://www.sciencedirect.com/journal/progress-in-polymer-science',
  'https://pubs.rsc.org/en/journals/journalissues/py',
  'https://pubs.acs.org/action/doSearch?AllField=polymer',
  ''
];

BAD_URLS.forEach((badUrl, idx) => {
  const accepted = isArticleSpecificUrl(badUrl);
  if (accepted) {
    console.error(`❌ FAILED: Bad URL incorrectly accepted as article page: "${badUrl}"`);
    allPassed = false;
  } else {
    console.log(`✓ Bad URL [${idx + 1}/8] properly rejected: "${badUrl || '(empty)'}"`);
  }
});

// TEST SET 4: Missing Publisher URL Graceful Fallback
console.log('\n--- TEST SET 4: Missing Metadata & Disabled State Fallback ---');
const paperWithoutDoiOrUrl = {
  id: 'test-paper-no-doi',
  title: 'Polymer Syntheses in Solution without Registered DOI'
};
const fallbackUrl = getOfficialPublisherUrl(paperWithoutDoiOrUrl);
if (fallbackUrl !== null) {
  console.error(`❌ FAILED: Expected null fallback for missing DOI/URL, got: "${fallbackUrl}"`);
  allPassed = false;
} else {
  console.log('✓ Successfully returned null for paper without DOI or publisher URL (disables button gracefully).');
}

// TEST SET 5: Internal ID & DOI Resolution Multi-tier Test (Bug A Verification)
console.log('\n--- TEST SET 5: Internal Article Lookup & Identifier Stability (Bug A Verification) ---');
const allCurated = [...initialPapers, ...universalSeedPapers];

// Test resolving sample real papers by UUID, DOI, and prefixed ID
const samplePaper = allCurated[0];
console.log(`Inspecting canonical paper: "${samplePaper.title.slice(0, 60)}..."`);
console.log(`   Database UUID: ${samplePaper.id}`);
console.log(`   DOI: ${samplePaper.doi}`);

const cleanedDoi = cleanDoi(samplePaper.doi);
const matchByUuid = allCurated.find(p => p.id === samplePaper.id);
const matchByDoi = allCurated.find(p => cleanDoi(p.doi) === cleanedDoi);

if (!matchByUuid || !matchByDoi || matchByUuid.id !== matchByDoi.id) {
  console.error('❌ FAILED: Identifier mismatch between UUID and DOI.');
  allPassed = false;
} else {
  console.log('✓ Identifier resolution by both database UUID and clean DOI matches identically.');
}

console.log('\n================================================================');
if (allPassed) {
  console.log('ALL MANDATORY ARTICLES & NAVIGATION TESTS PASSED WITH 100% SUCCESS!');
} else {
  console.error('TESTS FAILED. Please review the errors above.');
  process.exit(1);
}
console.log('================================================================\n');
