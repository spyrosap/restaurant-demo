export default function Cart({ cart, guests, onRemove, onAssignItem, onOpenGuestManager, onCheckout }) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const tax = subtotal * 0.10;
  const total = subtotal + tax;
  const isGroupOrder = guests.length > 1;

  return (
    <aside className="cart">
      <div className="cart-header-row">
        <h2>Your Order</h2>
        <button type="button" className="group-order-btn" onClick={onOpenGuestManager}>
          👥 {isGroupOrder ? `Groupe (${guests.length})` : "Commande de groupe"}
        </button>
      </div>

      {isGroupOrder && (
        <ul className="guest-chip-list">
          {guests.map((guest) => (
            <li key={guest.id} className="guest-chip">{guest.name}</li>
          ))}
        </ul>
      )}

      {cart.length === 0 ? (
        <p className="cart-empty">No items yet.</p>
      ) : (
        <ul className="cart-list">
          {cart.map((item, index) => (
            <li key={index} className="cart-item">
              <span className="cart-item-emoji">{item.emoji}</span>
              <div className="cart-item-details">
                <span className="cart-item-name">{item.name}</span>
                <span className="cart-item-qty">x{item.quantity}</span>
                {isGroupOrder && (
                  <select
                    className="assign-select"
                    value={item.assignedTo}
                    onChange={(e) => onAssignItem(item.id, e.target.value)}
                  >
                    {guests.map((guest) => (
                      <option key={guest.id} value={guest.id}>{guest.name}</option>
                    ))}
                    <option value="shared">Partagé équitablement</option>
                  </select>
                )}
              </div>
              <span className="cart-item-price">€{(item.price * item.quantity).toFixed(2)}</span>
              <button className="remove-btn" onClick={() => onRemove(item.id)}>✕</button>
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
          <span>Tax (10%)</span>
          <span>€{tax.toFixed(2)}</span>
        </div>
        <div className="cart-totals-row total">
          <span>Total</span>
          <span>€{total.toFixed(2)}</span>
        </div>
      </div>

      <button
        className="checkout-btn"
        disabled={cart.length === 0}
        onClick={onCheckout}
      >
        {isGroupOrder ? "Voir la répartition" : "Place Order"}
      </button>
    </aside>
  );
}
