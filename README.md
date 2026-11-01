# POx Research Hub — Private Cloud-Based Scientific Literature Platform

> Dedicated to Poly(2-oxazoline), Poly(2-oxazine), Oxazoline Monomers, CROP Polymerization Chemistry, and Advanced Biomedical Applications (2020–2026+).

---

## 1. Architectural Overview

**POx Research Hub** is a full-stack, cloud-first scientific research platform engineered to systematically discover, organize, summarize, screen, and analyze peer-reviewed literature in oxazoline and oxazine polymer chemistry.

```
                      +------------------------------------------+
                      |         Vercel (React 19 + Vite)         |
                      |  POx Scientific Intelligence Dashboard   |
                      +--------------------+---------------------+
                                           |
                                      REST / JWT
                                           |
                      +--------------------+---------------------+
                      |           Render (FastAPI)               |
                      |    Literature Pipeline & AI Engine       |
                      +-------+-------------------+--------------+
                              |                   |
               +--------------+----+        +-----+---------------+
               |  Supabase Cloud   |        |   Cloud AI & APIs   |
               |  PostgreSQL + RLS |        | - Google Gemini AI  |
               |  Authentication   |        | - OpenAlex API      |
               |  Full-text Search |        | - Crossref API      |
               +-------------------+        +---------------------+
```

### Core Tenet: 100% Online Cloud Data Storage
- **Zero local database bloat**: All publication metadata, abstracts, DOI links, AI summaries, research gap reports, personal notes, and screening decisions reside permanently in **Supabase Cloud PostgreSQL**.
- **Permanent Availability**: When deployed, the platform operates independently of your local computer.
- **Copyright Compliance**: Stores metadata and abstracts legally under open-access terms and links directly to official publisher DOI landing pages and open-access PDFs.

---

## 2. Research Scope

Covers scientific publications from **2020 onward through 2026+**:
1. **Poly(2-oxazoline) (POx) Chemistry**: PMOx, PEtOx, PiPrOx, PnPrOx, PBuOx, PPhOx, block copolymers, stimuli-responsive micelles.
2. **Poly(2-oxazine) (POzi) Chemistry**: Six-membered cyclic imino ethers, PMOzi, PEtOzi, POx/POzi comparative kinetics and phase behavior.
3. **Oxazoline Monomer Synthesis**: 2-substituted oxazolines, functional monomers, thiol-functional, ester-functional, photoresponsive, and amino-acid derivatives.
4. **Polymerization Chemistry**: Cationic Ring-Opening Polymerization (CROP), living/pseudo-living kinetics, initiator development, termination chemistry, molecular weight ($M_n$) and dispersity ($Đ$) control.
5. **Applications**: Targeted drug delivery, gene/mRNA polyplexes, ROS-responsive oxidation switches, LCST/UCST thermoresponsiveness, hydrogels, antimicrobials, and tissue engineering.

---

## 3. Technology Stack

- **Backend**: Python 3.12+, FastAPI, Pydantic v2, HTTPX, `google-genai` SDK, `supabase` client.
- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, Recharts.
- **Database**: Supabase PostgreSQL with `pg_trgm`, `tsvector` full-text search, Row Level Security (RLS).
- **Authentication**: Supabase Auth (JWT tokens, secure user library, personal screening).
- **AI Engine**: Google Gemini (`gemini-2.5-flash` or `gemini-1.5-pro`) backend-only integration.
- **Scientific Literature Sources**: OpenAlex API & Crossref API (Polite Pool integration).
- **Cloud Schedulers**: GitHub Actions & Render Cron for autonomous weekly literature updates.

---

## 4. Database Schema Structure (`supabase/schema.sql`)

The PostgreSQL schema contains 12 normalized tables with full RLS:
1. `papers`: Primary corpus with normalized DOIs, abstracts, citations, full-text vector index.
2. `authors`: Researcher names, affiliations, ORCID IDs.
3. `paper_authors`: Many-to-many junction preserving authorship order.
4. `categories`: 17 scientific domains (Monomer Synthesis, CROP Kinetics, ROS-Responsive, etc.).
5. `paper_categories`: Junction with confidence scores and source tags (`keyword_rule`, `ai_gemini`, `manual`).
6. `paper_summaries`: Rigorous 13-section AI summaries in JSONB format.
7. `user_library`: Private reading lists, favourites, personal notes, and custom tags.
8. `screening_records`: Systematic review screening decisions (`included`, `excluded`, `maybe`).
9. `search_history`: User query audit trail with filters.
10. `collection_logs`: Telemetry tracking OpenAlex/Crossref queries and records saved.
11. `research_gap_reports`: Grounded POx/POzi research gap analyses.
12. `literature_reviews`: Draft synthesis markdown and comparative properties matrices.

---

## 5. Local Setup & Development

