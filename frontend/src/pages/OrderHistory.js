import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import API from "../api/axios";
import BackButton from "../components/BackButton";

export default function OrderHistory({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get('/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data.data.data || res.data.data || []);
      } catch (err) {
        console.error(err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="page-container">
      <Container>
        <BackButton to="/" />

        <div className="header-cultural fade-in">
          <h1>📋 My Orders</h1>
          <p>Track your purchases and order history</p>
        </div>

        {loading ? (
          <div className="cultural-loading">
            <p>Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="container-cultural cultural-text-center">
            <div style={{ padding: '4rem 2rem' }}>
              <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>📦</div>
              <h3 className="cultural-font-primary">No Orders Yet</h3>
              <p className="cultural-font-secondary" style={{ marginTop: '1rem', marginBottom: '2rem' }}>
                Start shopping for beautiful indigenous products!
              </p>
              <Button as={Link} to="/products" className="btn-cultural-primary">
                🎨 Browse Products
              </Button>
            </div>
          </div>
        ) : (
          <Row className="g-4">
            {orders.map((order) => (
              <Col md={12} key={order.id}>
                <div className="card-cultural" style={{ padding: '2rem' }}>
                  <Row>
                    <Col md={8}>
                      <h4 className="cultural-font-primary">Order #{order.id}</h4>
                      <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
                      <p>Status: <span className="badge-cultural">{order.status}</span></p>
                      <p>Items: {order.items?.length || 0}</p>
                    </Col>
                    <Col md={4} className="text-end">
                      <div style={{ fontSize: '2rem', fontWeight: '700', color: '#d97706', marginBottom: '1rem' }}>
                        ₱{parseFloat(order.total_amount).toFixed(2)}
                      </div>
                      <Button className="btn-cultural-primary" size="sm">
                        View Details
                      </Button>
                    </Col>
                  </Row>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
}
