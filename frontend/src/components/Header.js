import { Navbar, Nav, Container, Button, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Header({ user, setUser }) {
  const { cart } = useCart(); // Get cart items from context
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        // Call logout API
        await fetch("http://127.0.0.1:8000/api/logout", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      navigate("/");
    }
  };

  return (
    <Navbar 
      expand="lg" 
      style={{
        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
        borderBottom: '3px solid #60a5fa',
        boxShadow: '0 2px 10px rgba(30, 64, 175, 0.3)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" style={{ 
          color: 'white',
          fontSize: '1.5rem',
          fontWeight: '700',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          🏛️ Kultura
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ borderColor: 'white' }} />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto" style={{ gap: '1rem' }}>
            <Nav.Link as={Link} to="/" style={{ 
              color: 'white',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              🏠 Home
            </Nav.Link>
            <Nav.Link as={Link} to="/products" style={{ 
              color: 'white',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              🎨 Products
            </Nav.Link>
            <Nav.Link as={Link} to="/stories" style={{ 
              color: 'white',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              📖 Stories
            </Nav.Link>
            <Nav.Link as={Link} to="/fundraising" style={{ 
              color: 'white',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              💰 Fundraising
            </Nav.Link>
            <Nav.Link as={Link} to="/imagery" style={{ 
              color: 'white',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              📸 Gallery
            </Nav.Link>
            {user?.role === "weaver" && (
              <Nav.Link as={Link} to="/dashboard" style={{ 
                color: 'white',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                ⚒️ Dashboard
              </Nav.Link>
            )}
            {user && user.role !== 'weaver' && (
              <Nav.Link as={Link} to="/orders" style={{ 
                color: 'white',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                📋 My Orders
              </Nav.Link>
            )}
          </Nav>

          <Nav style={{ gap: '1rem', alignItems: 'center' }}>
            {user && user.role !== 'weaver' && (
              <Nav.Link as={Link} to="/cart" style={{ 
                color: 'white',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                position: 'relative'
              }}>
                🛒 Cart
                {cart.length > 0 && (
                  <Badge 
                    bg="danger" 
                    style={{ 
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      fontSize: '0.7rem',
                      animation: 'pulse 2s infinite'
                    }}
                  >
                    {cart.length}
                  </Badge>
                )}
              </Nav.Link>
            )}
            
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ color: 'white', fontWeight: '500' }}>
                  👤 {user.name}
                </span>
                <Button 
                  onClick={handleLogout}
                  variant="outline-light"
                  size="sm"
                  style={{
                    border: '2px solid white',
                    color: 'white',
                    fontWeight: '500'
                  }}
                >
                  🚪 Logout
                </Button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button as={Link} to="/login" variant="outline-light" size="sm">
                  Login
                </Button>
                <Button as={Link} to="/register" variant="light" size="sm">
                  Register
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}