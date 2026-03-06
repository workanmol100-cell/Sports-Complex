//src/api/sales.js
import { http } from './http';

export const SalesAPI = {
  create: (sale) => http.post('/api/sales', sale),
  list: (from, to) => {
    const qs = new URLSearchParams({ ...(from ? { from } : {}), ...(to ? { to } : {}) });
    return http.get(`/api/sales${qs.toString() ? `?${qs.toString()}` : ''}`);
  },
  weeklySales: () => http.get("/api/sale/weekly-sales"),
  paymentSummary: () => http.get('/api/sales/payment-summary'),
};
