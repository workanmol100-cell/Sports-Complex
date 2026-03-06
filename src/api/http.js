//src/api/http.js
// const BASE_URL = import.meta.env.VITE_API_URL || 'http://driving-elspeth-ashutoshserver-54c4997a.koyeb.app/';
const BASE_URL = import.meta.env.VITE_API_URL || 'https://driving-elspeth-ashutoshserver-54c4997a.koyeb.app';

async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    let err;
    try { err = await res.json(); } catch { err = { error: res.statusText }; }
    throw new Error(err.error || `Request failed: ${res.status}`);
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json();
  return res.text();
}

export const http = {
  get: (p) => request(p),
  post: (p, b) => request(p, { method: 'POST', body: b }),
  put: (p, b) => request(p, { method: 'PUT', body: b }),
  del: (p) => request(p, { method: 'DELETE' }),
};

export { BASE_URL };


