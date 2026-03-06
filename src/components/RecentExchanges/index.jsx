// src/components/RecentExchanges/index.jsx
import './style.css';

function formatDate(dt) {
  const d = new Date(dt);
  return d.toLocaleDateString();
}

export default function RecentExchanges({ items = [] }) {
  return (
    <div className="card">
      <div className="section-title">Recent Exchanges</div>
      <ul className="recent">
        {items.length === 0 && <li className="muted">No recent exchanges</li>}
        {items.map(x => (
          <li key={x._id}>
            <div className="line">
              <div>
                {x.returnedItems?.[0]?.qty}× return → {x.issuedItems?.[0]?.qty}× issue
                {typeof x.differencePaid === 'number' ? (
                  <span className="badge" style={{ marginLeft: 8 }}>
                    {x.differencePaid > 0 ? `+₹${x.differencePaid}` : `₹${x.differencePaid}`}
                  </span>
                ) : null}
              </div>
              <div className="muted">{formatDate(x.exchangeDate)}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}