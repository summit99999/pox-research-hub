/**
 * Polymer Research Intelligence Hub (PRIH)
 * Strict Polymer Classification & Journal Tracker Validation Suite
 */

import { 
  classifyPolymerRelevance, 
  detectAsapStatus, 
  extractPublicationDates, 
  RELEVANCE_LEVELS, 
  CLASSIFICATION_CATEGORIES 
} from '../frontend/src/lib/polymerClassifier.js';
import { deduplicatePapers } from '../frontend/src/lib/searchEngine.js';

console.log('================================================================');
console.log('PRIH STRICT POLYMER JOURNAL TRACKER - COMPREHENSIVE TEST SUITE');
console.log('================================================================\n');

// ----------------------------------------------------------------------------
// TEST 1: Known Polymer Synthesis Article Included (Category A)
// ----------------------------------------------------------------------------
const test1_paper = {
  title: 'Synthesis of Sequence-Defined Poly(2-oxazoline)s via Cationic Ring-Opening Polymerization',
  abstract: 'We report the living cationic ring-opening polymerization (CROP) of 2-ethyl-2-oxazoline and 2-methyl-2-oxazoline initiated by methyl triflate, achieving narrow dispersity (Đ < 1.10) and quantitative chain-end functionalization.'
};
const res1 = classifyPolymerRelevance(test1_paper);
console.log('TEST 1 (Polymer Synthesis Investigation):');
console.log('  Level:', res1.level, '| Category:', res1.category, '| Conf:', res1.confidence);
console.log('  Family:', res1.detectedFamily, '| Method:', res1.polymerizationMethod);
console.log('  Evidence:', `"${res1.evidencePhrase}"`);
if (res1.level !== RELEVANCE_LEVELS.POLYMER_RELATED || res1.category !== CLASSIFICATION_CATEGORIES.CORE_POLYMER) {
  throw new Error('TEST 1 FAILED: Expected Core Polymer Research');
}
console.log('  ✓ PASSED: Correctly identified as Core Polymer Research.\n');

// ----------------------------------------------------------------------------
// TEST 2: Known Polymer Application Article Included (Category B)
// ----------------------------------------------------------------------------
const test2_paper = {
  title: 'ROS-Responsive Polymeric Micelles from PEG-b-PPS Block Copolymers for Targeted Doxorubicin Delivery',
  abstract: 'Amphiphilic block copolymers composed of poly(ethylene glycol) and poly(propylene sulfide) were self-assembled into polymeric vesicles for triggered drug release in tumor microenvironments.'
};
const res2 = classifyPolymerRelevance(test2_paper);
console.log('TEST 2 (Polymer Drug Delivery Application):');
console.log('  Level:', res2.level, '| Category:', res2.category, '| Conf:', res2.confidence);
console.log('  Family:', res2.detectedFamily, '| App:', res2.polymerApplication);
if (res2.level !== RELEVANCE_LEVELS.POLYMER_RELATED || res2.category !== CLASSIFICATION_CATEGORIES.POLYMER_APPLICATION) {
  throw new Error('TEST 2 FAILED: Expected Polymer Application Platform');
}
console.log('  ✓ PASSED: Correctly identified as Polymer Application Platform.\n');

// ----------------------------------------------------------------------------
// TEST 3: Non-Polymer Organic Chemistry Excluded (Category D)
// ----------------------------------------------------------------------------
const test3_paper = {
  title: 'Enantioselective Nickel-Catalyzed Cross-Electrophile Coupling of Aryl Bromides with Chiral Alkyl Chlorides',
  abstract: 'An asymmetric reductive coupling between aryl bromides and racemic secondary alkyl chlorides has been achieved using a chiral bis(oxazoline) ligand and zinc as the terminal reductant to forge C(sp2)-C(sp3) stereocenters.'
};
// Note: "bis(oxazoline)" is a small-molecule ligand for asymmetric metal catalysis, NOT a polymer!
const res3 = classifyPolymerRelevance(test3_paper);
console.log('TEST 3 (Non-Polymer Small-Molecule Catalysis with bis(oxazoline) ligand):');
console.log('  Level:', res3.level, '| Category:', res3.category, '| Score:', res3.score);
if (res3.level !== RELEVANCE_LEVELS.NOT_RELATED) {
  throw new Error('TEST 3 FAILED: Expected non-polymer organic synthesis to be excluded');
}
console.log('  ✓ PASSED: Correctly excluded small-molecule catalysis.\n');

