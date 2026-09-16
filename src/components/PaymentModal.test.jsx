import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PaymentModal from "./PaymentModal";

// Regression test for the bug where the "Payment Successful!" receipt showed
// only the item list plus a single "Total paid" row, so the total looked
// unexplained (e.g. items summing to €5.00 but "Total paid: €6.00").
describe("PaymentModal success receipt", () => {
  it("shows the Subtotal/Tax breakdown that accounts for the total paid", async () => {
    const cart = [{ id: 2, name: "Soup of the Day", price: 5.0, quantity: 1, emoji: "🍲" }];
    const { container } = render(
      <PaymentModal cart={cart} onClose={() => {}} onSuccess={() => {}} />
    );

    // Step 1: order summary -> proceed to payment details.
    fireEvent.click(screen.getByRole("button", { name: "Proceed to Payment" }));

    // Step 2: fill in valid card details and pay.
    fireEvent.change(screen.getByPlaceholderText("Jane Smith"), {
      target: { value: "Jane Smith" },
    });
    fireEvent.change(screen.getByPlaceholderText("1234 5678 9012 3456"), {
      target: { value: "4111111111111111" },
    });
    fireEvent.change(screen.getByPlaceholderText("MM/YY"), {
      target: { value: "1230" },
    });
    fireEvent.change(screen.getByPlaceholderText("123"), {
      target: { value: "123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^Pay €/ }));

    // Step 3: processing -> success (real 2s timer in the component).
    await waitFor(() => screen.getByText("Payment Successful!"), { timeout: 3000 });

    const totals = container.querySelector(".modal-totals").textContent;

    // The receipt must show the breakdown, not just the final figure.
    expect(totals).toContain("Subtotal");
    expect(totals).toContain("€5.00");
    expect(totals).toContain("Tax (20%)");
    expect(totals).toContain("€1.00");
    expect(totals).toContain("Total paid");
    expect(totals).toContain("€6.00");
  });
});
