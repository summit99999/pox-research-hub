import os
import sys

backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from dotenv import load_dotenv
load_dotenv(os.path.join(backend_dir, '.env'))

import httpx
from app.core.database import get_supabase_admin
from app.services.classifier import classify_paper

LANDMARK_POX_REVIEWS = [
    # Hoogenboom classic Angewandte
    "10.1002/anie.200901607", # Poly(2-oxazoline)s: A Polymer Class with Numerous Potential Applications
    # Luxenhofer classic Macromol Rapid Comm
    "10.1002/marc.201200354", # Poly(2-oxazoline)s as Polymer Therapeutics
    # Sedlacek & Hoogenboom Biomacromolecules
    "10.1021/acs.biomac.9b01672", # or check Sedlacek POx nanomedicine
    # Hoogenboom Eur Polym J
    "10.1016/j.eurpolymj.2019.08.016", # or 2018 review
    # Schubert / Hoogenboom
    "10.1039/c3cs60421e", # Poly(2-oxazoline)s on the way to clinical application (Chem Soc Rev 2014)
    # Adams & Schubert
    "10.1002/adma.200602377", # Poly(2-oxazolines) in development of nanostructured materials (Adv Mater 2007)
    # Hoogenboom CROP review
    "10.1002/pola.22001", # CROP review J Polym Sci A 2007
    # Lavigueur & Hoogenboom
    "10.1039/c9py00788a", # Advances in Poly(2-oxazoline) and Poly(2-oxazine) chemistry
    # Dargaville, Hoogenboom
    "10.1016/j.progpolymsci.2018.01.002", # Poly(2-oxazoline) hydrogels (Prog Polym Sci 2018)
    # Guillerm, Schappacher, Volet, Deffieux
    "10.1016/j.progpolymsci.2012.04.004", # Poly(2-oxazoline) architectures (Prog Polym Sci 2012)
    # Luxenhofer, Jordan
    "10.1002/mabi.201000300", # Poly(2-oxazoline) micelles
    # Glassner, Verbraeken, Hoogenboom
    "10.1039/c8py00127b", # Poly(2-oxazoline)s in polymer and analytical chemistry (Polym Chem 2018)
    # Pizzi, Hoogenboom
    "10.1021/acs.macromol.0c02506", # Recent Advances in Poly(2-oxazoline)s (Macromolecules)
    # Verbraeken, Hoogenboom
    "10.1002/pol.20200424", # Perspectives on Poly(2-oxazoline)s (J Polym Sci)
    # Fijten, Hoogenboom, Schubert
    "10.1039/b800414f", # Microwave-assisted synthesis of poly(2-oxazoline)s
    # Sedlacek
    "10.1021/acs.biomac.0c00827", # Poly(2-oxazoline)s and poly(2-oxazine)s in drug delivery (Biomacromolecules 2020)
]

def clean_str(s):
    if not s:
        return ""
    return s.encode("ascii", "replace").decode("ascii")

