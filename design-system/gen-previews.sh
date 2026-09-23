#!/usr/bin/env bash
# Génère les aperçus des composants du design system « Cahier de Compta ».
set -e
cd "$(dirname "$0")/project/components"
LOGO=/_blob/e2cd190ae0fb607f8b36ce1a3a6db1b0
FL=/_blob/e88da768db5326d0d56a0c7467e383fc
ATT=/_blob/ccb6e57773f329fcf91168c1710665d0
PAC=/_blob/e093d2194b135c4a1513914bcf827002
HEAD='<!doctype html>
<html lang="fr">
<head><meta charset="utf-8"><style>body{margin:0;background:var(--papier);color:var(--encre)}</style></head>
<body>'
FOOT='</body>
</html>'
w(){ mkdir -p "$1"; { echo "$2"; echo "$HEAD"; cat; echo "$FOOT"; } > "$1/preview.html"; }

w Cahier '<!-- @dsCard group="Fondations" height=220 subtitle="Fond gris clair ligné" -->' <<EOF
<div class="cc-cahier" style="min-height:180px">
  <p style="margin:0">Une année en comptabilité est appelée « un exercice comptable », qui s’échelonne normalement du 1<sup>er</sup> janvier au 31 décembre.</p>
</div>
EOF

w TitreCours '<!-- @dsCard group="Titres" height=380 subtitle="Page de garde" -->' <<EOF
<div class="cc-cahier" style="position:relative">
  <img src="$LOGO" alt="ADRAR Formation" style="position:absolute;top:12px;left:12px;width:64px">
  <h1 class="cc-titre-cours"><span class="cc-titre-cours__mot">Comptabilité</span><span class="cc-titre-cours__sous">INTRODUCTION</span></h1>
</div>
EOF

w TitreSection '<!-- @dsCard group="Titres" height=220 -->' <<EOF
<div class="cc-cahier">
  <h2 class="cc-titre-section cc-titre-section--noir">La Comptabilité… <span class="cc-titre-section__appel">POURQUOI ?</span></h2>
  <h2 class="cc-titre-section">#2 Mettre en lumière le patrimoine</h2>
</div>
EOF

w Intercalaire '<!-- @dsCard group="Titres" height=300 subtitle="Transition entre deux parties" -->' <<EOF
<div class="cc-cahier">
  <section class="cc-intercalaire">
    <h2 class="cc-intercalaire__titre">HISTOIRE DE LA COMPTABILITÉ</h2>
    <div style="aspect-ratio:16/9;max-width:100%;background:var(--encre-douce);display:grid;place-items:center;color:var(--papier);font-family:var(--font-chiffres);font-size:13px">GIF de transition</div>
  </section>
</div>
EOF

w ListeEscalier '<!-- @dsCard group="Contenu" height=380 subtitle="Les #1 … #5 en escalier" -->' <<EOF
<div class="cc-cahier">
  <ol class="cc-escalier">
    <li><span class="cc-escalier__num">#1</span>Déterminer la performance économique</li>
    <li><span class="cc-escalier__num">#2</span>Mettre en lumière le patrimoine</li>
    <li><span class="cc-escalier__num">#3</span>Établir les déclarations fiscales</li>
    <li><span class="cc-escalier__num">#4</span>Suivre l’activité et prendre des décisions</li>
    <li><span class="cc-escalier__num">#5</span>Servir de preuves juridiques</li>
  </ol>
</div>
EOF

w MessageCle '<!-- @dsCard group="Contenu" height=260 subtitle="La phrase à retenir" -->' <<EOF
<div class="cc-cahier">
  <p class="cc-message-cle cc-message-cle--surligne" style="margin-top:0"><span>Tous ces acteurs ont un intérêt à regarder la comptabilité de l’entreprise !</span></p>
  <p class="cc-message-cle cc-message-cle--texte">C’est ce que l’on appelle le Bilan Comptable</p>
</div>
EOF

w Question '<!-- @dsCard group="Contenu" height=300 subtitle="Question → réponse" -->' <<EOF
<div class="cc-cahier">
  <div class="cc-question">
    <p class="cc-question__q">L’entreprise a-t-elle gagné ou perdu de l’argent pendant une année ?</p>
    <svg class="cc-question__fleche" viewBox="0 0 56 56" aria-hidden="true"><path d="M16 4h24v24h12L28 52 4 28h12z"/></svg>
    <p class="cc-question__r">Une année en comptabilité est appelée « un exercice comptable », qui s’échelonne normalement du 1<sup>er</sup> janvier au 31 décembre.</p>
  </div>
</div>
EOF

w Attention '<!-- @dsCard group="Contenu" height=220 subtitle="Exception, piège" -->' <<EOF
<div class="cc-cahier">
  <div class="cc-attention">
    <img class="cc-attention__icone" src="$ATT" alt="Attention">
    <p class="cc-attention__texte"><span class="cc-attention__amorce">Mais pas toujours !!</span> Un exercice comptable peut être en cours d’année civile ! Par exemple : du 1<sup>er</sup> avril au 31 mars !</p>
  </div>
