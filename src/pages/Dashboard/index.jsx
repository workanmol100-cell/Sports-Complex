
// src/pages/Dashboard/index.jsx
import './style.css';
import StatCard from '../../components/StatCard';
import LowStockList from '../../components/LowStockList';
import RecentExchanges from '../../components/RecentExchanges';
import DailySalesTable from '../../components/DailySalesTable';
import TopSuppliers from '../../components/TopSuppliers';
import { useEffect, useState } from 'react';
import { ReportsAPI } from '../../api/reports';
import { ExchangesAPI } from '../../api/exchanges';

function rupee(n) { return `₹ ${Number(n||0).toLocaleString('en-IN')}`; }

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [daily, setDaily] = useState([]);
  const [topSup, setTopSup] = useState([]);
  const [recentEx, setRecentEx] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [s, l, d, t, x] = await Promise.all([
          ReportsAPI.summary(),
          ReportsAPI.lowStock(),
          ReportsAPI.daily(7),
          ReportsAPI.topSuppliers(),
          ExchangesAPI.list()
        ]);
        setSummary(s);
        setLowStock(l);
        setDaily(d);
        setTopSup(t);
        setRecentEx(x);
      } catch (e) { console.error(e); }
    })();
  }, []);

  return (
    <div className="dashboard grid">
      <div className="grid four">
        <StatCard title="Today's Sales" value={rupee(summary?.todaySales || 0)} icon="💰" />
        <StatCard title="Today's Profit" value={rupee(summary?.todayProfit || 0)} icon="📈" />
        <StatCard title="Monthly Sales" value={rupee(summary?.monthlySales || 0)} icon="📅" />
        <StatCard title="Total Products" value={`${summary?.productCount || 0} Items`} icon="📦" />
      </div>

      <div className="grid two">
        <LowStockList items={lowStock} />
        <RecentExchanges items={recentEx.slice(0, 6)} />
      </div>

      <div className="grid two">
        <DailySalesTable rows={daily} />
        <TopSuppliers items={topSup} />
      </div>
    </div>
  );
}
