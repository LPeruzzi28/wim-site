# WIM! · Portfolio de Louis Peruzzi

Site statique (HTML, CSS, JavaScript natif en modules ES, sans étape de build), hébergé sur
Cloudflare Workers (assets statiques). En ligne : https://wim-site.lperuzzi28lperuzzi28lperuzzi28lperuzzi28.workers.dev

## Lancer en local

```bash
npm run dev          # http://localhost:8934
npm run check        # vérifie la syntaxe de tous les scripts
```

## Déployer

```bash
npm run deploy       # = wrangler deploy (nécessite d'être connecté : wrangler login)
```

Les fichiers listés dans `.assetsignore` (README, notes `.rtf`, config…) ne sont pas publiés.

## Structure

```
index.html                  Page unique (hero, work, inspo, détail d'un projet, footer, lecteur audio)
css/
  theme.css                 Design tokens (couleurs, typo, espacements, mouvement) : le seul endroit à toucher pour changer de palette
  base.css                  Réinitialisation, typographie de base, réglages Lenis
  layout.css                En-tête, hero, titres de section, pied de page
  work.css                  Section « work » (accordéon de bandes)
  modal.css                 Détail d'un projet
  inspirations.css          Section « inspo » (rangées défilantes)
  player.css                Lecteur audio
js/
  main.js                   Point d'entrée : construit les sections puis branche les comportements
  config.js                 Constantes partagées (point de rupture mobile)
  data/                     Contenu : projects.js, inspirations.js, clips.js
  lib/dom.js                Utilitaires (création d'éléments sans innerHTML, préférences utilisateur)
  components/               Un fichier par comportement (accordéon, détail, marquee, lecteur, animations…)
images/ video/ audio/       Médias du site
projet-ecole/ inspirations/ Visuels et PDF des projets / des créateurs
```

## Modifier le contenu

- **Ajouter un projet** : ajouter un objet dans `js/data/projects.js` (titre, catégorie, description, image, liens).
  L'accordéon s'adapte automatiquement au nombre de projets.
- **Ajouter une inspiration** : `js/data/inspirations.js`.
- **Ajouter un morceau** : déposer l'extrait dans `audio/` puis l'ajouter dans `js/data/clips.js`.
- **Changer la vidéo du hero** : remplacer `video/ski-loop.mp4` (idéalement 1280×720, sans son, moins de 5 Mo)
  et `video/ski-poster.jpg` (image affichée avant le chargement).

## Conventions

- Noms de classes CSS en kebab-case, préfixés par la section (`work-panel`, `project-modal`, `inspo-card`, `site-footer`…).
- Aucune donnée n'est insérée via `innerHTML` : le DOM est construit avec `el()` (`js/lib/dom.js`).
- Les préférences de l'utilisateur sont respectées : `prefers-reduced-motion` (animations, vidéo, défilement
  automatique) et `hover: none` (écrans tactiles : un premier toucher ouvre la bande, le second ouvre le projet).
- Le point de rupture mobile (800 px) est défini dans `js/config.js` **et** dans les `@media` du CSS : les garder alignés.

## Points d'attention

- **Effet du hero** : la vidéo n'est visible qu'à travers les lettres du titre grâce à deux `mix-blend-mode`
  (voir le commentaire en tête de la section Hero dans `css/layout.css`). Ne pas ajouter de `transform`/`opacity` sur
  `.hero-knockout` : cela casserait le mélange.
- **Fluidité de l'accordéon** : les images gardent une taille fixe et le « verre » est une copie floutée pré-calculée.
  Éviter d'animer `width`/`height` ou d'ajouter un `backdrop-filter` sur les bandes (voir `css/work.css`).
- Les bibliothèques tierces (GSAP, ScrollTrigger, Lenis) sont chargées depuis un CDN avec version figée et empreinte
  SRI. Si on change de version, recalculer l'empreinte (`curl -sL <url> | openssl dgst -sha384 -binary | openssl base64 -A`).
