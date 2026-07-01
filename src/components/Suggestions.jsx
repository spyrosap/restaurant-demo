import { useMemo } from "react";
import { lastOrder, trendingDishIds } from "../data";
import { getSuggestions } from "../suggestions";

export default function Suggestions({ dishes, onAddToCart }) {
  const result = useMemo(() => {
    try {
      return getSuggestions({ dishes, lastOrder, trendingDishIds });
    } catch (err) {
      console.error("Suggestions: failed to compute suggestions", err);
      return null;
    }
  }, [dishes]);

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
        {result.items.map((item) => (
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
                onClick={() => onAddToCart(item.dish)}
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
