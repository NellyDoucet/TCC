/*
 * Application principale du module SCORM "Administration des ventes".
 * Charge le sommaire (db/chapitres.json), construit la navigation,
 * injecte les pages (fragments HTML de pages/) et suit la progression
 * (pages visitees) via le SCORM API quand un LMS est present.
 */
(function (window, document) {
  'use strict';

  var state = {
    chapitres: [],
    currentId: null,
    progression: {}
  };

  var els = {};

  function qs(selector) {
    return document.querySelector(selector);
  }

  function cacheEls() {
    els.sidebarList = qs('#sidebar-nav-list');
    els.content = qs('#app-content');
    els.progressFill = qs('#header-progress-fill');
    els.progressLabel = qs('#header-progress-label');
    els.menuToggle = qs('#menu-toggle');
    els.sidebar = qs('#app-sidebar');
  }

  function fetchJSON(url) {
    return fetch(url, { cache: 'no-store' }).then(function (res) {
      if (!res.ok) {
        throw new Error('Impossible de charger ' + url);
      }
      return res.json();
    });
  }

  function fetchHTML(url) {
    return fetch(url, { cache: 'no-store' }).then(function (res) {
      if (!res.ok) {
        throw new Error('Impossible de charger ' + url);
      }
      return res.text();
    });
  }

  function persistProgress() {
    if (window.SCORM && window.SCORM.isAvailable()) {
      window.SCORM.setSuspendData(state.progression);
      window.SCORM.setLocation(state.currentId || '');
      updateScormCompletion();
    }
  }

  /* Le module est termine quand toutes les pages ont ete vues et que les quiz
     ont ete corriges. La note envoyee a la plateforme est la moyenne des quiz. */
  function updateScormCompletion() {
    var total = state.chapitres.length;
    var visited = 0;
    var quiz = state.chapitres.filter(function (c) {
      return c.aExercice;
    });
    var quizDone = 0;
    var scoreSum = 0;
    state.chapitres.forEach(function (c) {
      var prog = state.progression[c.id];
      if (prog && prog.visited) {
        visited++;
      }
      if (c.aExercice && prog && prog.checked) {
        quizDone++;
        scoreSum += prog.scorePercent || 0;
      }
    });
    if (window.SCORM && window.SCORM.isAvailable()) {
      if (quiz.length > 0 && quizDone > 0) {
        window.SCORM.setScore(Math.round(scoreSum / quiz.length), 100);
      }
      if (visited >= total && quizDone >= quiz.length && total > 0) {
        window.SCORM.setStatus('completed');
      } else if (visited > 0) {
        window.SCORM.setStatus('incomplete');
      }
    }
  }

  function computeGlobalProgress() {
    var total = state.chapitres.length;
    var visited = 0;
    state.chapitres.forEach(function (c) {
      if (state.progression[c.id] && state.progression[c.id].visited) {
        visited++;
      }
    });
    return total ? Math.round((visited / total) * 100) : 0;
  }

  function updateProgressUI() {
    var pct = computeGlobalProgress();
    if (els.progressFill) {
      els.progressFill.style.width = pct + '%';
    }
    if (els.progressLabel) {
      els.progressLabel.textContent = 'Progression : ' + pct + ' %';
    }
  }

  function markVisited(chapId) {
    if (!state.progression[chapId]) {
      state.progression[chapId] = {};
    }
    state.progression[chapId].visited = true;
    updateProgressUI();
    renderSidebar();
    persistProgress();
  }

  function iconMarkup(name, extraClass) {
    return '<span data-lucide="' + name + '" class="' + (extraClass || '') + '"></span>';
  }

  function renderSidebar() {
    if (!els.sidebarList) {
      return;
    }
    els.sidebarList.innerHTML = '';
    state.chapitres.forEach(function (chap) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + chap.id;
      a.className = 'sidebar-link' + (chap.id === state.currentId ? ' is-active' : '');
      var prog = state.progression[chap.id];
      var isDone = prog && prog.visited;
      if (chap.aExercice) {
        isDone = prog && prog.checked;
      }
      var statusIcon = 'check-circle-2';
      var statusExtra = isDone ? '' : ' is-empty';
      if (chap.codeRequis && !isChapterUnlocked(chap)) {
        statusIcon = 'lock';
        statusExtra = '';
      }
      a.innerHTML =
        iconMarkup(chap.icone, 'sidebar-link__icon') +
        '<span>' + (chap.numero ? chap.numero + '. ' : '') + chap.titre + '</span>' +
        iconMarkup(statusIcon, 'sidebar-link__status' + statusExtra);
      li.appendChild(a);
      els.sidebarList.appendChild(li);
    });
    if (window.Icons) {
      window.Icons.refresh();
    }
  }

  function findChapter(id) {
    var found = null;
    state.chapitres.forEach(function (c) {
      if (c.id === id) {
        found = c;
      }
    });
    return found;
  }

  function buildPageNav(chapId) {
    var index = state.chapitres.findIndex(function (c) {
      return c.id === chapId;
    });
    var prev = index > 0 ? state.chapitres[index - 1] : null;
    var next = index < state.chapitres.length - 1 ? state.chapitres[index + 1] : null;

    var nav = document.createElement('div');
    nav.className = 'page-nav';

    if (prev) {
      var prevBtn = document.createElement('a');
      prevBtn.href = '#' + prev.id;
      prevBtn.className = 'btn btn-ghost';
      prevBtn.innerHTML = iconMarkup('arrow-left', 'icon') + ' ' + prev.titre;
      nav.appendChild(prevBtn);
    } else {
      nav.appendChild(document.createElement('span'));
    }

    if (next) {
      var nextBtn = document.createElement('a');
      nextBtn.href = '#' + next.id;
      nextBtn.className = 'btn btn-primary';
      nextBtn.innerHTML = next.titre + ' ' + iconMarkup('arrow-right', 'icon');
      nav.appendChild(nextBtn);
    } else {
      var endGroup = document.createElement('div');
      endGroup.className = 'page-nav__end';

      if (state.sommaireHref) {
        var menuBtn = document.createElement('a');
        menuBtn.href = state.sommaireHref;
        menuBtn.className = 'btn btn-ghost';
        menuBtn.innerHTML = iconMarkup('layout-grid', 'icon') + ' Retour au sommaire';
        endGroup.appendChild(menuBtn);
      }

      if (state.moduleSuivant) {
        var moduleBtn = document.createElement('a');
        moduleBtn.href = state.moduleSuivant.href;
        moduleBtn.className = 'btn btn-primary';
        moduleBtn.innerHTML = state.moduleSuivant.titre + ' ' + iconMarkup('arrow-right', 'icon');
        endGroup.appendChild(moduleBtn);
      }

      nav.appendChild(endGroup);
    }

    return nav;
  }

  function initExerciseIfPresent(chap) {
    var container = qs('#exercise-container');
    if (!container || !chap.aExercice || !window.Exercises) {
      return Promise.resolve();
    }
    return fetchJSON(chap.exerciceSrc).then(function (data) {
      var savedProg = state.progression[chap.id];
      window.Exercises.create(container, data, {
        onComplete: function (result) {
          if (!state.progression[chap.id]) {
            state.progression[chap.id] = {};
          }
          state.progression[chap.id].visited = true;
          state.progression[chap.id].checked = true;
          state.progression[chap.id].scorePercent = result.scorePercent;
          state.progression[chap.id].correct = result.correct;
          state.progression[chap.id].total = result.total;
          renderSidebar();
          updateProgressUI();
          persistProgress();
        }
      });
      if (savedProg && savedProg.checked) {
        var badge = container.querySelector('.exercise-score');
        if (badge) {
          badge.classList.add('is-visible');
          badge.querySelector('.score-text').textContent = savedProg.correct + ' / ' + savedProg.total;
        }
      }
    }).catch(function (err) {
      container.innerHTML = '<p>Quiz indisponible pour le moment.</p>';
      if (window.console) {
        window.console.error(err);
      }
    });
  }

  function gateStorageKey(chapId) {
    return 'adrar-tcc-unlock-04-compte-de-resultat-' + chapId;
  }

  function isChapterUnlocked(chap) {
    if (!chap.codeRequis) {
      return true;
    }
    try {
      return window.localStorage.getItem(gateStorageKey(chap.id)) === '1';
    } catch (e) {
      return false;
    }
  }

  function renderInlineGate(chap) {
    var wrapper = document.createElement('div');
    wrapper.className = 'app-main-inner';
    wrapper.innerHTML =
      '<div class="page">' +
        '<div class="access-gate access-gate--inline">' +
          '<div class="access-gate__card">' +
            iconMarkup('lock', 'access-gate__icon') +
            '<h1 class="access-gate__title">Accès protégé</h1>' +
            '<p class="access-gate__text">Saisissez le code communiqué par votre formateur pour ouvrir « ' + chap.titre + ' ».</p>' +
            '<form class="access-gate__form" id="access-gate-form-inline" autocomplete="off">' +
              '<input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="6" class="access-gate__input" id="access-gate-input-inline" placeholder="Code" aria-label="Code d\'accès">' +
              '<button type="submit" class="btn btn-primary">Valider</button>' +
            '</form>' +
            '<p class="access-gate__error" id="access-gate-error-inline">Code incorrect, réessayez.</p>' +
          '</div>' +
        '</div>' +
      '</div>';

    els.content.innerHTML = '';
    els.content.appendChild(wrapper);
    els.content.scrollTop = 0;

    if (window.Icons) {
      window.Icons.refresh();
    }

    var form = wrapper.querySelector('#access-gate-form-inline');
    var input = wrapper.querySelector('#access-gate-input-inline');
    var error = wrapper.querySelector('#access-gate-error-inline');

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (input.value.trim() === chap.codeRequis) {
        try {
          window.localStorage.setItem(gateStorageKey(chap.id), '1');
        } catch (e) {}
        loadChapter(chap.id);
      } else {
        error.classList.add('is-visible');
        input.classList.add('is-invalid');
        input.select();
      }
    });
  }

  function loadChapter(chapId) {
    var chap = findChapter(chapId) || state.chapitres[0];
    state.currentId = chap.id;

    if (!isChapterUnlocked(chap)) {
      renderSidebar();
      renderInlineGate(chap);
      return Promise.resolve();
    }

    renderSidebar();

    return fetchHTML(chap.fichier).then(function (html) {
      els.content.innerHTML = '<div class="app-main-inner"><div class="page">' + html + '</div></div>';
      var page = els.content.querySelector('.page');
      if (page) {
        page.appendChild(buildPageNav(chap.id));
      }
      markVisited(chap.id);
      renderSidebar();
      if (window.Icons) {
        window.Icons.refresh();
      }
      els.content.scrollTop = 0;
      return initExerciseIfPresent(chap);
    }).catch(function (err) {
      els.content.innerHTML = '<div class="app-main-inner"><div class="page"><p>Contenu introuvable.</p></div></div>';
      if (window.console) {
        window.console.error(err);
      }
    });
  }

  function onHashChange() {
    var id = window.location.hash.replace('#', '') || state.chapitres[0].id;
    if (els.sidebar) {
      els.sidebar.classList.remove('is-open');
    }
    loadChapter(id);
  }

  function bindGlobalEvents() {
    window.addEventListener('hashchange', onHashChange);
    if (els.menuToggle) {
      els.menuToggle.addEventListener('click', function () {
        els.sidebar.classList.toggle('is-open');
      });
    }
  }

  function restoreProgress() {
    if (window.SCORM && window.SCORM.isAvailable()) {
      var saved = window.SCORM.getSuspendData();
      if (saved) {
        state.progression = saved;
      }
    }
  }

  function init() {
    cacheEls();
    if (window.SCORM) {
      window.SCORM.initialize();
    }
    restoreProgress();
    fetchJSON('db/chapitres.json').then(function (data) {
      state.chapitres = data.chapitres;
      state.sommaireHref = data.sommaireHref || null;
      state.moduleSuivant = data.moduleSuivant || null;
      renderSidebar();
      bindGlobalEvents();
      updateProgressUI();
      var startId = window.location.hash.replace('#', '');
      if (!startId && window.SCORM) {
        startId = window.SCORM.getLocation();
      }
      if (!startId) {
        startId = state.chapitres[0].id;
      }
      if (window.location.hash.replace('#', '') === startId) {
        loadChapter(startId);
      } else {
        window.location.hash = startId;
      }
    }).catch(function (err) {
      if (window.console) {
        window.console.error(err);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})(window, document);
