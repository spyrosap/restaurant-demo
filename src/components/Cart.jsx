import { useState } from "react";
import GuestManager from "./GuestManager";
import { track } from "../analytics";

export default function Cart({
  cart,
  guests,
  canGroupOrder,
  paymentMode,
  onPaymentModeChange,
  onIncrement,
  onDecrement,
  onRequestRemove,
  onAssignGuest,
  onAddGuest,
  onRemoveGuest,
  onCheckout,
}) {
  const [validationAttempted, setValidationAttempted] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.20;
  const total = subtotal + tax;

  const emptyGuests = guests.filter(
    (guest) => !cart.some((item) => item.guestId === guest.id)
  );
  const showAlert = validationAttempted && paymentMode === "split" && emptyGuests.length > 0;

  function handleCheckoutClick() {
    if (paymentMode === "split" && emptyGuests.length > 0) {
      setValidationAttempted(true);
      track("empty_guest_alert_shown", { guest_count_empty: emptyGuests.length });
      return;
    }
    setValidationAttempted(false);
    onCheckout();
  }

  function handleRemoveGuest(id) {
    onRemoveGuest(id);
    setValidationAttempted(false);
  }

  return (
    <aside className="cart">
      <h2>Your Order</h2>

      <GuestManager guests={guests} onAddGuest={onAddGuest} onRemoveGuest={handleRemoveGuest} />

      {cart.length === 0 ? (
        <p className="cart-empty">No items yet.</p>
      ) : (
        <ul className="cart-list">
          {cart.map((item) => (
            <li key={item.id} className="cart-item">
              <div className="cart-item-row">
                <span className="cart-item-emoji">{item.emoji}</span>
                <div className="cart-item-details">
                  <span className="cart-item-name">{item.name}</span>
                  <div className="cart-item-stepper">
                    <button
                      type="button"
                      className="stepper-btn"
                      disabled={item.quantity <= 1}
                      onClick={() => onDecrement(item.id)}
                      aria-label={`Réduire la quantité de ${item.name}`}
                    >
                      −
                    </button>
                    <span className="stepper-value">{item.quantity}</span>
                    <button
                      type="button"
                      className="stepper-btn"
                      onClick={() => onIncrement(item.id)}
                      aria-label={`Augmenter la quantité de ${item.name}`}
                    >
                      +
                    </button>
                  </div>
                </div>
                <span className="cart-item-price">€{(item.price * item.quantity).toFixed(2)}</span>
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => onRequestRemove(item.id)}
                  aria-label={`Supprimer ${item.name}`}
                >
                  🗑
                </button>
              </div>

              {guests.length > 0 && (
                <label className="cart-item-guest">
                  Assigné à
                  <select
                    value={item.guestId ?? ""}
                    onChange={(e) =>
                      onAssignGuest(item.id, e.target.value ? Number(e.target.value) : null)
                    }
                  >
                    <option value="">Non assigné</option>
                    {guests.map((guest) => (
                      <option key={guest.id} value={guest.id}>
                        {guest.name}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="cart-totals">
        <div className="cart-totals-row">
          <span>Subtotal</span>
          <span>€{subtotal.toFixed(2)}</span>
        </div>
        <div className="cart-totals-row">
          <span>Tax (20%)</span>
          <span>€{tax.toFixed(2)}</span>
        </div>
        <div className="cart-totals-row total">
          <span>Total</span>
          <span>€{total.toFixed(2)}</span>
        </div>
      </div>

      {canGroupOrder && (
        <div className="payment-mode-toggle">
          <button
            type="button"
            className={`payment-mode-btn ${paymentMode === "single" ? "active" : ""}`}
            onClick={() => onPaymentModeChange("single")}
          >
            Paiement unique
          </button>
          <button
            type="button"
            className={`payment-mode-btn ${paymentMode === "split" ? "active" : ""}`}
            onClick={() => onPaymentModeChange("split")}
          >
            Répartition par convive
          </button>
        </div>
      )}

      {showAlert && (
        <div className="empty-guest-alert">
          ⚠️ {emptyGuests.map((g) => g.name).join(", ")} n'a rien commandé
        </div>
      )}

      <button
        className="checkout-btn"
        disabled={cart.length === 0}
        onClick={handleCheckoutClick}
      >
        Place Order
      </button>
    </aside>
  );
}
