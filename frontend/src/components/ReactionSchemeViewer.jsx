import React, { useState } from 'react';
import { 
  ArrowRight, 
  Flame, 
  FlaskConical, 
  CheckCircle, 
  ShieldCheck, 
  Layers, 
  Sliders, 
  Clock, 
  Thermometer, 
  Sparkles,
  Info
} from 'lucide-react';

/**
 * Renders the full Synthetic Reaction Scheme & CROP Polymerization Mechanism.
 */
export default function ReactionSchemeViewer({ scheme, polymerSystem, experimentalValues }) {
  const [activeStepTab, setActiveStepTab] = useState(0);

  // Derive or construct the reaction scheme details
  const title = scheme?.scheme_title || `Cationic Ring-Opening Polymerization (CROP) of ${polymerSystem?.polymer_type || '2-Oxazolines'}`;
  const mechanismType = scheme?.mechanism_type || 'Living Cationic Ring-Opening Polymerization (CROP)';
  const overallEq = scheme?.overall_equation && !scheme.overall_equation.toLowerCase().includes('not reported')
    ? scheme.overall_equation
    : `n (${Array.isArray(polymerSystem?.monomers) ? polymerSystem.monomers.join(' + ') : (polymerSystem?.monomers || '2-Oxazoline')}) + Initiator ──[Solvent, Δ]──> [Living POx]⁺ X⁻ ──[Quencher]──> α-POx-ω`;

  const solventTemp = scheme?.solvent_and_temperature || experimentalValues?.reaction_temperature_time || 'Acetonitrile (CH₃CN), 80–140 °C (Microwave / Thermal)';
  const initiator = scheme?.initiator || polymerSystem?.initiators || 'Alkyl triflate / tosylate (e.g. MeOTf, MeOTs)';
  const terminator = scheme?.terminator_or_end_group || 'Nucleophilic quencher (e.g. Piperidine, H₂O, NaN₃)';
  const architecture = scheme?.polymer_architecture || polymerSystem?.block_architecture || 'Linear homopolymer / Block architecture';

  // Construct reaction steps
  const steps = (scheme?.reaction_steps && scheme.reaction_steps.length > 0)
    ? scheme.reaction_steps
    : [
        {
          step_number: 1,
          step_name: 'Stage 1: Initiation (Ring Activation)',
          reactants: `${initiator} + 2-Oxazoline Monomer`,
          conditions: 'Anhydrous conditions, Inert atmosphere (N₂/Ar), Room temperature to 40 °C',
          intermediates_or_products: 'Active 2-Alkyl-2-oxazolinium Cation Intermediate [Oxazolinium]⁺ X⁻',
          description: 'The initiator performs an electrophilic attack on the cyclic imino nitrogen (N-3) of the 2-oxazoline ring. This converts the neutral monomer into a reactive cyclic oxazolinium cation active center with a non-nucleophilic counterion (OTf⁻, OTs⁻).'
        },
        {
          step_number: 2,
          step_name: 'Stage 2: Propagation (Living Cationic Chain Growth)',
          reactants: '[Living Oxazolinium]⁺ + n (2-Oxazoline Monomers)',
          conditions: `${solventTemp}, controlled reaction kinetics`,
          intermediates_or_products: 'Living Poly(2-oxazoline) Macro-oxazolinium Cation',
          description: 'Chain propagation proceeds via regioselective nucleophilic attack of the incoming oxazoline monomer onto the electrophilic C-5 methylene carbon of the terminal oxazolinium ring. Ring-opening generates a linear tertiary amide unit while regenerating the active oxazolinium ion at the growing chain terminus.'
        },
        {
          step_number: 3,
          step_name: 'Stage 3: Termination & End-Capping (Living Quenching)',
          reactants: '[Living POx-Oxazolinium]⁺ + Quenching Nucleophile',
          conditions: 'Quenching at room temperature or 40 °C with excess nucleophile',
          intermediates_or_products: 'End-Functionalized Poly(2-oxazoline) [α-End—POx—ω-End]',
          description: 'A nucleophilic terminating agent (such as piperidine, water, hydroxide, morpholine, or sodium azide) regioselectively attacks the C-5 position of the terminal oxazolinium ring, permanently opening the ring and introducing the chosen functional ω-end group.'
        }
      ];

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Mechanism Identification */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-teal-500/10 text-teal-400 border border-teal-500/30">
                <FlaskConical className="w-4 h-4" />
              </span>
              <h4 className="font-bold text-slate-100 text-sm">
                {title}
              </h4>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Reaction Scheme & CROP Polymerization Pathway
            </p>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/30">
            {mechanismType}
          </span>
        </div>

        {/* Overall Reaction Equation Card */}
        <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 font-mono text-xs overflow-x-auto">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1 font-sans font-semibold">
            Overall Synthetic Equation:
          </div>
          <div className="text-teal-300 font-medium py-1 whitespace-pre-wrap leading-relaxed">
            {overallEq}
          </div>
        </div>

        {/* Key Synthetic Reaction Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
          <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/60 flex items-start gap-2">
            <Thermometer className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Solvent & Temperature:</span>
              <span className="text-slate-200 font-medium">{solventTemp}</span>
            </div>
          </div>

          <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/60 flex items-start gap-2">
            <Flame className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Initiator System:</span>
              <span className="text-slate-200 font-medium">{initiator}</span>
            </div>
          </div>

          <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/60 flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">End-Capping / Quencher:</span>
              <span className="text-slate-200 font-medium">{terminator}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Visual Polymer Chain Architecture Map */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h5 className="font-semibold text-xs uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            Polymer Architecture & Chain End Connectivity
          </h5>
          <span className="text-[11px] text-slate-400">
            {architecture}
          </span>
        </div>

        {/* Schematic Chain Connectivity Bar */}
        <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800 flex flex-wrap items-center justify-center gap-2 text-xs">
          {/* Alpha End */}
          <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 font-mono">
            <span className="font-bold">α-End</span>
            <span className="text-[11px] opacity-80">({initiator.split(' ')[0]})</span>
          </div>

          <ArrowRight className="w-4 h-4 text-slate-600" />

          {/* Repeat Unit / Block A */}
          <div className="px-4 py-2 rounded-lg bg-teal-500/15 text-teal-200 border border-teal-500/40 flex flex-col items-center">
            <span className="font-mono font-bold text-teal-300 text-xs">
              [-N(CO-R)-CH₂-CH₂-]ₙ
            </span>
            <span className="text-[10px] text-teal-400/80 mt-0.5">
              Core POx Repeat Unit
            </span>
          </div>

          <ArrowRight className="w-4 h-4 text-slate-600" />

          {/* Omega End */}
          <div className="px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/30 flex items-center gap-1.5 font-mono">
            <span className="font-bold">ω-End</span>
            <span className="text-[11px] opacity-80">({terminator.split(' ')[0]})</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 text-center">
          Linear tertiary amide backbone confers resistance to non-specific protein adsorption and stealth biological circulation.
        </div>
      </div>

      {/* 3. Multi-Stage CROP Polymerization Mechanism */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h5 className="font-semibold text-xs uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" />
            Step-by-Step CROP Reaction Mechanism
          </h5>
          <span className="text-[11px] text-slate-400">
            3 Sequential Kinetic Stages
          </span>
        </div>

        {/* Step Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {steps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStepTab(idx)}
              className={`p-3 rounded-lg text-left transition-all border ${
                activeStepTab === idx
                  ? 'bg-teal-500/10 border-teal-500/50 text-teal-200 shadow-sm'
                  : 'bg-slate-800/50 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                <span>Stage {step.step_number || idx + 1}</span>
                {activeStepTab === idx && <span className="w-2 h-2 rounded-full bg-teal-400" />}
              </div>
              <div className="text-xs font-semibold text-slate-200 truncate">
                {step.step_name?.replace(/Stage \d+:\s*/, '')}
              </div>
            </button>
          ))}
        </div>

        {/* Active Stage Detailed Breakdown */}
        {steps[activeStepTab] && (
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-teal-300">
                {steps[activeStepTab].step_name}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                Step {steps[activeStepTab].step_number || activeStepTab + 1} of {steps.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Reactants / Precursors:
                </span>
                <span className="text-slate-200 font-mono leading-relaxed">
                  {steps[activeStepTab].reactants || 'Not reported'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Reaction Conditions:
                </span>
                <span className="text-slate-200 leading-relaxed">
                  {steps[activeStepTab].conditions || 'Standard CROP conditions'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 sm:col-span-2">
                <span className="text-[11px] font-semibold text-teal-400 block mb-1">
                  Formed Active Species / Product:
                </span>
                <span className="text-teal-200 font-medium leading-relaxed">
                  {steps[activeStepTab].intermediates_or_products || 'Macro-cationic species'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                Mechanistic Description:
              </span>
              <p className="text-slate-300 leading-relaxed">
                {steps[activeStepTab].description}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 4. Polymerization Quality & Livingness Notes */}
      <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300">
        <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-200">Living CROP Character:</span> When properly dried solvents and purified monomers are used, initiation is rapid (k_i &ge; k_p), termination and chain transfer are negligible, and narrow Poisson molecular weight distributions (Đ &lt; 1.15) are achieved with predetermined degrees of polymerization (DP_n = [M]₀ / [I]₀).
        </div>
      </div>
    </div>
  );
}
