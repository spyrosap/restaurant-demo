import { useState } from "react";
import { dishes } from "./data";
import Menu from "./components/Menu";
import Cart from "./components/Cart";
import "./App.css";

export default function App() {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  function addToCart(dish) {
    // BUG #5: always adds a new entry — should check if dish is already in cart and increment quantity
    setCart([...cart, { ...dish, quantity: 1 }]);
  }

  function removeFromCart(id) {
    setCart(cart.filter((item) => item.id === id));
  }

  // BUG #6: cart.length counts duplicate entries, not unique items with quantities
  const cartCount = cart.length;

  return (
    <div className="app">
      <header className="app-header">
        <h1>roo<span style={{color:"#1a271f"}}>food</span></h1>
        <div className="cart-badge-wrapper">
          <span className="cart-icon">🛒</span>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </div>
      </header>

      <main className="app-main">
        <Menu
          dishes={dishes}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onAddToCart={addToCart}
        />
        <Cart cart={cart} onRemove={removeFromCart} />
      </main>
    </div>
  );
}
