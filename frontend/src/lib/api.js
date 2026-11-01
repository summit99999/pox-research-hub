import { supabase } from './supabase';

const API_BASE = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api/v1`
  : '/api/v1';

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

  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: response.statusText }));
    const err = new Error(errorData.detail || `Request failed with status ${response.status}`);
    err.status = response.status;
    err.detail = errorData.detail;
    throw err;
  }
  
  // Return blob if response is CSV or BibTeX
  const contentType = response.headers.get('content-type');
  if (contentType && (contentType.includes('text/csv') || contentType.includes('application/x-bibtex'))) {
    return response.blob();
  }

  return response.json();
}

export const api = {
  // System Health
  getHealth: async () => {
    const base = import.meta.env.VITE_API_BASE_URL || '';
    const res = await fetch(`${base}/api/health`);
    return res.json();
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
