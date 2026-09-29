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

  function gradeCells(sheet, answerKey) {
    var results = [];
    answerKey.cells.forEach(function (item) {
      var cell = sheet[item.ref];
      var value = cell && typeof cell.v === 'number' ? cell.v : (cell && !isNaN(parseFloat(cell.v)) ? parseFloat(cell.v) : null);
      var tol = relTolerance(item.answer);
      var ok = value !== null && Math.abs(value - item.answer) <= tol;
      results.push({ ref: item.ref, expected: item.answer, got: value, ok: ok, explanation: item.explanation });
    });
    return results;
  }

  function renderResults(container, results) {
    var correct = results.filter(function (r) { return r.ok; }).length;
    var total = results.length;
    var pct = total ? Math.round((correct / total) * 100) : 0;

    var html = '<div class="excel-result">';
    html += '<div class="excel-result__score' + (pct === 100 ? ' is-perfect' : '') + '">' +
      correct + ' / ' + total + ' cellules correctes (' + pct + ' %)</div>';

    var wrong = results.filter(function (r) { return !r.ok; });
    if (wrong.length === 0) {
      html += '<p class="excel-result__all-good"><span data-lucide="check-circle-2" class="icon"></span> Toutes les valeurs sont correctes, bravo !</p>';
    } else {
      html += '<p>Cellules a revoir :</p><ul class="excel-result__list">';
      wrong.forEach(function (r) {
        html += '<li><strong>' + r.ref + '</strong> : ' +
          (r.got === null ? 'case vide' : 'vous avez ' + r.got) +
          ' — attendu : ' + r.expected +
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
          var sheetName = workbook.SheetNames.indexOf(answerKey.sheet) !== -1 ? answerKey.sheet : workbook.SheetNames[0];
          var sheet = workbook.Sheets[sheetName];
          var results = gradeCells(sheet, answerKey);
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
