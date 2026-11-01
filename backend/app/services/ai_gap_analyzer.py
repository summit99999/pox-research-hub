import json
import logging
from typing import Dict, Any, List, Optional
from google import genai
from google.genai import types
from app.core.config import settings
from app.core.database import get_supabase_admin

logger = logging.getLogger(__name__)

GAP_SYSTEM_PROMPT = """You are a senior principal investigator and polymer chemistry architect specializing in poly(2-oxazoline)s, poly(2-oxazine)s, and related cyclic imino ethers.

Your mission is to perform systematic scientific research-gap discovery based on existing indexed publications.

MANDATORY RULES:
1. NEVER claim an idea is globally unprecedented or globally novel merely because the indexed corpus lacks it.
2. ALWAYS use scientifically responsible phrasing: "Potentially underexplored based on the currently indexed literature."
3. Every suggested gap must be grounded in realistic cationic ring-opening polymerization (CROP) chemistry, monomer stability, or biomedical formulation science.
4. Cite supporting papers provided in the context, including their titles and DOIs.
5. Provide actionable experimental strategies, potential synthetic hurdles, and analytical characterization pathways.
"""

async def analyze_research_gaps(
    focus_area: Optional[str] = "Poly(2-oxazoline) and Poly(2-oxazine) functional architectures",
    target_papers: Optional[List[Dict[str, Any]]] = None,
    user_id: Optional[str] = None
) -> Dict[str, Any]:
    """
    Executes an evidence-grounded research gap analysis using Google Gemini.
    """
    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY) if settings.GEMINI_API_KEY else genai.Client()
    except Exception as init_err:
        raise ValueError(
            f"Could not initialize Google GenAI Client: {init_err}. Please set GEMINI_API_KEY in backend/.env"
        )
    
    # Retrieve sample corpus from DB if target_papers is not provided
    supabase = get_supabase_admin()
    corpus_context: List[Dict[str, Any]] = []
    
    if target_papers:
        corpus_context = target_papers[:15]
    elif supabase:
        try:
            res = supabase.table("papers").select("id, title, abstract, journal, publication_year, doi").order("publication_year", desc=True).limit(15).execute()
            if res.data:
                corpus_context = res.data
        except Exception as e:
            logger.warning(f"Could not load papers for gap analysis: {e}")

    # Build prompt with indexed publications
    corpus_text = ""
    for idx, p in enumerate(corpus_context):
        corpus_text += f"\n[Paper {idx+1}] Title: {p.get('title')}\nJournal: {p.get('journal')} ({p.get('publication_year')})\nDOI: {p.get('doi')}\nAbstract snippet: {str(p.get('abstract', ''))[:300]}...\n"

    prompt = f"""
Focus Area: {focus_area}

Indexed Scientific Publications for Context:
{corpus_text if corpus_text else 'Representative modern literature on 2-oxazoline/2-oxazine synthesis, CROP kinetics, thermoresponsive polymers, ROS-responsive polymers, and micellar drug delivery.'}

Please analyze this literature and identify 3 to 5 high-impact, potentially underexplored research opportunities in POx/POzi chemistry.

Format your response as a valid JSON object with the key "gaps" containing an array of gap objects, each having:
- proposed_research_title: str
- existing_research_background: str
- what_is_already_known: str
- what_appears_to_be_missing: str
- supporting_publications: list of objects with "title" and "doi"
- scientific_rationale: str
- proposed_experimental_strategy: str
- expected_novelty: str
- potential_challenges: str
- recommended_characterization_techniques: list of str
- potential_journals_or_communities: list of str
- confidence_level: "High", "Medium", or "Exploratory"
- disclaimer: "Potentially underexplored based on the currently indexed literature."
"""

    try:
        response = client.models.generate_content(
            model=settings.GEMINI_MODEL or "gemini-flash-latest",
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=GAP_SYSTEM_PROMPT,
                response_mime_type="application/json",
                temperature=0.2
            )
        )
        
        parsed = json.loads(response.text)
        gaps = parsed.get("gaps", [])
        
        report_data = {
            "title": f"POx/POzi Research Gap Analysis: {focus_area}",
            "query_context": focus_area,
            "gaps": gaps
        }
        
        # Save to database if connected
        if supabase and user_id:
            try:
                save_res = supabase.table("research_gap_reports").insert({
                    "user_id": user_id,
                    "title": report_data["title"],
                    "query_context": focus_area,
                    "report_json": report_data
                }).execute()
                if save_res.data:
                    report_data["id"] = save_res.data[0]["id"]
            except Exception as db_err:
                logger.warning(f"Could not persist research gap report: {db_err}")
                
        return report_data
    except Exception as e:
        logger.error(f"Failed to generate gap analysis: {e}")
        raise
