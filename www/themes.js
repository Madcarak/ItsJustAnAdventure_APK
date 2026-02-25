/* =====================================================
   THEME DU JEU
===================================================== */

// Ouvrir / fermer les options
function setupThemeUI() {
    // Vérifier que tous les éléments existent
    const btnSettings = document.getElementById("btn-settings");
    const btnSettingsMob = document.getElementById("btn-settings-mob");
    const settingsClose = document.getElementById("settings-close");
    const settingsOverlay = document.getElementById("settings-overlay");

    if (btnSettings) {
        btnSettings.onclick = () => {
            if (settingsOverlay) settingsOverlay.classList.add("visible");
        };
    }

    if (btnSettingsMob) {
        btnSettingsMob.onclick = () => {
            if (settingsOverlay) settingsOverlay.classList.add("visible");
        };
    }

    if (settingsClose) {
        settingsClose.onclick = () => {
            if (settingsOverlay) settingsOverlay.classList.remove("visible");
        };
    }
}

// Liste complète des thèmes installés
const allThemes = [
    "theme-dark",
    "theme-sepia",
    "theme-glacial",
    "theme-maudit",
    "theme-foret",
    "theme-nuit",
    "theme-celeste",
    "theme-infernal",
    "theme-neon",
    "theme-antique"
];

// Fonction pour appliquer un thème
function applyTheme(theme) {
    // Supprime tous les thèmes existants
    document.body.classList.remove(...allThemes);

    // Active le thème choisi
    document.body.classList.add(theme);

    // Sauvegarde dans le localStorage
    localStorage.setItem("game-theme", theme);
}

// Changement de thème via le sélecteur
function setupThemeSelector() {
    const themeSelector = document.getElementById("theme-selector");

    if (themeSelector) {
        themeSelector.onchange = function() {
            const theme = this.value;
            applyTheme(theme);
        };
    }
}

// Charger le thème sauvegardé OU mettre Sépia par défaut
function loadSavedTheme() {
    const savedTheme = localStorage.getItem("game-theme") || "theme-sepia";

    // Supprime les anciens thèmes juste au cas où
    document.body.classList.remove(...allThemes);

    // Active le bon thème
    document.body.classList.add(savedTheme);

    // Met la valeur dans le select si le sélecteur existe
    const themeSelector = document.getElementById("theme-selector");
    if (themeSelector) {
        themeSelector.value = savedTheme;
    }
}

// Initialisation du thème
document.addEventListener("DOMContentLoaded", function() {
    setupThemeUI();
    setupThemeSelector();
    loadSavedTheme();
});
