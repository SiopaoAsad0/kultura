import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import API from "../../api/axios";
import BackButton from "../../components/BackButton";

export default function StoryDetail({ user }) {
  const { slug } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await API.get(`/stories/${slug}`);
        setStory(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStory();
  }, [slug]);

  if (loading) {
    return (
      <div className="page-container">
        <Container>
          <div className="cultural-loading">
            <p>Loading story...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="page-container">
        <Container>
          <div className="container-cultural cultural-text-center">
            <h3>Story Not Found</h3>
            <Button as={Link} to="/stories" className="btn-cultural-primary">
              ← Back to Stories
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

        <article className="container-cultural fade-in">
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <span className="badge-cultural">{story.category}</span>
            {story.is_featured && (
              <span className="badge-cultural" style={{ marginLeft: '0.5rem', background: '#d97706' }}>
                ⭐ Featured
              </span>
            )}
            
            <h1 className="cultural-font-primary" style={{ 
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              marginTop: '1.5rem',
              marginBottom: '1rem'
            }}>
              {story.title}
            </h1>

            <div className="cultural-font-secondary" style={{ fontSize: '0.95rem' }}>
              👤 By {story.author_name}
              {story.location && ` • 📍 ${story.location}`}
              <br />
              📖 {story.reading_time} • 👁️ {story.views_count} views
            </div>
          </div>

          {story.featured_image_url && (
            <div style={{ marginBottom: '2rem' }}>
              <img 
                src={story.featured_image_url}
                alt={story.title}
                style={{
                  width: '100%',
                  borderRadius: '12px',
                  maxHeight: '500px',
                  objectFit: 'cover'
                }}
              />
            </div>
          )}

          {story.excerpt && (
            <div style={{
              background: '#dbeafe',
              border: '2px solid #3b82f6',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <p style={{ fontSize: '1.2rem', fontStyle: 'italic', marginBottom: 0 }}>
                {story.excerpt}
              </p>
            </div>
          )}

          <div className="cultural-font-secondary" style={{
            fontSize: '1.1rem',
            lineHeight: '1.9'
          }}>
            {story.content?.split('\n').map((p, idx) => (
              <p key={idx} style={{ marginBottom: '1.5rem' }}>{p}</p>
            ))}
          </div>
        </article>
      </Container>
    </div>
  );
}
