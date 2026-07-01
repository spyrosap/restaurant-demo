import { useState, useRef } from "react";
import { dishes, deliveryInfo } from "./data";
import Menu from "./components/Menu";
import Cart from "./components/Cart";
import PaymentModal from "./components/PaymentModal";
import ConciergeBar from "./components/ConciergeBar";
import UndoToast from "./components/UndoToast";
import { track } from "./analytics";
import "./App.css";

let guestIdCounter = 1;
let removalIdCounter = 1;

export default function App() {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showPayment, setShowPayment] = useState(false);
  const [guests, setGuests] = useState([]);
  const [paymentMode, setPaymentMode] = useState("single");
  const [pendingRemoval, setPendingRemoval] = useState(null);
  const [pulseKey, setPulseKey] = useState(0);
  const undoTimerRef = useRef(null);

  const canGroupOrder = guests.length >= 2;
  const effectivePaymentMode = canGroupOrder ? paymentMode : "single";

  function addToCart(dish) {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...dish, quantity: 1, guestId: null }];
    });
    track("cart_item_added", { dish_id: dish.id, source: "menu" });
    setPulseKey((k) => k + 1);
  }

  function changeQuantity(id, direction) {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const newQuantity =
          direction === "inc" ? item.quantity + 1 : Math.max(1, item.quantity - 1);
        track("cart_item_quantity_changed", {
          dish_id: id,
          direction,
          new_quantity: newQuantity,
        });
        return { ...item, quantity: newQuantity };
      })
    );
  }

  function requestRemoveFromCart(id) {
    const item = cart.find((i) => i.id === id);
    if (!item) return;

    if (undoTimerRef.current) {
      clearTimeout(undoTimerRef.current);
      undoTimerRef.current = null;
    }

    setCart((prev) => prev.filter((i) => i.id !== id));
    track("cart_item_removed", { dish_id: id, quantity_at_removal: item.quantity });

    const removalId = removalIdCounter++;
    setPendingRemoval({ item, removalId });
    undoTimerRef.current = setTimeout(() => {
      setPendingRemoval(null);
      undoTimerRef.current = null;
    }, 3000);
  }

  function undoRemove() {
    if (!pendingRemoval) return;
    if (undoTimerRef.current) {
      clearTimeout(undoTimerRef.current);
      undoTimerRef.current = null;
    }
    track("cart_item_undo_clicked", { dish_id: pendingRemoval.item.id });
    setCart((prev) => [...prev, pendingRemoval.item]);
    setPendingRemoval(null);
  }

  function assignGuest(dishId, guestId) {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id !== dishId) return item;
        const reassigned = item.guestId != null && item.guestId !== guestId;
        track("dish_assigned_to_guest", { dish_id: dishId, guest_id: guestId, reassigned });
        return { ...item, guestId: guestId || null };
      })
    );
  }

  function addGuest(name) {
    setGuests((prev) => {
      const next = [...prev, { id: guestIdCounter++, name }];
      track("guest_added", { guest_count_after: next.length });
      return next;
    });
  }

  function removeGuest(id) {
    const hadAssignedItems = cart.some((item) => item.guestId === id);
    setGuests((prev) => prev.filter((g) => g.id !== id));
    setCart((prev) =>
      prev.map((item) => (item.guestId === id ? { ...item, guestId: null } : item))
    );
    track("guest_removed", { had_assigned_items: hadAssignedItems });
  }

  function changePaymentMode(mode) {
    setPaymentMode(mode);
    track("payment_mode_selected", { mode, guest_count: guests.length });
  }

  function fillCart(items) {
    setCart(items.map((item) => ({ ...item, guestId: item.guestId ?? null })));
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
          <span className="cart-icon" key={pulseKey}>🛒</span>
          {cartCount > 0 && (
            <span className="cart-badge" key={`badge-${pulseKey}`}>{cartCount}</span>
          )}
        </div>
      </header>

      <ConciergeBar onFillCart={fillCart} />

      <main className="app-main">
        <Menu
          dishes={dishes}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onAddToCart={addToCart}
        />
        <Cart
          cart={cart}
          guests={guests}
          canGroupOrder={canGroupOrder}
          paymentMode={effectivePaymentMode}
          onPaymentModeChange={changePaymentMode}
          onIncrement={(id) => changeQuantity(id, "inc")}
          onDecrement={(id) => changeQuantity(id, "dec")}
          onRequestRemove={requestRemoveFromCart}
          onAssignGuest={assignGuest}
          onAddGuest={addGuest}
          onRemoveGuest={removeGuest}
          onCheckout={() => setShowPayment(true)}
        />
      </main>

      <UndoToast pendingRemoval={pendingRemoval} onUndo={undoRemove} />

      {showPayment && (
        <PaymentModal
          cart={cart}
          guests={guests}
          paymentMode={effectivePaymentMode}
          onClose={() => setShowPayment(false)}
          onSuccess={() => { setCart([]); setShowPayment(false); }}
        />
      )}
    </div>
  );
}
