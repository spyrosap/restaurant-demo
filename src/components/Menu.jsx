import { useState } from "react";
import { normalize } from "../utils";

const CATEGORIES = ["All", "Starters", "Mains", "Desserts"];
const DIETS = ["Vegetarian", "Vegan", "Gluten-Free", "Halal"];
const DIET_EMOJIS = {
  Vegetarian: "🥕",
  Vegan: "🌱",
  "Gluten-Free": "🌾",
  Halal: "☪️",
};

export default function Menu({ dishes, selectedCategory, onCategoryChange, onAddToCart }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDiets, setSelectedDiets] = useState([]);

  const byCategory =
    selectedCategory === "All"
      ? dishes
      : dishes.filter((d) => d.category === selectedCategory);

  const bySearch =
    searchQuery === ""
      ? byCategory
      : byCategory.filter((d) => {
          const q = normalize(searchQuery);
          return normalize(d.name).includes(q) || normalize(d.description).includes(q);
        });

  const filteredDishes =
    selectedDiets.length === 0
      ? bySearch
      : bySearch.filter((d) => selectedDiets.every((diet) => d.diets.includes(diet)));

  function toggleDiet(diet) {
    setSelectedDiets((prev) =>
      prev.includes(diet) ? prev.filter((d) => d !== diet) : [...prev, diet]
    );
  }

  function clearSearch() {
    setSearchQuery("");
    setSelectedDiets([]);
  }
const CATEGORIES = ["All", "Starters", "Mains", "Sides", "Drinks", "Desserts"];

export default function Menu({ dishes, selectedCategory, onCategoryChange, onAddToCart }) {
  const filteredDishes = selectedCategory === "All"
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

      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search dishes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery.length > 0 && (
          <button
            type="button"
            className="search-clear-btn"
            aria-label="Clear search text"
            onClick={() => setSearchQuery("")}
          >
            ×
          </button>
        )}
      </div>

      <div className="diet-filters">
        <span className="diet-filters-label">Filter by diet:</span>
        {DIETS.map((diet) => (
          <button
            key={diet}
            className={`filter-btn diet-filter-btn ${selectedDiets.includes(diet) ? "active" : ""}`}
            onClick={() => toggleDiet(diet)}
          >
            {DIET_EMOJIS[diet]} {diet}
          </button>
        ))}
      </div>

      {filteredDishes.length === 0 ? (
        <div className="empty-state">
          <p>No dishes found.</p>
          <button type="button" className="clear-search-btn" onClick={clearSearch}>
            Clear search
          </button>
        </div>
      ) : (
        <div className="dish-grid">
          {filteredDishes.map((dish) => (
            <div key={dish.id} className="dish-card">
              <span className="dish-emoji">{dish.emoji}</span>
              <div className="dish-info">
                <h3>{dish.name}</h3>
                <p>{dish.description}</p>
                {dish.diets.length > 0 && (
                  <div className="diet-badges">
                    {dish.diets.map((diet) => (
                      <span key={diet} className="diet-badge">
                        {DIET_EMOJIS[diet]} {diet}
                      </span>
                    ))}
                  </div>
                )}
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
