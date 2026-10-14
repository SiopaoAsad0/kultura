import { useEffect, useState, useCallback } from "react";
import { Container, Row, Col, Modal, Form, Button } from "react-bootstrap";
import API from "../../api/axios";

export default function ImageryGallery({ user }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("");
  const [imageLoading, setImageLoading] = useState({});
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    category: "cordillera",
    location: "",
    photographer_name: user?.name || "",
    photographer_email: user?.email || "",
    photographer_bio: "",
    tags: []
  });
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await API.get('/imageries');
        const imagesData = res.data.data?.data || res.data.data || [];
        setImages(Array.isArray(imagesData) ? imagesData : []);
      } catch (err) {
        console.error(err);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  const filteredImages = images.filter(image => 
    !filter || image.category === filter
  );

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const handleImageLoad = (imageId) => {
    setImageLoading(prev => ({ ...prev, [imageId]: false }));
  };

  const handleImageError = (imageId) => {
    setImageLoading(prev => ({ ...prev, [imageId]: false }));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Escape') {
      handleCloseModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploadError("");
    setUploadLoading(true);

    try {
      if (!selectedFile) {
        setUploadError("Please select an image file");
        setUploadLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('title', uploadForm.title);
      formData.append('description', uploadForm.description);
      formData.append('category', uploadForm.category);
      formData.append('location', uploadForm.location);
      formData.append('photographer_name', uploadForm.photographer_name);
      formData.append('photographer_email', uploadForm.photographer_email);
      formData.append('photographer_bio', uploadForm.photographer_bio);
      formData.append('tags', JSON.stringify(uploadForm.tags));

      const token = localStorage.getItem("token");
      const res = await API.post('/imageries', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (res.data.success) {
        setShowUploadModal(false);
        setUploadForm({
          title: "",
          description: "",
          category: "cordillera",
          location: "",
          photographer_name: user?.name || "",
          photographer_email: user?.email || "",
          photographer_bio: "",
          tags: []
        });
        setSelectedFile(null);
        // Refresh the images list
        const imagesRes = await API.get('/imageries');
        const imagesData = imagesRes.data.data?.data || imagesRes.data.data || [];
        setImages(Array.isArray(imagesData) ? imagesData : []);
      }
    } catch (err) {
      setUploadError(err.response?.data?.message || "Failed to upload image");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

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
            📸 Cultural Gallery
          </h1>
          <p style={{
            fontSize: '1.3rem',
            color: '#6b7280',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Explore the beauty and diversity of indigenous culture through photography
          </p>
        </div>

        {/* Category Filter and Upload Button */}
        <div style={{ 
          marginBottom: '3rem',
          padding: '0 2rem',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <Form.Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ 
                padding: '1rem 1.5rem',
                fontSize: '1.1rem',
                borderRadius: '12px',
                border: '2px solid #e5e7eb',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                maxWidth: '400px'
              }}
            >
              <option value="">All Categories</option>
              <option value="cordillera">Cordillera</option>
              <option value="culture">Culture</option>
              <option value="landscape">Landscape</option>
              <option value="people">People</option>
              <option value="architecture">Architecture</option>
              <option value="nature">Nature</option>
            </Form.Select>
            
            {user && (
              <Button
                onClick={() => setShowUploadModal(true)}
                style={{
                  background: '#10b981',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#059669';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#10b981';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                }}
              >
                📸 Upload Image
              </Button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="cultural-loading">
            <p>Loading gallery...</p>
          </div>
        )}

        {/* Images Grid */}
        {!loading && filteredImages.length > 0 && (
          <Row className="g-4">
            {filteredImages.map((image) => (
              <Col md={6} lg={4} key={image.id}>
                <div 
                  className="card-cultural" 
                  style={{ 
                    padding: '0',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}
                  onClick={() => handleImageClick(image)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                  }}
                >
                  {image.image_url && (
                    <div style={{
                      height: '300px',
                      position: 'relative',
                      background: '#f3f4f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <img
                        src={`http://127.0.0.1:8000${image.image_url}`}
                        alt={image.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: imageLoading[image.id] !== false ? 'none' : 'block'
                        }}
                        onLoad={() => handleImageLoad(image.id)}
                        onError={(e) => {
                          handleImageError(image.id);
                          // Hide the image and show local fallback instead
                          e.target.style.display = 'none';
                        }}
                      />
                      
                      {/* Loading state */}
                      {imageLoading[image.id] !== false && (
                        <div style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          color: '#6b7280',
                          fontSize: '1.2rem'
                        }}>
                          📸 Loading...
                        </div>
                      )}
                      
                      {/* Local fallback for failed images */}
                      {imageLoading[image.id] === false && (
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          padding: '1rem',
                          textAlign: 'center'
                        }}>
                          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🖼️</div>
                          <div style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                            {image.title}
                          </div>
                          <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                            Image unavailable
                          </div>
                        </div>
                      )}
                      

                      {/* Image overlay for better interaction */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(transparent 70%, rgba(0,0,0,0.3))',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'flex-end',
                        padding: '1rem',
                        pointerEvents: 'none'
                      }}>
                        <div style={{
                          background: 'rgba(255,255,255,0.9)',
                          padding: '0.5rem 1rem',
                          borderRadius: '20px',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          color: '#1e40af'
                        }}>
                          👁️ Click to view
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <span className="badge-cultural">{image.category}</span>
                    </div>

                    <h5 className="cultural-font-primary" style={{ 
                      color: '#1e40af',
                      marginBottom: '0.5rem',
                      fontSize: '1.1rem'
                    }}>
                      {image.title}
                    </h5>

                    {image.description && (
                      <p className="cultural-font-secondary" style={{ 
                        color: '#6b7280',
                        fontSize: '0.9rem',
                        marginBottom: '0.75rem'
                      }}>
                        {image.description.substring(0, 80)}...
                      </p>
                    )}

                    <div style={{ 
                      fontSize: '0.85rem',
                      color: '#6b7280',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid #d4c5b9'
                    }}>
                      📷 By {image.photographer_name || 'Unknown'}
                      {image.location && (
                        <>
                          <br />
                          📍 {image.location}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}

        {/* No Images Message */}
        {!loading && filteredImages.length === 0 && (
          <div className="container-cultural cultural-text-center">
            <div style={{ padding: '4rem 2rem' }}>
              <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🖼️</div>
              <h3 className="cultural-font-primary">No Images Found</h3>
              <p className="cultural-font-secondary" style={{ marginTop: '1rem' }}>
                {filter ? 'Try selecting a different category.' : 'Gallery images will appear here soon!'}
              </p>
            </div>
          </div>
        )}
      </Container>

      {/* Image Modal */}
      <Modal 
        show={showModal} 
        onHide={handleCloseModal} 
        size="lg"
        centered
        backdrop="static"
      >
        <Modal.Body style={{ padding: 0, position: 'relative' }}>
          {selectedImage && (
            <>
              <button
                onClick={handleCloseModal}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
              
              {selectedImage.image_url && (
                <>
                  <img 
                    src={`http://127.0.0.1:8000${selectedImage.image_url}`}
                    alt={selectedImage.title}
                    style={{
                      width: '100%',
                      maxHeight: '70vh',
                      objectFit: 'contain',
                      background: '#000'
                    }}
                    onError={(e) => {
                      // Hide the image and show local fallback instead
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  {/* Modal fallback for failed images */}
                  <div style={{
                    display: 'none',
                    width: '100%',
                    height: '400px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    textAlign: 'center',
                    padding: '2rem'
                  }}>
                    <div>
                      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🖼️</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                        {selectedImage.title}
                      </div>
                      <div style={{ fontSize: '1rem', opacity: 0.9 }}>
                        Image unavailable
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              <div style={{ padding: '2rem', background: '#fff' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <span className="badge-cultural">{selectedImage.category}</span>
                </div>
                
                <h3 className="cultural-font-primary" style={{ color: '#1e40af', marginBottom: '1rem' }}>
                  {selectedImage.title}
                </h3>
                
                {selectedImage.description && (
                  <p className="cultural-font-secondary" style={{ 
                    color: '#6b7280',
                    lineHeight: '1.7',
                    marginBottom: '1.5rem'
                  }}>
                    {selectedImage.description}
                  </p>
                )}
                
                <div style={{ 
                  paddingTop: '1rem',
                  borderTop: '2px solid #d4c5b9',
                  color: '#6b7280'
                }}>
                  <p style={{ marginBottom: '0.5rem' }}>
                    📷 <strong>Photographer:</strong> {selectedImage.photographer_name || 'Unknown'}
                  </p>
                  {selectedImage.location && (
                    <p style={{ marginBottom: '0.5rem' }}>
                      📍 <strong>Location:</strong> {selectedImage.location}
                    </p>
                  )}
                  {selectedImage.created_at && (
                    <p style={{ marginBottom: 0 }}>
                      📅 <strong>Captured:</strong> {new Date(selectedImage.created_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Upload Modal */}
      <Modal 
        show={showUploadModal} 
        onHide={() => setShowUploadModal(false)} 
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>📸 Upload New Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {uploadError && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1.5rem',
              color: '#dc2626'
            }}>
              ⚠️ {uploadError}
            </div>
          )}
          
          <Form onSubmit={handleUpload}>
            <Form.Group className="mb-3">
              <Form.Label>📷 Image File *</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                required
              />
              {selectedFile && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#6b7280' }}>
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Title *</Form.Label>
              <Form.Control
                type="text"
                value={uploadForm.title}
                onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                placeholder="Enter image title"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={uploadForm.description}
                onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                placeholder="Describe the image..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category *</Form.Label>
              <Form.Select
                value={uploadForm.category}
                onChange={(e) => setUploadForm({...uploadForm, category: e.target.value})}
                required
              >
                <option value="cordillera">Cordillera</option>
                <option value="culture">Culture</option>
                <option value="landscape">Landscape</option>
                <option value="people">People</option>
                <option value="architecture">Architecture</option>
                <option value="nature">Nature</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                value={uploadForm.location}
                onChange={(e) => setUploadForm({...uploadForm, location: e.target.value})}
                placeholder="Where was this taken?"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Photographer Name *</Form.Label>
              <Form.Control
                type="text"
                value={uploadForm.photographer_name}
                onChange={(e) => setUploadForm({...uploadForm, photographer_name: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Photographer Email *</Form.Label>
              <Form.Control
                type="email"
                value={uploadForm.photographer_email}
                onChange={(e) => setUploadForm({...uploadForm, photographer_email: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Photographer Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={uploadForm.photographer_bio}
                onChange={(e) => setUploadForm({...uploadForm, photographer_bio: e.target.value})}
                placeholder="Tell us about the photographer..."
              />
            </Form.Group>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <Button
                variant="secondary"
                onClick={() => setShowUploadModal(false)}
                disabled={uploadLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                style={{
                  background: '#10b981',
                  border: 'none',
                  padding: '0.75rem 2rem'
                }}
                disabled={uploadLoading}
              >
                {uploadLoading ? '⏳ Uploading...' : '📸 Upload Image'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
