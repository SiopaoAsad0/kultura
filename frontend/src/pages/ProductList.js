// frontend/src/pages/ProductList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Card, Container, Row, Col, Button } from "react-bootstrap";

export default function ProductList({ user }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <Container>
      <h1 className="mb-4">Our Products</h1>
      <Row>
        {products.map((product) => (
          <Col md={4} key={product.id} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{product.title}</Card.Title>
                <Card.Text>{product.story.substring(0, 80)}...</Card.Text>
                <Card.Text><strong>₱{product.price}</strong></Card.Text>
                <Button
                  as={Link}
                  to={`/products/${product.id}`}
                  variant="primary"
                >
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
