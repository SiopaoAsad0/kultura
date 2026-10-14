import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Header({ user, setUser }) {
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch("http://127.0.0.1:8000/api/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      setOpen(false);
      navigate("/");
    }
  };

  const isCustomer = user && user.role === "user";
  const isSeller = user?.role === "weaver";
  const isAdmin = user?.role === "admin";

  const links = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    ...(isCustomer || !user ? [{ to: "/orders", label: "Order", hide: !user }] : []),
    ...(isSeller ? [{ to: "/dashboard", label: "Dashboard" }, { to: "/weaver/orders", label: "Seller Orders" }, { to: "/weaver/reviews", label: "Reviews" }] : []),
    ...(isAdmin ? [{ to: "/admin", label: "Admin" }] : []),
    { to: "/stories", label: "Stories" },
    { to: "/fundraising", label: "Fundraising" },
    { to: "/imagery", label: "Gallery" },
  ].filter((item) => !item.hide);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link className="brand" to="/">Kultura</Link>

        <nav className="desktop-nav" aria-label="Primary">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === "/"}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          {isCustomer && (
            <Link className="icon-chip" to="/cart" aria-label="Cart">
              🛒
              {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
            </Link>
          )}
          <button
            className="hamburger"
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {open && (
        <>
          <div className="menu-backdrop" onClick={() => setOpen(false)} />
          <nav className="paper-menu" aria-label="Mobile menu">
            <h3>Menu</h3>
            {links.map((link) => (
              <Link key={link.to} to={link.to}>{link.label}</Link>
            ))}
            {user ? (
              <>
                <div className="menu-divider" />
                <div className="menu-user">
                  <span className="menu-avatar" aria-hidden="true">
                    {(user.name || "U").charAt(0).toUpperCase()}
                  </span>
                  <span className="menu-user-meta">
                    <strong>{user.name}</strong>
                    <small>{user.role}</small>
                  </span>
                </div>
                <button className="menu-logout" type="button" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="menu-divider" />
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
          </nav>
        </>
      )}
    </header>
  );
}
