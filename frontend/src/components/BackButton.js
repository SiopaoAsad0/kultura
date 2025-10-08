import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

export default function BackButton({ to = null, label = "← Back" }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <Button
      onClick={handleBack}
      style={{
        background: 'linear-gradient(135deg, #5a3825 0%, #a0522d 100%)',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        color: 'white',
        fontSize: '0.95rem',
        fontWeight: '600',
        padding: '0.6rem 1.5rem',
        borderRadius: '10px',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 8px rgba(44, 24, 16, 0.3)',
        marginBottom: '1.5rem',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateX(-4px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(44, 24, 16, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateX(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(44, 24, 16, 0.3)';
      }}
    >
      {label}
    </Button>
  );
}
