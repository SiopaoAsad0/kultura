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
        <BackButton to="/" label="← Back to Home" />

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
                <div style={{
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '2rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  marginBottom: '1rem'
                }}>
                  <Row>
                    <Col md={8}>
                      <div style={{ marginBottom: '1rem' }}>
                        <h4 style={{
                          fontSize: '1.5rem',
                          fontWeight: '700',
                          color: '#1e40af',
                          marginBottom: '0.5rem'
                        }}>
                          Order #{order.id}
                        </h4>
                        <p style={{
                          color: '#6b7280',
                          fontSize: '0.9rem',
                          marginBottom: '0.5rem'
                        }}>
                          📅 {new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                          <span style={{
                            background: order.status === 'pending' ? '#fef3c7' : 
                                       order.status === 'processing' ? '#dbeafe' :
                                       order.status === 'shipped' ? '#dcfce7' :
                                       order.status === 'delivered' ? '#dcfce7' : '#fecaca',
                            color: order.status === 'pending' ? '#92400e' : 
                                   order.status === 'processing' ? '#1e40af' :
                                   order.status === 'shipped' ? '#166534' :
                                   order.status === 'delivered' ? '#166534' : '#dc2626',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '20px',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            textTransform: 'capitalize'
                          }}>
                            {order.status}
                          </span>
                          <span style={{
                            color: '#6b7280',
                            fontSize: '0.9rem'
                          }}>
                            📦 {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                          </span>
                        </div>
                        {order.items && order.items.length > 0 && (
                          <div style={{ marginTop: '0.5rem' }}>
                            <p style={{
                              color: '#6b7280',
                              fontSize: '0.9rem',
                              marginBottom: '0.25rem'
                            }}>
                              Items: {order.items.map(item => item.product_name).join(', ')}
                            </p>
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col md={4} className="text-end">
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        gap: '1rem'
                      }}>
                        <div style={{
                          fontSize: '2rem',
                          fontWeight: '700',
                          color: '#d97706',
                          textAlign: 'right'
                        }}>
                          ₱{parseFloat(order.total).toFixed(2)}
                        </div>
                        <Button 
                          as={Link} 
                          to={`/order-confirmation/${order.id}`}
                          style={{
                            background: '#3b82f6',
                            border: 'none',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '8px',
                            fontWeight: '600',
                            color: 'white',
                            textDecoration: 'none',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#2563eb';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#3b82f6';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          View Details
                        </Button>
                      </div>
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
