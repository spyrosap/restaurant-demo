const CATEGORIES = ["All", "Starters", "Mains", "Desserts"];

export default function Menu({ dishes, selectedCategory, onCategoryChange, onAddToCart }) {
  const filteredDishes =
    selectedCategory === "All"
      ? dishes
      : dishes.filter((dish) => dish.category === selectedCategory);

  return (
    <section className="menu">
      <h2>Menu</h2>

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

      <div className="dish-grid">
        {filteredDishes.map((dish) => (
          <div key={dish.id} className="dish-card">
            <span className="dish-emoji">{dish.emoji}</span>
            <div className="dish-info">
              <h3>{dish.name}</h3>
              <p>{dish.description}</p>
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
    </section>
  );
}
