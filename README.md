# TCC — Travaux Courants de Compta

Les cours de comptabilité en ligne d'ADRAR Formation (titre professionnel Secrétaire comptable), un module SCORM 1.2 par chapitre du programme COMPTA 2025.

## Contenu

- `design-system/` : le design system « Cahier de Compta » (couleurs, polices, composants `cc-*`), tiré du PowerPoint d'introduction.
- `01-introduction/` : chapitre 01, Introduction à la comptabilité.
- `index.html` : la page d'accueil qui liste les chapitres.
- `serve.ps1` : un petit serveur pour prévisualiser un chapitre en local.

## Créer le zip SCORM d'un chapitre

Chaque dossier de chapitre contient son `imsmanifest.xml`. Le zip se fabrique avec des chemins en « / » (pas avec Compress-Archive, qui met des « \ » refusés par certaines plateformes), puis se dépose sur la plateforme de formation. Les zips ne sont pas suivis par git.
