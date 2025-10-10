// frontend/src/pages/ProductList.js
import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";

export default function ProductList({ user }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        // Handle paginated response structure
        if (res.data.success && res.data.data) {
          setProducts(res.data.data.data || res.data.data);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error(err);
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Container style={{ maxWidth: '1400px', paddingTop: '4rem', paddingBottom: '4rem' }}>
        {/* Page Header */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '4rem',
          padding: '0 2rem'
        }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '800',
            color: '#1e40af',
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em'
          }}>
            🎨 Indigenous Products Collection
          </h1>
          <p style={{
            fontSize: '1.3rem',
            color: '#6b7280',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Discover Authentic Handcrafted Treasures from Local Artisans
          </p>
        </div>

        {/* Products Grid */}
        <Row className="g-4" style={{ marginBottom: '4rem' }}>
          {Array.isArray(products) && products.map((product) => (
            <Col lg={4} md={6} key={product.id}>
              <div style={{
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                height: '100%',
                transition: 'all 0.3s ease',
                border: '1px solid #e5e7eb'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
              }}>
                {product.image_url && (
                  <div style={{
                    height: '250px',
                    backgroundImage: `url(${product.image_url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}></div>
                )}
                <div style={{ padding: '2rem' }}>
                  <h4 style={{
                    fontSize: '1.4rem',
                    fontWeight: '700',
                    color: '#1e40af',
                    marginBottom: '1rem',
                    lineHeight: '1.3'
                  }}>
                    {product.title}
                  </h4>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    marginBottom: '1.5rem',
                    minHeight: '4.8rem'
                  }}>
                    {product.story?.substring(0, 120)}...
                  </p>
                    
                  {/* Product Details */}
                  <div style={{ marginBottom: '1rem' }}>
                    {product.heritage_origin && (
                      <span style={{
                        background: '#3b82f6',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.875rem',
                        marginRight: '0.5rem',
                        display: 'inline-block',
                        marginBottom: '0.5rem'
                      }}>
                        🌍 {product.heritage_origin}
                      </span>
                    )}
                    {product.is_handmade && (
                      <span style={{
                        background: '#10b981',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.875rem',
                        marginRight: '0.5rem',
                        display: 'inline-block',
                        marginBottom: '0.5rem'
                      }}>
                        ✋ Handmade
                      </span>
                    )}
                    {product.is_fair_trade && (
                      <span style={{
                        background: '#f59e0b',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.875rem',
                        display: 'inline-block',
                        marginBottom: '0.5rem'
                      }}>
                        ⚖️ Fair Trade
                      </span>
                    )}
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 'auto'
                  }}>
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      color: '#d97706'
                    }}>
                      ₱{parseFloat(product.price).toFixed(2)}
                    </div>
                    <Button
                      as={Link}
                      to={`/products/${product.id}`}
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
                </div>
              </div>
              </Col>
            ))}
            {!Array.isArray(products) && (
              <Col className="cultural-text-center">
                <div className="container-cultural">
                  <p className="cultural-font-secondary" style={{ fontSize: '1.1rem' }}>
                    🔄 Loading our cultural treasures...
                  </p>
                </div>
              </Col>
            )}
          </Row>

        {/* No Products Message */}
        {Array.isArray(products) && products.length === 0 && (
          <div className="cultural-text-center">
            <div className="container-cultural">
              <h3 className="cultural-font-primary" style={{ color: 'var(--cultural-primary)' }}>
                🌿 No Products Available
              </h3>
              <p className="cultural-font-secondary" style={{ color: 'var(--cultural-text-secondary)' }}>
                We're currently updating our collection. Please check back soon for new cultural treasures!
              </p>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
