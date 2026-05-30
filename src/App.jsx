import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "./App.css";

export default function App() {
  const [cart, setCart] = useState([]);
  // Which restaurant the current cart belongs to (cart holds one at a time).
  const [cartRestaurantId, setCartRestaurantId] = useState(null);

  // BUG #6: cart.length counts duplicate entries, not unique items with quantities
  const cartCount = cart.length;

  return (
    <div className="app">
      <header className="app-header">
        <Link to="/" className="brand-link">
          <img src="/restaurant-demo/deliveroo-logo.png" alt="Deliveroo" height="36" />
          <h1>roo<span style={{ color: "#1a271f" }}>food</span></h1>
        </Link>
        <div className="cart-badge-wrapper">
          <span className="cart-icon">🛒</span>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </div>
      </header>

      <main className="app-main">
        <Outlet context={{ cart, setCart, cartRestaurantId, setCartRestaurantId }} />
      </main>
    </div>
  );
}
