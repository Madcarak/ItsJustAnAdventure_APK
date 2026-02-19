let player = {
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
let textIsAnimating = false;
let currentTextAnimation = null;
let isLoadingGame = false
let overlay;

/* =====================================================
   ONCE FLAG
===================================================== */
function onceFlag(flagName) {
    if (!player.flags) player.flags = {};
    player.flags[flagName] = true;
    savePlayer();
}

/* =====================================================
   SAVEPLAYER EXPLOSION OBJETS INVENTAIRE
===================================================== */
window.savePlayer = function () {
    if (!player) return;
    localStorage.setItem("playerData", JSON.stringify(player));
};

/* =====================================================
   INITIALISATION
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    // ✅ Recharge joueur si existe
    const savedPlayer = localStorage.getItem("playerData");
    if (savedPlayer) {
        player = JSON.parse(savedPlayer);
    }

    // ✅ Restaure le journal
    if (typeof restoreJournal === "function") {
        restoreJournal();
    }

    // ✅ Met à jour affichage
    updatePlayerDisplay();
});

// Recharge le joueur si sauvegardé
if (localStorage.getItem("playerData")) {
    player = JSON.parse(localStorage.getItem("playerData"));
	if (!player.flags) player.flags = {}; // ✅ sécurité
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function hasFullSave() {
    return localStorage.getItem("fullGameSave") !== null;
}

function hasItem(itemName) {
    return player.inventory.includes(itemName);
}

function hasFlag(flag) {
    return !!player.flags[flag];
}

function setFlag(flag) {
    player.flags[flag] = true;
    savePlayer();
}

/* -----------------------------------------------------
        AJOUTER UN OBJET DE L'INVENTAIRE
------------------------------------------------------ */

function addItem(item) {
    if (!player.inventory.includes(item)) {
        player.inventory.push(item);
        savePlayer();

        // Log ajout (optionnel)
        const desc = itemDescriptions[item] || "Aucune description.";
        addLogEntry(
            `<p><span class="log-tag log-add">[Nouvel objet]</span> ${item} : ${desc}</p>`
        );

        updateInventoryDisplay();
    }
}



/* =====================================================
      DIALOGUES FANTASY (ROTATION AUTOMATIQUE)
===================================================== */

const fantasyDialogs = {
    name_missing: [
        "Et ben alors… je ne vois ici aucun nom émerger. TU dois en choisir un.",
        "Même les héros de bas étage ont un nom. Quel sera le tien ?",
        "J’ai l’impression que tu ne veux pas entrer dans la légende… écris ton nom, voyageur.",
        "Les runes restent vides… Ton nom, tu dois le remplir !",
        "Version pour les orques pas très intelligents : TOI METTRE NOM DANS CASE."
    ],

    race_humain: [
        "Un Humain ? Adaptation exemplaire… mais vie assez courte !",
        "Le sang des Hommes coule dans tes veines : imprévisible et dangereux."
    ],

    race_elfe: [
        "Un Elfe… Les vents murmurent déjà ton arrivée entre les arbres.",
        "Tu choisis la voie des Elfes : finesse, savoir et fierté ancienne."
    ],

    race_nain: [
        "Solide comme la pierre, buté comme une enclume et puissant comme un marteau.",
        "Les profondeurs des montagnes t’appellent, un destin dur comme le roc."
    ],

    sex_homme: [
        "Un homme prêt à tracer son chemin… dommage qu’il ne pense qu’avec sa ****.",
        "Mmmh, virilité !"
    ],

    sex_femme: [
        "Une femme au regard déterminé… ne te laisse pas submerger par tes émotions.",
        "Grâce et volupté… mais n’oublie pas ce que les hommes pensent de toi."
    ],

    roll_result: [
        "Les Dieux ont décidé… Ont-ils eu raison ?",
        "Le destin a rendu son verdict.",
        "Les astres te sourient ! Oui… ou non ?",
        "Les esprits sont généreux aujourd’hui.",
        "Mystique… mais tu peux relancer.",
        "Même les plus grands sont passés par là !"
    ],

    summary: [
        "Que ton chemin soit glorieux… laisse-toi porter par l’histoire.",
        "Le monde t’attend, héros. Va donc vivre ta vie…",
        "Que la folie ne t’atteigne pas dans ce monde."
    ]
};

// mémorise l’index pour chaque catégorie
const dialogIndex = {};

function getFantasyLine(category) {
    if (!fantasyDialogs[category]) return "";

    if (!dialogIndex[category]) dialogIndex[category] = 0;

    const list = fantasyDialogs[category];
    const line = list[dialogIndex[category]];

    // rotation
    dialogIndex[category] = (dialogIndex[category] + 1) % list.length;

    return line;
}


// Bouton Reset
document.getElementById("btn-reset")?.addEventListener("click", resetGame);
/* -----------------------------------------------------
       DÉMARRAGE DU JEU
------------------------------------------------------ */

// Lance le menu / création de personnage
function startCharacterCreation() {
    if (!overlay) {
        console.error("Overlay de création introuvable");
        return;
    }

    overlay.classList.remove("hidden");
    overlay.classList.add("visible");

    showStep(stepMenu);
    keyboardEnabled = true;
    forestMusic.muted = true;
}


// Vérifie s'il existe une sauvegarde
function saveExists() {
    return hasFullSave();
}
// --------------------------------------------------
// CHARGEMENT AU DÉMARRAGE
// --------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {

    overlay = document.getElementById("char-creation-overlay");

    const hasResetFlag   = localStorage.getItem("justReset") === "1";
    const hasFullSave    = localStorage.getItem("fullGameSave") !== null;
    const hasPlayerData  = localStorage.getItem("playerData") !== null;

    // ✅ 1️⃣ RESET → menu forcé
    if (hasResetFlag) {
        localStorage.removeItem("justReset");
        startCharacterCreation();
        return;
    }

    // ✅ 2️⃣ Sauvegarde complète existante MAIS aucun player actif
    if (hasFullSave && !hasPlayerData) {

        askConfirm(
            "Une sauvegarde complète a été trouvée. Voulez-vous la charger ?",
            () => {

                document.querySelectorAll(".overlay.visible")
                    .forEach(o => o.classList.remove("visible"));

                keyboardEnabled = true;
                isLoadingGame = true;

                const rawSave = localStorage.getItem("fullGameSave");
                let loadedData;

                try {
                    loadedData = JSON.parse(rawSave);
                } catch (e) {
                    console.error("Sauvegarde corrompue.");
                    isLoadingGame = false;
                    return;
                }

                // ✅ Nettoyage SANS supprimer fullGameSave
                for (let i = localStorage.length - 1; i >= 0; i--) {
                    const key = localStorage.key(i);
                    if (key !== "fullGameSave") {
                        localStorage.removeItem(key);
                    }
                }

                // ✅ Restauration
                for (const key in loadedData) {
                    localStorage.setItem(key, loadedData[key]);
                }

                // ✅ Reconstruction player
                const restoredPlayer = localStorage.getItem("playerData");
                if (restoredPlayer) {
                    player = JSON.parse(restoredPlayer);
                }

                // ✅ Journal
                const logList = document.getElementById("log-list");
                if (logList) logList.innerHTML = "";
                restoreJournal();

                // ✅ Écran
                const lastScreenId =
                    localStorage.getItem("lastScreen") || "Ecran0001";

                loadScreen(lastScreenId);

                // ✅ Rafraîchissement UI
                setTimeout(() => {
                    if (typeof updatePlayerDisplay === "function")
                        updatePlayerDisplay();

                    if (typeof updateInventoryDisplay === "function")
                        updateInventoryDisplay();

                    isLoadingGame = false;
                    keyboardEnabled = true;

                }, 50);

                addLogEntry("<p class='log-system'>📂 Sauvegarde complète chargée.</p>");
            }
        );

        return;
    }

    // ✅ 3️⃣ Aucune sauvegarde ET aucun joueur → création
    if (!hasFullSave && !hasPlayerData) {
        startCharacterCreation();
        return;
    }

    // ✅ 4️⃣ Player déjà actif → NE RIEN FAIRE
    // (partie déjà chargée automatiquement via playerData)
});

    // --------------------------------------------------
    // BOUTONS MENU
    // --------------------------------------------------
    document.getElementById("btn-load-game")?.addEventListener("click", () => {
        document.getElementById("btn-load")?.click();
    });

    document.getElementById("btn-new-game")?.addEventListener("click", () => {
        if (hasFullSave()) {
    showStep(stepOverwrite);
} else {
    showStep(stepName);
}

});

