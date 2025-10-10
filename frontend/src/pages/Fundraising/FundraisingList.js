import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, ProgressBar, Form } from "react-bootstrap";
import API from "../../api/axios";

export default function FundraisingList({ user }) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ category: "", status: "" });

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await API.get('/fundraisings');
        const campaignsData = res.data.data?.data || res.data.data || [];
        setCampaigns(Array.isArray(campaignsData) ? campaignsData : []);
      } catch (err) {
        console.error(err);
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesCategory = !filter.category || campaign.category === filter.category;
    const matchesStatus = !filter.status || campaign.status === filter.status;
    return matchesCategory && matchesStatus;
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
            💰 Fundraising Campaigns
          </h1>
          <p style={{
            fontSize: '1.3rem',
            color: '#6b7280',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Support community projects and cultural preservation initiatives
          </p>
        </div>

        {/* Filters */}
        <div style={{ 
          marginBottom: '3rem',
          padding: '0 2rem'
        }}>
          <Row className="g-3">
            <Col md={6}>
              <Form.Select
                value={filter.category}
                onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                style={{ 
                  padding: '1rem 1.5rem',
                  fontSize: '1.1rem',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}
              >
                <option value="">All Categories</option>
                <option value="education">Education</option>
                <option value="health">Health</option>
                <option value="preservation">Cultural Preservation</option>
                <option value="community">Community Development</option>
              </Form.Select>
            </Col>
            <Col md={6}>
              <Form.Select
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                style={{ 
                  padding: '1rem 1.5rem',
                  fontSize: '1.1rem',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </Form.Select>
            </Col>
          </Row>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="cultural-loading">
            <p>Loading campaigns...</p>
          </div>
        )}

        {/* Campaigns Grid */}
        {!loading && filteredCampaigns.length > 0 && (
          <Row className="g-4">
            {filteredCampaigns.map((campaign) => (
              <Col md={6} lg={4} key={campaign.id}>
                <Link 
                  to={`/fundraising/${campaign.slug}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="card-cultural" style={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '0',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                  }}>
                    
                    {campaign.featured_image_url && (
                      <div style={{
                        height: '200px',
                        backgroundImage: `url(${campaign.featured_image_url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}></div>
                    )}
                    
                    <div style={{ padding: '1.5rem', flex: '1', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ marginBottom: '1rem' }}>
                        <span className="badge-cultural">{campaign.category}</span>
                        <span className={`badge-cultural ${campaign.status === 'active' ? 'badge-active' : ''}`} 
                              style={{ marginLeft: '0.5rem', background: campaign.status === 'active' ? '#10b981' : '#6b7280' }}>
                          {campaign.status}
                        </span>
                      </div>

                      <h4 className="cultural-font-primary" style={{ 
                        color: '#1e40af',
                        marginBottom: '0.75rem',
                        fontSize: '1.3rem',
                        minHeight: '2.6rem'
                      }}>
                        {campaign.title}
                      </h4>

                      <p className="cultural-font-secondary" style={{ 
                        color: '#6b7280',
                        fontSize: '0.95rem',
                        lineHeight: '1.6',
                        marginBottom: '1rem',
                        flex: '1'
                      }}>
                        {campaign.description?.substring(0, 100)}...
                      </p>

                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          marginBottom: '0.5rem',
                          fontSize: '0.9rem'
                        }}>
                          <span style={{ fontWeight: '700', color: '#d97706' }}>
                            {campaign.formatted_current_amount || `₱${parseFloat(campaign.current_amount || 0).toLocaleString()}`}
                          </span>
                          <span style={{ color: '#6b7280' }}>
                            {campaign.formatted_target_amount || `₱${parseFloat(campaign.target_amount || 0).toLocaleString()}`}
                          </span>
                        </div>
                        <ProgressBar 
                          now={campaign.progress_percentage || 0} 
                          style={{ height: '8px' }}
                        />
                      </div>

                      <div style={{ 
                        fontSize: '0.85rem',
                        color: '#6b7280',
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}>
                        <span>👥 {campaign.donors_count || 0} donors</span>
                        <span>⏰ {campaign.days_remaining || 0} days left</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </Col>
            ))}
          </Row>
        )}

        {/* No Campaigns Message */}
        {!loading && filteredCampaigns.length === 0 && (
          <div className="container-cultural cultural-text-center">
            <div style={{ padding: '4rem 2rem' }}>
              <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>💝</div>
              <h3 className="cultural-font-primary">No Campaigns Found</h3>
              <p className="cultural-font-secondary" style={{ marginTop: '1rem' }}>
                {filter.category || filter.status ? 'Try adjusting your filters.' : 'Check back soon for new fundraising campaigns!'}
              </p>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
