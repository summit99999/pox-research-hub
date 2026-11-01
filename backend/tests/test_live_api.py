import sys, os
sys.stdout.reconfigure(encoding='utf-8')
from dotenv import load_dotenv

# Load env before importing app
load_dotenv('backend/.env')

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

print("--- Testing Live Endpoints ---")

# 1. Health
h_res = client.get("/api/health")
print(f"1. /api/health -> Status: {h_res.status_code}, Body: {h_res.json()}")
assert h_res.status_code == 200

# 2. Categories
c_res = client.get("/api/v1/categories")
categories = c_res.json()
print(f"2. /api/v1/categories -> Status: {c_res.status_code}, Categories count: {len(categories)}")
assert c_res.status_code == 200
assert len(categories) > 0

# 3. Papers Listing
p_res = client.get("/api/v1/papers?per_page=5")
papers_data = p_res.json()
print(f"3. /api/v1/papers -> Status: {p_res.status_code}, Total in DB: {papers_data.get('total')}, Returned: {len(papers_data.get('items', []))}")
assert p_res.status_code == 200
assert len(papers_data.get("items", [])) > 0
first_paper = papers_data["items"][0]
first_paper_id = first_paper["id"]

# 4. Single Paper Details
sp_res = client.get(f"/api/v1/papers/{first_paper_id}")
print(f"4. /api/v1/papers/{first_paper_id} -> Status: {sp_res.status_code}, Title: {sp_res.json().get('title')[:60]}...")
assert sp_res.status_code == 200

# 5. Analytics Overview
ao_res = client.get("/api/v1/analytics/overview")
print(f"5. /api/v1/analytics/overview -> Status: {ao_res.status_code}")
assert ao_res.status_code == 200
data = ao_res.json()
print(f"   Total papers: {data.get('total_papers')}, Categories: {len(data.get('category_breakdown', []))}")

# 6. CSV Export (GET and POST)
csv_res = client.get("/api/v1/export/csv")
print(f"6. /api/v1/export/csv (GET) -> Status: {csv_res.status_code}, Length: {len(csv_res.text)}")
assert csv_res.status_code == 200
assert "Title,DOI,Year" in csv_res.text or "title,doi,publication_year" in csv_res.text.lower()

csv_post = client.post("/api/v1/export/csv", json={"paper_ids": [first_paper_id]})
print(f"   /api/v1/export/csv (POST) -> Status: {csv_post.status_code}")
assert csv_post.status_code == 200

# 7. BibTeX Export (GET and POST)
bib_res = client.get("/api/v1/export/bibtex")
print(f"7. /api/v1/export/bibtex (GET) -> Status: {bib_res.status_code}, Length: {len(bib_res.text)}")
assert bib_res.status_code == 200
assert "@article{" in bib_res.text

bib_post = client.post("/api/v1/export/bibtex", json={"paper_ids": [first_paper_id]})
print(f"   /api/v1/export/bibtex (POST) -> Status: {bib_post.status_code}")
assert bib_post.status_code == 200

# 8. Category Filter Search
first_cat_slug = categories[0]["slug"]
filt_res = client.get(f"/api/v1/papers?category_slug={first_cat_slug}&per_page=5")
print(f"8. /api/v1/papers?category_slug={first_cat_slug} -> Status: {filt_res.status_code}, Matched: {filt_res.json().get('total')}")
assert filt_res.status_code == 200

# 9. Existing 13-Section AI Summary check
sum_paper = client.get(f"/api/v1/summaries/{first_paper_id}")
print(f"9. /api/v1/summaries/{first_paper_id} -> Status: {sum_paper.status_code}")
assert sum_paper.status_code == 200
s_data = sum_paper.json()
summary_obj = s_data.get("summary", {})
print(f"   Summary retrieved successfully!")
print(f"   Model used: {s_data.get('model_name')}")
print(f"   Bibliographic: {summary_obj.get('bibliographic_information', {}).get('title')}")
print(f"   Research Objective: {summary_obj.get('research_objective')[:100]}...")
print(f"   Novelty: {summary_obj.get('scientific_novelty')[:100]}...")

print("\nALL LIVE ENDPOINT TESTS PASSED SUCCESSFULLY!")
