# 👥 Commande de groupe — Attribution par convive & Partage de l'addition

## 1. Context & User Persona
La commande est aujourd'hui individuelle : impossible de gérer un repas à plusieurs sans que quelqu'un calcule l'addition à la main. Pour un usage réel (repas d'équipe, groupe d'amis), c'est une vraie friction qui pousse à sortir de l'app pour faire les comptes.

- **Persona principal** : l'organisateur, qui ouvre l'app et invite ses convives à composer la commande.
- **Persona secondaire** : les convives, dont les plats doivent être clairement identifiés pour une répartition fiable.

**Valeur** : transformer une commande individuelle en expérience de groupe fluide, sans calcul manuel.

## 2. User Stories (Epic « Commande de groupe »)
- **US#1 (MVP)** — En tant qu'organisateur, je veux ajouter les convives par leur nom en début de commande, afin de pouvoir leur attribuer des plats ensuite.
- **US#2 (MVP)** — En tant qu'organisateur, je veux retirer un convive via un bouton dédié, afin de corriger une erreur de saisie.
- **US#3 (MVP)** — En tant que client, je veux assigner chaque plat ajouté à un convive précis, afin que le calcul de l'addition soit fiable.
- **US#4 (MVP)** — En tant qu'organisateur, je veux être alerté si un convive n'a rien commandé au moment de valider, afin de ne pas l'oublier ou de le retirer s'il ne participe pas.
- **US#5 (MVP)** — En tant qu'organisateur, je veux choisir entre « paiement unique » et « répartition par convive », afin de m'adapter à la situation réelle du groupe.
- **US#6 (MVP)** — En tant que convive, je veux voir le détail de ma part (mes plats + montant), afin de savoir combien je dois payer.

## 3. Releases
- **Release 1 — MVP** : ajout/suppression de convives, attribution obligatoire 1 plat = 1 convive, alerte convive sans commande, choix payeur unique vs split, récap divisé.
- **Release 2 — Pistes futures** : plats partagés entre plusieurs convives (split au prorata), paiement individuel réel (chacun paie sa part séparément), sauvegarde d'un groupe de convives récurrent.

## 4. Acceptance Criteria

**US#1 / US#2 — Gestion des convives**
- GIVEN une commande de groupe démarrée, WHEN l'organisateur saisit un nom et valide, THEN le convive apparaît dans la liste des participants.
- GIVEN un convive dans la liste, WHEN l'organisateur clique sur le bouton « - » à côté de son nom, THEN le convive est retiré ET tous les plats qui lui étaient assignés repassent « non-assignés » (pas supprimés du panier).

**US#3 — Attribution**
- GIVEN un plat ajouté au panier, WHEN le client choisit un convive dans un sélecteur, THEN le plat est associé à ce convive et affiché sous son nom dans le récap.
- GIVEN un plat déjà assigné, WHEN l'attribution est changée, THEN le plat bascule vers le nouveau convive et disparaît du récap de l'ancien.

**US#4 — Alerte convive sans commande**
- GIVEN au moins un convive dans la liste, WHEN l'organisateur tente de valider et qu'un convive n'a aucun plat assigné, THEN une alerte nommant le(s) convive(s) concerné(s) s'affiche et bloque la validation en mode split.
- GIVEN l'alerte affichée, WHEN l'organisateur retire le convive concerné, THEN l'alerte disparaît et la validation redevient possible.

**US#5 / US#6 — Mode de paiement**
- GIVEN une commande de groupe, WHEN l'organisateur arrive à l'étape paiement, THEN il choisit entre « Paiement unique » et « Répartition par convive ».
- GIVEN le mode « Répartition par convive » choisi, WHEN le récap s'affiche, THEN chaque convive voit la liste de ses plats et le montant total qui lui est attribué.
- GIVEN le mode « Paiement unique » choisi, WHEN le récap s'affiche, THEN un seul montant total est affiché, sans détail par convive.

## 5. Management Rules
- **1 plat = 1 convive** (pas de partage d'un même plat entre plusieurs convives en MVP).
- Un convive peut être retiré à tout moment via un bouton dédié ; ses plats repassent en « non-assigné », ils ne sont pas supprimés du panier.
- Un plat non-assigné bloque la validation en mode « Répartition par convive » ; en mode « Paiement unique », l'attribution est ignorée pour le calcul et ne bloque rien.
- L'alerte « convive sans commande » se déclenche uniquement au moment de la validation (pas en continu pendant la saisie).
- L'attribution par convive reste en mémoire même si l'organisateur bascule vers « Paiement unique », pour permettre de repasser en split sans tout ressaisir.

## 6. Edge Cases
- Convive retiré pendant que ses plats sont déjà dans le panier → les plats restent, repassent « non-assignés », nécessitent une nouvelle attribution avant validation en mode split.
- Tous les convives supprimés sauf un → l'app repasse en commande individuelle standard (plus de split affiché).
- Deux convives avec le même nom → pas de dédoublonnage forcé en MVP, limite connue et assumée.
- Changement de mode de paiement après que des plats ont déjà été assignés → l'attribution reste en mémoire, permettant de rebasculer en split sans tout ressaisir.

## 7. Designs & Workflow Diagrams
- Écran « Convives » : chips avec nom + bouton « - » sur chacune, champ d'ajout en bas.
- Sur chaque plat du panier : sélecteur « Assigné à [Nom ▾] ».
- Bandeau d'alerte au-dessus du bouton « Valider la commande » si un convive n'a aucun plat : « ⚠️ [Nom] n'a rien commandé ».
- Étape paiement : toggle « Paiement unique / Répartition par convive », puis récap correspondant.
- Flow : Ajout convives → composition du panier avec attribution par plat → vérification (alerte si convive vide) → choix du mode de paiement → récap final → validation.

## 8. Tracking (events)

| Event | Trigger | Propriétés clés |
|---|---|---|
| `guest_added` | Ajout d'un convive | `guest_count_after` |
| `guest_removed` | Suppression d'un convive | `had_assigned_items` (bool) |
| `dish_assigned_to_guest` | Attribution d'un plat | `dish_id`, `guest_id`, `reassigned` (bool) |
| `empty_guest_alert_shown` | Tentative de validation avec convive vide | `guest_count_empty` |
| `payment_mode_selected` | Choix du mode à l'étape paiement | `mode`, `guest_count` |

## 9. Rollout plan
Projet démo : développement local, test manuel avec plusieurs scénarios de groupe (2, 3+ convives), pas de vrais utilisateurs en production.

## 10. Testing plan
- Ajout/suppression de convive, ré-assignation des plats après suppression, alerte convive vide déclenchée puis résolue, toggle paiement unique/split, montant par convive = somme exacte des plats assignés.
- Bouton « - » visible sur chaque convive, sélecteur d'attribution accessible depuis chaque plat, alerte bien visible avant validation.
- Parcours complet : créer une commande à 3 convives, assigner tous les plats sauf un, tenter de valider (alerte attendue), corriger, choisir split, vérifier le récap final par personne.
