//src/components/Header/index.jsx
import './style.css';
import { NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header className="header">
      <div className="brand">🏏 Baban Sports</div>
      <nav className="nav">
        <NavLink to="/" end className="link">Dashboard</NavLink>
        <NavLink to="/products" className="link">Products</NavLink>
        <NavLink to="/sales" className="link">Sales</NavLink>
        <NavLink to="/suppliers" className="link">Suppliers</NavLink>
        <NavLink to="/exchanges" className="link">Exchanges</NavLink>
        <NavLink to="/expenses" className="link">Expenses</NavLink>
        <NavLink to="/reports" className="link">Reports</NavLink>
        <NavLink to="/order" className="link">Orders</NavLink>
      </nav>
    </header>
  );
}