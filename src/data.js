export const deliveryInfo = {
  etaMin: 25,
  etaMax: 35, // average delivery estimate, in minutes
};

export const dishes = [
  { id: 1, name: "Bruschetta", description: "Toasted bread with tomatoes, garlic and fresh basil", price: 6.5, category: "Starters", emoji: "🍞", available: true },
  { id: 2, name: "Soup of the Day", description: "Ask your waiter for today's homemade soup", price: 5.0, category: "Starters", emoji: "🍲", available: true },
  { id: 3, name: "Garlic Prawns", description: "Sautéed king prawns in garlic butter and white wine", price: 9.5, category: "Starters", emoji: "🦐", available: true },
  { id: 4, name: "Caesar Salad", description: "Romaine lettuce, parmesan, croutons and Caesar dressing", price: 7.0, category: "Starters", emoji: "🥗", available: true },
  { id: 5, name: "Classic Burger", description: "Beef patty, cheddar, lettuce, tomato and pickles", price: 14.0, category: "Mains", emoji: "🍔", available: true },
  { id: 6, name: "Grilled Salmon", description: "Atlantic salmon with lemon butter sauce and seasonal vegetables", price: 18.5, category: "Mains", emoji: "🐟", available: false },
  { id: 7, name: "Margherita Pizza", description: "San Marzano tomato sauce, fresh mozzarella and basil", price: 13.0, category: "Mains", emoji: "🍕", available: true },
  { id: 8, name: "Mushroom Risotto", description: "Arborio rice with wild mushrooms, white wine and parmesan", price: 15.0, category: "Mains", emoji: "🍚", available: false },
  { id: 9, name: "Chicken Tikka Masala", description: "Tender chicken in a rich tomato and cream sauce with rice", price: 16.0, category: "Mains", emoji: "🍛", available: true },
  { id: 10, name: "Chocolate Lava Cake", description: "Warm chocolate cake with a molten centre and vanilla ice cream", price: 7.5, category: "Desserts", emoji: "🍫", available: true },
  { id: 11, name: "Crème Brûlée", description: "Classic French vanilla custard with a caramelised sugar crust", price: 6.5, category: "Desserts", emoji: "🍮", available: true },
  { id: 12, name: "Tiramisu", description: "Italian coffee-soaked ladyfingers with mascarpone cream", price: 7.0, category: "Desserts", emoji: "☕", available: true },
  { id: 13, name: "Kebab Classique", description: "Viande d'agneau rôtie à la broche, salade, tomate, oignon et sauce blanche dans un pain pita", price: 9.0, category: "Mains", emoji: "🥙", available: true },
  { id: 14, name: "Kebab Épicé", description: "Viande de bœuf épicée, piment, harissa, sauce rouge et crudités dans un pain pita grillé", price: 9.5, category: "Mains", emoji: "🌶️", available: true },
  { id: 15, name: "Triple Burger", description: "Trois steaks hachés de bœuf, triple cheddar, bacon croustillant, sauce maison et oignons caramélisés", price: 19.0, category: "Mains", emoji: "🍔", available: true },
  { id: 16, name: "Smash Burger", description: "Double galette smashée, fromage fondu, pickles, moutarde et ketchup maison", price: 16.5, category: "Mains", emoji: "🍔", available: true },
  { id: 17, name: "Hot Dog XXL", description: "Saucisse de Francfort jumbo, ketchup, moutarde, oignons frits et choucroute", price: 10.5, category: "Mains", emoji: "🌭", available: true },
  { id: 18, name: "Frites Maison", description: "Pommes de terre fraîches coupées à la main, sel de mer et herbes", price: 4.5, category: "Sides", emoji: "🍟", available: true },
  { id: 19, name: "Onion Rings", description: "Rondelles d'oignon panées, croustillantes, sauce ranch", price: 5.0, category: "Sides", emoji: "🧅", available: true },
  { id: 20, name: "Nuggets de Poulet (x8)", description: "Nuggets de poulet croustillants, sauce barbecue ou miel-moutarde", price: 8.5, category: "Sides", emoji: "🍗", available: true },
  { id: 21, name: "Coca-Cola", description: "Coca-Cola 33cl bien frais", price: 3.0, category: "Drinks", emoji: "🥤", available: true },
  { id: 22, name: "Sprite", description: "Sprite citron-citron vert 33cl", price: 3.0, category: "Drinks", emoji: "🥤", available: true },
  { id: 23, name: "Ice Tea Pêche", description: "Ice Tea saveur pêche 33cl", price: 3.0, category: "Drinks", emoji: "🍑", available: true },
  { id: 24, name: "Bière Pression (50cl)", description: "Bière blonde pression servie bien fraîche", price: 5.5, category: "Drinks", emoji: "🍺", available: true },
  { id: 25, name: "Bière IPA", description: "IPA artisanale locale, notes d'agrumes et de houblon, 33cl", price: 6.5, category: "Drinks", emoji: "🍺", available: true },
  { id: 26, name: "Bière Sans Alcool", description: "Bière blonde sans alcool, tout le goût sans l'alcool, 33cl", price: 4.0, category: "Drinks", emoji: "🍺", available: true },
  { id: 27, name: "Eau Minérale", description: "Eau minérale naturelle 50cl", price: 2.0, category: "Drinks", emoji: "💧", available: true },
  { id: 28, name: "Jus d'Orange Frais", description: "Jus d'orange pressé à la minute", price: 4.5, category: "Drinks", emoji: "🍊", available: true },
];

export const currentUserId = "demo-user-1";

// Demo scenarios for the "meal suggestions" feature — swap the value below and reload to exercise a different path:
//   Normal (default):        { dishId: 7, category: "Mains" }   -> personalized (Mains now has plenty of available options)
//   No purchase history:     null                                -> fallback only
//   Last dish discontinued:  { dishId: 999, category: "Mains" }  -> fallback only (999 doesn't exist in `dishes`)
export const lastOrder = { dishId: 7, category: "Mains" };

export const trendingDishIds = [10, 4, 1, 12];
