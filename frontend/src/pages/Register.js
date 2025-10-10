import { Container, Form, Button, Modal } from "react-bootstrap";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" , role: "user"});
  const [error, setError] = useState("");
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!agreeToTerms) {
      setError("Please accept the Terms and Conditions to continue.");
      return;
    }

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/register", form);
      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Container style={{ maxWidth: '600px', paddingTop: '6rem', paddingBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '800',
            color: '#1e40af',
            marginBottom: '1rem',
            letterSpacing: '-0.02em'
          }}>
            📝 Create Account
          </h1>
          <p style={{
            fontSize: '1.3rem',
            color: '#6b7280'
          }}>
            Join our community and start your cultural journey
          </p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          padding: '3rem',
          border: '1px solid #e5e7eb'
        }}>
          {error && (
            <div style={{
              background: '#fef2f2',
              border: '2px solid #fca5a5',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '2rem',
              color: '#dc2626',
              fontSize: '1rem'
            }}>
              ⚠️ {error}
            </div>
          )}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group style={{ marginBottom: '1.5rem' }}>
              <Form.Label style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                👤 Full Name
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                style={{
                  padding: '1rem 1.5rem',
                  fontSize: '1.1rem',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}
              />
            </Form.Group>

            <Form.Group style={{ marginBottom: '1.5rem' }}>
              <Form.Label style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                📧 Email Address
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                style={{
                  padding: '1rem 1.5rem',
                  fontSize: '1.1rem',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}
              />
            </Form.Group>

            <Form.Group style={{ marginBottom: '2rem' }}>
              <Form.Label style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                🔒 Password
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Create a password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                style={{
                  padding: '1rem 1.5rem',
                  fontSize: '1.1rem',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}
              />
            </Form.Group>

            {/* Terms and Conditions Checkbox */}
            <Form.Group style={{ marginBottom: '2rem' }}>
              <Form.Check
                type="checkbox"
                id="terms-checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                label={
                  <span style={{ fontSize: '1rem', color: '#374151' }}>
                    I agree to the{' '}
                    <button
                      type="button"
                      onClick={() => setShowTermsModal(true)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#3b82f6',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        padding: 0,
                        fontSize: '1rem',
                        fontWeight: '600'
                      }}
                    >
                      Terms and Conditions
                    </button>
                    {' '}and{' '}
                    <button
                      type="button"
                      onClick={() => setShowTermsModal(true)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#3b82f6',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        padding: 0,
                        fontSize: '1rem',
                        fontWeight: '600'
                      }}
                    >
                      Privacy Policy
                    </button>
                  </span>
                }
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem'
                }}
              />
            </Form.Group>

            <Button 
              type="submit"
              className="btn-cultural-primary"
              style={{
                width: '100%',
                padding: '1.2rem',
                fontSize: '1.2rem',
                fontWeight: '700',
                borderRadius: '12px',
                boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                marginBottom: '2rem'
              }}
              disabled={!agreeToTerms}
            >
              📝 Create Account
            </Button>
          </Form>

          <div style={{ textAlign: 'center' }}>
            <p style={{ 
              color: '#6b7280',
              fontSize: '1rem'
            }}>
              Already have an account?{' '}
              <Link 
                to="/login" 
                style={{ 
                  color: '#3b82f6', 
                  textDecoration: 'none',
                  fontWeight: '600'
                }}
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </Container>

      {/* Terms and Conditions Modal */}
      <Modal 
        show={showTermsModal} 
        onHide={() => setShowTermsModal(false)} 
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>📋 Terms and Conditions & Privacy Policy</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <div style={{ padding: '1rem 0' }}>
            <h4 style={{ color: '#1e40af', marginBottom: '1rem' }}>🏛️ Kultura Platform Terms</h4>
            
            <h5 style={{ color: '#374151', marginBottom: '0.5rem', marginTop: '1.5rem' }}>1. Acceptance of Terms</h5>
            <p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '1rem' }}>
              By creating an account on Kultura, you agree to be bound by these Terms and Conditions. 
              These terms govern your use of our indigenous marketplace platform.
            </p>

            <h5 style={{ color: '#374151', marginBottom: '0.5rem', marginTop: '1.5rem' }}>2. User Responsibilities</h5>
            <p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '1rem' }}>
              • Provide accurate and truthful information during registration<br/>
              • Respect the cultural heritage and traditions represented on our platform<br/>
              • Maintain the security of your account credentials<br/>
              • Use the platform for lawful purposes only
            </p>

            <h5 style={{ color: '#374151', marginBottom: '0.5rem', marginTop: '1.5rem' }}>3. Role-Based Access</h5>
            <p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '1rem' }}>
              <strong>Users:</strong> Can create orders, view stories, support fundraising campaigns, and upload gallery images.<br/>
              <strong>Weavers:</strong> Can manage their own products, stories, and fundraising campaigns, but cannot place orders or make donations.
            </p>

            <h5 style={{ color: '#374151', marginBottom: '0.5rem', marginTop: '1.5rem' }}>4. Cultural Respect</h5>
            <p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '1rem' }}>
              All users must respect the indigenous cultures and communities represented on our platform. 
              Any content that misrepresents or disrespects cultural heritage will be removed.
            </p>

            <h5 style={{ color: '#374151', marginBottom: '0.5rem', marginTop: '1.5rem' }}>5. Privacy Policy</h5>
            <p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '1rem' }}>
              We collect and store your personal information securely. Your data is used only for platform functionality 
              and will never be shared with third parties without your explicit consent.
            </p>

            <h5 style={{ color: '#374151', marginBottom: '0.5rem', marginTop: '1.5rem' }}>6. Intellectual Property</h5>
            <p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '1rem' }}>
              All cultural content, stories, and images remain the intellectual property of their creators. 
              Users grant Kultura a license to display their content on the platform.
            </p>

            <h5 style={{ color: '#374151', marginBottom: '0.5rem', marginTop: '1.5rem' }}>7. Platform Availability</h5>
            <p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '1rem' }}>
              We strive to maintain platform availability but do not guarantee uninterrupted service. 
              We reserve the right to modify or discontinue features as needed.
            </p>

            <h5 style={{ color: '#374151', marginBottom: '0.5rem', marginTop: '1.5rem' }}>8. Contact Information</h5>
            <p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '1rem' }}>
              For questions about these terms or the platform, please contact us through the Contact Us section on our homepage.
            </p>

            <div style={{ 
              background: '#f0f9ff', 
              border: '1px solid #0ea5e9', 
              borderRadius: '8px', 
              padding: '1rem', 
              marginTop: '2rem' 
            }}>
              <p style={{ color: '#0369a1', margin: 0, fontSize: '0.9rem' }}>
                <strong>📞 Need Help?</strong> If you have any questions about these terms or need assistance, 
                please don't hesitate to contact our support team.
              </p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTermsModal(false)}>
            Close
          </Button>
          <Button 
            style={{ background: '#10b981', border: 'none' }}
            onClick={() => {
              setAgreeToTerms(true);
              setShowTermsModal(false);
            }}
          >
            I Agree
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
