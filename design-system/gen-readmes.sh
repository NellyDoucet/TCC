#!/usr/bin/env bash
# Génère les consignes (README.md) de chaque composant.
set -e
cd "$(dirname "$0")/project/components"
r(){ cat > "$1/README.md"; }

r Cahier <<'EOF'
# Cahier

Le fond de toute page de cours : gris clair `papier` rayé de lignes verticales `papier-ligne` tous les `ligne-cahier`.

- Classe : `.cc-cahier` sur le conteneur de la page ou de la diapositive. Elle fixe aussi la police `main` et la couleur `encre`.
- Ne posez jamais de fond blanc plein page : le blanc (`papier-carte`) est réservé aux tableaux.
- Les images et les GIF se posent directement sur le cahier, sans cadre ni arrondi (`angle-droit`).
EOF

r TitreCours <<'EOF'
# TitreCours

La page de garde d'un module : le mot du cours au pinceau (`titre-cours`, famille `pinceau`) entre deux règles, puis le chapitre en capitales (`sous-titre`).

- Structure : `h1.cc-titre-cours` > `span.cc-titre-cours__mot` + `span.cc-titre-cours__sous`.
- Le logo ADRAR Formation se place en haut à gauche, à 64 px de large environ.
- Le cartouche documentaire (composant Cartouche) se place en pied de cette page, et seulement là.
- Un seul TitreCours par module. Les éclaboussures corail du PowerPoint sont une image décorative facultative, non reprise ici.
EOF

r TitreSection <<'EOF'
# TitreSection

Titre d'une partie numérotée, au pinceau, en `corail` avec l'ombre `ombre-titre`, sur le modèle « #2 Mettre en lumière le patrimoine ».

- Classe : `h2.cc-titre-section`. Numérotez avec « #1 », « #2 »… collés au titre : c'est la numérotation maison du cours.
- Variante `.cc-titre-section--noir` pour un titre de chapitre (« La Comptabilité… », « Histoire de la Comptabilité… »). Les points de suspension font partie du style.
- Appel en capitales à côté d'un titre noir : `span.cc-titre-section__appel` (« POURQUOI ? »).
- Le corail ne descend jamais sous 24 px ; pour du corail en petit, utilisez `corail-fonce`.
EOF

r Intercalaire <<'EOF'
# Intercalaire

La page de transition entre deux grandes parties : un titre géant en capitales et un GIF tiré d'un film ou d'une série.

- Structure : `section.cc-intercalaire` > `h2.cc-intercalaire__titre` + l'image.
- Par défaut en `corail` et en capitales (« HISTOIRE DE LA COMPTABILITÉ »). Variante `.cc-intercalaire--jaune` en écriture minuscule `jaune` (« Les Principes Comptables ») : réservez-la au thème sombre ou à un titre de 40 px et plus.
- Le GIF est fourni par la formatrice. Pas de cadre, pas d'arrondi, texte alternatif obligatoire.
EOF

r ListeEscalier <<'EOF'
# ListeEscalier

La liste des idées clés d'un chapitre : chaque ligne commence par un numéro « #1 » en `jaune` et se décale d'un `pas-5` vers la droite, comme un escalier.

- Structure : `ol.cc-escalier` > `li` > `span.cc-escalier__num` + le texte, 5 lignes au maximum.
- Le texte est en `corail` avec `ombre-titre`. Une ligne = une idée, verbe à l'infinitif (« Déterminer… », « Servir de… »).
- Chaque ligne annonce en général un TitreSection de même numéro plus loin dans le cours.
- Sous 600 px de large, l'escalier se remet à plat.
EOF

r MessageCle <<'EOF'
# MessageCle

La phrase à retenir, centrée en bas de page : une conclusion, une définition, un « C'est ce que l'on appelle… ».

- `.cc-message-cle--surligne` (recommandé) : le texte en `encre-sur-jaune` sur un surligneur `jaune`. Mettez le texte dans un `span`. Lisible dans les deux thèmes.
- `.cc-message-cle--texte` : le style d'origine des diapositives, texte `jaune` avec `ombre-titre`. Il n'est lisible qu'en thème sombre, ou au-dessus de 30 px en clair : ne l'employez pas pour une phrase longue.
- Un seul MessageCle par page, toujours en dernier.
EOF

