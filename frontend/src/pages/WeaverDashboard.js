// frontend/src/pages/WeaverDashboard.js
import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { Container, Form, Button, Table } from "react-bootstrap";

export default function WeaverDashboard({ user }) {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ title: "", story: "", stock: 0, price: 0 });

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      // Filter only products by this weaver
      setProducts(res.data.filter(p => p.weaver_id === user.id));
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // Use singular /product to match backend
    await API.post("/product", { ...form });
    setForm({ title: "", story: "", stock: 0, price: 0 });
    fetchProducts();
    alert("Product added successfully!");
  } catch (err) {
    console.error(err);
    alert("Failed to add product");
  }
};

const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this product?")) return;
  try {
    // Match backend route
    await API.delete(`/product/${id}`);
    fetchProducts();
  } catch (err) {
    console.error(err);
    alert("Delete failed");
  }
};

  return (
    <Container>
      <h1>Weaver Dashboard</h1>

      <h3 className="mt-4">Add Product</h3>
      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group className="mb-2">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Story</Form.Label>
          <Form.Control
            as="textarea"
            value={form.story}
            onChange={e => setForm({ ...form, story: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Stock</Form.Label>
          <Form.Control
            type="number"
            value={form.stock}
            onChange={e => setForm({ ...form, stock: Number(e.target.value) })}
            required
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            value={form.price}
            onChange={e => setForm({ ...form, price: Number(e.target.value) })}
            required
          />
        </Form.Group>

        <Button type="submit">Add Product</Button>
      </Form>

      <h3>Your Products</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Story</th>
            <th>Stock</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.title}</td>
              <td>{p.story}</td>
              <td>{p.stock}</td>
              <td>₱{p.price}</td>
              <td>
                <Button variant="danger" size="sm" onClick={() => handleDelete(p.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
