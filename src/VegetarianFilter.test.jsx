import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import Menu from './components/Menu';

function getVegToggle() {
  return screen.getByRole('switch', { name: /filtre végétarien/i });
}

describe('Vegetarian Filter', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('AC1 — activating the filter transforms matching dish names and marks the toggle on', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText('Chicken Tikka Masala')).toBeInTheDocument();

    await user.click(getVegToggle());

    expect(screen.getByText('Tofu Tikka Masala')).toBeInTheDocument();
    expect(screen.queryByText('Chicken Tikka Masala')).not.toBeInTheDocument();
    expect(getVegToggle()).toHaveAttribute('aria-checked', 'true');
    expect(console.log).toHaveBeenCalledWith(
      'vegetarian_filter_activated',
      expect.objectContaining({ nb_items_transformed: 1, nb_items_hidden: 3 })
    );
  });

  it('AC2 — deactivating the filter restores original names and previously hidden dishes', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(getVegToggle());
    await user.click(getVegToggle());

    expect(screen.getByText('Chicken Tikka Masala')).toBeInTheDocument();
    expect(screen.getByText('Garlic Prawns')).toBeInTheDocument();
    expect(screen.getByText('Classic Burger')).toBeInTheDocument();
    expect(screen.getByText('Grilled Salmon')).toBeInTheDocument();
    expect(getVegToggle()).toHaveAttribute('aria-checked', 'false');
    expect(console.log).toHaveBeenCalledWith(
      'vegetarian_filter_deactivated',
      expect.objectContaining({ restaurant_id: 'demo', page: 'menu' })
    );
  });

  it('AC3 — an already-vegetarian dish stays visible and unchanged', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(getVegToggle());

    expect(screen.getByText('Margherita Pizza')).toBeInTheDocument();
  });

  it('AC4 — non-vegetarian dishes with no keyword match are hidden while the filter is active', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(getVegToggle());

    expect(screen.queryByText('Garlic Prawns')).not.toBeInTheDocument();
    expect(screen.queryByText('Classic Burger')).not.toBeInTheDocument();
    expect(screen.queryByText('Grilled Salmon')).not.toBeInTheDocument();
  });

  it('AC5 — shows the empty-state message when no dish remains after filtering', () => {
    // App applies applyVegetarianFilter before passing dishes down, so Menu
    // receives an already-filtered (empty) list here, matching real usage.
    render(
      <Menu
        dishes={[]}
        selectedCategory="All"
        onCategoryChange={() => {}}
        onAddToCart={() => {}}
        isVegetarianActive={true}
        onToggleVegetarian={() => {}}
      />
    );

    expect(screen.getByText('Aucun plat végétarien disponible pour le moment')).toBeInTheDocument();
    expect(console.log).toHaveBeenCalledWith(
      'vegetarian_filter_empty_state_shown',
      expect.objectContaining({ restaurant_id: 'demo' })
    );
  });
});
