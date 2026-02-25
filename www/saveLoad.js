/* =====================================================
   VARIABLES GLOBALES
===================================================== */

let currentConfirmCallback = null;

const overlayConfirm = document.getElementById("overlay-confirm");
const confirmText = document.getElementById("confirm-text");
const btnYes = document.getElementById("btn-yes");
const btnNo = document.getElementById("btn-no");

/* =====================================================
   CONFIRM BOX
===================================================== */

function askConfirm(message, callback) {

    if (!overlayConfirm || !confirmText) {
        console.error("Overlay confirm introuvable.");
        return;
    }

    confirmText.innerText = message;
    currentConfirmCallback = callback;

    btnYes.style.display = "inline-block";
    btnNo.style.display = "inline-block";

    overlayConfirm.classList.remove("hidden");
    keyboardEnabled = false;
}

btnYes?.addEventListener("click", () => {

    overlayConfirm.classList.add("hidden");

    if (currentConfirmCallback) {
        currentConfirmCallback();
        currentConfirmCallback = null;
    }

    keyboardEnabled = true;
});

btnNo?.addEventListener("click", () => {

    overlayConfirm.classList.add("hidden");
    currentConfirmCallback = null;
    keyboardEnabled = true;
});

/* =====================================================
   ALERT SIMPLE (OK)
===================================================== */

function askAlert(message, onClose = null) {

    confirmText.innerText = message;

    btnYes.style.display = "none";
    btnNo.style.display = "none";

    let btnOk = document.getElementById("btn-ok");

    if (!btnOk) {
        btnOk = document.createElement("button");
        btnOk.id = "btn-ok";
        btnOk.classList.add("btn");
        btnOk.textContent = "OK";
        overlayConfirm.querySelector(".confirm-window").appendChild(btnOk);
    }

    btnOk.style.display = "inline-block";
    overlayConfirm.classList.remove("hidden");

    btnOk.onclick = () => {
        overlayConfirm.classList.add("hidden");
        btnOk.style.display = "none";
        if (onClose) onClose();
    };
}

/* =====================================================
   JOURNAL
===================================================== */

// Fonction pour sauvegarder le contenu des deux journaux
function saveJournal() {
    const logList = document.getElementById("log-list");
    const logList2 = document.getElementById("log-list2");

    if (logList) {
        localStorage.setItem("journalContent", logList.innerHTML);
    }

    if (logList2) {
        localStorage.setItem("journalContent2", logList2.innerHTML);
    }
}

// Fonction pour restaurer le contenu des deux journaux
function restoreJournal() {
    const journal = localStorage.getItem("journalContent");
    const journal2 = localStorage.getItem("journalContent2");
    const logList = document.getElementById("log-list");
    const logList2 = document.getElementById("log-list2");

    if (logList) {
        logList.innerHTML = journal || "";
    }

    if (logList2) {
        logList2.innerHTML = journal2 || "";
    }
}

// Fonction pour ajouter une entrée à un journal spécifique
function addLogEntry(html, logId = 'log-list') {
    const logList = document.getElementById(logId);
    if (!logList) {
        console.error(`Journal avec l'ID ${logId} introuvable`);
        return;
    }

    logList.insertAdjacentHTML("afterbegin", html);
    saveJournal();
}

// Fonction pour initialiser les journaux
function initJournals() {
    const logList = document.getElementById("log-list");
    const logList2 = document.getElementById("log-list2");

    if (logList) {
        logList.innerHTML = localStorage.getItem("journalContent") || "";
        addLogEntry("<p class='log-system'>📖 Journal réinitialisé.</p>", 'log-list');
    }

    if (logList2) {
        logList2.innerHTML = localStorage.getItem("journalContent2") || "";
        addLogEntry("<p class='log-system'>📖 Deuxième journal réinitialisé.</p>", 'log-list2');
    }
}


/* =====================================================
   SAUVEGARDE COMPLÈTE
===================================================== */

function saveGame() {
    askConfirm("Voulez-vous sauvegarder votre partie ?", () => {
        const saveData = {};

        // ✅ On sauvegarde le player actuel en mémoire
        localStorage.setItem("playerData", JSON.stringify(player));

        // ✅ On copie tout sauf fullGameSave
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key === "fullGameSave" || key === "justReset") continue;
            if (key === "player") continue;

            saveData[key] = localStorage.getItem(key);
        }

        localStorage.setItem("fullGameSave", JSON.stringify(saveData));

        addLogEntry("<p class='log-system'>💾 Sauvegarde effectuée.</p>");
        addLogEntry("<p class='log-system'>💾 Sauvegarde effectuée.</p>", 'log-list2');
    });
}

document.getElementById("btn-save")?.addEventListener("click", saveGame);

/* =====================================================
   CHARGEMENT DE SAUVEGARDE
===================================================== */

