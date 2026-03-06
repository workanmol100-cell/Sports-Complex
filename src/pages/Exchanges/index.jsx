// src/pages/Exchanges/index.jsx
import './style.css';
import { useEffect, useState } from 'react';
import { ProductsAPI } from '../../api/products';
import { ExchangesAPI } from '../../api/exchanges';

function rupee(n){
  return `₹ ${Number(n||0).toLocaleString('en-IN')}`;
}

export default function ExchangesPage() {

  const [products,setProducts] = useState([]);
  const [returned,setReturned] = useState([]);
  const [issued,setIssued] = useState([]);
  const [recent,setRecent] = useState([]);

  useEffect(()=>{
    ProductsAPI.list().then(setProducts);
    ExchangesAPI.list().then(setRecent);
  },[]);

  function add(arrSetter,pid){
    const p = products.find(x=>x._id===pid);
    if(!p) return;
    arrSetter(prev=>[...prev,{product:p._id,name:p.name,qty:1}]);
  }

  async function save(){
    if(!returned.length && !issued.length) return alert("Add items");

    const payload={
      exchangeDate:new Date(),
      returnedItems: returned.map(i=>({product:i.product,qty:i.qty})),
      issuedItems: issued.map(i=>({product:i.product,qty:i.qty}))
    };

    try{
      await ExchangesAPI.create(payload);
      setReturned([]);
      setIssued([]);
      setRecent(await ExchangesAPI.list());
      alert("Exchange recorded");
    }catch(e){
      alert(e.message);
    }
  }

  const ProductSelect = ({onAdd}) => (
    <select className="select"
      onChange={e=>{
        if(e.target.value){
          onAdd(e.target.value);
          e.target.value="";
        }
      }}>
      <option value="">Add product…</option>
      {products.map(p=>
        <option key={p._id} value={p._id}>
          {p.name} - {p.brand} (₹{p.sellingPrice})
        </option>
      )}
    </select>
  );

  const ItemTable = ({title,items,setItems}) => (
    <div className="card">
      <div className="row" style={{justifyContent:'space-between'}}>
        <div className="section-title">{title}</div>
        <ProductSelect onAdd={(pid)=>add(setItems,pid)}/>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th/>
          </tr>
        </thead>

        <tbody>
          {items.map((i,idx)=>(
            <tr key={idx}>
              <td>{i.name}</td>

              <td>
                <input
                  className="input"
                  type="number"
                  min="1"
                  value={i.qty}
                  onChange={e=>
                    setItems(items.map((x,ix)=>
                      ix===idx
                        ? {...x,qty:Number(e.target.value)}
                        : x
                    ))
                  }
                />
              </td>

              <td>
                <button
                  className="btn danger"
                  onClick={()=>setItems(items.filter((_,ix)=>ix!==idx))}
                >
                  Remove
                </button>
              </td>

            </tr>
          ))}

          {!items.length && (
            <tr>
              <td colSpan="3">No items</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (

    <div className="grid">

      <div className="grid two">
        <ItemTable title="Returned Items (stock +)" items={returned} setItems={setReturned}/>
        <ItemTable title="Issued Items (stock −)" items={issued} setItems={setIssued}/>
      </div>

      <div className="row" style={{justifyContent:"flex-end"}}>
        <button className="btn" onClick={save}>Save Exchange</button>
      </div>


      {/* Exchange Report */}

      <div className="card">

        <div className="section-title">Exchange Report</div>

        <table className="table">

          <thead>
            <tr>
              <th>Date</th>
              <th>Returned</th>
              <th>Issued</th>
              <th>Difference</th>
            </tr>
          </thead>

          <tbody>

            {recent.map(r=>{

              const returnedText = r.returnedItems
                ?.map(i=>`${i.product?.name} × ${i.qty}`)
                .join(", ");

              const issuedText = r.issuedItems
                ?.map(i=>`${i.product?.name} × ${i.qty}`)
                .join(", ");

              return(

                <tr key={r._id}>

                  <td>
                    {new Date(r.exchangeDate).toLocaleDateString()}
                  </td>

                  <td>{returnedText || "-"}</td>

                  <td>{issuedText || "-"}</td>

                  <td>{rupee(r.differencePaid)}</td>

                </tr>

              );

            })}

            {!recent.length && (
              <tr>
                <td colSpan="4">No exchanges</td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

    </div>

  );
}