r Question <<'EOF'
# Question

Une question posée à l'apprenant, une flèche corail vers le bas, puis la réponse.

- Structure : `div.cc-question` > `p.cc-question__q` + `svg.cc-question__fleche` (flèche pleine) + `p.cc-question__r`.
- La question est en `corail-clair` avec `ombre-titre`, 24 px et plus. La réponse est en `encre`.
- Formulez la question du point de vue de l'entreprise, en inversion (« L'entreprise a-t-elle… ? »).
EOF

r Attention <<'EOF'
# Attention

Une exception ou un piège : le panneau triangle rouge à gauche, une amorce en `corail-clair` (« Mais pas toujours !! »), puis l'explication en `encre`.

- Structure : `div.cc-attention` > `img.cc-attention__icone` (asset Pictos/attention-triangle.png) + `p.cc-attention__texte` > `span.cc-attention__amorce`.
- Placez-le juste après la règle qu'il nuance, jamais seul sur une page.
- L'amorce se termine par deux points d'exclamation, et l'explication donne un exemple concret (« du 1er avril au 31 mars »).
EOF

r SchemaFleches <<'EOF'
# SchemaFleches

Une idée qui se sépare en deux branches, reliées par deux flèches courbes `teal`, comme « Ce que l'entreprise possède / Ce que l'entreprise doit ».

- Structure : `div.cc-schema` > `p.cc-schema__haut` + `div.cc-schema__gauche` + `div.cc-schema__fleches` (deux fois l'asset Pictos/fleche-courbe-teal.png ; la seconde est retournée) + `div.cc-schema__droite`.
- Suivez-le d'un MessageCle qui nomme le concept (« C'est ce que l'on appelle le Bilan Comptable »).
EOF

r TexteImage <<'EOF'
# TexteImage

Un paragraphe de récit centré à côté d'une illustration : portrait historique, couverture d'ouvrage, capture de document.

- Structure : `div.cc-texte-image` > `p.cc-texte-image__texte` + `figure` > `img.cc-img` + `figcaption` (légende en `legende`).
- Le texte est centré, en `texte`. Les années et les noms propres restent dans le texte, sans gras.
- Deux images côte à côte (ex. PCG 1947 et 1957) : mettez deux `figure`.
EOF

r Cartouche <<'EOF'
# Cartouche

Le tableau de suivi documentaire en pied de la page de garde : code, version, localisation sur le serveur, responsable, validation, date de mise à jour.

- Structure : `table.cc-tableau.cc-cartouche`, six colonnes égales, une ligne d'en-tête et une ligne de valeurs.
- Mettez à jour la version et la date à chaque révision du support. Dates au format JJ/MM/AAAA.
EOF

r Bilan <<'EOF'
# Bilan

Ajout, absent du PowerPoint d'introduction mais nécessaire aux chapitres suivants : le bilan en deux colonnes, Actif (ce que l'entreprise possède) à gauche et Passif (ce que l'entreprise doit) à droite.

- Structure : `div.cc-bilan` > `h3.cc-bilan__titre` + `div.cc-tableau-wrap` > `table.cc-tableau` avec quatre colonnes : libellé, montant, libellé, montant.
- En-têtes sur fond `jaune`. Montants en `montant` (`.cc-montant`), alignés à droite, au format « 8 500,00 € ». Les totaux vont dans `tfoot` et doivent être égaux.
EOF

r EcritureJournal <<'EOF'
# EcritureJournal

Ajout, absent du PowerPoint d'introduction mais nécessaire aux chapitres suivants : une écriture au journal (date, n° de compte, libellé, débit, crédit).

- Structure : `div.cc-journal` > `h3.cc-journal__titre` + `div.cc-tableau-wrap` > `table.cc-tableau`.
- Les comptes débités d'abord, puis les comptes crédités avec un libellé décalé (`.cc-credit-libelle`). Les numéros de compte suivent le PCG 2025.
- La ligne `tr.cc-separateur` porte la pièce justificative (« Facture n° 125 — fournisseur Durand »).
EOF
ls */README.md | wc -l