### Prerequisites
- Python 3.12+
- Node.js 18+ & npm

### A. Backend Setup
```bash
# Navigate to backend and activate virtual environment
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
# source venv/bin/activate # Linux/macOS

# Install dependencies
pip install -r requirements.txt

# Copy environment template
copy .env.example .env

# Run automated test suite
pytest tests

# Start FastAPI development server
uvicorn app.main:app --reload --port 8000
```
Backend API will be accessible at: `http://localhost:8000` (Swagger docs at `/docs`).

### B. Frontend Setup
```bash
# In a separate terminal, navigate to frontend
cd frontend
npm install

# Copy environment template
copy .env.example .env

# Run Vite development server
npm run dev
```
Frontend UI will be accessible at: `http://localhost:5173`.

---

## 6. Cloud Services Setup Guide

### Step 1: Supabase Cloud Database & Auth
1. Go to [https://supabase.com](https://supabase.com) and create a new project.
2. Open the **SQL Editor** tab in the left sidebar.
3. Copy the entire contents of `supabase/schema.sql` and run it in the SQL Editor.
4. Go to **Project Settings → API** and copy:
   - `Project URL`
   - `anon public` key
   - `service_role` secret (keep this secret!)
5. Put them into `backend/.env` and `frontend/.env`.

### Step 2: Google Gemini AI Key
1. Go to [https://aistudio.google.com](https://aistudio.google.com) and create an API key.
2. In `backend/.env`, set:
   ```env
   GEMINI_API_KEY=AIzaSy...
   GEMINI_MODEL=gemini-2.5-flash
   ```

### Step 3: Scientific APIs Polite Pool
Set your email in `backend/.env` for OpenAlex and Crossref. This grants fast, unthrottled API access:
```env
OPENALEX_EMAIL=your-email@domain.com
CROSSREF_EMAIL=your-email@domain.com
```

---

## 7. Cloud Deployment Guide

### Deploy Backend to Render
1. Push your repository to GitHub.
2. In [Render Dashboard](https://dashboard.render.com), click **New + → Web Service**.
3. Connect your GitHub repository.
4. Set:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add Environment Variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GEMINI_API_KEY`
   - `GEMINI_MODEL`
   - `CRON_SECRET` (generate a random 32-character token)
   - `CORS_ORIGINS`: your Vercel frontend URL.

### Deploy Frontend to Vercel
1. In [Vercel Dashboard](https://vercel.com), click **Add New → Project**.
2. Select your repository.
3. Set:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
4. Add Environment Variables:
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key
   - `VITE_API_BASE_URL`: Your Render backend URL (e.g. `https://pox-research-hub-api.onrender.com`)
5. Click **Deploy**.

### Automated Weekly Literature Collection
Configure GitHub Actions repository secrets in GitHub:
- `POX_BACKEND_URL`: `https://your-render-backend.onrender.com`
- `CRON_SECRET`: The matching secret set on Render.

The workflow defined in `.github/workflows/weekly_literature_collection.yml` will automatically query OpenAlex and Crossref every Sunday at 02:00 UTC, deduplicate DOIs, categorize new papers, and save them online.

---

## 8. 13-Section AI Scientific Evaluation (Section 7)

Every publication summary adheres to the 13 required sections:
1. **Bibliographic Reference**: Title, authors, journal, year, DOI.
2. **Research Background**: Scientific motivation and context.
3. **Research Objective**: Primary experimental goal.
4. **Addressed Research Gap**: Limitation identified in literature.
5. **Polymer & Chemical System**: Monomers, initiators, architecture, molecular weight ($M_n$), dispersity ($Đ$).
6. **Experimental Methodology**: Solvents, reaction conditions, temperatures, times.
7. **Characterization Techniques**: NMR, FTIR, SEC/GPC, MALDI-TOF, DLS, TEM, DSC, TGA, etc.
8. **Major Results**: Core experimental findings.
9. **Scientific Novelty**: Distinct advances over previous reports.
10. **Limitations**: Explicitly distinguishes author-reported constraints from AI-inferred limits.
11. **Future Research Directions**: Concrete proposed next experiments.
12. **Relevance to POx Research**: Contribution to cyclic imino ether polymer science.
13. **Extracted Experimental Metrics**: Numerical values for $M_n$, $Đ$, yields, LCST/UCST cloud points, particle sizes, CMC, drug loadings, and release percentages.

---

## 9. Security & Access Control

- **JWT Authentication**: Passwords and tokens managed via Supabase Auth.
- **Row Level Security**: Personal notes, screening statuses, and saved library items are strictly isolated by `auth.uid() = user_id`.
- **Secret Isolation**: `GEMINI_API_KEY` and Supabase `service_role` keys are strictly server-side and never exposed in client bundles.
- **Rate-Limited Collection**: Protected by `CRON_SECRET` header for cloud automation.
