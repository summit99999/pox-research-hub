import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Atom, Sparkles } from 'lucide-react';

/**
 * Standard known oxazoline & oxazine chemical structures catalog
 * with precise SMILES, formulas, molecular weights, and SVG representations.
 */
export const OXAZOLINE_CHEMICAL_CATALOG = {
  // Monomers
  'meox': {
    name: '2-Methyl-2-oxazoline',
    abbreviation: 'MeOx',
    smiles: 'CC1=NCCO1',
    formula: 'C4H7NO',
    mw: '85.11 g/mol',
    type: 'Hydrophilic Monomer',
    role: 'Monomer',
    description: 'Highly hydrophilic oxazoline monomer providing stealth, non-fouling, and water-soluble polymer segments.',
    r_group: 'CH₃',
    ring_size: 5
  },
  'etox': {
    name: '2-Ethyl-2-oxazoline',
    abbreviation: 'EtOx',
    smiles: 'CCC1=NCCO1',
    formula: 'C5H9NO',
    mw: '99.13 g/mol',
    type: 'Thermoresponsive / Stealth Monomer',
    role: 'Monomer',
    description: 'Most widely investigated POx monomer. Forms biocompatible polymers with LCST (~60–65 °C in water) and FDA-compliant drug conjugate potential.',
    r_group: 'CH₂CH₃',
    ring_size: 5
  },
  'iprox': {
    name: '2-Isopropyl-2-oxazoline',
    abbreviation: 'iPrOx',
    smiles: 'CC(C)C1=NCCO1',
    formula: 'C6H11NO',
    mw: '113.16 g/mol',
    type: 'Thermoresponsive (LCST near body temp)',
    role: 'Monomer',
    description: 'Thermoresponsive monomer with a sharp LCST near physiological temperature (~36–39 °C), ideal for smart drug release.',
    r_group: 'CH(CH₃)₂',
    ring_size: 5
  },
  'prox': {
    name: '2-n-Propyl-2-oxazoline',
    abbreviation: 'PrOx',
    smiles: 'CCCC1=NCCO1',
    formula: 'C6H11NO',
    mw: '113.16 g/mol',
    type: 'Thermoresponsive Monomer',
    role: 'Monomer',
    description: 'Hydrophobic linear isomer of iPrOx with lower LCST (~24–28 °C).',
    r_group: 'CH₂CH₂CH₃',
    ring_size: 5
  },
  'phox': {
    name: '2-Phenyl-2-oxazoline',
    abbreviation: 'PhOx',
    smiles: 'c1ccccc1C2=NCCO2',
    formula: 'C9H9NO',
    mw: '147.18 g/mol',
    type: 'Aromatic / Hydrophobic Monomer',
    role: 'Comonomer',
    description: 'Aromatic monomer used to form hydrophobic micellar cores and high-refractive-index block copolymers.',
    r_group: 'C₆H₅ (Phenyl)',
    ring_size: 5
  },
  'buox': {
    name: '2-Butyl-2-oxazoline',
    abbreviation: 'BuOx',
    smiles: 'CCCCC1=NCCO1',
    formula: 'C7H13NO',
    mw: '127.19 g/mol',
    type: 'Hydrophobic Monomer',
    role: 'Comonomer',
    description: 'Hydrophobic core-forming monomer used in amphiphilic block copolymer micellar drug nanoformulations.',
    r_group: '(CH₂)₃CH₃',
    ring_size: 5
  },
  'mestox': {
    name: '2-Methoxycarbonylethyl-2-oxazoline',
    abbreviation: 'MestOx',
    smiles: 'COC(=O)CCC1=NCCO1',
    formula: 'C7H11NO3',
    mw: '157.17 g/mol',
    type: 'Functional Ester Monomer',
    role: 'Functional Monomer',
    description: 'Ester-functionalized oxazoline enabling post-polymerization functionalization (amidation, cross-linking, drug conjugation).',
    r_group: 'CH₂CH₂COOCH₃',
    ring_size: 5
  },
  'meozi': {
    name: '2-Methyl-2-oxazine',
    abbreviation: 'MeOzi',
    smiles: 'CC1=NCCCO1',
    formula: 'C5H9NO',
    mw: '99.13 g/mol',
    type: 'Hydrophilic 6-Membered Monomer',
    role: 'Monomer',
    description: '6-membered homologous oxazine monomer exhibiting slower CROP kinetics and flexible propylene-spaced backbone.',
    r_group: 'CH₃',
    ring_size: 6
  },
  'etozi': {
    name: '2-Ethyl-2-oxazine',
    abbreviation: 'EtOzi',
    smiles: 'CCC1=NCCCO1',
    formula: 'C6H11NO',
    mw: '113.16 g/mol',
    type: 'Thermoresponsive Oxazine',
    role: 'Monomer',
    description: 'Poly(2-oxazine) (POzi) precursor with tunable solution behavior and enhanced conformational flexibility.',
    r_group: 'CH₂CH₃',
    ring_size: 6
  },
  'phozi': {
    name: '2-Phenyl-2-oxazine',
    abbreviation: 'PhOzi',
    smiles: 'c1ccccc1C2=NCCCO2',
    formula: 'C10H11NO',
    mw: '161.20 g/mol',
    type: 'Aromatic Oxazine Monomer',
    role: 'Comonomer',
    description: 'Aromatic 6-membered monomer for poly(2-oxazine) hydrophobic blocks and functional assemblies.',
    r_group: 'C₆H₅',
    ring_size: 6
  },

  // Initiators
  'meotf': {
    name: 'Methyl Trifluoromethanesulfonate',
    abbreviation: 'MeOTf',
    smiles: 'CS(=O)(=O)OC(F)(F)F',
    formula: 'C2H3F3O3S',
    mw: '164.10 g/mol',
    type: 'Fast CROP Initiator',
    role: 'Initiator',
    description: 'Fast-initiating alkyl triflate generating ionic living species with near-instantaneous initiation (ki >> kp).',
    r_group: 'CF₃SO₃⁻',
    ring_size: 0
  },
  'meots': {
    name: 'Methyl p-Toluenesulfonate',
    abbreviation: 'MeOTs',
    smiles: 'Cc1ccc(S(=O)(=O)OC)cc1',
    formula: 'C8H10O3S',
    mw: '186.23 g/mol',
    type: 'Standard CROP Initiator',
    role: 'Initiator',
    description: 'Standard crystalline initiator exhibiting an equilibrium between covalent and ionic living species.',
    r_group: 'CH₃C₆H₄SO₃⁻',
    ring_size: 0
  },
  'bnbr': {
    name: 'Benzyl Bromide',
    abbreviation: 'BnBr',
    smiles: 'c1ccccc1CBr',
    formula: 'C7H7Br',
    mw: '171.04 g/mol',
    type: 'Halide CROP Initiator',
    role: 'Initiator',
    description: 'Alkyl halide initiator providing UV-active and NMR-detectable benzyl alpha-end groups.',
    r_group: 'Br⁻',
    ring_size: 0
  },

  // Terminators
  'piperidine': {
    name: 'Piperidine',
    abbreviation: 'Pip',
    smiles: 'C1CCNCC1',
    formula: 'C5H11N',
    mw: '85.15 g/mol',
    type: 'Amine Quencher',
    role: 'Terminator',
    description: 'High-yield nucleophilic terminating agent forming tertiary amine omega-end group with quantitative capping.',
    r_group: '-NC₅H₁₀',
    ring_size: 6
  },
  'water': {
    name: 'Water / Hydroxide',
    abbreviation: 'H₂O / OH⁻',
    smiles: 'O',
    formula: 'H2O',
    mw: '18.02 g/mol',
    type: 'Protic Quencher',
    role: 'Terminator',
    description: 'Quenches oxazolinium active species to yield terminal hydroxyl or secondary amine groups depending on pH and temperature.',
    r_group: '-OH',
    ring_size: 0
  },
  'azide': {
    name: 'Sodium Azide',
    abbreviation: 'NaN₃',
    smiles: '[N-]=[N+]=[N-]',
    formula: 'NaN3',
    mw: '65.01 g/mol',
    type: 'Click Chemistry Quencher',
    role: 'Terminator',
    description: 'Introduces terminal azide (-N3) functionality for facile copper-catalyzed or strain-promoted click chemistry.',
    r_group: '-N₃',
    ring_size: 0
  }
};

