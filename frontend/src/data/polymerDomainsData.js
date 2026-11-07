/**
/**
 * Universal Polymer Research Domains & Scientific Taxonomy Data
 * Polymer Research Intelligence Hub (PRIH)
 * 
 * Strict scientific categorization across 18 distinct research domains,
 * complete with authentic chemical repeat units, physical properties,
 * synthesis pathways, characterization techniques, and literature queries.
 */

export const DOMAIN_CATEGORIES = [
  { id: 'all', label: 'All Domains (18)', count: 18 },
  { id: 'synthetic', label: 'Synthetic & Commodity', count: 7 },
  { id: 'natural', label: 'Natural & Biopolymers', count: 2 },
  { id: 'architectures', label: 'Polymer Architectures', count: 2 },
  { id: 'methods', label: 'Polymerization Methods', count: 2 },
  { id: 'characterization', label: 'Properties & Characterization', count: 2 },
  { id: 'functional', label: 'Functional & Biomedical', count: 3 }
];

export const POLYMER_DOMAINS = [
  {
    id: 'domain-1',
    slug: 'polyoxazolines-polyoxazines',
    title: 'Polyoxazolines & Polyoxazines',
    shortDescription: 'Cationic ring-opening polymerizations of cyclic imino ethers yielding stealth, pseudo-peptidic, and thermoresponsive biomaterials.',
    categoryType: 'functional',
    visualIdentity: {
      theme: 'Electric violet and indigo',
      gradient: 'from-violet-600 via-indigo-600 to-purple-800',
      bgGlow: 'rgba(139, 92, 246, 0.15)',
      borderColor: 'border-violet-500/40',
      hoverBorder: 'hover:border-violet-400',
      badgeBg: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
      glowColor: 'purple',
      accentColor: '#8b5cf6'
    },
    motifType: 'cyclic_crop',
    introduction: 'Poly(2-oxazoline)s (POx) and poly(2-oxazine)s (POzi) are synthetic pseudopeptides synthesized via living cationic ring-opening polymerization (CROP) of 2-substituted 2-oxazolines and 5,6-dihydro-4H-1,3-oxazines. They exhibit extraordinary stealth biocompatibility, low viscosity, high chemical modifiability, and tunable LCST/UCST thermoresponsiveness, making them premier alternatives to PEG in therapeutics.',
    families: [
      {
        name: 'Poly(2-methyl-2-oxazoline)',
        acronym: 'PMeOx / PMOx',
        formula: '[-CH2-CH2-N(COCH3)-]n',
        repeatUnit: 'N-(methylcarbonyl)ethylenimine',
        repeatUnitMass: 85.11,
        tg: '65 - 75 °C',
        solubility: 'Water, methanol, chloroform, DMF',
        synthesis: 'Cationic ring-opening polymerization (CROP) using alkyl tosylates or triflates as initiators at 80–140 °C in acetonitrile/microwave.',
        properties: 'Extremely hydrophilic, ultra-low non-specific protein fouling, rapid renal clearance, negligible complement activation.',
        applications: 'Stealth polymer-protein conjugates, antifouling surface brushes, liposome coatings, gene delivery polyplexes.',
        searchQuery: '"poly(2-methyl-2-oxazoline)" OR PMOx OR PMeOx'
      },
      {
        name: 'Poly(2-ethyl-2-oxazoline)',
        acronym: 'PEtOx / PEOx',
        formula: '[-CH2-CH2-N(COCH2CH3)-]n',
        repeatUnit: 'N-(ethylcarbonyl)ethylenimine',
        repeatUnitMass: 99.13,
        tg: '55 - 60 °C',
        cloudPoint: '~60 - 65 °C (LCST in water)',
        solubility: 'Water (<60 °C), ethanol, acetone, chloroform',
        synthesis: 'CROP initiated by methyl triflate or methyl p-toluenesulfonate with microwave-assisted kinetic acceleration.',
        properties: 'FDA-accepted excipient profile, thermoresponsive phase transition, low solution viscosity, high shelf stability.',
        applications: 'Hot-melt extrusion, pharmaceutical drug solubilization, thermoresponsive hydrogels, tissue engineering.',
        searchQuery: '"poly(2-ethyl-2-oxazoline)" OR PEtOx OR PEOx'
      },
      {
        name: 'Poly(2-isopropyl-2-oxazoline)',
        acronym: 'PiPrOx',
        formula: '[-CH2-CH2-N(COCH(CH3)2)-]n',
        repeatUnit: 'N-(isopropylcarbonyl)ethylenimine',
        repeatUnitMass: 113.16,
        tg: '45 - 50 °C',
        cloudPoint: '~36 - 39 °C (physiological LCST)',
        solubility: 'Cold water, alcohols, THF, chloroform',
        synthesis: 'CROP of 2-isopropyl-2-oxazoline with living chain ends suitable for block copolymerization.',
        properties: 'Sharp reversible phase transition near normal physiological body temperature (37 °C) with minimal hysteresis.',
        applications: 'Smart drug delivery vehicles, cell sheet detachment culture dishes, hyperthermia-triggered drug release.',
        searchQuery: '"poly(2-isopropyl-2-oxazoline)" OR PiPrOx OR "poly(2-isopropyl-2-oxazine)"'
      },
      {
        name: 'Poly(2-oxazine)s',
        acronym: 'POzi',
        formula: '[-CH2-CH2-CH2-N(COR)-]n',
        repeatUnit: 'N-(acyl)trimethylenimine',
        repeatUnitMass: '113.16 - 150.00',
        tg: '40 - 70 °C',
        solubility: 'Water, organic polar solvents depending on substituent R',
        synthesis: 'Living CROP of six-membered 2-oxazine monomers with methyl triflate at elevated temperatures.',
        properties: 'Extra methylene group in the repeating backbone compared to POx yields higher flexibility and altered stealth pharmacology.',
        applications: 'Ultra-high capacity polymeric micelles for paclitaxel/curcumin, hydrophobic drug delivery, nanoformulations.',
        searchQuery: '"poly(2-oxazine)" OR POzi OR polyoxazine'
      }
    ],
    synthesisMethods: [
      'Living Cationic Ring-Opening Polymerization (CROP)',
      'Microwave-Assisted High-Speed Synthesis',
      'End-Group Functionalization with Piperazine, Azides & Thiols',
      'Block Copolymerization with Polyesters & Polystyrene',
      'Post-Polymerization Thiol-Ene & Click Chemistry'
    ],
    keyProperties: [
      'Stealth & Biomimetic Pseudopeptide Backbone',
      'Tunable Lower Critical Solution Temperature (LCST: 25–100 °C)',
      'Negligible In Vivo Immunogenicity & Non-Cytotoxic',
      'Ultra-Low Viscosity in Concentrated Solutions',
      'High Structural Versatility (Linear, Star, Bottlebrush, Block)'
    ],
    characterization: [
      '1H and 13C Nuclear Magnetic Resonance (NMR)',
      'Size Exclusion Chromatography (SEC / GPC) in DMAc/DMF',
      'Matrix-Assisted Laser Desorption/Ionization (MALDI-TOF-MS)',
      'Turbidimetry & Dynamic Light Scattering (DLS for LCST)',
      'Differential Scanning Calorimetry (DSC)'
    ],
    applications: [
      'Polymer Therapeutics & Stealth Protein/Enzyme PEG-Alternatives',
      'Super-Loaded Polymeric Micelles for Insoluble Oncology Drugs',
      'Antifouling Coatings for Medical Implants and Biosensors',
      'Thermoresponsive Injectable Hydrogels for Soft Tissue Engineering',
      'Targeted Polyplexes for mRNA and Gene Delivery'
    ],
    relatedTopics: ['CROP', 'Pseudopeptides', 'Stealth Polymers', 'Thermoresponsive', 'Polymeric Micelles', 'Biocompatibility'],
    relatedJournals: [
      'Macromolecules',
      'Biomacromolecules',
      'Polymer Chemistry',
      'ACS Applied Materials & Interfaces',
      'Progress in Polymer Science'
    ],
    searchQuery: 'oxazoline OR oxazine OR "poly(2-oxazoline)" OR POx OR CROP'
  },
  {
    id: 'domain-2',
    slug: 'polyolefins',
    title: 'Polyolefins',
    shortDescription: 'Ziegler-Natta and metallocene-catalyzed hydrocarbon macromolecules defining commodity, engineering, and barrier polymers.',
    categoryType: 'synthetic',
    visualIdentity: {
      theme: 'Blue and cyan',
      gradient: 'from-blue-600 via-sky-600 to-cyan-700',
      bgGlow: 'rgba(14, 165, 233, 0.15)',
      borderColor: 'border-cyan-500/40',
      hoverBorder: 'hover:border-cyan-400',
      badgeBg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
      glowColor: 'teal',
      accentColor: '#0ea5e9'
    },
    motifType: 'hydrocarbon_chain',
    introduction: 'Polyolefins constitute the largest global polymer production volume. Synthesized primarily through transition metal coordination catalysis (Ziegler-Natta, metallocenes, and post-metallocenes), they offer unparalleled cost-performance, chemical inertness, barrier properties, and tunable semi-crystallinity from elastomeric plastomers to ultra-high modulus fibers.',
    families: [
      {
        name: 'Polyethylene (HDPE, LDPE, LLDPE, UHMWPE)',
        acronym: 'PE',
        formula: '[-CH2-CH2-]n',
        repeatUnit: 'Ethylene',
        repeatUnitMass: 28.05,
        tg: '-120 °C',
        tm: '110 - 138 °C',
        crystallinity: '40 - 85%',
        solubility: 'Insoluble at room temp; soluble in hot Decalin/TCB >130 °C',
        synthesis: 'High-pressure free-radical (LDPE) or catalytic coordination with Ziegler-Natta/Cr/Metallocenes (HDPE/LLDPE).',
        properties: 'Outstanding chemical resistance, low dielectric constant, moisture barrier, ductile impact toughness.',
        applications: 'Rigid containers, gas pipes, agricultural films, high-modulus fibers (Dyneema), joint prosthetics (UHMWPE).',
        searchQuery: '"polyethylene" OR HDPE OR LDPE OR LLDPE OR UHMWPE'
      },
      {
        name: 'Polypropylene (iPP, sPP, aPP)',
        acronym: 'PP',
        formula: '[-CH2-CH(CH3)-]n',
        repeatUnit: 'Propylene',
        repeatUnitMass: 42.08,
        tg: '-10 to 0 °C',
        tm: '160 - 168 °C (isotactic)',
        crystallinity: '50 - 70%',
        solubility: 'Hot o-dichlorobenzene and trichlorobenzene',
        synthesis: 'Stereospecific coordination polymerization using supported TiCl4/MgCl2 catalysts or ansa-metallocenes.',
        properties: 'Living hinge fatigue endurance, low density (0.905 g/cm³), high stiffness, thermal stability up to 100 °C.',
        applications: 'Automotive components, medical syringes, food packaging, woven textiles, nonwoven mask filtration media.',
        searchQuery: '"polypropylene" OR iPP OR "isotactic polypropylene"'
      },
      {
        name: 'Polyisobutylene / Butyl Rubber',
        acronym: 'PIB / IIR',
        formula: '[-CH2-C(CH3)2-]n',
        repeatUnit: 'Isobutylene',
        repeatUnitMass: 56.11,
        tg: '-73 °C',
        solubility: 'Hexane, toluene, cyclohexane',
        synthesis: 'Cationic carbocationic polymerization with AlCl3/H2O or Lewis acid complexes at cryogenic temperatures (-90 °C).',
        properties: 'Extremely low gas permeability, high damping coefficient, biological inertness, weathering resistance.',
        applications: 'Tire inner liners, vacuum sealants, pharmaceutical bottle stoppers, vibration isolation dampers.',
        searchQuery: '"polyisobutylene" OR "butyl rubber" OR PIB'
      }
    ],
    synthesisMethods: [
      'Heterogeneous Ziegler-Natta Catalysis (TiCl4/MgCl2)',
      'Homogeneous Metallocene & Constrained Geometry Catalysis (CGC)',
      'Late Transition Metal Catalysis (Brookhart Ni/Pd systems)',
      'High-Pressure Free-Radical Autoclave/Tubular (LDPE)',
      'Slurry Loop, Gas Phase (Unipol), and Solution Reactor Processes'
    ],
    keyProperties: [
      'High Chemical Inertness to Acids, Alkalis, and Polar Solvents',
      'Wide Density Spectrum (0.86 to 0.96 g/cm³)',
      'Exceptional Water Vapor Barrier Performance',
      'Controlled Tacticity (Isotactic, Syndiotactic, Atactic)',
      'High Cryogenic Ductility and Impact Resistance'
    ],
    characterization: [
      'High-Temperature Gel Permeation Chromatography (HT-GPC @ 150 °C in TCB)',
      'High-Temperature 13C-NMR for Microstructure & Branching',
      'Differential Scanning Calorimetry (DSC) for Crystallinity & Melting',
      'Crystallization Analysis Fractionation (CRYSTAF / TREF / CEF)',
      'Dynamic Mechanical Thermal Analysis (DMTA)'
    ],
    applications: [
      'Flexible Food Packaging & Multilayer Barrier Films',
      'Pressure-Rated Municipal Water & Natural Gas Pipeline Infrastructure',
      'Automotive Lightweighting (Bumpers, Dashboards, Underhood)',
      'Ultra-High Molecular Weight Orthopedic Implants',
      'Electrochemical Battery Separator Membranes'
    ],
    relatedTopics: ['Metallocenes', 'Ziegler-Natta', 'Tacticity', 'Crystallization', 'HT-GPC', 'Mechanical Properties'],
    relatedJournals: [
      'Macromolecules',
      'Polymer Chemistry',
      'Journal of the American Chemical Society',
      'ACS Applied Materials & Interfaces',
      'Polymer'
    ],
    searchQuery: 'polyolefin OR polyethylene OR polypropylene OR metallocene OR "Ziegler-Natta"'
  },
  {
    id: 'domain-3',
    slug: 'vinyl-acrylic-polymers',
    title: 'Vinyl & Acrylic Polymers',
    shortDescription: 'Free-radical and controlled radical polymers featuring polystyrene, polyacrylates, polyacrylamides, and optical acrylics.',
    categoryType: 'synthetic',
    visualIdentity: {
      theme: 'Coral and orange',
      gradient: 'from-orange-500 via-amber-500 to-rose-600',
      bgGlow: 'rgba(249, 115, 22, 0.15)',
      borderColor: 'border-orange-500/40',
      hoverBorder: 'hover:border-orange-400',
      badgeBg: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
      glowColor: 'amber',
      accentColor: '#f97316'
    },
    motifType: 'pendant_vinyl',
    introduction: 'Vinyl and acrylic polymers encompass an enormous variety of synthetic materials produced via free radical, controlled radical (ATRP, RAFT), and anionic polymerizations. The presence of diverse pendant groups (ester, carboxyl, amide, cyano, phenyl) affords optical clarity, adhesion, stimuli-responsiveness, or high glass transition temperatures.',
    families: [
      {
        name: 'Poly(methyl methacrylate)',
        acronym: 'PMMA',
        formula: '[-CH2-C(CH3)(COOCH3)-]n',
        repeatUnit: 'Methyl methacrylate',
        repeatUnitMass: 100.12,
        tg: '105 °C',
        solubility: 'Acetone, chloroform, ethyl acetate, toluene',
        synthesis: 'Free radical polymerization using AIBN/peroxides or ATRP with Cu(I)/amine catalysts.',
        properties: 'Superb optical transparency (92% visible transmission), UV weathering durability, rigid scratch resistance.',
        applications: 'Optical lenses, aircraft canopies, PMMA bone cement in orthopedics, light guides, microfluidics.',
        searchQuery: '"poly(methyl methacrylate)" OR PMMA OR "acrylic glass"'
      },
      {
        name: 'Polystyrene',
        acronym: 'PS',
        formula: '[-CH2-CH(C6H5)-]n',
        repeatUnit: 'Styrene',
        repeatUnitMass: 104.15,
        tg: '100 °C',
        solubility: 'Benzene, toluene, THF, chlorinated hydrocarbons',
        synthesis: 'Thermal, bulk free-radical, or living anionic polymerization with sec-butyllithium.',
        properties: 'High refractive index (1.59), dielectric insulation, dimensional stiffness, brittle without elastomer impact modification.',
        applications: 'Cell culture dishes, packaging foam (EPS), disposable laboratory ware, electronic housings.',
        searchQuery: 'polystyrene OR "general purpose polystyrene" OR "expanded polystyrene"'
      },
      {
        name: 'Poly(N-isopropylacrylamide)',
        acronym: 'PNIPAM',
        formula: '[-CH2-CH(CONHCH(CH3)2)-]n',
        repeatUnit: 'N-isopropylacrylamide',
        repeatUnitMass: 113.16,
        tg: '130 - 140 °C',
        cloudPoint: '32 °C (Sharp LCST in water)',
        solubility: 'Cold water (<32 °C), alcohols, acetone',
        synthesis: 'RAFT or ATRP to yield well-defined telechelic polymers or crosslinked microgels.',
        properties: 'Hydration-dehydration coil-to-globule transition at 32 °C driven by entropy of water release.',
        applications: 'Temperature-responsive hydrogels, cell-sheet engineering, microfluidic valves, pulsatile drug delivery.',
        searchQuery: '"poly(N-isopropylacrylamide)" OR PNIPAM OR "PNIPAm"'
      },
      {
        name: 'Poly(acrylic acid) & Poly(methacrylic acid)',
        acronym: 'PAA / PMAA',
        formula: '[-CH2-CH(COOH)-]n',
        repeatUnit: 'Acrylic acid',
        repeatUnitMass: 72.06,
        tg: '106 °C',
        solubility: 'Water (pH-dependent), polar organic solvents',
        synthesis: 'Solution free radical or controlled radical polymerization, often with crosslinkers.',
        properties: 'Polyelectrolyte behavior, superabsorbent gel expansion, pH-responsive swelling, mucoadhesion.',
        applications: 'Superabsorbent diapers, mucoadhesive drug tablets, thickening agents, scale inhibitors.',
        searchQuery: '"poly(acrylic acid)" OR "polyacrylic acid" OR PAA'
      }
    ],
    synthesisMethods: [
      'Free Radical Polymerization (Solution, Suspension, Emulsion)',
      'Atom Transfer Radical Polymerization (ATRP / ARGET / photoATRP)',
      'Reversible Addition-Fragmentation Chain Transfer (RAFT)',
      'Nitroxide-Mediated Polymerization (NMP)',
      'Living Anionic Polymerization of Styrenic Monomers'
    ],
    keyProperties: [
      'Tunable Pendant Functionality (Neutral, Cationic, Anionic, Zwitterionic)',
      'High Optical Clarity & Scratch Durability (PMMA)',
      'Reversible Entropy-Driven Phase Transitions (PNIPAM LCST)',
      'Crosslinked Hydrogel Swelling Ratios Exceeding 1000x',
      'Narrow Molecular Weight Distributions (Mw/Mn < 1.1 via RAFT/ATRP)'
    ],
    characterization: [
      'GPC / SEC in THF or DMF with Multi-Angle Light Scattering (SEC-MALS)',
      'Proton NMR Spectroscopy for Conversion and Copolymer Composition',
      'UV-Vis Spectrophotometry for Optical Transmittance & Turbidimetry',
      'Thermogravimetric Analysis (TGA) for Decomposition Profiles',
      'Rheometry for Dynamic Storage and Loss Moduli (G\', G")'
    ],
    applications: [
      'Smart Stimuli-Responsive Actuators & Microfluidic Valves',
      'Biomedical Cell Culture Surfaces and Regenerative Medicine',
      'Superabsorbent Polymeric Materials and Water Retention Gels',
      'Automotive Optical Lenses, Displays, and Glazing',
      'Coatings, Adhesives, Sealants, and Elastomers (CASE)'
    ],
    relatedTopics: ['ATRP', 'RAFT', 'PNIPAM', 'PMMA', 'Polystyrene', 'Free Radical'],
    relatedJournals: [
      'Macromolecules',
      'Polymer Chemistry',
      'Biomacromolecules',
      'Journal of the American Chemical Society',
      'ACS Applied Polymer Materials'
    ],
    searchQuery: 'vinyl OR acrylic OR acrylate OR methacrylate OR PMMA OR polystyrene OR PNIPAM OR ATRP OR RAFT'
  },
  {
    id: 'domain-4',
    slug: 'polyesters-biodegradable',
    title: 'Polyesters & Biodegradable Polymers',
    shortDescription: 'Bio-based, hydrolytically degradable, and circular polyesters driving sustainable materials and bioresorbable medical implants.',
    categoryType: 'synthetic',
    visualIdentity: {
      theme: 'Emerald and teal',
      gradient: 'from-emerald-500 via-teal-600 to-emerald-800',
      bgGlow: 'rgba(16, 185, 129, 0.15)',
      borderColor: 'border-emerald-500/40',
      hoverBorder: 'hover:border-emerald-400',
      badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      glowColor: 'emerald',
      accentColor: '#10b981'
    },
    motifType: 'ester_cleavage',
    introduction: 'Polyesters contain ester links in their main chain. They represent the frontier of both circular industrial plastics (PET) and biodegradable/bioresorbable biomaterials (PLA, PCL, PLGA, PHAs). Synthesized via ring-opening polymerization (ROP) of cyclic esters or polycondensation of diacids and diols, their ester backbones undergo controlled hydrolytic or enzymatic erosion into benign metabolic byproducts.',
    families: [
      {
        name: 'Poly(lactic acid) / Polylactide (PLLA, PDLA, PDLLA)',
        acronym: 'PLA',
        formula: '[-CH(CH3)-COO-]n',
        repeatUnit: 'Lactic acid / Lactide',
        repeatUnitMass: 72.06,
        tg: '55 - 65 °C',
        tm: '150 - 180 °C (stereocomplex up to 230 °C)',
        crystallinity: '0 - 45% (dependent on D/L ratio)',
        solubility: 'Dichloromethane, chloroform, THF, dioxane',
        synthesis: 'Coordination-insertion ring-opening polymerization (ROP) of cyclic lactide dimer using tin(II) 2-ethylhexanoate (Sn(Oct)2) or organocatalysts.',
        properties: 'Bio-derived from corn/sugarcane starch, high tensile strength (~60 MPa), compostable under industrial conditions, stereocomplexation.',
        applications: '3D printing filament, sustainable food packaging, bioresorbable orthopedic screws, suture anchors.',
        searchQuery: '"poly(lactic acid)" OR polylactide OR PLA OR PLLA'
      },
      {
        name: 'Poly(lactic-co-glycolic acid)',
        acronym: 'PLGA',
        formula: '[-[CH(CH3)-COO]x-[CH2-COO]y-]n',
        repeatUnit: 'Lactic and glycolic acid random copolymer',
        repeatUnitMass: 'Variable (ratio-dependent)',
        tg: '40 - 55 °C',
        tm: 'Amorphous (for 50:50 copolymer)',
        solubility: 'Chlorinated solvents, acetone, ethyl acetate',
        synthesis: 'Ring-opening copolymerization of lactide and glycolide monomers in varying ratios (50:50, 75:25, 85:15).',
        properties: 'FDA-approved bioresorbable copolymer with degradation rate finely tunable from 2 weeks to 6 months via lactic/glycolic stoichiometry.',
        applications: 'Controlled drug release depot microspheres (Lupron Depot), dissolving sutures (Vicryl), tissue regeneration scaffolds.',
        searchQuery: '"poly(lactic-co-glycolic acid)" OR PLGA'
      },
      {
        name: 'Polycaprolactone',
        acronym: 'PCL',
        formula: '[-O-(CH2)5-CO-]n',
        repeatUnit: 'ε-Caprolactone',
        repeatUnitMass: 114.14,
        tg: '-60 °C',
        tm: '60 °C',
        crystallinity: '50 - 60%',
        solubility: 'Chloroform, toluene, THF, benzene',
        synthesis: 'Ring-opening polymerization of ε-caprolactone catalyzed by stannous octoate or aluminum alkoxides.',
        properties: 'Exceptionally low glass transition, semi-crystalline flexibility, slow physiological degradation (2–3 years), excellent blend miscibility.',
        applications: 'Long-term contraceptive drug implants (Capronor), bone tissue engineering scaffolds, thermoplastic splints.',
        searchQuery: 'polycaprolactone OR PCL'
      },
      {
        name: 'Polyethylene Terephthalate',
        acronym: 'PET',
        formula: '[-CO-C6H4-CO-O-CH2-CH2-O-]n',
        repeatUnit: 'Ethylene terephthalate',
        repeatUnitMass: 192.17,
        tg: '76 - 80 °C',
        tm: '250 - 260 °C',
        crystallinity: '30 - 50%',
        solubility: 'Phenol/tetrachloroethane, hexafluoroisopropanol (HFIP)',
        synthesis: 'Melt-phase transesterification of dimethyl terephthalate or esterification of purified terephthalic acid with ethylene glycol.',
        properties: 'Superb carbon dioxide and oxygen gas barrier, mechanical toughness, high recyclability (mechanical and enzymatic glycolysis).',
        applications: 'Beverage bottles, synthetic textile polyester fiber (Dacron), food thermoforming trays, photographic films.',
        searchQuery: '"polyethylene terephthalate" OR PET OR "recycled PET"'
      },
      {
        name: 'Polyhydroxyalkanoates (PHB, PHBV)',
        acronym: 'PHA / PHB',
        formula: '[-O-CH(CH3)-CH2-CO-]n',
        repeatUnit: '3-hydroxybutyrate',
        repeatUnitMass: 86.09,
        tg: '2 - 5 °C',
        tm: '175 - 180 °C',
        solubility: 'Hot chloroform, 1,2-dichloroethane',
        synthesis: 'Bacterial fermentation of sugars or lipids by Cupriavidus necator as cellular energy storage.',
        properties: '100% bio-based, marine biodegradable without industrial composting, high barrier resistance.',
        applications: 'Marine-degradable packaging, agricultural mulching films, bio-based disposable utensils.',
        searchQuery: 'polyhydroxyalkanoate OR polyhydroxybutyrate OR PHA OR PHB'
      }
    ],
    synthesisMethods: [
      'Coordination-Insertion Ring-Opening Polymerization (ROP)',
      'Organocatalytic ROP (using TBD, DBU, and Thiourea catalysts)',
      'Melt Polycondensation of Dicarboxylic Acids and Diols',
      'Enzymatic Ring-Opening Polymerization (Lipase B / CALB)',
      'Biosynthetic Fermentation via Engineered Microbial Strains'
    ],
    keyProperties: [
      'Enzymatic and Hydrolytic Biodegradability to Non-Toxic Metabolites',
      'Wide Range of Degradation Halflives (Weeks to Years)',
      'High Biocompatibility and FDA Regulatory Approvals',
      'Stereocomplexation Between Enantiomeric Chains (PLLA + PDLA)',
      'Closed-Loop Chemical Depolymerization Back to Monomers'
    ],
    characterization: [
      'Gel Permeation Chromatography in Chloroform or HFIP',
      'Differential Scanning Calorimetry (DSC) for Melting and Enthalpy',
      'In Vitro Hydrolytic Erosion Mass Loss & pH Drift Monitoring',
      'Polarized Optical Microscopy (POM) for Spherulite Morphology',
      'X-Ray Diffraction (WAXS / SAXS) for Crystalline Lattice Parameters'
    ],
    applications: [
      'FDA-Approved Bioresorbable Sutures, Screws, and Plates',
      'Controlled Sustained Drug Release Microspheres and Implants',
      'Biodegradable Agricultural Mulch Films and Seed Coatings',
      'Circular Industrial Beverage Packaging and Closed-Loop Recycling',
      '3D Printed Regenerative Tissue Scaffolds and Vascular Grafts'
    ],
    relatedTopics: ['PLA', 'PLGA', 'PCL', 'Biodegradable', 'ROP', 'Circular Plastics', 'Organocatalysis'],
    relatedJournals: [
      'Biomacromolecules',
      'Macromolecules',
      'Polymer Chemistry',
      'Progress in Polymer Science',
      'ACS Applied Polymer Materials'
    ],
    searchQuery: 'polyester OR PLA OR PLGA OR PCL OR "poly(lactic acid)" OR polycaprolactone OR biodegradable OR PHA'
  },
  {
    id: 'domain-5',
    slug: 'polyamides-polypeptides',
    title: 'Polyamides & Polypeptides',
    shortDescription: 'Hydrogen-bonded peptide and amide macromolecules featuring nylons, aramids, polypeptoids, and synthetic proteins.',
    categoryType: 'synthetic',
    visualIdentity: {
      theme: 'Rose and magenta',
      gradient: 'from-rose-500 via-pink-600 to-fuchsia-700',
      bgGlow: 'rgba(244, 63, 94, 0.15)',
      borderColor: 'border-rose-500/40',
      hoverBorder: 'hover:border-rose-400',
      badgeBg: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      glowColor: 'purple',
      accentColor: '#f43f5e'
    },
    motifType: 'h_bond_sheet',
    introduction: 'Polyamides and polypeptides are defined by the recurring amide linkage (-CO-NH-), which enables dense intermolecular hydrogen bonding. This results in high melting points, solvent resistance, and mechanical strength in engineering nylons (Nylon-6, Nylon-6,6) and ultra-high modulus aramids (Kevlar). Synthetic polypeptides and polypeptoids mimic secondary protein structures (alpha-helices and beta-sheets) for advanced biomaterials.',
    families: [
      {
        name: 'Nylon-6 and Nylon-6,6',
        acronym: 'PA 6 / PA 66',
        formula: 'PA6: [-NH-(CH2)5-CO-]n  |  PA66: [-NH-(CH2)6-NH-CO-(CH2)4-CO-]n',
        repeatUnit: 'Caprolactam (PA6) / Hexamethylenediamine + Adipic acid (PA66)',
        repeatUnitMass: 113.16,
        tg: '45 - 55 °C',
        tm: '220 °C (PA6), 265 °C (PA66)',
        solubility: 'Formic acid, m-cresol, sulfuric acid',
        synthesis: 'Hydrolytic ring-opening polymerization of caprolactam or step-growth polycondensation of hexamethylenediammonium adipate.',
        properties: 'Extensive interchain hydrogen bonding, high tensile strength, fatigue endurance, abrasion resistance.',
        applications: 'Engineering gears, automotive intake manifolds, parachute textiles, acoustic guitar strings.',
        searchQuery: '"polyamide 6" OR "nylon 6" OR "nylon 6,6" OR "PA66"'
      },
      {
        name: 'Aromatic Polyamides (Aramids / Kevlar & Nomex)',
        acronym: 'PPTA',
        formula: '[-NH-C6H4-NH-CO-C6H4-CO-]n',
        repeatUnit: 'p-phenylene terephthalamide',
        repeatUnitMass: 238.24,
        tg: '>300 °C (decomposes before melting >500 °C)',
        solubility: 'Concentrated sulfuric acid (lyotropic liquid crystalline phase)',
        synthesis: 'Low-temperature solution polycondensation of p-phenylenediamine and terephthaloyl chloride in NMP/CaCl2.',
        properties: 'Liquid crystalline nematic alignment, exceptional specific tensile modulus, bulletproof ballistic protection, flame resistance.',
        applications: 'Ballistic armor vests, fiber-optic cable strength members, aerospace composites, firefighter turnout gear.',
        searchQuery: 'aramid OR Kevlar OR "poly(p-phenylene terephthalamide)" OR Nomex'
      },
      {
        name: 'Synthetic Polypeptides & Peptoids',
        acronym: 'NCA-Polypeptides / Peptoids',
        formula: '[-NH-CHR-CO-]n (polypeptides) / [-NR-CH2-CO-]n (peptoids)',
        repeatUnit: 'α-Amino acid / N-substituted glycine',
        repeatUnitMass: 'Variable (residue-dependent)',
        tg: 'Varies with sidechain',
        solubility: 'Water, hexafluoroisopropanol, DMF',
        synthesis: 'Living ring-opening polymerization of α-amino acid N-carboxyanhydrides (NCAs) initiated by primary amines.',
        properties: 'Self-assembly into stable α-helices and β-sheets, enzymatic degradability, precision sequence control.',
        applications: 'Antimicrobial polymers, stimuli-responsive polypeptide hydrogels, targeted intracellular drug carriers.',
        searchQuery: '"polypeptide" OR "peptoid" OR "N-carboxyanhydride" OR "NCA polymerization"'
      }
    ],
    synthesisMethods: [
      'Hydrolytic and Anionic Ring-Opening Polymerization of Lactams',
      'Step-Growth Melt and Interfacial Polycondensation',
      'Amine-Initiated Living ROP of α-Amino Acid N-Carboxyanhydrides (NCAs)',
      'Submonomer Solid-Phase Synthesis of Polypeptoids',
      'Enzymatic Peptide Bond Formation'
    ],
    keyProperties: [
      'Dense Intermolecular Hydrogen Bonding Networks',
      'High Crystallinity and Elevated Thermal Melting Points (>200–500 °C)',
      'Exceptional Tensile Strength and Abrasion Resistance',
      'Biomimetic Secondary Structure Folding (Helices and Sheets)',
      'Lyotropic Liquid Crystalline Spun Fibers'
    ],
    characterization: [
      'Viscometry in Formic Acid or m-Cresol for Inherent Viscosity',
      'Circular Dichroism (CD) Spectroscopy for Secondary Protein Conformation',
      'Fourier-Transform Infrared Spectroscopy (FTIR for Amide I and II Bands)',
      'Solid-State 13C-NMR for Hydrogen-Bond Geometry',
      'Dynamic Mechanical Analysis (DMA)'
    ],
    applications: [
      'Heavy-Duty Automotive and Industrial Structural Components',
      'Ballistic Armor Protection and High-Temperature Firefighting Gear',
      'Antimicrobial and Antifungal Macromolecular Therapeutics',
      'Self-Assembling Peptide Scaffolds for Neural Tissue Repair',
      'High-Performance Synthetic Textiles and Cordage'
    ],
    relatedTopics: ['Nylon', 'Aramids', 'Polypeptides', 'NCA', 'Hydrogen Bonding', 'Kevlar'],
    relatedJournals: [
      'Biomacromolecules',
      'Macromolecules',
      'Polymer Chemistry',
      'Journal of the American Chemical Society',
      'Advanced Functional Materials'
    ],
    searchQuery: 'polyamide OR nylon OR aramid OR polypeptide OR peptoid OR "N-carboxyanhydride"'
  },
  {
    id: 'domain-6',
    slug: 'polyethers',
    title: 'Polyethers',
    shortDescription: 'Flexible oxyalkylene backbone polymers including PEG, PEO, and high-performance polyetheretherketone (PEEK).',
    categoryType: 'synthetic',
    visualIdentity: {
      theme: 'Turquoise and blue',
      gradient: 'from-cyan-600 via-teal-500 to-blue-700',
      bgGlow: 'rgba(20, 184, 166, 0.15)',
      borderColor: 'border-teal-500/40',
      hoverBorder: 'hover:border-teal-400',
      badgeBg: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
      glowColor: 'teal',
      accentColor: '#14b8a6'
    },
    motifType: 'flexible_oxyethylene',
    introduction: 'Polyethers feature flexible C-O-C ether linkages in the main polymer chain, providing low glass transition temperatures, extraordinary conformational flexibility, and high coordination ability toward metal cations. Poly(ethylene glycol) (PEG) is the gold standard for clinical PEGylation and stealth drug delivery, while aromatic polyethers like PEEK represent the peak of engineering plastics.',
    families: [
      {
        name: 'Poly(ethylene glycol) / Poly(ethylene oxide)',
        acronym: 'PEG / PEO',
        formula: '[-CH2-CH2-O-]n',
        repeatUnit: 'Ethylene oxide',
        repeatUnitMass: 44.05,
        tg: '-67 °C',
        tm: '60 - 65 °C',
        solubility: 'Water, ethanol, toluene, dichloromethane',
        synthesis: 'Anionic ring-opening polymerization of ethylene oxide using alkoxide or phosphazene initiators.',
        properties: 'Extensive hydration shell, non-immunogenic stealth profile, complexation with lithium ions, low toxicity.',
        applications: 'PEGylated therapeutic proteins, lipid nanoparticles for mRNA vaccines, solid polymer electrolytes, laxatives.',
        searchQuery: '"poly(ethylene glycol)" OR "poly(ethylene oxide)" OR PEG OR PEO'
      },
      {
        name: 'Poly(tetramethylene ether glycol) / Polytetrahydrofuran',
        acronym: 'PTMEG / PolyTHF',
        formula: '[-CH2-CH2-CH2-CH2-O-]n',
        repeatUnit: 'Tetrahydrofuran',
        repeatUnitMass: 72.11,
        tg: '-84 °C',
        tm: '30 - 35 °C',
        solubility: 'THF, alcohols, aromatics',
        synthesis: 'Cationic ring-opening polymerization of THF using superacids or oxonium salts with diols.',
        properties: 'Ultra-low glass transition temperature, high hydrolytic resistance, soft-segment flexibility.',
        applications: 'Soft segments in thermoplastic polyurethanes (Spandex / Lycra) and co-polyester elastomers.',
        searchQuery: 'PTMEG OR "poly(tetramethylene ether glycol)" OR polyTHF'
      },
      {
        name: 'Polyetheretherketone',
        acronym: 'PEEK',
        formula: '[-C6H4-O-C6H4-O-C6H4-CO-]n',
        repeatUnit: 'Ether-ether-ketone aromatic repeat',
        repeatUnitMass: 288.30,
        tg: '143 °C',
        tm: '343 °C',
        solubility: 'Only soluble in concentrated sulfuric acid',
        synthesis: 'Nucleophilic aromatic substitution step-growth polycondensation of 4,4\'-difluorobenzophenone and hydroquinone.',
        properties: 'Continuous operating temperature up to 260 °C, exceptional chemical resistance, sterilizable, radiolucent.',
        applications: 'Spinal fusion implants, aerospace brackets, high-pressure semiconductor seals, downhole oil drilling.',
        searchQuery: 'PEEK OR polyetheretherketone OR "poly(ether ether ketone)"'
      }
    ],
    synthesisMethods: [
      'Anionic Ring-Opening Polymerization of Epoxides',
      'Cationic ROP of Cyclic Ethers (THF, Oxetanes)',
      'Nucleophilic Aromatic Substitution (SNAr) Polycondensation',
      'Metal-Free Phosphazene Base Catalysis',
      'Coordinative ROP using Zinc / Bimetallic Cobalt Catalysts'
    ],
    keyProperties: [
      'Extreme Chain Flexibility Around the C-O Ether Bond',
      'Dense Hydration Sphere Preventing Protein Adsorption',
      'High Coordination Affinity for Alkali Metal Cations (Li+)',
      'Outstanding Thermal and Radiolytic Stability in Aromatic Ethers',
      'Excellent Hydrolytic Resistance Across Extreme pH Ranges'
    ],
    characterization: [
      'Aqueous and Organic Gel Permeation Chromatography',
      'Proton NMR for End-Group Analysis and Functionality Number',
      'Matrix-Assisted Laser Desorption Ionization (MALDI-TOF)',
      'Impedance Spectroscopy for Solid Polymer Electrolyte Conductivity',
      'Differential Scanning Calorimetry (DSC)'
    ],
    applications: [
      'PEGylated Biopharmaceuticals & mRNA COVID Vaccine Formulations',
      'Solid-State Lithium-Metal and Lithium-Ion Battery Electrolytes',
      'Thermoplastic Polyurethane Elastic Fibers (Spandex/Lycra)',
      'Permanent Orthopedic Spinal Fusion Cages and Cranial Implants',
      'Chemical-Resistant Aerospace and Automotive Components'
    ],
    relatedTopics: ['PEG', 'PEEK', 'Polyethers', 'Electrolytes', 'PEGylation', 'Chain Flexibility'],
    relatedJournals: [
      'Macromolecules',
      'Biomacromolecules',
      'Polymer Chemistry',
      'ACS Applied Materials & Interfaces',
      'Journal of the American Chemical Society'
    ],
    searchQuery: 'polyether OR "poly(ethylene glycol)" OR PEG OR PEO OR PEEK OR "solid polymer electrolyte"'
  },
  {
    id: 'domain-7',
    slug: 'high-performance-polymers',
    title: 'High-Performance Polymers',
    shortDescription: 'Thermal, mechanical, and aerospace extremes: Polyimides, polycarbonates, polyurethanes, and polysulfones.',
    categoryType: 'synthetic',
    visualIdentity: {
      theme: 'Deep blue and silver',
      gradient: 'from-slate-700 via-indigo-900 to-blue-900',
      bgGlow: 'rgba(99, 102, 241, 0.15)',
      borderColor: 'border-slate-500/40',
      hoverBorder: 'hover:border-slate-300',
      badgeBg: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
      glowColor: 'indigo',
      accentColor: '#6366f1'
    },
    motifType: 'rigid_aromatic',
    introduction: 'High-performance engineering polymers are designed to withstand aggressive environments, ionizing radiation, mechanical loads, and continuous temperatures exceeding 200–400 °C. Anchored by rigid aromatic rings, heteroaromatic imide heterocycles, carbonate, and sulfone bridges, these polymers serve critical functions in microelectronics, aerospace thermal blankets, and high-pressure membranes.',
    families: [
      {
        name: 'Aromatic Polyimides (Kapton)',
        acronym: 'PI',
        formula: '[-N(CO)2-C6H2(CO)2-N-C6H4-O-C6H4-]n',
        repeatUnit: 'PMDA-ODA diimide',
        repeatUnitMass: 382.32,
        tg: '360 - 410 °C',
        solubility: 'Insoluble in fully imidized form; soluble as poly(amic acid) precursor',
        synthesis: 'Two-step polycondensation of pyromellitic dianhydride (PMDA) and 4,4\'-oxydianiline (ODA) followed by thermal/chemical imidization.',
        properties: 'Thermal stability from -269 °C to +400 °C, dielectric breakdown resistance, radiation tolerance.',
        applications: 'Flexible printed circuit boards (FPCBs), spacecraft thermal insulation blankets, semiconductor passivations.',
        searchQuery: 'polyimide OR Kapton OR "poly(amic acid)"'
      },
      {
        name: 'Polycarbonate (Bisphenol-A PC)',
        acronym: 'PC',
        formula: '[-O-C6H4-C(CH3)2-C6H4-O-CO-]n',
        repeatUnit: 'Bisphenol A carbonate',
        repeatUnitMass: 254.28,
        tg: '147 - 150 °C',
        solubility: 'Dichloromethane, chloroform, pyridine',
        synthesis: 'Interfacial polycondensation of bisphenol A with phosgene or melt transesterification with diphenyl carbonate.',
        properties: 'Superb impact toughness (virtually unbreakable), high optical clarity, heat deflection temperature 135 °C.',
        applications: 'Bulletproof laminates, automotive headlight lenses, safety riot shields, incubator housings.',
        searchQuery: 'polycarbonate OR "bisphenol A polycarbonate" OR PC'
      },
      {
        name: 'Thermoplastic Polyurethanes',
        acronym: 'TPU / PU',
        formula: '[-O-R-O-CO-NH-R\'-NH-CO-]n',
        repeatUnit: 'Diisocyanate + Diol carbamate',
        repeatUnitMass: 'Segmented',
        tg: '-50 °C (soft segment) / 110 °C (hard segment)',
        solubility: 'DMF, DMAc, DMSO',
        synthesis: 'Step-growth polyaddition of diisocyanates (MDI/TDI), macroglycols (PTMEG/polyester), and short chain extenders (BDO).',
        properties: 'Microphase-separated hard/soft domains, high abrasion resistance, elastomeric elasticity without vulcanization.',
        applications: 'High-performance footwear soles, automotive gaskets, medical catheters, protective screen films.',
        searchQuery: 'polyurethane OR "thermoplastic polyurethane" OR TPU'
      },
      {
        name: 'Polysulfones and Polyethersulfones',
        acronym: 'PSU / PES',
        formula: '[-C6H4-SO2-C6H4-O-C6H4-C(CH3)2-C6H4-O-]n',
        repeatUnit: 'Sulfone-diphenylene ether',
        repeatUnitMass: 442.53,
        tg: '185 - 225 °C',
        solubility: 'DMF, NMP, chloroform',
        synthesis: 'Nucleophilic step-growth polycondensation of bisphenol A and 4,4\'-dichlorodiphenyl sulfone.',
        properties: 'Autoclave steam sterilizable, oxidation resistance, chemical inertness, high mechanical creep resistance.',
        applications: 'Hemodialysis hollow-fiber membranes, water desalination modules, aircraft interior panels.',
        searchQuery: 'polysulfone OR polyethersulfone OR PSU OR PES'
      }
    ],
    synthesisMethods: [
      'Two-Step Poly(amic acid) Condensation and Thermal Imidization',
      'Interfacial and Melt Transesterification Polycondensation',
      'Step-Growth Polyaddition (Isocyanate-Hydroxyl Addition)',
      'Nucleophilic Aromatic Polycondensation in High-Boiling Solvents',
      'Solid-State Polymerization (SSP) for Molecular Weight Advancement'
    ],
    keyProperties: [
      'Exceptional Continuous Service Temperature (Up to 300–400 °C)',
      'Microphase-Separated Domain Elasticity (Polyurethanes)',
      'High Dielectric Strength and Low Loss Tangent in Electronics',
      'Hydrolytic and Autoclave Steam Sterilization Tolerance',
      'Outstanding Radiation and Atomic Oxygen Resistance in Space'
    ],
    characterization: [
      'Thermogravimetric Analysis with Mass Spectrometry (TGA-MS @ 800 °C)',
      'Dynamic Mechanical Thermal Analysis (DMTA) for High-Temperature Modulus',
      'Fourier-Transform Infrared (FTIR) Monitoring of Imidization Kinetics',
      'Dielectric Breakdown Testing and Impedance Characterization',
      'Tensile Creep and Environmental Stress Cracking Resistance'
    ],
    applications: [
      'Spacecraft Multilayer Insulation (MLI) and Re-entry Components',
      'Flexible Semiconductor Circuit Substrates and 5G Antenna Dielectrics',
      'Hemodialysis Artificial Kidney Hollow-Fiber Membranes',
      'Impact-Proof Ballistic Glazing and Automotive Structural Elements',
      'Medical Implantable Catheters and Blood-Contacting Devices'
    ],
    relatedTopics: ['Polyimide', 'Polycarbonate', 'Polyurethane', 'Polysulfone', 'Aerospace', 'Thermal Stability'],
    relatedJournals: [
      'Macromolecules',
      'Polymer Chemistry',
      'ACS Applied Materials & Interfaces',
      'Progress in Polymer Science',
      'Polymer'
    ],
    searchQuery: 'polyimide OR polycarbonate OR polyurethane OR polysulfone OR "high performance polymer" OR Kapton'
  },
  {
    id: 'domain-8',
    slug: 'sulfur-containing-polymers',
    title: 'Sulfur-Containing Polymers',
    shortDescription: 'Dynamic disulfide covalent adaptable networks, high-refractive-index polysulfides, and elemental sulfur inverse vulcanization.',
    categoryType: 'synthetic',
    visualIdentity: {
      theme: 'Amber and purple',
      gradient: 'from-amber-600 via-orange-600 to-purple-800',
      bgGlow: 'rgba(217, 119, 6, 0.15)',
      borderColor: 'border-amber-500/40',
      hoverBorder: 'hover:border-amber-400',
      badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      glowColor: 'amber',
      accentColor: '#d97706'
    },
    motifType: 'disulfide_bridge',
    introduction: 'Sulfur-containing macromolecules leverage the unique polarizability, redox reversibility, and dynamic exchange chemistry of sulfur atoms. These include redox-responsive disulfide biomaterials that disassemble in tumor environments (GSH-triggered), ultra-high refractive index polysulfides for infrared optics, and inverse vulcanization polymers that transform industrial sulfur byproduct into circular cathode materials.',
    families: [
      {
        name: 'Inverse Vulcanization Polymers',
        acronym: 'S-Polymers',
        formula: '[-S-S-S-R-S-S-]n',
        repeatUnit: 'Crosslinked polysulfur network',
        repeatUnitMass: 'Network-dependent',
        tg: '-30 to 80 °C',
        solubility: 'Crosslinked / insoluble or partially soluble in CS2/toluene',
        synthesis: 'Direct radical ring-opening of molten elemental sulfur (S8) at >159 °C stabilized with diene crosslinkers (DIB, limonene).',
        properties: 'Composed of 50–90 wt% elemental sulfur, high optical transparency in Mid-IR (3–5 and 8–12 µm), dynamic S-S bonds.',
        applications: 'Lithium-sulfur battery cathodes, thermal imaging lenses, mercury heavy-metal water capture sponges.',
        searchQuery: '"inverse vulcanization" OR "polysulfide polymer" OR "sulfur polymer"'
      },
      {
        name: 'Dynamic Disulfide Polymers & Vitrimers',
        acronym: 'SS-Vitrimers',
        formula: '[-R-S-S-R\'-]n',
        repeatUnit: 'Disulfide-linked macromolecule',
        repeatUnitMass: 'Variable',
        tg: 'Varies from -20 to 120 °C',
        solubility: 'Swelling gels or solvent-cleavable under reducing agents',
        synthesis: 'Oxidative thiol-thiol coupling, thiol-disulfide exchange, or step-growth of dithiol monomers.',
        properties: 'Reversible bond cleavage via glutathione (GSH) reduction, autonomic self-healing at room/moderate temperature, vitrimeric reprocessability.',
        applications: 'Tumor-targeted intracellular drug delivery, recyclable thermosets, self-healing elastomers, dynamic adhesives.',
        searchQuery: '"disulfide bond" OR "disulfide polymer" OR "thiol-disulfide exchange"'
      },
      {
        name: 'Poly(phenylene sulfide)',
        acronym: 'PPS',
        formula: '[-C6H4-S-]n',
        repeatUnit: 'p-phenylene sulfide',
        repeatUnitMass: 108.16,
        tg: '85 - 90 °C',
        tm: '280 - 285 °C',
        solubility: 'Insoluble in all solvents below 200 °C',
        synthesis: 'High-temperature solution polycondensation of p-dichlorobenzene and sodium sulfide in NMP.',
        properties: 'Exceptional chemical resistance (unaffected by virtually all chemicals), flame retardant (LOI 47), dimensional stability.',
        applications: 'Automotive fuel pump housings, hot-gas particulate filtration bags, semiconductor test sockets.',
        searchQuery: '"polyphenylene sulfide" OR "poly(phenylene sulfide)" OR PPS'
      }
    ],
    synthesisMethods: [
      'Inverse Vulcanization of Elemental Sulfur (S8)',
      'Oxidative Thiol-Thiol Coupling & Thiol-Ene "Click" Polymerization',
      'Step-Growth Nucleophilic Substitution of Sodium Sulfide',
      'Dynamic Disulfide Exchange in Covalent Adaptable Networks (CANs)',
      'Ring-Opening Polymerization of Cyclic Thiolactones'
    ],
    keyProperties: [
      'Reversible Redox Cleavage Triggered by Intracellular Glutathione (GSH)',
      'Ultra-High Refractive Indices (n > 1.7 to 2.1) for Advanced Infrared Optics',
      'Dynamic S-S Metathesis for Autonomic Self-Healing and Vitrimer Recycling',
      'High Affinity Heavy Metal (Hg2+, Pb2+) Chelation and Sequestration',
      'High Theoretical Specific Capacity in Lithium-Sulfur Batteries'
    ],
    characterization: [
      'Raman Spectroscopy for Characteristic S-S (510 cm-1) and C-S Bands',
      'Fourier-Transform Infrared (FTIR) for Mid-IR Transparency Windows',
      'X-Ray Photoelectron Spectroscopy (XPS) for Sulfur Oxidation States',
      'Cyclic Voltammetry (CV) for Electrochemical Redox Profiles',
      'Dynamic Mechanical Analysis (DMA) for Stress Relaxation Kinetics'
    ],
    applications: [
      'Next-Generation High-Energy-Density Lithium-Sulfur (Li-S) Batteries',
      'Infrared Night-Vision and Thermal Camera Polymeric Optical Lenses',
      'Glutathione-Responsive Intracellular Oncology Drug Delivery',
      'Environmental Remediation for Toxic Mercury and Lead Removal',
      'Recyclable Automotive Thermosets and Self-Healing Coatings'
    ],
    relatedTopics: ['Inverse Vulcanization', 'Disulfide', 'Li-S Batteries', 'Vitrimers', 'PPS', 'Self-Healing'],
    relatedJournals: [
      'Macromolecules',
      'Journal of the American Chemical Society',
      'Polymer Chemistry',
      'Advanced Materials',
      'ACS Applied Materials & Interfaces'
    ],
    searchQuery: '"inverse vulcanization" OR "disulfide" OR "polysulfide" OR "poly(phenylene sulfide)" OR "sulfur-containing polymer"'
  },
  {
    id: 'domain-9',
    slug: 'silicon-containing-polymers',
    title: 'Silicon-Containing Polymers',
    shortDescription: 'Inorganic-organic hybrid polymers: Polydimethylsiloxanes (PDMS), polycarbosilanes, and silsesquioxanes (POSS).',
    categoryType: 'synthetic',
    visualIdentity: {
      theme: 'Cyan and silver',
      gradient: 'from-cyan-600 via-slate-600 to-teal-800',
      bgGlow: 'rgba(6, 182, 212, 0.15)',
      borderColor: 'border-cyan-500/40',
      hoverBorder: 'hover:border-cyan-400',
      badgeBg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
      glowColor: 'teal',
      accentColor: '#06b6d4'
    },
    motifType: 'siloxane_spiral',
    introduction: 'Silicon-containing polymers feature alternating silicon-oxygen (siloxanes) or silicon-carbon (carbosilanes) backbones. The exceptionally long Si-O bond length and wide Si-O-Si bond angle impart unparalleled torsional flexibility, lowest glass transition temperatures (Tg = -125 °C), extreme hydrophobicity, biocompatibility, and high gas permeability.',
    families: [
      {
        name: 'Polydimethylsiloxane (Silicone)',
        acronym: 'PDMS',
        formula: '[-Si(CH3)2-O-]n',
        repeatUnit: 'Dimethylsiloxane',
        repeatUnitMass: 74.15,
        tg: '-125 °C',
        solubility: 'Hexane, toluene, ethyl acetate, THF; insoluble in water',
        synthesis: 'Ring-opening polymerization of octamethylcyclotetrasiloxane (D4) or hydrolytic polycondensation of dimethyldichlorosilane.',
        properties: 'Lowest known glass transition temperature, high gas permeability (O2, CO2), physiological inertness, transparent dielectric.',
        applications: 'Microfluidic lab-on-a-chip devices, soft contact lenses, medical breast/joint implants, antifouling marine foul-release.',
        searchQuery: 'polydimethylsiloxane OR PDMS OR silicone'
      },
      {
        name: 'Polyhedral Oligomeric Silsesquioxanes',
        acronym: 'POSS',
        formula: '(RSiO1.5)8',
        repeatUnit: 'Inorganic silica-like cubic core with organic vertices',
        repeatUnitMass: '800 - 1500 g/mol',
        tg: 'Nanofiller / hybrid modifier',
        solubility: 'Dependent on organic vertex groups R',
        synthesis: 'Controlled hydrolytic condensation of trifunctional organosilanes RSiCl3 in organic solvents.',
        properties: 'Monodisperse 1.5 nm rigid inorganic silica cube that can be copolymerized as a pendant or crosslinking hybrid monomer.',
        applications: 'Atomic oxygen-resistant space coatings, high-temperature composite tougheners, flame retardant additives.',
        searchQuery: 'POSS OR silsesquioxane OR "polyhedral oligomeric silsesquioxane"'
      }
    ],
    synthesisMethods: [
      'Cationic and Anionic Equilibrium Ring-Opening Polymerization of Cyclic Siloxanes',
      'Platinum-Catalyzed Hydrosilylation Crosslinking (Si-H + Vinyl)',
      'Hydrolytic Sol-Gel Polycondensation of Alkoxysilanes',
      'Condensation of Silanol-Terminated Macromers',
      'Free Radical and ATRP Grafting of Vinyl POSS Monomers'
    ],
    keyProperties: [
      'Ultra-Low Glass Transition Temperature (Tg down to -125 °C)',
      'Exceptional Gas Permeability Coefficients for O2 and CO2',
      'High Thermal and Dielectric Stability (Silica-Like Hybrid Nature)',
      'Outstanding Hydrophobicity and Extremely Low Surface Energy',
      'Non-Toxic, Hemocompatible, and Biocompatible Profile'
    ],
    characterization: [
      '29Si Nuclear Magnetic Resonance (NMR) for Siloxane Architecture (M, D, T, Q)',
      'Contact Angle Goniometry for Surface Energy and Wetting Behavior',
      'Gas Permeation Cell Manometry for Gas Transport Coefficients',
      'Rheometry for Hydrosilylation Gelation Point Monitoring',
      'Atomic Force Microscopy (AFM) for Surface Elastic Modulus'
    ],
    applications: [
      'Soft Lithography and Microfluidic Lab-on-a-Chip Biochips',
      'Extended-Wear High-Oxygen Permeability Silicone Hydrogel Contact Lenses',
      'Space-Grade Atomic Oxygen Resistant Thermal Control Coatings',
      'Antifouling Non-Biocidal Foul-Release Marine Ship Hull Paints',
      'Flexible Wearable Electronic Substrates and Soft Robotics Actuators'
    ],
    relatedTopics: ['PDMS', 'Silicone', 'POSS', 'Microfluidics', 'Hydrosilylation', 'Gas Permeability'],
    relatedJournals: [
      'Macromolecules',
      'ACS Applied Materials & Interfaces',
      'Polymer Chemistry',
      'Advanced Functional Materials',
      'Lab on a Chip'
    ],
    searchQuery: 'polydimethylsiloxane OR PDMS OR silicone OR silsesquioxane OR POSS OR "silicon-containing polymer"'
  },
  {
    id: 'domain-10',
    slug: 'conducting-polymers',
    title: 'Conducting Polymers',
    shortDescription: 'Conjugated electroactive polymers: PEDOT:PSS, polyaniline, polythiophenes, organic photovoltaics, and bioelectronics.',
    categoryType: 'functional',
    visualIdentity: {
      theme: 'Neon teal and electric blue',
      gradient: 'from-teal-500 via-cyan-500 to-blue-600',
      bgGlow: 'rgba(20, 184, 166, 0.15)',
      borderColor: 'border-cyan-500/40',
      hoverBorder: 'hover:border-cyan-400',
      badgeBg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
      glowColor: 'teal',
      accentColor: '#06b6d4'
    },
    motifType: 'conjugated_pi',
    introduction: 'Conducting and conjugated polymers possess an alternating single and double carbon-carbon bond backbone with delocalized pi-electrons. Chemical or electrochemical doping (oxidation or reduction) introduces mobile polarons and bipolarons, elevating electrical conductivity by up to 10 orders of magnitude into the metallic regime, bridging synthetic chemistry and flexible bioelectronics.',
    families: [
      {
        name: 'Poly(3,4-ethylenedioxythiophene):Poly(styrenesulfonate)',
        acronym: 'PEDOT:PSS',
        formula: '[-C6H4O2S-]n : [-CH2-CH(C6H4SO3H)-]m',
        repeatUnit: 'EDOT radical cation + Polystyrenesulfonate polyanion',
        repeatUnitMass: '142.18 (EDOT) / 184.21 (PSS)',
        conductivity: '1 - 1000 S/cm (with DMSO/ethylene glycol secondary doping)',
        solubility: 'Stable aqueous colloidal dispersion',
        synthesis: 'Oxidative chemical polymerization of EDOT with Na2S2O8 or FeCl3 in the presence of PSS template.',
        properties: 'High optical transparency in thin films, high mechanical flexibility, mixed ionic-electronic conduction (MIEC).',
        applications: 'Organic electrochemical transistors (OECTs), flexible neural probes, touch screen electrodes, thermoelectric generators.',
        searchQuery: '"PEDOT:PSS" OR PEDOT OR "poly(3,4-ethylenedioxythiophene)"'
      },
      {
        name: 'Polyaniline',
        acronym: 'PANI',
        formula: '[-C6H4-NH-C6H4-NH-]1-y[-C6H4-N=C6H4=N-]y',
        repeatUnit: 'Aniline quinoid / benzenoid rings',
        repeatUnitMass: 91.11,
        conductivity: '0.1 - 100 S/cm (emeraldine salt)',
        solubility: 'NMP, concentrated sulfuric acid (deprotonated form)',
        synthesis: 'Oxidative chemical or electrochemical polymerization of aniline with ammonium persulfate in acidic aqueous media.',
        properties: 'Reversible protonic acid doping/dedoping with vivid electrochromic color changes (yellow-green-blue-violet).',
        applications: 'Corrosion-protective smart coatings, supercapacitor electrodes, gas and pH sensors, antistatic shielding.',
        searchQuery: 'polyaniline OR PANI OR "emeraldine salt"'
      },
      {
        name: 'Poly(3-hexylthiophene)',
        acronym: 'P3HT',
        formula: '[-C4HS(C6H13)-]n',
        repeatUnit: '3-hexylthiophene',
        repeatUnitMass: 166.28,
        chargeCarrierMobility: '0.1 cm²/V·s (in OFETs)',
        solubility: 'Chloroform, chlorobenzene, toluene',
        synthesis: 'Kumada Catalyst Transfer Polymerization (KCTP) yielding regioregular head-to-tail P3HT.',
        properties: 'Controlled regioregularity (>98%), self-assembly into pi-pi stacked lamellar crystalline nanofibrils.',
        applications: 'Organic photovoltaics (OPV donor with PCBM / non-fullerene acceptors), organic field-effect transistors (OFETs).',
        searchQuery: 'P3HT OR "poly(3-hexylthiophene)" OR "conjugated polymer"'
      }
    ],
    synthesisMethods: [
      'Kumada Catalyst Transfer Polymerization (KCTP / Quasi-Living)',
      'Direct Arylation Polymerization (DArP)',
      'Oxidative Chemical Polymerization with Persulfate or Transition Metal Salts',
      'Electrochemical Deposition on Electrode Microarrays',
      'Stille and Suzuki-Miyaura Cross-Coupling Polycondensation'
    ],
    keyProperties: [
      'Mixed Ionic-Electronic Conduction (MIEC) for Biological Interfacing',
      'Tunable Band Gap and Optical Absorption Across Visible and Near-IR',
      'Chemical and Electrochemical Reversible Doping (p-type and n-type)',
      'Mechanical Flexibility and Biocompatibility for Wearable Electronics',
      'High Volumetric Capacitance for Supercapacitive Energy Storage'
    ],
    characterization: [
      'Four-Point Probe Electrical Conductivity (Van der Pauw Method)',
      'Organic Electrochemical Transistor (OECT) Transconductance (gm)',
      'Spectroelectrochemistry (In Situ UV-Vis-NIR Polaron Tracking)',
      'Grazing-Incidence Wide-Angle X-Ray Scattering (GIWAXS) for Pi-Pi Stacking',
      'Cyclic Voltammetry (CV) and Electrochemical Impedance Spectroscopy (EIS)'
    ],
    applications: [
      'In Vivo Neural Probes, Brain-Computer Interfaces, and EMG Electrodes',
      'Wearable Biosensors for Sweat, Glucose, and Biomarker Monitoring',
      'Flexible Organic Thermoelectric and Photovoltaic Energy Harvesters',
      'Transparent Antistatic Touch Screen Electrodes',
      'Soft Bioelectronic Actuators and Artificial Neuromorphic Synapses'
    ],
    relatedTopics: ['PEDOT:PSS', 'Polyaniline', 'P3HT', 'Bioelectronics', 'Conjugated', 'OECT'],
    relatedJournals: [
      'Advanced Materials',
      'Macromolecules',
      'Polymer Chemistry',
      'ACS Applied Materials & Interfaces',
      'Journal of the American Chemical Society'
    ],
    searchQuery: 'PEDOT OR polyaniline OR polythiophene OR P3HT OR "conducting polymer" OR "conjugated polymer" OR bioelectronics'
  },
  {
    id: 'domain-11',
    slug: 'natural-biopolymers',
    title: 'Natural & Biopolymers',
    shortDescription: 'Nature’s macromolecular architectures: Cellulose, chitin, chitosan, alginate, hyaluronic acid, and natural rubber.',
    categoryType: 'natural',
    visualIdentity: {
      theme: 'Green and lime',
      gradient: 'from-emerald-600 via-green-500 to-lime-600',
      bgGlow: 'rgba(34, 197, 94, 0.15)',
      borderColor: 'border-green-500/40',
      hoverBorder: 'hover:border-green-400',
      badgeBg: 'bg-green-500/15 text-green-300 border-green-500/30',
      glowColor: 'emerald',
      accentColor: '#22c55e'
    },
    motifType: 'polysaccharide_helix',
    introduction: 'Natural biopolymers are renewable, carbon-neutral macromolecules synthesized by plants, animals, and microorganisms. Formed predominantly from glycosidic-linked carbohydrates (polysaccharides) and amino acids (structural proteins), they possess innate biocompatibility, cellular signaling recognition motifs, chirality, and complete enzymatic biodegradability.',
    families: [
      {
        name: 'Cellulose & Nanocellulose (CNC, CNF)',
        acronym: 'Cellulose / CNC',
        formula: '[-C6H10O5-]n (β-1,4-D-glucan)',
        repeatUnit: 'Cellobiose',
        repeatUnitMass: 162.14,
        crystalModulus: '138 GPa (axial crystal modulus of cellulose I)',
        solubility: 'Insoluble in water/common organics; soluble in ionic liquids / NMMO',
        synthesis: 'Biosynthesized by plants, tunicates, and Acetobacter bacteria; CNC extracted via controlled sulfuric acid hydrolysis.',
        properties: 'Most abundant biopolymer on Earth, chiral nematic liquid crystalline iridescent self-assembly, high tensile stiffness.',
        applications: 'Cellulose nanofiber barrier films, aerogels, sustainable paper, structural composite reinforcement, wound dressings.',
        searchQuery: 'cellulose OR nanocellulose OR "cellulose nanocrystals" OR CNC OR CNF'
      },
      {
        name: 'Chitosan & Chitin',
        acronym: 'Chitosan',
        formula: '[-C6H11NO4-]x[-C8H13NO5-]1-x (β-1,4-linked D-glucosamine)',
        repeatUnit: 'Glucosamine / N-acetylglucosamine',
        repeatUnitMass: 161.16,
        isoelectricPoint: 'pKa ~ 6.5',
        solubility: 'Soluble in dilute aqueous acids (acetic acid, lactic acid)',
        synthesis: 'Partial alkaline deacetylation of chitin extracted from crustacean crab/shrimp shells or fungal cell walls.',
        properties: 'Only naturally occurring cationic polysaccharide, innate intrinsic antimicrobial activity, hemostatic blood clotting.',
        applications: 'Emergency hemostatic combat gauze (Celox), antimicrobial food coatings, gene delivery polyplexes, wound healing.',
        searchQuery: 'chitosan OR chitin OR "deacetylated chitin"'
      },
      {
        name: 'Sodium Alginate & Hyaluronic Acid',
        acronym: 'Alginate / HA',
        formula: 'Alginate: β-D-mannuronate (M) + α-L-guluronate (G)  |  HA: D-glucuronic acid + D-N-acetylglucosamine',
        repeatUnit: 'Uronic acid carbohydrates',
        repeatUnitMass: 'Variable',
        solubility: 'Freely soluble in water',
        synthesis: 'Extracted from brown seaweed (alginate) or bacterial fermentation of Streptococcus (hyaluronic acid).',
        properties: 'Egg-box divalent ion (Ca2+) physical crosslinking (alginate), CD44 receptor-mediated cellular uptake (HA).',
        applications: 'Cell encapsulation, 3D bio-printing bio-inks, dermal cosmetic fillers (Juvederm), ophthalmic viscosurgery.',
        searchQuery: 'alginate OR "hyaluronic acid" OR "sodium alginate"'
      }
    ],
    synthesisMethods: [
      'Biosynthetic Enzymatic Polymerization in Plants and Microorganisms',
      'Controlled Acid Hydrolysis for Cellulose Nanocrystals (CNC)',
      'Thermo-Mechanical Microfluidization for Cellulose Nanofibrils (CNF)',
      'Chemical Derivatization (Carboxymethylation, TEMPO Oxidation, Quaternization)',
      'Ionic and Enzymatic Gelation (Ca2+ Egg-Box Crosslinking)'
    ],
    keyProperties: [
      'Innate Enzymatic Biodegradability and Environmental Carbon Neutrality',
      'Biological Recognition and Receptor-Mediated Cellular Interactions',
      'Chiral Nematic Liquid Crystalline Self-Assembly (Cellulose Nanocrystals)',
      'Intrinsic Antimicrobial and Hemostatic Efficacy (Chitosan)',
      'Non-Toxic Divalent Ion Induced Sol-Gel Hydrogel Transition'
    ],
    characterization: [
      'High-Performance Liquid Chromatography (HPLC) for Monosaccharide Profile',
      'Potentiometric and Conductometric Titration for Degree of Deacetylation / Oxidation',
      'Polarized Optical Microscopy (POM) for Chiral Nematic Fingerprint Textures',
      'Scanning Electron Microscopy (SEM) for Fibrillar Network Morphology',
      'Rheometry for Thixotropic and Shear-Thinning Bio-Ink Suitability'
    ],
    applications: [
      '3D Bio-Printing Bio-Inks for Artificial Organ Scaffolding',
      'Hemostatic Emergency Wound Dressings and Antimicrobial Bandages',
      'Biodegradable Single-Use Packaging and Agricultural Mulching',
      'Targeted Receptor-Mediated Nanomedicine for CD44-Overexpressing Tumors',
      'High-Stiffness Renewable Nanocomposite Reinforcing Agents'
    ],
    relatedTopics: ['Cellulose', 'Chitosan', 'Alginate', 'Hyaluronic Acid', 'Biopolymers', 'Nanocellulose'],
    relatedJournals: [
      'Biomacromolecules',
      'Carbohydrate Polymers',
      'ACS Applied Materials & Interfaces',
      'Macromolecules',
      'Polymer Chemistry'
    ],
    searchQuery: 'biopolymer OR cellulose OR chitosan OR chitin OR alginate OR "hyaluronic acid" OR polysaccharide'
  },
  {
    id: 'domain-12',
    slug: 'polymer-architectures',
    title: 'Polymer Architectures',
    shortDescription: 'Topology engineering: Block copolymers, star polymers, bottlebrushes, dendrimers, and crosslinked networks.',
    categoryType: 'architectures',
    visualIdentity: {
      theme: 'Purple and pink',
      gradient: 'from-purple-600 via-fuchsia-600 to-pink-600',
      bgGlow: 'rgba(168, 85, 247, 0.15)',
      borderColor: 'border-purple-500/40',
      hoverBorder: 'hover:border-purple-400',
      badgeBg: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
      glowColor: 'purple',
      accentColor: '#a855f7'
    },
    motifType: 'complex_topology',
    introduction: 'Macromolecular architecture dictates polymer chain entropy, entanglements, solution rheology, and self-assembly behavior independent of chemical composition. Moving beyond linear polymers, precise synthetic control yields branched topologies, star polymers, molecular bottlebrushes with extended backbones, dendrimers with generation-dependent multivalency, and interpenetrating polymer networks.',
    families: [
      {
        name: 'Block Copolymers (Di-, Tri-, Multi-Block)',
        acronym: 'BCPs',
        formula: 'Poly(A)-b-Poly(B) [-A-A-A-]n-[-B-B-B-]m',
        repeatUnit: 'Incompatible covalent blocks',
        floryHugginsParameter: 'χN segregation regime',
        morphology: 'Spheres, cylinders, gyroids, lamellae',
        solubility: 'Selective solvent for core-shell assembly',
        synthesis: 'Sequential living polymerization (CROP, ATRP, RAFT, Anionic) or click coupling of telechelic prepolymers.',
        properties: 'Microphase separation on 5–50 nm scale driven by block incompatibility, self-assembly into micelles/polymersomes.',
        applications: 'Sub-10 nm semiconductor block copolymer lithography, drug delivery polymeric micelles, thermoplastic elastomers.',
        searchQuery: '"block copolymer" OR "diblock copolymer" OR "triblock copolymer" OR BCP'
      },
      {
        name: 'Molecular Bottlebrush Polymers',
        acronym: 'Bottlebrushes',
        formula: '[-Backbone(Sidechain)-]n',
        repeatUnit: 'Densely grafted macromonomer',
        stericRepulsion: 'Entropic chain stretching',
        solubility: 'THF, water, toluene depending on sidechains',
        synthesis: '"Grafting-through" of macromonomers via ROMP with Grubbs 3rd generation catalyst or "grafting-from" via ATRP.',
        properties: 'Extreme steric crowding forces backbone into rigid rod conformation, zero chain entanglements, ultra-soft elastomeric modulus.',
        applications: 'Super-soft tissue-mimetic implants, rapid-assembly photonic crystals without solvents, low-fouling dense coatings.',
        searchQuery: '"bottlebrush polymer" OR "polymer brush" OR "macromonomer"'
      },
      {
        name: 'Dendrimers & Hyperbranched Polymers',
        acronym: 'PAMAM / PPI',
        formula: 'Core-[Branching Unit]G (Generation G)',
        repeatUnit: 'Amidoamine / Propyleneimine branches',
        molecularDispersity: 'Đ = 1.000 (monodisperse for perfect dendrimers)',
        solubility: 'Water, methanol',
        synthesis: 'Divergent synthesis from core or convergent synthesis from dendrons; one-pot A2 + B3 for hyperbranched.',
        properties: 'Exact molecular weight, exponential surface functional groups with generation, globular internal voids for drug encapsulation.',
        applications: 'High-payload gene delivery polyplexes, MRI contrast agent nanoplatforms, analytical calibration standards.',
        searchQuery: 'dendrimer OR "PAMAM" OR "hyperbranched polymer" OR dendron'
      },
      {
        name: 'Star & Cyclic Polymers',
        acronym: 'Star Polymers / Rings',
        formula: 'Core-(Arm)x  |  cyclo-[-A-A-A-]n',
        repeatUnit: 'Multi-arm star or topology without end groups',
        synthesis: '"Arm-first" crosslinking or "core-first" divergent initiation; ring-expansion metathesis or end-to-end cyclization.',
        properties: 'Significantly smaller hydrodynamic radius (Rh) and lower intrinsic viscosity than linear analogs of identical molecular weight.',
        applications: 'Viscosity index improvers for engine lubricants, compact drug nanocarriers, rheology modifiers.',
        searchQuery: '"star polymer" OR "cyclic polymer" OR "multi-arm star"'
      }
    ],
    synthesisMethods: [
      'Sequential Monomer Addition via Living / Controlled Polymerizations',
      'Macromonomer "Grafting-Through" via Ring-Opening Metathesis Polymerization (ROMP)',
      'Surface-Initiated "Grafting-From" Controlled Radical Polymerization',
      'Divergent and Convergent Stepwise Dendrimer Construction',
      'Ring-Expansion Metathesis Polymerization (REMP) for Macrocycles'
    ],
    keyProperties: [
      'Steric Crowding-Induced Chain Extension and Unentangled Dynamics',
      'Microphase Separation into Ordered Periodic Nanodomains (5–100 nm)',
      'High Surface-to-Volume Ratio with Dense Multivalent End Groups',
      'Ultra-Low Viscosity Relative to Molecular Weight (Star and Cyclic Polymers)',
      'Internal Cavity Nanomembrane Encapsulation of Small Hydrophobic Molecules'
    ],
    characterization: [
      'Small-Angle X-Ray and Neutron Scattering (SAXS / SANS) for Nanoscale Lattice',
      'Size Exclusion Chromatography with Multi-Angle Light Scattering and Viscometry (Triple Detector GPC)',
      'Transmission Electron Microscopy (Cryo-TEM) for Core-Shell Morphologies',
      'Atomic Force Microscopy (AFM) for Individual Bottlebrush Single-Molecule Imaging',
      'Dynamic Light Scattering (DLS) for Hydrodynamic Diameter and Polydispersity'
    ],
    applications: [
      'Sub-10 nm Directed Self-Assembly (DSA) Semiconductor Lithography',
      'Ultra-Soft Superelastic Implants Matching Brain and Liver Tissue Mechanics',
      'Multivalent Targeted Drug Carriers with Dual Chemotherapy Loading',
      'High-Performance Rheological Modifiers for Lubricants and Inks',
      'Photonic Crystal Coatings with Structural Color Reflectance'
    ],
    relatedTopics: ['Block Copolymer', 'Bottlebrush', 'Dendrimer', 'Star Polymer', 'Microphase Separation', 'Topology'],
    relatedJournals: [
      'Macromolecules',
      'Journal of the American Chemical Society',
      'Polymer Chemistry',
      'ACS Macro Letters',
      'Biomacromolecules'
    ],
    searchQuery: '"block copolymer" OR "bottlebrush polymer" OR "dendrimer" OR "star polymer" OR "polymer architecture" OR "microphase separation"'
  },
  {
    id: 'domain-13',
    slug: 'polymerization-methods',
    title: 'Polymerization Methods',
    shortDescription: 'Synthetic methodology: ATRP, RAFT, CROP, ROP, ROMP, step-growth, photo-polymerization, and PISA.',
    categoryType: 'methods',
    visualIdentity: {
      theme: 'Orange and red',
      gradient: 'from-orange-600 via-amber-600 to-red-600',
      bgGlow: 'rgba(234, 88, 12, 0.15)',
      borderColor: 'border-orange-500/40',
      hoverBorder: 'hover:border-orange-400',
      badgeBg: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
      glowColor: 'amber',
      accentColor: '#ea580c'
    },
    motifType: 'chain_growth_kinetics',
    introduction: 'Polymerization methods define the synthetic tools used to assemble monomers into macromolecular chains with precise control over chain length, molecular weight dispersity (Đ), sequence, and chain-end fidelity. Modern methodologies bridge radical, ionic, metathesis, and photo-mediated reactions, including Polymerization-Induced Self-Assembly (PISA) for scalable nanoparticle manufacturing.',
    families: [
      {
        name: 'Reversible-Deactivation Radical Polymerization',
        acronym: 'ATRP / RAFT / NMP',
        formula: 'Active radical <==> Dormant species (Keq << 1)',
        catalysts: 'Cu(I)/L, Thiocarbonylthio transfer agents, TEMPO/SG1 nitroxides',
        dispersityControl: 'Đ < 1.10',
        monomers: 'Acrylates, methacrylates, styrenics, acrylamides',
        synthesis: 'Dynamic equilibrium establishing ultra-low stationary free radical concentrations, suppressing irreversible bimolecular termination.',
        properties: 'Living character, linear molecular weight growth with conversion, high chain-end fidelity for block synthesis.',
        applications: 'Precision block copolymers, surface-grafted polymer brushes, responsive nanogels, hybrid bioconjugates.',
        searchQuery: 'ATRP OR RAFT OR "reversible addition-fragmentation" OR "atom transfer radical"'
      },
      {
        name: 'Ring-Opening Polymerizations',
        acronym: 'CROP / ROP / ROMP',
        formula: 'Cyclic monomer + Active Center --> Propagating open chain',
        initiators: 'Tosylates, organotins, Grubbs ruthenium carbene catalysts',
        drivingForce: 'Ring strain relief (enthalpic and/or entropic)',
        monomers: '2-Oxazolines, lactones, lactides, norbornenes',
        synthesis: 'Living polymerization of heterocyclic and cyclic olefin monomers with complete absence of chain transfer.',
        properties: 'Heteroatom incorporation in the polymer backbone (esters, amides, ethers), monodisperse polymers, high reaction rates.',
        applications: 'Biodegradable polyesters (PLA/PCL), stealth polyoxazolines (POx), ultra-tough cyclic polyolefins (polydicyclopentadiene).',
        searchQuery: 'CROP OR ROP OR ROMP OR "ring-opening polymerization"'
      },
      {
        name: 'Polymerization-Induced Self-Assembly',
        acronym: 'PISA',
        formula: 'Soluble block + Insoluble core-forming block --> In Situ Nanoparticles',
        polymerizationType: 'RAFT or ATRP in dispersion/emulsion',
        solidsContent: 'Up to 30 - 50 wt% in water or alcohol',
        morphologies: 'Spheres, worms/nanofibers, vesicles/polymersomes',
        synthesis: 'Chain extension of a lyophilic polymer block with a monomer whose homopolymer is insoluble in the reaction medium.',
        properties: 'One-pot formation of concentrated, highly pure nanostructures without post-polymerization dialysis or cosolvent exchange.',
        applications: 'Thermoresponsive worm hydrogels, cell-mimetic polymersomes, high-solids Pickering emulsion stabilizers.',
        searchQuery: 'PISA OR "polymerization-induced self-assembly"'
      }
    ],
    synthesisMethods: [
      'Photo-Induced Electron Transfer ATRP (photo-ATRP / metal-free ATRP)',
      'Thermal and Photo-Initiated RAFT Dispersion/Emulsion Polymerization',
      'Cationic Ring-Opening Polymerization (CROP) with Microwave Kinetics',
      'Ring-Opening Metathesis Polymerization (ROMP) with Ruthenium Catalysts',
      'Step-Growth Melt and Interfacial Polycondensation'
    ],
    keyProperties: [
      'Predetermined Degree of Polymerization (DPn) Dictated by [M] / [I] Ratio',
      'Narrow Molecular Weight Distributions (Dispersity Đ = Mw/Mn < 1.1)',
      'High Retention of Active Chain-End Functionality (>95%)',
      'Tolerance to Diverse Functional Groups (Aqueous & Ambient Conditions)',
      'Direct In Situ Assembly into Concentrated Nanostructures (PISA)'
    ],
    characterization: [
      'In Situ NMR Spectroscopy for Real-Time Monomer Conversion Tracking',
      'Multi-Detector SEC/GPC for Molecular Weight Evolution vs Conversion',
      'Matrix-Assisted Laser Desorption Ionization (MALDI-TOF) for End-Group Analysis',
      'Electron Paramagnetic Resonance (EPR) for Radical Trapping and Kinetics',
      'Transmission Electron Microscopy (Cryo-TEM) for PISA In Situ Morphologies'
    ],
    applications: [
      'Precision Synthesis of Therapeutic Protein-Polymer Bioconjugates',
      'One-Pot Industrial Scalable Production of Synthetic Polymersomes',
      'Advanced 3D Stereolithography and Light-Driven Additive Manufacturing',
      'Tailored Nanomaterials for Targeted Chemotherapeutic Drug Delivery',
      'Functional Coatings with Sequenced Surface Chemistry'
    ],
    relatedTopics: ['ATRP', 'RAFT', 'CROP', 'ROP', 'ROMP', 'PISA', 'Kinetics'],
    relatedJournals: [
      'Macromolecules',
      'Polymer Chemistry',
      'Journal of the American Chemical Society',
      'ACS Macro Letters',
      'Chemical Science'
    ],
    searchQuery: 'polymerization OR ATRP OR RAFT OR CROP OR ROP OR ROMP OR PISA OR "controlled radical"'
  },
  {
    id: 'domain-14',
    slug: 'polymer-characterization',
    title: 'Polymer Characterization',
    shortDescription: 'Analytical techniques: SEC/GPC, MALDI-TOF, high-resolution NMR, DSC, TGA, rheology, and X-ray scattering.',
    categoryType: 'characterization',
    visualIdentity: {
      theme: 'Blue and violet',
      gradient: 'from-blue-600 via-indigo-600 to-violet-700',
      bgGlow: 'rgba(99, 102, 241, 0.15)',
      borderColor: 'border-blue-500/40',
      hoverBorder: 'hover:border-blue-400',
      badgeBg: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      glowColor: 'indigo',
      accentColor: '#4f46e5'
    },
    motifType: 'spectra_chromatogram',
    introduction: 'Polymer characterization requires specialized physical and chemical methods capable of resolving macromolecular molecular weight distributions, composition, tacticity, sequence, thermal phase transitions, viscoelastic rheology, and sub-nanometer crystal lattice structure.',
    families: [
      {
        name: 'Chromatography & Mass Spectrometry',
        acronym: 'SEC / GPC / MALDI-TOF',
        principle: 'Hydrodynamic volume separation and laser desorption mass analysis',
        keyMetrics: 'Mn, Mw, Mz, Dispersity (Đ = Mw/Mn), End-group identification',
        calibration: 'Universal calibration, Multi-angle light scattering (MALS), Viscometry',
        synthesis: 'Essential for validating every living and controlled polymerization mechanism.',
        properties: 'Distinguishes mono- vs multi-modal distributions, detects low-molecular-weight tailing and dead chains.',
        applications: 'Validation of polymer purity, molecular weight distribution certification, bioconjugation stoichiometry.',
        searchQuery: '"gel permeation chromatography" OR "size exclusion chromatography" OR GPC OR SEC OR MALDI-TOF'
      },
      {
        name: 'Nuclear Magnetic Resonance Spectroscopy',
        acronym: '1H / 13C / 2D-NMR',
        principle: 'Radiofrequency resonance of nuclear spins in magnetic fields',
        keyMetrics: 'Monomer conversion, copolymer composition, tacticity triads, end-group DPn',
        techniques: '1H, 13C, COSY, HSQC, HMBC, DOSY (Diffusion-Ordered Spectroscopy)',
        properties: 'Enables absolute structural determination, sequence distribution, and diffusion coefficient measurements.',
        applications: 'End-group quantification, reaction kinetics monitoring, microphase conformation analysis.',
        searchQuery: '"nuclear magnetic resonance" OR NMR OR "1H NMR" OR "DOSY"'
      },
      {
        name: 'Thermal & Rheological Analysis',
        acronym: 'DSC / TGA / DMA / Rheology',
        principle: 'Heat flux, mass loss under heating, and dynamic oscillatory stress-strain response',
        keyMetrics: 'Glass transition (Tg), melting point (Tm), degradation (Td5%), G\', G", loss tangent',
        techniques: 'Modulated DSC, high-resolution TGA, rotational rheometry, DMTA',
        properties: 'Reveals thermal stability windows, processing temperature regimes, entanglements, and viscoelastic relaxation.',
        applications: 'Thermal degradation limit evaluation, processing rheology optimization, rubber elastic modulus determination.',
        searchQuery: '"differential scanning calorimetry" OR DSC OR TGA OR rheology OR DMTA'
      },
      {
        name: 'X-Ray & Light Scattering',
        acronym: 'SAXS / WAXS / DLS',
        principle: 'Elastic and dynamic scattering of coherent X-rays and laser beams',
        keyMetrics: 'Lamellar d-spacing, crystal unit cell parameters, hydrodynamic radius (Rh), zeta potential',
        properties: 'Probes morphology from angstroms (WAXS crystal lattice) to tens of nanometers (SAXS micellar shapes).',
        applications: 'Self-assembly verification, crystalline morphology evaluation, nanoparticle size tracking.',
        searchQuery: 'SAXS OR WAXS OR "small-angle X-ray scattering" OR DLS OR "dynamic light scattering"'
      }
    ],
    synthesisMethods: [
      'Multi-Detector SEC-MALS-Viscometry (Triple Detection)',
      'Diffusion-Ordered NMR Spectroscopy (DOSY)',
      'Modulated Temperature Differential Scanning Calorimetry (MDSC)',
      'Synchrotron Grazing-Incidence X-Ray Scattering (GIWAXS / GISAXS)',
      'Cryogenic Transmission Electron Microscopy (Cryo-TEM)'
    ],
    keyProperties: [
      'Absolute Molecular Weight Determination Independent of Standards',
      'Structural Identification of Initiating and Terminating End Groups',
      'Quantitative Microstructure Resolution (Monomer Sequence & Tacticity)',
      'Precise Characterization of First- and Second-Order Phase Transitions',
      'In Situ Nanoscale Morphological and Viscoelastic Tracking'
    ],
    characterization: [
      'Refractive Index and Light Scattering Detector Calibration',
      'Two-Dimensional Heteronuclear Single Quantum Coherence (HSQC)',
      'Dynamic Viscoelastic Master Curves (Time-Temperature Superposition)',
      'Thermogravimetric Decomposition Kinetics under Inert and Oxidative Gas',
      'Cryo-TEM Fast-Freezing Imaging of Hydrated Vesicles and Micelles'
    ],
    applications: [
      'Quality Control and Release Testing for Clinical Pharmaceutical Excipients',
      'Polymer Processing Optimization for Injection Molding and Extrusion',
      'Verification of Living Polymerization Mechanisms and Kinetic Constants',
      'Nanomedicine Sizing, Zeta Potential, and Stability Certification',
      'Advanced Aerospace Composite Failure and Degradation Analysis'
    ],
    relatedTopics: ['GPC', 'SEC', 'NMR', 'DSC', 'TGA', 'SAXS', 'Rheology', 'MALDI'],
    relatedJournals: [
      'Macromolecules',
      'Polymer Chemistry',
      'ACS Applied Polymer Materials',
      'Progress in Polymer Science',
      'Polymer'
    ],
    searchQuery: '"polymer characterization" OR GPC OR SEC OR "MALDI-TOF" OR DSC OR TGA OR SAXS OR rheology'
  },
  {
    id: 'domain-15',
    slug: 'stimuli-responsive-polymers',
    title: 'Stimuli-Responsive Polymers',
    shortDescription: 'Smart materials responding dynamically to temperature (LCST/UCST), pH, redox gradients, light, and magnetic fields.',
    categoryType: 'functional',
    visualIdentity: {
      theme: 'Magenta and cyan',
      gradient: 'from-pink-600 via-fuchsia-600 to-cyan-600',
      bgGlow: 'rgba(236, 72, 153, 0.15)',
      borderColor: 'border-pink-500/40',
      hoverBorder: 'hover:border-pink-400',
      badgeBg: 'bg-pink-500/15 text-pink-300 border-pink-500/30',
      glowColor: 'purple',
      accentColor: '#ec4899'
    },
    motifType: 'coil_to_globule',
    introduction: 'Stimuli-responsive ("smart") polymers undergo rapid, reversible conformational, physical, or chemical phase changes in response to small environmental triggers: temperature, pH, ionic strength, redox potential (ROS/GSH), light, or mechanical force. These transitions are leveraged for pulsatile drug release, soft robotics, cell-sheet harvesting, and self-cleaning surfaces.',
    families: [
      {
        name: 'Thermoresponsive Polymers (LCST / UCST)',
        acronym: 'PNIPAM / PiPrOx / PDEAEMA',
        transition: 'Lower & Upper Critical Solution Temperature',
        mechanism: 'Hydrophobic interaction balance vs hydrogen bonding with water molecules',
        transitionTemp: 'Tunable from 10 °C to 90 °C',
        solubility: 'Soluble below LCST; insoluble / precipitated above LCST',
        synthesis: 'Controlled copolymerization of hydrophobic and hydrophilic monomers to tune transition temperature.',
        properties: 'Entropy-driven water molecule shedding above LCST causes abrupt coil-to-globule collapse.',
        applications: 'Non-invasive cell sheet detachment culture dishes, hyperthermia cancer therapies, smart window solar control.',
        searchQuery: 'thermoresponsive OR LCST OR UCST OR "temperature-responsive polymer"'
      },
      {
        name: 'pH-Responsive Polyelectrolytes',
        acronym: 'PAA / PMAA / PDMAEMA / P2VP',
        transition: 'Protonation-deprotonation of acidic or basic sidechains',
        pKaRange: 'pKa ~ 4.5 (acids) to pKb ~ 7.5 (amines)',
        mechanism: 'Electrostatic repulsion upon ionization causes sudden swelling / expansion',
        solubility: 'Swollen polyelectrolyte gel vs collapsed uncharged chain',
        synthesis: 'Polymerization of monomers bearing carboxylic acids, tertiary amines, or sulfonamides.',
        properties: 'Extensive conformational swelling and charge inversion matching tumor microenvironments (pH 6.5) and endosomes (pH 5.0).',
        applications: 'Oral enteric drug capsules, endosomal escape gene delivery, glucose-responsive insulin hydrogels.',
        searchQuery: '"pH-responsive" OR "pH sensitive polymer" OR polyelectrolyte'
      },
      {
        name: 'Redox- & ROS-Responsive Polymers',
        acronym: 'Disulfide / Poly(propylene sulfide) (PPS)',
        transition: 'Cleavage by intracellular GSH (~10 mM) or oxidation by H2O2 / ROS',
        mechanism: 'Hydrophobic thioether oxidation to hydrophilic sulfoxide / sulfone',
        solubility: 'Insoluble hydrophobic core turns into fully soluble hydrophilic polymer',
        synthesis: 'Incorporation of disulfide linkers or thioether repeat units via ROP or polyaddition.',
        properties: 'Stable in systemic bloodstream, rapid selective disassembly upon reaching tumor/inflamed tissues.',
        applications: 'Intracellular tumor-targeted drug delivery, antioxidant anti-inflammatory scaffolds.',
        searchQuery: '"redox-responsive" OR "ROS-responsive" OR "glutathione-responsive"'
      },
      {
        name: 'Photoresponsive Polymers',
        acronym: 'Azobenzene / Spiropyran Polymers',
        transition: 'Reversible trans-to-cis photoisomerization under UV and visible light',
        mechanism: 'Dipole moment change and steric geometry switching upon photon absorption',
        properties: 'Remote optical spatial and temporal control with zero physical chemical addition.',
        applications: 'Photo-switchable micropumps, optical data storage, light-steered soft robotic swimming actuators.',
        searchQuery: 'photoresponsive OR "light-responsive polymer" OR azobenzene'
      }
    ],
    synthesisMethods: [
      'Controlled Radical Copolymerization for Precise LCST Tuning',
      'Integration of Reversible Covalent Crosslinks (Disulfide, Boronate, Diels-Alder)',
      'Post-Polymerization Modification with Chromophores (Azobenzene, Spiropyran)',
      'Synthesis of Polyampholytic and Zwitterionic Stimuli-Responsive Blocks',
      'Direct Living Ring-Opening Polymerization of Stimuli-Responsive Cyclic Monomers'
    ],
    keyProperties: [
      'Reversible Coil-to-Globule Conformational Transition',
      'Sharp Phase Transition Triggered by Pathophysiological Chemical Gradients',
      'Dual- and Multi-Stimuli Responsiveness (e.g., pH + Temperature + Redox)',
      'Autonomous Shape-Morphing and Mechanical Actuation',
      'Non-Invasive Remote Triggering via External Light, Ultrasound, or Magnetism'
    ],
    characterization: [
      'UV-Vis Turbidimetry for Cloud Point (Tcp / LCST) Determination',
      'Dynamic Light Scattering (DLS) for Temperature/pH-Dependent Hydrodynamic Diameter',
      'Fluorometry for Microenvironmental Polarity Changes (Pyrene Probe)',
      'Quartz Crystal Microbalance with Dissipation (QCM-D) for Hydration Monitoring',
      'Cyclic Voltammetry and Chemical Reduction Titration for Redox Sensitivity'
    ],
    applications: [
      'Pathology-Targeted Intracellular Chemotherapy and Gene Delivery',
      'Temperature-Mediated Cell Sheet Harvesting for Regenerative Tissue Patches',
      'Soft Robotic Biomimetic Actuators, Grippers, and Artificial Muscles',
      'Self-Regulating Glucose-Sensitive Closed-Loop Insulin Delivery Hydrogels',
      'Smart Thermochromic Solar Glazing and Optical Windows'
    ],
    relatedTopics: ['Thermoresponsive', 'LCST', 'pH-Responsive', 'Redox-Responsive', 'Smart Hydrogels', 'PNIPAM'],
    relatedJournals: [
      'Advanced Materials',
      'Biomacromolecules',
      'Macromolecules',
      'ACS Applied Materials & Interfaces',
      'Polymer Chemistry'
    ],
    searchQuery: 'stimuli-responsive OR thermoresponsive OR "pH-responsive" OR LCST OR smart OR "responsive polymer"'
  },
  {
    id: 'domain-16',
    slug: 'biomedical-polymer-applications',
    title: 'Biomedical Polymer Applications',
    shortDescription: 'Nanomedicine and healthcare: Targeted drug delivery, mRNA vaccines, hydrogel tissue scaffolds, and biosensors.',
    categoryType: 'biomedical',
    visualIdentity: {
      theme: 'Coral and pink',
      gradient: 'from-rose-500 via-coral-500 to-pink-600',
      bgGlow: 'rgba(244, 63, 94, 0.15)',
      borderColor: 'border-rose-500/40',
      hoverBorder: 'hover:border-rose-400',
      badgeBg: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      glowColor: 'purple',
      accentColor: '#f43f5e'
    },
    motifType: 'vesicle_micelle',
    introduction: 'Biomedical polymers represent one of the highest impact fields of macromolecular science, bridging synthetic materials and clinical therapeutics. From lipid-polymer hybrid nanoparticles delivering mRNA vaccines to injectable hydrogels regenerating articular cartilage, these systems prioritize biocompatibility, stealth pharmacokinetics, non-cytotoxic degradation, and targeted cellular uptake.',
    families: [
      {
        name: 'Polymeric Micelles & Nanoparticles',
        acronym: 'Core-Shell Micelles',
        structure: 'Hydrophobic core (drug reservoir) + Hydrophilic corona (stealth brush)',
        sizeRange: '20 - 150 nm (ideal for EPR tumor extravasation and long circulation)',
        carrierPolymers: 'POx-b-POzi, PEG-b-PLA, PEG-b-PCL, Pluronics',
        drugPayload: 'Paclitaxel, doxorubicin, docetaxel, curcumin',
        properties: 'Solubilizes highly insoluble hydrophobic oncology drugs up to 50 wt% payload, prevents premature renal excretion.',
        applications: 'Clinical cancer chemotherapy nanomedicines (Genexol-PM), targeted drug delivery.',
        searchQuery: '"polymeric micelle" OR "polymeric nanoparticle" OR "nanomedicine"'
      },
      {
        name: 'Lipid-Polymer Hybrid Nanoparticles & Polyplexes',
        acronym: 'LNPs / Polyplexes',
        structure: 'Ionizable cationic polymer/lipid core complexed with anionic RNA/DNA',
        sizeRange: '60 - 120 nm',
        carrierPolymers: 'PEI, Poly(beta-amino ester)s (PBAEs), PEGylated lipids, POx-lipids',
        properties: 'High nucleic acid encapsulation efficiency (>90%), endosomal proton-sponge escape, cell transfection.',
        applications: 'mRNA COVID-19 vaccines (Comirnaty, Spikevax), CRISPR-Cas9 in vivo gene editing, siRNA gene silencing.',
        searchQuery: '"lipid nanoparticle" OR "polyplex" OR "mRNA delivery" OR "gene delivery"'
      },
      {
        name: 'Injectable & 3D Bio-Printed Hydrogels',
        acronym: 'Hydrogel Scaffolds',
        structure: 'Water-swollen (80–99% H2O) 3D crosslinked macromolecular network',
        materials: 'GelMA, PEG-diacrylate, POx hydrogels, Alginate, Hyaluronic acid',
        crosslinking: 'Photo-crosslinking (LAP + 405 nm light), enzymatic (transglutaminase), dynamic covalent',
        properties: 'Viscoelastic matrix mimicking native extracellular matrix (ECM), oxygen/nutrient permeability, shear-thinning.',
        applications: 'Injectable cartilage regeneration, 3D bio-printing patient-specific tissues, diabetic wound healing patches.',
        searchQuery: '"injectable hydrogel" OR "bio-ink" OR "tissue engineering scaffold" OR "hydrogel"'
      }
    ],
    synthesisMethods: [
      'Self-Assembly via Nanoprecipitation and Solvent Displacement',
      'Microfluidic Hydrodynamic Flow-Focusing Formulation of LNPs',
      'Photo-Crosslinking of Methacrylated Biomacromolecules (GelMA, PEG-DA)',
      'Enzymatic and Dynamic Click Chemistry Gelation (Strain-Promoted Click)',
      'Electrospinning of Biomimetic Nanofibrous Scaffolds'
    ],
    keyProperties: [
      'Extended Blood Circulation Halflife via Stealth Antifouling Coronas',
      'Passive and Active Tumor Targeting (Enhanced Permeation and Retention - EPR)',
      'High Bioresorbability into Non-Toxic Cellular Metabolic Intermediates',
      'Tunable Viscoelastic Stiffness Matching Target Human Tissues (0.1–100 kPa)',
      'Endosomal Osmotic Swelling and Rupture ("Proton Sponge Effect")'
    ],
    characterization: [
      'Dynamic Light Scattering (DLS) & Nanoparticle Tracking Analysis (NTA)',
      'Cryogenic Transmission Electron Microscopy (Cryo-TEM) for Core-Shell Morphology',
      'High-Performance Liquid Chromatography (HPLC) for Drug Loading and Entrapment Efficiency',
      'In Vitro Drug Release Kinetic Profiles (Dialysis Bag Method across pH)',
      'In Vitro Cell Viability (MTT / CCK-8) and Confocal Laser Scanning Microscopy (CLSM)'
    ],
    applications: [
      'Clinical Formulation of Highly Insoluble Chemotherapeutics',
      'Next-Generation mRNA and Self-Amplifying RNA Vaccines',
      'In Vivo CRISPR-Cas9 Gene Therapy and siRNA Disease Treatment',
      'Regenerative Articular Cartilage, Bone, and Neural Tissue Regeneration Scaffolds',
      'Implantable Continuous Glucose Monitoring Biosensor Membranes'
    ],
    relatedTopics: ['Drug Delivery', 'Nanoparticles', 'mRNA', 'Hydrogels', 'Tissue Engineering', 'Biocompatibility'],
    relatedJournals: [
      'Biomacromolecules',
      'Journal of Controlled Release',
      'Advanced Materials',
      'ACS Applied Materials & Interfaces',
      'Biomaterials'
    ],
    searchQuery: '"drug delivery" OR "biomedical polymer" OR "polymeric micelle" OR "hydrogel" OR "nanomedicine" OR "tissue engineering"'
  },
  {
    id: 'domain-17',
    slug: 'energy-environmental-polymers',
    title: 'Energy & Environmental Polymers',
    shortDescription: 'Clean technology materials: Solid battery electrolytes, proton exchange membranes (Nafion), water desalination, and vitrimer recycling.',
    categoryType: 'functional',
    visualIdentity: {
      theme: 'Green and turquoise',
      gradient: 'from-teal-600 via-emerald-600 to-cyan-700',
      bgGlow: 'rgba(20, 184, 166, 0.15)',
      borderColor: 'border-emerald-500/40',
      hoverBorder: 'hover:border-emerald-400',
      badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      glowColor: 'emerald',
      accentColor: '#10b981'
    },
    motifType: 'ion_conducting_channel',
    introduction: 'Energy and environmental polymers are essential to decarbonization, renewable energy storage, clean water access, and the transition toward a circular economy. They serve as solid electrolytes preventing lithium dendrite fires, perfluorinated proton exchange membranes (PEMs) powering green hydrogen fuel cells and electrolyzers, and chemically recyclable vitrimers that can be reshaped and recycled indefinitely.',
    families: [
      {
        name: 'Solid Polymer & Single-Ion Electrolytes',
        acronym: 'SPEs / SICEs',
        formula: 'PEO / Poly(carbonate) / Polysiloxane + LiTFSI salt',
        ionicConductivity: '10^-4 to 10^-3 S/cm at elevated temp (60 °C)',
        lithiumTransferenceNumber: 'tLi+ = 0.2 (conventional) to 0.9 (single-ion conducting)',
        solubility: 'Crosslinked membranes',
        properties: 'Replaces flammable liquid organic carbonate battery electrolytes, suppresses lithium dendrite penetration.',
        applications: 'All-solid-state lithium-metal batteries, sodium-ion batteries, wearable flexible power sources.',
        searchQuery: '"solid polymer electrolyte" OR "polymer electrolyte" OR "single-ion conducting"'
      },
      {
        name: 'Proton Exchange & Anion Exchange Membranes',
        acronym: 'PEM / AEM / Nafion',
        formula: '[-CF2-CF2-]x[-CF2-CF(O-CF2-CF(CF3)-O-CF2-CF2-SO3H)-]y',
        repeatUnit: 'Perfluorosulfonic acid (PFSA)',
        protonConductivity: '>0.1 S/cm under hydrated conditions',
        thermalStability: 'Operating temperature up to 90 - 120 °C',
        properties: 'Nanophase-separated hydrophilic sulfonic acid water channels inside an ultra-inert hydrophobic PTFE matrix.',
        applications: 'Hydrogen fuel cell electric vehicles (FCEVs), water electrolyzers for green hydrogen, redox flow batteries.',
        searchQuery: 'Nafion OR "proton exchange membrane" OR "anion exchange membrane" OR "PEM fuel cell"'
      },
      {
        name: 'Covalent Adaptable Networks (Vitrimers) & Circular Recycling',
        acronym: 'Vitrimers / CANs',
        crosslinkingType: 'Dynamic associative covalent exchange (transesterification, transcarbamoylation, disulfide metathesis)',
        topologyFreezingTemp: 'Tv (Vitrimer transition temperature)',
        reprocessability: '100% mechanical property retention over multiple heat-pressing cycles',
        properties: 'Combines the insolubility and high creep resistance of thermosets with the melt reprocessability and recycling of thermoplastics.',
        applications: 'Recyclable wind turbine blade epoxy composites, circular electronics packaging, self-repairing automotive coatings.',
        searchQuery: 'vitrimer OR "covalent adaptable network" OR "chemical recycling of polymer" OR depolymerization'
      }
    ],
    synthesisMethods: [
      'In Situ Radical and Photopolymerization of Polymer Electrolyte Membranes',
      'Free Radical Copolymerization of Tetrafluoroethylene and Functional Vinyl Ethers',
      'Catalytic Transesterification and Dynamic Imine Crosslinking for Vitrimers',
      'Phase Inversion Casting for Asymmetric Water Filtration Membranes',
      'Chemical and Enzymatic Depolymerization of Commercial Polyesters (PET)'
    ],
    keyProperties: [
      'High Room-Temperature Lithium and Proton Transport Efficiency',
      'Wide Electrochemical Stability Window (>4.5 V vs Li/Li+)',
      'Exceptional Chemical Resistance to Aggressive Peroxide Radicals (Fuel Cells)',
      'Associative Bond Exchange for Complete Thermoset Reprocessability and Recycling',
      'Sub-Nanometer Molecular Sieving and Salt Rejection Exceeding 99.5%'
    ],
    characterization: [
      'Electrochemical Impedance Spectroscopy (EIS) across Temperature (-20 to 100 °C)',
      'Linear Sweep Voltammetry (LSV) for Electrochemical Oxidation Limit',
      'Stress Relaxation Kinetics (Dynamic Mechanical Analysis) to Determine Tv',
      'Pore Size Distribution and Salt Rejection Measurement via Dead-End Filtration',
      'Nuclear Magnetic Resonance (7Li, 19F, 1H) for Ion Diffusion Coefficients'
    ],
    applications: [
      'Next-Generation All-Solid-State Lithium-Metal Batteries for Electric Vehicles',
      'Zero-Emission Green Hydrogen Fuel Cell Vehicles and Electrolyzers',
      'Seawater Desalination Reverse Osmosis and Nanofiltration Membranes',
      'Circular Reprocessable Epoxy Composites for Wind Turbine Blades',
      'Industrial Chemical Closed-Loop Depolymerization and Upcycling'
    ],
    relatedTopics: ['Solid Electrolyte', 'Nafion', 'Fuel Cells', 'Vitrimers', 'Recycling', 'Membranes'],
    relatedJournals: [
      'Advanced Energy Materials',
      'Macromolecules',
      'Journal of the American Chemical Society',
      'ACS Applied Materials & Interfaces',
      'Progress in Polymer Science'
    ],
    searchQuery: '"polymer electrolyte" OR "proton exchange membrane" OR Nafion OR vitrimer OR "chemical recycling" OR "energy polymer"'
  },
  {
    id: 'domain-18',
    slug: 'advanced-polymer-materials',
    title: 'Advanced Polymer Materials',
    shortDescription: 'Frontier functional materials: Self-healing networks, polymer nanocomposites, metamaterials, and 4D shape-memory polymers.',
    categoryType: 'functional',
    visualIdentity: {
      theme: 'Indigo and electric blue',
      gradient: 'from-indigo-600 via-blue-600 to-violet-800',
      bgGlow: 'rgba(99, 102, 241, 0.15)',
      borderColor: 'border-indigo-500/40',
      hoverBorder: 'hover:border-indigo-400',
      badgeBg: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
      glowColor: 'indigo',
      accentColor: '#6366f1'
    },
    motifType: 'supramolecular_mesh',
    introduction: 'Advanced polymer materials represent convergence technologies where macromolecular engineering interfaces with nanotechnology, physics, and robotics. Integrating supramolecular interactions, 2D nanomaterials (graphene, MXenes), and programmable shape-memory dynamics, these materials exhibit autonomous self-healing, programmable 4D morphing, high electromagnetic interference (EMI) shielding, and structural coloration.',
    families: [
      {
        name: 'Supramolecular & Self-Healing Polymers',
        acronym: 'Supramolecular Polymers',
        bondingType: 'Quadruple hydrogen bonding (UPy), host-guest complexes (cyclodextrin), metal-ligand coordination',
        healingEfficiency: '>90% recovery of original tensile strength without heat/catalyst',
        reversibility: 'Indefinitely dynamic without covalent bond fatigue',
        properties: 'Autonomic room-temperature scratch and crack healing, reversible shear-thinning viscoelasticity.',
        applications: 'Self-healing protective coatings, wearable electronic skin, autonomic damage-tolerant adhesives.',
        searchQuery: '"supramolecular polymer" OR "self-healing polymer" OR "UPy" OR "host-guest"'
      },
      {
        name: 'Polymer Nanocomposites & 2D Hybrids',
        acronym: 'Nanocomposites / MXene-Polymers',
        nanofillers: 'Graphene, carbon nanotubes (CNTs), MXenes (Ti3C2Tx), boron nitride',
        dispersionStrategy: 'In situ polymerization, melt compounding with compatibilizers, surface-grafted brushes',
        properties: 'Percolating electrical and thermal conductivity at ultra-low filler loadings (<1 vol%), gas barrier improvement.',
        applications: 'Electromagnetic interference (EMI) shielding in 5G electronics, thermal interface materials, aerospace lightning strike protection.',
        searchQuery: '"polymer nanocomposite" OR "graphene polymer" OR "MXene polymer"'
      },
      {
        name: 'Shape-Memory & 4D-Printed Polymers',
        acronym: 'SMPs / 4D Polymers',
        mechanism: 'Permanent netpoints (chemical or physical crosslinks) + Switching segments (crystallization Tm or glass transition Tg)',
        shapeFixityRate: 'Rf > 98%',
        shapeRecoveryRate: 'Rr > 95%',
        properties: 'Can be deformed into a temporary shape and autonomously return to permanent shape upon heat, light, or water stimulus.',
        applications: 'Minimally invasive self-expanding biomedical vascular stents, deployable space solar sails, morphing soft robotics.',
        searchQuery: '"shape memory polymer" OR "4D printing" OR "shape-memory"'
      }
    ],
    synthesisMethods: [
      'Supramolecular Self-Assembly Directed by Quadruple Hydrogen-Bonding (UPy) Motifs',
      'In Situ Intercalative Polymerization in the Presence of Exfoliated 2D Nanomaterials',
      'Dual-Curing Resins for High-Resolution 4D Stereolithography Printing',
      'Coordination Crosslinking of Polymers with Transition Metal Ions (Fe3+, Zn2+)',
      'Melt Blending with High-Shear Reactive Extrusion Compatibilizers'
    ],
    keyProperties: [
      'Autonomous Ambient Self-Healing of Mechanical Scratches and Cuts',
      'Programmable Reversible Shape-Memory Recovery Ratios Exceeding 95%',
      'Superb Thermal Conductivity and Electromagnetic Radiation Attenuation',
      'High Toughness Exceeding Individual Component Mechanical Envelopes',
      'Dynamic Bond Exchange Permitting Repeated Damage Repair'
    ],
    characterization: [
      'Tensile Stress-Strain Healing Cycles for Quantitative Recovery Assessment',
      'Electromagnetic Interference (EMI) Shielding Effectiveness (SE) in X-Band',
      'Thermal Conductivity Measurement via Laser Flash Analysis (LFA)',
      'Four-Dimensional Shape Recovery Profiling with High-Speed Thermography',
      'Transmission and Scanning Electron Microscopy (HR-TEM / FE-SEM) for Nanofiller Dispersion'
    ],
    applications: [
      'Autonomous Self-Healing Clear Coatings for Automotive Surfaces',
      'Flexible Electronic Skin and Wearable Health Monitoring Sensors',
      '5G Telecommunications High-Frequency Electromagnetic Shielding',
      'Deployable Aerospace Structures and Self-Unfolding Space Antennas',
      'Minimally Invasive Self-Expanding Surgical Implants and Stents'
    ],
    relatedTopics: ['Self-Healing', 'Supramolecular', 'Nanocomposites', 'Shape-Memory', '4D Printing', 'MXene'],
    relatedJournals: [
      'Advanced Materials',
      'Macromolecules',
      'Advanced Functional Materials',
      'ACS Applied Materials & Interfaces',
      'Polymer Chemistry'
    ],
    searchQuery: '"advanced polymer" OR "self-healing" OR "shape-memory" OR "polymer nanocomposite" OR "supramolecular polymer" OR "4D printing"'
  }
];

export const TOTAL_DOMAINS_COUNT = POLYMER_DOMAINS.length;

// Helper to look up a domain by slug
export function getDomainBySlug(slug) {
  if (!slug) return null;
  const clean = slug.toLowerCase().trim();
  return POLYMER_DOMAINS.find(d => d.slug === clean || d.id === clean) || null;
}

// Helper to find all polymers across all domains
export function getAllCuratedPolymers() {
  const polymers = [];
  POLYMER_DOMAINS.forEach(domain => {
    domain.families.forEach(fam => {
      polymers.push({
        ...fam,
        domainId: domain.id,
        domainSlug: domain.slug,
        domainTitle: domain.title,
        domainTheme: domain.visualIdentity.theme,
        domainAccent: domain.visualIdentity.accentColor
      });
    });
  });
  return polymers;
}
