import { useState, useEffect } from "react";
import { getRestaurants } from "../api";
import RestaurantCard from "../components/RestaurantCard";

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    getRestaurants()
      .then((data) => alive && setRestaurants(data))
      .catch((e) => alive && setError(e));
    return () => { alive = false; };
  }, []);

  return (
    <section className="restaurant-list">
      <h2>Restaurants near you</h2>
      {error && <p className="load-error">Couldn't load restaurants.</p>}
      {!restaurants && !error && <p className="load-state">Loading restaurants…</p>}
      {restaurants && (
        <div className="restaurant-grid">
          {restaurants.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      )}
    </section>
  );
}
