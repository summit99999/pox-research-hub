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
"""

async def generate_scientific_summary(
    paper: Dict[str, Any],
    model_name: Optional[str] = None
) -> Dict[str, Any]:
    """
    Calls Google Gemini using the google-genai SDK to generate a structured 13-section summary.
    """
    active_model = model_name or settings.GEMINI_MODEL or "gemini-2.5-flash"
    
    if not settings.GEMINI_API_KEY:
        raise ValueError(
            "GEMINI_API_KEY is not configured. Please provide a valid Gemini API key in your environment."
        )

    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    
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

Please generate the structured JSON matching the 13 required sections:
1. bibliographic_info (full_title, authors, journal, publication_year, doi, publication_link)
2. research_background
3. research_objective
4. research_gap
5. polymer_and_chemical_system (polymer_type, monomers, initiators, functional_groups, block_architecture, chemical_modifications, molecular_weight_dispersity)
6. experimental_methodology
7. characterization_techniques (list of techniques identified, e.g. NMR, GPC, DLS, etc.)
8. major_results
9. scientific_novelty
10. limitations (author_reported_limitations, ai_inferred_limitations)
11. future_research_opportunities (list of concrete next experiments)
12. relevance_to_pox_research
13. important_experimental_values (molecular_weight, dispersity, conversion, yield_percentage, cloud_point_lcst_ucst, particle_size, cmc, drug_loading, release_percentage, reaction_temperature_time, biological_activity)
"""

    try:
        response = client.models.generate_content(
            model=active_model,
            contents=user_prompt,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                response_mime_type="application/json",
                temperature=0.1
            )
        )
        
        raw_text = response.text
        summary_dict = json.loads(raw_text)
        
        # Validate through Pydantic schema
        validated_summary = ScientificSummary13Sections.model_validate(summary_dict)
        
        # Save to database if connected and paper has an ID
        supabase = get_supabase_admin()
        paper_id = paper.get("id")
        if supabase and paper_id:
            try:
                supabase.table("paper_summaries").upsert({
                    "paper_id": paper_id,
                    "model_name": active_model,
                    "summary_json": validated_summary.model_dump(),
                    "source_content_type": "abstract_and_metadata"
                }, on_conflict="paper_id").execute()
            except Exception as db_err:
                logger.warning(f"Could not persist paper summary to Supabase: {db_err}")
                
        return {
            "model_name": active_model,
            "summary": validated_summary.model_dump(),
            "source_content_type": "abstract_and_metadata"
        }
        
    except Exception as e:
        logger.error(f"Failed to generate summary with Gemini: {e}")
        raise