// ----------------------------------------------------------------------------
// TEST 4: Non-Polymer Inorganic Materials Excluded (Category D)
// ----------------------------------------------------------------------------
const test4_paper = {
  title: 'Atomic-Scale Origin of Giant Piezoelectricity in Nb-Doped Lead Zirconate Titanate Single Crystals',
  abstract: 'In-situ synchrotron X-ray diffraction and aberration-corrected transmission electron microscopy reveal nanoscale polar domain switching in ceramic solid solutions.'
};
const res4 = classifyPolymerRelevance(test4_paper);
console.log('TEST 4 (Inorganic Ceramic Solid-State Physics):');
console.log('  Level:', res4.level, '| Category:', res4.category);
if (res4.level !== RELEVANCE_LEVELS.NOT_RELATED) {
  throw new Error('TEST 4 FAILED: Expected inorganic materials to be excluded');
}
console.log('  ✓ PASSED: Correctly excluded inorganic ceramic crystal research.\n');

// ----------------------------------------------------------------------------
// TEST 5: Passing Mention Excluded (Category C or D)
// ----------------------------------------------------------------------------
const test5_paper = {
  title: 'Ultrasensitive Electrochemical Detection of Heavy Metals using Functionalized Gold Electrodes',
  abstract: 'Gold microelectrodes were modified with thiol monolayers. To prevent sample contamination, all stock solutions were stored in polypropylene tubes and filtered through a PTFE filter before analysis in a polystyrene culture plate.'
};
const res5 = classifyPolymerRelevance(test5_paper);
console.log('TEST 5 (Passing Mention of Polypropylene tubes / Polystyrene plate):');
console.log('  Level:', res5.level, '| Category:', res5.category, '| Score:', res5.score);
if (res5.level === RELEVANCE_LEVELS.POLYMER_RELATED) {
  throw new Error('TEST 5 FAILED: Passing mention should NOT be included in default polymer feed');
}
console.log('  ✓ PASSED: Passing mention correctly rejected from default feed.\n');

// ----------------------------------------------------------------------------
// TEST 6: Missing Abstract Handled Conservatively
// ----------------------------------------------------------------------------
const test6_ambiguous = {
  title: 'A Kinetic Investigation on Reaction Dynamics and Temperature Effects',
  abstract: '' // missing
};
const res6_ambiguous = classifyPolymerRelevance(test6_ambiguous);
console.log('TEST 6A (Ambiguous Title with Missing Abstract):');
console.log('  Level:', res6_ambiguous.level, '| Category:', res6_ambiguous.category);
if (res6_ambiguous.level === RELEVANCE_LEVELS.POLYMER_RELATED) {
  throw new Error('TEST 6A FAILED: Ambiguous title without abstract must be excluded');
}
console.log('  ✓ PASSED: Ambiguous title without abstract safely excluded.\n');

const test6_explicit = {
  title: 'Controlled Ring-Opening Polymerization of L-Lactide to High-Molecular-Weight Poly(lactic acid)',
  abstract: '' // missing
};
const res6_explicit = classifyPolymerRelevance(test6_explicit);
console.log('TEST 6B (Explicit Polymer Title with Missing Abstract):');
console.log('  Level:', res6_explicit.level, '| Category:', res6_explicit.category);
if (res6_explicit.level !== RELEVANCE_LEVELS.POLYMER_RELATED) {
  throw new Error('TEST 6B FAILED: Explicit core polymer title should be included');
}
console.log('  ✓ PASSED: Explicit polymer title without abstract correctly recognized.\n');

// ----------------------------------------------------------------------------
// TEST 7: ASAP Article Detection
// ----------------------------------------------------------------------------
const test7_asap = {
  'published-online': { 'date-parts': [[2026, 11, 6]] },
  title: ['Living Cationic Polymerization of Isobutyl Vinyl Ether'],
  // No volume, no issue
};
const isAsap = detectAsapStatus(test7_asap);
console.log('TEST 7 (ASAP Article Detection):');
console.log('  isAsap detected:', isAsap);
if (!isAsap) throw new Error('TEST 7 FAILED: Expected ASAP to be true');
console.log('  ✓ PASSED: Correctly identified as ASAP publication.\n');

