import json
import logging
from typing import Dict, Any, Optional
from google import genai
from google.genai import types
from app.core.config import settings
from app.models.schemas import ScientificSummary13Sections, ExperimentalValues, BibliographicInfo
from app.core.database import get_supabase_admin

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are an expert scientific analyst in polymer chemistry, specifically specializing in poly(2-oxazoline)s (POx), poly(2-oxazine)s (POzi), oxazoline/oxazine monomer synthesis, cationic ring-opening polymerization (CROP), stimuli-responsive polymers, and biomedical nanomaterials.

Analyze the provided scientific publication metadata and abstract. Generate a rigorous, structured scientific evaluation following the exact 13 sections required.

CRITICAL RULES:
1. NEVER FABRICATE DATA, experimental conditions, reaction temperatures, NMR signals, molecular weights, dispersities, or conclusions.
2. If an item is not explicitly reported in the provided text, you MUST state: "Not reported in the accessible source".
3. Strictly distinguish:
   - Directly reported findings from the authors
   - Your AI analytical interpretations
   - Suggested future research avenues
4. Extract numerical experimental metrics accurately, ensuring each reported figure corresponds strictly to what is stated.
5. In section 10 (Limitations), separate "author_reported_limitations" from "ai_inferred_limitations".
6. In chemical_structures and reaction_scheme, extract or infer authentic chemical structures (monomer SMILES, repeat unit, initiator, terminator) and CROP reaction mechanism steps (Initiation, Propagation, Termination with conditions and intermediates).
"""

FALLBACK_MODELS = [
    "gemini-3.1-flash-lite",
    "gemini-3.5-flash",
    "gemini-flash-latest",
    "gemini-3.8-flash"
]

async def generate_scientific_summary(
    paper: Dict[str, Any],
    model_name: Optional[str] = None
) -> Dict[str, Any]:
    """
    Calls Google Gemini using the google-genai SDK to generate a structured 13-section summary.
    Includes automated fallback across high-availability Gemini models.
    """
    primary_model = model_name or settings.GEMINI_MODEL or "gemini-2.5-flash"
    candidate_models = [primary_model] + [m for m in FALLBACK_MODELS if m != primary_model]
    
    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY) if settings.GEMINI_API_KEY else genai.Client()
    except Exception as init_err:
        raise ValueError(
            f"Could not initialize Google GenAI Client: {init_err}. Please set GEMINI_API_KEY in backend/.env"
        )
    
    title = paper.get("title", "Unknown Title")
    abstract = paper.get("abstract") or "No abstract text available in current record."
    authors = [a.get("name") for a in paper.get("authors", [])] if isinstance(paper.get("authors"), list) else []
    journal = paper.get("journal", "Unknown Journal")
    pub_year = paper.get("publication_year", "Unknown Year")
    doi = paper.get("doi", "Unknown DOI")
    landing_url = paper.get("landing_page_url", "")
    
    user_prompt = f"""
Publication to analyze:
- Full Title: {title}
- Authors: {", ".join(authors) if authors else 'Not listed'}
- Journal: {journal} ({pub_year})
- DOI: {doi}
- URL: {landing_url}

Abstract and Metadata:
{abstract}

Please generate the structured JSON matching the 13 required sections plus chemical structures and reaction scheme:
1. bibliographic_info (full_title, authors, journal, publication_year, doi, publication_link)
2. research_background
3. research_objective
4. research_gap
5. polymer_and_chemical_system (polymer_type, monomers, initiators, functional_groups, block_architecture, chemical_modifications, molecular_weight_dispersity)
   - chemical_structures:
     - monomers: list of objects with name, abbreviation, smiles, chemical_formula, role
     - polymer_repeat_unit: object with name, formula_or_smiles, backbone_type, side_chain
     - initiator_structure: object with name, smiles, type
     - terminator_structure: object with name, smiles, functional_group
   - reaction_scheme:
     - scheme_title: synthetic scheme title
     - overall_equation: reaction equation string with reactants, conditions, and product
     - mechanism_type: Cationic Ring-Opening Polymerization (CROP) or relevant mechanism
     - reaction_steps: list of sequential step objects each with step_number (integer), step_name, reactants, conditions, intermediates_or_products, description
     - polymer_architecture: Linear homopolymer, Diblock copolymer, etc.
     - initiator: initiator name
     - terminator_or_end_group: termination agent or end group
     - solvent_and_temperature: solvent and temperature string
