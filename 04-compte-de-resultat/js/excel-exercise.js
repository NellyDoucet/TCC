/*
 * Moteur de correction automatique des exercices Excel (Applications 1 a 4).
 * L'apprenant telecharge un fichier .xlsx, le complete dans Excel,
 * puis le depose ici : la lecture et la comparaison se font entierement
 * dans le navigateur (bibliotheque SheetJS), sans envoi a un serveur.
 */
(function (window, document) {
  'use strict';

  function relTolerance(answer) {
    return Math.max(0.01, Math.abs(answer) * 0.015);
  }

  function loadWorkbookFromFile(file) {
    return file.arrayBuffer().then(function (buffer) {
      return window.XLSX.read(buffer, { type: 'array' });
    });
  }

  /* Chaque cellule de la cle de correction peut preciser son propre "sheet"
     (utile quand un exercice couvre plusieurs feuilles, ex. Compte de
     Resultat + Bilan) ; sinon elle utilise la feuille par defaut. */
  function normalize(text) {
    return String(text === undefined || text === null ? '' : text)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '');
  }

  function numericValue(cell) {
    if (!cell) { return null; }
    if (typeof cell.v === 'number') { return cell.v; }
    var n = parseFloat(String(cell.v).replace(/\s/g, '').replace(',', '.'));
    return isNaN(n) ? null : n;
  }

  /* Un "bloc" (zone) est une suite de lignes libres : l'eleve ecrit lui-meme
     le libelle et le montant, dans l'ordre qu'il veut. Chaque ligne attendue
     est retrouvee n'importe ou dans le bloc (montant exact + libelle contenant
     l'un des mots-cles). */
  function gradeZone(workbook, defaultSheetName, zone) {
    var sheetName = zone.sheet && workbook.SheetNames.indexOf(zone.sheet) !== -1 ? zone.sheet : defaultSheetName;
    var sheet = workbook.Sheets[sheetName];
    var cols = zone.amountCols || [zone.amountCol];
    var rows = [];
    for (var r = zone.rowFrom; r <= zone.rowTo; r++) {
      var amounts = cols.map(function (c) { return numericValue(sheet[c + r]); });
      var labelCell = sheet[zone.labelCol + r];
      var label = labelCell ? normalize(labelCell.v) : '';
      if (label !== '' || amounts.some(function (a) { return a !== null; })) {
        rows.push({ amounts: amounts, label: label, used: false });
      }
    }
    return zone.entries.map(function (entry) {
      var expected = entry.amounts || [entry.amount];
      var shown = expected.filter(function (a) { return a !== null; }).join(' / ');
      var name = zone.name + ' : ' + entry.label;
      var amountMatch = null;
      var full = null;
      rows.forEach(function (row) {
        if (row.used) { return; }
        var same = expected.every(function (exp, i) {
          if (exp === null) { return true; }
          var got = row.amounts[i];
          if (got === null) { return false; }
          if (entry.signFree) { return Math.abs(Math.abs(got) - Math.abs(exp)) <= relTolerance(exp); }
          return Math.abs(got - exp) <= relTolerance(exp);
        });
        if (!same) { return; }
        if (!amountMatch) { amountMatch = row; }
        var labelOk = entry.keywords.some(function (k) { return row.label.indexOf(k) !== -1; });
        if (!full && labelOk) { full = row; }
      });
      if (full) {
        full.used = true;
        return { name: name, expected: shown, got: shown, ok: true, explanation: entry.explanation };
      }
      if (amountMatch) {
        amountMatch.used = true;
        return { name: name, expected: shown, got: shown, ok: false, reason: 'libelle', explanation: entry.explanation };
      }
      return { name: name, expected: shown, got: null, ok: false, reason: 'montant', explanation: entry.explanation };
    });
  }

  function gradeCells(workbook, answerKey) {
    var results = [];
    var defaultSheetName = workbook.SheetNames.indexOf(answerKey.sheet) !== -1 ? answerKey.sheet : workbook.SheetNames[0];
    (answerKey.zones || []).forEach(function (zone) {
      results = results.concat(gradeZone(workbook, defaultSheetName, zone));
    });
    (answerKey.cells || []).forEach(function (item) {
      var sheetName = item.sheet && workbook.SheetNames.indexOf(item.sheet) !== -1 ? item.sheet : defaultSheetName;
      var sheet = workbook.Sheets[sheetName];
      var value = numericValue(sheet[item.ref]);
      var ok;
      if (item.answer === 0) {
        ok = value === null || Math.abs(value) < 0.005;
      } else {
        ok = value !== null && Math.abs(value - item.answer) <= relTolerance(item.answer);
      }
      results.push({ ref: item.ref, expected: item.answer, got: value, ok: ok, explanation: item.explanation, mustBeEmpty: item.answer === 0 });
    });
    return results;
  }

  function renderResults(container, results) {
    var correct = results.filter(function (r) { return r.ok; }).length;
    var total = results.length;
    var pct = total ? Math.round((correct / total) * 100) : 0;

    var html = '<div class="excel-result">';
    html += '<div class="excel-result__score' + (pct === 100 ? ' is-perfect' : '') + '">' +
      correct + ' / ' + total + ' elements corrects (' + pct + ' %)</div>';

    var wrong = results.filter(function (r) { return !r.ok; });
    if (wrong.length === 0) {
      html += '<p class="excel-result__all-good"><span data-lucide="check-circle-2" class="icon"></span> Toutes les valeurs sont correctes, bravo !</p>';
    } else {
      html += '<p>Elements a revoir :</p><ul class="excel-result__list">';
      wrong.forEach(function (r) {
        var detail;
        if (r.name) {
          detail = '<strong>' + r.name + '</strong> : ' +
            (r.reason === 'libelle'
              ? 'le montant ' + r.expected + ' est bien present mais le libelle ne correspond pas'
              : 'montant ' + r.expected + ' introuvable dans ce bloc (a placer dans la bonne categorie)');
        } else if (r.mustBeEmpty) {
          detail = '<strong>' + r.ref + '</strong> : cette case doit rester vide (vous avez ' + r.got + ')';
        } else {
          detail = '<strong>' + r.ref + '</strong> : ' +
            (r.got === null ? 'case vide' : 'vous avez ' + r.got) + ' — attendu : ' + r.expected;
        }
        html += '<li>' + detail +
          (r.explanation ? '<div class="excel-result__explanation">' + r.explanation + '</div>' : '') +
          '</li>';
      });
      html += '</ul>';
    }
    html += '</div>';
    container.innerHTML = html;
    if (window.Icons) {
      window.Icons.refresh();
    }
    return { correct: correct, total: total };
  }

  function initBlock(block) {
    var exerciseUrl = block.getAttribute('data-exercise');
    var templateUrl = block.getAttribute('data-template');
    var resultEl = block.querySelector('.excel-exercise__result');
    var fileInput = block.querySelector('.excel-exercise__input');
    var correctBtn = block.querySelector('.excel-exercise__correct-btn');
    var status = block.querySelector('.excel-exercise__status');
    var chapId = window.location.hash.replace('#', '');

    fetch(exerciseUrl, { cache: 'no-store' }).then(function (res) {
      return res.json();
    }).then(function (answerKey) {
      correctBtn.disabled = false;
      correctBtn.addEventListener('click', function () {
        var file = fileInput.files && fileInput.files[0];
        if (!file) {
          status.textContent = 'Choisissez d\'abord votre fichier complete.';
          status.hidden = false;
          return;
        }
        status.hidden = true;
        loadWorkbookFromFile(file).then(function (workbook) {
          var results = gradeCells(workbook, answerKey);
          var score = renderResults(resultEl, results);
          if (window.AppProgress) {
            window.AppProgress.markChecked(chapId, score.correct, score.total);
          }
        }).catch(function () {
          status.textContent = 'Le fichier n\'a pas pu etre lu. Verifiez que c\'est bien le fichier .xlsx complete, non renomme.';
          status.hidden = false;
        });
      });
    }).catch(function () {
      status.textContent = 'Le corrige de cet exercice n\'a pas pu etre charge.';
      status.hidden = false;
    });

    var downloadLink = block.querySelector('.excel-exercise__download');
    if (downloadLink && templateUrl) {
      downloadLink.href = templateUrl;
    }
  }

  function init() {
    var blocks = document.querySelectorAll('.excel-exercise');
    blocks.forEach ? blocks.forEach(initBlock) : Array.prototype.forEach.call(blocks, initBlock);
  }

  window.ExcelExercise = { init: init };
})(window, document);
