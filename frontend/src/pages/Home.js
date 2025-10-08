import { useEffect, useState } from "react";
import API from "../api/axios";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Home() {
  const [products, setProducts] = useState([]);

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

  return (
    <div className="page-container">
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
        borderBottom: '4px solid #3b82f6',
        paddingTop: '5rem',
        paddingBottom: '4rem',
        textAlign: 'center'
      }}>
        <Container>
          <div style={{ fontSize: '6rem', marginBottom: '1.5rem' }}>🏛️</div>
          <h1 style={{
            fontSize: 'clamp(3rem, 6vw, 6rem)',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            KULTURA
          </h1>
          <p style={{
            fontSize: '1.4rem',
            color: '#1e40af',
            fontWeight: '600',
            marginBottom: '2.5rem',
            maxWidth: '600px',
            margin: '0 auto 2.5rem auto'
          }}>
            Preserving Heritage Through Authentic Indigenous Crafts
          </p>
          
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button as={Link} to="/products" className="btn-cultural-primary" style={{
              padding: '1.25rem 2.5rem',
              fontSize: '1.1rem',
              fontWeight: '600'
            }}>
              🎨 Explore Collection
            </Button>
            <Button as={Link} to="/stories" className="btn-cultural-secondary" style={{
              padding: '1.25rem 2.5rem',
              fontSize: '1.1rem',
              fontWeight: '600'
            }}>
              📖 Read Stories
            </Button>
          </div>
        </Container>
      </div>

      <Container style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
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

        {/* Featured Products Section */}
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
            🎨 Featured Indigenous Products
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
                    backgroundImage: `url(${product.image_url})`,
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

        {/* Bottom CTA */}
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
            Ready to Explore Indigenous Culture?
          </h3>
          <p style={{ 
            fontSize: '1.1rem',
            marginBottom: '2rem',
            opacity: '0.9'
          }}>
            Start your journey of discovery today
          </p>
          <Button as={Link} to="/products" style={{
            background: 'white',
            color: '#1e40af',
            border: 'none',
            padding: '1rem 2rem',
            fontSize: '1.1rem',
            fontWeight: '600',
            borderRadius: '10px'
          }}>
            🎨 Browse All Products
          </Button>
        </div>
      </Container>
    </div>
  );
}