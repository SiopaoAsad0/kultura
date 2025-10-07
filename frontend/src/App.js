// frontend/src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import WeaverDashboard from "./pages/WeaverDashboard";
import { CartProvider } from "./context/CartContext";


export default function App() {
  const [user, setUser] = useState(null);

  // Load user from localStorage on page load
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  return (
    <Router>
    <CartProvider user={user}>
      <Header user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login setUser={setUser} />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />

        {user?.role === "weaver" && <Route path="/dashboard" element={<WeaverDashboard user={user} />} />}
        <Route path="/products" element={<ProductList user={user} />} />
        <Route path="/products/:id" element={<ProductDetail user={user} />} />
        {user && <Route path="/cart" element={<Cart />} />}
      </Routes>
    </CartProvider>
  </Router>
  );
}
