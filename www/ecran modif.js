/* -----------------------------------------------------
    GESTION OBJETS ECRAN
------------------------------------------------------ */
const itemDescriptions = {

	"Corde": "Une corde usagée mais qui semble fonctionnelle",
};

const itemIcons = {

	"Corde": "001. corde.png"
};

/* -----------------------------------------------------
       BASE DE DONNEES DES ECRANS
------------------------------------------------------ */

const screens = {
	"Ecran0006": {
  titre: "La route des cols",
  texte: "La forêt devient de moins en moins dense. Un petit vent, qui semble magique, souffle..",
  image: "Lieux/Foret/006. Foret.jpg",
  choix: [
    { texte: "Respirer un bon coup d'air frais !", goto: "Ecran0015" },
    { texte: "Redescendre vet la fôret", goto: "Ecran0001" },
  ]
},
"Ecran0007": {
  titre: "Le panneau",
  texte: "Les panneaux sont écrits dans une langue inconnue. Il n’y a rien d’autre dans les parages.",
  image: "Lieux/Foret/002. Foret.jpg",
  choix: [
    { texte: "Prendre la route à droite", goto: "Ecran0005" },
    { texte: "Plutôt celle de gauche", goto: "Ecran0006" },
  ]
},
"Ecran0008": {
  titre: "Fouille du cimetière",
  texte: "Vous fouillez autour des tombes et trouvez une bague qui semble dégager une grande énergie !",
  image: "Lieux/Foret/008. Foret.jpg",
  choix: [
    { texte: "Mettre la bague", goto: "Ecran0017" },
    { texte: "Ne pas la ramasser et se recueillir", goto: "Ecran0018" },
    { texte: "Continuer à travers bois", goto: "Ecran0004" },
  ]
},
"Ecran0009": {
  titre: "Recueillement",
  texte: "Vous vous recueillez un moment auprès des tombes et vous vous sentez bien ! (Grâce aléatoire)",
  image: "Lieux/Foret/009. Foret.jpg",
  choix: [
    { texte: "Continuer à travers bois", goto: "Ecran0004" },
    { texte: "Fouiller autour des tombes", goto: "Ecran0008" },
    { texte: "Retourer ers la fôret", goto: "Ecran0001" },
  ]
},
"Ecran0009A": {
  titre: "Recueillement",
  texte: "Vous vous recueillez un moment auprès des tombes..",
  image: "Lieux/Foret/009. Foret.jpg",
  choix: [
    { texte: "Continuer à travers bois", goto: "Ecran0004" },
    { texte: "Retourer ers la fôret", goto: "Ecran0001" },
  ]
},
"Ecran0010": {
  titre: "L'Homme-Arbre",
  texte: "L'Homme-Arbre vous regarde et vous dit : « Es‑tu là pour troubler l’ordre qui règne en ces lieux ? »",
  image: "Lieux/Foret/004. Foret.jpg",
  choix: [
    { texte: "Non cela ne m'a même pas effleuré l'esprit", goto: "Ecran0019" },
    { texte: "En effet je suis là pour ça !", goto: "Ecran0020" },
    { texte: "Tu ne vas pas me manger tout de même ?", goto: "Ecran0012" },
  ]
},
"Ecran0011": {
  titre: "L'Homme-Arbre",
  texte: "Nous sommes dans la forêt de Hankpath, l’une des plus belles forêts que je connaisse... et la seule.",
  image: "Lieux/Foret/004. Foret.jpg",
  choix: [
    { texte: "Tu ne vas pas me manger tout de même ?", goto: "Ecran0012" },
    { texte: "Je vois que t'y connais rien, ça ne m'étonne pas pour un Homme-Arbre", goto: "Ecran0020" },
    { texte: "Dire au revoir et s'en aller", goto: "Ecran0024" },
  ]
},
"Ecran0012": {
  titre: "L'Homme-Arbre",
  texte: "L'Homme‑Arbre rigole lentement... « Je ne mange pas de chair ». ",
  image: "Lieux/Foret/004. Foret.jpg",
  choix: [
    { texte: "Dire au revoir et s'en aller au loin", goto: "Ecran0024" },
    { texte: "Retourer ers la fôret", goto: "Ecran0001" },
  ]
},
"Ecran0104": {
  titre: "Le musicien fou",
  texte: "Après avoir fait le tour du temple, vous tombez sur un musicien fou, soufflant dans un instrument improbable aux sons interdits.",
  image: "Lieux/Montagne/006. Montagne.jpg",
  choix: [
    { texte: "Aller à sa rencontre", goto: "Ecran0128" },
    { texte: "Repartir vers la porte", goto: "Ecran0103" },
    { texte: "Allez vers la statue", goto: "Ecran0102" },
  ]
},
"Ecran0117": {
  titre: "La statue qui vous regarde",
  texte: "Vous sentez une douleur au cerveau ! « Insolent… mais Morbélios aime l’ironie. Conversion partielle acceptée. Félicitations. Vous êtes désormais un peu moins libre. »",
  image: "Lieux/Montagne/014. Montagne.png",
  choix: [
    { texte: "Allez devant la porte d'entrée", goto: "Ecran0103" },
    { texte: "Faire le tour du temple", goto: "Ecran0104" },
    { texte: "Continuer le chemin en contre bas", goto: "Ecran0126" },
  ]
},  
"Ecran0127": {
  titre: "Maison de montagne",
  texte: "Vous approchez de la maison, devant celle-ci se trouve un homme bourru qui vous regarde d'un air étrange",
  image: "Lieux/Montagne/007. Montagne.jpg",
  choix: [
    { texte: "S'approchez de lui", goto: "Ecran0000" },
    { texte: "Repartir vers le puit", goto: "Ecran0000" },
    { texte: "Continuer son chemin", goto: "Ecran0000" },
  ]
},
"Ecran0128": {
  titre: "Le musicien fou",
  texte: "« Oh… un auditeur. Rare. Fragile. ♪ doooom »",
  image: "Lieux/Montagne/006. Montagne.jpg",
  meetCharacter: "Musicien Fou",
  redirectIfMet: "Ecran0142",
  choix: [
    { texte: "Quel est cet instrument ?", goto: "Ecran0129" },
    { texte: "Vous êtes perdu ?", goto: "Ecran0130" },
    { texte: "Cette musique… elle me fait mal aux oreilles.", goto: "Ecran0131" },
  ]
},
"Ecran0129": {
  titre: "Le musicien fou",
  texte: "« Un morbhorn. Accordé sur la peur. Cadeau de Morbélios… ♪ braaah, Petit jeu. Si tu gagnes… récompense. Si tu perds… concert. ♪ do-do-do »",
  image: "Lieux/Montagne/006. Montagne.jpg",
  choix: [
    { texte: "Je suis quelqu'un de joueur, mais je manque encore de connaissance sur le sujet", goto: "Ecran0132" },
    { texte: "Mmmh non merci.. je ne préfère pas !", goto: "Ecran0133" },
  ]
},
"Ecran0130": {
  titre: "Le musicien fou",
  texte: "« Perdu ? Non. Consacré. ♪ ti-ti-ti, Petit jeu. Si tu gagnes… récompense. Si tu perds… concert. ♪ do-do-do »",
  image: "Lieux/Montagne/006. Montagne.jpg",
  choix: [
    { texte: "Je suis quelqu'un de joueur, mais je manque encore de connaissance sur le sujet", goto: "Ecran0132" },
    { texte: "Mmmh non merci.. je ne préfère pas !", goto: "Ecran0133" },
  ]
},
"Ecran0131": {
  titre: "Le musicien fou",
  texte: "« C’est normal. La vérité pique. ♪ gnnnng, Petit jeu. Si tu gagnes… récompense. Si tu perds… concert. ♪ do-do-do »",
  image: "Lieux/Montagne/006. Montagne.jpg",
  choix: [
    { texte: "Je suis quelqu'un de joueur, mais je manque encore de connaissance sur le sujet", goto: "Ecran0132" },
    { texte: "Mmmh non merci.. je ne préfère pas !", goto: "Ecran0133" },
  ]
},
"Ecran0132": {
  titre: "Le musicien fou",
  texte: "« Qui est le chanteur sacré du culte de Morbléios ? »",
  image: "Lieux/Montagne/006. Montagne.jpg",
  choix: [
    { texte: "En impro totale : Le Chœur des Sans-Langue", goto: "Ecran0134" },
    { texte: "Morbélios himself ?", goto: "Ecran0135" },
    { texte: "D'après ce que j'entends.. Vous ?", goto: "Ecran0136" },
  ]
},