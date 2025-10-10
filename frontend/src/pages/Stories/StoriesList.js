import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import API from "../../api/axios";

export default function StoriesList({ user }) {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await API.get('/stories');
        const storiesData = res.data.data?.data || res.data.data || [];
        setStories(Array.isArray(storiesData) ? storiesData : []);
      } catch (err) {
        console.error(err);
        setStories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  const filteredStories = stories.filter(story => {
    const matchesSearch = story.title?.toLowerCase().includes(search.toLowerCase()) ||
                         story.excerpt?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !category || story.category === category;
    return matchesSearch && matchesCategory;
  });

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
            📖 Cultural Stories
          </h1>
          <p style={{
            fontSize: '1.3rem',
            color: '#6b7280',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Discover the rich traditions and heritage of indigenous communities
          </p>
        </div>

        {/* Create Story Button */}
        {user && user.role !== 'weaver' && (
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '3rem',
            padding: '0 2rem'
          }}>
            <Button as={Link} to="/stories/create" className="btn-cultural-primary" style={{
              padding: '1.2rem 3rem',
              fontSize: '1.1rem',
              fontWeight: '700',
              borderRadius: '12px',
              boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)'
            }}>
              ✍️ Share Your Story
            </Button>
          </div>
        )}

        {/* Search and Filter */}
        <div style={{ 
          marginBottom: '3rem',
          padding: '0 2rem'
        }}>
          <Row className="g-3">
            <Col md={8}>
              <Form.Control
                type="text"
                placeholder="🔍 Search stories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ 
                  padding: '1rem 1.5rem',
                  fontSize: '1.1rem',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}
              />
            </Col>
            <Col md={4}>
              <Form.Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ 
                  padding: '1rem 1.5rem',
                  fontSize: '1.1rem',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}
              >
                <option value="">All Categories</option>
                <option value="cordillera">Cordillera</option>
                <option value="culture">Culture</option>
                <option value="heritage">Heritage</option>
              </Form.Select>
            </Col>
          </Row>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="cultural-loading">
            <p>Loading stories...</p>
          </div>
        )}

        {/* Stories Grid */}
        {!loading && filteredStories.length > 0 && (
          <Row className="g-4">
            {filteredStories.map((story) => (
              <Col md={6} lg={4} key={story.id}>
                <div className="card-cultural" style={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '0',
                  overflow: 'hidden'
                }}>
                  {story.featured_image_url && (
                    <div style={{
                      height: '200px',
                      backgroundImage: `url(${story.featured_image_url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}></div>
                  )}
                  
                  <div style={{ padding: '1.5rem', flex: '1', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: '1rem' }}>
                      <span className="badge-cultural">{story.category}</span>
                    </div>

                    <h4 className="cultural-font-primary" style={{ 
                      color: '#1e40af',
                      marginBottom: '0.75rem',
                      fontSize: '1.3rem'
                    }}>
                      {story.title}
                    </h4>

                    <p className="cultural-font-secondary" style={{ 
                      color: '#6b7280',
                      fontSize: '0.95rem',
                      lineHeight: '1.6',
                      marginBottom: '1rem',
                      flex: '1'
                    }}>
                      {story.excerpt?.substring(0, 150)}...
                    </p>

                    <div style={{ 
                      paddingTop: '1rem',
                      borderTop: '1px solid #d4c5b9',
                      fontSize: '0.85rem',
                      color: '#6b7280',
                      marginBottom: '1rem'
                    }}>
                      👤 By {story.author_name}
                      <br />
                      📖 {story.reading_time} • 👁️ {story.views_count || 0} views
                    </div>

                    <Button 
                      as={Link} 
                      to={`/stories/${story.slug}`}
                      className="btn-cultural-primary"
                      style={{ width: '100%' }}
                    >
                      Read Story →
                    </Button>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}

        {/* No Stories Message */}
        {!loading && filteredStories.length === 0 && (
          <div className="container-cultural cultural-text-center">
            <div style={{ padding: '4rem 2rem' }}>
              <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>📚</div>
              <h3 className="cultural-font-primary">No Stories Found</h3>
              <p className="cultural-font-secondary" style={{ marginTop: '1rem' }}>
                {search || category ? 'Try adjusting your search filters.' : 'Be the first to share your cultural story!'}
              </p>
              {user && user.role !== 'weaver' && (
                <Button as={Link} to="/stories/create" className="btn-cultural-primary" style={{ marginTop: '1.5rem' }}>
                  ✍️ Create First Story
                </Button>
              )}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
