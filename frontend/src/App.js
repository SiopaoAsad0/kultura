import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import ActivityTracker from "./components/ActivityTracker";
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
import WeaverReviews from "./pages/WeaverReviews";
import AdminDashboard from "./pages/AdminDashboard";
import StoriesList from "./pages/Stories/StoriesList";
import StoryDetail from "./pages/Stories/StoryDetail";
import StoryCreate from "./pages/Stories/StoryCreate";
import FundraisingList from "./pages/Fundraising/FundraisingList";
import FundraisingDetail from "./pages/Fundraising/FundraisingDetail";
import ImageryGallery from "./pages/Imagery/ImageryGallery";
import { CartProvider } from "./context/CartContext";

function Guard({ user, roles, children }) {
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <Router>
      <CartProvider user={user}>
        <div className="app-shell">
          <Header user={user} setUser={setUser} />
          <ActivityTracker />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={user ? <Navigate to="/" /> : <Login setUser={setUser} />} />
              <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />

              <Route path="/dashboard" element={<Guard user={user} roles={["weaver"]}><WeaverDashboard user={user} /></Guard>} />
              <Route path="/weaver/orders" element={<Guard user={user} roles={["weaver"]}><WeaverOrders /></Guard>} />
              <Route path="/weaver/reviews" element={<Guard user={user} roles={["weaver"]}><WeaverReviews /></Guard>} />
              <Route path="/admin" element={<Guard user={user} roles={["admin"]}><AdminDashboard /></Guard>} />

              <Route path="/products" element={<ProductList user={user} />} />
              <Route path="/products/:id" element={<ProductDetail user={user} />} />

              <Route path="/cart" element={<Guard user={user} roles={["user"]}><Cart /></Guard>} />
              <Route path="/checkout" element={<Guard user={user} roles={["user"]}><Checkout user={user} /></Guard>} />
              <Route path="/orders" element={<Guard user={user} roles={["user"]}><OrderHistory user={user} /></Guard>} />
              <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />

              <Route path="/stories" element={<StoriesList user={user} />} />
              <Route path="/stories/:slug" element={<StoryDetail user={user} />} />
              <Route path="/stories/create" element={<Guard user={user}><StoryCreate user={user} /></Guard>} />

              <Route path="/fundraising" element={<FundraisingList user={user} />} />
              <Route path="/fundraising/:slug" element={<FundraisingDetail user={user} />} />
              <Route path="/imagery" element={<ImageryGallery user={user} />} />
            </Routes>
          </main>
        </div>
      </CartProvider>
    </Router>
  );
}
