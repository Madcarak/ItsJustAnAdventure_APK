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

function saveJournal() {
    const logList = document.getElementById("log-list");
    if (logList) {
        localStorage.setItem("journalContent", logList.innerHTML);
    }
}

function restoreJournal() {
    const journal = localStorage.getItem("journalContent");
    const logList = document.getElementById("log-list");

    if (logList) {
        logList.innerHTML = journal || "";
    }
}

function addLogEntry(html) {
    const logList = document.getElementById("log-list");
    if (!logList) return;

    logList.insertAdjacentHTML("afterbegin", html);
    saveJournal();
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
    });
}

document.getElementById("btn-save")?.addEventListener("click", saveGame);

/* =====================================================
   CHARGEMENT COMPLET
===================================================== */

function loadGame() {

    const rawSave = localStorage.getItem("fullGameSave");

    if (!rawSave) {
        askAlert("🦉 Aucun grimoire trouvé.\n\nAucune sauvegarde détectée.");
        return;
    }

    let saveData;

    try {
        saveData = JSON.parse(rawSave);
    } catch (e) {
        askAlert("🦉 Sauvegarde corrompue.\n\nImpossible de charger.");
        return;
    }

    askConfirm("Voulez-vous charger la sauvegarde ?", () => {

        isLoadingGame = true;
        keyboardEnabled = false;

        // ✅ Ferme tous les overlays sauf confirm
        document.querySelectorAll(".overlay.visible:not(#overlay-confirm)")
            .forEach(o => o.classList.remove("visible"));

        /* -------------------------
           1️⃣ Nettoyage complet
        -------------------------- */

        // ✅ Nettoyage SANS supprimer fullGameSave
		for (let i = localStorage.length - 1; i >= 0; i--) {
		const key = localStorage.key(i);
		if (key !== "fullGameSave") {
			localStorage.removeItem(key);
			}
		}

        /* -------------------------
           2️⃣ Restauration
        -------------------------- */

        for (const key in saveData) {
            localStorage.setItem(key, saveData[key]);
        }

        /* -------------------------
           3️⃣ Reconstruction player
        -------------------------- */

        const savedPlayer = saveData.playerData;

		if (savedPlayer) {
			player = JSON.parse(savedPlayer);
		} else {
			console.warn("Aucun player trouvé dans la sauvegarde.");
		}


        /* -------------------------
           4️⃣ Journal
        -------------------------- */

        restoreJournal();

        /* -------------------------
           5️⃣ Chargement écran
        -------------------------- */

        const lastScreen = saveData.lastScreen || "Ecran0001";
        loadScreen(lastScreen, { fromLoad: true });

        /* -------------------------
           6️⃣ Rafraîchissement UI
        -------------------------- */

        setTimeout(() => {

            if (typeof updatePlayerDisplay === "function")
                updatePlayerDisplay();

            if (typeof updateInventoryDisplay === "function")
                updateInventoryDisplay();

            isLoadingGame = false;
            keyboardEnabled = true;

        }, 50);

        addLogEntry("<p class='log-system'>📂 Sauvegarde chargée.</p>");
    });
}

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

            const logList = document.getElementById("log-list");
            if (logList) logList.innerHTML = "";

            startCharacterCreation();
        }
    );
}

document.getElementById("btn-reset")?.addEventListener("click", resetGame);
