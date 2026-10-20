/* Honryn — jeu original. Les cartes restent des suggestions : le consentement prime toujours. */
(() => {
  const card = (id, type, level, text, tags = [], mode = ['av','couple','discovery']) => ({ id, type, level, text, tags, mode });
  const cards = [
    card('v01','truth','soft','Quel petit détail chez moi te fait sourire, même quand tu ne me le dis pas ?', ['tendresse','quotidien']),
    card('v02','truth','soft','Quel souvenir de nous aimerais-tu pouvoir revivre pendant dix minutes ?', ['souvenirs']),
    card('a01','action','soft','Regarde ton/ta partenaire dans les yeux pendant vingt secondes, sans parler.', ['présence']),
    card('a02','action','soft','Fais un compliment très précis que tu n’as encore jamais formulé.', ['tendresse']),
    card('v03','truth','soft','À quel moment t’es-tu senti·e particulièrement compris·e par moi ?', ['connexion']),
    card('v04','truth','soft','Quelle petite habitude aimerais-tu qu’on invente ensemble ?', ['quotidien','avenir']),
    card('a03','action','soft','Choisissez une chanson qui résume votre duo et écoutez-en trente secondes ensemble.', ['musique']),
    card('v05','truth','soft','Quelle première impression que tu avais de moi a le plus changé ?', ['souvenirs']),
    card('v06','truth','warm','Quelle chose aimerais-tu que je comprenne mieux sur ta façon d’aimer ?', ['communication']),
    card('a04','action','warm','Pendant une minute, chacun dit une chose qu’il apprécie chez l’autre. Pas de fausse modestie.', ['connexion']),
    card('v07','truth','warm','Quel projet un peu fou aimerais-tu qu’on tente à deux un jour ?', ['avenir']),
    card('v08','truth','warm','Qu’est-ce qui t’aide à te sentir en sécurité quand tu es vulnérable ?', ['confiance']),
    card('a05','action','warm','Inventez le titre et l’affiche d’un film inspiré de votre histoire.', ['créativité','rire']),
    card('v09','truth','warm','Quel sujet aimerais-tu qu’on aborde plus souvent, sans attendre le bon moment ?', ['communication']),
    card('v10','truth','warm','Qu’est-ce qui te fait te sentir désiré·e ou choisi·e dans notre relation ?', ['intimité']),
    card('a06','action','warm','Prenez-vous dans les bras, si vous en avez envie, et restez ainsi le temps de trois respirations lentes.', ['tendresse']),
    card('v11','truth','spicy','Quel geste tendre ou romantique te plaît plus que tu ne le laisses paraître ?', ['intimité']),
    card('v12','truth','spicy','Quelle ambiance te met le plus facilement dans un état d’esprit romantique ?', ['désir']),
    card('a07','action','spicy','Propose un baiser ou un geste affectueux que l’autre peut accepter, modifier ou refuser.', ['consentement','intimité']),
    card('v13','truth','spicy','Y a-t-il une forme de proximité que tu aimerais explorer davantage, à ton rythme ?', ['communication','intimité']),
    card('a08','action','spicy','Chuchote à l’autre un compliment qui lui est réservé.', ['flirt']),
    card('v14','truth','spicy','Qu’est-ce qui rend un moment à deux vraiment intime pour toi, au-delà des gestes ?', ['intimité']),
    card('v15','truth','warm','Quand avons-nous été une bonne équipe récemment ? Qu’est-ce qui a aidé ?', ['couple']),
    card('a09','action','warm','Échangez vos téléphones face cachée et inventez votre prochain rendez-vous idéal en trois détails.', ['rendez-vous']),
    card('v16','truth','soft','Quel plat, lieu ou parfum te rappelle immédiatement un moment heureux ?', ['souvenirs']),
    card('v17','truth','warm','Quelle qualité chez moi aimerais-tu voir davantage dans les moments difficiles ?', ['communication']),
    card('a10','action','soft','Chacun dessine en trente secondes le portrait de l’autre. Le résultat doit être célébré, pas jugé.', ['rire']),
    card('v18','truth','spicy','Quelle façon de flirter te fait te sentir à l’aise et apprécié·e ?', ['flirt','communication']),
    card('a11','action','warm','Faites chacun une proposition de rendez-vous à moins de 20 €, puis choisissez-en une.', ['rendez-vous']),
    card('v19','truth','soft','Quelle chose simple pourrais-je faire cette semaine pour te faciliter la vie ?', ['attention']),
    card('v20','truth','warm','Quelle différence entre nous est finalement une force pour notre couple ?', ['couple']),
    card('a12','action','spicy','Demande à ton/ta partenaire quel type de compliment lui ferait plaisir maintenant, puis offre-le-lui si tu le souhaites.', ['consentement','flirt']),
    card('v21','truth','soft','Qu’est-ce qui te fait rire à chaque fois, même si tu connais déjà la chute ?', ['rire']),
    card('v22','truth','warm','Quelle petite tradition aimerais-tu que l’on garde dans cinq ans ?', ['avenir']),
    card('a13','action','soft','Choisissez chacun une photo qui vous rend heureux et racontez l’histoire derrière.', ['souvenirs']),
    card('v23','truth','spicy','Quelle attention romantique te touche le plus : les mots, le temps, les gestes ou les surprises ?', ['désir']),
    card('v24','truth','warm','Comment préfères-tu qu’on répare les choses après un désaccord ?', ['communication']),
    card('a14','action','warm','Inventez chacun une question que vous n’avez jamais osé poser, puis choisissez si vous voulez y répondre.', ['découverte']),
    card('v25','truth','soft','Quel moment ordinaire avec moi aimerais-tu ne jamais prendre pour acquis ?', ['gratitude']),
    card('v26','truth','warm','Dans quelle situation te sens-tu le plus libre d’être pleinement toi-même avec moi ?', ['confiance']),
    card('a15','action','spicy','Laissez l’autre choisir entre un compliment murmuré, un câlin ou un baiser — uniquement si vous en avez envie tous les deux.', ['consentement','intimité'])
  ];
  window.HONRYN_DATA = { cards, levels: [
    {id:'soft', label:'Douce', description:'Tendresse et légèreté'},
    {id:'warm', label:'Complice', description:'Plus profond, plus proche'},
    {id:'spicy', label:'Pimentée', description:'Flirt et intimité, sans pression'}
  ], filters: [
    {id:'all', label:'Tout'}, {id:'truth', label:'Vérité'}, {id:'action', label:'Action'}, {id:'connection', label:'Connexion'}
  ], wheelSegments: [
    {label:'Vérité', type:'truth'}, {label:'Action', type:'action'}, {label:'Connexion', type:'connection'}, {label:'Surprise', type:'all'},
    {label:'Vérité', type:'truth'}, {label:'Action', type:'action'}, {label:'À deux', type:'connection'}, {label:'Surprise', type:'all'}
  ]};
})();
