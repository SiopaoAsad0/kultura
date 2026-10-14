import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { Container, Button, Row, Col } from "react-bootstrap";
import BackButton from "../components/BackButton";
import { useCart } from "../context/CartContext";
import StarRating from "../components/StarRating";
import { mediaUrl, formatRating } from "../utils/media";

export default function ProductDetail({ user }) {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/products/${id}`)
      .then((res) => {
        // Handle API response structure
        if (res.data.success && res.data.data) {
          setProduct(res.data.data);
        } else {
          setProduct(res.data);
        }
      })
      .catch((err) => {
        console.error('Error fetching product:', err);
        setProduct({});
      });
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      alert("Please login first to add products to cart.");
      navigate("/login");
      return;
    }
    addToCart(product);
    alert("Product added to cart!");
  };

  if (!product || Object.keys(product).length === 0) {
    return (
      <div className="page-container">
        <Container>
          <div className="cultural-loading">
            <p>Loading product details...</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Container>
        <BackButton to="/products" label="← Back to Products" />
        
        <div className="container-cultural fade-in">
          <Row className="g-4">
            <Col md={6}>
              {product.image_url && (
                <img
                  src={mediaUrl(product.image_url)}
                  alt={product.title}
                  className="product-thumb"
                  style={{ height: 400, marginBottom: "1.5rem" }}
                />
              )}
            </Col>
            
            <Col md={6}>
              <div style={{ padding: '2rem 0' }}>
                <h1 className="cultural-font-primary" style={{ 
                  color: '#1e40af',
                  marginBottom: '1rem',
                  fontSize: 'clamp(1.6rem, 4vw, 2.5rem)'
                }}>
                  {product.title}
                </h1>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <StarRating value={product.reviews_avg_rating || 0} readOnly />
                  <span>{formatRating(product.reviews_avg_rating)} ({product.reviews_count || 0})</span>
                </div>
                
                {product.story && (
                  <p className="cultural-font-secondary" style={{ 
                    fontSize: '1.1rem',
                    lineHeight: '1.8',
                    marginBottom: '2rem',
                    color: '#6b7280'
                  }}>
                    {product.story}
                  </p>
                )}

                <div style={{ 
                  background: '#dbeafe',
                  border: '2px solid #3b82f6',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  marginBottom: '2rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span className="cultural-font-secondary">💰 Price:</span>
                    <span style={{ 
                      fontSize: '1.8rem',
                      fontWeight: '700',
                      color: '#d97706'
                    }}>
                      ₱{parseFloat(product.price || 0).toFixed(2)}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span className="cultural-font-secondary">📦 Stock:</span>
                    <span className="badge-cultural">
                      {product.stock || 0} available
                    </span>
                  </div>

                  {product.heritage_origin && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <span className="cultural-font-secondary">🌍 Origin:</span>
                      <span className="cultural-font-secondary">{product.heritage_origin}</span>
                    </div>
                  )}

                  {product.is_handmade && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span className="cultural-font-secondary">✋ Handmade:</span>
                      <span className="badge-cultural">Yes</span>
                    </div>
                  )}
                </div>

                <Button
                  className="btn-cultural-primary"
                  size="lg"
                  onClick={handleAddToCart}
                  style={{ 
                    padding: '1rem 2rem',
                    fontSize: '1.1rem',
                    width: '100%'
                  }}
                  disabled={!user || product.stock <= 0}
                >
                  {!user ? "🔑 Login to Add to Cart" : 
                   product.stock <= 0 ? "📦 Out of Stock" :
                   "🛒 Add to Cart"}
                </Button>
              </div>
            </Col>
          </Row>
          <div className="panel-card mt-4">
            <h3>Customer reviews</h3>
            {(!product.reviews || product.reviews.length === 0) && (
              <p className="text-muted mb-0">No reviews yet. Customers can review after delivery.</p>
            )}
            {(product.reviews || []).map((review) => (
              <div key={review.id} className="py-3 border-bottom">
                <div className="d-flex align-items-center gap-2">
                  <strong>{review.user?.name || "Customer"}</strong>
                  <StarRating value={review.rating} readOnly />
                  <span>{review.rating} / 5</span>
                </div>
                <p className="mb-0 text-muted">{review.comment || "No comment"}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
