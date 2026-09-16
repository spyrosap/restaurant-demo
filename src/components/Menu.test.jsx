import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Menu from "./Menu";

const dishes = [
  { id: 1, name: "Bruschetta", description: "Starter dish", price: 6.5, category: "Starters", emoji: "🍞" },
  { id: 2, name: "Classic Burger", description: "Main dish", price: 14.0, category: "Mains", emoji: "🍔" },
  { id: 3, name: "Tiramisu", description: "Dessert dish", price: 7.0, category: "Desserts", emoji: "☕" },
];

describe("Menu", () => {
  it("shows every dish when the category is All", () => {
    render(
      <Menu dishes={dishes} selectedCategory="All" onCategoryChange={() => {}} onAddToCart={() => {}} />
    );

    expect(screen.getByText("Bruschetta")).toBeInTheDocument();
    expect(screen.getByText("Classic Burger")).toBeInTheDocument();
    expect(screen.getByText("Tiramisu")).toBeInTheDocument();
  });

  it("only shows dishes from the selected category", () => {
    render(
      <Menu dishes={dishes} selectedCategory="Desserts" onCategoryChange={() => {}} onAddToCart={() => {}} />
    );

    expect(screen.getByText("Tiramisu")).toBeInTheDocument();
    expect(screen.queryByText("Bruschetta")).not.toBeInTheDocument();
    expect(screen.queryByText("Classic Burger")).not.toBeInTheDocument();
  });

  it("notifies the parent when a category filter is clicked", () => {
    const onCategoryChange = vi.fn();
    render(
      <Menu dishes={dishes} selectedCategory="All" onCategoryChange={onCategoryChange} onAddToCart={() => {}} />
    );

    fireEvent.click(screen.getByRole("button", { name: "Mains" }));

    expect(onCategoryChange).toHaveBeenCalledWith("Mains");
  });
});
