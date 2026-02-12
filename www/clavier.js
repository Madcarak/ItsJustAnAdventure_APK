/****************************************************
 *      CONFIG CLAVIER — VERSION UNIFIÉE & PROPRE
 ****************************************************/
console.log("CLAVIER.JS CHARGÉ !");
let keyboardEnabled = false;

/* Debug */
setInterval(() => console.log("keyboardEnabled =", keyboardEnabled), 400);


/****************************************************
 *   UTILS COMMUNS
 ****************************************************/
function isCharCreationActive() {
    const overlay = document.getElementById("char-creation-overlay");
    const activeStep = overlay?.querySelector(".step.active");
    return overlay && !overlay.classList.contains("hidden") && activeStep;
}

function isConfirmVisible() {
    const overlay = document.getElementById("overlay-confirm");
    return overlay && !overlay.classList.contains("hidden");
}

function isHelpVisible() {
    const help = document.getElementById("help-box");
    return help && !help.classList.contains("hidden");
}


/****************************************************
 *   1) CLAVIER — CRÉATION PERSONNAGE
 ****************************************************/
document.addEventListener("keydown", (e) => {

    if (!isCharCreationActive()) return;

    const key = e.key.toLowerCase();
    const overlay = document.getElementById("char-creation-overlay");
    const activeStep = overlay.querySelector(".step.active");

    const btnYes = activeStep.querySelector("#overwrite-yes");
    const btnNo  = activeStep.querySelector("#overwrite-no");

    if (key === "o" && btnYes) {
        btnYes.click();
        e.preventDefault();
    }

    if (key === "n" && btnNo) {
        btnNo.click();
        e.preventDefault();
    }
});


/****************************************************
 *   2) CLAVIER — CONFIRMATION GLOBALE
 ****************************************************/
document.addEventListener("keydown", (e) => {

    if (!isConfirmVisible()) return;

    const key = e.key.toLowerCase();

    if (key === "o") {
        document.getElementById("btn-yes")?.click();
        e.preventDefault();
    }

    if (key === "n") {
        document.getElementById("btn-no")?.click();
        e.preventDefault();
    }
});


/****************************************************
 *   3) CLAVIER — MODE JEU
 ****************************************************/
document.addEventListener("keydown", (e) => {

    if (isCharCreationActive()) return;
    if (isConfirmVisible()) return;
    if (isHelpVisible()) return;  // important
    if (!keyboardEnabled || isLoadingGame) return;

    if (!musicStarted) {
        musicStarted = true;
        forestMusic.play().catch(() => {});
    }

    const key = e.key.toLowerCase();

    // Choix 1–4
    if (["1","2","3","4"].includes(e.key)) {
        const index = Number(e.key) - 1;
        const choices = document.querySelectorAll("#choices-container .choix-item");
        if (choices[index]) choices[index].click();
        e.preventDefault();
        return;
    }

    // Espace = plein texte
    if (e.key === " ") {
        showFullText();
        e.preventDefault();
        return;
    }

    // 5 = mute
    if (e.key === "5") {
        globalMute = !globalMute;
        refreshAudioSettings();
        addLogEntry(`<p class='log-system'>🎵 Son ${globalMute ? "désactivé" : "activé"}.</p>`);
        e.preventDefault();
        return;
    }

    // S, C, R
    if (key === "s") { document.getElementById("btn-save")?.click(); return; }
    if (key === "c") { document.getElementById("btn-load")?.click(); return; }
    if (key === "r") { document.getElementById("btn-reset")?.click(); return; }
	if (key === "a") { document.getElementById("btn-help")?.click(); return; }

    // Menu mobile
    if (key === "m") {
        document.querySelector(".side-menu")?.classList.toggle("open");
        e.preventDefault();
        return;
    }
});


/****************************************************
 *   4) AIDE CLAVIER
 ****************************************************/
document.getElementById("btn-help")?.addEventListener("click", () => {
    document.getElementById("help-box").classList.remove("hidden");
    keyboardEnabled = false;
});

document.getElementById("help-close")?.addEventListener("click", () => {
    document.getElementById("help-box").classList.add("hidden");
    setTimeout(() => keyboardEnabled = true, 50);
});

/****************************************************
 *   4) MENU MOBILE
 ****************************************************/

document.addEventListener("DOMContentLoaded", () => {
  const menu = document.querySelector(".side-menu");
  const btn = document.querySelector(".mobile-menu-button");
  const close = document.querySelector(".side-close");
  const overlay = document.getElementById("menu-overlay");

  if (!menu || !btn || !close || !overlay) return;

  btn.onclick = () => {
    menu.classList.add("open");
    overlay.style.display = "block";
  };

  close.onclick = () => {
    menu.classList.remove("open");
    overlay.style.display = "none";
  };

  overlay.onclick = () => {
    menu.classList.remove("open");
    overlay.style.display = "none";
  };
});



