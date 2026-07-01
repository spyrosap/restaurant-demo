# 📦 Gestion du panier — Quantité, Undo, Feedback d'ajout

## 1. Context & User Persona
Aujourd'hui, réduire la quantité d'un plat oblige à supprimer toute la ligne et à la re-sélectionner depuis le menu — friction inutile. Aucune suppression n'est réversible, et l'ajout au panier ne donne aucune confirmation visuelle, ce qui laisse un doute sur la prise en compte de l'action.

- **Persona principal** : client qui affine sa commande (ajuste des quantités, corrige une erreur) et veut un contrôle fin sans repartir de zéro.
- **Persona secondaire** : client pressé qui a besoin d'une confirmation immédiate que son clic a été pris en compte.

**Valeur** : réduire la friction et le risque de perte de commande accidentelle.

## 2. User Stories (Epic « Gestion du panier »)
- **US#1 (MVP)** — En tant que client, je veux ajuster la quantité d'un plat avec un stepper, afin de ne pas devoir le re-sélectionner depuis le menu.
- **US#2 (MVP)** — En tant que client, je veux que la quantité ne descende jamais sous 1 via le stepper, afin de garder un contrôle fin distinct de la suppression.
- **US#3 (MVP)** — En tant que client, je veux supprimer un plat via un bouton dédié et voir un message « Annuler » quelques secondes, afin de corriger une suppression accidentelle.
- **US#4 (MVP)** — En tant que client, je veux une confirmation visuelle immédiate quand j'ajoute un plat au panier, afin d'être sûr que mon action a été prise en compte.

## 3. Releases
- **Release 1 — MVP** : stepper +/- borné, bouton « Supprimer » dédié séparé du stepper, toast undo 3s, animation de l'icône panier à l'ajout.
- **Release 2 — Pistes futures** : étendre l'undo au vidage complet du panier, délai undo configurable (accessibilité).

## 4. Acceptance Criteria

**US#1 / US#2 — Quantité**
- GIVEN un plat dans le panier, WHEN le client clique sur « + », THEN la quantité augmente de 1 et le prix de la ligne se met à jour immédiatement.
- GIVEN un plat avec quantité > 1, WHEN le client clique sur « - », THEN la quantité diminue de 1 sans supprimer la ligne.
- GIVEN un plat avec quantité = 1, WHEN le client regarde le bouton « - », THEN celui-ci est désactivé (grisé) — la suppression passe uniquement par le bouton dédié.

**US#3 — Undo**
- GIVEN un plat dans le panier, WHEN le client clique sur le bouton « Supprimer » dédié, THEN la ligne est retirée ET un message « Plat retiré — Annuler » s'affiche pendant 3 secondes.
- GIVEN le message undo affiché, WHEN le client clique sur « Annuler » dans les 3 secondes, THEN le plat et sa quantité d'origine sont restaurés.
- GIVEN le message undo affiché, WHEN les 3 secondes s'écoulent sans action, THEN le message disparaît et la suppression devient définitive.

**US#4 — Feedback ajout**
- GIVEN un plat affiché dans le menu, WHEN le client clique sur « Ajouter au panier », THEN l'icône panier s'anime (pulse) et son badge de compteur s'incrémente visuellement.

## 5. Management Rules
- Le bouton « - » est actif uniquement si quantité > 1 ; sinon désactivé/grisé.
- La suppression d'une ligne se fait exclusivement via un bouton dédié (icône poubelle), jamais via le stepper.
- L'undo s'applique **uniquement** à la suppression complète d'une ligne (pas aux changements de quantité +/-).
- Délai d'undo fixé à **3 secondes**, non paramétrable en MVP.
- Un seul toast undo actif à la fois : une nouvelle suppression pendant qu'un undo est affiché rend le précédent définitif immédiatement.

## 6. Edge Cases
- Double suppression rapide sur deux plats différents → le nouveau toast remplace l'ancien, qui devient définitif (pas d'empilement de toasts).
- Fermeture/refresh de page pendant la fenêtre undo → suppression considérée comme définitive (pas de persistance de l'état « undoable »).
- Clic sur « Annuler » juste après expiration du délai (race condition) → action ignorée, le bouton doit visuellement se désactiver dès l'expiration.

## 7. Designs & Workflow Diagrams
- Stepper : `[-]` grisé `[1]` `[+]` tant que qty=1 ; dès qty≥2, `[-]` actif.
- Icône poubelle séparée à droite du stepper pour suppression explicite.
- Toast undo en bas de l'écran, avec barre de progression sur 3s.
- Icône panier (header) : badge qui pulse + chiffre qui s'incrémente au clic « Ajouter ».
- Flow : Ajout plat → animation icône → ajustement quantité → suppression via poubelle → toast undo (3s) → confirmation ou restauration.

## 8. Tracking (events)

| Event | Trigger | Propriétés clés |
|---|---|---|
| `cart_item_quantity_changed` | Clic +/- | `dish_id`, `direction`, `new_quantity` |
| `cart_item_removed` | Clic poubelle | `dish_id`, `quantity_at_removal` |
| `cart_item_undo_clicked` | Clic « Annuler » | `dish_id` |
| `cart_item_added` | Clic « Ajouter au panier » | `dish_id`, `source` |

## 9. Rollout plan
Projet démo : développement local, test manuel via checklist, pas de vrais utilisateurs en production.

## 10. Testing plan
- Bornes du stepper jamais < 1, suppression uniquement via poubelle, undo restaure l'état exact (quantité incluse), timeout 3s respecté.
- Bouton « - » visuellement désactivé à qty=1, animation panier non bloquante, toast lisible et accessible au clavier.
- Parcours complet : ajouter 3 plats, ajuster les quantités, supprimer un plat par erreur, l'annuler, vérifier la cohérence du total à chaque étape.
