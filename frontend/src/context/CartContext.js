import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children, user }) => {
  const [cart, setCart] = useState([]);

  // Load cart from API if user is logged in
  useEffect(() => {
    const fetchCart = async () => {
      if (!user) return;
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(res.data);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      }
    };
    fetchCart();
  }, [user]);

  const addToCart = async (product) => {
    if (!user) {
      alert("You must login first to add items to cart");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await API.post(
        "/cart/add",
        { product_id: product.id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart([...cart, { ...product, quantity: 1 }]);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  const removeFromCart = async (cartItemId) => {
    if (!user) return;
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/cart/${cartItemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(cart.filter((item) => item.id !== cartItemId));
    } catch (err) {
      console.error("Failed to remove from cart:", err);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
