// src/pages/Reports/index.jsx
import './style.css';
import { useEffect, useState } from 'react';
import { ReportsAPI } from '../../api/reports';

function rupee(n){ return `₹ ${Number(n||0).toLocaleString('en-IN')}`; }

export default function ReportsPage() {
  const [groupBy, setGroupBy] = useState('month');
  const [rows, setRows] = useState([]);

  async function load(){
    const data = await ReportsAPI.aggregate(groupBy);
    setRows(data);
  }
  // useEffect(()=>{ load(); }, [groupBy]);
  useEffect(() => {
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupBy]);

  return (
    <div className="card">
      <div className="row" style={{ justifyContent:'space-between' }}>
        <div className="section-title">Aggregated Sales & Profit</div>
        <select className="select" value={groupBy} onChange={e=>setGroupBy(e.target.value)}>
          <option value="week">Weekly</option>
          <option value="month">Monthly</option>
        </select>
      </div>
      <table className="table">
        <thead><tr><th>Period</th><th>Sales</th><th>Profit</th></tr></thead>
        <tbody>
          {rows.map((r,idx)=>(
            <tr key={idx}>
              <td>{new Date(r.period).toLocaleDateString()}</td>
              <td>{rupee(r.sales)}</td>
              <td>{rupee(r.profit)}</td>
            </tr>
          ))}
          {!rows.length && <tr><td colSpan="3">No data</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
