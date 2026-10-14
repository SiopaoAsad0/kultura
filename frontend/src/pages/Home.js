import { useEffect, useState } from "react";
import API from "../api/axios";
import { Button, Row, Col, Container, Form, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { mediaUrl } from "../utils/media";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  useEffect(() => {
    API.get("/products")
    .then((res) => {
      // Handle paginated response structure
      if (res.data.success && res.data.data) {
        setProducts(res.data.data.data || res.data.data);
      } else {
        setProducts([]);
      }
    })
    .catch(err => {
      console.error(err);
      setProducts([]);
    });
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactLoading(true);
    
    try {
      // Simulate form submission (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setContactSuccess(true);
      setContactForm({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => {
        setContactSuccess(false);
        setShowContactModal(false);
      }, 2000);
      
    } catch (error) {
      console.error('Contact form error:', error);
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
        borderBottom: '4px solid #3b82f6',
        paddingTop: 'clamp(2.5rem, 8vw, 6rem)',
        paddingBottom: 'clamp(2rem, 6vw, 5rem)',
        textAlign: 'center',
        position: 'relative'
      }}>
        <Container style={{ maxWidth: '1200px' }}>
          <div style={{ 
            fontSize: 'clamp(3.5rem, 12vw, 7rem)', 
            marginBottom: '2rem',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
          }}>
            🏛️
          </div>
          <h1 style={{
            fontSize: 'clamp(2.2rem, 8vw, 5.5rem)',
            fontWeight: '900',
            background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1.5rem',
            textShadow: '0 4px 8px rgba(0,0,0,0.1)',
            letterSpacing: '-0.02em'
          }}>
            KULTURA
          </h1>
          <p style={{
            fontSize: '1.5rem',
            color: '#1e40af',
            fontWeight: '600',
            marginBottom: '3rem',
            maxWidth: '700px',
            margin: '0 auto 3rem auto',
            lineHeight: '1.6'
          }}>
            Preserving Heritage Through Authentic Indigenous Crafts
          </p>
          
          <div style={{ 
            display: 'flex', 
            gap: '2rem', 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            marginTop: '2rem'
          }}>
            <Button as={Link} to="/products" className="btn-cultural-primary" style={{
              padding: '1.5rem 3rem',
              fontSize: '1.2rem',
              fontWeight: '700',
              borderRadius: '12px',
              boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
              transition: 'all 0.3s ease'
            }}>
              🎨 Explore Collection
            </Button>
            <Button as={Link} to="/stories" className="btn-cultural-secondary" style={{
              padding: '1.5rem 3rem',
              fontSize: '1.2rem',
              fontWeight: '700',
              borderRadius: '12px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease'
            }}>
              📖 Read Stories
            </Button>
          </div>
        </Container>
      </div>

      <Container style={{ 
        paddingTop: '6rem', 
        paddingBottom: '6rem',
        maxWidth: '1200px'
      }}>
        {/* Cultural Values Section */}
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#1e40af',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem'
          }}>
            🌿 Our Cultural Heritage
          </h2>
          <p style={{
            fontSize: '1.2rem',
            color: '#374151',
            maxWidth: '800px',
            margin: '0 auto 3rem auto',
            lineHeight: '1.8'
          }}>
            Discover the rich tapestry of Philippine indigenous craftsmanship. Each product tells a story of tradition, 
            skill, and cultural pride passed down through generations.
          </p>
        </div>

        {/* Cultural Values Cards */}
        <Row className="g-4" style={{ marginBottom: '5rem' }}>
          <Col md={4}>
            <div className="card-cultural" style={{ 
              height: '100%',
              padding: '2.5rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🎨</div>
                <h4 style={{ color: '#1e40af', marginBottom: '1rem' }}>Authentic Craftsmanship</h4>
                <p style={{ color: '#6b7280', lineHeight: '1.7' }}>
                  Every piece is handcrafted using traditional techniques passed down through generations.
                </p>
              </div>
            </div>
          </Col>
          <Col md={4}>
            <div className="card-cultural" style={{ 
              height: '100%',
              padding: '2.5rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🤝</div>
                <h4 style={{ color: '#1e40af', marginBottom: '1rem' }}>Fair Trade</h4>
                <p style={{ color: '#6b7280', lineHeight: '1.7' }}>
                  Supporting local artisans and communities with fair wages and sustainable practices.
                </p>
              </div>
            </div>
          </Col>
          <Col md={4}>
            <div className="card-cultural" style={{ 
              height: '100%',
              padding: '2.5rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🌱</div>
                <h4 style={{ color: '#1e40af', marginBottom: '1rem' }}>Sustainable</h4>
                <p style={{ color: '#6b7280', lineHeight: '1.7' }}>
                  Made from natural, eco-friendly materials that respect our environment.
                </p>
              </div>
            </div>
          </Col>
        </Row>

        {/* Divider */}
        <div style={{
          height: '2px',
          background: 'linear-gradient(90deg, transparent 0%, #3b82f6 50%, transparent 100%)',
          margin: '5rem 0'
        }}></div>

        {/* Products Section */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#1e40af',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem'
          }}>
            🎨 Indigenous Products
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: '#6b7280',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Discover our curated collection of authentic indigenous crafts
          </p>
        </div>

        {/* Products Grid */}
        <Row className="g-4" style={{ marginBottom: '5rem' }}>
          {products.slice(0, 6).map((product) => (
            <Col md={6} lg={4} key={product.id}>
              <div className="card-cultural" style={{ 
                height: '100%',
                padding: '0',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {product.image_url && (
                  <div style={{
                    height: '200px',
                    backgroundImage: `url("${mediaUrl(product.image_url)}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}></div>
                )}
                <div style={{ 
                  padding: '1.5rem',
                  flex: '1',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <h5 style={{ 
                      color: '#1e40af',
                      marginBottom: '0.75rem',
                      fontSize: '1.1rem',
                      fontWeight: '600'
                    }}>
                      {product.title}
                    </h5>
                    <p style={{ 
                      color: '#6b7280',
                      fontSize: '0.9rem',
                      lineHeight: '1.6',
                      marginBottom: '1rem',
                      minHeight: '3.2rem'
                    }}>
                      {product.description?.substring(0, 100)}...
                    </p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ 
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      color: '#d97706'
                    }}>
                      ₱{parseFloat(product.price).toFixed(2)}
                    </span>
                    <Button as={Link} to={`/products/${product.id}`} className="btn-cultural-primary" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        {/* Divider */}
        <div style={{
          height: '2px',
          background: 'linear-gradient(90deg, transparent 0%, #3b82f6 50%, transparent 100%)',
          margin: '5rem 0'
        }}></div>

        {/* Community Section */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#1e40af',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem'
          }}>
            🌟 Join Our Community
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: '#6b7280',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Be part of preserving and celebrating indigenous culture
          </p>
        </div>

        <Row className="g-4" style={{ marginBottom: '5rem' }}>
          <Col md={6}>
            <div className="card-cultural" style={{ 
              height: '100%',
              padding: '2.5rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📖</div>
              <h4 style={{ color: '#1e40af', marginBottom: '1rem' }}>Share Your Story</h4>
              <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                Tell us about your cultural heritage and traditions
              </p>
              <Button as={Link} to="/stories" className="btn-cultural-primary">
                Read Stories
              </Button>
            </div>
          </Col>
          <Col md={6}>
            <div className="card-cultural" style={{ 
              height: '100%',
              padding: '2.5rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>💰</div>
              <h4 style={{ color: '#1e40af', marginBottom: '1rem' }}>Support Causes</h4>
              <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                Help fund community projects and cultural preservation
              </p>
              <Button as={Link} to="/fundraising" className="btn-cultural-primary">
                View Campaigns
              </Button>
            </div>
          </Col>
        </Row>

        {/* Contact Us Section */}
        <div style={{
          background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
          borderRadius: '16px',
          padding: '3rem 2rem',
          textAlign: 'center',
          color: 'white'
        }}>
          <h3 style={{ 
            fontSize: '2rem',
            marginBottom: '1rem',
            fontWeight: '700'
          }}>
            📞 Get in Touch
          </h3>
          <p style={{ 
            fontSize: '1.1rem',
            marginBottom: '2rem',
            opacity: '0.9'
          }}>
            Have questions about our platform or need support? We're here to help!
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <Button 
              onClick={() => setShowContactModal(true)}
              style={{
                background: 'white',
                color: '#1e40af',
                border: 'none',
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                fontWeight: '600',
                borderRadius: '10px'
              }}
            >
              📧 Contact Us
            </Button>
            <Button as={Link} to="/products" style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '2px solid white',
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              fontWeight: '600',
              borderRadius: '10px'
            }}>
              🎨 Browse Products
            </Button>
          </div>

          {/* Contact Info */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '3rem', 
            flexWrap: 'wrap',
            marginTop: '2rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📧</div>
              <div style={{ fontSize: '0.9rem', opacity: '0.8' }}>Email</div>
              <div style={{ fontSize: '1rem', fontWeight: '600' }}>support@kultura.com</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📱</div>
              <div style={{ fontSize: '0.9rem', opacity: '0.8' }}>Phone</div>
              <div style={{ fontSize: '1rem', fontWeight: '600' }}>+63 (0) 2 1234-5678</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🕒</div>
              <div style={{ fontSize: '0.9rem', opacity: '0.8' }}>Hours</div>
              <div style={{ fontSize: '1rem', fontWeight: '600' }}>Mon-Fri 9AM-6PM</div>
            </div>
          </div>
        </div>
      </Container>

      {/* Contact Us Modal */}
      <Modal 
        show={showContactModal} 
        onHide={() => setShowContactModal(false)} 
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>📞 Contact Us</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {contactSuccess ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '12px',
              color: 'white'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <h4 style={{ marginBottom: '1rem' }}>Message Sent Successfully!</h4>
              <p>Thank you for contacting us. We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <Form onSubmit={handleContactSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>👤 Full Name *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your full name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      required
                      style={{
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '2px solid #e5e7eb'
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>📧 Email Address *</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      required
                      style={{
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '2px solid #e5e7eb'
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>📋 Subject *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="What's this about?"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                  required
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '2px solid #e5e7eb'
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>💬 Message *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Tell us how we can help you..."
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  required
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '2px solid #e5e7eb',
                    resize: 'vertical'
                  }}
                />
              </Form.Group>

              <div style={{ 
                background: '#f0f9ff', 
                border: '1px solid #0ea5e9', 
                borderRadius: '8px', 
                padding: '1rem', 
                marginBottom: '1rem' 
              }}>
                <p style={{ color: '#0369a1', margin: 0, fontSize: '0.9rem' }}>
                  <strong>💡 Quick Help:</strong> For technical issues, please include your browser type and any error messages you see. 
                  For account questions, include your username or email.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <Button
                  variant="secondary"
                  onClick={() => setShowContactModal(false)}
                  disabled={contactLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  style={{
                    background: '#3b82f6',
                    border: 'none',
                    padding: '0.75rem 2rem',
                    borderRadius: '8px'
                  }}
                  disabled={contactLoading}
                >
                  {contactLoading ? '⏳ Sending...' : '📤 Send Message'}
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}