/* =====================================================
      SYSTÈME DE CRÉATION DE PERSONNAGE
===================================================== */

// Étapes
const stepMenu     = document.getElementById("step-menu");
const stepOverwrite = document.getElementById("step-overwrite");
const stepName     = document.getElementById("step-name");
const stepRace     = document.getElementById("step-race");
const stepSex      = document.getElementById("step-sex");
const stepPortrait = document.getElementById("step-portrait");
const stepRoll     = document.getElementById("step-roll");
const stepSummary  = document.getElementById("step-summary");

// Bouton pour passer à la race
document.querySelector('#step-name .next-btn').onclick = () => {

    const nameField = document.getElementById("char-name");
    const name = nameField.value.trim();

    if (name === "") {
        // Phrase fantasy
        document.getElementById("name-alert-text").textContent =
            getFantasyLine("name_missing");

        document.getElementById("name-alert").classList.remove("hidden");
        return;
    }

    showStep(stepRace);
};

document.querySelectorAll(".next-btn").forEach(btn => {

    // On ignore nom + sexe + portrait (gérés manuellement)
    if (
        btn.closest("#step-name") ||
        btn.closest("#step-sex") ||
        btn.closest("#step-portrait")
    ) return;

    btn.onclick = () => {
        const nextId = btn.dataset.next;
        showStep(document.getElementById(nextId));
    };
});


