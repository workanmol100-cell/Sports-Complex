// src/components/TopSuppliers/index.jsx
import './style.css';

export default function TopSuppliers({ items = [] }) {
  return (
    <div className="card">
      <div className="section-title">Suppliers</div>
      <ul className="sup-list">
        {items.length === 0 && <li className="muted">No suppliers in range</li>}
        {items.map(r => (
          <li key={r.supplier?._id || Math.random()}>
            <div className="name">{r.supplier?.name}</div>
            {r.supplier?.phone ? <div className="muted">Ph: {r.supplier.phone}</div> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
