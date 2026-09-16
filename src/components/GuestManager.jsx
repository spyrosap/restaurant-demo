import { useState } from "react";

export default function GuestManager({ guests, maxParticipants, onAdd, onRename, onRemove, onClose }) {
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [error, setError] = useState("");

  const isFull = guests.length >= maxParticipants;

  function isNameTaken(name, ignoreId) {
    const normalized = name.trim().toLowerCase();
    return guests.some((g) => g.id !== ignoreId && g.name.trim().toLowerCase() === normalized);
  }

  function handleAdd(e) {
    e.preventDefault();
    const trimmed = newName.trim();
    if (isFull) {
      setError("Commande de groupe pleine");
      return;
    }
    if (!trimmed) {
      setError("Merci de saisir un nom");
      return;
    }
    if (isNameTaken(trimmed)) {
      setError("Ce nom est déjà utilisé");
      return;
    }
    onAdd(trimmed);
    setNewName("");
    setError("");
  }

  function startEdit(guest) {
    setEditingId(guest.id);
    setEditValue(guest.name);
    setError("");
  }

  function commitEdit() {
    const trimmed = editValue.trim();
    if (!trimmed) {
      setEditingId(null);
      return;
    }
    if (isNameTaken(trimmed, editingId)) {
      setError("Ce nom est déjà utilisé");
      return;
    }
    onRename(editingId, trimmed);
    setEditingId(null);
    setError("");
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Commande de groupe</h2>

        <ul className="guest-list">
          {guests.map((guest) => (
            <li key={guest.id} className="guest-row">
              {editingId === guest.id ? (
                <input
                  className="card-input guest-edit-input"
                  value={editValue}
                  autoFocus
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={commitEdit}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitEdit();
                    if (e.key === "Escape") setEditingId(null);
                  }}
                />
              ) : (
                <span className="guest-name">{guest.name}</span>
              )}

              {guest.id !== "me" && editingId !== guest.id && (
                <span className="guest-actions">
                  <button
                    type="button"
                    className="guest-action-btn"
                    onClick={() => startEdit(guest)}
                    aria-label={`Modifier ${guest.name}`}
                  >
                    ✎
                  </button>
                  <button
                    type="button"
                    className="guest-action-btn guest-remove-btn"
                    onClick={() => onRemove(guest.id)}
                    aria-label={`Retirer ${guest.name}`}
                  >
                    ✕
                  </button>
                </span>
              )}
            </li>
          ))}
        </ul>

        <form className="guest-add-row" onSubmit={handleAdd}>
          <input
            className="card-input"
            type="text"
            placeholder="Nom de l'invité"
            value={newName}
            disabled={isFull}
            onChange={(e) => {
              setNewName(e.target.value);
              setError("");
            }}
          />
          <button type="submit" className="modal-btn-primary" disabled={isFull}>
            Ajouter
          </button>
        </form>

        {error && <p className="guest-error">{error}</p>}
        <p className="guest-limit-note">
          {guests.length} / {maxParticipants} participants
        </p>

        <div className="modal-actions">
          <button className="modal-btn-primary" onClick={onClose}>
            Terminé
          </button>
        </div>
      </div>
    </div>
  );
}
