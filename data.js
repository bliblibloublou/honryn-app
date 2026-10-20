// ============================================================
//  CONTENU DU JEU — Modifie librement ces tableaux pour
//  ajouter, retirer ou personnaliser les cartes et la roue.
// ============================================================

const DATA = {
  // ---------- ACTION OU VÉRITÉ ----------
  av: {
    soft: {
      actions: [
        "Fais un compliment sincère à la personne de ton choix.",
        "Imite quelqu’un du groupe pendant 20 secondes.",
        "Chante le refrain de ta chanson préférée.",
        "Envoie un emoji mystérieux au dernier contact de ton téléphone.",
        "Fais 10 pompes (ou 10 squats) sans t’arrêter.",
        "Raconte une anecdote embarrassante mais mignonne.",
        "Fais un massage des épaules de 30 secondes à ton voisin de droite.",
        "Prends une pose de statue pendant 1 minute.",
        "Dis un secret totalement inutile sur toi.",
        "Fais un dessin de la personne à ta gauche en 30 secondes."
      ],
      truths: [
        "Quel est le dernier rêve bizarre dont tu te souviens ?",
        "Quelle est ta plus grande peur irrationnelle ?",
        "Quel est le talent caché dont tu es le plus fier ?",
        "Quelle est la chose la plus enfantine que tu fasses encore ?",
        "Quel est le compliment qui t’a le plus marqué ?",
        "Si tu pouvais vivre dans n’importe quel film, lequel choisirais-tu ?",
        "Quelle est ta plus grande habitude coupable ?",
        "Quel est le pire cadeau que tu aies jamais reçu ?",
        "Quelle chanson te fait instantanément danser ?",
        "Quel est le mensonge le plus innocent que tu répètes souvent ?"
      ]
    },

    chaud: {
      actions: [
        "Fais un massage sensuel des mains à la personne de ton choix pendant 1 minute.",
        "Chuchote un compliment coquin à l’oreille de ton voisin de gauche.",
        "Danse de façon sensuelle pendant 30 secondes.",
        "Retire un accessoire ou un vêtement (au choix) pour le reste de la partie.",
        "Fais un slow avec la personne de ton choix.",
        "Décris ton fantasme le plus soft en 3 phrases.",
        "Embrasse la personne de ton choix sur la joue, tout près de l’oreille.",
        "Prends la main de ton voisin et caresse-la lentement pendant 30 secondes.",
        "Fais un compliment sur le physique de chaque personne du groupe.",
        "Envoie un message ambigu à la 5e personne de ta liste de contacts."
      ],
      truths: [
        "Quelle est la première chose que tu remarques chez quelqu’un qui t’attire ?",
        "Décris ton baiser idéal.",
        "Quel est l’endroit le plus insolite où tu as embrassé quelqu’un ?",
        "Quelle partie du corps trouves-tu la plus sexy chez une personne ?",
        "As-tu déjà envoyé un message coquin ? À qui ?",
        "Quel est ton plus grand turn-on ?",
        "Préfères-tu les préliminaires longs ou aller droit au but ?",
        "Quel est le compliment le plus sexy qu’on t’ait fait ?",
        "Quelle tenue trouves-tu irrésistible chez quelqu’un ?",
        "Quel est ton souvenir le plus sensuel ?"
      ]
    },

    sexy: {
      actions: [
        "Fais un strip-tease de 30 secondes (garde ce que tu veux).",
        "Masse les épaules puis la nuque de la personne de ton choix pendant 1 minute.",
        "Embrasse la personne de ton choix dans le cou pendant 5 secondes.",
        "Assieds-toi sur les genoux de la personne de ton choix pendant 1 minute.",
        "Fais deviner une partie de ton corps à la personne de ton choix, les yeux fermés.",
        "Chuchote ton fantasme le plus audacieux à l’oreille de ton voisin.",
        "Fais un compliment très explicite sur le corps de chaque personne.",
        "Lèche délicatement le lobe de l’oreille de la personne de ton choix.",
        "Prends la main de ton voisin et guide-la sur ton corps (zone de ton choix).",
        "Fais un baiser français à la personne de ton choix (si elle est d’accord)."
      ],
      truths: [
        "Quel est ton fantasme le plus secret que tu oses avouer ici ?",
        "Quelle est la chose la plus folle que tu aies faite par désir ?",
        "As-tu déjà eu un coup d’un soir ? Raconte (sans détails obligatoires).",
        "Quel est l’endroit le plus excitant où tu aimerais faire l’amour ?",
        "Quelle est ta plus grande zone érogène ?",
        "Quel est le jouet ou accessoire qui te tente le plus ?",
        "As-tu déjà regardé quelqu’un faire l’amour ? Raconte.",
        "Quel est ton plus grand fantasme à trois ?",
        "Quelle est la chose la plus embarrassante qui t’ait excitée ?",
        "Quel est ton rythme idéal pour un rapport ?"
      ]
    },

    hardcore: {
      actions: [
        "Retire tous tes vêtements (ou garde uniquement les sous-vêtements) pour le reste de la manche.",
        "Fais un massage sensuel du corps entier (dos, jambes, épaules) à la personne de ton choix pendant 2 minutes.",
        "Mets-toi dans une position suggestive et tiens-la pendant 1 minute.",
        "Embrasse la personne de ton choix là où elle le souhaite (dans les limites du consentement).",
        "Fais une démonstration de tes talents de séduction sur la personne de ton choix pendant 1 minute.",
        "Laisse la personne de ton choix te bander les yeux et te guider pendant 1 minute.",
        "Chuchote à l’oreille de chaque personne un fantasme que tu aimerais réaliser avec elle.",
        "Fais un bisou à la personne de ton choix à l’endroit de son choix.",
        "Danse un slow très serré avec la personne de ton choix.",
        "Mime un acte sensuel avec la personne de ton choix (sans contact réel si tu préfères)."
      ],
      truths: [
        "Quel est le fantasme le plus hardcore que tu aimerais réaliser ce soir ?",
        "Quelle est la limite que tu ne franchirais jamais ?",
        "As-tu déjà eu une expérience à plusieurs ? Raconte.",
        "Quel est ton plus grand kink ?",
        "Quelle est la chose la plus audacieuse que tu aies faite en public ?",
        "Quel est ton fantasme impliquant un/une inconnu·e ?",
        "As-tu déjà utilisé un jouet en public ? Lequel ?",
        "Quelle est ta position préférée et pourquoi ?",
        "Quel est le secret le plus inavouable que tu gardes pour toi ?",
        "Quel est ton plus grand désir refoulé ?"
      ]
    }
  },

  // ---------- ROUE ----------
  wheel: {
    soft: [
      "Massage des épaules (1 min)",
      "Câlin de 30 secondes",
      "Compliment sincère",
      "Bisou sur la joue",
      "Tenir la main (1 min)",
      "Mot doux chuchoté",
      "Danse lente",
      "Caresser les cheveux",
      "Bisou dans le cou",
      "Regarder dans les yeux (30 s)"
    ],
    medium: [
      "Massage sensuel du dos",
      "Bisou français",
      "Mordiller l’oreille",
      "Caresser le bras lentement",
      "Bisou dans le cou (5 s)",
      "S’asseoir sur les genoux",
      "Massage des mains",
      "Léchouille du lobe",
      "Bisou sur le ventre",
      "Souffler sur la nuque"
    ],
    hard: [
      "Retirer un vêtement",
      "Strip-tease (30 s)",
      "Bisou très intense",
      "Massage des fesses",
      "Caresser les cuisses",
      "Bisou sur la poitrine",
      "Mordre doucement l’épaule",
      "Léchouille du cou",
      "Position suggestive (1 min)",
      "Bisou à l’endroit du choix"
    ]
  }
}; 
