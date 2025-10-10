import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, Form, Modal, ProgressBar, Row, Col } from "react-bootstrap";
import API from "../../api/axios";
import BackButton from "../../components/BackButton";

export default function FundraisingDetail({ user }) {
  const { slug } = useParams();
  const [fundraising, setFundraising] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [donationForm, setDonationForm] = useState({
    amount: "",
    message: "",
    is_anonymous: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFundraising = async () => {
      try {
        const res = await API.get(`/fundraisings/${slug}`);
        setFundraising(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFundraising();
  }, [slug]);

  const handleDonate = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Please login first');
      navigate('/login');
      return;
    }

    if (user.role === 'weaver') {
      alert('Weavers cannot make donations.');
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await API.post(`/fundraisings/${slug}/donate`, donationForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Thank you for your donation!');
      setShowModal(false);
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to donate');
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <Container>
          <div className="cultural-loading">
            <p>Loading campaign...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (!fundraising) {
    return (
      <div className="page-container">
        <Container>
          <div className="container-cultural cultural-text-center">
            <h3>Campaign Not Found</h3>
            <Button onClick={() => navigate('/fundraising')} className="btn-cultural-primary">
              ← Back
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Container>
        <BackButton to="/fundraising" />

        <Row className="g-4">
          <Col lg={8}>
            <div className="container-cultural fade-in">
              <span className="badge-cultural">{fundraising.category}</span>

              <h1 className="cultural-font-primary" style={{ marginTop: '1rem', fontSize: '2.5rem' }}>
                {fundraising.title}
              </h1>

              <p className="cultural-font-secondary" style={{ marginTop: '1rem' }}>
                👤 By {fundraising.organizer_name}
                {fundraising.location && ` • 📍 ${fundraising.location}`}
              </p>

              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginTop: '2rem' }}>
                {fundraising.full_description || fundraising.description}
              </p>
            </div>
          </Col>

          <Col lg={4}>
            <div className="container-cultural fade-in" style={{ position: 'sticky', top: '100px' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#d97706', marginBottom: '0.5rem' }}>
                {fundraising.formatted_current_amount}
              </div>
              <p>raised of {fundraising.formatted_target_amount}</p>

              <ProgressBar 
                now={fundraising.progress_percentage} 
                style={{ height: '12px', marginBottom: '1rem' }}
              />

              <p className="cultural-font-secondary" style={{ fontSize: '0.9rem' }}>
                👥 {fundraising.donors_count} donors
                <br />
                ⏰ {fundraising.days_remaining} days left
              </p>

              {fundraising.status === 'active' && user && user.role !== 'weaver' && (
                <Button 
                  onClick={() => setShowModal(true)}
                  className="btn-cultural-primary"
                  style={{ width: '100%', padding: '1rem' }}
                >
                  💝 Support Campaign
                </Button>
              )}

              {user?.role === 'weaver' && (
                <p style={{ fontSize: '0.85rem', fontStyle: 'italic', textAlign: 'center' }}>
                  Weavers cannot donate
                </p>
              )}
            </div>
          </Col>
        </Row>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>💝 Make a Donation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleDonate}>
            <Form.Group className="cultural-mb-3">
              <Form.Label>💰 Amount (₱) *</Form.Label>
              <Form.Control
                type="number"
                min="10"
                step="0.01"
                value={donationForm.amount}
                onChange={(e) => setDonationForm({ ...donationForm, amount: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="cultural-mb-3">
              <Form.Label>📝 Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={donationForm.message}
                onChange={(e) => setDonationForm({ ...donationForm, message: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="cultural-mb-3">
              <Form.Check
                type="checkbox"
                label="Make anonymous"
                checked={donationForm.is_anonymous}
                onChange={(e) => setDonationForm({ ...donationForm, is_anonymous: e.target.checked })}
              />
            </Form.Group>

            <Button type="submit" className="btn-cultural-primary" style={{ width: '100%' }}>
              💝 Donate
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
