// src/api/exchanges.js
import { http } from './http';

export const ExchangesAPI = {
  create: (x) => http.post('/api/exchanges', x),
  list: () => http.get('/api/exchanges'),
};

