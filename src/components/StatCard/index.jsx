//src/components/StatCard/index.jsx
import './style.css';

export default function StatCard({ title, value, icon }) {
  return (
    <div className="statcard card">
      <div className="stat-title">{title}</div>
      <div className="stat-body">
        {icon ? <span className="icon">{icon}</span> : null}
        <div className="stat-value">{value}</div>
      </div>
    </div>
  );
}