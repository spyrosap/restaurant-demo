export default function UndoToast({ pendingRemoval, onUndo }) {
  if (!pendingRemoval) return null;
  const { item, removalId } = pendingRemoval;

  return (
    <div className="undo-toast" role="status">
      <span className="undo-toast-message">{item.name} retiré</span>
      <button type="button" className="undo-toast-btn" onClick={onUndo}>
        Annuler
      </button>
      <div className="undo-toast-progress" key={removalId}>
        <div className="undo-toast-progress-bar" />
      </div>
    </div>
  );
}