6. experimental_methodology
7. characterization_techniques (list of techniques identified, e.g. NMR, GPC, DLS, etc.)
8. major_results
9. scientific_novelty
10. limitations (author_reported_limitations, ai_inferred_limitations)
11. future_research_opportunities (list of concrete next experiments)
12. relevance_to_pox_research
13. important_experimental_values (molecular_weight, dispersity, conversion, yield_percentage, cloud_point_lcst_ucst, particle_size, cmc, drug_loading, release_percentage, reaction_temperature_time, biological_activity)
"""

    last_error = None
    for model_candidate in candidate_models:
        try:
            logger.info(f"Attempting summary generation with model: {model_candidate}")
            response = client.models.generate_content(
                model=model_candidate,
                contents=user_prompt,
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_PROMPT,
                    response_mime_type="application/json",
                    temperature=0.1
                )
            )
            
            raw_text = response.text
            summary_dict = json.loads(raw_text)
            
            # Normalize list outputs for text fields
            string_fields = [
                "research_background", "research_objective", "research_gap",
                "experimental_methodology", "major_results", "scientific_novelty",
                "relevance_to_pox_research"
            ]
            for sf in string_fields:
                if isinstance(summary_dict.get(sf), list):
                    summary_dict[sf] = "\n".join(f"- {item}" for item in summary_dict[sf])
                    
            limits = summary_dict.get("limitations")
            if isinstance(limits, dict):
                for k in ["author_reported_limitations", "ai_inferred_limitations"]:
                    if isinstance(limits.get(k), list):
                        limits[k] = "\n".join(f"- {item}" for item in limits[k])

            # Normalize bibliographic_info
            bib_info = summary_dict.get("bibliographic_info")
            if isinstance(bib_info, dict):
                if isinstance(bib_info.get("authors"), str):
                    bib_info["authors"] = [a.strip() for a in bib_info["authors"].split(",") if a.strip()]
                if isinstance(bib_info.get("publication_year"), str):
                    try:
                        bib_info["publication_year"] = int("".join(c for c in bib_info["publication_year"] if c.isdigit())[:4])
                    except Exception:
                        bib_info["publication_year"] = None

            # Normalize important_experimental_values so all values are strings
            exp_vals = summary_dict.get("important_experimental_values")
            if isinstance(exp_vals, dict):
                for k, v in exp_vals.items():
                    if v is not None and not isinstance(v, str):
                        exp_vals[k] = str(v)
            elif not exp_vals:
                summary_dict["important_experimental_values"] = {}

            # Normalize characterization_techniques and future_research_opportunities
            if isinstance(summary_dict.get("characterization_techniques"), str):
                summary_dict["characterization_techniques"] = [
                    t.strip() for t in summary_dict["characterization_techniques"].split(",") if t.strip()
                ]
            if isinstance(summary_dict.get("future_research_opportunities"), str):
                summary_dict["future_research_opportunities"] = [summary_dict["future_research_opportunities"]]

            # Lift nested chemical_structures and reaction_scheme if inside polymer_and_chemical_system
            pcs = summary_dict.get("polymer_and_chemical_system")
            if isinstance(pcs, dict):
                if not summary_dict.get("chemical_structures") and pcs.get("chemical_structures"):
                    summary_dict["chemical_structures"] = pcs["chemical_structures"]
                if not summary_dict.get("reaction_scheme") and pcs.get("reaction_scheme"):
                    summary_dict["reaction_scheme"] = pcs["reaction_scheme"]

            # Normalize chemical_structures and reaction_scheme
            if not summary_dict.get("chemical_structures") or not isinstance(summary_dict.get("chemical_structures"), dict):
                summary_dict["chemical_structures"] = {}
            if not summary_dict.get("reaction_scheme") or not isinstance(summary_dict.get("reaction_scheme"), dict):
                summary_dict["reaction_scheme"] = {}
            
            # Validate through Pydantic schema
            validated_summary = ScientificSummary13Sections.model_validate(summary_dict)
            
            # Save to database if connected and paper has an ID
            supabase = get_supabase_admin()
            paper_id = paper.get("id")
            if supabase and paper_id:
                try:
                    supabase.table("paper_summaries").upsert({
                        "paper_id": paper_id,
                        "model_name": model_candidate,
                        "summary_json": validated_summary.model_dump(),
                        "source_content_type": "abstract_and_metadata"
                    }, on_conflict="paper_id").execute()
                except Exception as db_err:
                    logger.warning(f"Could not persist paper summary to Supabase: {db_err}")
                    
            return {
                "model_name": model_candidate,
                "summary": validated_summary.model_dump(),
                "source_content_type": "abstract_and_metadata"
            }
        except Exception as e:
            logger.warning(f"Model {model_candidate} generation failed: {e}. Retrying next available model...")
            last_error = e
            continue
            
    logger.error(f"All candidate Gemini models failed: {last_error}")
    raise last_error
