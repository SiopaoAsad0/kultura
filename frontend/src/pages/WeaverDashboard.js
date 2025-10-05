import React from 'react';
import { useForm } from 'react-hook-form';
import axios from '../api/axios';

export default function WeaverDashboard(){
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const form = new FormData();
      form.append('title', data.title);
      form.append('story', data.story);
      form.append('price', data.price);
      form.append('stock', data.stock);
      if(data.image[0]) form.append('image', data.image[0]);

      const res = await axios.post('/products', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('Product created');
      reset();
    } catch (err) {
      console.error(err);
      alert('Error creating product');
    }
  };

  return (
    <div>
      <h2>Weaver Dashboard - Create Product</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-2">
          <input className="form-control" placeholder="Title" {...register('title', { required: true })} />
        </div>
        <div className="mb-2">
          <textarea className="form-control" placeholder="Story" {...register('story', { required: true })} />
        </div>
        <div className="mb-2">
          <input type="number" step="0.01" className="form-control" placeholder="Price" {...register('price', { required: true })} />
        </div>
        <div className="mb-2">
          <input type="number" className="form-control" placeholder="Stock" {...register('stock', { required: true })} />
        </div>
        <div className="mb-2">
          <input type="file" className="form-control" {...register('image')} />
        </div>
        <button className="btn btn-primary" type="submit">Create Product</button>
      </form>
    </div>
  );
}
