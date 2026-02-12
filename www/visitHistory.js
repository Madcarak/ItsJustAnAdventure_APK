/* visitHistory.js - version robuste debug-friendly
   - PC : addVisitHistoryButton()
   - Mobile : .visit-history-btn-mobile (HTML)
   - Sécurité si player/screens indéfinis
*/

/* === Configuration === */
const VISIT_HISTORY_ALLOWED_SCREENS = [
  "Ecran0001",
  "Ecran0002",
  "Ecran0003",
  "Ecran0005",
  "Ecran0016",
  "Ecran0023",
  "Ecran0024",
  "Ecran0029",
  "Ecran0040",
  "Ecran0045",
  "Ecran0049",
  "Ecran0054",
  "Ecran0063",
  "Ecran0075",
  "Ecran0101"
];

/* === Helpers debug === */
function log(...args) {
  // Désactivez les logs en remplaçant par function log(){}
  console.info('[visitHistory]', ...args);
}

function safeGetScreens() {
  if (typeof screens === 'undefined' || !screens) {
    log('⚠️ objet `screens` non défini.');
    return {};
  }
  return screens;
}

function safeGetPlayer() {
  if (typeof player === 'undefined' || !player) {
    log('⚠️ objet `player` non défini. Création d\'un player temporaire.');
    window.player = { visitedScreens: [] };
    return window.player;
  }
  if (!player.visitedScreens) player.visitedScreens = [];
  return player;
}

// Remplace / complète createVisitHistoryMenu pour inclure les images
function createVisitHistoryMenu() {
  const screensObj = (typeof screens !== 'undefined') ? screens : {};
  const playerObj = (typeof player !== 'undefined') ? player : { visitedScreens: [] };

  let menu = document.getElementById('visit-history-menu');
  if (!menu) {
    menu = document.createElement('div');
    menu.id = 'visit-history-menu';
    menu.className = 'visit-history-menu';
    menu.setAttribute('role','menu');
    const title = document.createElement('h3');
    title.textContent = 'Écrans visités';
    menu.appendChild(title);
  }

  // Rebuild container
  const old = menu.querySelector('.visit-history-cards');
  if (old) old.remove();
  const container = document.createElement('div');
  container.className = 'visit-history-cards';

  const visited = (playerObj && playerObj.visitedScreens) ? playerObj.visitedScreens : [];

  if (visited.length === 0) {
    const p = document.createElement('p');
    p.textContent = 'Aucun lieu visité';
    container.appendChild(p);
  } else {
    visited.forEach(screenId => {
      const screenData = screensObj[screenId] || {};
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'visit-history-card';
      // image si présente
      if (screenData.image || screenData.img || screenData.thumbnail) {
        const imgUrl = screenData.image || screenData.img || screenData.thumbnail;
        const img = document.createElement('img');
        img.className = 'visit-history-thumb';
        img.src = imgUrl;
        img.alt = screenData.titre || screenId;
        // fallback onerror pour voir si le src est invalide
        img.onerror = function() {
          console.warn('[visitHistory] image failed to load:', imgUrl, 'for', screenId);
          this.style.display = 'none';
        };
        card.appendChild(img);
      }
      const label = document.createElement('span');
      label.className = 'visit-history-label';
      label.textContent = screenData.titre || screenId;
      card.appendChild(label);

      card.addEventListener('click', () => {
        console.info('[visitHistory] click card ->', screenId);
        if (typeof showScreen === 'function') showScreen(screenId);
        menu.classList.remove('show');
      });
      container.appendChild(card);
    });
  }

  menu.appendChild(container);

  // Positionnement: préfère mobileBtn, sinon pcBtn, sinon side-menu
// ✅ positionnement intelligent PC / Mobile
const mobileBtn = document.querySelector('.visit-history-btn-mobile');
const pcBtn = document.getElementById('visit-history-btn');

if (mobileBtn && window.innerWidth < 900) {
    // 📱 MOBILE → juste sous le bouton mobile
    mobileBtn.insertAdjacentElement('afterend', menu);
} else if (pcBtn) {
    // 🖥️ PC → dans la section PC
    const section = pcBtn.closest('.visit-history-section') || pcBtn.parentElement;
    section.appendChild(menu);
} else {
    // 🔥 fallback sécurité
    document.body.appendChild(menu);
}



  menu.classList.toggle('show');
  console.info('[visitHistory] menu toggled. images count=', menu.querySelectorAll('img').length);
}

