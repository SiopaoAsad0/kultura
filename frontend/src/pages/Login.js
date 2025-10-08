// frontend/src/pages/Login.js
import { Container, Form, Button } from "react-bootstrap";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

export default function Login({ setUser }) {  // <-- Add setUser here
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/login", form);
      alert(res.data.message);

      // Save user in localStorage
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);

      // Update App.js user state
      setUser(res.data.user);

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="cultural-section">
      <Container>
        <div className="cultural-text-center cultural-mb-4">
          <div className="header-cultural cultural-fade-in">
            <h1>🔑 Welcome Back</h1>
            <p>Sign in to continue your cultural journey</p>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="container-cultural cultural-fade-in">
              {error && (
                <div className="alert-cultural-error cultural-mb-4">
                  ⚠️ {error}
                </div>
              )}
              
              <Form onSubmit={handleSubmit} className="form-cultural">
                <Form.Group className="cultural-mb-3">
                  <Form.Label className="cultural-font-secondary">
                    📧 Email Address
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="cultural-font-secondary"
                  />
                </Form.Group>

                <Form.Group className="cultural-mb-4">
                  <Form.Label className="cultural-font-secondary">
                    🔒 Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    className="cultural-font-secondary"
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button 
                    type="submit" 
                    className="btn-cultural-primary"
                    size="lg"
                  >
                    🚪 Sign In
                  </Button>
                </div>
              </Form>

              <div className="cultural-text-center cultural-mt-4">
                <p className="cultural-font-secondary" style={{ color: 'var(--cultural-text-secondary)' }}>
                  Don't have an account?{' '}
                  <Link 
                    to="/register" 
                    style={{ 
                      color: 'var(--cultural-primary)', 
                      textDecoration: 'none',
                      fontWeight: '500'
                    }}
                  >
                    Create one here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
