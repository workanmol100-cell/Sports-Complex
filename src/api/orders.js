import { http } from './http';

export const OrdersAPI = {
  list: () => http.get('/api/orders'),
  create: (order) => http.post('/api/orders', order),
  delete: (id) => http.delete(`/api/orders/${id}`)
};