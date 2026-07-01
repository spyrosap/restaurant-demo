import { useEffect, useMemo, useRef } from "react";
import { currentUserId, lastOrder, trendingDishIds } from "../data";
import { getSuggestions } from "../suggestions";
import { track } from "../analytics";

export default function Suggestions({ dishes, onAddToCart }) {
  const result = useMemo(() => {
    try {
      return getSuggestions({ dishes, lastOrder, trendingDishIds });
    } catch (err) {
      console.error("Suggestions: failed to compute suggestions", err);
      return null;
    }
  }, [dishes]);

  const clickedPositions = useRef(new Set());

  useEffect(() => {
    clickedPositions.current = new Set();
    if (!result || result.items.length === 0) return;
    track("meal_suggestion_impression", {
      user_id: currentUserId,
      suggestion_type: result.suggestionType,
      restaurant_ids: result.items.map((item) => item.dish.id),
    });
  }, [result]);

  function handleAddToCart(dish, type, position) {
    if (!clickedPositions.current.has(position)) {
      clickedPositions.current.add(position);
      track("meal_suggestion_click", {
        user_id: currentUserId,
        restaurant_id: dish.id,
        position,
        suggestion_type: type,
      });
    }
    onAddToCart(dish);
  }

  if (!result || result.items.length === 0) return null;

  const lastOrderDish = lastOrder && dishes.find((d) => d.id === lastOrder.dishId);
  const subtitle = lastOrderDish
    ? `Parce que vous avez commandé ${lastOrderDish.name} · ${lastOrder.category}`
    : null;

  return (
    <section className="suggestions-section">
      <div className="suggestions-header">
        <h2>Pour vous</h2>
        {subtitle && <p className="suggestions-subtitle">{subtitle}</p>}
      </div>
      <div className="suggestions-grid">
        {result.items.map((item, position) => (
          <div key={item.dish.id} className="suggestion-card">
            <span
              className={`suggestion-badge ${
                item.type === "personalized" ? "suggestion-badge--perso" : "suggestion-badge--trending"
              }`}
            >
              {item.type === "personalized" ? "PERSONNALISÉ" : "TENDANCE"}
            </span>
            <span className="suggestion-emoji">{item.dish.emoji}</span>
            <h3 className="suggestion-name">{item.dish.name}</h3>
            <span className="suggestion-category">{item.dish.category}</span>
            <div className="suggestion-footer">
              <span className="suggestion-price">€{item.dish.price.toFixed(2)}</span>
              <button
                className="suggestion-add-btn"
                onClick={() => handleAddToCart(item.dish, item.type, position)}
                aria-label={`Add ${item.dish.name} to cart`}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
