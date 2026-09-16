import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Cart from "./Cart";

// Regression test for the bug where the cart panel displayed "Tax (10%)"
// next to a value that was actually calculated at 20%.
describe("Cart totals", () => {
  it("labels the tax row with the rate that is actually charged", () => {
    const cart = [{ id: 2, name: "Soup of the Day", price: 5.0, quantity: 1, emoji: "🍲" }];
    render(<Cart cart={cart} onRemove={() => {}} onCheckout={() => {}} />);

    // 20% of €5.00 subtotal is €1.00 — the on-screen label must say 20%.
    expect(screen.getByText("Tax (20%)")).toBeInTheDocument();
    expect(screen.queryByText("Tax (10%)")).not.toBeInTheDocument();
    expect(screen.getByText("€1.00")).toBeInTheDocument();
    expect(screen.getByText("€6.00")).toBeInTheDocument();
  });
});
