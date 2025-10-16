// frontend/src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderHistory from "./pages/OrderHistory";
import Login from "./pages/Login";
import Register from "./pages/Register";
import WeaverDashboard from "./pages/WeaverDashboard";
import WeaverOrders from "./pages/WeaverOrders";
import StoriesList from "./pages/Stories/StoriesList";
import StoryDetail from "./pages/Stories/StoryDetail";
import StoryCreate from "./pages/Stories/StoryCreate";
import FundraisingList from "./pages/Fundraising/FundraisingList";
import FundraisingDetail from "./pages/Fundraising/FundraisingDetail";
import ImageryGallery from "./pages/Imagery/ImageryGallery";
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
        {user?.role === "weaver" && <Route path="/weaver/orders" element={<WeaverOrders />} />}
        
        {/* Products */}
        <Route path="/products" element={<ProductList user={user} />} />
        <Route path="/products/:id" element={<ProductDetail user={user} />} />
        
        {/* Cart & Orders */}
        {user && <Route path="/cart" element={<Cart />} />}
        {user && <Route path="/checkout" element={<Checkout user={user} />} />}
        {user && <Route path="/orders" element={<OrderHistory user={user} />} />}
        <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
        
        {/* Stories */}
        <Route path="/stories" element={<StoriesList user={user} />} />
        <Route path="/stories/:slug" element={<StoryDetail user={user} />} />
        {user && <Route path="/stories/create" element={<StoryCreate user={user} />} />}
        
        {/* Fundraising */}
        <Route path="/fundraising" element={<FundraisingList user={user} />} />
        <Route path="/fundraising/:slug" element={<FundraisingDetail user={user} />} />
        
        {/* Gallery */}
        <Route path="/imagery" element={<ImageryGallery user={user} />} />
      </Routes>
    </CartProvider>
  </Router>
  );
}