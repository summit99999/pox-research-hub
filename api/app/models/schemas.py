from typing import List, Optional, Dict, Any, Union
from datetime import date, datetime
from pydantic import BaseModel, Field

# ------------------------------------------------------------------------------
# Author Models
# ------------------------------------------------------------------------------
class AuthorBase(BaseModel):
    name: str
    affiliation: Optional[str] = None
    orcid: Optional[str] = None
    external_author_id: Optional[str] = None

class AuthorResponse(AuthorBase):
    id: str
    created_at: Optional[datetime] = None

# ------------------------------------------------------------------------------
# Category Models
# ------------------------------------------------------------------------------
class CategoryBase(BaseModel):
    category_name: str
    slug: str
    description: Optional[str] = None
    display_order: int = 0

class CategoryResponse(CategoryBase):
    id: str

# ------------------------------------------------------------------------------
# Paper Models
# ------------------------------------------------------------------------------
class PaperBase(BaseModel):
    doi: Optional[str] = None
    title: str
    abstract: Optional[str] = None
    publication_year: Optional[int] = None
    publication_date: Optional[date] = None
    journal: Optional[str] = None
    publisher: Optional[str] = None
    landing_page_url: Optional[str] = None
    open_access_url: Optional[str] = None
    citation_count: int = 0
    source: str = "openalex"
    source_id: Optional[str] = None

class PaperCreate(PaperBase):
    doi_normalized: Optional[str] = None
    raw_metadata: Optional[Dict[str, Any]] = None
    authors: Optional[List[AuthorBase]] = None
    category_slugs: Optional[List[str]] = None

class PaperResponse(PaperBase):
    id: str
    doi_normalized: Optional[str] = None
    collected_at: datetime
    updated_at: datetime
    authors: List[AuthorResponse] = []
    categories: List[CategoryResponse] = []
    is_saved: Optional[bool] = False
    is_favourite: Optional[bool] = False
    reading_status: Optional[str] = None
    screening_status: Optional[str] = None
    has_summary: Optional[bool] = False

class PaperListResponse(BaseModel):
    items: List[PaperResponse]
    total: int
    page: int
    page_size: int
    total_pages: int

# ------------------------------------------------------------------------------
# AI Structured Scientific Summary (13 Sections)
# ------------------------------------------------------------------------------
class BibliographicInfo(BaseModel):
    full_title: str
    authors: List[str] = []
    journal: Optional[str] = None
    publication_year: Optional[int] = None
    doi: Optional[str] = None
    publication_link: Optional[str] = None

class ExperimentalValues(BaseModel):
    molecular_weight: Optional[str] = "Not reported in the accessible source"
    dispersity: Optional[str] = "Not reported in the accessible source"
    conversion: Optional[str] = "Not reported in the accessible source"
    yield_percentage: Optional[str] = "Not reported in the accessible source"
    cloud_point_lcst_ucst: Optional[str] = "Not reported in the accessible source"
    particle_size: Optional[str] = "Not reported in the accessible source"
    cmc: Optional[str] = "Not reported in the accessible source"
    drug_loading: Optional[str] = "Not reported in the accessible source"
    release_percentage: Optional[str] = "Not reported in the accessible source"
    reaction_temperature_time: Optional[str] = "Not reported in the accessible source"
    biological_activity: Optional[str] = "Not reported in the accessible source"

class ScientificSummary13Sections(BaseModel):
    # 1. Bibliographic Information
    bibliographic_info: BibliographicInfo
    
    # 2. Research Background
    research_background: Union[str, List[str]]
    
    # 3. Research Objective
    research_objective: Union[str, List[str]]
    
    # 4. Research Gap
    research_gap: Union[str, List[str]]
    
    # 5. Polymer and Chemical System
    polymer_and_chemical_system: Dict[str, Any] = Field(
        default_factory=lambda: {
            "polymer_type": "Not reported",
            "monomers": [],
            "initiators": "Not reported",
            "functional_groups": [],
            "block_architecture": "Not reported",
            "chemical_modifications": "Not reported",
            "molecular_weight_dispersity": "Not reported"
        }
    )

    # Chemical Structures (monomers, repeat unit, initiator, terminator)
    chemical_structures: Optional[Dict[str, Any]] = Field(
        default_factory=lambda: {
            "monomers": [],
            "polymer_repeat_unit": {},
            "initiator_structure": {},
            "terminator_structure": {}
        }
    )
    
    # Reaction Scheme & CROP Mechanism (overall equation, reaction steps, conditions)
    reaction_scheme: Optional[Dict[str, Any]] = Field(
        default_factory=lambda: {
            "scheme_title": "Synthetic Scheme & Polymerization Pathway",
            "overall_equation": "Not reported in the accessible source",
            "mechanism_type": "Cationic Ring-Opening Polymerization (CROP)",
            "reaction_steps": [],
            "polymer_architecture": "Not reported",
            "initiator": "Not reported",
            "terminator_or_end_group": "Not reported",
            "solvent_and_temperature": "Not reported"
        }
    )
    
    # 6. Experimental Methodology
    experimental_methodology: Union[str, List[str]]
    
    # 7. Characterization Techniques
    characterization_techniques: List[str] = []
    
    # 8. Major Results
    major_results: Union[str, List[str]]
    
    # 9. Scientific Novelty
    scientific_novelty: Union[str, List[str]]
    
    # 10. Limitations (explicitly distinguishing authors' reported limitations vs AI inferred)
    limitations: Dict[str, Any] = Field(
        default_factory=lambda: {
            "author_reported_limitations": "None stated in the accessible text",
            "ai_inferred_limitations": "Limited accessible data to full experimental section"
        }
    )
    
    # 11. Future Research Opportunities
    future_research_opportunities: List[str] = []
    
    # 12. Relevance to POx Research
    relevance_to_pox_research: Union[str, List[str]]
    
    # 13. Important Experimental Values
    important_experimental_values: ExperimentalValues

