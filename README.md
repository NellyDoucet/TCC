# TCC — Travaux Courants de Compta

Les cours de comptabilité en ligne d'ADRAR Formation (titre professionnel Secrétaire comptable), un module SCORM 1.2 par chapitre du programme COMPTA 2025.

## Contenu

- `design-system/` : le design system « Cahier de Compta » (couleurs, polices, composants `cc-*`), tiré du PowerPoint d'introduction.
- `01-introduction/` : chapitre 01, Introduction à la comptabilité.
- `02-principes-comptables/` : chapitre 02, Principes comptables et règles de confidentialité.
- `03-dematerialisation/` : chapitre 03, La dématérialisation, avec son quiz (repris d'Adxel). À partir de ce chapitre, le module envoie la note du quiz à la plateforme.
- `04-compte-de-resultat/` : chapitre 04, Le Compte de Résultat, avec les 4 applications (classement, totaux, résultat). Le moteur d'exercices y gagne un type « classement » (un menu déroulant par élément).
- `index.html` : la page d'accueil qui liste les chapitres.
- `serve.ps1` : un petit serveur pour prévisualiser un chapitre en local.

## Créer le zip SCORM d'un chapitre

```powershell
.\build-scorm.ps1 -Dossier 02-principes-comptables -Titre "Comptabilité 02 - Principes comptables"
```

Le script écrit le `imsmanifest.xml` du chapitre et crée `<dossier>-scorm12.zip` (chemins en « / », pas de Compress-Archive, qui met des « \ » refusés par certaines plateformes). Le zip se dépose ensuite sur Adxel. Les zips ne sont pas suivis par git.
