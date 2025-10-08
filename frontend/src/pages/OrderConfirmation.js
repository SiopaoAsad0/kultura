import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import API from "../api/axios";

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get(`/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrder(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="page-container">
        <Container>
          <div className="cultural-loading">
            <p>Loading...</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Container>
        <div className="container-cultural cultural-text-center fade-in">
          <div style={{ padding: '3rem 2rem' }}>
            <div style={{ fontSize: '6rem', marginBottom: '1.5rem' }}>✅</div>
            <h1 className="cultural-font-primary" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
              Order Placed Successfully!
            </h1>
            <p className="cultural-font-secondary" style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
              Thank you for supporting our indigenous artisans!
            </p>

            {order && (
              <div style={{
                background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                border: '2px solid #3b82f6',
                borderRadius: '12px',
                padding: '2rem',
                marginBottom: '2rem',
                textAlign: 'left'
              }}>
                <h3 style={{ marginBottom: '1rem' }}>📋 Order Details</h3>
                <p><strong>Order ID:</strong> #{order.id}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Total:</strong> ₱{order.total_amount}</p>
                <p><strong>Items:</strong> {order.items?.length || 0}</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Button as={Link} to="/orders" className="btn-cultural-primary">
                📋 View My Orders
              </Button>
              <Button as={Link} to="/products" className="btn-cultural-secondary">
                🎨 Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
