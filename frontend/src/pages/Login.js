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
            🔑 Welcome Back
          </h1>
          <p style={{
            fontSize: '1.3rem',
            color: '#6b7280'
          }}>
            Sign in to continue your cultural journey
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
                    📧 Email Address
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
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
                    placeholder="Enter your password"
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
                >
                  🚪 Sign In
                </Button>
              </Form>

              <div style={{ textAlign: 'center' }}>
                <p style={{ 
                  color: '#6b7280',
                  fontSize: '1rem'
                }}>
                  Don't have an account?{' '}
                  <Link 
                    to="/register" 
                    style={{ 
                      color: '#3b82f6', 
                      textDecoration: 'none',
                      fontWeight: '600'
                    }}
                  >
                    Create one here
                  </Link>
                </p>
              </div>
        </div>
      </Container>
    </div>
  );
}
