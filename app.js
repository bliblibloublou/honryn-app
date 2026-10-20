// ============================================================
//  HONRYN — Logique applicative
// ============================================================

(function () {
  'use strict';

  // ---------- ÉTAT GLOBAL ----------
  const state = {
    currentLevelAV: 'soft',
    currentLevelWheel: 'soft',
    lastAV: { type: null, text: null },
    wheel: null,
    isSpinning: false,
  };

  // ---------- RACCOURCIS DOM ----------
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const screens = {
    home: $('#screen-home'),
    av: $('#screen-av'),
    wheel: $('#screen-wheel'),
  };

  const card = $('#av-card');
  const cardTypeLabel = $('#card-type-label');
  const cardText = $('#card-text');
  const wheelContainer = $('#wheel-container');
  const wheelResult = $('#wheel-result');
  const modal = $('#modal');
  const modalBody = $('#modal-body');

  // ---------- NAVIGATION ----------
  function showScreen(name) {
    Object.values(screens).forEach((s) => s.classList.remove('active'));
    if (screens[name]) screens[name].classList.add('active');

    if (name === 'wheel' && !state.wheel) {
      initWheel(state.currentLevelWheel);
    }
  }

  $('#btn-home').addEventListener('click', () => showScreen('home'));

  $$('.mode-card').forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      if (mode === 'action-verite') showScreen('av');
      if (mode === 'roue') {
        showScreen('wheel');
        if (state.wheel) {
          state.wheel.items = buildWheelItems(state.currentLevelWheel);
        }
      }
    });
  });

  // ---------- SÉLECTEURS DE NIVEAU ----------
  function bindLevelSelector(containerId, stateKey, callback) {
    const container = $(containerId);
    if (!container) return;
    container.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      container.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      state[stateKey] = chip.dataset.level;
      callback(state[stateKey]);
    });
  }

  // ========== MODE ACTION OU VÉRITÉ ==========

  bindLevelSelector('#av-levels', 'currentLevelAV', () => {
    // Réinitialise la carte quand on change de niveau
    card.classList.remove('flipped');
    cardTypeLabel.textContent = 'Action';
    cardText.textContent = '…';
  });

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function drawAV(type) {
    const level = state.currentLevelAV;
    const bucket = DATA.av[level];
    if (!bucket) return;

    const pool = type === 'action' ? bucket.actions : bucket.truths;
    if (!pool || pool.length === 0) return;

    // Évite de retomber immédiatement sur la même carte
    let text;
    let attempts = 0;
    do {
      text = pickRandom(pool);
      attempts++;
    } while (
      text === state.lastAV.text &&
      pool.length > 1 &&
      attempts < 10
    );

    state.lastAV = { type, text };

    // Animation : on remet la carte face avant, on change le texte, puis on retourne
    card.classList.remove('flipped');
    cardTypeLabel.textContent = type === 'action' ? 'Action' : 'Vérité';

    setTimeout(() => {
      cardText.textContent = text;
      card.classList.add('flipped');
    }, 60);
  }

  $('#btn-action').addEventListener('click', () => drawAV('action'));
  $('#btn-verite').addEventListener('click', () => drawAV('verite'));

  $('#btn-pass').addEventListener('click', () => {
    openModal(`
      <h3>Pénalité douce</h3>
      <p style="color: var(--text-soft); margin: 14px 0; line-height: 1.6;">
        Tu passes ton tour… mais la prochaine carte sera pour toi, et tu devras la réaliser sans hésiter.
      </p>
      <button class="btn btn-primary" onclick="document.getElementById('modal').classList.add('hidden')">OK, je m’y tiens</button>
    `);
  });

  // ========== MODE ROUE ==========

  function buildWheelItems(level) {
    const list = DATA.wheel[level] || DATA.wheel.soft;
    const colors = [
      '#E11D48', '#A21CAF', '#F59E0B', '#10B981',
      '#3B82F6', '#8B5CF6', '#EC4899', '#F97316',
      '#14B8A6', '#6366F1',
    ];
    return list.map((label, i) => ({
      label,
      color: colors[i % colors.length],
      weight: 1,
    }));
  }

  function initWheel(level) {
    if (state.wheel) {
      state.wheel.items = buildWheelItems(level);
      return;
    }

    const props = {
      items: buildWheelItems(level),
      radius: 0.92,
      itemLabelRadius: 0.82,
      itemLabelFontSizeMax: 22,
      itemLabelFont: '600 16px -apple-system, sans-serif',
      itemLabelColor: '#FFFFFF',
      rotationResistance: -0.3,
      isInteractive: false,
      pointerAngle: 0,
    };

    state.wheel = new Wheel(wheelContainer, props);
  }

  bindLevelSelector('#wheel-levels', 'currentLevelWheel', (level) => {
    if (state.wheel) {
      state.wheel.items = buildWheelItems(level);
    } else {
      initWheel(level);
    }
    wheelResult.textContent = '';
  });

  $('#btn-spin').addEventListener('click', () => {
    if (!state.wheel || state.isSpinning) return;

    state.isSpinning = true;
    wheelResult.textContent = '';
    $('#btn-spin').disabled = true;

    const itemCount = state.wheel.items.length;
    const winningIndex = Math.floor(Math.random() * itemCount);

    state.wheel.spinToItem(winningIndex, 4200, true, 2, 1, 'cubicOut');

    // Attendre la fin de l’animation
    setTimeout(() => {
      const winner = state.wheel.items[winningIndex];
      wheelResult.textContent = winner.label;
      state.isSpinning = false;
      $('#btn-spin').disabled = false;
    }, 4300);
  });

  // ========== MODAL ==========
  function openModal(html) {
    modalBody.innerHTML = html;
    modal.classList.remove('hidden');
  }

  $('#modal-close').addEventListener('click', () => modal.classList.add('hidden'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });

  // ========== PARAMÈTRES ==========
  $('#btn-settings').addEventListener('click', () => {
    openModal(`
      <h3>Paramètres</h3>
      <p style="color: var(--text-soft); margin: 16px 0; line-height: 1.6; font-size: 0.9rem;">
        Cette application est un jeu pour adultes consentants.<br>
        Le contenu est fictif et doit être adapté à vos limites.
      </p>
      <button class="btn btn-secondary" onclick="localStorage.removeItem('honryn_history'); document.getElementById('modal').classList.add('hidden');">
        Réinitialiser l’historique
      </button>
      <p style="color: var(--text-soft); font-size: 0.75rem; margin-top: 16px;">
        Version 1.0 · Fait avec ❤️
      </p>
    `);
  });

  // ========== SERVICE WORKER ==========
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch((err) => {
        console.warn('Service Worker non enregistré :', err);
      });
    });
  }

  // ========== INITIALISATION ==========
  showScreen('home');
})(); 
