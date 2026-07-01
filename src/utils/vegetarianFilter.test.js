import { describe, it, expect } from 'vitest';
import { containsMeatOrFishKeyword, transformDishName, applyVegetarianFilter } from './vegetarianFilter';
import { dishes } from '../data';

describe('containsMeatOrFishKeyword', () => {
  it('matches a whole-word keyword in the name', () => {
    expect(containsMeatOrFishKeyword('Chicken Tikka Masala')).toBe(true);
  });

  it('does not match a keyword as a substring of another word', () => {
    expect(containsMeatOrFishKeyword('Selfish Pasta')).toBe(false);
  });

  it('returns false when no keyword is present', () => {
    expect(containsMeatOrFishKeyword('Margherita Pizza')).toBe(false);
  });
});

describe('transformDishName', () => {
  it('replaces the keyword with "Tofu", preserving capitalization', () => {
    expect(transformDishName('Chicken Tikka Masala')).toBe('Tofu Tikka Masala');
  });

  it('replaces a lowercase keyword with lowercase "tofu"', () => {
    expect(transformDishName('chicken wrap')).toBe('tofu wrap');
  });

  it('replaces every keyword occurrence independently', () => {
    expect(transformDishName('Chicken and Beef Skewers')).toBe('Tofu and Tofu Skewers');
  });
});

describe('applyVegetarianFilter', () => {
  it('transforms, hides and leaves dishes unchanged per the demo data set', () => {
    const { dishes: result, nbTransformed, nbHidden } = applyVegetarianFilter(dishes);

    expect(nbTransformed).toBe(1);
    expect(nbHidden).toBe(3);

    const names = result.map((dish) => dish.name);
    expect(names).toContain('Tofu Tikka Masala');
    expect(names).not.toContain('Chicken Tikka Masala');
    expect(names).not.toContain('Garlic Prawns');
    expect(names).not.toContain('Classic Burger');
    expect(names).not.toContain('Grilled Salmon');
    expect(names).toContain('Margherita Pizza');
  });

  it('shows an empty result when every dish is non-vegetarian with no keyword match', () => {
    const allHidden = [
      { id: 1, name: 'Garlic Prawns', isVegetarian: false },
      { id: 2, name: 'Grilled Salmon', isVegetarian: false },
    ];
    const { dishes: result, nbHidden } = applyVegetarianFilter(allHidden);

    expect(result).toHaveLength(0);
    expect(nbHidden).toBe(2);
  });
});
