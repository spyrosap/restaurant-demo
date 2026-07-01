# Spec — Recherche dynamique et catégorisation par régime alimentaire

Statut : Draft — document vivant, à mettre à jour au fil de l'évolution de la fonctionnalité.

---

## 1. Context et User Persona

L'app **roofood** (clone Deliveroo, React + Vite) permet de parcourir un menu de plats et de les ajouter au panier. Aujourd'hui, le menu (`src/data.js`) ne propose qu'un filtre par catégorie (Starters / Mains / Desserts) et aucun moyen de rechercher un plat par mot-clé. Aucune information de régime alimentaire n'existe sur les plats.

**Problème** : sur une carte qui s'agrandit, deux frictions apparaissent — (1) un client qui sait déjà ce qu'il veut doit scroller toute la carte pour trouver un plat précis, (2) un client avec une restriction alimentaire (végétarien, végan, sans gluten, halal) n'a aucun moyen de savoir rapidement quels plats lui sont accessibles, et risque d'abandonner sa commande.

**Pour qui** : tous les clients de l'app au moment de choisir leurs plats — pas de segmentation par ancienneté, tous les utilisateurs du menu sont concernés.

**Pourquoi c'est important** : réduire la friction de découverte du menu pour augmenter la probabilité d'ajout au panier, en particulier pour les clients avec restriction alimentaire qui abandonnent aujourd'hui faute de visibilité.

**KPI visé** : taux de conversion — proportion de sessions avec recherche et/ou filtre régime actif qui se terminent par un ajout au panier, comparé aux sessions sans usage de ces outils.

---

## 2. User Stories

**Epic : Recherche et catégorisation par régime alimentaire**

- En tant que **client qui sait déjà quel plat il veut**, quand je tape un mot-clé dans une barre de recherche, je veux voir la liste des plats se filtrer instantanément, afin de trouver mon plat sans scroller toute la carte.
- En tant que **client avec une restriction alimentaire**, quand je consulte le menu, je veux voir clairement quels régimes (végétarien, végan, sans gluten, halal) chaque plat respecte, afin d'identifier rapidement les plats qui me sont accessibles.
- En tant que **client avec une restriction alimentaire**, quand je sélectionne un ou plusieurs régimes alimentaires, je veux que le menu ne montre que les plats compatibles, afin de ne pas avoir à vérifier chaque plat un par un.
- En tant que **client**, quand je combine une recherche texte et un filtre régime, je veux que les deux s'appliquent ensemble, afin d'affiner ma recherche selon mes deux critères à la fois.

> Utilisateurs internes : cette version ne couvre pas d'interface de gestion des régimes alimentaires. Le tag de régime par plat est renseigné directement dans les données du menu (`src/data.js`) par l'équipe produit/contenu. Une back-office dédiée est hors scope de cette spec.

---

## 3. Releases

### Release 1 — MVP
Livre la valeur complète en une fois, comme un client la vivrait :
- Barre de recherche dynamique (par nom et description de plat)
- Tags de régime alimentaire affichés sur chaque plat (végétarien, végan, sans gluten, halal)
- Filtre par régime alimentaire, combinable avec la recherche texte et le filtre catégorie existant

### Release 2 — pistes futures (hors scope, non engagé)
- Élargissement à d'autres régimes/allergènes (sans lactose, sans fruits à coque, etc.)
- Suggestions de recherche / historique des recherches récentes
- Mise en avant des plats populaires dans les résultats vides

---

## 4. Acceptance Criteria

**Recherche dynamique**

- GIVEN le menu affiché, WHEN je saisis un caractère dans la barre de recherche, THEN la liste des plats se met à jour instantanément pour ne montrer que les plats dont le nom ou la description contient le texte saisi (insensible à la casse et aux accents).
- GIVEN une recherche en cours, WHEN j'efface tout le texte de la barre, THEN la liste revient à l'ensemble des plats (selon les filtres catégorie/régime encore actifs).
- GIVEN une recherche dont aucun plat ne correspond, WHEN les résultats sont affichés, THEN un message "Aucun plat trouvé" s'affiche à la place de la grille, avec une option pour réinitialiser la recherche.

**Tags de régime alimentaire**

- GIVEN un plat compatible avec un ou plusieurs régimes, WHEN il est affiché dans le menu, THEN un badge par régime compatible est visible sur sa carte (ex : "Végétarien", "Sans gluten").
- GIVEN un plat qui n'est compatible avec aucun régime particulier, WHEN il est affiché, THEN aucun badge n'apparaît sur sa carte (pas de badge "aucun régime").

**Filtre par régime**

- GIVEN le menu affiché, WHEN je sélectionne un régime alimentaire dans le filtre, THEN seuls les plats compatibles avec ce régime restent affichés.
- GIVEN un filtre régime déjà actif, WHEN je sélectionne un second régime, THEN seuls les plats compatibles avec **tous** les régimes sélectionnés sont affichés (logique AND entre régimes).
- GIVEN un ou plusieurs régimes sélectionnés, WHEN je désélectionne tous les régimes actifs, THEN le filtre régime redevient inactif et n'affecte plus la liste.

**Combinaison des filtres**

- GIVEN une recherche texte active ET un ou plusieurs régimes sélectionnés, WHEN les deux sont appliqués, THEN seuls les plats qui correspondent au texte recherché **ET** à tous les régimes sélectionnés sont affichés (logique AND entre recherche, catégorie et régime(s)).
- GIVEN un plat ajouté au panier pendant qu'une recherche ou un filtre régime est actif, WHEN l'ajout est confirmé, THEN la recherche et les filtres restent inchangés (pas de réinitialisation involontaire).

