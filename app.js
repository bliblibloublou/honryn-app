(() => {
  'use strict';
  const DATA = window.HONRYN_DATA;
  const STORAGE_KEY = 'honryn_v2_data';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const defaults = () => ({
    version: 2,
    players: ['Joueur·se 1','Joueur·se 2'],
    adaptive: true,
    includeHardcore: true,
    customCards: [],
    history: [],
    favorites: [],
    seen: [],
    levelUse: { soft: 0, warm: 0, spicy: 0 },
    turn: 0
  });

  let state = loadState();
  let currentScreen = 'home';
  let currentMode = 'av';
  let currentLevel = 'soft';
  let currentFilter = 'all';
  let currentCard = null;
  let historyTab = 'history';
  let cardCounter = 0;
  let toastTimer = null;
  let spinBusy = false;
  let wheelRotation = 0;

  function loadState(){
    try{
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if(saved && saved.version === 2){
        const merged = { ...defaults(), ...saved };
        // Migration ancien champ includeSpicy → includeHardcore
        if(merged.includeHardcore === undefined && merged.includeSpicy !== undefined){
          merged.includeHardcore = merged.includeSpicy;
        }
        delete merged.includeSpicy;
        delete merged.confirmSpicy;
        return merged;
      }
      return defaults();
    }catch{ return defaults(); }
  }
  function saveState(){
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch{ showToast('Stockage indisponible : exportez vos données.'); }
  }
  function showToast(msg){
    const el = $('#toast'); el.textContent = msg; el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
  }

  function screen(name){
    currentScreen = name;
    $$('.screen').forEach(el => el.classList.toggle('active', el.id === `screen-${name}`));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if(name === 'history') renderHistory();
    if(name === 'settings') populateSettings();
    if(name === 'wheel') drawWheel(wheelRotation);
  }

  function setMode(mode){
    currentMode = mode;
    if(mode === 'wheel'){ screen('wheel'); return; }
    screen('game');
    $('#game-title').innerHTML = 'Action ou <em>vérité.</em>';
    $('#game-subtitle').textContent = 'Choisissez une ambiance, puis laissez le jeu vous surprendre.';
    $('#game-eyebrow').textContent = 'VOTRE MOMENT';
    currentFilter = 'all';
    renderPills();
    resetCard();
  }

  function renderPills(){
    const lvlMarkup = DATA.levels
      .map(l => `<button class="pill ${l.id === currentLevel ? 'active' : ''}" data-level="${l.id}">${l.label}</button>`)
      .join('');
    $('#level-pills').innerHTML = lvlMarkup;
    $('#wheel-level-pills').innerHTML = lvlMarkup;
    $('#filter-pills').innerHTML = DATA.filters
      .map(f => `<button class="pill ${f.id === currentFilter ? 'active' : ''}" data-filter="${f.id}">${f.label}</button>`)
      .join('');
  }

  function resetCard(){
    currentCard = null;
    $('#empty-card').classList.remove('hidden');
    $('#prompt-card').class 
