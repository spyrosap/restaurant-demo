// Mock API layer — simulates a backend entirely in the browser.
// Restaurant/menu data is read from data.js; orders are persisted to
// localStorage so live tracking survives a page refresh.
//
// This is the single seam the app talks to. To move to a real backend later,
// swap the bodies of these functions for fetch() calls — the signatures stay.

import { restaurants } from "./data";

const LATENCY_MS = 350; // simulated network round-trip
const ORDERS_KEY = "roofood_orders";

// Status progression, anchored to the order's createdAt timestamp.
// Each entry is the elapsed-seconds threshold at which the order reaches
// that status. Computed on read, so it advances correctly across refreshes.
export const ORDER_STAGES = [
  { status: "confirmed", label: "Confirmed", atSeconds: 0 },
  { status: "preparing", label: "Preparing", atSeconds: 20 },
  { status: "out_for_delivery", label: "Out for delivery", atSeconds: 60 },
  { status: "delivered", label: "Delivered", atSeconds: 120 },
];

const TOTAL_DELIVERY_SECONDS = ORDER_STAGES[ORDER_STAGES.length - 1].atSeconds;

function delay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));
}

function readOrders() {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY)) || {};
  } catch {
    return {};
  }
}

function writeOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

// Derive the current status and remaining ETA from elapsed time.
function deriveStatus(createdAt) {
  const elapsedSeconds = (Date.now() - createdAt) / 1000;
  let status = ORDER_STAGES[0].status;
  for (const stage of ORDER_STAGES) {
    if (elapsedSeconds >= stage.atSeconds) status = stage.status;
  }
  const etaRemainingMin = Math.max(
    0,
    Math.ceil((TOTAL_DELIVERY_SECONDS - elapsedSeconds) / 60)
  );
  return { status, etaRemainingMin };
}

export async function getRestaurants() {
  return delay(
    restaurants.map(({ menu, ...summary }) => summary) // list view omits the full menu
  );
}

export async function getRestaurant(id) {
  const restaurant = restaurants.find((r) => String(r.id) === String(id));
  if (!restaurant) {
    return delay(Promise.reject(new Error("Restaurant not found")));
  }
  return delay(restaurant);
}

export async function createOrder({ restaurantId, items, subtotal, deliveryFee, total }) {
  const orders = readOrders();
  const createdAt = Date.now();
  const id = "ord_" + createdAt.toString(36) + Object.keys(orders).length;
  const order = {
    id,
    restaurantId,
    items,
    subtotal,
    deliveryFee,
    total,
    createdAt,
    status: ORDER_STAGES[0].status,
  };
  orders[id] = order;
  writeOrders(orders);
  return delay(order);
}

export async function getOrder(id) {
  const orders = readOrders();
  const order = orders[id];
  if (!order) {
    return delay(Promise.reject(new Error("Order not found")));
  }
  const { status, etaRemainingMin } = deriveStatus(order.createdAt);
  // Lazily persist the advance so a later read is consistent.
  if (status !== order.status) {
    order.status = status;
    orders[id] = order;
    writeOrders(orders);
  }
  return delay({ ...order, status, etaRemainingMin });
}