document.getElementById("name-alert-ok").onclick = () => {
    document.getElementById("name-alert").classList.add("hidden");
    document.getElementById("char-name").focus();
};

document.getElementById("summary-dialog").textContent =
    getFantasyLine("summary");

// Quand on clique sur "Commencer l'aventure"
document.getElementById("btn-start-game").addEventListener("click", () => {

    // Récupération des données du résumé
    const img = document.getElementById("summary-image").src;
    const name = document.getElementById("sum-name").textContent;
    const race = document.getElementById("sum-race").textContent;
    const sex = document.getElementById("sum-sex").textContent;

    const forVal = document.getElementById("sum-for").textContent;
    const intVal = document.getElementById("sum-int").textContent;
    const agiVal = document.getElementById("sum-agi").textContent;
    const conVal = document.getElementById("sum-con").textContent;
	const folieVal = document.getElementById("sum-folie").textContent;

    // Mise à jour portrait
    document.getElementById("portrait-mobile").src = img;
    document.getElementById("portrait-pc").src = img;

    // Mise à jour infos (mobile)
    document.getElementById("char-name-mobile").textContent = name;
    document.getElementById("char-race-mobile").textContent = capitalize(race);
	document.getElementById("char-sexe-mobile").textContent = capitalize(sex);
    document.getElementById("char-for-mobile").textContent = forVal;
    document.getElementById("char-int-mobile").textContent = intVal;
    document.getElementById("char-agi-mobile").textContent = agiVal;
    document.getElementById("char-con-mobile").textContent = conVal;
	
	const folieMax = 15;
const folieCurrent = parseInt(folieVal);

const bar = document.getElementById("folie-bar-mobile");
const text = document.getElementById("folie-value-mobile");

if (bar && text) {
    const percent = (folieCurrent / folieMax) * 100;
    bar.style.width = percent + "%";
    text.textContent = `${folieCurrent}/${folieMax}`;
}

    // Mise à jour infos (pc)
    document.getElementById("char-name-pc").textContent = name;
    document.getElementById("char-race-pc").textContent = capitalize(race);
	document.getElementById("char-sexe-pc").textContent = capitalize(sex);
    document.getElementById("char-for-pc").textContent = forVal;
    document.getElementById("char-int-pc").textContent = intVal;
    document.getElementById("char-agi-pc").textContent = agiVal;
    document.getElementById("char-con-pc").textContent = conVal;
	document.getElementById("char-folie-pc").textContent = folieVal;

    // Fermeture de la fenêtre de création
    document.getElementById("char-creation-overlay").classList.remove("visible");

});

document.getElementById("btn-new-game").onclick = () => {

    if (saveExists()) {
        showStep(stepOverwrite);
    } else {
        showStep(stepName);
    }
};

document.getElementById("overwrite-yes").onclick = () => {
    localStorage.clear();
    showStep(stepName);
};

document.getElementById("overwrite-no").onclick = () => {
    showStep(stepMenu);
};

/* =====================================================
      ÉTAPE : NOM DU PERSONNAGE
===================================================== */

