import { useState } from "react";
import { dishes } from "../data";

const RULES = [
  // Léger / healthy / sèche
  { keywords: ["léger", "légère", "light", "leger", "pilates", "yoga", "sport", "healthy", "salade", "salad", "régime", "regime", "peu calorique", "sans gluten", "fit", "diète", "diete", "végétarien", "vegetarien", "vegan", "minceur", "pas trop lourd", "sèche", "seche", "sécher", "secher", "cutting", "sec", "diet", "maigrir", "perdre du poids", "low carb", "allégé", "allege", "équilibré", "equilibre", "propre", "frais", "fraîche", "fraiche"], categories: ["Starters"], maxPrice: 10 },

  // Copieux / gras
  { keywords: ["gras", "dalle", "j'ai faim", "jai faim", "faim", "famine", "affamé", "affame", "copieux", "copieuse", "consistant", "consistante", "calorie", "hearty", "comfort", "lourd", "lourde", "bien manger", "se remplir", "calorique", "crève la dalle", "creve la dalle", "mort de faim", "ventre vide", "remplir le ventre", "grosse faim", "j'ai la dalle", "jai la dalle", "manger lourd", "cheat meal", "cheat day", "malbouffe", "junk", "fast food"], categories: ["Mains"] },

  // Cuisines
  { keywords: ["italien", "italienne", "italiano", "italiana", "italie", "italy", "pasta", "pâtes", "pates", "rome", "napoli", "napolitain"], ids: [7, 8, 12] },
  { keywords: ["indien", "indienne", "india", "indian", "curry", "masala", "tikka", "épicé", "epice", "pimenté", "pimente", "relevé", "releve"], ids: [9] },
  { keywords: ["japonais", "japonaise", "japan", "sushi", "ramen", "asiatique", "asian"], ids: [6] },
  { keywords: ["méditerranéen", "mediterraneen", "grec", "grecque", "levant"], ids: [4, 3] },

  // Plats spécifiques
  { keywords: ["kebab", "kébab", "kebap", "shawarma", "pita", "agneau", "lamb", "doner"], ids: [13, 14] },
  { keywords: ["kebab épicé", "kebab epicé", "kebab fort", "harissa", "piment"], ids: [14] },
  { keywords: ["kebab classique", "kebab doux", "kebab sans épice"], ids: [13] },
  { keywords: ["triple burger", "triple", "gros burger", "énorme burger", "mega burger", "xxl burger"], ids: [15] },
  { keywords: ["smash", "smash burger", "double burger"], ids: [16] },
  { keywords: ["burger", "hamburger", "steak haché", "steak hache"], ids: [5, 15, 16] },
  { keywords: ["hot dog", "hotdog", "saucisse", "francfort"], ids: [17] },
  { keywords: ["pizza", "margherita", "mozzarella"], ids: [7] },
  { keywords: ["risotto", "champignon", "champignons", "mushroom"], ids: [8] },
  { keywords: ["poulet", "chicken", "tikka"], ids: [9] },
  { keywords: ["saumon", "salmon", "poisson", "fish", "fruits de mer", "seafood"], ids: [6] },
  { keywords: ["crevette", "crevettes", "prawn", "shrimp"], ids: [3] },
  { keywords: ["soupe", "soup", "velouté", "veloute", "bouillon", "réconfort", "reconfort"], ids: [2] },

  // Sides
  { keywords: ["frites", "frite", "chips", "potatoes", "patates"], ids: [18] },
  { keywords: ["onion rings", "oignon frit", "oignons frits"], ids: [19] },
  { keywords: ["nuggets", "nugget", "poulet pané"], ids: [20] },
  { keywords: ["accompagnement", "side", "à côté", "a cote", "en plus", "avec ça", "avec ca"], categories: ["Sides"] },

  // Boissons
  { keywords: ["coca", "coca-cola", "cola", "pepsi", "soda"], ids: [21, 22] },
  { keywords: ["sprite", "limonade", "citron vert"], ids: [22] },
  { keywords: ["ice tea", "thé glacé", "pêche", "peche"], ids: [23] },
  { keywords: ["jus", "orange", "jus d'orange", "pressé", "presse"], ids: [28] },
  { keywords: ["eau", "water", "minérale", "minerale", "plate"], ids: [27] },
  { keywords: ["bière sans alcool", "sans alcool", "0%", "zero alcool", "conduire", "conduit", "volant"], ids: [26] },
  { keywords: ["ipa", "craft", "artisanale", "houblon"], ids: [25] },
  { keywords: ["pression", "demi", "blonde"], ids: [24] },
  { keywords: ["bière", "biere", "beer", "pinte", "mousse", "alcool"], ids: [24, 25] },
  { keywords: ["boisson", "drink", "soif", "j'ai soif", "jai soif", "à boire", "a boire"], categories: ["Drinks"] },

  // Desserts
  { keywords: ["chocolat", "chocolate", "fondant", "lava", "moelleux"], ids: [10] },
  { keywords: ["tiramisu", "café", "cafe", "coffee"], ids: [12] },
  { keywords: ["crème brûlée", "creme brulee", "caramel", "vanille", "flan", "custard"], ids: [11] },
  { keywords: ["dessert", "sucré", "sucre", "gourmand", "gourmande", "gâteau", "gateau", "cake", "douceur", "sucré", "envie sucrée"], categories: ["Desserts"] },

  // Génériques
  { keywords: ["entrée", "entree", "starter", "apéro", "apero", "amuse-bouche"], categories: ["Starters"] },
  { keywords: ["plat principal", "plat chaud", "main course", "plat du soir"], categories: ["Mains"] },
  { keywords: ["repas complet", "menu complet", "tout", "assortiment", "un peu de tout"], all: true },
];

