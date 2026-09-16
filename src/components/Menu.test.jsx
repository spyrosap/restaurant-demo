import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Menu from './Menu';

const dishes = [
  { id: 1, name: 'Bruschetta', description: 'desc', price: 6.5, category: 'Starters', emoji: '🍞' },
  { id: 2, name: 'Classic Burger', description: 'desc', price: 14.0, category: 'Mains', emoji: '🍔' },
  { id: 3, name: 'Tiramisu', description: 'desc', price: 7.0, category: 'Desserts', emoji: '☕' },
];

function renderMenu(selectedCategory) {
  const onCategoryChange = vi.fn();
  const onAddToCart = vi.fn();
  render(
    <Menu
      dishes={dishes}
      selectedCategory={selectedCategory}
      onCategoryChange={onCategoryChange}
      onAddToCart={onAddToCart}
    />
  );
  return { onCategoryChange, onAddToCart };
}

describe('Menu category filter', () => {
  it('shows every dish when "All" is selected', () => {
    renderMenu('All');
    expect(screen.getByText('Bruschetta')).toBeInTheDocument();
    expect(screen.getByText('Classic Burger')).toBeInTheDocument();
    expect(screen.getByText('Tiramisu')).toBeInTheDocument();
  });

  it('only shows dishes matching the selected category', () => {
    renderMenu('Starters');
    expect(screen.getByText('Bruschetta')).toBeInTheDocument();
    expect(screen.queryByText('Classic Burger')).not.toBeInTheDocument();
    expect(screen.queryByText('Tiramisu')).not.toBeInTheDocument();
  });

  it('calls onCategoryChange when a category button is clicked', async () => {
    const user = userEvent.setup();
    const { onCategoryChange } = renderMenu('All');
    await user.click(screen.getByRole('button', { name: 'Mains' }));
    expect(onCategoryChange).toHaveBeenCalledWith('Mains');
  });
});