function showStep(step) {
    document.querySelectorAll(".step").forEach(s => s.classList.remove("active"));
    step.classList.add("active");

    // Gestion du clavier
    if (step === stepName) {
        keyboardEnabled = false; // bloqué pendant le nom
    } else {
        keyboardEnabled = true;  // débloqué pour les autres
    }
}

/* =====================================================
      ÉTAPE : RACE + BONUS AFFICHÉS
===================================================== */

const raceSelect = document.getElementById("char-race");

const raceBonus = {
    humain: { for:0, int:0, agi:0, con:0 },
    elfe:   { for:-1, int:+2, agi:0,  con:-1 },
    nain:   { for:+1, int:0,  agi:-2, con:+1 }
};

function updateRaceBonus() {
    const r = raceSelect.value;
    const b = raceBonus[r];

    // Bonus affichés
    document.querySelector(".bonus-for").textContent = "FOR : " + formatBonus(b.for);
    document.querySelector(".bonus-int").textContent = "INT : " + formatBonus(b.int);
    document.querySelector(".bonus-agi").textContent = "AGI : " + formatBonus(b.agi);
    document.querySelector(".bonus-con").textContent = "CON : " + formatBonus(b.con);
}

function formatBonus(x) {
    if (x > 0) return "+" + x;
    if (x < 0) return x.toString();
    return "0";
}

raceSelect.onchange = updateRaceBonus;
updateRaceBonus();

raceSelect.onchange = () => {
    updateRaceBonus();

    const dialog = getFantasyLine("race_" + raceSelect.value);
    document.getElementById("race-dialog").textContent = dialog;
};

document.querySelector('#step-sex .next-btn').onclick = () => {

    const selectedSex = document.getElementById("char-sex").value;
    const selectedRace = raceSelect.value;

    document.getElementById("sex-dialog").textContent =
        getFantasyLine("sex_" + selectedSex);

    loadPortraitChoices(selectedRace, selectedSex);

    showStep(stepPortrait);
};



/* =====================================================
      ÉTAPE : TIRAGE DES CARACTÉRISTIQUES
===================================================== */

const rollFor = document.getElementById("roll-for");
const rollInt = document.getElementById("roll-int");
const rollAgi = document.getElementById("roll-agi");
const rollCon = document.getElementById("roll-con");

function rollStatWithAnimation(displayElement, callback) {
    let interval;
    let duration = 700; 
    let elapsed = 0;

    interval = setInterval(() => {
        displayElement.textContent = Math.floor(Math.random() * 5) + 1;
    }, 60);

    setTimeout(() => {
        clearInterval(interval);

        const realValue = rollStat();
        displayElement.textContent = realValue;

        displayElement.style.transition = "0.2s";
        displayElement.style.color = "#3aff4f";
        displayElement.style.fontWeight = "bold";

        setTimeout(() => {
            displayElement.style.color = "";
            displayElement.style.fontWeight = "";
        }, 250);

        if (callback) callback(realValue);

    }, duration);
}

function rollStat() {
    const r = Math.random();

    if (r < 0.30) return 1;
    if (r < 0.55) return 2;
    if (r < 0.75) return 3;
    if (r < 0.90) return 4;
    return 5;
}

const diceSound = new Audio("sons/de.mp3");

function doRoll() {
    diceSound.currentTime = 0;
    diceSound.play().catch(()=>{});

    rollFor.textContent = rollStat();
    rollInt.textContent = rollStat();
    rollAgi.textContent = rollStat();
    rollCon.textContent = rollStat();
}

document.getElementById("roll-dialog").textContent =
    getFantasyLine("roll_result");
    
document.getElementById("btn-roll-dice").onclick = doRoll;
doRoll();

/* =====================================================
      ÉTAPE : CHOIX PORTRAIT
===================================================== */

let selectedPortrait = null;

const portraitDatabase = {
    elfe: {
        femme: [
            "01_elfe_femme.png",
            "02_elfe_femme.png",
            "03_elfe_femme.png",
            "04_elfe_femme.png"
        ],
	
		homme: [
            "01_elfe_homme.png",
            "02_elfe_homme.png",
            "03_elfe_homme.png",
            "04_elfe_homme.png"
        ],
    },
	nain: {
        femme: [
            "01_nain_femme.png",
            "02_nain_femme.png",
            "03_nain_femme.png",
            "04_nain_femme.png"
        ],
	
		homme: [
            "01_nain_homme.png",
            "02_nain_homme.png",
            "03_nain_homme.png",
            "04_nain_homme.png"
        ],
    },
	humain: {
        femme: [
            "01_humain_femme.png",
            "02_humain_femme.png",
            "03_humain_femme.png",
            "04_humain_femme.png"
        ],
	
		homme: [
            "01_humain_homme.png",
            "02_humain_homme.png",
            "03_humain_homme.png",
            "04_humain_homme.png"
        ]
    },
};

