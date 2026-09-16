import { useState } from "react";
import { dishes, deliveryInfo, TAX_RATE, deliveryFee, MAX_GROUP_PARTICIPANTS } from "./data";
import Menu from "./components/Menu";
import Cart from "./components/Cart";
import GuestManager from "./components/GuestManager";
import SplitReviewModal from "./components/SplitReviewModal";
import PaymentModal from "./components/PaymentModal";
import { computeBreakdown, track } from "./utils/splitBill";
import "./App.css";

const INITIAL_GUESTS = [{ id: "me", name: "Moi (Initiateur)" }];

export default function App() {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [guests, setGuests] = useState(INITIAL_GUESTS);
  const [showGuestManager, setShowGuestManager] = useState(false);
  const [showSplitReview, setShowSplitReview] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const isGroupOrder = guests.length > 1;

  function addToCart(dish) {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...dish, quantity: 1, assignedTo: "me" }];
    });
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  function assignItem(id, assignedTo) {
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, assignedTo } : item)));
  }

  function addGuest(name) {
    const wasSolo = guests.length === 1;
    const newGuest = { id: crypto.randomUUID(), name };
    setGuests((prev) => [...prev, newGuest]);
    if (wasSolo) {
      track("group_order_created", { numGuests: 1, restaurantId: "demo-restaurant" });
    }
  }

  function renameGuest(id, name) {
    setGuests((prev) => prev.map((g) => (g.id === id ? { ...g, name } : g)));
  }

  function removeGuest(id) {
    setGuests((prev) => prev.filter((g) => g.id !== id));
    // EC4: articles individually assigned to the removed guest fall back to the initiator.
    setCart((prev) =>
      prev.map((item) => (item.assignedTo === id ? { ...item, assignedTo: "me" } : item))
    );
  }

  function openSplitReview() {
    track("split_bill_reviewed", { numGuests: guests.length });
    setShowSplitReview(true);
  }

  function handleCheckout() {
    if (isGroupOrder) {
      openSplitReview();
    } else {
      setShowPayment(true);
    }
  }

  function handleConfirmSplit() {
    setShowSplitReview(false);
    setShowPayment(true);
  }

  function handlePaymentSuccess() {
    setCart([]);
    setGuests(INITIAL_GUESTS);
    setShowPayment(false);
  }

  const cartCount = cart.length;
  const split = isGroupOrder
    ? computeBreakdown({ cart, guests, deliveryFee, taxRate: TAX_RATE })
    : null;

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
          guests={guests}
          onRemove={removeFromCart}
          onAssignItem={assignItem}
          onOpenGuestManager={() => setShowGuestManager(true)}
          onCheckout={handleCheckout}
        />
      </main>

      {showGuestManager && (
        <GuestManager
          guests={guests}
          maxParticipants={MAX_GROUP_PARTICIPANTS}
          onAdd={addGuest}
          onRename={renameGuest}
          onRemove={removeGuest}
          onClose={() => setShowGuestManager(false)}
        />
      )}

      {showSplitReview && (
        <SplitReviewModal
          cart={cart}
          guests={guests}
          deliveryFee={deliveryFee}
          taxRate={TAX_RATE}
          onClose={() => setShowSplitReview(false)}
          onConfirm={handleConfirmSplit}
        />
      )}

      {showPayment && (
        <PaymentModal
          cart={cart}
          split={split}
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
