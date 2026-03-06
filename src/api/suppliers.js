//src/api/suppliers.js
import { http } from './http';

export const SuppliersAPI = {
  list: () => http.get('/api/suppliers'),
  create: (s) => http.post('/api/suppliers', s),
  update: (id, s) => http.put(`/api/suppliers/${id}`, s),
  remove: (id) => http.del(`/api/suppliers/${id}`),
};