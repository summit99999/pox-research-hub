import React from 'react';

/**
 * Precision Scientific 3D / Dimensional SVG Illustrations
 * Each illustration accurately represents the specific macromolecular motif,
 * chemical architecture, or physical phenomenon of the research domain.
 */

export function DomainMotifIllustration({ motifType, className = "w-full h-32" }) {
  switch (motifType) {
    case 'cyclic_crop':
      // CROP: 2-Oxazoline 5-membered cyclic imino ether ring-opening to pseudo-peptide backbone
      return (
        <svg viewBox="0 0 240 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="cropGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
            <filter id="cropGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {/* Ring Opening Transition: Cyclic Oxazoline Ring */}
          <polygon points="40,25 65,40 55,75 25,75 15,40" stroke="#a78bfa" strokeWidth="2.5" fill="#8b5cf6" fillOpacity="0.15" />
          <circle cx="40" cy="25" r="4.5" fill="#38bdf8" /> {/* Oxygen */}
          <circle cx="65" cy="40" r="4.5" fill="#818cf8" /> {/* Nitrogen */}
          <line x1="40" y1="25" x2="65" y2="40" stroke="#38bdf8" strokeWidth="3" />
          <text x="36" y="22" fill="#bae6fd" fontSize="8" fontFamily="monospace" fontWeight="bold">O</text>
          <text x="69" y="42" fill="#c7d2fe" fontSize="8" fontFamily="monospace" fontWeight="bold">N</text>
          
          {/* Arrow with CROP Catalyst */}
          <path d="M 80 50 L 105 50 M 98 45 L 105 50 L 98 55" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
          <text x="82" y="40" fill="#fda4af" fontSize="8" fontFamily="monospace">CROP</text>

          {/* Resulting Poly(2-oxazoline) Repeating Backbone */}
          <path d="M 120 60 Q 135 35 150 60 T 180 60 T 210 60 T 235 55" stroke="url(#cropGrad)" strokeWidth="3.5" strokeLinecap="round" filter="url(#cropGlow)" />
          {/* Amide Pendants */}
          <circle cx="150" cy="60" r="4" fill="#818cf8" />
          <line x1="150" y1="60" x2="150" y2="85" stroke="#a78bfa" strokeWidth="2" />
          <circle cx="150" cy="85" r="3.5" fill="#ec4899" />
          <line x1="150" y1="85" x2="162" y2="92" stroke="#ec4899" strokeWidth="2" />
          <text x="165" y="96" fill="#f472b6" fontSize="7" fontFamily="monospace">R (Me/Et/iPr)</text>

          <circle cx="180" cy="60" r="4" fill="#818cf8" />
          <line x1="180" y1="60" x2="180" y2="85" stroke="#a78bfa" strokeWidth="2" />
          <circle cx="180" cy="85" r="3.5" fill="#ec4899" />

          <circle cx="210" cy="60" r="4" fill="#818cf8" />
          <line x1="210" y1="60" x2="210" y2="85" stroke="#a78bfa" strokeWidth="2" />
          <circle cx="210" cy="85" r="3.5" fill="#ec4899" />
        </svg>
      );

    case 'hydrocarbon_chain':
      // Polyolefins: Zig-zag polyethylene / polypropylene backbone with stereospecific tacticity
      return (
        <svg viewBox="0 0 240 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="poGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="50%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          {/* Zig-Zag Covalent Backbone */}
          <polyline points="15,65 35,35 60,65 85,35 110,65 135,35 160,65 185,35 210,65 230,35" stroke="url(#poGrad)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          {/* Tacticity Methyl Wedges */}
          <polygon points="35,35 42,15 28,15" fill="#38bdf8" />
          <text x="30" y="10" fill="#bae6fd" fontSize="8" fontFamily="monospace">CH3</text>

          <polygon points="85,35 92,15 78,15" fill="#38bdf8" />
          <text x="80" y="10" fill="#bae6fd" fontSize="8" fontFamily="monospace">CH3</text>

          <polygon points="135,35 142,15 128,15" fill="#38bdf8" />
          <text x="130" y="10" fill="#bae6fd" fontSize="8" fontFamily="monospace">CH3</text>

          <polygon points="185,35 192,15 178,15" fill="#38bdf8" />
          <text x="180" y="10" fill="#bae6fd" fontSize="8" fontFamily="monospace">CH3</text>

          {/* Lower Hydrogen Dashes */}
          <line x1="60" y1="65" x2="60" y2="85" stroke="#64748b" strokeWidth="2" strokeDasharray="2,2" />
          <line x1="110" y1="65" x2="110" y2="85" stroke="#64748b" strokeWidth="2" strokeDasharray="2,2" />
          <line x1="160" y1="65" x2="160" y2="85" stroke="#64748b" strokeWidth="2" strokeDasharray="2,2" />
          <line x1="210" y1="65" x2="210" y2="85" stroke="#64748b" strokeWidth="2" strokeDasharray="2,2" />
          <text x="65" y="105" fill="#94a3b8" fontSize="9" fontFamily="monospace">Isotactic [-CH2-CH(CH3)-]n</text>
        </svg>
      );

    case 'pendant_vinyl':
      // Vinyl & Acrylic: Polystyrene & PMMA with pendant ester & phenyl rings
      return (
        <svg viewBox="0 0 240 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <polyline points="20,40 50,40 80,40 110,40 140,40 170,40 200,40 225,40" stroke="#f97316" strokeWidth="3.5" strokeLinecap="round" />
          {/* Phenyl Ring on Polystyrene unit */}
          <line x1="50" y1="40" x2="50" y2="58" stroke="#fb923c" strokeWidth="2.5" />
          <polygon points="50,58 65,68 65,88 50,98 35,88 35,68" stroke="#ea580c" strokeWidth="2" fill="#ea580c" fillOpacity="0.2" />
          <circle cx="50" cy="78" r="8" stroke="#fdba74" strokeWidth="1.5" strokeDasharray="2,2" />

          {/* PMMA Ester Group */}
          <line x1="110" y1="40" x2="110" y2="60" stroke="#fb923c" strokeWidth="2.5" />
          <line x1="110" y1="60" x2="125" y2="70" stroke="#f43f5e" strokeWidth="2" />
          <line x1="108" y1="60" x2="95" y2="72" stroke="#38bdf8" strokeWidth="2" />
          <text x="127" y="75" fill="#fda4af" fontSize="8" fontFamily="monospace">O</text>
          <text x="80" y="80" fill="#7dd3fc" fontSize="8" fontFamily="monospace">OCH3</text>

          {/* PNIPAM Amide Group */}
          <line x1="170" y1="40" x2="170" y2="60" stroke="#fb923c" strokeWidth="2.5" />
          <text x="160" y="75" fill="#a78bfa" fontSize="8" fontFamily="monospace">CONH</text>
          <path d="M 170 80 L 170 95 L 182 102 M 170 95 L 158 102" stroke="#a78bfa" strokeWidth="2" />
          <text x="155" y="112" fill="#c084fc" fontSize="7" fontFamily="monospace">i-Propyl</text>
        </svg>
      );

    case 'ester_cleavage':
      // Polyesters & Biodegradable: Ester linkage with enzymatic/hydrolytic cleavage
      return (
        <svg viewBox="0 0 240 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="esterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
          </defs>
          <path d="M 20 60 Q 40 40 60 60 T 100 60" stroke="url(#esterGrad)" strokeWidth="3.5" strokeLinecap="round" />
          {/* Carbonyl C=O */}
          <line x1="60" y1="60" x2="60" y2="35" stroke="#34d399" strokeWidth="2.5" />
          <line x1="64" y1="60" x2="64" y2="35" stroke="#34d399" strokeWidth="2.5" />
          <circle cx="62" cy="32" r="5" fill="#f43f5e" />
          <text x="59" y="35" fill="#fff" fontSize="8" fontWeight="bold">O</text>

          {/* Ester Oxygen */}
          <circle cx="85" cy="60" r="5" fill="#38bdf8" />
          <text x="82" y="63" fill="#0f172a" fontSize="8" fontWeight="bold">O</text>

          {/* Hydrolytic Scissor Cleavage */}
          <path d="M 115 35 L 125 55 M 135 35 L 125 55 M 125 55 L 120 75 M 125 55 L 130 75" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
          <text x="105" y="25" fill="#f43f5e" fontSize="8" fontFamily="monospace" fontWeight="bold">H2O / Lipase</text>

          {/* Degradation Product */}
          <path d="M 145 60 Q 165 80 185 60 T 225 60" stroke="#10b981" strokeWidth="3" strokeDasharray="4,3" />
          <text x="145" y="95" fill="#6ee7b7" fontSize="8" fontFamily="monospace">L-Lactic Acid [-CH(CH3)COO-]</text>
        </svg>
      );

    case 'h_bond_sheet':
      // Polyamides & Polypeptides: Intermolecular Hydrogen Bonding Beta-Sheet
      return (
        <svg viewBox="0 0 240 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Strand 1 */}
          <path d="M 20 35 L 55 35 L 90 35 L 125 35 L 160 35 L 195 35 L 225 35" stroke="#f43f5e" strokeWidth="3" />
          <circle cx="55" cy="35" r="4.5" fill="#fb7185" />
          <text x="52" y="25" fill="#fecdd3" fontSize="8" fontFamily="monospace">N-H</text>
          <circle cx="125" cy="35" r="4.5" fill="#38bdf8" />
          <text x="122" y="25" fill="#bae6fd" fontSize="8" fontFamily="monospace">C=O</text>

          {/* Interstrand H-Bonds (Dotted) */}
          <line x1="55" y1="35" x2="55" y2="85" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="3,3" />
          <line x1="125" y1="35" x2="125" y2="85" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="3,3" />
          <line x1="195" y1="35" x2="195" y2="85" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="3,3" />

          {/* Strand 2 */}
          <path d="M 20 85 L 55 85 L 90 85 L 125 85 L 160 85 L 195 85 L 225 85" stroke="#e11d48" strokeWidth="3" />
          <circle cx="55" cy="85" r="4.5" fill="#38bdf8" />
          <text x="52" y="100" fill="#bae6fd" fontSize="8" fontFamily="monospace">C=O</text>
          <circle cx="125" cy="85" r="4.5" fill="#fb7185" />
          <text x="122" y="100" fill="#fecdd3" fontSize="8" fontFamily="monospace">N-H</text>

          <text x="80" y="62" fill="#fb7185" fontSize="9" fontFamily="monospace" fontWeight="bold">H···O Bond</text>
        </svg>
      );

    case 'flexible_oxyethylene':
      // Polyethers: Flexible oxyethylene spiral with lithium cation coordination
      return (
        <svg viewBox="0 0 240 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 20 60 C 40 20, 60 100, 80 60 C 100 20, 120 100, 140 60 C 160 20, 180 100, 200 60 C 215 30, 230 70, 235 60" stroke="#14b8a6" strokeWidth="3.5" strokeLinecap="round" />
          {/* Ether Oxygens */}
          <circle cx="50" cy="40" r="5" fill="#f43f5e" />
          <circle cx="110" cy="40" r="5" fill="#f43f5e" />
          <circle cx="170" cy="40" r="5" fill="#f43f5e" />
          {/* Lithium Ion Cation Coordination */}
          <circle cx="110" cy="68" r="9" fill="#06b6d4" />
          <text x="105" y="72" fill="#fff" fontSize="9" fontWeight="bold">Li⁺</text>
          {/* Coordination Dotted Lines */}
          <line x1="110" y1="68" x2="50" y2="40" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2,2" />
          <line x1="110" y1="68" x2="110" y2="40" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2,2" />
          <line x1="110" y1="68" x2="170" y2="40" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2,2" />
          <text x="45" y="105" fill="#5eead4" fontSize="8" fontFamily="monospace">[-CH2-CH2-O-]n Coordination</text>
        </svg>
      );

    case 'rigid_aromatic':
      // High-Performance: Rigid Aromatic Fused Heterocycles (Polyimide Kapton)
      return (
        <svg viewBox="0 0 240 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Benzene Ring */}
          <polygon points="50,45 65,35 80,45 80,65 65,75 50,65" stroke="#6366f1" strokeWidth="2.5" fill="#4f46e5" fillOpacity="0.2" />
          {/* Imide Ring 1 */}
          <polygon points="80,45 100,50 105,65 95,72 80,65" stroke="#818cf8" strokeWidth="2" fill="#818cf8" fillOpacity="0.15" />
          <circle cx="100" cy="50" r="3" fill="#f43f5e" />
          <text x="98" y="44" fill="#fda4af" fontSize="7">O</text>
          {/* Aromatic Bridge ODA */}
          <circle cx="125" cy="65" r="4.5" fill="#38bdf8" />
          <text x="122" y="60" fill="#bae6fd" fontSize="8" fontWeight="bold">O</text>
          {/* Second Benzene */}
          <polygon points="145,55 160,45 175,55 175,75 160,85 145,75" stroke="#6366f1" strokeWidth="2.5" fill="#4f46e5" fillOpacity="0.2" />
          <text x="40" y="105" fill="#c7d2fe" fontSize="8" fontFamily="monospace">Rigid Polyimide Backbone (Tg &gt; 380 °C)</text>
        </svg>
      );

    case 'disulfide_bridge':
      // Sulfur: Dynamic Disulfide Bond Reversibility
      return (
        <svg viewBox="0 0 240 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 25 60 L 85 60" stroke="#d97706" strokeWidth="3.5" />
          {/* Disulfide S-S Bond */}
          <circle cx="85" cy="60" r="8" fill="#f59e0b" />
          <text x="81" y="64" fill="#000" fontSize="10" fontWeight="bold">S</text>
          <line x1="85" y1="60" x2="115" y2="60" stroke="#fbbf24" strokeWidth="3" />
          <circle cx="115" cy="60" r="8" fill="#f59e0b" />
          <text x="111" y="64" fill="#000" fontSize="10" fontWeight="bold">S</text>
          <path d="M 115 60 L 175 60" stroke="#d97706" strokeWidth="3.5" />
          {/* Reversible Cleavage Arrow */}
          <path d="M 90 35 Q 100 25 110 35 M 105 32 L 110 35 L 108 40" stroke="#f43f5e" strokeWidth="2" />
          <text x="75" y="20" fill="#fca5a5" fontSize="8" fontFamily="monospace">+ GSH / Redox</text>
          <text x="40" y="100" fill="#fcd34d" fontSize="8" fontFamily="monospace">Dynamic S-S Metathesis &amp; Vitrimer CANs</text>
        </svg>
      );

    case 'siloxane_spiral':
      // Silicon: Flexible Siloxane [-Si(Me)2-O-]n Backbone
      return (
        <svg viewBox="0 0 240 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 25 60 L 60 40 L 95 60 L 130 40 L 165 60 L 200 40 L 230 55" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" />
          {/* Silicon Atoms */}
          <circle cx="60" cy="40" r="7" fill="#0284c7" />
          <text x="54" y="44" fill="#fff" fontSize="8" fontWeight="bold">Si</text>
          <line x1="60" y1="40" x2="60" y2="18" stroke="#38bdf8" strokeWidth="2" />
          <text x="52" y="14" fill="#bae6fd" fontSize="7" fontFamily="monospace">CH3</text>
          <line x1="60" y1="40" x2="72" y2="30" stroke="#38bdf8" strokeWidth="2" />

          {/* Oxygen Atoms */}
          <circle cx="95" cy="60" r="5" fill="#f43f5e" />
          <text x="92" y="63" fill="#fff" fontSize="7" fontWeight="bold">O</text>

          <circle cx="130" cy="40" r="7" fill="#0284c7" />
          <text x="124" y="44" fill="#fff" fontSize="8" fontWeight="bold">Si</text>
          <line x1="130" y1="40" x2="130" y2="18" stroke="#38bdf8" strokeWidth="2" />
          <text x="122" y="14" fill="#bae6fd" fontSize="7" fontFamily="monospace">CH3</text>

          <text x="35" y="100" fill="#67e8f9" fontSize="8" fontFamily="monospace">PDMS Torsional Flexibility (Tg = -125 °C)</text>
        </svg>
      );

    case 'conjugated_pi':
      // Conducting Polymers: Alternating pi-bond delocalization with polaron charge
      return (
        <svg viewBox="0 0 240 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Conjugated Thiophene Rings (PEDOT / P3HT) */}
          <polygon points="35,60 55,45 75,55 65,75 45,75" stroke="#06b6d4" strokeWidth="2.5" fill="#0891b2" fillOpacity="0.2" />
          <circle cx="55" cy="75" r="4" fill="#f59e0b" /> {/* S atom */}
          <polygon points="85,60 105,45 125,55 115,75 95,75" stroke="#06b6d4" strokeWidth="2.5" fill="#0891b2" fillOpacity="0.2" />
          <circle cx="105" cy="75" r="4" fill="#f59e0b" />
          <polygon points="135,60 155,45 175,55 165,75 145,75" stroke="#06b6d4" strokeWidth="2.5" fill="#0891b2" fillOpacity="0.2" />
          <circle cx="155" cy="75" r="4" fill="#f59e0b" />
          {/* Delocalized Pi Orbitals (Glowing dashed clouds) */}
          <path d="M 35 40 Q 105 25 180 40" stroke="#38bdf8" strokeWidth="3" strokeDasharray="3,3" opacity="0.8" />
          {/* Positive Polaron Charge */}
          <circle cx="105" cy="35" r="7" fill="#ec4899" />
          <text x="102" y="39" fill="#fff" fontSize="9" fontWeight="bold">+</text>
          <text x="50" y="105" fill="#67e8f9" fontSize="8" fontFamily="monospace">Pi-Conjugated Polaron Transport (PEDOT)</text>
        </svg>
      );

    case 'polysaccharide_helix':
      // Natural: Beta-1,4 Glycosidic Ring Chain (Cellulose / Chitosan)
      return (
        <svg viewBox="0 0 240 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Pyranose Ring 1 */}
          <polygon points="40,50 60,38 80,48 78,68 58,75 38,65" stroke="#22c55e" strokeWidth="2" fill="#15803d" fillOpacity="0.2" />
          <circle cx="75" cy="42" r="3.5" fill="#38bdf8" />
          {/* Glycosidic Ether Linkage */}
          <line x1="78" y1="68" x2="98" y2="58" stroke="#4ade80" strokeWidth="2.5" />
          <circle cx="98" cy="58" r="4" fill="#38bdf8" />
          {/* Inverted Pyranose Ring 2 */}
          <polygon points="105,58 125,48 145,58 143,78 123,85 103,75" stroke="#22c55e" strokeWidth="2" fill="#15803d" fillOpacity="0.2" />
          <circle cx="140" cy="52" r="3.5" fill="#38bdf8" />
          <line x1="143" y1="78" x2="163" y2="68" stroke="#4ade80" strokeWidth="2.5" />
          <circle cx="163" cy="68" r="4" fill="#38bdf8" />
          <text x="45" y="105" fill="#86efac" fontSize="8" fontFamily="monospace">β-(1→4)-Glycosidic Linkages (Cellulose)</text>
        </svg>
      );

    case 'complex_topology':
      // Polymer Architectures: Star & Bottlebrush Topologies
      return (
        <svg viewBox="0 0 240 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Star Polymer (Left) */}
          <circle cx="60" cy="60" r="8" fill="#ec4899" />
          <path d="M 60 60 Q 40 25 20 20" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 60 60 Q 80 25 100 20" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 60 60 Q 20 65 15 85" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 60 60 Q 60 90 60 110" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 60 60 Q 95 75 105 95" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" />
          <text x="35" y="15" fill="#f472b6" fontSize="7" fontFamily="monospace">Star Polymer</text>

          {/* Dendrimer / Bottlebrush (Right) */}
          <line x1="140" y1="60" x2="220" y2="60" stroke="#f43f5e" strokeWidth="3.5" strokeLinecap="round" />
          {/* Grafted Sidechains */}
          {[150, 165, 180, 195, 210].map((x, i) => (
            <React.Fragment key={i}>
              <path d={`M ${x} 60 Q ${x - 5} 35 ${x} 20`} stroke="#c084fc" strokeWidth="2" />
              <path d={`M ${x} 60 Q ${x + 5} 85 ${x} 100`} stroke="#c084fc" strokeWidth="2" />
            </React.Fragment>
          ))}
          <text x="145" y="15" fill="#e879f9" fontSize="7" fontFamily="monospace">Bottlebrush</text>
        </svg>
      );

    case 'chain_growth_kinetics':
      // Polymerization Methods: Radical/Living Chain Growth Kinetics
      return (
        <svg viewBox="0 0 240 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <polyline points="20,60 50,45 80,60 110,45 140,60 170,45" stroke="#ea580c" strokeWidth="3" strokeLinecap="round" />
          {/* Propagating Active Radical / Oxazolinium Center */}
          <circle cx="170" cy="45" r="7" fill="#f43f5e" />
          <circle cx="170" cy="45" r="2.5" fill="#fff" />
          {/* Incoming Monomer with Curved Addition Arrow */}
          <path d="M 215 25 Q 195 20 180 38" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3,2" />
          <polygon points="178,35 180,41 185,38" fill="#38bdf8" />
          <circle cx="215" cy="25" r="6" fill="#38bdf8" />
          <text x="210" y="28" fill="#0f172a" fontSize="7" fontWeight="bold">M</text>
          <text x="50" y="100" fill="#fdba74" fontSize="8" fontFamily="monospace">Living Chain-End Propagation (kd / kp)</text>
        </svg>
      );

    case 'spectra_chromatogram':
      // Polymer Characterization: GPC/SEC Gaussian Peak & NMR Multiplet
      return (
        <svg viewBox="0 0 240 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Baseline */}
          <line x1="20" y1="90" x2="220" y2="90" stroke="#475569" strokeWidth="1.5" />
          {/* GPC Gaussian Elution Peak */}
          <path d="M 30 90 Q 70 90 90 65 Q 110 15 125 15 Q 140 15 160 65 Q 180 90 220 90" stroke="#6366f1" strokeWidth="3" fill="#6366f1" fillOpacity="0.15" />
          {/* Dispersity Đ Marker */}
          <line x1="125" y1="15" x2="125" y2="90" stroke="#a5b4fc" strokeWidth="1.5" strokeDasharray="2,2" />
          <text x="130" y="30" fill="#c7d2fe" fontSize="8" fontFamily="monospace">Mp (Mw/Mn &lt; 1.08)</text>
          <text x="50" y="105" fill="#a5b4fc" fontSize="8" fontFamily="monospace">Size Exclusion Chromatography (SEC/GPC)</text>
        </svg>
      );

    case 'coil_to_globule':
      // Stimuli-Responsive: Hydrated Extended Coil vs Collapsed Globule
      return (
        <svg viewBox="0 0 240 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Extended Hydrophilic Coil (T < LCST) */}
          <path d="M 20 60 Q 40 20 60 70 T 100 50" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
          <text x="35" y="25" fill="#7dd3fc" fontSize="7" fontFamily="monospace">Hydrated Coil</text>
          {/* Temperature / pH Stimulus Transition Arrow */}
          <path d="M 105 60 L 135 60 M 128 55 L 135 60 L 128 65" stroke="#ec4899" strokeWidth="2" />
          <text x="110" y="50" fill="#f472b6" fontSize="7" fontFamily="monospace">&gt; LCST</text>
          {/* Collapsed Hydrophobic Globule (T > LCST) */}
          <circle cx="180" cy="60" r="22" fill="#ec4899" fillOpacity="0.25" stroke="#ec4899" strokeWidth="2.5" />
          <path d="M 165 55 Q 180 40 195 55 T 180 75 Z" stroke="#f43f5e" strokeWidth="2" fill="none" />
          <text x="155" y="100" fill="#f472b6" fontSize="8" fontFamily="monospace">Coil-to-Globule Phase Transition</text>
        </svg>
      );

    case 'vesicle_micelle':
      // Biomedical: Core-Shell Polymeric Micelle with Encapsulated Drug
      return (
        <svg viewBox="0 0 240 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Outer Hydrophilic Stealth Corona */}
          <circle cx="120" cy="60" r="42" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3,3" fill="#0284c7" fillOpacity="0.08" />
          {/* Corona Polymer Chains */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((ang, i) => {
            const rad = (ang * Math.PI) / 180;
            const x1 = 120 + Math.cos(rad) * 22;
            const y1 = 60 + Math.sin(rad) * 22;
            const x2 = 120 + Math.cos(rad) * 40;
            const y2 = 60 + Math.sin(rad) * 40;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />;
          })}
          {/* Inner Hydrophobic Core */}
          <circle cx="120" cy="60" r="22" fill="#f43f5e" fillOpacity="0.3" stroke="#f43f5e" strokeWidth="2" />
          {/* Encapsulated Chemotherapy Drug Molecule */}
          <polygon points="120,50 128,60 120,70 112,60" fill="#fbbf24" />
          <text x="117" y="63" fill="#000" fontSize="7" fontWeight="bold">D</text>
          <text x="50" y="112" fill="#fda4af" fontSize="8" fontFamily="monospace">Core-Shell Polymeric Nanocarrier</text>
        </svg>
      );

    case 'ion_conducting_channel':
      // Energy: Nanophase Hydrophilic Ion Conducting Channel (Nafion / SPE)
      return (
        <svg viewBox="0 0 240 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Hydrophobic Fluorocarbon Walls */}
          <rect x="20" y="20" width="200" height="25" rx="4" fill="#334155" />
          <text x="30" y="36" fill="#94a3b8" fontSize="8" fontFamily="monospace">PTFE Backbone [-CF2-CF2-]</text>
          <rect x="20" y="75" width="200" height="25" rx="4" fill="#334155" />
          <text x="30" y="91" fill="#94a3b8" fontSize="8" fontFamily="monospace">PTFE Backbone [-CF2-CF2-]</text>
          {/* Central Water / Sulfonic Channel */}
          <rect x="20" y="47" width="200" height="26" fill="#0284c7" fillOpacity="0.2" />
          {/* Sulfonic Acid Groups */}
          <circle cx="50" cy="46" r="4" fill="#f43f5e" />
          <circle cx="95" cy="74" r="4" fill="#f43f5e" />
          <circle cx="140" cy="46" r="4" fill="#f43f5e" />
          <circle cx="185" cy="74" r="4" fill="#f43f5e" />
          {/* Hopping Hydronium / Li+ Ion */}
          <circle cx="70" cy="60" r="5" fill="#22c55e" />
          <text x="67" y="63" fill="#000" fontSize="7" fontWeight="bold">H⁺</text>
          <circle cx="160" cy="60" r="5" fill="#22c55e" />
          <text x="157" y="63" fill="#000" fontSize="7" fontWeight="bold">H⁺</text>
          <text x="50" y="115" fill="#38bdf8" fontSize="8" fontFamily="monospace">Grotthuss Proton Conduction Pathway</text>
        </svg>
      );

    case 'supramolecular_mesh':
    default:
      // Advanced: Quadruple Hydrogen-Bonding Self-Healing Network (UPy)
      return (
        <svg viewBox="0 0 240 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="30" y="40" width="70" height="40" rx="6" fill="#4f46e5" fillOpacity="0.3" stroke="#6366f1" strokeWidth="2" />
          <text x="45" y="64" fill="#c7d2fe" fontSize="10" fontFamily="monospace" fontWeight="bold">UPy-1</text>
          {/* Quadruple DADA Hydrogen Bonds */}
          <line x1="100" y1="46" x2="140" y2="46" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3,2" />
          <line x1="100" y1="54" x2="140" y2="54" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3,2" />
          <line x1="100" y1="64" x2="140" y2="64" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3,2" />
          <line x1="100" y1="72" x2="140" y2="72" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3,2" />

          <rect x="140" y="40" width="70" height="40" rx="6" fill="#4f46e5" fillOpacity="0.3" stroke="#6366f1" strokeWidth="2" />
          <text x="155" y="64" fill="#c7d2fe" fontSize="10" fontFamily="monospace" fontWeight="bold">UPy-2</text>
          <text x="40" y="105" fill="#a5b4fc" fontSize="8" fontFamily="monospace">Autonomic Quadruple H-Bond Healing (Kdim &gt; 10⁷ M⁻¹)</text>
        </svg>
      );
  }
}
