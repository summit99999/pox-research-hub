import json
import logging
from typing import Dict, Any, List
from fastapi import APIRouter, HTTPException, Depends
from google import genai
from google.genai import types
from app.core.config import settings
from app.core.database import get_supabase_admin
from app.core.security import get_current_user
from app.models.schemas import ReviewDraftRequest, ReviewDraftResponse

logger = logging.getLogger(__name__)
router = APIRouter()

REVIEW_PROMPT = """You are a senior polymer chemistry professor writing an authoritative literature review synthesis section on Poly(2-oxazoline) and Poly(2-oxazine) systems.

Analyze the provided publications and generate:
1. A structured literature review draft (Markdown format) with clear headings:
   - Introduction & Scientific Rationale
   - Synthetic Methodologies & Polymer Architectures
   - Key Properties (e.g. LCST/UCST, ROS-responsiveness, self-assembly)
   - Biomedical / Technological Performance
   - Comparative Critical Assessment
   - Open Challenges and Future Outlook
2. Strict DOI citations: Cite every paper with its exact DOI link [Author et al., Year](https://doi.org/DOI).
3. A comparative analysis matrix as a JSON list under key "comparison_table" containing objects with:
   - paper_title: str
   - doi: str
   - polymer_type: str
   - monomers_initiators: str
   - reported_mw_dispersity: str
   - stimuli_response_or_cloud_point: str
   - main_findings: str

CRITICAL RULES:
- Never fabricate citations or experimental numbers.
- If a property is not reported in the provided source, state "Not reported".
- Output valid JSON with keys: "review_markdown" and "comparison_table".
"""

FALLBACK_MODELS = [
    "gemini-3.1-flash-lite",
    "gemini-3.5-flash",
    "gemini-flash-latest",
    "gemini-3.8-flash"
]

@router.post("/draft", response_model=ReviewDraftResponse)
async def generate_review_draft(
    payload: ReviewDraftRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Synthesizes selected publications into a structured literature review draft and comparison matrix.
    """
    if not payload.paper_ids:
        raise HTTPException(status_code=400, detail="Please select at least one paper for the literature review.")

    supabase = get_supabase_admin()
    papers: List[Dict[str, Any]] = []
    
    if supabase:
        res = supabase.table("papers").select("id, title, abstract, journal, publication_year, doi").in_("id", payload.paper_ids).execute()
        papers = res.data or []

    if not papers:
        raise HTTPException(status_code=404, detail="Selected publications could not be retrieved from database.")

    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY) if settings.GEMINI_API_KEY else genai.Client()
    except Exception as init_err:
        raise HTTPException(status_code=503, detail=f"Gemini API is not configured: {init_err}")
    
    # Format papers for prompt
    papers_context = ""
    for idx, p in enumerate(papers):
        papers_context += f"\n--- Publication {idx+1} ---\nTitle: {p.get('title')}\nJournal: {p.get('journal')} ({p.get('publication_year')})\nDOI: {p.get('doi')}\nAbstract: {p.get('abstract')}\n"

    user_query = f"""
Review Topic: {payload.topic}
Review Title: {payload.title}

Selected Publications ({len(papers)} papers):
{papers_context}

Please generate the Markdown literature review and comparison matrix according to system instructions.
"""

    candidate_models = [settings.GEMINI_MODEL or "gemini-3.5-flash"] + [m for m in FALLBACK_MODELS if m != settings.GEMINI_MODEL]
    last_error = None

    for model_candidate in candidate_models:
        try:
            logger.info(f"Attempting review draft generation with model: {model_candidate}")
            response = client.models.generate_content(
                model=model_candidate,
                contents=user_query,
                config=types.GenerateContentConfig(
                    system_instruction=REVIEW_PROMPT,
                    response_mime_type="application/json",
                    temperature=0.2
                )
            )
            
            parsed = json.loads(response.text)
            review_md = parsed.get("review_markdown", "No review markdown generated.")
            comp_table = parsed.get("comparison_table", [])
            
            review_record_id = None
            user_id = current_user.get("id")
            if supabase and user_id:
                try:
                    save_res = supabase.table("literature_reviews").insert({
                        "user_id": user_id,
                        "title": payload.title,
                        "topic": payload.topic,
                        "paper_ids": payload.paper_ids,
                        "review_markdown": review_md,
                        "comparison_table_json": comp_table
                    }).execute()
                    if save_res.data:
                        review_record_id = save_res.data[0]["id"]
                except Exception as db_err:
                    logger.warning(f"Could not persist literature review record: {db_err}")

            return ReviewDraftResponse(
                id=review_record_id,
                title=payload.title,
                topic=payload.topic,
                paper_count=len(papers),
                review_markdown=review_md,
                comparison_table=comp_table
            )
        except Exception as e:
            logger.warning(f"Review synthesis with model {model_candidate} failed: {e}. Trying fallback...")
            last_error = e
            continue

    logger.error(f"All candidate Gemini models failed for review: {last_error}")
    raise HTTPException(status_code=500, detail=str(last_error))
