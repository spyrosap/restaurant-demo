// Mock data for the roofood marketplace.
// Each restaurant has its own menu. The mock API in src/api.js reads from here.

export const deliveryInfo = {
  etaMin: 25,
  etaMax: 35, // average delivery estimate, in minutes
};

export const restaurants = [
  {
    id: 1,
    name: "roofood Kitchen",
    cuisine: "European",
    emoji: "🍽️",
    rating: 4.6,
    deliveryFee: 2.49,
    etaMin: 25,
    etaMax: 35,
    menu: [
      { id: 1, name: "Bruschetta", description: "Toasted bread with tomatoes, garlic and fresh basil", price: 6.5, category: "Starters", emoji: "🍞" },
      { id: 2, name: "Soup of the Day", description: "Ask your waiter for today's homemade soup", price: 5.0, category: "Starters", emoji: "🍲" },
      { id: 3, name: "Garlic Prawns", description: "Sautéed king prawns in garlic butter and white wine", price: 9.5, category: "Starters", emoji: "🦐" },
      { id: 4, name: "Caesar Salad", description: "Romaine lettuce, parmesan, croutons and Caesar dressing", price: 7.0, category: "Starters", emoji: "🥗" },
      { id: 5, name: "Classic Burger", description: "Beef patty, cheddar, lettuce, tomato and pickles", price: 14.0, category: "Mains", emoji: "🍔" },
      { id: 6, name: "Grilled Salmon", description: "Atlantic salmon with lemon butter sauce and seasonal vegetables", price: 18.5, category: "Mains", emoji: "🐟" },
      { id: 7, name: "Margherita Pizza", description: "San Marzano tomato sauce, fresh mozzarella and basil", price: 13.0, category: "Mains", emoji: "🍕" },
      { id: 8, name: "Mushroom Risotto", description: "Arborio rice with wild mushrooms, white wine and parmesan", price: 15.0, category: "Mains", emoji: "🍚" },
      { id: 9, name: "Chicken Tikka Masala", description: "Tender chicken in a rich tomato and cream sauce with rice", price: 16.0, category: "Mains", emoji: "🍛" },
      { id: 10, name: "Chocolate Lava Cake", description: "Warm chocolate cake with a molten centre and vanilla ice cream", price: 7.5, category: "Desserts", emoji: "🍫" },
      { id: 11, name: "Crème Brûlée", description: "Classic French vanilla custard with a caramelised sugar crust", price: 6.5, category: "Desserts", emoji: "🍮" },
      { id: 12, name: "Tiramisu", description: "Italian coffee-soaked ladyfingers with mascarpone cream", price: 7.0, category: "Desserts", emoji: "☕" },
    ],
  },
  {
    id: 2,
    name: "Sakura Sushi",
    cuisine: "Japanese",
    emoji: "🍣",
    rating: 4.8,
    deliveryFee: 3.49,
    etaMin: 30,
    etaMax: 45,
    menu: [
      { id: 201, name: "Edamame", description: "Steamed soybeans tossed with sea salt", price: 4.5, category: "Starters", emoji: "🫛" },
      { id: 202, name: "Miso Soup", description: "Traditional soup with tofu, wakame and spring onion", price: 4.0, category: "Starters", emoji: "🍲" },
      { id: 203, name: "Gyoza", description: "Pan-fried pork and cabbage dumplings (6 pcs)", price: 6.5, category: "Starters", emoji: "🥟" },
      { id: 204, name: "Salmon Nigiri", description: "Two pieces of fresh salmon over seasoned rice", price: 6.0, category: "Mains", emoji: "🍣" },
      { id: 205, name: "Dragon Roll", description: "Eel and cucumber topped with avocado and eel sauce", price: 12.5, category: "Mains", emoji: "🐉" },
      { id: 206, name: "Chicken Katsu Curry", description: "Crispy breaded chicken with Japanese curry and rice", price: 13.5, category: "Mains", emoji: "🍛" },
      { id: 207, name: "Spicy Tuna Roll", description: "Fresh tuna with spicy mayo and cucumber (8 pcs)", price: 9.0, category: "Mains", emoji: "🌶️" },
      { id: 208, name: "Mochi Ice Cream", description: "Assorted rice-cake wrapped ice cream (3 pcs)", price: 5.5, category: "Desserts", emoji: "🍡" },
      { id: 209, name: "Matcha Cheesecake", description: "Green tea cheesecake with a biscuit base", price: 6.0, category: "Desserts", emoji: "🍵" },
    ],
  },
  {
    id: 3,
    name: "Taco Fiesta",
    cuisine: "Mexican",
    emoji: "🌮",
    rating: 4.4,
    deliveryFee: 1.99,
    etaMin: 20,
    etaMax: 30,
    menu: [
      { id: 301, name: "Nachos Supreme", description: "Tortilla chips loaded with cheese, jalapeños and guacamole", price: 7.5, category: "Starters", emoji: "🧀" },
      { id: 302, name: "Quesadilla", description: "Grilled flour tortilla with melted cheese and chicken", price: 6.5, category: "Starters", emoji: "🫓" },
      { id: 303, name: "Beef Tacos", description: "Three soft tacos with seasoned beef, salsa and lime", price: 11.0, category: "Mains", emoji: "🌮" },
      { id: 304, name: "Chicken Burrito", description: "Large flour tortilla with rice, beans, cheese and chicken", price: 10.5, category: "Mains", emoji: "🌯" },
      { id: 305, name: "Veggie Fajitas", description: "Sizzling peppers, onions and mushrooms with warm tortillas", price: 12.0, category: "Mains", emoji: "🫑" },
      { id: 306, name: "Churros", description: "Cinnamon sugar churros with a chocolate dipping sauce", price: 5.0, category: "Desserts", emoji: "🍩" },
      { id: 307, name: "Tres Leches Cake", description: "Sponge cake soaked in three kinds of milk", price: 5.5, category: "Desserts", emoji: "🍰" },
    ],
  },
  {
    id: 4,
    name: "Green Bowl",
    cuisine: "Healthy",
    emoji: "🥗",
    rating: 4.7,
    deliveryFee: 2.99,
    etaMin: 15,
    etaMax: 25,
    menu: [
      { id: 401, name: "Hummus & Pita", description: "Creamy chickpea hummus with warm pita and olive oil", price: 5.5, category: "Starters", emoji: "🫓" },
      { id: 402, name: "Tomato Gazpacho", description: "Chilled Spanish tomato and cucumber soup", price: 5.0, category: "Starters", emoji: "🍅" },
      { id: 403, name: "Poke Bowl", description: "Sushi rice, tuna, avocado, edamame and sesame dressing", price: 13.5, category: "Mains", emoji: "🥢" },
      { id: 404, name: "Quinoa Power Bowl", description: "Quinoa, roasted veg, chickpeas and tahini dressing", price: 11.5, category: "Mains", emoji: "🥙" },
      { id: 405, name: "Grilled Chicken Salad", description: "Mixed greens, grilled chicken, avocado and vinaigrette", price: 12.0, category: "Mains", emoji: "🥗" },
      { id: 406, name: "Acai Bowl", description: "Acai blend topped with granola, banana and berries", price: 8.0, category: "Desserts", emoji: "🫐" },
      { id: 407, name: "Chia Pudding", description: "Coconut chia pudding with mango and passionfruit", price: 6.0, category: "Desserts", emoji: "🥭" },
    ],
  },
];

// Kept for backward compatibility — the original single-restaurant menu.
export const dishes = restaurants[0].menu;