function loadPortraitChoices(race, sex) {

    const container = document.getElementById("portrait-choices");
    container.innerHTML = "";
    selectedPortrait = null;

    if (!portraitDatabase[race] || !portraitDatabase[race][sex]) {
        container.innerHTML = "<p>Aucun portrait disponible.</p>";
        return;
    }

    portraitDatabase[race][sex].forEach(file => {

        const fullPath = `Races/${file}`;

        const div = document.createElement("div");
        div.classList.add("portrait-choice");

        const img = document.createElement("img");
        img.src = fullPath;

        div.appendChild(img);

        div.onclick = () => {

            document.querySelectorAll(".portrait-choice")
                .forEach(p => p.classList.remove("selected"));

            div.classList.add("selected");
            selectedPortrait = fullPath;
        };

        container.appendChild(div);
    });
}


document.querySelector('#step-portrait .next-btn').onclick = () => {

    if (!selectedPortrait) {
        alert("Choisissez un portrait.");
        return;
    }

    showStep(stepRoll);
};



/* =====================================================
      AJOUT — FONCTIONS HUD
===================================================== */

function updateFolieBar(value) {
    const max = 15;
    const percent = (value / max) * 100;

    const bar = document.getElementById("folie-bar");
    const val = document.getElementById("hud-folie-val");

    if (bar)
        bar.style.width = percent + "%";

    if (val)
        val.textContent = value + " / " + max;
}

function updateFolieBarMobile(value) {
    const max = 15;
    const percent = (value / max) * 100;

    const barMobile = document.getElementById("folie-bar-mobile");
    const valMobile = document.getElementById("folie-value-mobile"); // ✅ NOUVEAU

    if (barMobile)
        barMobile.style.width = percent + "%";

    if (valMobile)
        valMobile.textContent = value + " / " + max; // ✅ AJOUT
}

function updateGoldUI(value) {
    const goldPC = document.getElementById("hud-gold");
    const goldMobile = document.getElementById("hud-gold-mobile");

    if (goldPC)
        goldPC.textContent = value;

    if (goldMobile)
        goldMobile.textContent = value;
}

function triggerFolieEffect(type) {

    const portraits = [
        document.getElementById("portrait-mobile"),
        document.getElementById("portrait-pc")
    ];

    const soundUp = document.getElementById("sound-folie-up");
    const soundDown = document.getElementById("sound-folie-down");

    /* ===============================
       ✅ EFFET PORTRAIT
    =============================== */

    portraits.forEach(portrait => {
        if (!portrait) return;

        portrait.classList.remove("folie-up", "folie-down");
        void portrait.offsetWidth;

        if (type === "up") {
            portrait.classList.add("folie-up");
        } else if (type === "down") {
            portrait.classList.add("folie-down");
        }
    });

    /* ===============================
       ✅ EFFET ÉCRAN
    =============================== */

    const overlay = document.createElement("div");
    overlay.classList.add("folie-overlay", type);

if (type === "up") {

    const maxRadius = Math.max(window.innerWidth, window.innerHeight);

    const intensity = (player.folie / 15); // 0 → 1 à 10 de folie

    overlay.style.boxShadow =
        `inset 0 0 ${maxRadius * intensity * 0.6}px rgba(255,0,0,0.9)`;
}

overlay.style.background = `rgba(120,0,0,${0.05 * player.folie})`;


    document.body.appendChild(overlay);

    setTimeout(() => {
        overlay.remove();
    }, 3000);

    /* ===============================
       ✅ SON
    =============================== */

    if (type === "up" && soundUp) {
        soundUp.currentTime = 0;
        soundUp.play().catch(() => {});
    }

    if (type === "down" && soundDown) {
        soundDown.currentTime = 0;
        soundDown.play().catch(() => {});
    }
}

const madnessSound = new Audio("sons/madness.mp3");
madnessSound.volume = 0.4; // ajuste si besoin