const POPULAR = dishes.filter((d) => [5, 7, 21, 18].includes(d.id));

// Extrait les sous-phrases par personne : "pour moi X et pour [relation] Y"
function splitByPerson(lower) {
  const m = lower.match(/pour moi\s+(.+?)\s+et\s+pour\s+(?:(?:ma|mon|mes|sa|son)\s+)?\w+\s+(?:de\s+l['']?|du\s+|de\s+)?(.+)$/);
  if (m) return [m[1].trim(), m[2].trim()];
  const m2 = lower.match(/^(.+?)\s+pour moi\s+et\s+(.+?)\s+pour\s+/);
  if (m2) return [m2[1].trim(), m2[2].trim()];
  return null;
}

function matchKeywords(text) {
  const lower = text.toLowerCase();
  const matched = [];
  for (const rule of RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      if (rule.all) return dishes.slice();
      if (rule.ids) matched.push(...dishes.filter((d) => rule.ids.includes(d.id)));
      else if (rule.categories) {
        let pool = dishes.filter((d) => rule.categories.includes(d.category));
        if (rule.maxPrice) pool = pool.filter((d) => d.price <= rule.maxPrice);
        if (pool.length > 0) matched.push(pool[0]);
      }
    }
  }
  return [...new Map(matched.map((d) => [d.id, d])).values()];
}