</div>
EOF

w SchemaFleches '<!-- @dsCard group="Contenu" height=340 subtitle="Une idée, deux branches" -->' <<EOF
<div class="cc-cahier">
  <div class="cc-schema">
    <p class="cc-schema__haut">Raconter l’histoire patrimoniale de l’entreprise</p>
    <div class="cc-schema__gauche">Ce que l’entreprise possède</div>
    <div class="cc-schema__fleches"><img src="$FL" alt=""><img src="$FL" alt=""></div>
    <div class="cc-schema__droite">Ce que l’entreprise doit</div>
  </div>
  <p class="cc-message-cle cc-message-cle--surligne"><span>C’est ce que l’on appelle le Bilan Comptable</span></p>
</div>
EOF

w TexteImage '<!-- @dsCard group="Mise en page" height=400 subtitle="Récit + illustration" -->' <<EOF
<div class="cc-cahier">
  <div class="cc-texte-image">
    <p class="cc-texte-image__texte">La comptabilité en partie double fut codifiée par Luca Pacioli en 1494 dans le traité « Tractatus XI particularis de computibus et scripturis », publié à Venise.</p>
    <figure><img class="cc-img" src="$PAC" alt="Portrait de Luca Pacioli" style="width:100%"><figcaption>Portrait de Luca Pacioli (1495)</figcaption></figure>
  </div>
</div>
EOF

w Cartouche '<!-- @dsCard group="Documents" height=170 subtitle="Suivi documentaire en pied de page de garde" -->' <<EOF
<div class="cc-cahier" style="padding-block:24px">
  <div class="cc-tableau-wrap">
    <table class="cc-tableau cc-cartouche">
      <thead><tr><th>Code du document</th><th>Version</th><th>Localisation sur le serveur</th><th>Resp. du document</th><th>Validé par</th><th>Date de M.À.J.</th></tr></thead>
      <tbody><tr><td>Voir nomenclature</td><td>6</td><td></td><td>Nelly DOUCET</td><td>Marion LAURIOL</td><td>02/04/2025</td></tr></tbody>
    </table>
  </div>
</div>
EOF

w Bilan '<!-- @dsCard group="Tableaux comptables" height=340 subtitle="Ajout — actif / passif" -->' <<EOF
<div class="cc-cahier">
  <div class="cc-bilan">
    <h3 class="cc-bilan__titre">BILAN AU 31/12/2025</h3>
    <div class="cc-tableau-wrap">
      <table class="cc-tableau">
        <thead><tr><th colspan="2">Actif · ce que l’entreprise possède</th><th colspan="2">Passif · ce que l’entreprise doit</th></tr></thead>
        <tbody>
          <tr><td class="cc-libelle">Matériel de bureau</td><td class="cc-montant">8 500,00 €</td><td class="cc-libelle">Capital</td><td class="cc-montant">15 000,00 €</td></tr>
          <tr><td class="cc-libelle">Stock de marchandises</td><td class="cc-montant">4 200,00 €</td><td class="cc-libelle">Emprunt bancaire</td><td class="cc-montant">6 000,00 €</td></tr>
          <tr><td class="cc-libelle">Banque</td><td class="cc-montant">9 750,00 €</td><td class="cc-libelle">Dettes fournisseurs</td><td class="cc-montant">1 450,00 €</td></tr>
        </tbody>
        <tfoot><tr><td class="cc-libelle">Total actif</td><td class="cc-montant">22 450,00 €</td><td class="cc-libelle">Total passif</td><td class="cc-montant">22 450,00 €</td></tr></tfoot>
      </table>
    </div>
  </div>
</div>
EOF

w EcritureJournal '<!-- @dsCard group="Tableaux comptables" height=300 subtitle="Ajout — écriture au journal" -->' <<EOF
<div class="cc-cahier">
  <div class="cc-journal">
    <h3 class="cc-journal__titre">JOURNAL</h3>
    <div class="cc-tableau-wrap">
      <table class="cc-tableau">
        <thead><tr><th>Date</th><th>N° compte</th><th>Libellé</th><th>Débit</th><th>Crédit</th></tr></thead>
        <tbody>
          <tr><td rowspan="3">05/01/2025</td><td class="cc-compte">607</td><td class="cc-libelle">Achats de marchandises</td><td class="cc-montant">1 000,00 €</td><td class="cc-montant"></td></tr>
          <tr><td class="cc-compte">44566</td><td class="cc-libelle">TVA déductible sur ABS</td><td class="cc-montant">200,00 €</td><td class="cc-montant"></td></tr>
          <tr><td class="cc-compte">401</td><td class="cc-libelle cc-credit-libelle">Fournisseurs</td><td class="cc-montant"></td><td class="cc-montant">1 200,00 €</td></tr>
          <tr class="cc-separateur"><td colspan="5">Facture n° 125 — fournisseur Durand</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
EOF
ls
