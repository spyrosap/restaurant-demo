import { useState, useRef, useMemo } from "react";
import { dishes, deliveryInfo } from "./data";
import Menu from "./components/Menu";
import Cart from "./components/Cart";
import PaymentModal from "./components/PaymentModal";
import { applyVegetarianFilter } from "./utils/vegetarianFilter";
import "./App.css";

export default function App() {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showPayment, setShowPayment] = useState(false);
  const [isVegetarianActive, setIsVegetarianActive] = useState(false);
  const vegActivatedAtRef = useRef(null);

  function addToCart(dish) {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...dish, quantity: 1 }];
    });
  }

  function removeFromCart(id) {
    setCart(cart.filter((item) => item.id !== id));
  }

  function toggleVegetarianFilter() {
    if (!isVegetarianActive) {
      const { nbTransformed, nbHidden } = applyVegetarianFilter(dishes);
      console.log("vegetarian_filter_activated", {
        restaurant_id: "demo",
        page: "menu",
        nb_items_transformed: nbTransformed,
        nb_items_hidden: nbHidden,
      });
      vegActivatedAtRef.current = Date.now();
      setIsVegetarianActive(true);
    } else {
      const durationSeconds = Math.round((Date.now() - vegActivatedAtRef.current) / 1000);
      console.log("vegetarian_filter_deactivated", {
        restaurant_id: "demo",
        page: "menu",
        duration_active_seconds: durationSeconds,
      });
      vegActivatedAtRef.current = null;
      setIsVegetarianActive(false);
    }
  }

  const visibleDishes = useMemo(
    () => (isVegetarianActive ? applyVegetarianFilter(dishes).dishes : dishes),
    [isVegetarianActive]
  );

  const cartCount = cart.length;

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
          dishes={visibleDishes}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onAddToCart={addToCart}
          isVegetarianActive={isVegetarianActive}
          onToggleVegetarian={toggleVegetarianFilter}
        />
        <Cart cart={cart} onRemove={removeFromCart} onCheckout={() => setShowPayment(true)} />
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
