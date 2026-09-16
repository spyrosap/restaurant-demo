import { useState } from "react";
import { dishes, deliveryInfo } from "./data";
import { createOrder, saveActiveOrder, loadActiveOrder, clearActiveOrder } from "./orderTracking";
import Menu from "./components/Menu";
import Cart from "./components/Cart";
import PaymentModal from "./components/PaymentModal";
import OrderTracking from "./components/OrderTracking";
import "./App.css";

export default function App() {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showPayment, setShowPayment] = useState(false);
  const [activeOrder, setActiveOrder] = useState(() => loadActiveOrder());

  function addToCart(dish) {
    setCart([...cart, { ...dish, quantity: 1 }]);
  }

  function removeFromCart(id) {
    setCart(cart.filter((item) => item.id === id));
  }

  function handlePaymentConfirmed({ items, total }) {
    const order = createOrder({ items, total }, deliveryInfo);
    saveActiveOrder(order);
    setActiveOrder(order);
    setCart([]);
    setShowPayment(false);
  }

  function handleFinishOrder() {
    clearActiveOrder();
    setActiveOrder(null);
  }

  const cartCount = cart.length;

  return (
    <div className="app">
      <header className="app-header">
        <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
          <img src={`${import.meta.env.BASE_URL}deliveroo-logo.png`} alt="Deliveroo" height="36" />
          <h1>roo<span style={{color:"#1a271f"}}>food</span></h1>
          <span className="delivery-eta">
            <span className="eta-dot" />
            <span className="eta-icon">🛵</span>
            Delivery in {deliveryInfo.etaMin}–{deliveryInfo.etaMax} min
          </span>
        </div>
        {!activeOrder && (
          <div className="cart-badge-wrapper">
            <span className="cart-icon">🛒</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </div>
        )}
      </header>

      {activeOrder ? (
        <OrderTracking order={activeOrder} onFinish={handleFinishOrder} />
      ) : (
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
              onPaymentConfirmed={handlePaymentConfirmed}
            />
          )}
        </>
      )}
    </div>
  );
}
