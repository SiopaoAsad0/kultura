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
        const res = await API.get("/cart");
        // Handle API response structure
        if (res.data.success && res.data.data && res.data.data.items) {
          setCart(res.data.data.items);
        } else {
          setCart([]);
        }
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
      await API.post("/cart/add", { 
        product_id: product.id, 
        quantity: 1 
      });
      // Refresh cart from API after adding
      const cartRes = await API.get("/cart");
      if (cartRes.data.success && cartRes.data.data && cartRes.data.data.items) {
        setCart(cartRes.data.data.items);
      }
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("Failed to add to cart. Please try again.");
    }
  };

  const removeFromCart = async (cartItemId) => {
    if (!user) return;
    try {
      await API.delete(`/cart/${cartItemId}`);
      // Refresh cart from API after removing
      const cartRes = await API.get("/cart");
      if (cartRes.data.success && cartRes.data.data && cartRes.data.data.items) {
        setCart(cartRes.data.data.items);
      }
    } catch (err) {
      console.error("Failed to remove from cart:", err);
      alert("Failed to remove item. Please try again.");
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
