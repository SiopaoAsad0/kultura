import { useEffect, useState, useCallback } from "react";
import { Container, Form, Nav, Table, Button, Row, Col, Modal, Badge } from "react-bootstrap";
import API from "../api/axios";
import StarRating from "../components/StarRating";
import { mediaUrl } from "../utils/media";

const peso = (n) => `₱${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const deliveryColor = (s) => {
  switch (s) {
    case "delivered": return "success";
    case "in_transit": return "info";
    case "picked_up": return "primary";
    case "assigned": return "warning";
    case "failed": return "danger";
    default: return "secondary";
  }
};

const paymentColor = (s) => {
  switch (s) {
    case "paid": return "success";
    case "unpaid": return "warning";
    case "refunded": return "info";
    case "failed": return "danger";
    default: return "secondary";
  }
};

export default function AdminDashboard() {
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");

  const [orders, setOrders] = useState([]);
  const [riders, setRiders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [reports, setReports] = useState(null);
  const [orderFilter, setOrderFilter] = useState({ status: "", delivery_status: "", search: "" });

  const [riderModal, setRiderModal] = useState(false);
  const [riderForm, setRiderForm] = useState({ id: null, name: "", phone: "", vehicle_type: "motorcycle", plate_number: "", status: "available" });

  const loadOverview = useCallback(async () => {
    const res = await API.get("/admin/stats");
    setStats(res.data.data);
  }, []);

  const loadUsers = useCallback(async () => {
    const res = await API.get("/admin/users", { params: roleFilter ? { role: roleFilter } : {} });
    setUsers(res.data.data?.data || res.data.data || []);
  }, [roleFilter]);

  const loadReviews = useCallback(async () => {
    const res = await API.get("/admin/reviews");
    setReviews(res.data.data?.data || res.data.data || []);
  }, []);

  const loadOrders = useCallback(async () => {
    const params = {};
    if (orderFilter.status) params.status = orderFilter.status;
    if (orderFilter.delivery_status) params.delivery_status = orderFilter.delivery_status;
    if (orderFilter.search) params.search = orderFilter.search;
    const res = await API.get("/admin/orders", { params });
    setOrders(res.data.data?.data || res.data.data || []);
  }, [orderFilter]);

  const loadRiders = useCallback(async () => {
    const res = await API.get("/admin/riders");
    setRiders(res.data.data || []);
  }, []);

  const loadPayments = useCallback(async () => {
    const res = await API.get("/admin/payments");
    setPayments(res.data.data?.data || res.data.data || []);
  }, []);

  const loadReports = useCallback(async () => {
    const res = await API.get("/admin/reports");
    setReports(res.data.data);
  }, []);

  useEffect(() => {
    const run = async () => {
      try {
        if (tab === "overview") await loadOverview();
        else if (tab === "users") await loadUsers();
        else if (tab === "reviews") await loadReviews();
        else if (tab === "orders") { await loadOrders(); await loadRiders(); }
        else if (tab === "riders") await loadRiders();
        else if (tab === "payments") await loadPayments();
        else if (tab === "reports") await loadReports();
      } catch (err) {
        console.error(err);
      }
    };
    run();
  }, [tab, roleFilter, orderFilter, loadOverview, loadUsers, loadReviews, loadOrders, loadRiders, loadPayments, loadReports]);

  const assignRider = async (orderId, riderId) => {
    if (!riderId) return;
    try {
      await API.post(`/admin/orders/${orderId}/assign-rider`, { rider_id: riderId });
      await loadOrders();
      await loadRiders();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to assign rider");
    }
  };

  const advanceDelivery = async (orderId, status) => {
    try {
      await API.post(`/admin/orders/${orderId}/delivery-status`, { delivery_status: status });
      await loadOrders();
      await loadRiders();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update delivery");
    }
  };

  const updatePayment = async (orderId, payment_status) => {
    try {
      await API.post(`/admin/payments/${orderId}/status`, { payment_status });
      await loadPayments();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update payment");
    }
  };

  const saveRider = async (e) => {
    e.preventDefault();
    try {
      if (riderForm.id) {
        await API.put(`/admin/riders/${riderForm.id}`, riderForm);
      } else {
        await API.post("/admin/riders", riderForm);
      }
      setRiderModal(false);
      setRiderForm({ id: null, name: "", phone: "", vehicle_type: "motorcycle", plate_number: "", status: "available" });
      await loadRiders();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save rider");
    }
  };

  const deleteRider = async (id) => {
    if (!window.confirm("Remove this rider? Active deliveries will be unassigned.")) return;
    try {
      await API.delete(`/admin/riders/${id}`);
      await loadRiders();
    } catch (err) {
      alert("Failed to remove rider");
    }
  };

  return (
    <div className="page-container">
      <Container>
        <div className="header-cultural fade-in">
          <h1>Admin dashboard</h1>
          <p>Orders, deliveries, riders, payments, reports, users &amp; activity</p>
        </div>

        <Nav variant="pills" className="mb-4 flex-wrap gap-2" activeKey={tab} onSelect={setTab}>
          <Nav.Item><Nav.Link eventKey="overview">Overview</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="orders">Orders &amp; Delivery</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="riders">Riders</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="payments">Payments</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="reports">Reports</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="users">Users</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="reviews">Reviews</Nav.Link></Nav.Item>
        </Nav>

        {tab === "overview" && stats && (
          <>
            <div className="stat-grid mb-4">
              <div className="stat-card"><div className="label">Customers</div><div className="value">{stats.users.customers}</div></div>
              <div className="stat-card"><div className="label">Sellers</div><div className="value">{stats.users.sellers}</div></div>
              <div className="stat-card"><div className="label">Views this week</div><div className="value">{stats.activity.views_week}</div></div>
              <div className="stat-card"><div className="label">Active users (7d)</div><div className="value">{stats.activity.active_users_week}</div></div>
              <div className="stat-card"><div className="label">Orders</div><div className="value">{stats.catalog.orders}</div></div>
              <div className="stat-card"><div className="label">Delivered</div><div className="value">{stats.catalog.delivered}</div></div>
              <div className="stat-card"><div className="label">Avg rating</div><div className="value">{stats.reviews.average} / 5</div></div>
              <div className="stat-card"><div className="label">Revenue</div><div className="value">₱{Number(stats.catalog.revenue).toFixed(0)}</div></div>
            </div>

            <div className="panel-card mb-4">
              <h5>Most visited pages</h5>
              {(stats.activity.top_pages || []).length === 0 && <p className="text-muted mb-0">No traffic recorded yet. Browse the site to generate activity.</p>}
              {(stats.activity.top_pages || []).map((row) => (
                <div key={row.path} className="d-flex justify-content-between py-2 border-bottom">
                  <span>{row.path}</span>
                  <strong>{row.views} views</strong>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "orders" && (
          <div className="panel-card">
            <div className="d-flex flex-wrap gap-2 justify-content-between mb-3">
              <h5 className="mb-0">Orders &amp; Delivery Management</h5>
              <div className="d-flex flex-wrap gap-2">
                <Form.Control
                  placeholder="Search order / customer / txn"
                  value={orderFilter.search}
                  onChange={(e) => setOrderFilter((f) => ({ ...f, search: e.target.value }))}
                  style={{ maxWidth: 220 }}
                />
                <Form.Select
                  value={orderFilter.delivery_status}
                  onChange={(e) => setOrderFilter((f) => ({ ...f, delivery_status: e.target.value }))}
                  style={{ maxWidth: 180 }}
                >
                  <option value="">All delivery</option>
                  <option value="unassigned">Unassigned</option>
                  <option value="assigned">Assigned</option>
                  <option value="picked_up">Picked up</option>
                  <option value="in_transit">In transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="failed">Failed</option>
                </Form.Select>
              </div>
            </div>

            {orders.length === 0 ? (
              <p className="text-muted mb-0">No orders yet.</p>
            ) : (
              <div className="table-scroll">
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Payment</th>
                      <th>Delivery</th>
                      <th>Rider</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id}>
                        <td>{o.id}</td>
                        <td>{o.user?.name}<br /><small className="text-muted">{o.user?.email}</small></td>
                        <td>{peso(o.total)}</td>
                        <td><Badge bg={paymentColor(o.payment_status)}>{o.payment_status}</Badge></td>
                        <td><Badge bg={deliveryColor(o.delivery_status)}>{(o.delivery_status || "unassigned").replace(/_/g, " ")}</Badge></td>
                        <td>
                          {o.rider ? (
                            <span>{o.rider.name}</span>
                          ) : (
                            <Form.Select
                              size="sm"
                              value=""
                              onChange={(e) => assignRider(o.id, e.target.value)}
                              style={{ minWidth: 150 }}
                            >
                              <option value="">Assign rider…</option>
                              {riders.map((r) => (
                                <option key={r.id} value={r.id}>{r.name} ({r.vehicle_type})</option>
                              ))}
                            </Form.Select>
                          )}
                        </td>
                        <td>
                          {o.delivery_status !== "delivered" && o.delivery_status !== "failed" && (
                            <div className="d-flex flex-column gap-1">
                              {o.delivery_status === "assigned" && (
                                <Button size="sm" variant="outline-primary" onClick={() => advanceDelivery(o.id, "picked_up")}>Picked up</Button>
                              )}
                              {o.delivery_status === "picked_up" && (
                                <Button size="sm" variant="outline-info" onClick={() => advanceDelivery(o.id, "in_transit")}>In transit</Button>
                              )}
                              {(o.delivery_status === "in_transit" || o.delivery_status === "picked_up" || o.delivery_status === "assigned") && (
                                <Button size="sm" variant="outline-success" onClick={() => advanceDelivery(o.id, "delivered")}>Deliver</Button>
                              )}
                              <Button size="sm" variant="outline-danger" onClick={() => advanceDelivery(o.id, "failed")}>Fail</Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </div>
        )}

        {tab === "riders" && (
          <div className="panel-card">
            <div className="d-flex flex-wrap gap-2 justify-content-between mb-3">
              <h5 className="mb-0">Rider Management</h5>
              <Button
                onClick={() => {
                  setRiderForm({ id: null, name: "", phone: "", vehicle_type: "motorcycle", plate_number: "", status: "available" });
                  setRiderModal(true);
                }}
              >
                + Add rider
              </Button>
            </div>
            {riders.length === 0 ? (
              <p className="text-muted mb-0">No riders yet. Add one to start assigning deliveries.</p>
            ) : (
              <div className="table-scroll">
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Vehicle</th>
                      <th>Plate</th>
                      <th>Status</th>
                      <th>Active deliveries</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riders.map((r) => (
                      <tr key={r.id}>
                        <td>{r.name}</td>
                        <td>{r.phone}</td>
                        <td className="text-capitalize">{r.vehicle_type}</td>
                        <td>{r.plate_number || "—"}</td>
                        <td>
                          <Badge bg={r.status === "available" ? "success" : r.status === "on_delivery" ? "warning" : "secondary"}>
                            {r.status.replace(/_/g, " ")}
                          </Badge>
                        </td>
                        <td>{r.orders_count ?? 0}</td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => {
                                setRiderForm({ id: r.id, name: r.name, phone: r.phone, vehicle_type: r.vehicle_type, plate_number: r.plate_number || "", status: r.status });
                                setRiderModal(true);
                              }}
                            >
                              Edit
                            </Button>
                            <Button size="sm" variant="outline-danger" onClick={() => deleteRider(r.id)}>Remove</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </div>
        )}

        {tab === "payments" && (
          <div className="panel-card">
            <div className="d-flex flex-wrap gap-2 justify-content-between mb-3">
              <h5 className="mb-0">Payment Records &amp; Transaction History</h5>
            </div>
            {payments.length === 0 ? (
              <p className="text-muted mb-0">No payment records yet.</p>
            ) : (
              <div className="table-scroll">
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Status</th>
                      <th>Transaction ID</th>
                      <th>Date</th>
                      <th>Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.user?.name}</td>
                        <td>{peso(p.total)}</td>
                        <td className="text-capitalize">{(p.payment_method || "—").replace(/_/g, " ")}</td>
                        <td><Badge bg={paymentColor(p.payment_status)}>{p.payment_status}</Badge></td>
                        <td><small>{p.transaction_id || "—"}</small></td>
                        <td><small>{p.created_at ? new Date(p.created_at).toLocaleDateString() : "—"}</small></td>
                        <td>
                          <Form.Select
                            size="sm"
                            value={p.payment_status}
                            onChange={(e) => updatePayment(p.id, e.target.value)}
                            style={{ minWidth: 120 }}
                          >
                            <option value="unpaid">Unpaid</option>
                            <option value="paid">Paid</option>
                            <option value="refunded">Refunded</option>
                            <option value="failed">Failed</option>
                          </Form.Select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </div>
        )}

        {tab === "reports" && reports && (
          <Row className="g-4">
            <Col md={3} sm={6}>
              <div className="stat-card"><div className="label">Total revenue</div><div className="value">{peso(reports.revenue)}</div></div>
            </Col>
            <Col md={3} sm={6}>
              <div className="stat-card"><div className="label">Total orders</div><div className="value">{reports.total_orders}</div></div>
            </Col>
            <Col md={3} sm={6}>
              <div className="stat-card"><div className="label">Delivered</div><div className="value">{reports.delivered}</div></div>
            </Col>
            <Col md={3} sm={6}>
              <div className="stat-card"><div className="label">Cancelled</div><div className="value">{reports.cancelled}</div></div>
            </Col>

            <Col md={6}>
              <div className="panel-card">
                <h5>Orders by delivery status</h5>
                {Object.keys(reports.by_delivery || {}).length === 0 && <p className="text-muted mb-0">No data yet.</p>}
                {Object.entries(reports.by_delivery || {}).map(([key, val]) => (
                  <div key={key} className="d-flex justify-content-between py-2 border-bottom">
                    <span className="text-capitalize">{key.replace(/_/g, " ")}</span>
                    <strong>{val}</strong>
                  </div>
                ))}
              </div>
            </Col>

            <Col md={6}>
              <div className="panel-card">
                <h5>Orders by payment status</h5>
                {Object.keys(reports.by_payment || {}).length === 0 && <p className="text-muted mb-0">No data yet.</p>}
                {Object.entries(reports.by_payment || {}).map(([key, val]) => (
                  <div key={key} className="d-flex justify-content-between py-2 border-bottom">
                    <span className="text-capitalize">{key}</span>
                    <strong>{val}</strong>
                  </div>
                ))}
              </div>
            </Col>

            <Col md={12}>
              <div className="panel-card">
                <h5>Top products</h5>
                {(reports.top_products || []).length === 0 && <p className="text-muted mb-0">No sales yet.</p>}
                {(reports.top_products || []).map((tp, i) => (
                  <div key={i} className="d-flex justify-content-between py-2 border-bottom">
                    <span>{tp.product_name}</span>
                    <span><strong>{tp.sold}</strong> sold · {peso(tp.revenue)}</span>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        )}

        {tab === "users" && (
          <div className="panel-card">
            <div className="d-flex flex-wrap gap-2 justify-content-between mb-3">
              <h5 className="mb-0">User list</h5>
              <Form.Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={{ maxWidth: 200 }}>
                <option value="">All roles</option>
                <option value="user">Customers</option>
                <option value="weaver">Sellers</option>
                <option value="admin">Admins</option>
              </Form.Select>
            </div>
            <div className="table-scroll">
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Orders</th>
                    <th>Products</th>
                    <th>Reviews</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td className="text-capitalize">{u.role === "weaver" ? "seller" : u.role}</td>
                      <td>{u.orders_count ?? 0}</td>
                      <td>{u.products_count ?? 0}</td>
                      <td>{u.reviews_count ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        )}

        {tab === "reviews" && (
          <div className="panel-card">
            <h5>Product reviews</h5>
            {reviews.length === 0 && <p className="text-muted">No reviews yet.</p>}
            {reviews.map((review) => (
              <div key={review.id} className="d-flex gap-3 py-3 border-bottom">
                {review.product?.image_url && (
                  <img src={mediaUrl(review.product.image_url)} alt="" width="72" height="72" style={{ objectFit: "cover", borderRadius: 12 }} />
                )}
                <div>
                  <strong>{review.product?.title}</strong>
                  <div className="d-flex align-items-center gap-2">
                    <StarRating value={review.rating} readOnly />
                    <span>{review.rating} / 5</span>
                  </div>
                  <div className="text-muted">{review.user?.name} · {review.comment || "No comment"}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>

      <Modal show={riderModal} onHide={() => setRiderModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{riderForm.id ? "Edit rider" : "Add rider"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={saveRider}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                required
                value={riderForm.name}
                onChange={(e) => setRiderForm((f) => ({ ...f, name: e.target.value }))}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                required
                value={riderForm.phone}
                onChange={(e) => setRiderForm((f) => ({ ...f, phone: e.target.value }))}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Vehicle type</Form.Label>
              <Form.Select
                value={riderForm.vehicle_type}
                onChange={(e) => setRiderForm((f) => ({ ...f, vehicle_type: e.target.value }))}
              >
                <option value="motorcycle">Motorcycle</option>
                <option value="bicycle">Bicycle</option>
                <option value="van">Van</option>
                <option value="car">Car</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Plate number</Form.Label>
              <Form.Control
                value={riderForm.plate_number}
                onChange={(e) => setRiderForm((f) => ({ ...f, plate_number: e.target.value }))}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={riderForm.status}
                onChange={(e) => setRiderForm((f) => ({ ...f, status: e.target.value }))}
              >
                <option value="available">Available</option>
                <option value="on_delivery">On delivery</option>
                <option value="offline">Offline</option>
              </Form.Select>
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setRiderModal(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

