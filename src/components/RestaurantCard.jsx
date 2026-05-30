import { Link } from "react-router-dom";

export default function RestaurantCard({ restaurant }) {
  return (
    <Link to={`/restaurants/${restaurant.id}`} className="restaurant-card">
      <span className="restaurant-emoji">{restaurant.emoji}</span>
      <div className="restaurant-info">
        <h3>{restaurant.name}</h3>
        <p className="restaurant-cuisine">{restaurant.cuisine}</p>
        <div className="restaurant-meta">
          <span className="restaurant-rating">⭐ {restaurant.rating.toFixed(1)}</span>
          <span className="restaurant-dot">·</span>
          <span>🛵 {restaurant.etaMin}–{restaurant.etaMax} min</span>
          <span className="restaurant-dot">·</span>
          <span>€{restaurant.deliveryFee.toFixed(2)} delivery</span>
        </div>
      </div>
    </Link>
  );
}
