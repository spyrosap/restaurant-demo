export function getSuggestions({ dishes, lastOrder, trendingDishIds }) {
  const availableDishes = dishes.filter((d) => d.available !== false);

  const lastOrderExists =
    !!lastOrder && dishes.some((d) => d.id === lastOrder.dishId);

  const personalizedPicks = lastOrderExists
    ? availableDishes
        .filter((d) => d.category === lastOrder.category && d.id !== lastOrder.dishId)
        .slice(0, 3)
        .map((dish) => ({ dish, type: "personalized" }))
    : [];

  const excludedIds = new Set(personalizedPicks.map((p) => p.dish.id));
  if (lastOrder) excludedIds.add(lastOrder.dishId);

  const needed = 3 - personalizedPicks.length;
  const fallbackPicks = [];

  if (needed > 0) {
    for (const id of trendingDishIds || []) {
      if (fallbackPicks.length >= needed) break;
      if (excludedIds.has(id)) continue;
      const dish = availableDishes.find((d) => d.id === id);
      if (!dish) continue;
      fallbackPicks.push({ dish, type: "fallback" });
      excludedIds.add(id);
    }

    if (fallbackPicks.length < needed) {
      for (const dish of availableDishes) {
        if (fallbackPicks.length >= needed) break;
        if (excludedIds.has(dish.id)) continue;
        fallbackPicks.push({ dish, type: "fallback" });
        excludedIds.add(dish.id);
      }
    }
  }

  const items = [...personalizedPicks, ...fallbackPicks].slice(0, 3);
  const personalizedCount = personalizedPicks.length;

  let suggestionType;
  if (items.length === 0) suggestionType = "fallback";
  else if (personalizedCount === items.length) suggestionType = "personalized";
  else if (personalizedCount === 0) suggestionType = "fallback";
  else suggestionType = "mixed";

  return { items, suggestionType };
}
