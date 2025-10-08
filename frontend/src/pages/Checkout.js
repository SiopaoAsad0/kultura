import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import API from "../api/axios";
import BackButton from "../components/BackButton";

export default function Checkout({ user }) {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    shipping_address: "",
    contact_number: "",
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (user?.role === 'weaver') {
        setError("Weavers cannot place orders. This feature is for customers only.");
        setLoading(false);
        return;
      }

      const orderData = {
        items: cart.map(item => ({
          product_id: item.id,
          quantity: 1,
          price: item.price
        })),
        shipping_address: form.shipping_address,
        contact_number: form.contact_number,
        notes: form.notes
      };

      const token = localStorage.getItem("token");
      const res = await API.post('/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.success) {
        clearCart();
        navigate(`/order-confirmation/${res.data.data.id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (cart.length === 0) {
    navigate('/products');
    return null;
  }

  return (
    <div className="page-container">
      <Container>
        <BackButton to="/cart" label="← Back to Cart" />

        <div className="header-cultural fade-in">
          <h1>✅ Checkout</h1>
          <p>Complete your order and support our artisans</p>
        </div>

        <Row className="g-4">
          <Col lg={7}>
            <div className="container-cultural fade-in">
              <h3 className="cultural-font-primary" style={{ marginBottom: '1.5rem' }}>
                📦 Shipping Information
              </h3>

              {error && (
                <div className="alert-cultural-error">
                  ⚠️ {error}
                </div>
              )}

              <Form onSubmit={handleSubmit} className="form-cultural">
                <Form.Group className="cultural-mb-3">
                  <Form.Label>📍 Shipping Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter your complete shipping address"
                    value={form.shipping_address}
                    onChange={(e) => setForm({ ...form, shipping_address: e.target.value })}
                    required
                  />
                </Form.Group>

                <Form.Group className="cultural-mb-3">
                  <Form.Label>📱 Contact Number</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Enter your contact number"
                    value={form.contact_number}
                    onChange={(e) => setForm({ ...form, contact_number: e.target.value })}
                    required
                  />
                </Form.Group>

                <Form.Group className="cultural-mb-4">
                  <Form.Label>📝 Order Notes (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Any special instructions?"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  />
                </Form.Group>

                <Button 
                  type="submit" 
                  className="btn-cultural-primary"
                  style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                  disabled={loading}
                >
                  {loading ? '⏳ Processing...' : '✅ Place Order'}
                </Button>
              </Form>
            </div>
          </Col>

          <Col lg={5}>
            <div className="container-cultural fade-in">
              <h3 className="cultural-font-primary" style={{ marginBottom: '1.5rem' }}>
                📋 Order Summary
              </h3>

              <div style={{ marginBottom: '1.5rem' }}>
                {cart.map(item => (
                  <div key={item.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.75rem 0',
                    borderBottom: '1px solid #d4c5b9'
                  }}>
                    <span>{item.title}</span>
                    <span style={{ fontWeight: '600' }}>₱{parseFloat(item.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div style={{
                paddingTop: '1rem',
                borderTop: '2px solid #d4c5b9',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '1.3rem', fontWeight: '700' }}>Total:</span>
                  <span style={{ 
                    fontSize: '1.8rem',
                    fontWeight: '700',
                    color: '#d97706'
                  }}>
                    ₱{total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div style={{
                background: '#e0f2fe',
                border: '2px solid #0369a1',
                borderRadius: '10px',
                padding: '1rem'
              }}>
                <strong>Payment Method:</strong>
                <p style={{ marginTop: '0.5rem', marginBottom: 0 }}>
                  💳 Cash on Delivery (COD)
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
