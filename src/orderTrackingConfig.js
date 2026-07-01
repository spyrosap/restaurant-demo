export const orderTrackingConfig = {
  confirmingDelayMs: 1500,
  stepDurationsMs: {
    confirmed: 5000,
    preparing: 15000,
    delivering: 20000,
  },
  displayedEtaMinutesStart: 30,
};

export const STEPS = [
  { key: "confirmed", label: "Confirmée", message: "Votre commande a été confirmée par le restaurant." },
  { key: "preparing", label: "En préparation", message: "Le restaurant prépare votre commande." },
  { key: "delivering", label: "En livraison", message: "Votre livreur est en route." },
  { key: "delivered", label: "Livrée", message: "Votre commande est arrivée. Bon appétit !" },
];
