import { useState } from "react";
import { dishes, deliveryInfo } from "./data";
import Menu from "./components/Menu";
import Cart from "./components/Cart";
import PaymentModal from "./components/PaymentModal";
import "./App.css";

export default function App() {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showPayment, setShowPayment] = useState(false);

  function addToCart(dish) {
    const existing = cart.find((item) => item.id === dish.id);
    if (existing) {
      setCart(cart.map((item) => item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...dish, quantity: 1 }]);
    }
  }

  function removeFromCart(id) {
    setCart(cart.filter((item) => item.id !== id));
  }

  function incrementQty(id) {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }

  function decrementQty(id) {
    // decrease by one, and drop the line entirely if it reaches zero
    setCart(
      cart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app">
      <header className="app-header">
        <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
          <img src="/restaurant-demo/deliveroo-logo.png" alt="Deliveroo" height="36" />
          <h1>roo<span style={{color:"#1a271f"}}>food</span></h1>
          <span className="delivery-eta">
            <span className="eta-dot" />
            <span className="eta-icon">🛵</span>
            Delivery in {deliveryInfo.etaMin}–{deliveryInfo.etaMax} min
          </span>
        </div>
        <div className="cart-badge-wrapper">
          <span className="cart-icon">🛒</span>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </div>
      </header>

      <main className="app-main">
        <Menu
          dishes={dishes}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onAddToCart={addToCart}
        />
        <Cart
          cart={cart}
          onRemove={removeFromCart}
          onIncrement={incrementQty}
          onDecrement={decrementQty}
          onCheckout={() => setShowPayment(true)}
        />
      </main>
      {showPayment && (
        <PaymentModal
          cart={cart}
          onClose={() => setShowPayment(false)}
          onSuccess={() => { setCart([]); setShowPayment(false); }}
        />
      )}
    </div>
  );
}
