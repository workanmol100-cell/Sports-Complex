//src/components/DailySalesTable/index.jsx
import './style.css';

function rupee(n) { return `₹ ${Number(n||0).toLocaleString('en-IN')}`; }
function fmt(d) { return new Date(d).toLocaleDateString(); }

export default function DailySalesTable({ rows = [] }) {
  return (
    <div className="card">
      <div className="section-title">Daily Sales Report</div>
      <table className="table">
        <thead>
          <tr><th>Date</th><th>Sales</th><th>Profit</th></tr>
        </thead>
        <tbody>
          {rows.length === 0 && <tr><td colSpan="3">No data</td></tr>}
          {rows.map(r => (
            <tr key={r._id || r.period || Math.random()}>
              <td>{fmt(r._id || r.period)}</td>
              <td>{rupee(r.sales)}</td>
              <td>{rupee(r.profit)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// src/components/DailySalesTable/style.css