import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrder } from "../api";
import StatusStepper from "../components/StatusStepper";

export default function OrderTracking() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    let timer;

    async function poll() {
      try {
        const o = await getOrder(id);
        if (!alive) return;
        setOrder(o);
        // Keep polling until the order is delivered.
        if (o.status !== "delivered") timer = setTimeout(poll, 4000);
      } catch (e) {
        if (alive) setError(e);
      }
    }

    poll();
    return () => { alive = false; clearTimeout(timer); };
  }, [id]);

  if (error) {
    return (
      <section className="tracking">
        <p className="load-error">We couldn't find that order.</p>
        <Link to="/" className="back-link">← Back to restaurants</Link>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="tracking">
        <p className="load-state">Loading your order…</p>
      </section>
    );
  }

  const delivered = order.status === "delivered";

  return (
    <section className="tracking">
      <div className="tracking-card">
        <span className="tracking-emoji">{delivered ? "🎉" : "🛵"}</span>
        <h2 className="tracking-title">
          {delivered ? "Delivered — enjoy your meal!" : "Your order is on its way"}
        </h2>
        <p className="tracking-eta">
          {delivered
            ? "Order complete"
            : order.etaRemainingMin > 0
              ? `Arriving in about ${order.etaRemainingMin} min`
              : "Arriving any minute now"}
        </p>

        <StatusStepper status={order.status} />

        <ul className="tracking-items">
          {order.items.map((item, i) => (
            <li key={i} className="tracking-item-row">
              <span className="modal-item-emoji">{item.emoji}</span>
              <span className="modal-item-name">{item.name}</span>
              <span className="modal-item-qty">x{item.quantity}</span>
              <span className="modal-item-price">€{(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>

        <div className="tracking-totals">
          <div className="tracking-totals-row">
            <span>Delivery fee</span>
            <span>€{order.deliveryFee.toFixed(2)}</span>
          </div>
          <div className="tracking-totals-row total">
            <span>Total</span>
            <span>€{order.total.toFixed(2)}</span>
          </div>
        </div>

        <p className="tracking-order-id">Order {order.id}</p>
        <Link to="/" className="modal-btn-primary modal-btn-full tracking-home-btn">
          Order from another restaurant
        </Link>
      </div>
    </section>
  );
}
