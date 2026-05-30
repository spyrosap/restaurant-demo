import { useState } from "react";
import { coupons } from "../coupon-codes";

export default function Cart({ cart, onRemove, onIncrement, onDecrement, onCheckout }) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.20;
  const baseTotal = subtotal + tax;

  const [couponInput, setCouponInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(null); // { code_name, discount }
  const [couponError, setCouponError] = useState(false);

  function handleApplyCoupon() {
    const match = coupons.find(
      (c) => c.code_name === couponInput.trim().toUpperCase()
    );
    if (match) {
      setAppliedDiscount(match);
      setCouponError(false);
    } else {
      setAppliedDiscount(null);
      setCouponError(true);
    }
  }

  const discountAmount = appliedDiscount ? baseTotal * appliedDiscount.discount : 0;
  const total = baseTotal - discountAmount;

  return (
    <aside className="cart">
      <h2>Your Order</h2>

      {cart.length === 0 ? (
        <p className="cart-empty">No items yet.</p>
      ) : (
        <ul className="cart-list">
          {cart.map((item, index) => (
            <li key={index} className="cart-item">
              <span className="cart-item-emoji">{item.emoji}</span>
              <div className="cart-item-details">
                <span className="cart-item-name">{item.name}</span>
                <span className="cart-item-price">€{(item.price * item.quantity).toFixed(2)}</span>
              </div>
              <div className="qty-stepper">
                {item.quantity === 1 ? (
                  <button
                    className="qty-btn qty-btn-remove"
                    aria-label={`Remove ${item.name}`}
                    onClick={() => onRemove(item.id)}
                  >
                    🗑
                  </button>
                ) : (
                  <button
                    className="qty-btn"
                    aria-label={`Decrease ${item.name}`}
                    onClick={() => onDecrement(item.id)}
                  >
                    −
                  </button>
                )}
                <span className="qty-value">{item.quantity}</span>
                <button
                  className="qty-btn"
                  aria-label={`Increase ${item.name}`}
                  onClick={() => onIncrement(item.id)}
                >
                  +
                </button>
              </div>
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
        {appliedDiscount && (
          <div className="cart-totals-row coupon-discount">
            <span>Coupon ({appliedDiscount.code_name})</span>
            <span>-€{discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="cart-totals-row total">
          <span>Total</span>
          <span>€{total.toFixed(2)}</span>
        </div>
      </div>

      <div className="coupon-section">
        <label className="coupon-label">COUPON</label>
        <div className="coupon-input-row">
          <input
            className={`coupon-input ${couponError ? "coupon-input--error" : ""}`}
            type="text"
            placeholder="Enter coupon code"
            value={couponInput}
            onChange={(e) => {
              setCouponInput(e.target.value);
              setCouponError(false);
              if (appliedDiscount) setAppliedDiscount(null);
            }}
          />
          <button className="coupon-apply-btn" onClick={handleApplyCoupon}>
            Apply
          </button>
        </div>
        {couponError && (
          <p className="coupon-error">Invalid coupon</p>
        )}
        {appliedDiscount && (
          <p className="coupon-success">
            ✓ {appliedDiscount.code_name} applied — {(appliedDiscount.discount * 100).toFixed(0)}% off
          </p>
        )}
      </div>

      <button
        className="checkout-btn"
        disabled={cart.length === 0}
        onClick={onCheckout}
      >
        Place Order
      </button>
    </aside>
  );
}
