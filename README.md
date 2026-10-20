# Honryn 2.0

Une application web progressive (PWA) de jeu de couple, avec ambiance premium sombre et dorée. Aucun compte ni serveur requis : préférences, cartes personnalisées, favoris et historique restent dans le stockage local du navigateur.

## Fonctionnalités

- Action ou vérité, Connexion, Découverte, roue et cartes personnalisées.
- Trois ambiances : Douce, Complice et Pimentée.
- Filtres par type de carte, changement de tour, passage libre et favoris.
- Historique, export/import JSON et réinitialisation des données.
- Préférences du duo et option de confirmation pour les cartes pimentées.
- PWA installable et cache hors ligne des fichiers essentiels.
- Aucun framework et aucune dépendance JavaScript externe.

## Lancer en local

Ouvrir `index.html` fonctionne pour l'essentiel, mais le service worker/PWA nécessite un serveur HTTP. Depuis le dossier du projet :

```bash
python3 -m http.server 8000
```

Puis ouvrir `http://localhost:8000`.

## Déploiement GitHub Pages

1. Déposer tous les fichiers du dossier à la racine du dépôt (ou dans le dossier publié).
2. Dans **Settings → Pages**, choisir la branche et le dossier à publier.
3. Ouvrir l'URL HTTPS générée. Les chemins relatifs sont prévus pour fonctionner aussi dans un dépôt GitHub Pages de type `/nom-du-projet/`.

## Notes techniques

- Stockage : `localStorage`, clé `honryn_v2_data`.
- Les cartes intégrées sont dans `data.js`; le comportement est dans `app.js`.
- Le contenu pimenté reste suggestif et les cartes sont des propositions : on peut passer sans se justifier. Le consentement prime toujours.
- Les polices Google Fonts sont un embellissement facultatif ; en mode hors ligne, des polices de secours sont utilisées.
