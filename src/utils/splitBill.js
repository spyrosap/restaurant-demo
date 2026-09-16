const INITIATOR_ID = "me";

export function computeBreakdown({ cart, guests, deliveryFee, taxRate }) {
  const activeIds = new Set(guests.map((g) => g.id));
  const guestCount = guests.length;

  const perGuest = new Map(
    guests.map((g) => [g.id, { id: g.id, name: g.name, items: [], subtotal: 0 }])
  );

  for (const item of cart) {
    const lineTotal = item.price * item.quantity;

    if (item.assignedTo === "shared") {
      const share = lineTotal / guestCount;
      for (const guest of perGuest.values()) {
        guest.subtotal += share;
        guest.items.push({
          name: `${item.name} (partagé à ${guestCount})`,
          amount: share,
        });
      }
      continue;
    }

    const resolvedId = activeIds.has(item.assignedTo) ? item.assignedTo : INITIATOR_ID;
    const guest = perGuest.get(resolvedId);
    guest.subtotal += lineTotal;
    guest.items.push({ name: item.name, amount: lineTotal });
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * taxRate;
  const grandTotal = subtotal + tax + deliveryFee;

  const rows = guests.map((g) => {
    const guest = perGuest.get(g.id);
    const taxShare = subtotal > 0 ? tax * (guest.subtotal / subtotal) : 0;
    const deliveryShare = deliveryFee / guestCount;
    return {
      ...guest,
      taxShare,
      deliveryShare,
      total: guest.subtotal + taxShare + deliveryShare,
    };
  });

  distributeRoundingRemainder(rows, grandTotal);

  return { rows, subtotal, tax, deliveryFee, grandTotal };
}

// MR6 / EC2: any leftover cent from rounding is imputed to the last guest in the list.
function distributeRoundingRemainder(rows, grandTotal) {
  const totalCents = Math.round(grandTotal * 100);
  let roundedSum = 0;
  for (const row of rows) {
    row.totalCents = Math.round(row.total * 100);
    roundedSum += row.totalCents;
  }
  const diff = totalCents - roundedSum;
  if (diff !== 0 && rows.length > 0) {
    rows[rows.length - 1].totalCents += diff;
  }
  for (const row of rows) {
    row.total = row.totalCents / 100;
    delete row.totalCents;
  }
}

export function track(event, props) {
  // Placeholder analytics hook — logs the events described in the spec's
  // Tracking section instead of sending them to a real analytics backend.
  console.log(`[track] ${event}`, props);
}
