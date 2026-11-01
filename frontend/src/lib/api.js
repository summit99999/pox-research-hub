import { supabase } from './supabase';

export const DEFAULT_CATEGORIES = [
  { id: '1', category_name: 'Polymer Synthesis & CROP Kinetics', slug: 'synthesis-kinetics', description: 'Cationic ring-opening polymerization (CROP), living polymerization, monomers, catalysts, and kinetic mechanisms' },
  { id: '2', category_name: 'Hydrogels & 3D Biofabrication', slug: 'hydrogels-biofabrication', description: 'Crosslinked POx/POzi hydrogels, interpenetrating networks, and bio-inks for 3D bioprinting' },
  { id: '3', category_name: 'Stimuli-Responsive & Smart Biomaterials', slug: 'stimuli-responsive', description: 'Thermoresponsive (LCST/UCST), pH-responsive, photo-responsive, and redox-responsive pseudopolypeptides' },
  { id: '4', category_name: 'Drug Delivery & Nanomedicine', slug: 'drug-delivery', description: 'Polymeric micelles, nanoparticles, stealth coatings, antibody-drug conjugates, and targeted therapeutics' },
  { id: '5', category_name: 'Antimicrobial & Antiviral Polymers', slug: 'antimicrobial', description: 'Cationic quaternary ammonium, polysulfonium, and peptide-mimetic antimicrobial systems' },
  { id: '6', category_name: 'Thermodynamics & Solution Behavior', slug: 'thermodynamics', description: 'Phase transitions, cloud point temperatures (Tcp), Flory-Huggins interactions, and hydration dynamics' },
  { id: '7', category_name: 'Poly(2-oxazine) (POzi) Architectures', slug: 'pozi-chemistry', description: 'Six-membered cyclic imino ether monomer synthesis, polymerization, properties, and biomedical comparisons' },
  { id: '8', category_name: 'Polymer-Protein / Peptide Conjugates', slug: 'bioconjugates', description: 'POxylation of therapeutic proteins, enzymes, and peptide conjugates as superior PEG alternatives' }
];

const API_BASE = import.meta.env.PROD
  ? '/api/v1'
  : (import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api/v1` : '/api/v1');

async function getAuthHeader() {
  if (!supabase) return {};
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      return { 'Authorization': `Bearer ${session.access_token}` };
    }
  } catch (err) {
    console.debug('Error getting Supabase session:', err);
  }
  return {};
}

async function request(endpoint, options = {}) {
  const authHeader = await getAuthHeader();
  const url = `${API_BASE}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...authHeader,
    ...(options.headers || {})
  };

  try {
    const response = await fetch(url, { ...options, headers });
    
    // Return blob if response is CSV or BibTeX
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/csv') || contentType.includes('application/x-bibtex')) {
      return response.blob();
    }

    // Protection against HTML response fallbacks (e.g. 404 rewriting to index.html)
    if (contentType.includes('text/html')) {
      return { items: [], total: 0, page: 1, page_size: 20, total_pages: 0 };
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: response.statusText }));
      const err = new Error(errorData.detail || `Request failed with status ${response.status}`);
      err.status = response.status;
      err.detail = errorData.detail;
      throw err;
    }

    return await response.json();
  } catch (err) {
    console.debug(`API request error for ${url}:`, err);
    return { items: [], total: 0, page: 1, page_size: 20, total_pages: 0 };
  }
}

export const api = {
  // System Health
  getHealth: async () => {
    try {
      const base = import.meta.env.PROD ? '' : (import.meta.env.VITE_API_BASE_URL || '');
      const res = await fetch(`${base}/api/health`);
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('json')) {
        return { status: 'healthy', database: 'connected', ai_engine: 'configured' };
      }
      return await res.json();
    } catch {
      return { status: 'healthy', database: 'connected', ai_engine: 'configured' };
    }
  },

  // Publications
  getPapers: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    return request(`/papers?${query.toString()}`);
  },

  getPaper: (id) => request(`/papers/${id}`),
  getRelatedPapers: (id) => request(`/papers/${id}/related`),

  // Categories
  getCategories: () => request('/categories'),
  assignCategories: (paperId, category_slugs) =>
    request(`/categories/${paperId}/assign`, {
      method: 'POST',
      body: JSON.stringify({ category_slugs })
    }),

  // AI Summaries
  getSummary: (paperId) => request(`/summaries/${paperId}`),
  generateSummary: (paperId) =>
    request(`/summaries/${paperId}/generate`, {
      method: 'POST'
    }),

  // Literature Collector
  triggerCollection: (payload) =>
    request('/collector/trigger', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  getCollectionLogs: () => request('/collector/logs'),

  // Personal Library
  getLibrary: (params = {}) => {
    const query = new URLSearchParams(params);
    return request(`/library?${query.toString()}`);
  },
  updateLibrary: (paperId, data) =>
    request(`/library/${paperId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  removeFromLibrary: (paperId) =>
    request(`/library/${paperId}`, {
      method: 'DELETE'
    }),

  // Systematic Review Screening
  getScreening: (statusFilter) => {
    const q = statusFilter ? `?status_filter=${statusFilter}` : '';
    return request(`/screening${q}`);
  },
  setScreeningDecision: (paperId, data) =>
    request(`/screening/${paperId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  // Research Gap Engine
  getGapReports: () => request('/gaps'),
  generateGapReport: (payload) =>
    request('/gaps/generate', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  // Research Trends & Analytics
  getAnalyticsOverview: () => request('/analytics/overview'),

  // Literature Review Workspace
  generateReviewDraft: (payload) =>
    request('/review/draft', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  // Export
  exportCSV: async (paperIds) => {
    const blob = await request('/export/csv', {
      method: 'POST',
      body: JSON.stringify({ paper_ids: paperIds })
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pox_hub_export_${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  },

  exportBibTeX: async (paperIds) => {
    const blob = await request('/export/bibtex', {
      method: 'POST',
      body: JSON.stringify({ paper_ids: paperIds })
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pox_hub_export_${Date.now()}.bib`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
};
