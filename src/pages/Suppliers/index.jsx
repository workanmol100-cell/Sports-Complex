// src/pages/Suppliers/index.jsx
import './style.css';
import { useEffect, useState } from 'react';
import { SuppliersAPI } from '../../api/suppliers';

export default function SuppliersPage() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ name:'', phone:'', address:'' });

  async function load(){ setList(await SuppliersAPI.list()); }
  useEffect(()=>{ load(); }, []);

  async function save(){
    if (form._id) await SuppliersAPI.update(form._id, form);
    else await SuppliersAPI.create(form);
    setForm({ name:'', phone:'', address:'' }); await load();
  }
  async function remove(id){ if(window.confirm('Delete?'))return; await SuppliersAPI.remove(id); await load(); }

  return (
    <div className="grid two">
      <div className="card">
        <div className="section-title">Add / Edit Supplier</div>
        <div className="grid">
          <input className="input" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
          <input className="input" placeholder="Phone" value={form.phone||''} onChange={e=>setForm({...form, phone:e.target.value})}/>
          <input className="input" placeholder="Address(optional)" value={form.address||''} onChange={e=>setForm({...form, address:e.target.value})}/>
          <button className="btn" onClick={save}>{form._id?'Update':'Create'}</button>
        </div>
      </div>
      <div className="card">
        <div className="section-title">Suppliers</div>
        <table className="table">
          <thead><tr><th>Name</th><th>Phone</th><th>Address</th><th/></tr></thead>
          <tbody>
            {list.map(s=>(
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.phone || '-'}</td>
                <td>{s.address || '-'}</td>
                <td className="row">
                  <button className="btn" onClick={()=>setForm(s)}>Edit</button>
                  <button className="btn danger" onClick={()=>remove(s._id)}>Delete</button>
                </td>
              </tr>
            ))}
            {!list.length && <tr><td colSpan="3">No suppliers</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}