/**
 * High-definition vector SVG representation of oxazoline & oxazine monomers,
 * polymer repeat units, and initiators/terminators.
 */
export function ChemicalVectorSVG({ item, size = 160 }) {
  const isPOxRepeat = item.role === 'Repeat Unit' || item.name?.toLowerCase().includes('repeat unit') || item.name?.toLowerCase().includes('poly(');
  const isOxazine = item.ring_size === 6 || item.name?.toLowerCase().includes('oxazine');
  const isInitiator = item.role === 'Initiator' || item.type?.toLowerCase().includes('initiator');
  const isTerminator = item.role === 'Terminator' || item.type?.toLowerCase().includes('quencher') || item.type?.toLowerCase().includes('terminat');

  // 1. Polymer Repeat Unit: *-[N(COR)-CH2-CH2]-*
  if (isPOxRepeat) {
    const sideGroup = item.r_group || item.side_chain || 'R';
    return (
      <svg width={size} height={size * 0.8} viewBox="0 0 240 180" className="mx-auto select-none">
        <rect width="240" height="180" rx="12" fill="#0f172a" fillOpacity="0.4" />
        
        {/* Backbone Chain */}
        <line x1="20" y1="90" x2="60" y2="90" stroke="#38bdf8" strokeWidth="3" strokeDasharray="4 4" />
        <line x1="60" y1="90" x2="90" y2="90" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
        <line x1="110" y1="90" x2="145" y2="90" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
        <line x1="145" y1="90" x2="180" y2="90" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
        <line x1="180" y1="90" x2="220" y2="90" stroke="#38bdf8" strokeWidth="3" strokeDasharray="4 4" />

        {/* Nitrogen in backbone */}
        <circle cx="100" cy="90" r="14" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
        <text x="100" y="95" textAnchor="middle" fill="#38bdf8" fontSize="15" fontWeight="bold" fontFamily="sans-serif">N</text>

        {/* Methylene nodes labels */}
        <text x="130" y="80" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="monospace">CH₂</text>
        <text x="165" y="80" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="monospace">{isOxazine ? 'CH₂—CH₂' : 'CH₂'}</text>

        {/* Acyl Side Chain hanging from N */}
        <line x1="100" y1="104" x2="100" y2="130" stroke="#cbd5e1" strokeWidth="3" />
        {/* Carbonyl Oxygen */}
        <line x1="97" y1="128" x2="70" y2="142" stroke="#f43f5e" strokeWidth="2.5" />
        <line x1="101" y1="133" x2="74" y2="147" stroke="#f43f5e" strokeWidth="2.5" />
        <text x="60" y="152" textAnchor="middle" fill="#f43f5e" fontSize="15" fontWeight="bold" fontFamily="sans-serif">O</text>

        {/* R Group */}
        <line x1="100" y1="130" x2="128" y2="145" stroke="#cbd5e1" strokeWidth="3" />
        <rect x="130" y="134" width="70" height="24" rx="6" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5" />
        <text x="165" y="150" textAnchor="middle" fill="#c7d2fe" fontSize="12" fontWeight="bold" fontFamily="monospace">
          {sideGroup}
        </text>

        {/* Polymer Brackets */}
        <path d="M 45 40 L 35 40 L 35 140 L 45 140" fill="none" stroke="#64748b" strokeWidth="2.5" />
        <path d="M 195 40 L 205 40 L 205 140 L 195 140" fill="none" stroke="#64748b" strokeWidth="2.5" />
        <text x="214" y="146" fill="#38bdf8" fontSize="16" fontWeight="bold" fontStyle="italic">n</text>
      </svg>
    );
  }

  // 2. 2-Oxazoline Monomer (5-membered heterocyclic ring)
  if (!isOxazine && !isInitiator && !isTerminator) {
    const rLabel = item.r_group || 'R';
    return (
      <svg width={size} height={size * 0.85} viewBox="0 0 200 170" className="mx-auto select-none">
        <rect width="200" height="170" rx="12" fill="#0f172a" fillOpacity="0.4" />
        
        {/* 5-membered Oxazoline Ring Vertices:
            C2: (100, 55)
            N3: (138, 82)
            C4: (124, 126)
            C5: (76, 126)
            O1: (62, 82)
        */}
        {/* Single bonds */}
        <line x1="62" y1="88" x2="76" y2="126" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="76" y1="126" x2="124" y2="126" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="124" y1="126" x2="138" y2="88" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="70" y1="78" x2="95" y2="60" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />

        {/* Double Bond between C2 and N3 */}
        <line x1="105" y1="58" x2="132" y2="76" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
        <line x1="102" y1="67" x2="124" y2="82" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />

        {/* Oxygen atom O1 */}
        <circle cx="62" cy="82" r="13" fill="#1e293b" stroke="#f43f5e" strokeWidth="2" />
        <text x="62" y="87" textAnchor="middle" fill="#f43f5e" fontSize="14" fontWeight="bold" fontFamily="sans-serif">O</text>

        {/* Nitrogen atom N3 */}
        <circle cx="138" cy="82" r="13" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
        <text x="138" y="87" textAnchor="middle" fill="#38bdf8" fontSize="14" fontWeight="bold" fontFamily="sans-serif">N</text>

        {/* C2 vertex & R-substituent bond */}
        <line x1="100" y1="55" x2="100" y2="28" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
        
        {/* R-group badge */}
        <rect x="65" y="6" width="70" height="24" rx="6" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5" />
        <text x="100" y="22" textAnchor="middle" fill="#c7d2fe" fontSize="12" fontWeight="bold" fontFamily="monospace">
          {rLabel}
        </text>

        {/* Ring carbon annotations */}
        <text x="70" y="142" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="sans-serif">C5</text>
        <text x="130" y="142" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="sans-serif">C4</text>
        <text x="100" y="74" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="sans-serif">C2</text>
      </svg>
    );
  }

  // 3. 2-Oxazine Monomer (6-membered ring)
  if (isOxazine) {
    const rLabel = item.r_group || 'R';
    return (
      <svg width={size} height={size * 0.85} viewBox="0 0 200 170" className="mx-auto select-none">
        <rect width="200" height="170" rx="12" fill="#0f172a" fillOpacity="0.4" />
        
        {/* 6-membered ring: C2(100,50), N3(135,70), C4(135,115), C5(100,135), C6(65,115), O1(65,70) */}
        <line x1="65" y1="76" x2="65" y2="115" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="65" y1="115" x2="100" y2="135" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="100" y1="135" x2="135" y2="115" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="135" y1="115" x2="135" y2="76" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="72" y1="67" x2="95" y2="52" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />

        {/* Double bond between C2 and N3 */}
        <line x1="105" y1="52" x2="128" y2="67" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
        <line x1="102" y1="60" x2="121" y2="73" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" />

        {/* Heteroatoms */}
        <circle cx="65" cy="70" r="13" fill="#1e293b" stroke="#f43f5e" strokeWidth="2" />
        <text x="65" y="75" textAnchor="middle" fill="#f43f5e" fontSize="14" fontWeight="bold" fontFamily="sans-serif">O</text>

        <circle cx="135" cy="70" r="13" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
        <text x="135" y="75" textAnchor="middle" fill="#38bdf8" fontSize="14" fontWeight="bold" fontFamily="sans-serif">N</text>

        {/* R-group at C2 */}
        <line x1="100" y1="50" x2="100" y2="24" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
        <rect x="65" y="4" width="70" height="24" rx="6" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5" />
        <text x="100" y="20" textAnchor="middle" fill="#c7d2fe" fontSize="12" fontWeight="bold" fontFamily="monospace">
          {rLabel}
        </text>

        <text x="100" y="152" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="sans-serif">6-membered 2-oxazine</text>
      </svg>
    );
  }

  // 4. Initiator / Terminator / General Reagent
  return (
    <svg width={size} height={size * 0.85} viewBox="0 0 200 170" className="mx-auto select-none">
      <rect width="200" height="170" rx="12" fill="#0f172a" fillOpacity="0.4" />
      <circle cx="100" cy="80" r="45" fill="#1e293b" stroke="#818cf8" strokeWidth="2" strokeDasharray="3 3" />
      <Atom className="w-10 h-10 text-indigo-400 mx-auto" />
      <text x="100" y="76" textAnchor="middle" fill="#818cf8" fontSize="18" fontWeight="bold">
        {item.abbreviation || 'Reagent'}
      </text>
      <text x="100" y="98" textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily="monospace">
        {item.formula || 'Active Species'}
      </text>
      <text x="100" y="145" textAnchor="middle" fill="#64748b" fontSize="11">
        {item.role || 'CROP Component'}
      </text>
    </svg>
  );
}

