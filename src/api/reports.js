import { http } from './http';

export const ReportsAPI = {
  summary: () => http.get('/api/reports/summary'),
  daily: (days = 7) => http.get(`/api/reports/daily?days=${days}`),
  aggregate: (groupBy = 'month', from, to) => {
    const qs = new URLSearchParams({ groupBy, ...(from ? { from } : {}), ...(to ? { to } : {}) });
    return http.get(`/api/reports/aggregate?${qs.toString()}`);
  },
  lowStock: () => http.get('/api/reports/low-stock'),
  topSuppliers: () => http.get('/api/reports/top-suppliers'),
};