---

## 5. Management Rules

- Le champ régime alimentaire est une liste (un plat peut appartenir à zéro, un ou plusieurs régimes parmi : Végétarien, Végan, Sans gluten, Halal).
- La recherche s'applique sur le **nom** et la **description** du plat, pas sur le prix ni la catégorie.
- La recherche ne nécessite pas de minimum de caractères : elle se déclenche dès le premier caractère saisi.
- La recherche est insensible à la casse et aux accents (ex : "creme" doit trouver "Crème Brûlée").
- Entre régimes sélectionnés simultanément et entre la recherche texte, le filtre catégorie et le filtre régime : logique AND partout (chaque filtre actif restreint davantage les résultats ; un plat doit satisfaire l'ensemble des critères actifs pour rester affiché). Il n'y a pas de logique OR dans cette fonctionnalité — un client qui coche Végétarien et Végan ne verra que les plats qui sont les deux à la fois.
- **Dépendance bloquante : le filtre catégorie existant ne filtre pas réellement aujourd'hui.** Dans [`Menu.jsx`](../src/components/Menu.jsx), le composant reçoit `selectedCategory` mais l'utilise seulement pour styliser le bouton actif (`filteredDishes = dishes`, sans filtrage réel) : quelle que soit la catégorie cliquée, tous les plats restent affichés. Cette fonctionnalité repose sur une combinaison AND entre catégorie, recherche et régime(s) ; tant que ce bug n'est pas corrigé, une combinaison comme "catégorie Desserts + régime Végan" continuerait d'afficher des plats hors Desserts, ce qui rendrait le comportement décrit en section 4 impossible à respecter. La correction de ce bug (faire en sorte que `selectedCategory` filtre réellement `dishes` avant de les passer au reste de la logique) est donc un pré-requis à traiter avant ou en même temps que cette fonctionnalité, pas un nice-to-have séparé.

---

## 6. Edge Cases

- Si un régime alimentaire n'a aucun plat compatible sur la carte actuelle, alors le filtre reste affiché et sélectionnable, et affiche l'état "Aucun plat trouvé" une fois sélectionné (le filtre n'est pas masqué).
- Si la recherche contient des caractères spéciaux ou des emojis, alors elle est traitée comme du texte simple et ne provoque pas d'erreur (résultat vide si rien ne correspond).
- Si l'utilisateur efface rapidement plusieurs caractères d'affilée (ex: via un bouton "clear"), alors la liste se met à jour sans affichage intermédiaire incohérent.
- Si la recherche est vide mais qu'un filtre régime est actif, alors seul le filtre régime s'applique (la recherche vide n'exclut aucun plat).
- Si aucun plat de la carte ne respecte simultanément tous les régimes sélectionnés (ex : Végan + Halal cochés en même temps et aucun plat ne coche les deux cases), alors l'état "Aucun plat trouvé" s'affiche, comme pour une recherche sans résultat.
- Si l'utilisateur change de catégorie (Starters/Mains/Desserts) pendant qu'une recherche ou un filtre régime est actif, alors la recherche et le filtre régime restent actifs et se recombinent avec la nouvelle catégorie.

---

## 7. Tracking

| Event | Trigger | Propriétés clés | Métrique de succès servie |
|---|---|---|---|
| `menu_search_performed` | L'utilisateur saisit une recherche (debounce ~300ms après la dernière frappe) | `query_length`, `results_count`, `diet_filters_active` (bool) | Mesure l'usage réel de la recherche |
| `diet_filter_applied` | L'utilisateur sélectionne ou désélectionne un régime alimentaire | `diet` (valeur du régime), `active_diets_count`, `results_count` | Mesure l'adoption du filtre régime |
| `dish_added_to_cart_from_discovery` | Un plat est ajouté au panier alors qu'une recherche ou un filtre régime est actif | `dish_id`, `source` (`search` / `diet_filter` / `both`) | KPI principal : taux de conversion |
| `menu_search_zero_results` | Une recherche et/ou un filtre régime combiné aboutit à 0 résultat | `query`, `active_diets` | Identifie les besoins non couverts par la carte actuelle |

---

## 8. Rollout Plan

- **Alpha** — Développement sur une branche dédiée, revue de code (workflow `claude-review.yml`), test manuel local uniquement.
- **Beta** — Déployé sur l'environnement de preview (`deploy.yml`), testé par un petit groupe de retours internes avant merge sur `main`.
- **Stable** — Fusionné sur `main` et déployé en production (GitHub Pages), disponible pour tous les visiteurs de l'app.

---

## 9. Testing Plan

- Vérifier le cœur fonctionnel : recherche filtre correctement par nom/description, filtre régime filtre correctement, combinaison recherche + régime + catégorie fonctionne selon la logique AND définie (aucun résultat mêlant plusieurs valeurs d'un même critère ne doit apparaître par erreur).
- Vérifier tous les scénarios d'edge case listés en section 6, en particulier les états vides et la persistance des filtres après ajout au panier.
- Vérifier que les 4 events de tracking se déclenchent au bon moment avec les bonnes propriétés.
- Vérifier l'UX : pas de lag perceptible pendant la frappe, pas de flash de contenu incohérent pendant le filtrage.
- Confirmer que le bug existant du filtre catégorie (non appliqué) est corrigé avant/pendant cette livraison, car cette fonctionnalité en dépend.
- Tester le flow critique business : recherche/filtre → ajout au panier → checkout, pour s'assurer qu'aucune régression n'est introduite sur le tunnel d'achat.
