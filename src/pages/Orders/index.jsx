import './style.css';
import { useEffect, useState } from 'react';
import { OrdersAPI } from '../../api/orders';
import { ProductsAPI } from '../../api/products';
import { SuppliersAPI } from '../../api/suppliers';

export default function OrdersPage() {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ product: '', supplier: '', quantity: 1, notes: '' });

  useEffect(() => {
    ProductsAPI.list().then(setProducts);
    SuppliersAPI.list().then(setSuppliers);
    OrdersAPI.list().then(setOrders);
  }, []);

  const handleAddOrder = async () => {
    if (!form.product || !form.supplier || !form.quantity) return alert('Fill all fields');
    try {
      const newOrder = await OrdersAPI.create(form);
      setOrders(prev => [...prev, newOrder]);
      setForm({ product: '', supplier: '', quantity: 1, notes: '' });
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (window.confirm('Delete this planned order?')) return;
    try {
      await OrdersAPI.delete(id);
      setOrders(prev => prev.filter(o => o._id !== id));
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="orders-page grid">
      <div className="card">
        <div className="section-title">Add Planned Order</div>
        <div className="form-row">
          <select
            className="select"
            value={form.product}
            onChange={e => setForm({...form, product: e.target.value})}
          >
            <option value="">Select Product</option>
            {products.map(p => <option key={p._id} value={p._id}>{p.name} - {p.brand} (Stock: {p.stockOnHand})</option>)}
          </select>

          <select
            className="select"
            value={form.supplier}
            onChange={e => setForm({...form, supplier: e.target.value})}
          >
            <option value="">Select Supplier</option>
            {suppliers.map(s => <option key={s._id} value={s._id}>{s.name} ({s.address})</option>)}
          </select>

          <input
            type="number"
            className="input"
            min="1"
            value={form.quantity}
            onChange={e => setForm({...form, quantity: Number(e.target.value)})}
            placeholder="Quantity"
          />

          <input
            type="text"
            className="input"
            value={form.notes}
            onChange={e => setForm({...form, notes: e.target.value})}
            placeholder="Notes (optional)"
          />

          <button className="btn" onClick={handleAddOrder}>Add Order</button>
        </div>
      </div>

      <div className="card">
        <div className="section-title">Planned Orders</div>
        <table className="table">
          <thead>
            <tr>
                <th>Product</th>
                <th>Brand</th>
                <th>Supplier</th>
                <th>Address</th>
                <th>Qty</th>
                <th>Notes</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody>
            {orders.map(o => (
                <tr key={o._id}>
                <td>{o.product?.name || '—'}</td>
                <td>{o.product?.brand || '—'}</td>
                <td>{o.supplier?.name || '—'}</td>
                <td>{o.supplier?.address || '—'}</td>
                <td>{o.quantity}</td>
                <td>{o.notes}</td>
                <td>
                    <button className="btn danger" onClick={()=>handleDeleteOrder(o._id)}>Delete</button>
                </td>
                </tr>
            ))}
            {!orders.length && (
                <tr><td colSpan="7" style={{textAlign:'center'}}>No planned orders</td></tr>
            )}
            </tbody>
        </table>
      </div>
    </div>
  );
}