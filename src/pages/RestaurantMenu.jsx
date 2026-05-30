import { useState, useEffect } from "react";
import { useParams, useOutletContext, Link } from "react-router-dom";
import { getRestaurant } from "../api";
import Menu from "../components/Menu";
import Cart from "../components/Cart";
import PaymentModal from "../components/PaymentModal";

export default function RestaurantMenu() {
  const { id } = useParams();
  const { cart, setCart, cartRestaurantId, setCartRestaurantId } = useOutletContext();

  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    let alive = true;
    setRestaurant(null);
    setError(null);
    getRestaurant(id)
      .then((data) => alive && setRestaurant(data))
      .catch((e) => alive && setError(e));
    return () => { alive = false; };
  }, [id]);

  function addToCart(dish) {
    // Cart holds one restaurant at a time — switching restaurants starts fresh.
    if (cartRestaurantId !== null && String(cartRestaurantId) !== String(id)) {
      setCart([{ ...dish, quantity: 1 }]);
      setCartRestaurantId(id);
      return;
    }
    setCartRestaurantId(id);
    // BUG #5: always adds a new entry — should check if dish is already in cart and increment quantity
    setCart([...cart, { ...dish, quantity: 1 }]);
  }

  function removeFromCart(itemId) {
    setCart(cart.filter((item) => item.id === itemId));
  }

  if (error) {
    return (
      <section className="menu">
        <Link to="/" className="back-link">← All restaurants</Link>
        <p className="load-error">Couldn't load this restaurant.</p>
      </section>
    );
  }

  if (!restaurant) {
    return (
      <section className="menu">
        <Link to="/" className="back-link">← All restaurants</Link>
        <p className="load-state">Loading menu…</p>
      </section>
    );
  }

  return (
    <>
      <div className="menu-column">
        <div className="restaurant-header">
          <Link to="/" className="back-link">← All restaurants</Link>
          <h2 className="restaurant-title">
            {restaurant.emoji} {restaurant.name}
          </h2>
          <span className="delivery-eta">
            <span className="eta-dot" />
            <span className="eta-icon">🛵</span>
            Delivery in {restaurant.etaMin}–{restaurant.etaMax} min
          </span>
        </div>
        <Menu
          dishes={restaurant.menu}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onAddToCart={addToCart}
        />
      </div>
      <Cart cart={cart} onRemove={removeFromCart} onCheckout={() => setShowPayment(true)} />
      {showPayment && (
        <PaymentModal
          cart={cart}
          restaurant={restaurant}
          onClose={() => setShowPayment(false)}
          onPlaced={() => {
            setCart([]);
            setCartRestaurantId(null);
            setShowPayment(false);
          }}
        />
      )}
    </>
  );
}