function applyFolieVariant(originalData) {

    if (!originalData.folieVariants) {
        return originalData;
    }

    const data = { ...originalData };

    const thresholds = Object.keys(originalData.folieVariants)
        .map(Number)
        .sort((a, b) => a - b);

    let activeVariant = null;

    for (const threshold of thresholds) {
        if (player.folie >= threshold) {
            activeVariant = originalData.folieVariants[threshold];
        }
    }

    if (activeVariant) {

        if (activeVariant.texte !== undefined) {
            data.texte = activeVariant.texte;
        }
        if (activeVariant.image !== undefined) {
            data.image = activeVariant.image;
        }
        if (activeVariant.titre !== undefined) {
            data.titre = activeVariant.titre;
        }

        // 🔊 Joue le son UNE FOIS
        if (madnessSound) {
            madnessSound.currentTime = 0;
            madnessSound.play().catch(() => {});
        }
    }

    return data;
}




function updateImage(baseSrc, overlaySrc) {

    const base = document.getElementById("screenImageBase");
    const overlay = document.getElementById("screenImageOverlay");

    // Sécurité
    if (!base || !overlay) return;

    // Reset
    overlay.style.transition = "none";
    overlay.style.opacity = 0;

    // Charge l’image normale
    base.src = baseSrc;

    // Si pas de variante → stop
    if (baseSrc === overlaySrc) {
        overlay.src = "";
        return;
    }

    // Charge image distordue
    overlay.src = overlaySrc;

    // Petit délai pour forcer le reflow
    setTimeout(() => {
        overlay.style.transition = "opacity 2s ease-in-out";
        overlay.style.opacity = 1;
    }, 50);
}



/* =====================================================
      ÉTAPE : RÉSUMÉ FINAL
===================================================== */

document.getElementById("btn-validate-roll").onclick = () => {

    const name = document.getElementById("char-name").value.trim();
    const race = raceSelect.value;
    const sex  = document.getElementById("char-sex").value;

    if (!name) {
        alert("Vous devez entrer un nom.");
        return;
    }

    const base = { for:5, int:5, agi:5, con:5, fol:0 };
    const bonus = raceBonus[race];

    const roll = {
        for: parseInt(rollFor.textContent),
        int: parseInt(rollInt.textContent),
        agi: parseInt(rollAgi.textContent),
        con: parseInt(rollCon.textContent),
    };

    const total = {
        for: base.for + bonus.for + roll.for,
        int: base.int + bonus.int + roll.int,
        agi: base.agi + bonus.agi + roll.agi,
        con: base.con + bonus.con + roll.con,
        fol: 0
    };

    const img = selectedPortrait || `Races/${race}_${sex}.png`;

    player = {
        nom: name,
        race,
        sexe: sex,
        base,
        bonus,
        roll,
        total,
        image: img,
        inventory: [],
		characters: [],
		flags: {}
    };

    player.force        = total.for;
    player.intelligence = total.int;
    player.agilite      = total.agi;
    player.constitution = total.con;
    player.folie        = 0;

    savePlayer();
	
	/* ✅ AJOUT LOG CREATION */
addLogEntry(
    `<p>
        <span class="log-tag">[Création de Personnage]</span> 
        « Vous voilà lancé dans l’aventure. Bonne chance… vous en aurez besoin. »
     </p>`
);

/* === AJOUT HUD — initialisation === */
updateFolieBar(0);
updateFolieBarMobile(0);
updateGoldUI(player.gold || 20);

if (document.getElementById("hud-name"))
    document.getElementById("hud-name").textContent = name;

if (document.getElementById("hud-race"))
    document.getElementById("hud-race").textContent = capitalize(race);

    /* === FIN AJOUT === */

    document.getElementById("summary-image").src = img;
    document.getElementById("sum-name").textContent = name;
    document.getElementById("sum-race").textContent = capitalize(race);
    document.getElementById("sum-sex").textContent = capitalize(sex);

    document.getElementById("sum-for").textContent = `${total.for} (${formatBonus(bonus.for)})`;
    document.getElementById("sum-int").textContent = `${total.int} (${formatBonus(bonus.int)})`;
    document.getElementById("sum-agi").textContent = `${total.agi} (${formatBonus(bonus.agi)})`;
    document.getElementById("sum-con").textContent = `${total.con} (${formatBonus(bonus.con)})`;

    showStep(stepSummary);
};

