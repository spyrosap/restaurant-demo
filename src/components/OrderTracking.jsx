import { useEffect, useState } from "react";
import { orderTrackingConfig, STEPS } from "../orderTrackingConfig";
import { computeTrackingState, formatEta, interpolatePinPosition, MAP_WAYPOINTS } from "../orderTrackingLogic";
import "./OrderTracking.css";

export default function OrderTracking({ order, onDone }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 400);
    return () => clearInterval(id);
  }, []);

  const { phase, stepIndex, stepProgress, etaRemainingMs } = computeTrackingState(
    order.startedAt,
    now,
    orderTrackingConfig
  );
  const eta = formatEta(etaRemainingMs, phase);
  const pin = interpolatePinPosition(stepIndex, phase, stepProgress);
  const currentStepMessage = STEPS[stepIndex] ? STEPS[stepIndex].message : "";

  return (
    <div className="tracking-screen">
      <div className="tracking-order-meta">
        <span>Commande {order.orderNumber}</span>
        <span>
          {order.items.length} article{order.items.length > 1 ? "s" : ""} · €{order.total.toFixed(2)}
        </span>
      </div>

      <div className="delivery-eta tracking-eta">
        <span className="eta-dot" />
        <span className="tracking-eta-value">{eta}</span>
      </div>

      <div className="tracking-map">
        <svg viewBox="0 0 320 180" className="tracking-map-svg" role="presentation">
          <rect x="0" y="0" width="320" height="180" fill="#f8f4ef" />
          <path d="M 10 150 L 120 150 L 120 40 L 310 40" stroke="#e8e4df" strokeWidth="10" fill="none" />
          <path d="M 60 5 L 60 180" stroke="#e8e4df" strokeWidth="9" fill="none" />
          <path d="M 210 5 L 210 180" stroke="#e8e4df" strokeWidth="8" fill="none" />
          <rect x="20" y="18" width="65" height="55" rx="4" fill="#ede9e4" />
          <rect x="235" y="90" width="70" height="65" rx="4" fill="#ede9e4" />
        </svg>
        <div
          className="tracking-map-marker"
          style={{ top: `${MAP_WAYPOINTS.restaurant.top}%`, left: `${MAP_WAYPOINTS.restaurant.left}%` }}
        >
          🍽️
        </div>
        <div
          className="tracking-map-marker"
          style={{ top: `${MAP_WAYPOINTS.destination.top}%`, left: `${MAP_WAYPOINTS.destination.left}%` }}
        >
          🏠
        </div>
        <div className="tracking-map-pin" style={{ top: `${pin.top}%`, left: `${pin.left}%` }}>
          🛵
        </div>
      </div>

      {phase === "confirming" ? (
        <div className="tracking-confirming">
          <div className="spinner" />
          <p className="processing-title">Confirmation de votre commande…</p>
        </div>
      ) : (
        <>
          <ol className="tracking-timeline">
            {STEPS.map((step, index) => {
              const status =
                phase === "delivered" || index < stepIndex
                  ? "completed"
                  : index === stepIndex
                  ? "active"
                  : "upcoming";
              return (
                <li key={step.key} className={`tracking-step tracking-step--${status}`}>
                  <span className="tracking-step-marker">{status === "completed" ? "✓" : ""}</span>
                  <span className="tracking-step-label">{step.label}</span>
                </li>
              );
            })}
          </ol>
          <p className="tracking-message">{currentStepMessage}</p>
        </>
      )}

      {phase === "delivered" && (
        <button className="modal-btn-primary modal-btn-full" onClick={onDone}>
          Retour à l'accueil
        </button>
      )}
    </div>
  );
}
