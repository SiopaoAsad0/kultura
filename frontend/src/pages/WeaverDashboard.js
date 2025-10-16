// frontend/src/pages/WeaverDashboard.js
import React, { useState, useEffect, useCallback } from "react";
import API from "../api/axios";
import { Container, Form, Button, Table, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function WeaverDashboard({ user }) {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ title: "", story: "", stock: 0, price: 0 });

  const fetchProducts = useCallback(async () => {
    try {
      const res = await API.get("/products");
      // Handle paginated response structure
      if (res.data.success && res.data.data) {
        const allProducts = res.data.data.data || res.data.data;
        // Filter only products by this weaver
        setProducts(Array.isArray(allProducts) ? allProducts.filter(p => p.weaver_id === user.id) : []);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Failed to fetch products", err);
      setProducts([]);
    }
  }, [user.id]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // Use /products to match backend
    await API.post("/products", { ...form });
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
    await API.delete(`/products/${id}`);
    fetchProducts();
  } catch (err) {
    console.error(err);
    alert("Delete failed");
  }
};

  return (
    <div className="cultural-section">
      <Container>
        {/* Dashboard Header */}
        <div className="header-cultural cultural-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1>⚒️ Weaver Dashboard</h1>
              <p>Manage your cultural heritage products and share your craft with the world</p>
            </div>
            <Button 
              as={Link} 
              to="/weaver/orders" 
              className="btn-cultural-accent"
              size="lg"
            >
              📋 View Orders
            </Button>
          </div>
        </div>

        {/* Add Product Form */}
        <div className="container-cultural cultural-fade-in cultural-mb-4">
          <h2 className="cultural-font-primary cultural-mb-4" style={{ color: 'var(--cultural-primary)' }}>
            🎨 Add New Product
          </h2>
          <Form onSubmit={handleSubmit} className="form-cultural">
            <Row>
              <Col md={6}>
                <Form.Group className="cultural-mb-3">
                  <Form.Label className="cultural-font-secondary">
                    📝 Product Title
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter product title"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    required
                    className="cultural-font-secondary"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="cultural-mb-3">
                  <Form.Label className="cultural-font-secondary">
                    💰 Price (₱)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                    required
                    className="cultural-font-secondary"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="cultural-mb-3">
              <Form.Label className="cultural-font-secondary">
                📖 Cultural Story
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Tell the story behind this cultural piece..."
                value={form.story}
                onChange={e => setForm({ ...form, story: e.target.value })}
                required
                className="cultural-font-secondary"
              />
            </Form.Group>
            
            <Form.Group className="cultural-mb-4">
              <Form.Label className="cultural-font-secondary">
                📦 Stock Quantity
              </Form.Label>
              <Form.Control
                type="number"
                placeholder="0"
                value={form.stock}
                onChange={e => setForm({ ...form, stock: Number(e.target.value) })}
                required
                className="cultural-font-secondary"
              />
            </Form.Group>
            
            <Button 
              type="submit" 
              className="btn-cultural-primary"
              size="lg"
            >
              ✨ Add Product
            </Button>
          </Form>
        </div>

        {/* Products Table */}
        <div className="cultural-fade-in">
          <h2 className="cultural-font-primary cultural-mb-4" style={{ color: 'var(--cultural-primary)' }}>
            📋 Your Products
          </h2>
          {products.length > 0 ? (
            <div className="table-responsive">
              <Table className="table-cultural">
                <thead>
                  <tr>
                    <th>📝 Title</th>
                    <th>📖 Story</th>
                    <th>📦 Stock</th>
                    <th>💰 Price</th>
                    <th>⚙️ Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td className="cultural-font-secondary">
                        <strong>{p.title}</strong>
                      </td>
                      <td className="cultural-font-secondary">
                        {p.story?.substring(0, 100)}...
                      </td>
                      <td className="cultural-font-secondary">
                        <span className="badge-cultural">
                          {p.stock}
                        </span>
                      </td>
                      <td className="cultural-font-secondary">
                        <strong style={{ color: 'var(--cultural-accent)' }}>
                          ₱{p.price}
                        </strong>
                      </td>
                      <td>
                        <Button
                          className="btn-cultural-accent"
                          size="sm"
                          onClick={() => handleDelete(p.id)}
                        >
                          🗑️ Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <div className="container-cultural cultural-text-center">
              <h3 className="cultural-font-primary" style={{ color: 'var(--cultural-primary)' }}>
                🌿 No Products Yet
              </h3>
              <p className="cultural-font-secondary" style={{ color: 'var(--cultural-text-secondary)' }}>
                Start sharing your cultural heritage by adding your first product above.
              </p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
