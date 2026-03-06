
// src/pages/Expenses/index.jsx
import './style.css';
import { useEffect, useState } from 'react';
import { ExpensesAPI } from '../../api/expenses';

export default function ExpensesPage() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0,10), category:'Electricity bill', amount:0, paymentMethod:'CASH' });

  async function load(){ setList(await ExpensesAPI.list()); }
  useEffect(()=>{ load(); }, []);

  async function add(){
    await ExpensesAPI.create({ ...form, amount: Number(form.amount||0), date: new Date(form.date) });
    setForm({ ...form, amount: 0 });
    await load();
  }
  async function remove(id){ if(window.confirm('Delete expense?')) return; await ExpensesAPI.remove(id); await load(); }

  const total = list.reduce((a,e)=>a+Number(e.amount||0),0);

  return (
    <div className="grid two">
      <div className="card">
        <div className="section-title">Add Expense</div>
        <div className="grid">
          <input className="input" type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})}/>
          <input className="input" placeholder="Category" value={form.category} onChange={e=>setForm({...form, category:e.target.value})}/>
          <input className="input" type="number" placeholder="Amount" value={form.amount} onChange={e=>setForm({...form, amount:e.target.value})}/>
          <select className="select" value={form.paymentMethod} onChange={e=>setForm({...form, paymentMethod:e.target.value})}>
            <option value="CASH">CASH</option><option value="UPI">UPI</option><option value="CARD">CARD</option><option value="BANK">BANK</option>
          </select>
          <button className="btn" onClick={add}>Add</button>
        </div>
      </div>
      <div className="card">
        <div className="section-title">Expenses</div>
        <table className="table">
          <thead><tr><th>Date</th><th>Category</th><th>Amount</th><th>Method</th><th/></tr></thead>
          <tbody>
            {list.map(e=>(
              <tr key={e._id}>
                <td>{new Date(e.date).toLocaleDateString()}</td>
                <td>{e.category}</td>
                <td>₹ {e.amount}</td>
                <td>{e.paymentMethod}</td>
                <td><button className="btn danger" onClick={()=>remove(e._id)}>Delete</button></td>
              </tr>
            ))}
            {!list.length && <tr><td colSpan="5">No expenses</td></tr>}
          </tbody>
          <tfoot><tr><td colSpan="2" /><td><b>₹ {total}</b></td><td colSpan="2"/></tr></tfoot>
        </table>
      </div>
    </div>
  );
}