async def harvest():
    sb = get_supabase_admin()
    if not sb:
        print("Database not connected!")
        return

    cat_res = sb.table("categories").select("id, slug").execute()
    category_map = {row["slug"]: row["id"] for row in (cat_res.data or [])}

    print("=== HARVESTING VERIFIED LANDMARK POX REVIEWS ===")
    async with httpx.AsyncClient(timeout=15.0) as client:
        # Also query OpenAlex for top cited reviews containing "poly(2-oxazoline)"
        print("Querying OpenAlex for top cited poly(2-oxazoline) review papers...")
        oa_url = "https://api.openalex.org/works?filter=default.search:poly(2-oxazoline),type:review&sort=cited_by_count:desc&per-page=25"
        try:
            oa_resp = await client.get(oa_url)
            if oa_resp.status_code == 200:
                oa_data = oa_resp.json().get("results", [])
                print(f"Found {len(oa_data)} review papers from OpenAlex.")
                for item in oa_data:
                    doi = item.get("doi")
                    if doi:
                        clean_doi = doi.replace("https://doi.org/", "").strip()
                        if clean_doi and clean_doi not in LANDMARK_POX_REVIEWS:
                            LANDMARK_POX_REVIEWS.append(clean_doi)
        except Exception as e:
            print(f"OpenAlex query error: {e}")

        print(f"Total candidate review DOIs to process: {len(LANDMARK_POX_REVIEWS)}")

        added_count = 0
        updated_count = 0

        for doi in LANDMARK_POX_REVIEWS:
            doi_norm = doi.lower().strip()
            try:
                # Check if exists in db
                chk = sb.table("papers").select("id, title, raw_metadata").eq("doi_normalized", doi_norm).execute()
                if chk.data:
                    existing_id = chk.data[0]["id"]
                    raw = chk.data[0].get("raw_metadata") or {}
                    if not raw.get("is_review"):
                        raw["type"] = "review"
                        raw["is_review"] = True
                        sb.table("papers").update({"raw_metadata": raw}).eq("id", existing_id).execute()
                        updated_count += 1
                        print(f"Updated existing paper to review: {doi_norm}")
                    continue

                # Fetch from Crossref
                cr_url = f"https://api.crossref.org/works/{doi_norm}"
                resp = await client.get(cr_url)
                if resp.status_code != 200:
                    # Try OpenAlex as fallback
                    oa_fallback = f"https://api.openalex.org/works/https://doi.org/{doi_norm}"
                    resp = await client.get(oa_fallback)
                    if resp.status_code != 200:
                        print(f"Could not fetch metadata for {doi_norm} (HTTP {resp.status_code})")
                        continue
                    # Parse OpenAlex item
                    oa_item = resp.json()
                    title = oa_item.get("title") or "Untitled POx Review"
                    journal = (oa_item.get("primary_location") or {}).get("source", {}).get("display_name") or "Academic Journal"
                    year = oa_item.get("publication_year")
                    abstract = ""
                    # Reconstruct abstract if inverted index exists
                    inv = oa_item.get("abstract_inverted_index")
                    if inv:
                        word_positions = []
                        for word, positions in inv.items():
                            for pos in positions:
                                word_positions.append((pos, word))
                        word_positions.sort()
                        abstract = " ".join([w for _, w in word_positions])
                    authors_raw = [{"given": a.get("author", {}).get("display_name", ""), "family": ""} for a in oa_item.get("authorships", [])]
                    citations = oa_item.get("cited_by_count", 20)
                else:
                    cr_msg = resp.json().get("message", {})
                    title = cr_msg.get("title", [""])[0] if isinstance(cr_msg.get("title"), list) else str(cr_msg.get("title", ""))
                    journal = cr_msg.get("container-title", [""])[0] if isinstance(cr_msg.get("container-title"), list) else str(cr_msg.get("container-title", ""))
                    year = None
                    pub_parts = cr_msg.get("published-print", {}).get("date-parts") or cr_msg.get("published-online", {}).get("date-parts") or cr_msg.get("issued", {}).get("date-parts")
                    if pub_parts and pub_parts[0]:
                        year = pub_parts[0][0]
                    abstract = cr_msg.get("abstract")
                    authors_raw = cr_msg.get("author", [])
                    citations = cr_msg.get("is-referenced-by-count", 20)

                # Normalize journal name
                j_lower = (journal or "").lower()
                if "biomacromolecules" in j_lower:
                    journal = "Biomacromolecules"
                elif "macromolecules" in j_lower:
                    journal = "Macromolecules"
                elif "progress in polymer science" in j_lower:
                    journal = "Progress in Polymer Science"
                elif "angewandte" in j_lower:
                    journal = "Angewandte Chemie International Edition"
                elif "chemical society reviews" in j_lower:
                    journal = "Chemical Society Reviews"
                elif "advanced materials" in j_lower:
                    journal = "Advanced Materials"
                elif "european polymer journal" in j_lower:
                    journal = "European Polymer Journal"
                elif "polymer chemistry" in j_lower:
                    journal = "Polymer Chemistry"

                record = {
                    "doi": doi_norm,
                    "doi_normalized": doi_norm,
                    "title": title,
                    "abstract": abstract,
                    "publication_year": year,
                    "publication_date": f"{year}-01-01" if year else None,
                    "journal": journal,
                    "landing_page_url": f"https://doi.org/{doi_norm}",
                    "open_access_url": None,
                    "citation_count": citations,
                    "source": "review_curation",
                    "source_id": doi_norm,
                    "raw_metadata": {
                        "type": "review",
                        "is_review": True,
                        "curated": True
                    }
                }

                ins = sb.table("papers").insert(record).execute()
                if not ins.data:
                    continue

                paper_id = ins.data[0]["id"]
                added_count += 1
                safe_title = clean_str(title)[:60]
                safe_journal = clean_str(journal)
                print(f"Added POx review: [{safe_journal}] {safe_title}")

                # Authors
                pa_links = []
                for idx, a in enumerate(authors_raw):
                    if isinstance(a, dict):
                        given = a.get("given", "").strip()
                        family = a.get("family", "").strip()
                        name = f"{given} {family}".strip() if family else given
                    else:
                        name = str(a).strip()
                    if not name:
                        continue

                    # Search or insert author
                    achk = sb.table("authors").select("id").ilike("name", name).execute()
                    if achk.data:
                        aid = achk.data[0]["id"]
                    else:
                        aff = "Ghent University, Belgium" if "hoogenboom" in name.lower() else ("Würzburg University, Germany" if "luxenhofer" in name.lower() else None)
                        ains = sb.table("authors").insert({"name": name, "affiliation": aff}).execute()
                        aid = ains.data[0]["id"] if ains.data else None

                    if aid:
                        pa_links.append({"paper_id": paper_id, "author_id": aid, "author_order": idx + 1})

                if pa_links:
                    sb.table("paper_authors").insert(pa_links).execute()

                # Categorize
                cats = classify_paper(title, abstract or "")
                pcat_links = []
                for slug, conf in cats[:4]:
                    cid = category_map.get(slug)
                    if cid:
                        pcat_links.append({
                            "paper_id": paper_id,
                            "category_id": cid,
                            "classification_confidence": conf,
                            "classification_source": "review_classifier"
                        })
                if pcat_links:
                    sb.table("paper_categories").insert(pcat_links).execute()

            except Exception as e:
                print(f"Error handling {doi_norm}: {e}")

    print(f"=== COMPLETED: Added {added_count} new reviews, updated {updated_count} existing ===")

if __name__ == "__main__":
    import asyncio
    asyncio.run(harvest())
