// IndexedDB helper for storing and retrieving full PDF blobs client-side
// Prevents localStorage 5MB quota exhaustion for research papers

const DB_NAME = 'prih_pdf_cache_db';
const DB_VERSION = 1;
const STORE_NAME = 'pdf_blobs';

function openPdfDb() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported in this environment'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('article_id', 'article_id', { unique: false });
        store.createIndex('doi', 'doi', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function savePdfBlob(id, articleId, doi, blob, metadata = {}) {
  try {
    const db = await openPdfDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);

      const record = {
        id: String(id),
        article_id: String(articleId),
        doi: doi || '',
        blob,
        filename: metadata.filename || 'article.pdf',
        file_size: blob.size || metadata.file_size || 0,
        mime_type: blob.type || 'application/pdf',
        updated_at: new Date().toISOString()
      };

      const putReq = store.put(record);
      putReq.onsuccess = () => resolve(record);
      putReq.onerror = () => reject(putReq.error);
    });
  } catch (err) {
    console.warn('Could not save PDF to IndexedDB:', err);
    return null;
  }
}

export async function getPdfBlob(idOrArticleId) {
  try {
    const db = await openPdfDb();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);

      // Try primary key lookup
      const getReq = store.get(String(idOrArticleId));
      getReq.onsuccess = () => {
        if (getReq.result) {
          return resolve(getReq.result);
        }

        // Try index lookup by article_id
        try {
          const index = store.index('article_id');
          const idxReq = index.get(String(idOrArticleId));
          idxReq.onsuccess = () => resolve(idxReq.result || null);
          idxReq.onerror = () => resolve(null);
        } catch {
          resolve(null);
        }
      };
      getReq.onerror = () => resolve(null);
    });
  } catch (err) {
    console.warn('Could not retrieve PDF from IndexedDB:', err);
    return null;
  }
}

export async function deletePdfBlob(idOrArticleId) {
  try {
    const db = await openPdfDb();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const delReq = store.delete(String(idOrArticleId));
      delReq.onsuccess = () => resolve(true);
      delReq.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}
