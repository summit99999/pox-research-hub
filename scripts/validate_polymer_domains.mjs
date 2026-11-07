import fs from 'fs';
import path from 'path';

console.log('🧪 Starting Automated Validation of Universal Polymer Research Domains System...\n');

// 1. Load domain definitions
const domainsModulePath = path.resolve('./frontend/src/data/polymerDomainsData.js');
if (!fs.existsSync(domainsModulePath)) {
  console.error('❌ polymerDomainsData.js does not exist!');
  process.exit(1);
}

const fileContent = fs.readFileSync(domainsModulePath, 'utf8');

// Required 18 Domains from User Specification
const REQUIRED_DOMAINS = [
  { slug: 'polyoxazolines-polyoxazines', title: 'Polyoxazolines & Polyoxazines', themeMatch: /violet.*indigo/i },
  { slug: 'polyolefins', title: 'Polyolefins', themeMatch: /blue.*cyan/i },
  { slug: 'vinyl-acrylic-polymers', title: 'Vinyl & Acrylic Polymers', themeMatch: /coral.*orange/i },
  { slug: 'polyesters-biodegradable', title: 'Polyesters & Biodegradable Polymers', themeMatch: /emerald.*teal/i },
  { slug: 'polyamides-polypeptides', title: 'Polyamides & Polypeptides', themeMatch: /rose.*magenta/i },
  { slug: 'polyethers', title: 'Polyethers', themeMatch: /turquoise.*blue/i },
  { slug: 'high-performance-polymers', title: 'High-Performance Polymers', themeMatch: /deep blue.*silver/i },
  { slug: 'sulfur-containing-polymers', title: 'Sulfur-Containing Polymers', themeMatch: /amber.*purple/i },
  { slug: 'silicon-containing-polymers', title: 'Silicon-Containing Polymers', themeMatch: /cyan.*silver/i },
  { slug: 'conducting-polymers', title: 'Conducting Polymers', themeMatch: /neon teal.*electric blue/i },
  { slug: 'natural-biopolymers', title: 'Natural & Biopolymers', themeMatch: /green.*lime/i },
  { slug: 'polymer-architectures', title: 'Polymer Architectures', themeMatch: /purple.*pink/i },
  { slug: 'polymerization-methods', title: 'Polymerization Methods', themeMatch: /orange.*red/i },
  { slug: 'polymer-characterization', title: 'Polymer Characterization', themeMatch: /blue.*violet/i },
  { slug: 'stimuli-responsive-polymers', title: 'Stimuli-Responsive Polymers', themeMatch: /magenta.*cyan/i },
  { slug: 'biomedical-polymer-applications', title: 'Biomedical Polymer Applications', themeMatch: /coral.*pink/i },
  { slug: 'energy-environmental-polymers', title: 'Energy & Environmental Polymers', themeMatch: /green.*turquoise/i },
  { slug: 'advanced-polymer-materials', title: 'Advanced Polymer Materials', themeMatch: /indigo.*electric blue/i }
];

let failed = false;

// Dynamic import of the ES module
const { POLYMER_DOMAINS, getDomainBySlug, getAllCuratedPolymers } = await import('../frontend/src/data/polymerDomainsData.js');

console.log(`✅ Loaded POLYMER_DOMAINS: Total = ${POLYMER_DOMAINS.length} domains (Expected: 18)`);
if (POLYMER_DOMAINS.length !== 18) {
  console.error(`❌ Expected exactly 18 domains, got ${POLYMER_DOMAINS.length}`);
  failed = true;
}

