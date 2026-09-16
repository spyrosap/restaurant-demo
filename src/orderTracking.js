// Pure logic for the post-payment order tracking timeline: no React here.
// Everything is derived from a stored `paymentTimestamp` (epoch ms) so the
// UI can be closed/reopened at any point and still show the correct state.

export const ORDER_STATUSES = [
  {
    key: "confirmed",
    label: "Confirmée",
    message: "Votre commande a été confirmée par le restaurant ✅",
    weight: 0.2,
  },
  {
    key: "preparing",
    label: "En préparation",
    message: "Le restaurant prépare votre commande 👨‍🍳",
    weight: 0.4,
  },
  {
    key: "delivering",
    label: "En livraison",
    message: "Votre livreur est en route 🛵",
    weight: 0.3,
  },
  {
    key: "delivered",
    label: "Livrée",
    message: "Votre commande est arrivée, bon appétit ! 🎉",
    weight: 0.1,
  },
];

// The one knob to turn for a faster/slower live demo (real ms for the whole
// simulated delivery). Lower it (e.g. 20000) to demo the full flow quickly.
export const DEMO_DURATION_MS = 60000;

const STORAGE_KEY = "roofood_active_order";
const STORAGE_VERSION = 1;

// Cumulative fraction of DEMO_DURATION_MS at which "Livrée" starts and the
// ETA countdown reaches exactly 0 (sum of the first 3 statuses' weights).
const ACTIVE_FRACTION = ORDER_STATUSES.slice(0, -1).reduce((sum, s) => sum + s.weight, 0);

function generateOrderNumber() {
  return "DL-" + Math.floor(10000 + Math.random() * 90000);
}

export function createOrder({ items, total }, deliveryInfo) {
  return {
    version: STORAGE_VERSION,
    orderNumber: generateOrderNumber(),
    paymentTimestamp: Date.now(),
    items,
    total,
    totalEtaMinutes: Math.round((deliveryInfo.etaMin + deliveryInfo.etaMax) / 2),
  };
}

export function getOrderProgress(order, now = Date.now()) {
  const elapsed = Math.max(0, now - order.paymentTimestamp);
  const activeMs = DEMO_DURATION_MS * ACTIVE_FRACTION;
  const fraction = Math.min(1, elapsed / DEMO_DURATION_MS);
  const remainingMs = Math.max(0, activeMs - elapsed);
  const isComplete = elapsed >= activeMs;

  let statusIndex = ORDER_STATUSES.length - 1;
  if (!isComplete) {
    let cumulative = 0;
    for (let i = 0; i < ORDER_STATUSES.length; i++) {
      cumulative += ORDER_STATUSES[i].weight;
      if (elapsed / DEMO_DURATION_MS < cumulative) {
        statusIndex = i;
        break;
      }
    }
  }

  return { statusIndex, fraction, remainingMs, isComplete };
}

export function formatRemaining(remainingMs) {
  // Round up (not to nearest) so the display never touches "0:00" a beat
  // before `isComplete` actually flips, which would show a 0 countdown
  // while the status is still non-"Livrée".
  const totalSeconds = remainingMs > 0 ? Math.ceil(remainingMs / 1000) : 0;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function isValidOrder(order) {
  return (
    order &&
    order.version === STORAGE_VERSION &&
    typeof order.paymentTimestamp === "number" &&
    typeof order.orderNumber === "string" &&
    Array.isArray(order.items) &&
    typeof order.total === "number"
  );
}

export function saveActiveOrder(order) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
  } catch {
    // Storage unavailable (private browsing, disabled, quota) — non-fatal.
  }
}

export function loadActiveOrder() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const order = JSON.parse(raw);
    return isValidOrder(order) ? order : null;
  } catch {
    return null;
  }
}

export function clearActiveOrder() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage unavailable — nothing to clear.
  }
}
