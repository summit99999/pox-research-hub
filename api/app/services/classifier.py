import re
from typing import List, Dict, Any, Tuple, Optional

CATEGORY_RULES: Dict[str, Dict[str, Any]] = {
    "monomer-synthesis": {
        "name": "Monomer Synthesis",
        "keywords": [
            "monomer synthesis", "2-oxazoline monomer", "2-oxazine monomer",
            "synthesis of 2-substituted", "thiol-containing oxazoline",
            "ester-functional", "amino-acid-derived oxazoline", "oxazoline monomer",
            "monomer preparation", "functional oxazoline monomer", "monomer", "monomers"
        ],
        "weight": 1.5
    },
    "polymer-synthesis": {
        "name": "Polymer Synthesis",
        "keywords": [
            "polymer synthesis", "polymerization", "poly(2-oxazoline) synthesis",
            "homopolymer", "microwave-assisted polymerization", "living cationic"
        ],
        "weight": 1.0
    },
    "crop-kinetics": {
        "name": "CROP & Polymerization Kinetics",
        "keywords": [
            "cationic ring-opening", "crop", "living polymerization",
            "pseudo-living", "initiator", "termination chemistry",
            "chain transfer", "kinetic study", "kinetics", "dispersity control",
            "molecular weight control", "propagation rate", "monomer conversion"
        ],
        "weight": 1.4
    },
    "functionalization": {
        "name": "Functionalization",
        "keywords": [
            "end-group functionalization", "post-polymerization modification",
            "post-polymerization", "click chemistry", "bio-click", "thiol-ene",
            "side-chain modification", "functionalized polyoxazoline",
            "bioconjugation", "grafting", "functionalization"
        ],
        "weight": 1.2
    },
    "block-copolymers": {
        "name": "Block Copolymers",
        "keywords": [
            "block copolymer", "diblock", "triblock", "multiblock",
            "gradient copolymer", "star polymer", "amphiphilic block",
            "poly(2-oxazoline) block"
        ],
        "weight": 1.2
    },
    "thermoresponsive": {
        "name": "Thermoresponsive Polymers",
        "keywords": [
            "thermoresponsive", "temperature-responsive", "temperature sensitive",
            "thermal transition", "phase transition"
        ],
        "weight": 1.2
    },
    "ucst-lcst": {
        "name": "UCST / LCST Behavior",
        "keywords": [
            "lcst", "ucst", "cloud point", "lower critical solution",
            "upper critical solution", "turbidity", "cloud point temperature"
        ],
        "weight": 1.5
    },
    "ros-responsive": {
        "name": "ROS-Responsive Polymers",
        "keywords": [
            "ros-responsive", "reactive oxygen species", "thioether",
            "hydrogen peroxide", "oxidation-responsive", "ros-sensitive",
            "h2o2-responsive"
        ],
        "weight": 1.6
    },
    "photoresponsive": {
        "name": "Photoresponsive Polymers",
        "keywords": [
            "photoresponsive", "light-responsive", "photopolymerization",
            "photocleavable", "uv-vis responsive", "photodynamic",
            "photosensitizer", "photo-crosslinking"
        ],
        "weight": 1.5
    },
    "drug-delivery": {
        "name": "Drug Delivery",
        "keywords": [
            "drug delivery", "polymeric micelle", "drug formulation",
            "paclitaxel", "curcumin", "solubilization", "controlled release",
            "nanomedicine", "drug loading", "anticancer", "doxorubicin"
        ],
        "weight": 1.2
    },
    "gene-delivery": {
        "name": "Gene Delivery",
        "keywords": [
            "gene delivery", "polyplex", "dna complexation", "sirna",
            "mrna", "nucleic acid delivery", "transfection", "pdna"
        ],
        "weight": 1.6
    },
    "biomedical-applications": {
        "name": "Biomedical Applications",
        "keywords": [
            "antimicrobial", "tissue engineering", "antifouling",
            "biocompatibility", "cytotoxicity", "in vivo", "biomedical",
            "cellular uptake", "antibacterial"
        ],
        "weight": 1.1
    },
    "hydrogels": {
        "name": "Hydrogels",
        "keywords": [
            "hydrogel", "crosslinked hydrogel", "cryogel", "swelling ratio",
            "scaffold", "wound healing", "3d network", "injectable hydrogel"
        ],
        "weight": 1.4
    },
    "nanomaterials": {
        "name": "Nanomaterials",
        "keywords": [
            "nanoparticle", "nanomaterial", "polymersome", "nano-assembly",
            "micelle", "nanocapsule", "self-assembly", "nanostructures"
        ],
        "weight": 1.1
    },
    "poly-2-oxazine": {
        "name": "Poly(2-oxazine)",
        "keywords": [
            "poly(2-oxazine)", "poly(oxazine)", "pozi", "2-oxazine",
            "oxazine monomer", "poly(2-methyl-2-oxazine)", "poly(2-ethyl-2-oxazine)",
            "poly(2-propyl-2-oxazine)", "6-membered cyclic imino ether"
        ],
        "weight": 1.8
    },
    "computational-theoretical": {
        "name": "Computational & Theoretical Studies",
        "keywords": [
            "molecular dynamics", "dft", "density functional",
            "simulation", "computational", "in silico", "coarse-grained",
            "quantum chemical"
        ],
        "weight": 1.4
    },
    "other-polymer-chemistry": {
        "name": "Other Related Polymer Chemistry",
        "keywords": [
            "cyclic imino ether", "degradable polymer", "polyamide",
            "sustainable polymer", "ring-opening"
        ],
        "weight": 0.8
    }
}

def classify_paper(title: str, abstract: Optional[str] = None) -> List[Tuple[str, float]]:
    """
    Classifies a paper based on title and abstract text against the 17 scientific categories.
    Returns a list of tuples: (category_slug, confidence_score between 0.0 and 1.0)
    ordered by confidence score descending.
    """
    matches: List[Tuple[str, float]] = []
    
    for slug, info in CATEGORY_RULES.items():
        score = 0.0
        matched_keywords = 0
        for kw in info["keywords"]:
            pattern = r'\b' + re.escape(kw) + r'(?:s|es)?\b'
            title_hits = len(re.findall(pattern, (title or '').lower()))
            abstract_hits = len(re.findall(pattern, (abstract or '').lower()))
            
            if title_hits > 0 or abstract_hits > 0:
                matched_keywords += 1
                score += (title_hits * 3.0 + abstract_hits * 1.0)
                
        if matched_keywords > 0:
            weighted_score = score * info["weight"]
            # Normalize confidence to [0.50, 0.99]
            confidence = min(0.99, 0.50 + (0.10 * matched_keywords) + (0.02 * weighted_score))
            matches.append((slug, round(confidence, 3)))
            
    # Default to "Polymer Synthesis" if no specific match
    if not matches:
        matches.append(("polymer-synthesis", 0.600))
        
    # Sort descending by confidence
    matches.sort(key=lambda x: x[1], reverse=True)
    return matches
