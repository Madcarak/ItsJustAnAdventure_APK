// debug.js - Script de débogage complet pour navigation directe entre écrans

// Fonction pour créer le menu déroulant de débogage
function createDebugMenu() {
    // Vérifie si le menu existe déjà
    if (document.getElementById('debug-menu')) return;

    // Crée le conteneur principal du menu
    const debugContainer = document.createElement('div');
    debugContainer.id = 'debug-menu';
    debugContainer.style.position = 'fixed';
    debugContainer.style.top = '50%';
    debugContainer.style.left = '50%';
    debugContainer.style.transform = 'translate(-50%, -50%)';
    debugContainer.style.zIndex = '2000';
    debugContainer.style.width = '80%';
    debugContainer.style.maxWidth = '600px';
    debugContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    debugContainer.style.borderRadius = '10px';
    debugContainer.style.padding = '20px';
    debugContainer.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';
    debugContainer.style.maxHeight = '80vh';
    debugContainer.style.overflowY = 'auto';

    // Titre du menu
    const title = document.createElement('h2');
    title.textContent = 'Navigation de débogage';
    title.style.marginTop = '0';
    title.style.color = '#ffcc00';
    title.style.textAlign = 'center';
    title.style.borderBottom = '1px solid #444';
    title.style.paddingBottom = '10px';
    debugContainer.appendChild(title);

    // Zone de recherche
    const searchContainer = document.createElement('div');
    searchContainer.style.marginBottom = '15px';

    const searchLabel = document.createElement('label');
    searchLabel.textContent = 'Rechercher :';
    searchLabel.style.display = 'block';
    searchLabel.style.marginBottom = '5px';
    searchLabel.style.color = '#ccc';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.id = 'debug-search';
    searchInput.style.width = '100%';
    searchInput.style.padding = '8px';
    searchInput.style.borderRadius = '4px';
    searchInput.style.border = '1px solid #444';
    searchInput.style.backgroundColor = '#333';
    searchInput.style.color = '#fff';

    searchInput.addEventListener('input', filterScreens);

    searchContainer.appendChild(searchLabel);
    searchContainer.appendChild(searchInput);
    debugContainer.appendChild(searchContainer);

    // Conteneur pour les écrans
    const screensContainer = document.createElement('div');
    screensContainer.id = 'debug-screens-container';
    screensContainer.style.display = 'grid';
    screensContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
    screensContainer.style.gap = '15px';
    screensContainer.style.marginBottom = '20px';

    // Crée les cartes pour chaque écran
    const screenIds = Object.keys(screens).sort();
    screenIds.forEach(screenId => {
        const screen = screens[screenId];
        if (!screen) return;

        const screenCard = document.createElement('div');
        screenCard.className = 'debug-screen-card';
        screenCard.style.backgroundColor = '#222';
        screenCard.style.borderRadius = '8px';
        screenCard.style.padding = '10px';
        screenCard.style.cursor = 'pointer';
        screenCard.style.transition = 'transform 0.2s, box-shadow 0.2s';
        screenCard.style.border = '1px solid #333';

        // Effet de survol
        screenCard.addEventListener('mouseover', () => {
            screenCard.style.transform = 'translateY(-3px)';
            screenCard.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
        });
        screenCard.addEventListener('mouseout', () => {
            screenCard.style.transform = 'translateY(0)';
            screenCard.style.boxShadow = 'none';
        });

        // Clic pour naviguer vers l'écran
        screenCard.addEventListener('click', () => {
            showScreen(screenId);
            document.body.removeChild(debugContainer);
        });

        // Titre de l'écran
        const titleEl = document.createElement('h3');
        titleEl.textContent = screen.titre || screenId;
        titleEl.style.marginTop = '0';
        titleEl.style.color = '#ffcc00';
        titleEl.style.fontSize = '14px';
        titleEl.style.whiteSpace = 'nowrap';
        titleEl.style.overflow = 'hidden';
        titleEl.style.textOverflow = 'ellipsis';

        // ID de l'écran
        const idEl = document.createElement('p');
        idEl.textContent = screenId;
        idEl.style.margin = '5px 0';
        idEl.style.color = '#aaa';
        idEl.style.fontSize = '12px';
        idEl.style.fontFamily = 'monospace';

        // Aperçu de l'image
        const imgContainer = document.createElement('div');
        imgContainer.style.marginTop = '10px';
        imgContainer.style.textAlign = 'center';

        const img = document.createElement('img');
        img.src = screen.image || 'default.png';
        img.style.maxWidth = '100%';
        img.style.height = '80px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '4px';
        img.style.border = '1px solid #444';

        imgContainer.appendChild(img);

        screenCard.appendChild(titleEl);
        screenCard.appendChild(idEl);
        screenCard.appendChild(imgContainer);

        screensContainer.appendChild(screenCard);
    });

    debugContainer.appendChild(screensContainer);

    // Boutons de contrôle
    const controls = document.createElement('div');
    controls.style.display = 'flex';
    controls.style.justifyContent = 'center';
    controls.style.gap = '10px';
    controls.style.marginTop = '15px';

    // Bouton de fermeture
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Fermer';
    closeBtn.style.padding = '8px 15px';
    closeBtn.style.backgroundColor = '#666';
    closeBtn.style.color = 'white';
    closeBtn.style.border = 'none';
    closeBtn.style.borderRadius = '4px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.transition = 'background-color 0.2s';

    closeBtn.addEventListener('mouseover', () => {
        closeBtn.style.backgroundColor = '#888';
    });
    closeBtn.addEventListener('mouseout', () => {
        closeBtn.style.backgroundColor = '#666';
    });
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(debugContainer);
    });

    // Bouton pour aller à l'écran actuel
    const currentScreenBtn = document.createElement('button');
    const currentScreenId = localStorage.getItem('lastScreen') || 'Ecran0001';
    currentScreenBtn.textContent = `Aller à ${currentScreenId}`;
    currentScreenBtn.style.padding = '8px 15px';
    currentScreenBtn.style.backgroundColor = '#4CAF50';
    currentScreenBtn.style.color = 'white';
    currentScreenBtn.style.border = 'none';
    currentScreenBtn.style.borderRadius = '4px';
    currentScreenBtn.style.cursor = 'pointer';
    currentScreenBtn.style.transition = 'background-color 0.2s';

    currentScreenBtn.addEventListener('mouseover', () => {
        currentScreenBtn.style.backgroundColor = '#5cb85c';
    });
    currentScreenBtn.addEventListener('mouseout', () => {
        currentScreenBtn.style.backgroundColor = '#4CAF50';
    });
    currentScreenBtn.addEventListener('click', () => {
        showScreen(currentScreenId);
        document.body.removeChild(debugContainer);
    });

    controls.appendChild(currentScreenBtn);
    controls.appendChild(closeBtn);
    debugContainer.appendChild(controls);

    // Ajoute le conteneur au body
    document.body.appendChild(debugContainer);

    // Fonction pour filtrer les écrans
    function filterScreens() {
        const searchTerm = searchInput.value.toLowerCase();
        const screenCards = document.querySelectorAll('.debug-screen-card');

        screenCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const id = card.querySelector('p').textContent.toLowerCase();

            if (title.includes(searchTerm) || id.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// Fonction pour ajouter un bouton de débogage à un écran
function addDebugButtonToScreen(screenId) {
    const screen = screens[screenId];
    if (!screen) return;

    // Ajoute un choix de menu si ce n'est pas déjà fait
    if (!screen.choix) {
        screen.choix = [];
    }

    // Vérifie si le choix existe déjà
    const existingChoice = screen.choix.find(choice =>
        choice.texte === "Débogage - Navigation"
    );

    if (!existingChoice) {
        screen.choix.push({
            texte: "Débogage - Navigation",
            action: () => {
                createDebugMenu();
            }
        });
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Ajoute le bouton de débogage à certains écrans
    // Exemple: addDebugButtonToScreen("Ecran0001");
    // Vous pouvez appeler cette fonction pour chaque écran où vous voulez ajouter le bouton

    // Ajoute un raccourci clavier pour ouvrir le menu de débogage
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'd') {
            e.preventDefault();
            createDebugMenu();
        }
    });
});
