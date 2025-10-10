// frontend/src/pages/Cart.js
import { useCart } from "../context/CartContext";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart } = useCart();

  // Total price - use item_total if available, otherwise calculate from price * quantity
  const total = cart.reduce((sum, item) => {
    if (item.item_total) {
      return sum + parseFloat(item.item_total);
    } else {
      return sum + (parseFloat(item.price) * (item.quantity || 1));
    }
  }, 0);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Container style={{ maxWidth: '1000px', paddingTop: '4rem', paddingBottom: '4rem' }}>
        {/* Page Header */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '3rem',
          padding: '0 2rem'
        }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '800',
            color: '#1e40af',
            marginBottom: '1rem',
            letterSpacing: '-0.02em'
          }}>
            🛒 Your Cart
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: '#6b7280'
          }}>
            Review your selected items before checkout
          </p>
        </div>

        {cart.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <div style={{ fontSize: '5rem', marginBottom: '2rem' }}>🛒</div>
            <h3 style={{ color: '#1e40af', marginBottom: '1rem' }}>Your cart is empty</h3>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
              Add some beautiful indigenous products to get started!
            </p>
            <Button as={Link} to="/products" className="btn-cultural-primary" style={{
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              fontWeight: '600'
            }}>
              🎨 Browse Products
            </Button>
          </div>
        ) : (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            overflow: 'hidden'
          }}>
            {/* Cart Items */}
            <div style={{ padding: '2rem' }}>
              <div style={{
                display: 'grid',
                gap: '1.5rem',
                marginBottom: '2rem'
              }}>
                {cart.map((item) => (
                  <div key={item.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1.5rem',
                    background: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ flex: '1' }}>
                      <h5 style={{
                        fontSize: '1.2rem',
                        fontWeight: '600',
                        color: '#1e40af',
                        marginBottom: '0.5rem'
                      }}>
                        {item.title}
                      </h5>
                      {item.quantity && item.quantity > 1 && (
                        <p style={{
                          fontSize: '0.9rem',
                          color: '#6b7280',
                          margin: 0
                        }}>
                          Quantity: {item.quantity} × ₱{parseFloat(item.price).toFixed(2)}
                        </p>
                      )}
                    </div>
                    <div style={{
                      fontSize: '1.3rem',
                      fontWeight: '700',
                      color: '#d97706',
                      marginRight: '2rem',
                      textAlign: 'right'
                    }}>
                      ₱{item.item_total ? parseFloat(item.item_total).toFixed(2) : parseFloat(item.price).toFixed(2)}
                    </div>
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '8px'
                      }}
                    >
                      🗑️ Remove
                    </Button>
                  </div>
                ))}
              </div>

              {/* Total and Checkout */}
              <div style={{
                borderTop: '2px solid #e5e7eb',
                paddingTop: '2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <h4 style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: '#1e40af',
                    margin: 0
                  }}>
                    Total: ₱{total.toFixed(2)}
                  </h4>
                  <p style={{
                    color: '#6b7280',
                    margin: '0.5rem 0 0 0',
                    fontSize: '1rem'
                  }}>
                    {cart.length} item{cart.length !== 1 ? 's' : ''} in cart
                  </p>
                </div>
                <Button 
                  as={Link} 
                  to="/checkout" 
                  className="btn-cultural-primary"
                  style={{
                    padding: '1rem 2rem',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    borderRadius: '12px',
                    boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)'
                  }}
                >
                  ✅ Proceed to Checkout
                </Button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
