// frontend/src/pages/Cart.js
import { useCart } from "../context/CartContext";
import { Container, Table, Button } from "react-bootstrap";

export default function Cart() {
  const { cart, removeFromCart } = useCart();

  // Total price
  const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);

  return (
    <Container>
      <h1 className="mb-4">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>₱{item.price}</td>
                  <td>
                    <Button variant="danger" size="sm" onClick={() => removeFromCart(item.id)}>Remove</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <h4>Total: ₱{total.toFixed(2)}</h4>
          <Button variant="success">Checkout</Button>
        </>
      )}
    </Container>
  );
}
