import React from 'react';
import { Link } from 'react-router-dom';

export default function Home(){
  return (
    <div className="text-center">
      <h1>Welcome to Kultura</h1>
      <p>Discover handmade products with stories from indigenous weavers.</p>
      <Link to="/products" className="btn btn-primary">Browse Products</Link>
    </div>
  );
}
