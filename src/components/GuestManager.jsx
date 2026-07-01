import { useState } from "react";

export default function GuestManager({ guests, onAddGuest, onRemoveGuest }) {
  const [name, setName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAddGuest(trimmed);
    setName("");
  }

  return (
    <div className="guest-manager">
      <h3 className="guest-manager-title">Convives</h3>

      {guests.length > 0 && (
        <ul className="guest-chip-list">
          {guests.map((guest) => (
            <li key={guest.id} className="guest-chip">
              <span className="guest-chip-name">{guest.name}</span>
              <button
                type="button"
                className="guest-chip-remove"
                aria-label={`Retirer ${guest.name}`}
                onClick={() => onRemoveGuest(guest.id)}
              >
                −
              </button>
            </li>
          ))}
        </ul>
      )}

      <form className="guest-add-form" onSubmit={handleSubmit}>
        <input
          className="guest-add-input"
          type="text"
          placeholder="Nom du convive"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit" className="guest-add-btn" disabled={!name.trim()}>
          + Ajouter
        </button>
      </form>
    </div>
  );
}
