/* =====================================================
      THEME DU JEU
===================================================== */
// Ouvrir / fermer les options
document.getElementById("btn-settings").onclick = () => {
    document.getElementById("settings-overlay").classList.add("visible");
};

// Ouvrir les paramètres depuis MOBILE
document.getElementById("btn-settings-mobile").onclick = () => {
    document.getElementById("settings-overlay").classList.add("visible");
};

document.getElementById("settings-close").onclick = () => {
    document.getElementById("settings-overlay").classList.remove("visible");
};

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

// Changement de thème
document.getElementById("theme-selector").onchange = function () {
    const theme = this.value;

    // Supprime tous les thèmes existants
    document.body.classList.remove(...allThemes);

    // Active le thème choisi
    document.body.classList.add(theme);

    // Sauvegarde dans le localStorage
    localStorage.setItem("game-theme", theme);
};

// Charger le thème sauvegardé OU mettre Sépia par défaut
window.addEventListener("load", () => {
    const savedTheme = localStorage.getItem("game-theme") || "theme-sepia";

    // Supprime les anciens thèmes juste au cas où
    document.body.classList.remove(...allThemes);

    // Active le bon thème
    document.body.classList.add(savedTheme);

    // Met la valeur dans le select
    document.getElementById("theme-selector").value = savedTheme;
});

    // --------------------------------------------------
    // THÈMES
    // --------------------------------------------------
    const themeSelector = document.getElementById("theme-selector");
    const themes = [
        "theme-sepia", "theme-dark", "theme-glacial", "theme-maudit",
        "theme-foret", "theme-nuit", "theme-celeste", "theme-infernal",
        "theme-neon", "theme-antique"
    ];

    function applyTheme(theme) {
        document.body.classList.remove(...themes);
        document.body.classList.add(theme);
        localStorage.setItem("game-theme", theme);
    }

    const savedTheme = localStorage.getItem("game-theme") || "theme-sepia";
    applyTheme(savedTheme);

    themeSelector?.addEventListener("change", () => {
        applyTheme(themeSelector.value);
    });