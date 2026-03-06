// src/pages/SalesPOS/index.jsx
import './style.css';
import { useEffect, useState } from 'react';
import { ProductsAPI } from '../../api/products';
import { SalesAPI } from '../../api/sales';

function rupee(n) { return `₹ ${Number(n || 0).toLocaleString('en-IN')}`; }

export default function SalesPOS() {
  const [products, setProducts] = useState([]);
  const [lines, setLines] = useState([]);
  const [weeklySales, setWeeklySales] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [paymentTotals, setPaymentTotals] = useState({ day: {}, week: {}, month: {} });

  useEffect(() => {
    loadProducts();
    loadWeeklySales();
    loadPaymentTotals();
  }, []);

  async function loadProducts() {
    const data = await ProductsAPI.list();
    setProducts(data);
  }

  async function loadWeeklySales() {
    const data = await SalesAPI.weeklySales();
    setWeeklySales(data);
  }

  async function loadPaymentTotals() {
    const data = await SalesAPI.paymentSummary();
    setPaymentTotals(data); // { day: { CASH: 1000, UPI: 500 }, week: {...}, month: {...} }
  }

  function addLine(pid) {
    const p = products.find(x => x._id === pid);
    if (!p) return;

    const exists = lines.find(l => l.product === pid);
    if (exists) {
      setLines(lines.map(l => l.product === pid ? { ...l, qty: l.qty + 1 } : l));
    } else {
      setLines([...lines, { product: pid, name: p.name, qty: 1, sellingPrice: p.sellingPrice, costPrice: p.costPrice }]);
    }
  }

  function total() {
    return lines.reduce((a, l) => a + (l.sellingPrice - (l.discount || 0)) * l.qty, 0);
  }

  async function checkout() {
    if (!lines.length) return alert('Add items');

    try {
      const payload = {
        saleDate: new Date(),
        paymentMethod,
        items: lines.map(l => ({
          product: l.product,
          qty: l.qty,
          sellingPrice: l.sellingPrice,
          costPrice: l.costPrice,
          discount: l.discount || 0,
        })),
      };

      await SalesAPI.create(payload);

      setLines([]);
      await loadProducts();
      await loadWeeklySales();
      await loadPaymentTotals();

      alert('Sale recorded ✅');
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div className="grid">

      {/* POS SECTION */}
      <div className="grid two">

        {/* PRODUCTS */}
        <div className="card">
          <div className="section-title">Products</div>
          <div className="prod-grid">
            {products.map(p => (
              <button key={p._id} className="prod" onClick={() => addLine(p._id)}>
                <div className="name">{p.name} - {p.brand}</div>
                <div className="muted">{p.stockOnHand} in stock</div>
                <div className="price">₹ Sell: {p.sellingPrice}</div>
                <div className="price">₹ Cost: {p.costPrice}</div>
              </button>
            ))}
          </div>
        </div>

        {/* CART */}
        <div className="card">
          <div className="section-title">Cart</div>
          <table className="table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
                <th/>
              </tr>
            </thead>
            <tbody>
              {lines.map((l, i) => (
                <tr key={i}>
                  <td>{l.name}</td>
                  <td>
                    <input
                      className="input"
                      type="number"
                      min="1"
                      value={l.qty}
                      onChange={e => setLines(lines.map((x, idx) => idx === i ? { ...x, qty: Number(e.target.value) } : x))}
                    />
                  </td>
                  <td>
                    <input
                      className="input"
                      type="number"
                      value={l.sellingPrice}
                      onChange={e => setLines(lines.map((x, idx) => idx === i ? { ...x, sellingPrice: Number(e.target.value) } : x))}
                    />
                  </td>
                  <td>{rupee((l.sellingPrice - (l.discount || 0)) * l.qty)}</td>
                  <td>
                    <button className="btn danger" onClick={() => setLines(lines.filter((_, idx) => idx !== i))}>Remove</button>
                  </td>
                </tr>
              ))}
              {!lines.length && <tr><td colSpan="5">Cart empty</td></tr>}
            </tbody>
          </table>

          <div className="row" style={{ justifyContent: 'space-between', marginTop: 12 }}>
            <div style={{ fontWeight: 700 }}>Total: {rupee(total())}</div>
            <select className="select" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
              <option value="CASH">Cash</option>
              <option value="UPI">UPI</option>
            </select>
            <button className="btn" onClick={checkout}>Checkout</button>
          </div>
        </div>

      </div>

      {/* WEEKLY SALES REPORT */}
      <div className="card">
        <div className="section-title">Last 7 Days Sales</div>
        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>CP</th>
              <th>SP</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Profit</th>
            </tr>
          </thead>
          <tbody>
            {weeklySales.map((s, i) => {
              const profit = (s.sellingPrice - s.costPrice) * s.qty;
              return (
                <tr key={i}>
                  <td>{s.name}</td>
                  <td>{rupee(s.costPrice)}</td>
                  <td>{rupee(s.sellingPrice)}</td>
                  <td>{s.qty}</td>
                  <td>{rupee(s.total)}</td>
                  <td>{rupee(profit)}</td>
                </tr>
              );
            })}
            {!weeklySales.length && <tr><td colSpan="6">No sales in last 7 days</td></tr>}
          </tbody>
        </table>
      </div>

      {/* PAYMENT METHOD SUMMARY */}
      <div className="card">
        <div className="section-title">Payment Method Summary</div>
        <table className="table">
          <thead>
            <tr>
              <th>Period</th>
              <th>Cash</th>
              <th>UPI</th>
            </tr>
          </thead>
          <tbody>
            {['day','week','month'].map(period => (
              <tr key={period}>
                <td>{period.charAt(0).toUpperCase() + period.slice(1)}</td>
                <td>{rupee(paymentTotals[period]?.CASH)}</td>
                <td>{rupee(paymentTotals[period]?.UPI)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}