/**
 * Single Chemical Molecule Card with PubChem 2D fetch, vector fallback,
 * SMILES copy, and formula badges.
 */
export function MoleculeCard({ item }) {
  const [copied, setCopied] = useState(false);
  const [pubchemFailed, setPubchemFailed] = useState(false);

  const smiles = item.smiles;
  const pubchemUrl = smiles 
    ? `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encodeURIComponent(smiles)}/PNG?record_type=2d&image_size=200x200`
    : null;

  const handleCopySmiles = () => {
    if (!smiles) return;
    navigator.clipboard.writeText(smiles);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col justify-between p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all">
      <div>
        {/* Header Badges */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h5 className="font-bold text-slate-100 text-sm">
                {item.name}
              </h5>
              {item.abbreviation && (
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-teal-500/10 text-teal-300 border border-teal-500/30">
                  {item.abbreviation}
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              {item.type || item.role || 'Oxazoline Entity'}
            </span>
          </div>

          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
            item.role === 'Monomer' || item.role === 'Comonomer'
              ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
              : item.role === 'Initiator'
              ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
              : item.role === 'Terminator'
              ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
              : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
          }`}>
            {item.role || 'Chemical'}
          </span>
        </div>

        {/* Structure Diagram (PubChem 2D with fallback to Vector SVG) */}
        <div className="my-3 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-center min-h-[140px]">
          {pubchemUrl && !pubchemFailed ? (
            <img
              src={pubchemUrl}
              alt={item.name}
              className="max-h-[130px] object-contain filter invert contrast-125 brightness-90"
              onError={() => setPubchemFailed(true)}
              loading="lazy"
            />
          ) : (
            <ChemicalVectorSVG item={item} size={150} />
          )}
        </div>

        {/* Molecular Details */}
        <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
          <div className="p-2 rounded bg-slate-800/60 border border-slate-700/50">
            <span className="text-slate-400 block text-[10px]">Formula:</span>
            <span className="font-mono text-slate-200 font-semibold">{item.formula || item.chemical_formula || '—'}</span>
          </div>
          <div className="p-2 rounded bg-slate-800/60 border border-slate-700/50">
            <span className="text-slate-400 block text-[10px]">Mol. Weight:</span>
            <span className="font-mono text-slate-200 font-semibold">{item.mw || item.molecular_weight || '—'}</span>
          </div>
        </div>

        {item.description && (
          <p className="text-[11px] text-slate-400 leading-relaxed mb-3 line-clamp-2">
            {item.description}
          </p>
        )}
      </div>

      {/* SMILES and Copy Action */}
      {smiles && (
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <span className="text-[10px] font-mono text-slate-400 truncate max-w-[170px]" title={smiles}>
            {smiles}
          </span>
          <button
            onClick={handleCopySmiles}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-medium transition-colors shrink-0"
            title="Copy SMILES string"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-slate-400" />
                <span>SMILES</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Main Chemical Structure Gallery View
 */
export default function ChemicalStructureViewer({ structures, polymerSystem }) {
  // Normalize items from AI extraction or catalog
  let monomerList = [];

  if (structures?.monomers && Array.isArray(structures.monomers) && structures.monomers.length > 0) {
    monomerList = structures.monomers.map(m => {
      const lower = (m.abbreviation || m.name || '').toLowerCase().replace(/[^a-z]/g, '');
      const catalogEntry = OXAZOLINE_CHEMICAL_CATALOG[lower] || {};
      return {
        ...catalogEntry,
        ...m,
        role: m.role || 'Monomer'
      };
    });
  } else if (polymerSystem?.monomers) {
    // Inferred from polymer_and_chemical_system
    const raw = Array.isArray(polymerSystem.monomers) 
      ? polymerSystem.monomers 
      : String(polymerSystem.monomers || '').split(/[,;]+/);
      
    monomerList = raw.map(name => {
      const trimmed = name.trim();
      const lower = trimmed.toLowerCase();
      let matchKey = 'etox';
      if (lower.includes('methyl') || lower.includes('meox')) matchKey = 'meox';
      else if (lower.includes('ethyl') || lower.includes('etox')) matchKey = 'etox';
      else if (lower.includes('isopropyl') || lower.includes('iprox')) matchKey = 'iprox';
      else if (lower.includes('propyl') || lower.includes('prox')) matchKey = 'prox';
      else if (lower.includes('phenyl') || lower.includes('phox')) matchKey = 'phox';
      else if (lower.includes('butyl') || lower.includes('buox')) matchKey = 'buox';
      else if (lower.includes('oxazine') || lower.includes('meozi')) matchKey = 'meozi';

      const entry = OXAZOLINE_CHEMICAL_CATALOG[matchKey];
      return {
        ...entry,
        name: trimmed.length > 3 ? trimmed : entry.name,
        role: 'Monomer'
      };
    });
  }

  // Ensure repeat unit is present
  const repeatUnit = structures?.polymer_repeat_unit?.name 
    ? {
        name: structures.polymer_repeat_unit.name,
        formula_or_smiles: structures.polymer_repeat_unit.formula_or_smiles || '*-[N(COR)-CH2CH2]-*',
        role: 'Repeat Unit',
        side_chain: structures.polymer_repeat_unit.side_chain || 'R',
        description: 'Tertiary amide repeat unit characteristic of poly(2-oxazoline) backbones.'
      }
    : {
        name: `${polymerSystem?.polymer_type || 'Poly(2-oxazoline)'} Repeat Unit`,
        formula_or_smiles: '*-[N(COR)-CH2CH2]-*',
        role: 'Repeat Unit',
        side_chain: 'Alkyl / Aryl (R)',
        description: 'Linear pseudo-polypeptide tertiary amide backbone conferring low immunogenicity and tunable solubility.'
      };

  // Initiator item
  let initiatorItem = null;
  const initStr = structures?.initiator_structure?.name || polymerSystem?.initiators || '';
  if (initStr && !initStr.toLowerCase().includes('not reported')) {
    const lowerInit = initStr.toLowerCase();
    let initKey = 'meotf';
    if (lowerInit.includes('tosylate') || lowerInit.includes('meots')) initKey = 'meots';
    else if (lowerInit.includes('benzyl') || lowerInit.includes('bnbr')) initKey = 'bnbr';
    
    initiatorItem = {
      ...OXAZOLINE_CHEMICAL_CATALOG[initKey],
      name: initStr.length > 3 ? initStr : OXAZOLINE_CHEMICAL_CATALOG[initKey].name,
      role: 'Initiator'
    };
  }

  // Terminator item
  let terminatorItem = null;
  const termStr = structures?.terminator_structure?.name || '';
  if (termStr) {
    const lowerTerm = termStr.toLowerCase();
    let termKey = 'piperidine';
    if (lowerTerm.includes('water') || lowerTerm.includes('hydroxyl')) termKey = 'water';
    else if (lowerTerm.includes('azide')) termKey = 'azide';

    terminatorItem = {
      ...OXAZOLINE_CHEMICAL_CATALOG[termKey],
      name: termStr.length > 3 ? termStr : OXAZOLINE_CHEMICAL_CATALOG[termKey].name,
      role: 'Terminator'
    };
  }

  return (
    <div className="space-y-4">
      {/* Overview Banner */}
      <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between text-xs text-indigo-200">
        <div className="flex items-center gap-2">
          <Atom className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>
            <strong className="text-white">Chemical Structure Analysis:</strong> Monomer 2D structures, polymer repeat unit tertiary amides, initiators, and terminating end-cappers.
          </span>
        </div>
        <span className="text-[10px] font-mono text-indigo-300">
          SMILES & 2D Vector Depiction
        </span>
      </div>

      {/* Grid of Identified Chemical Entities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Polymer Repeat Unit */}
        <MoleculeCard item={repeatUnit} />

        {/* Monomers */}
        {monomerList.map((m, idx) => (
          <MoleculeCard key={`mono-${idx}`} item={m} />
        ))}

        {/* Initiator */}
        {initiatorItem && <MoleculeCard item={initiatorItem} />}

        {/* Terminator */}
        {terminatorItem && <MoleculeCard item={terminatorItem} />}
      </div>
    </div>
  );
}
