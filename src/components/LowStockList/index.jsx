// src/components/LowStockList/index.jsx
import './style.css';

export default function LowStockList({ items = [] }) {
  return (
    <div className="card">
      <div className="section-title">Low Stock Alerts</div>
      <ul className="lowstock">
        {items.length === 0 && <li className="muted">No low stock items 🎉</li>}
        {items.map(p => (
          <li key={p._id}>
            <span className="dot" />
            <span>{p.name}</span>
            <span className="muted">— Only {p.stockOnHand} left</span>
          </li>
        ))}
      </ul>
    </div>
  );
}