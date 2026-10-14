export default function StarRating({ value = 0, onChange, size = "1.25rem", readOnly = false }) {
  const rating = Number(value) || 0;

  return (
    <div className="star-rating" role={readOnly ? "img" : "radiogroup"} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(rating);
        return (
          <button
            key={star}
            type="button"
            className={`star-btn ${filled ? "is-filled" : ""}`}
            style={{ fontSize: size }}
            disabled={readOnly}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            onClick={() => !readOnly && onChange?.(star)}
          >
            {filled ? "★" : "☆"}
          </button>
        );
      })}
    </div>
  );
}
