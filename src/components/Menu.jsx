import { useEffect, useRef } from "react";

const CATEGORIES = ["All", "Starters", "Mains", "Desserts"];

export default function Menu({
  dishes,
  selectedCategory,
  onCategoryChange,
  onAddToCart,
  isVegetarianActive,
  onToggleVegetarian,
}) {
  const filteredDishes =
    selectedCategory === "All"
      ? dishes
      : dishes.filter((dish) => dish.category === selectedCategory);

  const isEmpty = isVegetarianActive && filteredDishes.length === 0;
  const emptyLoggedRef = useRef(false);

  useEffect(() => {
    if (isEmpty && !emptyLoggedRef.current) {
      console.log("vegetarian_filter_empty_state_shown", { restaurant_id: "demo" });
      emptyLoggedRef.current = true;
    } else if (!isEmpty) {
      emptyLoggedRef.current = false;
    }
  }, [isEmpty]);

  return (
    <section className="menu">
      <h2>Menu</h2>

      <button
        type="button"
        role="switch"
        aria-checked={isVegetarianActive}
        className={`veg-toggle ${isVegetarianActive ? "active" : ""}`}
        onClick={onToggleVegetarian}
      >
        <span className="veg-toggle-track">
          <span className="veg-toggle-thumb" />
        </span>
        <span className="veg-toggle-label">Filtre végétarien</span>
      </button>

      <div className="category-filters">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => onCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {isEmpty ? (
        <p className="veg-empty-message">Aucun plat végétarien disponible pour le moment</p>
      ) : (
        <div className="dish-grid">
          {filteredDishes.map((dish) => (
            <div key={dish.id} className="dish-card">
              <span className="dish-emoji">{dish.emoji}</span>
              <div className="dish-info">
                <h3>{dish.name}</h3>
                <p>{dish.description}</p>
                <span className="dish-calories">~{dish.calories} kcal</span>
                <div className="dish-footer">
                  <span className="dish-price">€{dish.price.toFixed(2)}</span>
                  <button className="add-btn" onClick={() => onAddToCart(dish)}>
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