// addVisitHistoryButton: assure injection + listener + visibility
function addVisitHistoryButton() {
  if (document.getElementById('visit-history-btn')) return;

  const btn = document.createElement('button');
  btn.id = 'visit-history-btn';
  btn.className = 'visit-history-btn';
  btn.type = 'button';
  btn.textContent = 'Historique';

  const panel = document.querySelector('.panel.character');
  const side = document.querySelector('.side-menu') || document.body;
  if (panel) panel.appendChild(btn);
  else side.appendChild(btn);

  log('Bouton PC injecté.');
}



/* === Marquer écran visité === */
function markScreenAsVisited(screenId) {
  if (!VISIT_HISTORY_ALLOWED_SCREENS.includes(screenId)) {
    return;
  }
  const p = safeGetPlayer();
  if (!p.visitedScreens.includes(screenId)) {
    p.visitedScreens.push(screenId);
    try {
      localStorage.setItem('playerData', JSON.stringify(p));
    } catch (err) {
      log('Erreur sauvegarde localStorage', err);
    }
    log('Écran marqué:', screenId);
  }
}

/* === Initialisation === */
function initVisitHistory() {
  // Restaure player depuis localStorage si possible
  try {
    const raw = localStorage.getItem('playerData');
    if (raw && (typeof player === 'undefined' || !player)) {
      window.player = JSON.parse(raw);
      log('Player restauré depuis localStorage.');
    }
  } catch (err) {
    log('Erreur lecture localStorage:', err);
  }

  safeGetPlayer(); // garantit existence
  safeGetScreens(); // log si absent

  // Attache bouton mobile s'il existe
  const mobileBtn = document.querySelector('.visit-history-btn-mobile');
  if (mobileBtn) {
    // remove listeners duplicates en clonant
    const newBtn = mobileBtn.cloneNode(true);
    mobileBtn.parentNode.replaceChild(newBtn, mobileBtn);
    newBtn.addEventListener('click', e => {
      e.stopPropagation();
      log('clic mobile bouton');
      createVisitHistoryMenu();
    });
    log('Listener mobile attaché.');
  } else {
    log('Aucun bouton mobile détecté.');
  }

  // On n'injecte le bouton PC que si nécessaire (ecrans.js peut appeler addVisitHistoryButton())
  // Ne pas appeler addVisitHistoryButton automatiquement pour laisser ecrans.js le décider.
  // Mais on peut injecter si on détecte un environnement PC (taille >= 900px par exemple).
  if (window.innerWidth >= 900 && !document.getElementById('visit-history-btn')) {
    // facultatif : décommenter pour injecter automatiquement en grand écran
    // addVisitHistoryButton();
    log('Grand écran détecté, addVisitHistoryButton() disponible si appelé.');
  }

  // clic extérieur pour fermer
document.addEventListener('click', e => {
  const pcBtn = e.target.closest('#visit-history-btn');
  const mobileBtn = e.target.closest('.visit-history-btn-mobile');

  if (pcBtn || mobileBtn) {
    e.preventDefault();
    e.stopPropagation();
    log('clic bouton historique (delegation)');
    createVisitHistoryMenu();
  }
});


  // raccourci clavier
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key.toLowerCase() === 'h') {
      e.preventDefault();
      createVisitHistoryMenu();
    }
  });

  log('initVisitHistory terminé.');
}

/* === Lancement au DOM ready === */
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initVisitHistory, 150);
});
