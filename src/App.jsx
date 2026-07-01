import { useEffect, useState } from "react";
import { dishes, deliveryInfo } from "./data";
import Menu from "./components/Menu";
import Cart from "./components/Cart";
import PaymentModal from "./components/PaymentModal";
import OrderTracking from "./components/OrderTracking";
import "./App.css";

const ORDER_TRACKING_STORAGE_KEY = "orderTracking";

export default function App() {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showPayment, setShowPayment] = useState(false);
  const [screen, setScreen] = useState("menu");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(ORDER_TRACKING_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.startedAt === "number") {
          setOrder(parsed);
          setScreen("tracking");
        }
      }
    } catch {
      // sessionStorage unavailable — stay on "menu"
    }
  }, []);

  function addToCart(dish) {
    setCart([...cart, { ...dish, quantity: 1 }]);
  }

  function removeFromCart(id) {
    setCart(cart.filter((item) => item.id !== id));
  }

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

      {screen === "menu" && (
        <>
          <main className="app-main">
            <Menu
              dishes={dishes}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              onAddToCart={addToCart}
            />
            <Cart cart={cart} onRemove={removeFromCart} onCheckout={() => setShowPayment(true)} />
          </main>
          {showPayment && (
            <PaymentModal
              cart={cart}
              onClose={() => setShowPayment(false)}
              onTrackOrder={(orderData) => {
                const record = { ...orderData, startedAt: Date.now() };
                try {
                  sessionStorage.setItem(ORDER_TRACKING_STORAGE_KEY, JSON.stringify(record));
                } catch {
                  // storage blocked — tracking still works in-memory, just won't survive a reload
                }
                setOrder(record);
                setCart([]);
                setShowPayment(false);
                setScreen("tracking");
              }}
            />
          )}
        </>
      )}

      {screen === "tracking" && order && (
        <OrderTracking
          order={order}
          onDone={() => {
            try {
              sessionStorage.removeItem(ORDER_TRACKING_STORAGE_KEY);
            } catch {
              // ignore
            }
            setOrder(null);
            setScreen("menu");
          }}
        />
      )}
    </div>
  );
}
