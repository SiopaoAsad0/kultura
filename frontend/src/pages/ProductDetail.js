import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { Container, Button, Card } from "react-bootstrap";
import { useCart } from "../context/CartContext";

export default function ProductDetail({ user }) {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      alert("Please login first to add products to cart.");
      navigate("/login");
      return;
    }
    addToCart(product);
    alert("Product added to cart!");
  };

  return (
    <Container>
      <Card className="p-4">
        <h2>{product.title}</h2>
        <p>{product.story}</p>
        <p><strong>Price: </strong>${product.price}</p>
        <p><strong>Stock: </strong>{product.stock}</p>
        <Button
          variant={user ? "success" : "secondary"}
          onClick={handleAddToCart}
        >
          {user ? "Add to Cart" : "Login to Add"}
        </Button>
      </Card>
    </Container>
  );
}
