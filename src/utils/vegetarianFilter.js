const MEAT_FISH_KEYWORDS = [
  "chicken", "poulet", "beef", "lamb", "agneau",
  "pork", "porc", "fish", "poisson", "shrimp", "crevette",
];

// \b word boundaries prevent substring false positives (e.g. "fish" won't match inside "selfish").
function buildKeywordRegex(withGlobalFlag) {
  return new RegExp(`\\b(${MEAT_FISH_KEYWORDS.join("|")})\\b`, withGlobalFlag ? "gi" : "i");
}

export function containsMeatOrFishKeyword(name) {
  return buildKeywordRegex(false).test(name);
}

export function transformDishName(name) {
  return name.replace(buildKeywordRegex(true), (match) => {
    const isUpperFirst = match[0] === match[0].toUpperCase();
    return isUpperFirst ? "Tofu" : "tofu";
  });
}

export function applyVegetarianFilter(dishes) {
  const result = [];
  let nbTransformed = 0;
  let nbHidden = 0;

  for (const dish of dishes) {
    if (containsMeatOrFishKeyword(dish.name)) {
      result.push({ ...dish, name: transformDishName(dish.name) });
      nbTransformed++;
    } else if (dish.isVegetarian === false) {
      nbHidden++;
    } else {
      result.push(dish);
    }
  }

  return { dishes: result, nbTransformed, nbHidden };
}