function updatePlayerDisplay() {
    if (!player) return;

    // --- Portrait ---
    const portrait = player.portrait || player.image || player.img || ""; 
    if (document.getElementById("portrait-mobile"))
        document.getElementById("portrait-mobile").src = portrait;
    if (document.getElementById("portrait-pc"))
        document.getElementById("portrait-pc").src = portrait;

    // --- Nom & race ---
    const name = player.nom || player.name || "";
    if (document.getElementById("char-name-mobile"))
        document.getElementById("char-name-mobile").textContent = name;
    if (document.getElementById("char-name-pc"))
        document.getElementById("char-name-pc").textContent = name;
    if (document.getElementById("hud-name"))
        document.getElementById("hud-name").textContent = name;

    if (document.getElementById("char-race-mobile"))
        document.getElementById("char-race-mobile").textContent = player.race || "";
    if (document.getElementById("char-race-pc"))
        document.getElementById("char-race-pc").textContent = player.race || "";
    if (document.getElementById("hud-race"))
        document.getElementById("hud-race").textContent = player.race || "";

    // --- Sexe ---
    const sexe = player.sex || player.sexe || "";
    if (document.getElementById("char-sexe-mobile"))
        document.getElementById("char-sexe-mobile").textContent = sexe;
    if (document.getElementById("char-sexe-pc"))
        document.getElementById("char-sexe-pc").textContent = sexe;

    // --- Stats principales ---
    const forVal = player.force ?? player.stats?.for ?? 0;
    const intVal = player.intelligence ?? player.stats?.int ?? 0;
    const agiVal = player.agilite ?? player.stats?.agi ?? 0;
    const conVal = player.constitution ?? player.stats?.con ?? 0;

    const bFor = player.bonus?.for ?? 0;
    const bInt = player.bonus?.int ?? 0;
    const bAgi = player.bonus?.agi ?? 0;
    const bCon = player.bonus?.con ?? 0;

    const fTxt = `${forVal} (${formatBonus(bFor)})`;
    const iTxt = `${intVal} (${formatBonus(bInt)})`;
    const aTxt = `${agiVal} (${formatBonus(bAgi)})`;
    const cTxt = `${conVal} (${formatBonus(bCon)})`;

    // Stats affichage
    if (document.getElementById("char-for-mobile"))
        document.getElementById("char-for-mobile").textContent = fTxt;
    if (document.getElementById("char-for-pc"))
        document.getElementById("char-for-pc").textContent = fTxt;

    if (document.getElementById("char-int-mobile"))
        document.getElementById("char-int-mobile").textContent = iTxt;
    if (document.getElementById("char-int-pc"))
        document.getElementById("char-int-pc").textContent = iTxt;

    if (document.getElementById("char-agi-mobile"))
        document.getElementById("char-agi-mobile").textContent = aTxt;
    if (document.getElementById("char-agi-pc"))
        document.getElementById("char-agi-pc").textContent = aTxt;

    if (document.getElementById("char-con-mobile"))
        document.getElementById("char-con-mobile").textContent = cTxt;
    if (document.getElementById("char-con-pc"))
        document.getElementById("char-con-pc").textContent = cTxt;

    // --- Folie (valeur unique correcte) ---
    const folieVal = player.folie ?? "";

    // Folie dans la fiche
    if (document.getElementById("char-folie-mobile"))
        document.getElementById("char-folie-mobile").textContent = folieVal;
    if (document.getElementById("char-folie-pc"))
        document.getElementById("char-folie-pc").textContent = folieVal;

    // HUD Folie
    if (document.getElementById("hud-folie-val"))
        document.getElementById("hud-folie-val").textContent = `${folieVal} / 15`;

    updateFolieBar(folieVal);
    updateFolieBarMobile(folieVal);

    // --- Gold ---
    const gold = player.gold ?? player.or ?? "";

    if (document.getElementById("hud-gold"))
        document.getElementById("hud-gold").textContent = gold;

    if (document.getElementById("hud-gold-mobile"))
        document.getElementById("hud-gold-mobile").textContent = gold;

    updateGoldUI(gold);
}

/* =====================================================
      LANCEMENT DU JEU APRÈS CREATION
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const btnStart = document.getElementById("btn-start-game");

    if (btnStart) {
        btnStart.onclick = () => {

            document.getElementById("char-creation-overlay")
                ?.classList.remove("visible");

            keyboardEnabled = true;

            savePlayer();
            updatePlayerDisplay();

            loadScreen("Ecran0000");
        };
    }

});