(() => {
  'use strict';
  const DATA = window.HONRYN_DATA;
  const STORAGE_KEY = 'honryn_v2_data';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const defaults = () => ({ version: 2, players: ['Joueur·se 1','Joueur·se 2'], adaptive: true, includeSpicy: true, confirmSpicy: true, customCards: [], history: [], favorites: [], seen: [], levelUse: {soft:0,warm:0,spicy:0}, turn: 0 });
  let state = loadState();
  let currentScreen = 'home', currentMode = 'av', currentLevel = 'soft', currentFilter = 'all', currentCard = null, historyTab = 'history', cardCounter = 0, toastTimer = null, spinBusy = false, pendingSpicyCallback = null, wheelRotation = 0;

  function loadState(){try{const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');return saved&&saved.version===2?{...defaults(),...saved}:defaults()}catch{return defaults()}}
  function saveState(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}catch{showToast('Stockage indisponible : exportez vos données pour les conserver.')}}
  function showToast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2400)}

  function screen(name){
    currentScreen=name;
    $$('.screen').forEach(el=>el.classList.toggle('active',el.id===`screen-${name}`));
    window.scrollTo({top:0,behavior:'smooth'});
    if(name==='history')renderHistory();
    if(name==='custom')renderCustom();
    if(name==='settings')populateSettings();
    if(name==='wheel')drawWheel(wheelRotation);
  }

  function setMode(mode){
    currentMode=mode;
    if(mode==='wheel'){screen('wheel');return}
    if(mode==='custom'){screen('custom');return}
    screen('game');
    const titles={
      av:['Action ou ','vérité.','Choisissez une ambiance, puis laissez le jeu vous surprendre.','VOTRE MOMENT'],
      couple:['Connexion ','à deux.','Des questions et gestes pour nourrir votre complicité.','VOTRE DUO'],
      discovery:['Terrain ','inconnu.','Des conversations pour apprendre encore à vous connaître.','NOUVELLES PERSPECTIVES']
    };
    const t=titles[mode]||titles.av;
    $('#game-title').innerHTML=`${t[0]}<em>${t[1]}</em>`;
    $('#game-subtitle').textContent=t[2];
    $('#game-eyebrow').textContent=t[3];
    $('#level-controls').classList.toggle('hidden',mode==='discovery');
    $('#filter-controls').classList.toggle('hidden',mode==='discovery');
    currentFilter=mode==='discovery'?'connection':'all';
    renderPills();
    resetCard();
  }

  function renderPills(){
    const markup=DATA.levels.map(l=>`<button class="pill ${l.id===currentLevel?'active':''}" data-level="${l.id}">${l.label}</button>`).join('');
    $('#level-pills').innerHTML=markup;
    $('#wheel-level-pills').innerHTML=markup;
    $('#filter-pills').innerHTML=DATA.filters.map(f=>`<button class="pill ${f.id===currentFilter?'active':''}" data-filter="${f.id}">${f.label}</button>`).join('');
  }

  function resetCard(){
    currentCard=null;
    $('#empty-card').classList.remove('hidden');
    $('#prompt-card').classList.add('hidden');
    $('#game-actions').classList.add('hidden');
    $('#turn-label').textContent=`Au tour de ${state.players[state.turn]||'vous'}`;
    $('#draw-card').onclick=drawNextCard;
  }

  function getAllCards(){
    return DATA.cards.concat(state.customCards.map(c=>({...c,mode:['av','couple','discovery','custom']})));
  }

  function eligibleCards({mode=currentMode,level=currentLevel,filter=currentFilter,excludeSeen=true}={}){
    let list=getAllCards().filter(c=>{
      if(!state.includeSpicy&&c.level==='spicy')return false;
      if(mode==='discovery'&&!((c.tags||[]).some(t=>['communication','découverte','couple','avenir','confiance','souvenirs'].includes(t))))return false;
      if(mode==='couple'&&!((c.tags||[]).some(t=>['couple','connexion','communication','confiance','avenir','tendresse','intimité'].includes(t))))return false;
      if(mode==='custom'&&!state.customCards.some(x=>x.id===c.id))return false;
      if(mode==='av'&&!['truth','action'].includes(c.type))return false;
      // En mode Découverte les pastilles d'ambiance sont masquées : on ignore le niveau.
      if(mode!=='discovery'&&level&&c.level!==level)return false;
      if(filter==='truth'&&c.type!=='truth')return false;
      if(filter==='action'&&c.type!=='action')return false;
      if(filter==='connection'&&!((c.tags||[]).some(t=>['connexion','communication','couple','confiance','avenir','découverte','tendresse'].includes(t))))return false;
      if(excludeSeen&&state.seen.includes(c.id))return false;
      return true;
    });
    if(!list.length&&excludeSeen)return eligibleCards({mode,level,filter,excludeSeen:false});
    return list;
  }

  function chooseCard(options={}){
    let list=eligibleCards(options);
    if(!list.length)return null;
    if(state.adaptive&&options.mode!=='discovery'&&options.level===undefined){
      const lowUse=Object.entries(state.levelUse).sort((a,b)=>a[1]-b[1])[0]?.[0];
      if(lowUse&&Math.random()<.2){
        const filtered=list.filter(c=>c.level===lowUse);
        if(filtered.length)list=filtered;
      }
    }
    return list[Math.floor(Math.random()*list.length)];
  }

  function maybeConfirmSpicy(card, callback){
    if(card.level==='spicy'&&state.confirmSpicy){
      pendingSpicyCallback=callback;
      $('#confirm-modal').classList.remove('hidden');
    }else callback();
  }
  function closeModal(){
    $('#confirm-modal').classList.add('hidden');
    pendingSpicyCallback=null;
  }

  function drawNextCard(){
    const card=chooseCard();
    if(!card){showToast('Aucune carte disponible avec ces filtres.');return}
    maybeConfirmSpicy(card,()=>showCard(card));
  }

  function showCard(card){
    currentCard=card;
    cardCounter++;
    state.seen.push(card.id);
    if(state.seen.length>70)state.seen=state.seen.slice(-45);
    state.levelUse[card.level]=(state.levelUse[card.level]||0)+1;
    state.history.unshift({id:card.id,text:card.text,type:card.type,level:card.level,tags:card.tags||[],mode:currentMode,at:Date.now()});
    state.history=state.history.slice(0,120);
    saveState();
    $('#empty-card').classList.add('hidden');
    $('#prompt-card').classList.remove('hidden');
    $('#game-actions').classList.remove('hidden');
    $('#card-type').textContent=typeLabel(card.type).toUpperCase();
    $('#card-count').textContent=`CARTE ${String(cardCounter).padStart(2,'0')}`;
    $('#prompt-text').textContent=card.text;
    $('#prompt-level').textContent=levelLabel(card.level).toUpperCase();
    $('#prompt-tags').replaceChildren(...(card.tags||[]).slice(0,4).map(tag=>{const s=document.createElement('span');s.textContent=tag;return s}));
    const isFav=state.favorites.some(f=>f.id===card.id);
    $('#favorite-card').textContent=isFav?'♥ Favori':'♡ Favori';
    $('#favorite-card').setAttribute('aria-pressed',String(isFav));
    $('#turn-label').textContent=`Au tour de ${state.players[state.turn]||'vous'}`;
    $('#next-card').onclick=drawNextCard;
    $('#skip-card').onclick=()=>{state.turn=(state.turn+1)%2;saveState();resetCard();showToast('Carte passée, sans justification.');};
    $('#favorite-card').onclick=toggleFavorite;
  }

  function typeLabel(type){return ({truth:'Vérité',action:'Action',connection:'Connexion',all:'Surprise'})[type]||'Carte'}
  function levelLabel(level){return ({soft:'Douce',warm:'Complice',spicy:'Pimentée'})[level]||'Personnalisée'}

  function toggleFavorite(){
    if(!currentCard)return;
    const index=state.favorites.findIndex(f=>f.id===currentCard.id);
    if(index>=0){state.favorites.splice(index,1);showToast('Retirée des favoris.')}
    else{state.favorites.unshift({id:currentCard.id,text:currentCard.text,type:currentCard.type,level:currentCard.level,tags:currentCard.tags||[],at:Date.now()});showToast('Ajoutée aux favoris.')}
    saveState();
    const fav=state.favorites.some(f=>f.id===currentCard.id);
    $('#favorite-card').textContent=fav?'♥ Favori':'♡ Favori';
    $('#favorite-card').setAttribute('aria-pressed',String(fav));
  }

  function changeTurn(){
    state.turn=(state.turn+1)%2;
    saveState();
    $('#turn-label').textContent=`Au tour de ${state.players[state.turn]||'vous'}`;
    showToast(`À ${state.players[state.turn]} de jouer.`);
  }

  function renderCustom(){
    const list=$('#custom-list');
    $('#custom-count').textContent=`${state.customCards.length} carte${state.customCards.length===1?'':'s'}`;
    list.replaceChildren();
    if(!state.customCards.length){list.innerHTML='<div class="empty-state">Vos cartes personnelles apparaîtront ici.</div>';return}
    state.customCards.forEach(c=>{
      const item=document.createElement('div');item.className='custom-item';
      const p=document.createElement('p');
      const meta=document.createElement('span');meta.className='item-meta';
      meta.textContent=`${typeLabel(c.type).toUpperCase()} · ${levelLabel(c.level).toUpperCase()}`;
      p.append(meta,document.createTextNode(c.text));
      const del=document.createElement('button');
      del.className='small-delete';del.textContent='✕';del.setAttribute('aria-label','Supprimer cette carte');
      del.onclick=()=>{state.customCards=state.customCards.filter(x=>x.id!==c.id);saveState();renderCustom();showToast('Carte supprimée.');};
      item.append(p,del);list.append(item);
    });
  }

  function renderHistory(){
    const list=$('#history-list');
    const entries=historyTab==='favorites'?state.favorites:state.history;
    list.replaceChildren();
    if(!entries.length){
      list.innerHTML=`<div class="empty-state">${historyTab==='favorites'?'Aucun favori pour le moment. Touchez ♡ sur une carte pour la garder.':'Votre historique apparaîtra au fil de vos parties.'}</div>`;
      return;
    }
    entries.forEach(entry=>{
      const item=document.createElement('div');item.className='history-item';
      const p=document.createElement('p');
      const meta=document.createElement('span');meta.className='item-meta';
      meta.textContent=`${typeLabel(entry.type).toUpperCase()} · ${levelLabel(entry.level).toUpperCase()}${entry.at?' · '+new Date(entry.at).toLocaleDateString('fr-FR'):''}`;
      p.append(meta,document.createTextNode(entry.text));
      const actions=document.createElement('div');actions.className='history-actions';
      if(historyTab==='favorites'){
        const fav=document.createElement('button');
        fav.className='item-fav';fav.textContent='♥';fav.title='Retirer des favoris';
        fav.onclick=()=>{state.favorites=state.favorites.filter(f=>f.id!==entry.id);saveState();renderHistory()};
        actions.append(fav);
      }
      item.append(p,actions);list.append(item);
    });
  }

  function populateSettings(){
    $('#player-one').value=state.players[0]||'';
    $('#player-two').value=state.players[1]||'';
    $('#adaptive-toggle').checked=!!state.adaptive;
    $('#spicy-toggle').checked=!!state.includeSpicy;
    $('#confirm-spicy').checked=!!state.confirmSpicy;
  }

  function exportData(){
    const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;a.download=`honryn-sauvegarde-${new Date().toISOString().slice(0,10)}.json`;
    document.body.append(a);a.click();a.remove();URL.revokeObjectURL(url);
    showToast('Sauvegarde exportée.');
  }

  function importData(file){
    if(!file)return;
    const reader=new FileReader();
    reader.onload=()=>{
      try{
        const parsed=JSON.parse(reader.result);
        if(!parsed||!Array.isArray(parsed.customCards)||!Array.isArray(parsed.history)||!Array.isArray(parsed.favorites))throw new Error('format');
        const clean={...defaults(),...parsed,version:2};
        clean.customCards=clean.customCards.filter(c=>c&&typeof c.text==='string').slice(0,500);
        clean.history=clean.history.slice(0,120);
        clean.favorites=clean.favorites.slice(0,500);
        clean.seen=Array.isArray(clean.seen)?clean.seen.slice(-70):[];
        clean.players=Array.isArray(clean.players)&&clean.players.length>=2?clean.players.slice(0,2):defaults().players;
        state=clean;saveState();
        populateSettings();renderCustom();renderHistory();
        showToast('Sauvegarde importée.');
      }catch{showToast('Fichier de sauvegarde invalide.')}
    };
    reader.readAsText(file);
  }

  const wheelCanvas=$('#wheel-canvas');
  const ctx=wheelCanvas?wheelCanvas.getContext('2d'):null;

  function drawWheel(rotation=0){
    if(!ctx)return;
    const d=wheelCanvas.width,c=d/2,r=d*.46,segments=DATA.wheelSegments,n=segments.length;
    ctx.clearRect(0,0,d,d);
    ctx.save();ctx.translate(c,c);ctx.rotate(rotation);
    for(let i=0;i<n;i++){
      const start=-Math.PI/2+i*2*Math.PI/n,end=start+2*Math.PI/n;
      ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,r,start,end);ctx.closePath();
      ctx.fillStyle=['#3b2832','#25232b','#6a493c','#28242b','#4b3039','#28232a','#6c5a43','#30252e'][i%8];
      ctx.fill();
      ctx.strokeStyle='rgba(240,217,169,.55)';ctx.lineWidth=2;ctx.stroke();
      ctx.save();ctx.rotate(start+(end-start)/2);ctx.translate(r*.68,0);ctx.rotate(Math.PI/2);
      ctx.fillStyle='#f2e8d5';ctx.font='600 18px "DM Sans", sans-serif';ctx.textAlign='center';
      ctx.fillText(segments[i].label.toUpperCase(),0,0);
      ctx.restore();
    }
    ctx.beginPath();ctx.arc(0,0,r+3,0,Math.PI*2);ctx.strokeStyle='#d8bd87';ctx.lineWidth=5;ctx.stroke();
    ctx.restore();
  }

  function spinWheel(){
    if(spinBusy)return;
    spinBusy=true;
    $('#spin-wheel').disabled=true;
    $('#wheel-result').textContent='Le hasard choisit…';
    const start=performance.now(),duration=3300+Math.random()*700,initial=wheelRotation;
    const extra=(Math.PI*2)*(5+Math.random()*3)+Math.random()*Math.PI*2;
    function frame(now){
      const t=Math.min(1,(now-start)/duration),ease=1-Math.pow(1-t,4);
      wheelRotation=initial+extra*ease;
      drawWheel(wheelRotation);
      if(t<1){requestAnimationFrame(frame);return}
      spinBusy=false;
      $('#spin-wheel').disabled=false;
      const n=DATA.wheelSegments.length;
      // Le pointeur est en haut du canvas (angle -π/2) : on ne rajoute PAS de décalage.
      const angle=((Math.PI*2-(wheelRotation%(Math.PI*2)))%(Math.PI*2));
      const idx=Math.floor(angle/(Math.PI*2/n))%n;
      const segment=DATA.wheelSegments[idx];
      const card=chooseCard({mode:'av',level:currentLevel,filter:segment.type,excludeSeen:true});
      if(!card){$('#wheel-result').textContent='Aucune carte disponible';return}
      $('#wheel-result').textContent=`${segment.label} : ${card.text}`;
      state.history.unshift({id:card.id,text:card.text,type:card.type,level:card.level,tags:card.tags||[],mode:'wheel',at:Date.now()});
      state.history=state.history.slice(0,120);
      state.seen.push(card.id);
      if(state.seen.length>70)state.seen=state.seen.slice(-45);
      saveState();
      $('#wheel-result').title='Résultat de la roue — carte proposée';
    }
    requestAnimationFrame(frame);
  }

  function bind(){
    document.addEventListener('click',e=>{
      const nav=e.target.closest('[data-screen]');
      if(nav){screen(nav.dataset.screen);return}
      const mode=e.target.closest('[data-mode]');
      if(mode){setMode(mode.dataset.mode);return}
      const level=e.target.closest('[data-level]');
      if(level){currentLevel=level.dataset.level;renderPills();if(currentScreen==='wheel')drawWheel(wheelRotation);return}
      const filter=e.target.closest('[data-filter]');
      if(filter){currentFilter=filter.dataset.filter;renderPills();return}
      if(e.target.closest('[data-close-modal]'))closeModal();
    });
    $('#history-open').onclick=()=>screen('history');
    $('#settings-open').onclick=()=>screen('settings');
    $('#change-turn').onclick=changeTurn;
    $('#draw-card').onclick=drawNextCard;
    $('#next-card').onclick=drawNextCard;
    $('#skip-card').onclick=()=>{state.turn=(state.turn+1)%2;saveState();resetCard();showToast('Carte passée, sans justification.');};
    $('#favorite-card').onclick=toggleFavorite;
    $('#spin-wheel').onclick=spinWheel;
    $('#modal-cancel').onclick=closeModal;
    $('#modal-confirm').onclick=()=>{const cb=pendingSpicyCallback;closeModal();if(cb)cb()};

    $('#custom-form').addEventListener('submit',e=>{
      e.preventDefault();
      const text=$('#custom-text').value.trim();
      if(!text)return;
      state.customCards.unshift({
        id:`custom-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
        type:$('#custom-type').value,
        level:$('#custom-level').value,
        text,
        tags:$('#custom-tags').value.split(',').map(s=>s.trim()).filter(Boolean).slice(0,8)
      });
      saveState();$('#custom-form').reset();renderCustom();
      showToast('Votre carte a été ajoutée.');
    });

    $$('[data-history-tab]').forEach(btn=>btn.onclick=()=>{
      historyTab=btn.dataset.historyTab;
      $$('[data-history-tab]').forEach(b=>b.classList.toggle('active',b===btn));
      renderHistory();
    });

    $('#clear-history').onclick=()=>{
      if(!state.history.length){showToast('L’historique est déjà vide.');return}
      if(confirm('Effacer l’historique des cartes jouées ? Les favoris seront conservés.')){
        state.history=[];state.seen=[];saveState();renderHistory();
        showToast('Historique effacé.');
      }
    };

    $('#settings-form').addEventListener('submit',e=>{
      e.preventDefault();
      state.players=[$('#player-one').value.trim()||'Joueur·se 1',$('#player-two').value.trim()||'Joueur·se 2'];
      state.adaptive=$('#adaptive-toggle').checked;
      state.includeSpicy=$('#spicy-toggle').checked;
      state.confirmSpicy=$('#confirm-spicy').checked;
      saveState();showToast('Préférences enregistrées.');screen('home');
    });

    $('#export-data').onclick=exportData;
    $('#backup-export').onclick=exportData;
    // On vide l'input pour autoriser la réimportation du même fichier.
    $('#import-file').onchange=e=>{const file=e.target.files[0];importData(file);e.target.value='';};
    $('#reset-all').onclick=()=>{
      if(confirm('Effacer toutes les données Honryn enregistrées sur cet appareil ? Cette action est irréversible.')){
        state=defaults();saveState();populateSettings();renderCustom();renderHistory();
        showToast('Données réinitialisées.');
      }
    };

    // Ne pas déclencher sur un bouton/input déjà focalisé (évite le double appel).
    document.addEventListener('keydown',e=>{
      if(e.key==='Escape')closeModal();
      const tag=(document.activeElement&&document.activeElement.tagName)||'';
      if(e.key==='Enter'&&!['TEXTAREA','INPUT','BUTTON','SELECT','A'].includes(tag)&&currentScreen==='game'&&!$('#prompt-card').classList.contains('hidden')){
        e.preventDefault();
        drawNextCard();
      }
    });
  }

  bind();
  renderPills();
  resetCard();

  if('serviceWorker'in navigator&&location.protocol.startsWith('http')){
    window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
  }
})(); 
