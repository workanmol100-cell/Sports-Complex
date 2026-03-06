

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import ProductsPage from './pages/Products';
import SalesPOS from './pages/SalesPOS';
import SuppliersPage from './pages/Suppliers';
import ExchangesPage from './pages/Exchanges';
import ExpensesPage from './pages/Expenses';
import ReportsPage from './pages/Reports';
import Orders from './pages/Orders';
import Footer from './components/Footer';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/sales" element={<SalesPOS />} />
          <Route path="/suppliers" element={<SuppliersPage />} />
          <Route path="/exchanges" element={<ExchangesPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/order" element={<Orders />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}