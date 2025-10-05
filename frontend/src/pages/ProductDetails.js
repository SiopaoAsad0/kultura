import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useParams } from 'react-router-dom';

export default function ProductDetail(){
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(()=>{
    axios.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if(!product) return <p>Loading product...</p>;

  return (
    <div>
      <h2>{product.title}</h2>
      {product.image && <img src={process.env.REACT_APP_API_URL + '/' + product.image} alt={product.title} className="img-fluid" />}
      <p className="mt-3">{product.story}</p>
      <p><strong>Price: ₱{product.price}</strong></p>
      <p>Stock: {product.stock}</p>
      <button className="btn btn-success">Add to cart</button>
    </div>
  );
}
