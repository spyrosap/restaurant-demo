export function track(eventName, properties = {}) {
  console.log("[analytics]", { event: eventName, timestamp: new Date().toISOString(), ...properties });
}
