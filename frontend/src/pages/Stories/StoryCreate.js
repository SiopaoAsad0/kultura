import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import API from "../../api/axios";
import BackButton from "../../components/BackButton";

export default function StoryCreate({ user }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "cordillera",
    author_name: user?.name || "",
    location: "",
    status: "published"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {

      const token = localStorage.getItem("token");
      const res = await API.post('/stories', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Story created successfully!');
      navigate(`/stories/${res.data.data.slug}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create story");
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="page-container">
        <Container>
          <div className="container-cultural cultural-text-center">
            <h3>Login Required</h3>
            <p>Please log in to create stories.</p>
            <Button onClick={() => navigate('/login')} className="btn-cultural-primary">
              Login
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Container>
        <BackButton to="/stories" />

        <div className="header-cultural fade-in">
          <h1>✍️ Create Your Story</h1>
          <p>Share your cultural heritage</p>
        </div>

        <div className="container-cultural fade-in">
          {error && <div className="alert-cultural-error">⚠️ {error}</div>}

          <Form onSubmit={handleSubmit} className="form-cultural">
            <Row>
              <Col md={8}>
                <Form.Group className="cultural-mb-3">
                  <Form.Label>📝 Title *</Form.Label>
                  <Form.Control
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="cultural-mb-3">
                  <Form.Label>📂 Category *</Form.Label>
                  <Form.Select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="cordillera">Cordillera</option>
                    <option value="culture">Culture</option>
                    <option value="heritage">Heritage</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="cultural-mb-3">
              <Form.Label>📄 Excerpt *</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                required
                maxLength={500}
              />
            </Form.Group>

            <Form.Group className="cultural-mb-3">
              <Form.Label>📖 Content *</Form.Label>
              <Form.Control
                as="textarea"
                rows={12}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="cultural-mb-3">
                  <Form.Label>👤 Author Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={form.author_name}
                    onChange={(e) => setForm({ ...form, author_name: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="cultural-mb-3">
                  <Form.Label>📍 Location</Form.Label>
                  <Form.Control
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button 
              type="submit" 
              className="btn-cultural-primary"
              disabled={loading}
              style={{ padding: '1rem 2rem' }}
            >
              {loading ? '⏳ Publishing...' : '📤 Publish Story'}
            </Button>
          </Form>
        </div>
      </Container>
    </div>
  );
}
