// frontend/src/pages/ProductList.js
import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
import { Card, Container, Row, Col, Button } from "react-bootstrap";

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
    <div className="cultural-section">
      <Container>
        {/* Page Header */}
        <div className="header-cultural cultural-fade-in">
          <h1>🎨 Indigenous Products Collection</h1>
          <p>Discover Authentic Handcrafted Treasures from Local Artisans</p>
        </div>

        {/* Products Grid */}
        <div className="cultural-fade-in">
          <Row>
            {Array.isArray(products) && products.map((product) => (
              <Col md={4} key={product.id} className="mb-4">
                <Card className="card-cultural cultural-fade-in">
                  <Card.Body>
                    <Card.Title className="cultural-font-primary" style={{ color: 'var(--cultural-primary)' }}>
                      {product.title}
                    </Card.Title>
                    <Card.Text className="cultural-font-secondary" style={{ color: 'var(--cultural-text-secondary)' }}>
                      {product.story?.substring(0, 120)}...
                    </Card.Text>
                    
                    {/* Product Details */}
                    <div className="cultural-mb-3">
                      {product.heritage_origin && (
                        <span className="badge-cultural me-2">
                          🌍 {product.heritage_origin}
                        </span>
                      )}
                      {product.is_handmade && (
                        <span className="badge-cultural me-2">
                          ✋ Handmade
                        </span>
                      )}
                      {product.is_fair_trade && (
                        <span className="badge-cultural">
                          ⚖️ Fair Trade
                        </span>
                      )}
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <Card.Text className="cultural-font-secondary mb-0">
                        <strong style={{ color: 'var(--cultural-accent)', fontSize: '1.3rem' }}>
                          ₱{product.price}
                        </strong>
                      </Card.Text>
                      <Button
                        as={Link}
                        to={`/products/${product.id}`}
                        className="btn-cultural-primary"
                      >
                        View Details
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
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
        </div>

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
