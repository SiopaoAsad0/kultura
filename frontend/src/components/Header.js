import { Navbar, Nav, Container, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Header({ user, setUser }) {
  const { cart } = useCart(); // Get cart items from context

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Kultura</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            {user?.role === "user" && <Nav.Link as={Link} to="/products">Products</Nav.Link>}
            {user?.role === "weaver" && <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>}
          </Nav>

          <Nav className="ms-auto align-items-center">
            {/* Cart icon + counter for normal users */}
            {user?.role === "normal" && (
              <Nav.Link as={Link} to="/cart" className="position-relative me-3">
                🛒 Cart
                {cart.length > 0 && (
                  <Badge
                    bg="danger"
                    pill
                    className="position-absolute top-0 start-100 translate-middle"
                  >
                    {cart.length}
                  </Badge>
                )}
              </Nav.Link>
            )}

            {/* Login / Logout buttons */}
            {user ? (
              <Button variant="outline-danger" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
