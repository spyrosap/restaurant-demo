import { useEffect, useState } from "react";
import { ORDER_STATUSES, getOrderProgress, formatRemaining } from "../orderTracking";

export default function OrderTracking({ order, onFinish }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { statusIndex, fraction, remainingMs, isComplete } = getOrderProgress(order, now);
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="tracking-screen">
      <div className="tracking-card">
        <div className="tracking-order-meta">
          Commande {order.orderNumber} · {itemCount} article{itemCount > 1 ? "s" : ""}
        </div>

        <div className="tracking-eta">
          <span className="tracking-eta-value">
            {isComplete ? "Livrée !" : formatRemaining(remainingMs)}
          </span>
        </div>

        <div className="tracking-progress">
          <div className="tracking-progress-fill" style={{ width: `${fraction * 100}%` }} />
        </div>

        <ol className="tracking-timeline">
          {ORDER_STATUSES.map((status, index) => {
            const state =
              index < statusIndex ? "completed" : index === statusIndex ? "active" : "upcoming";
            return (
              <li key={status.key} className={`tracking-step tracking-step--${state}`}>
                <span className="tracking-step-marker">{state === "completed" ? "✓" : index + 1}</span>
                <span className="tracking-step-label">{status.label}</span>
              </li>
            );
          })}
        </ol>

        <p className="tracking-message">{ORDER_STATUSES[statusIndex].message}</p>

        <ul className="modal-item-list tracking-receipt">
          {order.items.map((item, i) => (
            <li key={i} className="modal-item-row">
              <span className="modal-item-emoji">{item.emoji}</span>
              <span className="modal-item-name">{item.name}</span>
              <span className="modal-item-qty">x{item.quantity}</span>
              <span className="modal-item-price">€{(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="modal-totals">
          <div className="modal-totals-row modal-totals-total">
            <span>Total payé</span>
            <span>€{order.total.toFixed(2)}</span>
          </div>
        </div>

        {isComplete && (
          <div className="tracking-actions">
            <button className="modal-btn-primary modal-btn-full" onClick={onFinish}>
              Start New Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
