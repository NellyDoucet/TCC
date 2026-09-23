Le style des cours de comptabilité ADRAR Formation (titre professionnel Secrétaire comptable) : **un cahier ligné** sur lequel on écrit à la main, avec des titres au pinceau, un corail signature et des messages clés surlignés en jaune. Chaque support doit ressembler à une page de cahier bien tenue, jamais à un rapport d'entreprise.

## Ton et rédaction

- Parlez à l'apprenant avec **vous**, sur un ton complice et enthousiaste : « Votre nouvel ami ! » (à propos du Plan comptable général).
- Posez des **questions** avant de donner la règle : « La Comptabilité… POURQUOI ? », « L'entreprise a-t-elle gagné ou perdu de l'argent pendant une année ? ». Voir le composant Question.
- Numérotez les idées clés avec **« #1 », « #2 »…**, jamais « 1. » ni « I. ». La même numérotation se retrouve dans la ListeEscalier puis dans les TitreSection.
- Les points d'exclamation sont bienvenus pour marquer une surprise ou une exception (« Mais pas toujours !! »), et les points de suspension pour ouvrir un titre (« Histoire de la Comptabilité… »).
- Donnez toujours un **exemple chiffré ou daté** après une règle : « du 1er avril au 31 mars », « codifiée par Luca Pacioli en 1494 », « refondu en 1999 ».
- Majuscules : titres en casse de phrase au pinceau ; capitales complètes réservées à la famille `capitales` (sous-titres, intercalaires).
- Pas d'emoji. L'humour passe par des **GIF de films et de séries** sur les pages de garde et les intercalaires.

## Couleurs

- Fond : toujours `papier` avec ses lignes `papier-ligne` (composant Cahier). `papier-carte` (blanc) uniquement sous les tableaux.
- Texte : `encre` pour tout le texte courant, `encre-douce` pour les légendes et le cartouche.
- **`corail`** est la couleur signature : titres de section, intercalaires, texte des listes #1–#5. Uniquement à 24 px et plus, avec `ombre-titre`. Pour du corail en petit texte, prenez `corail-fonce`.
- **`corail-clair`** pour les questions à l'apprenant et les amorces d'exception, à 24 px minimum.
- **`jaune`** pour ce qu'il faut retenir et pour les numéros « #1 ». Sur le cahier clair, le jaune en texte est illisible (1,3:1) : utilisez-le en **surligneur** (MessageCle `--surligne`, texte en `encre-sur-jaune`). En thème sombre, le jaune en texte fonctionne très bien.
- **`teal`** uniquement pour les flèches et les traits des schémas, jamais pour du texte.
- `prune` pour les puces des listes à puces classiques.
- Le thème sombre « Tableau » reprend les mêmes rôles sur un fond ardoise : même corail éclairci, même jaune.

## Typographie

Quatre familles, toutes gratuites sur Google Fonts :

- **`pinceau`** — Leckerli One : titre du cours (`titre-cours`) et titres de section (`titre-section`). Jamais pour une phrase de plus de 8 mots.
- **`main`** — Patrick Hand : tout le texte des leçons (`texte`, `texte-petit`) et les messages clés (`message-cle`).
- **`capitales`** — Patrick Hand SC : sous-titres (`sous-titre`) et intercalaires (`titre-intercalaire`), toujours en capitales.
- **`chiffres`** — Nunito Sans : tableaux comptables, montants (`montant`, chiffres tabulaires), légendes (`legende`). Une écriture manuscrite ne s'utilise jamais pour aligner des montants.

Tailles de texte : 22 px pour le texte courant (l'équivalent du 18,67 pt des diapositives), 30 px pour un message clé, 40 px pour un titre de section.

## Mise en page

- Composez centré : titres de section, messages clés et récits (TexteImage) sont centrés sur la page ; seule la ListeEscalier part de la gauche et descend en escalier.
- Espacements : `pas-5` (40 px) entre un titre et son contenu, `pas-6` (64 px) entre deux blocs, `pas-3` (16 px) de marge latérale minimum.
- Ordre type d'une page : TitreSection → texte ou Question → Attention éventuelle → MessageCle en dernier.
- Tout est à angle droit (`angle-droit`) : images, GIF, tableaux, cartouche. Pas de cartes arrondies ni d'ombres de boîte. Les seules ombres sont `ombre-titre` sur les titres colorés et `ombre-lettrage` sur le titre du cours.
- Tableaux : bordures `trait-fin` en `encre`, en-têtes en capitales espacées, montants alignés à droite au format « 1 200,00 € ».

## Images et pictogrammes

- **Logo** : ADRAR Formation (groupe Logos), en haut à gauche de la page de garde, jamais recoloré ni recadré.
- **Pictogrammes** : le panneau `attention-triangle.png` (composant Attention) et la flèche courbe `fleche-courbe-teal.png` (composant SchemaFleches, retournée pour la branche de droite). La flèche pleine vers le bas du composant Question est dessinée en `corail`.
- **Illustrations** : documents d'époque (portrait de Pacioli, couvertures du PCG 1947, 1957, 2025) posés tels quels à côté du texte, avec une légende.
- **GIF** : un par page de garde ou intercalaire, à droite ou en bas à droite. Ils sont fournis par la formatrice et ne font pas partie du design system.

## Composants

Pages : Cahier, TitreCours, TitreSection, Intercalaire, TexteImage, Cartouche.
Contenu pédagogique : ListeEscalier, Question, Attention, SchemaFleches, MessageCle.
Ajouts pour les chapitres suivants : Bilan, EcritureJournal (absents du support d'introduction, construits dans le même style).

Tous les composants sont de simples classes CSS préfixées `cc-` (feuille `components/bundle.css`), utilisables en HTML, dans un module SCORM ou une page web.
