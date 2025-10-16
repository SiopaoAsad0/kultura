// frontend/src/pages/WeaverOrders.js
import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { Container, Table, Button, Badge, Form, Modal } from "react-bootstrap";

export default function WeaverOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [confirmForm, setConfirmForm] = useState({ status: 'processing', notes: '' });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get("/weaver/orders");
      if (res.data.success && res.data.data) {
        setOrders(res.data.data.data || res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOrder = (order) => {
    setSelectedOrder(order);
    setConfirmForm({ 
      status: order.status === 'pending' ? 'processing' : order.status, 
      notes: '' 
    });
    setShowModal(true);
  };

  const submitConfirmation = async () => {
    if (!selectedOrder) return;

    try {
      await API.post(`/weaver/orders/${selectedOrder.id}/confirm`, confirmForm);
      alert("Order status updated successfully!");
      setShowModal(false);
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      console.error("Failed to update order:", err);
      alert(err.response?.data?.message || "Failed to update order status");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'warning', text: '⏳ Pending' },
      processing: { bg: 'info', text: '📦 Processing' },
      shipped: { bg: 'primary', text: '🚚 Shipped' },
      delivered: { bg: 'success', text: '✅ Delivered' },
      cancelled: { bg: 'danger', text: '❌ Cancelled' }
    };
    const config = statusConfig[status] || { bg: 'secondary', text: status };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  if (loading) {
    return (
      <div className="cultural-section">
        <Container>
          <div className="header-cultural cultural-fade-in">
            <h1>⏳ Loading Orders...</h1>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="cultural-section">
      <Container>
        {/* Header */}
        <div className="header-cultural cultural-fade-in">
          <h1>📋 Your Orders</h1>
          <p>Manage orders for your products</p>
        </div>

        {/* Orders Table */}
        <div className="container-cultural cultural-fade-in">
          {orders.length === 0 ? (
            <div className="cultural-text-center" style={{ padding: '3rem' }}>
              <h3 className="cultural-font-primary" style={{ color: 'var(--cultural-primary)' }}>
                📦 No Orders Yet
              </h3>
              <p className="cultural-font-secondary" style={{ color: 'var(--cultural-text-secondary)' }}>
                Orders containing your products will appear here.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table className="table-cultural">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Products</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="cultural-font-secondary">
                        <strong>#{order.id}</strong>
                      </td>
                      <td className="cultural-font-secondary">
                        <div>
                          <strong>{order.user?.name}</strong>
                        </div>
                        <small style={{ color: 'var(--cultural-text-secondary)' }}>
                          {order.user?.email}
                        </small>
                      </td>
                      <td className="cultural-font-secondary">
                        <div>
                          {order.items?.map((item, idx) => (
                            <div key={idx} style={{ marginBottom: '0.5rem' }}>
                              <strong>{item.product?.title}</strong>
                              <br />
                              <small>Qty: {item.quantity} × ₱{parseFloat(item.price).toFixed(2)}</small>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="cultural-font-secondary">
                        <strong style={{ color: 'var(--cultural-accent)' }}>
                          ₱{parseFloat(order.weaver_subtotal || order.total).toFixed(2)}
                        </strong>
                      </td>
                      <td>
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="cultural-font-secondary">
                        <small>
                          {new Date(order.created_at).toLocaleDateString()}
                        </small>
                      </td>
                      <td>
                        {order.status !== 'cancelled' && order.status !== 'delivered' && (
                          <Button
                            className="btn-cultural-primary"
                            size="sm"
                            onClick={() => handleConfirmOrder(order)}
                          >
                            📝 Update Status
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>

        {/* Order Confirmation Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton className="cultural-font-primary">
            <Modal.Title>Update Order Status</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedOrder && (
              <div>
                <p className="cultural-font-secondary">
                  <strong>Order #{selectedOrder.id}</strong> - {selectedOrder.user?.name}
                </p>
                
                <Form.Group className="cultural-mb-3">
                  <Form.Label className="cultural-font-secondary">
                    📦 Order Status
                  </Form.Label>
                  <Form.Select
                    value={confirmForm.status}
                    onChange={(e) => setConfirmForm({ ...confirmForm, status: e.target.value })}
                    className="cultural-font-secondary"
                  >
                    <option value="processing">📦 Processing</option>
                    <option value="shipped">🚚 Shipped</option>
                    <option value="delivered">✅ Delivered</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="cultural-mb-3">
                  <Form.Label className="cultural-font-secondary">
                    📝 Notes (Optional)
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Add any notes about this order..."
                    value={confirmForm.notes}
                    onChange={(e) => setConfirmForm({ ...confirmForm, notes: e.target.value })}
                    className="cultural-font-secondary"
                  />
                </Form.Group>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={() => setShowModal(false)}
              className="cultural-font-secondary"
            >
              Cancel
            </Button>
            <Button 
              className="btn-cultural-primary"
              onClick={submitConfirmation}
            >
              ✅ Update Order
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}

