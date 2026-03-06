//src/api/products.js
import { http } from './http';

export const ProductsAPI = {
  list: (q) => http.get(`/api/products${q ? `?q=${encodeURIComponent(q)}` : ''}`),
  create: (p) => http.post('/api/products', p),
  update: (id, p) => http.put(`/api/products/${id}`, p),
  remove: (id) => http.del(`/api/products/${id}`),
  adjust: (id, delta) => http.post(`/api/products/${id}/adjust`, { delta }),
};