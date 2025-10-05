import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';

export default function ProductList(){
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    axios.get('/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err))
      .finally(()=> setLoading(false));
  }, []);

  if(loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Products</h2>
      <div className="row">
        {products.map(p => (
          <div className="col-md-4 mb-3" key={p.id}>
            <div className="card h-100">
              {p.image && <img src={process.env.REACT_APP_API_URL + '/' + p.image} className="card-img-top" alt={p.title} />}
              <div className="card-body">
                <h5 className="card-title">{p.title}</h5>
                <p className="card-text">{p.story?.slice(0, 80)}...</p>
                <p className="card-text"><strong>₱{p.price}</strong></p>
                <Link to={`/products/${p.id}`} className="btn btn-sm btn-primary">Details</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