function matchDishes(prompt) {
  const lower = prompt.toLowerCase();

  const personMatch = lower.match(/(\d+)\s*(?:personnes?|pers\.?|people)/);
  const plusOneMatch = /\b(ma meuf|ma copine|mon copain|ma femme|mon mari|mon homme|mon mec|ma nana|ma chérie|ma cherie|mon chéri|mon cheri|ma moitié|ma moitie|mon pote|ma pote|mon ami|mon amie|ma sœur|ma soeur|mon frère|mon frere|ma coloc|mon coloc|ma go|mon go)\b/.test(lower);
  const persons = personMatch ? parseInt(personMatch[1]) : plusOneMatch ? 2 : 1;

  const budgetMatch = lower.match(/(\d+)\s*€?\s*(?:par personne|\/pers|euros?|€)/);
  const budget = budgetMatch ? parseFloat(budgetMatch[1]) : null;

  // Intent splitté : "pour moi X et pour [relation] Y"
  const splitParts = splitByPerson(lower);
  if (splitParts) {
    const [part1, part2] = splitParts;
    const items1 = matchKeywords(part1);
    const items2 = matchKeywords(part2);
    // Quantités individuelles : chaque plat est pour 1 personne
    const itemsWithQty = [
      ...items1.map((d) => ({ ...d, _qty: 1 })),
      ...items2.map((d) => ({ ...d, _qty: 1 })),
    ];
    // Dédupliquer : si même plat pour les deux, passer à ×2
    const qtyMap = {};
    itemsWithQty.forEach((d) => { qtyMap[d.id] = (qtyMap[d.id] || 0) + d._qty; });
    const deduped = [...new Map(itemsWithQty.map((d) => [d.id, d])).values()];
    return { items: deduped, qtyMap, persons, budget, splitMode: true };
  }

  const matched = matchKeywords(lower);

  // Fallback : rien trouvé → sélection populaire
  if (matched.length === 0) {
    return { items: POPULAR, persons: 1, budget, fallback: true };
  }

  // Plusieurs plats différents + plusieurs personnes = 1 plat par personne
  const useIndividualQty = matched.length > 1 && persons > 1;
  const qtyMap = {};
  matched.forEach((d) => { qtyMap[d.id] = useIndividualQty ? 1 : persons; });

  return { items: matched, qtyMap, persons, budget };
}

export default function ConciergeBar({ onFillCart }) {
  const [prompt, setPrompt] = useState("");
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState(null); // "empty" | "fallback" | null

  function handleSubmit(e) {
    e.preventDefault();
    if (!prompt.trim()) return;
    const result = matchDishes(prompt);
    setPreview(result);
    setStatus(result.fallback ? "fallback" : null);
  }

  function handleConfirm() {
    if (!preview) return;
    const cartItems = preview.items.map((d) => ({
      ...d,
      quantity: preview.qtyMap[d.id] ?? 1,
    }));
    onFillCart(cartItems);
    setPreview(null);
    setStatus(null);
    setPrompt("");
  }

  function handleCancel() {
    setPreview(null);
    setStatus(null);
    setPrompt("");
  }

  const total = preview
    ? preview.items.reduce((sum, d) => sum + d.price * (preview.qtyMap[d.id] ?? 1), 0)
    : 0;

  return (
    <div className="concierge-wrap">
      <form className="concierge-bar" onSubmit={handleSubmit}>
        <span className="concierge-icon">✦</span>
        <input
          className="concierge-input"
          type="text"
          placeholder="Commande-moi un truc léger pour ce soir, j'ai Pilates après…"
          value={prompt}
          onChange={(e) => { setPrompt(e.target.value); setPreview(null); setStatus(null); }}
        />
        <button className="concierge-btn" type="submit">Commander</button>
      </form>

      {preview && (
        <div className="concierge-preview">
          <p className="concierge-preview-title">
            {status === "fallback"
              ? "Je n'ai pas tout compris — voici notre sélection populaire :"
              : preview.splitMode
              ? `Voici la commande pour vous deux :`
              : preview.persons > 1
              ? `Voici ce que j'ai sélectionné pour ${preview.persons} personnes :`
              : "Voici ce que j'ai sélectionné :"}
          </p>
          <ul className="concierge-preview-list">
            {preview.items.map((d) => {
              const qty = preview.qtyMap[d.id] ?? 1;
              return (
                <li key={d.id} className="concierge-preview-item">
                  <span>{d.emoji} {d.name}</span>
                  <span className="concierge-preview-price">
                    €{(d.price * qty).toFixed(2)}
                    {qty > 1 && <span className="concierge-qty"> ×{qty}</span>}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="concierge-preview-total">
            Total : <strong>€{total.toFixed(2)}</strong>
          </div>
          <div className="concierge-preview-actions">
            <button className="concierge-cancel" onClick={handleCancel}>Annuler</button>
            <button className="concierge-confirm" onClick={handleConfirm}>Confirmer la commande</button>
          </div>
        </div>
      )}
    </div>
  );
}
