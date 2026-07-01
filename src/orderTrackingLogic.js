const STEP_ORDER = ["confirmed", "preparing", "delivering"];

export function computeTrackingState(startedAt, now, config) {
  const { confirmingDelayMs, stepDurationsMs, displayedEtaMinutesStart } = config;
  const durations = STEP_ORDER.map((key) => stepDurationsMs[key]);
  const activeTotalMs = durations.reduce((sum, d) => sum + d, 0);
  const totalDurationMs = confirmingDelayMs + activeTotalMs;
  const elapsed = Math.max(0, now - startedAt);

  if (elapsed >= totalDurationMs) {
    return { phase: "delivered", stepIndex: 3, stepProgress: 1, etaRemainingMs: 0, totalDurationMs };
  }

  if (elapsed < confirmingDelayMs) {
    return {
      phase: "confirming",
      stepIndex: -1,
      stepProgress: 0,
      etaRemainingMs: displayedEtaMinutesStart * 60000,
      totalDurationMs,
    };
  }

  const activeElapsed = elapsed - confirmingDelayMs;
  let cursor = 0;
  let stepIndex = STEP_ORDER.length - 1;
  let stepProgress = 1;
  for (let i = 0; i < STEP_ORDER.length; i++) {
    const duration = durations[i];
    if (activeElapsed < cursor + duration) {
      stepIndex = i;
      stepProgress = (activeElapsed - cursor) / duration;
      break;
    }
    cursor += duration;
  }

  const etaRemainingMs = Math.max(0, displayedEtaMinutesStart * 60000 * (1 - activeElapsed / activeTotalMs));

  return { phase: "active", stepIndex, stepProgress, etaRemainingMs, totalDurationMs };
}

export function formatEta(etaRemainingMs, phase) {
  if (phase === "delivered") return "Livré";
  const minutes = Math.max(1, Math.ceil(etaRemainingMs / 60000));
  return `Arrivée estimée dans ${minutes} min`;
}

export const MAP_WAYPOINTS = {
  restaurant: { top: 20, left: 15 },
  midpoint: { top: 65, left: 50 },
  destination: { top: 30, left: 85 },
};

function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function interpolatePinPosition(stepIndex, phase, stepProgress) {
  if (phase === "delivered") return MAP_WAYPOINTS.destination;
  if (phase !== "active" || stepIndex < 2) return MAP_WAYPOINTS.restaurant;

  const { restaurant, midpoint, destination } = MAP_WAYPOINTS;
  if (stepProgress < 0.5) {
    const t = stepProgress * 2;
    return { top: lerp(restaurant.top, midpoint.top, t), left: lerp(restaurant.left, midpoint.left, t) };
  }
  const t = (stepProgress - 0.5) * 2;
  return { top: lerp(midpoint.top, destination.top, t), left: lerp(midpoint.left, destination.left, t) };
}