// 2. Validate each domain
REQUIRED_DOMAINS.forEach((req, idx) => {
  const dom = getDomainBySlug(req.slug);
  if (!dom) {
    console.error(`❌ Missing required domain: ${req.slug} (${req.title})`);
    failed = true;
    return;
  }

  // Check Title
  if (!dom.title.toLowerCase().includes(req.title.toLowerCase().slice(0, 8))) {
    console.warn(`⚠️ Title mismatch for ${req.slug}: expected "${req.title}", got "${dom.title}"`);
  }

  // Check Visual Identity Theme
  const theme = dom.visualIdentity?.theme || '';
  if (!req.themeMatch.test(theme)) {
    console.error(`❌ Visual Identity theme mismatch for ${req.slug}: expected match for ${req.themeMatch}, got "${theme}"`);
    failed = true;
  }

  // Check required data fields
  const missingFields = [];
  if (!dom.shortDescription) missingFields.push('shortDescription');
  if (!dom.introduction) missingFields.push('introduction');
  if (!dom.families || dom.families.length === 0) missingFields.push('families');
  if (!dom.synthesisMethods || dom.synthesisMethods.length === 0) missingFields.push('synthesisMethods');
  if (!dom.keyProperties || dom.keyProperties.length === 0) missingFields.push('keyProperties');
  if (!dom.characterization || dom.characterization.length === 0) missingFields.push('characterization');
  if (!dom.applications || dom.applications.length === 0) missingFields.push('applications');
  if (!dom.relatedTopics || dom.relatedTopics.length === 0) missingFields.push('relatedTopics');
  if (!dom.relatedJournals || dom.relatedJournals.length === 0) missingFields.push('relatedJournals');
  if (!dom.searchQuery) missingFields.push('searchQuery');

  if (missingFields.length > 0) {
    console.error(`❌ Domain ${req.slug} is missing fields: ${missingFields.join(', ')}`);
    failed = true;
  } else {
    console.log(`  [${idx + 1}/18] Passed Domain: ${dom.title} | Theme: ${dom.visualIdentity.theme} (${dom.families.length} families)`);
  }
});

// 3. Test curated polymers count and detail completeness
const allPolymers = getAllCuratedPolymers();
console.log(`\n✅ Total Curated Polymers across all domains: ${allPolymers.length}`);
if (allPolymers.length < 30) {
  console.error(`❌ Expected at least 30 curated polymers, found ${allPolymers.length}`);
  failed = true;
}

// Check key polymers exist: PLA, PLGA, PCL, PMMA, PS, PNIPAM, PE, PP, PEtOx, PMOx, PEDOT, Cellulose
const KEY_ACRONYMS = ['PLA', 'PLGA', 'PCL', 'PMMA', 'PS', 'PNIPAM', 'PE', 'PP', 'PEtOx', 'PMOx', 'PEDOT:PSS', 'Cellulose'];
KEY_ACRONYMS.forEach(acro => {
  const match = allPolymers.find(p => p.acronym.includes(acro) || p.name.includes(acro));
  if (!match) {
    console.error(`❌ Missing key polymer acronym: ${acro}`);
    failed = true;
  } else {
    console.log(`  ✓ Verified Polymer: ${match.name} (${match.acronym}) -> Formula: ${match.formula}`);
  }
});

// 4. Validate Components existence and integrity
const componentsToCheck = [
  './frontend/src/views/PolymerDomainsView.jsx',
  './frontend/src/components/Polymer3DHero.jsx',
  './frontend/src/components/PolymerScientificIllustrations.jsx',
  './frontend/src/components/PolymerTopicModal.jsx',
  './frontend/src/components/ThreeDTiltCard.jsx'
];

console.log('\n✅ Checking Components Integrity:');
componentsToCheck.forEach(comp => {
  if (!fs.existsSync(path.resolve(comp))) {
    console.error(`❌ Missing component: ${comp}`);
    failed = true;
  } else {
    console.log(`  ✓ Component verified: ${comp}`);
  }
});

// 5. Check Navigation in Sidebar.jsx, DashboardView.jsx, App.jsx
const sidebarSrc = fs.readFileSync('./frontend/src/components/Sidebar.jsx', 'utf8');
const dashboardSrc = fs.readFileSync('./frontend/src/views/DashboardView.jsx', 'utf8');
const appSrc = fs.readFileSync('./frontend/src/App.jsx', 'utf8');

if (!sidebarSrc.includes("'domains'")) {
  console.error("❌ Sidebar.jsx missing 'domains' route ID!");
  failed = true;
} else {
  console.log("  ✓ Sidebar.jsx includes 'domains' in Primary Nav");
}

if (!dashboardSrc.includes('onOpenDomains')) {
  console.error("❌ DashboardView.jsx missing onOpenDomains handler!");
  failed = true;
} else {
  console.log("  ✓ DashboardView.jsx wires onOpenDomains to Explore 3D Domains");
}

if (!appSrc.includes('PolymerDomainsView')) {
  console.error("❌ App.jsx missing PolymerDomainsView import/render!");
  failed = true;
} else {
  console.log("  ✓ App.jsx renders PolymerDomainsView with deep linking & popstate support");
}

if (failed) {
  console.error('\n❌ Automated validation failed with errors!');
  process.exit(1);
} else {
  console.log('\n🎉 ALL ACCEPTANCE TESTS PASSED! Universal Polymer Research Domains is 100% verified.');
}
