import { useEffect, useState } from "react";
import API from "../api/axios";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get("/products")
    .then((res) => setProducts(res.data))
    .catch(err => console.error(err));
  }, []);

  return (
    <Container>
      <h1 className="mb-4">Indigenous Products</h1>
      <Row>
        {products.map((p) => (
          <Col md={4} key={p.id} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{p.title}</Card.Title>
                <Card.Text>{p.story.substring(0, 80)}...</Card.Text>
                <Card.Text><strong>${p.price}</strong></Card.Text>
                <Button as={Link} to={`/products/${p.id}`} variant="primary">View</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