// ----------------------------------------------------------------------------
// TEST 8: Online Publication Date Ordering
// ----------------------------------------------------------------------------
const test8_recordA = { 'published-online': { 'date-parts': [[2026, 11, 5]] }, 'published-print': { 'date-parts': [[2026, 11, 20]] } };
const test8_recordB = { 'published-online': { 'date-parts': [[2026, 11, 2]] }, 'published-print': { 'date-parts': [[2026, 11, 25]] } };
const dateA = extractPublicationDates(test8_recordA).onlineDate;
const dateB = extractPublicationDates(test8_recordB).onlineDate;
console.log('TEST 8 (Chronological Online Date Extraction):');
console.log('  Article A online:', dateA, '| Article B online:', dateB);
if (dateA <= dateB) throw new Error('TEST 8 FAILED: Online date ordering failure');
console.log('  ✓ PASSED: Online publication date takes precedence for newest-first sorting.\n');

// ----------------------------------------------------------------------------
// TEST 9: Multi-Family Coverage (Non-POx Polymers)
// ----------------------------------------------------------------------------
const test9_pla = {
  title: 'Hydrolytic Degradation Mechanisms of Bioabsorbable Poly(lactic-co-glycolic acid) (PLGA) Scaffolds',
  abstract: 'We examine the in vitro erosion kinetics of poly(lactic-co-glycolic acid) networks for bone regeneration.'
};
const res9_pla = classifyPolymerRelevance(test9_pla);
console.log('TEST 9A (Polyesters & Biodegradable Polymers):');
console.log('  Family:', res9_pla.detectedFamily, '| Level:', res9_pla.level);
if (res9_pla.detectedFamily !== 'Polyesters & Biodegradable Polymers (PLA, PCL, PLGA, PET)') {
  throw new Error('TEST 9A FAILED: Expected Polyesters family');
}

const test9_pedot = {
  title: 'High-Conductivity PEDOT:PSS Thin Films for Flexible Thermoelectric Generators',
  abstract: 'Conjugated polymer films of poly(3,4-ethylenedioxythiophene):poly(styrenesulfonate) were treated with polar solvents to enhance carrier mobility.'
};
const res9_pedot = classifyPolymerRelevance(test9_pedot);
console.log('TEST 9B (Conducting & Conjugated Polymers):');
console.log('  Family:', res9_pedot.detectedFamily, '| Level:', res9_pedot.level);
if (res9_pedot.detectedFamily !== 'Conducting & Conjugated Polymers (PEDOT, PANI, PPy)') {
  throw new Error('TEST 9B FAILED: Expected Conducting Polymers family');
}
console.log('  ✓ PASSED: Broad non-POx polymer families accurately classified.\n');

// ----------------------------------------------------------------------------
// TEST 10: Deduplication by DOI
// ----------------------------------------------------------------------------
const test10_list = [
  { doi: '10.1021/acs.macromol.6b01234', title: 'RAFT Polymerization of Styrene' },
  { doi: '10.1021/ACS.MACROMOL.6B01234', title: 'RAFT Polymerization of Styrene (duplicate with uppercase DOI)' },
  { doi: 'https://doi.org/10.1021/acs.macromol.6b01234', title: 'RAFT Polymerization of Styrene (duplicate URL format)' },
  { doi: '10.1021/acs.biomac.6b09999', title: 'Chitosan-Based Hydrogels' }
];
const deduped = deduplicatePapers(test10_list);
console.log('TEST 10 (DOI Deduplication):');
console.log('  Original records: 4 | Deduplicated records:', deduped.length);
if (deduped.length !== 2) throw new Error('TEST 10 FAILED: Expected 2 unique papers after DOI normalization');
console.log('  ✓ PASSED: Deduplication cleanly merged identical DOIs.\n');

console.log('================================================================');
console.log('ALL 10 VERIFICATION TESTS COMPLETED WITH 100% SUCCESS!');
console.log('================================================================');
