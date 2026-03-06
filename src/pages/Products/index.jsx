import './style.css';
import { useEffect, useState } from 'react';
import { ProductsAPI } from '../../api/products';

export default function ProductsPage() {

  const [q, setQ] = useState('');
  const [list, setList] = useState([]);

  const emptyForm = {
    name: '',
    brand: '',
    category: '',
    size: '',
    sellingPrice: 0,
    costPrice: 0,
    stockOnHand: 0
  };

  const [form, setForm] = useState(emptyForm);

  async function load() {
    const data = await ProductsAPI.list(q);
    setList(data);
  }

  useEffect(() => { load(); }, []);

  async function save() {

    if (!form.name) return alert("Product name required");

    const payload = {
      ...form,
      sellingPrice: Number(form.sellingPrice || 0),
      costPrice: Number(form.costPrice || 0),
      stockOnHand: Number(form.stockOnHand || 0)
    };

    if (form._id)
      await ProductsAPI.update(form._id, payload);
    else
      await ProductsAPI.create(payload);

    setForm(emptyForm);
    await load();
  }

  async function remove(id) {
    if (!window.confirm("Delete product?")) return;
    await ProductsAPI.remove(id);
    await load();
  }

  const showSize =
    form.category?.toLowerCase() === "tshirt" ||
    form.category?.toLowerCase() === "pant" ||
    form.category?.toLowerCase() === "jersey" ||
    form.category?.toLowerCase() === "shorts";

  return (
    <div className="grid">

      <div className="card">
        <div className="row">
          <input
            className="input"
            placeholder="Search product..."
            value={q}
            onChange={e => setQ(e.target.value)}
          />
          <button className="btn" onClick={load}>Search</button>
        </div>
      </div>

      <div className="grid two">

        {/* Add Product */}

        <div className="card">

          <div className="section-title">Add / Edit Product</div>

          <div className="grid">

            <input
              className="input"
              placeholder="Product Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />

            <input
              className="input"
              placeholder="Brand"
              value={form.brand}
              onChange={e => setForm({ ...form, brand: e.target.value })}
            />

            <input
              className="input"
              placeholder="Category (Bat, Ball, Tshirt...)"
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
            />

            {showSize && (
              <input
                className="input"
                placeholder="Size (S, M, L, XL)"
                value={form.size}
                onChange={e => setForm({ ...form, size: e.target.value })}
              />
            )}

            <input
              className="input"
              type="number"
              placeholder="Selling Price"
              value={form.sellingPrice}
              onChange={e => setForm({ ...form, sellingPrice: e.target.value })}
            />

            <input
              className="input"
              type="number"
              placeholder="Cost Price"
              value={form.costPrice}
              onChange={e => setForm({ ...form, costPrice: e.target.value })}
            />

            <input
              className="input"
              type="number"
              placeholder="Stock"
              value={form.stockOnHand}
              onChange={e => setForm({ ...form, stockOnHand: e.target.value })}
            />

            <div className="row">

              <button className="btn" onClick={save}>
                {form._id ? "Update" : "Create"}
              </button>

              {form._id && (
                <button
                  className="btn secondary"
                  onClick={() => setForm(emptyForm)}
                >
                  Cancel
                </button>
              )}

            </div>

          </div>

        </div>

        {/* Product List */}

        <div className="card">

          <div className="section-title">Products</div>

          <table className="table">

            <thead>
              <tr>
                <th>Name</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Size</th>
                <th>Sell</th>
                <th>Buy</th>
                <th>Stock</th>
                <th></th>
              </tr>
            </thead>

            <tbody>

              {list.map(p => (
                <tr key={p._id}>

                  <td>{p.name}</td>
                  <td>{p.brand || "-"}</td>
                  <td>{p.category || "-"}</td>
                  <td>{p.size || "-"}</td>
                  <td>₹ {p.sellingPrice}</td>
                  <td>₹ {p.costPrice}</td>
                  <td>{p.stockOnHand}</td>

                  <td className="row">

                    <button
                      className="btn"
                      onClick={() => setForm(p)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn danger"
                      onClick={() => remove(p._id)}
                    >
                      Delete
                    </button>

                  </td>

                </tr>
              ))}

              {list.length === 0 && (
                <tr>
                  <td colSpan="8">No products</td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}