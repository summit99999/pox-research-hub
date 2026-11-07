// Automated validation script for Personal Article PDF Library & Research Watchlist
import assert from 'assert';

console.log('--- 1. Testing API Endpoints in api/index.js ---');
const handler = (await import('../api/index.js')).default || (await import('../api/index.js'));

function mockReq(pathname, method = 'GET', body = null) {
  return {
    url: `http://localhost${pathname}`,
    method,
    headers: { host: 'localhost' },
    body
  };
}

function mockRes() {
  return {
    statusCode: 200,
    headers: {},
    bodyData: null,
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(data) { this.bodyData = data; return this; },
    end() { return this; }
  };
}

// Test PDF Library API
const pdfLibReq = mockReq('/api/v1/pdf/library', 'GET');
const pdfLibRes = mockRes();
await handler(pdfLibReq, pdfLibRes);
console.log('PDF Library status code:', pdfLibRes.statusCode);
assert.strictEqual(pdfLibRes.statusCode, 200, 'PDF Library endpoint must return 200');
assert(pdfLibRes.bodyData !== null, 'PDF Library response body must not be null');
console.log('✓ GET /api/v1/pdf/library responded successfully');

// Test PDF Status API
const pdfStatReq = mockReq('/api/v1/pdf/status/test-article-123', 'GET');
const pdfStatRes = mockRes();
await handler(pdfStatReq, pdfStatRes);
console.log('PDF Status endpoint code:', pdfStatRes.statusCode, 'Body:', pdfStatRes.bodyData);
assert.strictEqual(pdfStatRes.statusCode, 200, 'PDF Status endpoint must return 200');
console.log('✓ GET /api/v1/pdf/status/:article_id responded successfully');

// Test Watchlist API
const watchReq = mockReq('/api/v1/watchlist', 'GET');
const watchRes = mockRes();
await handler(watchReq, watchRes);
console.log('Watchlist status code:', watchRes.statusCode);
assert.strictEqual(watchRes.statusCode, 200, 'Watchlist endpoint must return 200');
assert(watchRes.bodyData !== null, 'Watchlist response body must not be null');
console.log('✓ GET /api/v1/watchlist responded successfully');

console.log('--- ALL VALIDATIONS PASSED SUCCESSFULLY ---');
