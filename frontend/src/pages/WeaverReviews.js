import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import API from "../api/axios";
import StarRating from "../components/StarRating";
import { mediaUrl } from "../utils/media";

export default function WeaverReviews() {
  const [data, setData] = useState({ average_rating: 0, reviews: [] });

  useEffect(() => {
    API.get("/weaver/reviews")
      .then((res) => {
        const payload = res.data.data || {};
        setData({
          average_rating: payload.average_rating || 0,
          reviews: payload.reviews?.data || payload.reviews || [],
        });
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="page-container">
      <Container>
        <div className="header-cultural fade-in">
          <h1>Seller reviews</h1>
          <p>See how customers rated your delivered products</p>
        </div>
        <div className="stat-card mb-4" style={{ maxWidth: 320 }}>
          <div className="label">Average rating</div>
          <div className="value">{Number(data.average_rating).toFixed(1)} / 5</div>
          <StarRating value={data.average_rating} readOnly />
        </div>
        <div className="panel-card">
          {data.reviews.length === 0 && <p className="text-muted mb-0">No reviews yet.</p>}
          {data.reviews.map((review) => (
            <div key={review.id} className="d-flex gap-3 py-3 border-bottom">
              {review.product?.image_url && (
                <img src={mediaUrl(review.product.image_url)} alt="" width="72" height="72" style={{ objectFit: "cover", borderRadius: 12 }} />
              )}
              <div>
                <strong>{review.product?.title}</strong>
                <div className="d-flex align-items-center gap-2">
                  <StarRating value={review.rating} readOnly />
                  <span>{review.rating} / 5</span>
                </div>
                <div className="text-muted">{review.user?.name}: {review.comment || "No comment"}</div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
