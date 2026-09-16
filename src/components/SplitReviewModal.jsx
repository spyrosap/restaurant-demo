import { computeBreakdown } from "../utils/splitBill";

export default function SplitReviewModal({ cart, guests, deliveryFee, taxRate, onClose, onConfirm }) {
  const { rows, subtotal, tax, grandTotal } = computeBreakdown({ cart, guests, deliveryFee, taxRate });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal split-review-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Répartition de l'addition</h2>

        <div className="split-table">
          <div className="split-table-header">
            <span>Personne</span>
            <span>Articles</span>
            <span>Sous-total</span>
            <span>Taxe</span>
            <span>Livraison</span>
            <span>Total</span>
          </div>
          {rows.map((row) => (
            <div key={row.id} className="split-table-row">
              <span className="split-guest-name">{row.name}</span>
              <span className="split-guest-items">
                {row.items.map((item, i) => (
                  <span key={i} className="split-item-line">
                    {item.name} — €{item.amount.toFixed(2)}
                  </span>
                ))}
              </span>
              <span>€{row.subtotal.toFixed(2)}</span>
              <span>€{row.taxShare.toFixed(2)}</span>
              <span>€{row.deliveryShare.toFixed(2)}</span>
              <span className="split-guest-total">€{row.total.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="modal-totals">
          <div className="modal-totals-row">
            <span>Sous-total</span><span>€{subtotal.toFixed(2)}</span>
          </div>
          <div className="modal-totals-row">
            <span>Taxe</span><span>€{tax.toFixed(2)}</span>
          </div>
          <div className="modal-totals-row">
            <span>Livraison</span><span>€{deliveryFee.toFixed(2)}</span>
          </div>
          <div className="modal-totals-row modal-totals-total">
            <span>Total commande</span><span>€{grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="modal-actions">
          <button className="modal-btn-secondary" onClick={onClose}>Retour</button>
          <button className="modal-btn-primary" onClick={onConfirm}>Confirmer et payer</button>
        </div>
      </div>
    </div>
  );
}
