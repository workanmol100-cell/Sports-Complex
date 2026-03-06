// src/api/expenses.js
import { http } from './http';

export const ExpensesAPI = {
  list: (from, to) => {
    const qs = new URLSearchParams({ ...(from ? { from } : {}), ...(to ? { to } : {}) });
    return http.get(`/api/expenses${qs.toString() ? `?${qs.toString()}` : ''}`);
  },
  create: (e) => http.post('/api/expenses', e),
  remove: (id) => http.del(`/api/expenses/${id}`),
};