function loadGame() {
    // Récupération de la sauvegarde
    const rawSave = localStorage.getItem("fullGameSave");

    // Vérification de l'existence de la sauvegarde
    if (!rawSave) {
        askAlert("🦉 Aucun grimoire trouvé.\n\nAucune sauvegarde détectée.");
        return;
    }

    // Parsing de la sauvegarde
    let saveData;
    try {
        saveData = JSON.parse(rawSave);
    } catch (e) {
        askAlert("🦉 Sauvegarde corrompue.\n\nImpossible de charger.");
        return;
    }

    // Confirmation avant chargement
    askConfirm("Voulez-vous charger la sauvegarde ?", () => {
        // Désactivation des contrôles pendant le chargement
        isLoadingGame = true;
        keyboardEnabled = false;

        // Fermeture des overlays ouverts
        document.querySelectorAll(".overlay.visible:not(#overlay-confirm)")
            .forEach(o => o.classList.remove("visible"));

        // =============================================
        // Étape 1 : Nettoyage du localStorage
        // =============================================
        for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key !== "fullGameSave") {
                localStorage.removeItem(key);
            }
        }

        // =============================================
        // Étape 2 : Restauration des données
        // =============================================
        for (const key in saveData) {
            localStorage.setItem(key, saveData[key]);
        }

        // =============================================
        // Étape 3 : Reconstruction du joueur
        // =============================================
        const savedPlayer = saveData.playerData;

        if (savedPlayer) {
            player = JSON.parse(savedPlayer);
        } else {
            console.warn("Aucun player trouvé dans la sauvegarde.");
        }

        // =============================================
        // Étape 4 : Restauration des journaux
        // =============================================
        restoreJournal();

        // =============================================
        // Étape 5 : Chargement de l'écran
        // =============================================
        const lastScreen = saveData.lastScreen || "Ecran0001";
        if (typeof loadScreen === "function") {
            loadScreen(lastScreen, { fromLoad: true });
        } else {
            console.error("La fonction loadScreen n'est pas définie.");
        }

        // =============================================
        // Étape 6 : Rafraîchissement de l'interface
        // =============================================
        setTimeout(() => {
            if (typeof updatePlayerDisplay === "function") {
                updatePlayerDisplay();
            }

            if (typeof updateInventoryDisplay === "function") {
                updateInventoryDisplay();
            }

            // Réactivation des contrôles après chargement
            isLoadingGame = false;
            keyboardEnabled = true;
        }, 50);

        // Ajout des messages de journal
        addLogEntry("<p class='log-system'>📂 Sauvegarde chargée.</p>");
        addLogEntry("<p class='log-system'>📂 Sauvegarde chargée.</p>", 'log-list2');
    });
}

// Ajout du gestionnaire d'événement pour le bouton de chargement
document.getElementById("btn-load")?.addEventListener("click", loadGame);


/* =====================================================
   RESET COMPLET
===================================================== */

function resetGame() {
    askConfirm(
        "⚠️ Cette action supprimera définitivement la partie.\n\nConfirmer ?",
        () => {
            localStorage.clear();
            localStorage.setItem("justReset", "1");

            // ✅ Réinitialise le player en mémoire
            player = {
                nom: "Seedborne",
                race: "Elfe",
                force: 6,
                intelligence: 5,
                agilite: 8,
                constitution: 3,
                folie: 12,
                inventory: [],
                characters: [],
                flags: {}
            };

            // Réinitialise les deux journaux
            const logList = document.getElementById("log-list");
            const logList2 = document.getElementById("log-list2");

            if (logList) logList.innerHTML = "";
            if (logList2) logList2.innerHTML = "";

            // Ajout de messages de démarrage
            addLogEntry("<p class='log-system'>📖 Journal principal réinitialisé.</p>");
            addLogEntry("<p class='log-system'>📖 Deuxième journal réinitialisé.</p>", 'log-list2');

            startCharacterCreation();
        }
    );
}

// Initialisation des journaux au chargement de la page
document.addEventListener("DOMContentLoaded", initJournals);


/* =====================================================
   BOUTONS MOBILE (menu latéral mobile)
===================================================== */

document.getElementById("btn-save-mob")?.addEventListener("click", saveGame);
document.getElementById("btn-load-mob")?.addEventListener("click", loadGame);
document.getElementById("btn-reset-mob")?.addEventListener("click", resetGame);

/* =====================================================
   BOUTON AIDE
===================================================== */

document.getElementById("btn-help")?.addEventListener("click", () => {
    const panel = document.getElementById("help-panel");
    if (panel) panel.classList.toggle("visible");
});

document.getElementById("btn-help-mob")?.addEventListener("click", () => {
    const panel = document.getElementById("help-panel");
    if (panel) panel.classList.toggle("visible");
});