class SummaryResponse(BaseModel):
    id: str
    paper_id: str
    model_name: str
    summary: ScientificSummary13Sections
    source_content_type: str
    generated_at: datetime

# ------------------------------------------------------------------------------
# Research Gap Discovery Models
# ------------------------------------------------------------------------------
class ProposedResearchGap(BaseModel):
    proposed_research_title: str
    existing_research_background: str
    what_is_already_known: str
    what_appears_to_be_missing: str
    supporting_publications: List[Dict[str, str]] = []  # [{"title": ..., "doi": ...}]
    scientific_rationale: str
    proposed_experimental_strategy: str
    expected_novelty: str
    potential_challenges: str
    recommended_characterization_techniques: List[str] = []
    potential_journals_or_communities: List[str] = []
    confidence_level: str = "Medium" # High, Medium, Exploratory
    disclaimer: str = "Potentially underexplored based on the currently indexed literature."

class ResearchGapReportResponse(BaseModel):
    id: str
    title: str
    query_context: Optional[str] = None
    gaps: List[ProposedResearchGap]
    generated_at: datetime

class GenerateGapReportRequest(BaseModel):
    focus_area: Optional[str] = "Poly(2-oxazoline) and Poly(2-oxazine) chemistry"
    category_slugs: Optional[List[str]] = None
    target_applications: Optional[List[str]] = None

# ------------------------------------------------------------------------------
# Personal Library & Screening
# ------------------------------------------------------------------------------
class UserLibraryUpdate(BaseModel):
    favourite: Optional[bool] = None
    reading_status: Optional[str] = None # 'unread', 'in_progress', 'completed'
    personal_notes: Optional[str] = None
    tags: Optional[List[str]] = None

class ScreeningRecordUpdate(BaseModel):
    screening_status: str # 'included', 'excluded', 'maybe'
    screening_notes: Optional[str] = None

# ------------------------------------------------------------------------------
# Literature Review Workspace
# ------------------------------------------------------------------------------
class ReviewDraftRequest(BaseModel):
    title: str
    topic: str
    paper_ids: List[str]

class ReviewDraftResponse(BaseModel):
    id: Optional[str] = None
    title: str
    topic: str
    paper_count: int
    review_markdown: str
    comparison_table: List[Dict[str, Any]]
    verification_warning: str = (
        "AI-generated literature review text requires verification against the original peer-reviewed papers. "
        "Verify all chemical structures, reaction parameters, and statistical values before citation."
    )

# ------------------------------------------------------------------------------
# Analytics & Trends
# ------------------------------------------------------------------------------
class PublicationTrendPoint(BaseModel):
    year: int
    pox_count: int = 0
    pozi_count: int = 0
    total_count: int = 0

class CategoryCount(BaseModel):
    category_name: str
    slug: str
    count: int

class TopAuthor(BaseModel):
    name: str
    paper_count: int
    affiliation: Optional[str] = None

class TopJournal(BaseModel):
    journal: str
    paper_count: int

class AnalyticsOverviewResponse(BaseModel):
    total_papers: int
    papers_current_year: int
    pox_papers_count: int
    pozi_papers_count: int
    annual_trends: List[PublicationTrendPoint]
    category_breakdown: List[CategoryCount]
    top_authors: List[TopAuthor]
    top_journals: List[TopJournal]
    stimuli_responsive_growth: Dict[str, int] = {}

# ------------------------------------------------------------------------------
# Collection Control
# ------------------------------------------------------------------------------
class CollectionTriggerRequest(BaseModel):
    query: Optional[str] = None
    year_from: int = 2020
    year_to: int = 2026
    source: str = "openalex" # 'openalex', 'crossref', 'both'
    max_results: int = 50

class CollectionLogResponse(BaseModel):
    id: str
    source: str
    query: Optional[str] = None
    started_at: datetime
    completed_at: Optional[datetime] = None
    status: str
    records_found: int = 0
    records_saved: int = 0
    error_message: Optional[str] = None
