/* =====================================================
   GESTION OBJETS ECRAN
===================================================== */

const itemDescriptions = {
    "Bague Maudite": "Une bague noire et froide. Il semble impossible de l'enlever.",
    "Parchemin Elfique": "Un vieux parchemin écrit en elfique.",
    "Potion Rouge": "Restaure une petite partie de votre santé.",
    "Torche": "Une torche de bonne facture. Malheureusement éteinte.",
    "Torche Allumée": "Une torche de bonne facture. Elle est enfin allumée.",
    "Pelle": "Une pelle de bonne facture",
    "Lettre Froissée": "Une lettre froissée donnée par le Lutin de la forêt.",
    "Clé Rouillée": "Une vieille clé rouillée.",
    "Glande Lumineuse": "Elle brille d'une lumière verdâtre",
    "Pierre du Passage Droite": "Une pierre magique incomplète",
    "Pierre du Passage Gauche": "Une pierre magique incomplète",
    "Pierre du Passage Complète": "La pierre est enfin complète",
    "Corde": "Une corde usagée mais fonctionnelle",
	"Spore Connectée": "Un genre de champignon vivant avec des tentacules, étrange !",
	"Fragment de Signal": "On dirait un diadème, il vibre légèrement",
	"Pierre Wi‑Fi Sacrée": "Une pierre avec un symbole étrange, elle dégage une chaleur rassurante",
};

const itemIcons = {
    "Bague Maudite": "002. BagueMaudite.png",
    "Parchemin Elfique": "005. ParcheminElfe.png",
    "Potion Rouge": "010. PotionRouge.png",
    "Torche": "016. Torch.png",
    "Torche Allumée": "017. Torch.png",
    "Pelle": "017. pelle.png",
    "Lettre Froissée": "018. lettre_lutin.png",
    "Clé Rouillée": "019. Clef_rouillée.png",
    "Glande Lumineuse": "020. Glande.png",
    "Pierre du Passage Droite": "022. Pierre de passage droit.png",
    "Pierre du Passage Gauche": "023. Pierre de passage gauche.png",
    "Pierre du Passage Complète": "021. Pierre de passage complete.png",
    "Corde": "001. corde.png",
	"Spore Connectée": "024. Spore Connectee.png",
	"Fragment de Signal": "025. Fragment de Signal.png",
	"Pierre Wi‑Fi Sacrée": "026. Pierre Wi-Fi Sacree.png",
};

/* -----------------------------------------------------
       JUMPSCARE SCREENS
------------------------------------------------------ */
const jumpScareScreens = {
    "Ecran0153": {
        sound: "cri",
        image: "Lieux/Champignon/012. champignon.png"
    },
    "Ecran0170": {
        sound: "mort_vivant",
        image: "Lieux/Champignon/027. champignon.png"
    },
    "Ecran0092": {
        sound: "rire2",
        image: "Lieux/Foret/036. Foret.jpg"
    }
};

/* =====================================================
   RECETTES D'ASSEMBLAGE
===================================================== */

const itemCombinations = [
    {
        items: ["Pierre du Passage Droite", "Pierre du Passage Gauche"],
        result: "Pierre du Passage Complète",
        message: "Les deux pierres vibrent et fusionnent en une seule."
    },
    {
        items: ["Torche", "Pierre de Feu"],
        result: "Torche Allumée",
        message: "La torche s’embrase grâce à la pierre."
    }
];

function playerHasItems(items) {
    return items.every(i => player.inventory.includes(i));
}

function combineItems(recipe) {
    // Retirer les objets sources
    recipe.items.forEach(i => {
        const index = player.inventory.indexOf(i);
        if (index > -1) {
            player.inventory.splice(index, 1);
        }
    });

    // Ajouter l’objet résultant
    addItemToInventory(recipe.result);

    updateInventoryDisplay();

    addLogEntry(
        `<p><span class="log-tag">[Assemblage]</span> ${recipe.message}<br>
        ➜ Vous obtenez : <strong>${recipe.result}</strong></p>`
    );
    // Ajout dans le deuxième journal
    addLogEntry(
        `<p><span class="log-tag">[Assemblage]</span> ${recipe.message}<br>
        ➜ Vous obtenez : <strong>${recipe.result}</strong></p>`,
        'log-list2'
    );
}

/* =====================================================
   INTERACTION ITEM
===================================================== */

function inspectItem(item, slot) {

    let text = "Rien de particulier.";
    let combineButton = "";

    // 🔹 Interactions classiques
    if (item === "Parchemin Elfique") {
        text = (player.race === "Elfe" || player.intelligence >= 10)
            ? "Vous comprenez enfin le sens du parchemin."
            : "Vous ne parvenez pas à déchiffrer le texte.";
    }

    if (item === "Bague Maudite") {
        text = "Impossible de retirer cette bague.";
    }

    if (item === "Torche") {
        text = "Il suffirait d'une flamme pour l’allumer.";
    }

    // 🔥 Vérification des recettes d’assemblage
    const possibleRecipe = itemCombinations.find(recipe =>
        recipe.items.includes(item) &&
        playerHasItems(recipe.items)
    );

    if (possibleRecipe) {
        combineButton = `
            <br><br>
            <button class="combine-btn"
                onclick='combineItems(${JSON.stringify(possibleRecipe)})'>
                🔧 Assembler les objets
            </button>
        `;
    }

// ✅ Affichage
showItemPopover(
    slot,
    `<span class="tag">[Interaction]</span><br>
     <strong>${item}</strong><br>
     ${text}
     ${combineButton}`
);

addLogEntry(
    `<p><span class="log-tag">[Interaction]</span> ${item} : ${text}</p>`
);
// Ajout dans le deuxième journal
addLogEntry(
    `<p><span class="log-tag">[Interaction]</span> ${item} : ${text}</p>`,
    'log-list2'
);

}



/* =====================================================
   INVENTAIRE : AFFICHAGE
===================================================== */

function updateInventoryDisplay() {

    const invMobile = document.getElementById("inventory-list");
    const invMob    = document.getElementById("inventory-list-mob");
    const invPC     = document.getElementById("inventory-list-pc");

    function fill(inv) {
        if (!inv) return;
        inv.innerHTML = "";

        for (let i = 0; i < 20; i++) {

            const slot = document.createElement("div");
            slot.className = "inventory-slot";

            const item = player.inventory[i];

            if (item) {

                const img = document.createElement("img");
                img.src = `Objets/${itemIcons[item]}`;
                img.alt = item;

                // ✅ LIGNE IMPORTANTE ICI
                img.dataset.item = item;

                slot.appendChild(img);

                slot.addEventListener("contextmenu", e => {
                    e.preventDefault();
                    openContextMenu(item, slot);
                });

                addTouchOpen(slot, item);
            }

            inv.appendChild(slot);
        }
    }

    fill(invMobile);
    fill(invMob);
    fill(invPC);
}


/* =====================================================
   AJOUTE OBJETS INVENTAIRE
===================================================== */
function addItemToInventory(itemName) {

    console.log("INVENTAIRE AVANT AJOUT :", player.inventory);

    if (player.inventory.includes(itemName)) return;

    const icon = itemIcons[itemName];
    const imageLieu = document.getElementById("screen-image");

    let target;

    if (window.innerWidth < 768) {
        target = document.querySelector(".mobile-menu-button-mob")
              || document.querySelector(".mobile-menu-button");
    } else {
        target = document.getElementById("inventory-list-pc");
    }

    // ✅ Si animation possible
    if (icon && imageLieu && target) {

        // ✅ ON ENVOIE JUSTE LE NOM
        animatedLootToInventory(itemName);

setTimeout(() => {
    player.inventory.push(itemName);
    updateInventoryDisplay();

    const desc = itemDescriptions[itemName] || "Objet ajouté.";
    addLogEntry(
        `<p><span class="log-tag log-add">[Objet obtenu]</span> ${itemName} : ${desc}</p>`
    );
    // Ajout dans le deuxième journal
    addLogEntry(
        `<p><span class="log-tag log-add">[Objet obtenu]</span> ${itemName} : ${desc}</p>`,
        'log-list2'
    );
}, 800);


    } else {

        player.inventory.push(itemName);
        updateInventoryDisplay();
    }
}

/* =====================================================
   MENU CONTEXTUEL INVENTAIRE
===================================================== */

let contextItem = null;
let contextSlot = null;

document.addEventListener("DOMContentLoaded", () => {

    const contextMenu  = document.getElementById("context-menu");
    const ctxDesc      = document.getElementById("ctx-desc");
    const ctxInspect   = document.getElementById("ctx-inspect");
    const ctxImage     = document.getElementById("ctx-image");
    const popover      = document.getElementById("item-popover");

    const inspectModal = document.getElementById("inspect-modal");
    const inspectImage = document.getElementById("inspect-image");
    const closeInspect = document.getElementById("close-inspect");

    contextMenu.addEventListener("click", e => e.stopPropagation());
    popover.addEventListener("click", e => e.stopPropagation());

    window.openContextMenu = function (item, slot) {

        contextItem = item;
        contextSlot = slot;

        const rect = slot.getBoundingClientRect();

        contextMenu.style.left = `${rect.right + 8}px`;
        contextMenu.style.top  = `${rect.top}px`;
        contextMenu.classList.remove("hidden");
    };

ctxDesc.onclick = e => {
    e.stopPropagation();

    const desc = itemDescriptions[contextItem] || "Aucune description.";

// ✅ Fenêtre description (même format que Interaction)
showItemPopover(
    contextSlot,
    `<span class="tag">[Description]</span><br>
     <strong>${contextItem}</strong><br>${desc}`
);

// ✅ Journal (CE QUI MANQUAIT)
addLogEntry(
    `<p><span class="log-tag">[Description]</span> ${contextItem} : ${desc}</p>`
);
// Ajout dans le deuxième journal
addLogEntry(
    `<p><span class="log-tag">[Description]</span> ${contextItem} : ${desc}</p>`,
    'log-list2'
);

contextMenu.classList.add("hidden");

};


    ctxInspect.onclick = e => {
        e.stopPropagation();
        inspectItem(contextItem, contextSlot);
        contextMenu.classList.add("hidden");
    };

    ctxImage.onclick = e => {
        e.stopPropagation();

        inspectImage.src = `Objets/${itemIcons[contextItem]}`;
        inspectModal.classList.remove("hidden");
        contextMenu.classList.add("hidden");
    };

    closeInspect.onclick = e => {
        e.stopPropagation();
        inspectModal.classList.add("hidden");
    };

    inspectModal.addEventListener("click", e => {
        if (e.target === inspectModal) {
            inspectModal.classList.add("hidden");
        }
    });
});


/* =====================================================
   TOUCH INSTANTANÉ MOBILE
===================================================== */

function addTouchOpen(slot, item) {

    let touched = false;

    slot.addEventListener("touchstart", () => {
        touched = true;
        openContextMenu(item, slot);
    });

    slot.addEventListener("click", () => {
        if (touched) {
            touched = false;
            return;
        }
        openContextMenu(item, slot);
    });
}


/* =====================================================
   POPOVER LOCAL
===================================================== */

function showItemPopover(slot, html) {

    const pop = document.getElementById("item-popover");
    const rect = slot.getBoundingClientRect();

    pop.innerHTML = html;
    pop.style.left = `${rect.right + 8}px`;
    pop.style.top  = `${rect.top}px`;
    pop.classList.remove("hidden");
}

/* -----------------------------------------------------
       GESTION ECRAN
------------------------------------------------------ */
function showScreen(id) {

    // 1️⃣ Marque l'écran comme visité
    currentScreenId = id;
    markScreenAsVisited(id);

    const screen = screens[id];

    if (!screen) {
        console.error("Écran introuvable :", id);
        return;
    }

/* -----------------------------------------------------
   🔊 SON SPÉCIFIQUE ÉCRAN (séquentiel propre)
------------------------------------------------------ */

if (screen.sounds && Array.isArray(screen.sounds)) {

    let index = 0;

    function playNext() {

        if (index >= screen.sounds.length) return;
        if (currentScreenId !== id) return;

        const audio = playSFX(screen.sounds[index], true); // ✅ ignore cooldown
        index++;

        if (audio) {
            audio.onended = playNext;
        } else {
            setTimeout(playNext, 500);
        }
    }

    playNext();

} else if (screen.sound) {

    playSFX(screen.sound);
}

    /* -----------------------------------------------------
         GESTION DES PERSONNAGES RENCONTRES
    ------------------------------------------------------ */
    if (screen.meetCharacter) {

        if (player.characters.includes(screen.meetCharacter)) {
            if (screen.redirectIfMet) {
                return showScreen(screen.redirectIfMet);
            }
        } else {
            player.characters.push(screen.meetCharacter);
            savePlayer();
        }
    }

    /* -----------------------------------------------------
         REDIRECTION OBJET UNIQUE
    ------------------------------------------------------ */
    if (screen.onceFlag && player.flags && player.flags[screen.onceFlag]) {
        if (screen.alternateGotoIfOwned) {
            return showScreen(screen.alternateGotoIfOwned);
        }
    }

    if (
        screen.requiresMissingItem &&
        player.inventory.includes(screen.requiresMissingItem)
    ) {
        if (screen.alternateGotoIfOwned) {
            return showScreen(screen.alternateGotoIfOwned);
        }
    }

    /* -----------------------------------------------------
         GESTION OBJETS
    ------------------------------------------------------ */
    const item = screen.giveItem ? screen.giveItem.trim() : null;

    if (item) {

        if (screen.onceFlag) {

            if (!player.flags) player.flags = {};

            if (!player.flags[screen.onceFlag]) {
                addItemToInventory(item);
                playSFX("loot");
                player.flags[screen.onceFlag] = true;
                savePlayer();
            }

        } else {

            if (player.inventory.includes(item)) {

                if (screen.alternateTextIfOwned) {
                    screen._savedText = screen._savedText || screen.texte;
                    screen.texte = screen.alternateTextIfOwned;
                }

                if (screen.alternateGotoIfOwned) {
                    return showScreen(screen.alternateGotoIfOwned);
                }

            } else {
                addItemToInventory(item);
                playSFX("loot");
                savePlayer();
            }
        }
    }

    addVisitHistoryButton();

/* -----------------------------------------------------
     +1 FOLIE
------------------------------------------------------ */
const foliePlusUn = [
    "Ecran0017",
    "Ecran0108",
    "Ecran0114",
    "Ecran0117",
    "Ecran0119",
    "Ecran0148",
    "Ecran0152",
    "Ecran0161"
];

if (foliePlusUn.includes(id)) {
    player.folie = Math.min(15, (player.folie || 0) + 1);

    // Log pour le premier journal
    addLogEntry(`
        <p>
            <span class="log-tag">[Caractéristique]</span>
            Folie : +1
        </p>
    `);

    // Log pour le deuxième journal
    addLogEntry(`
        <p>
            <span class="log-tag">[Caractéristique]</span>
            Folie : +1
        </p>
    `, 'log-list2');

    triggerFolieEffect("up");
    updateFolieBar(player.folie);
    updateFolieBarMobile(player.folie);
    checkFoliePermanent();
    savePlayer();
}

/* -----------------------------------------------------
     -1 FOLIE
------------------------------------------------------ */
const folieMoinsUn = [
    "Ecran0074",
    "Ecran0163"
];

if (folieMoinsUn.includes(id) && player.folie > 0) {
    player.folie = Math.max(0, player.folie - 1);

    // Log pour le premier journal
    addLogEntry(`
        <p>
            <span class="log-tag">[Caractéristique]</span>
            Folie : -1
        </p>
    `);

    // Log pour le deuxième journal
    addLogEntry(`
        <p>
            <span class="log-tag">[Caractéristique]</span>
            Folie : -1
        </p>
    `, 'log-list2');

    triggerFolieEffect("down");
    updateFolieBar(player.folie);
    updateFolieBarMobile(player.folie);
    checkFoliePermanent();
    savePlayer();
}


/* -----------------------------------------------------
     VARIANTES FOLIE
------------------------------------------------------ */

let folieTextOverride = null;
let folieOverlayImage = null;

if (screen.folieVariants) {

    const variante = applyFolieVariant(screen, id);

    if (variante.texte !== screen.texte) {
        folieTextOverride = variante.texte;
    }

    if (variante.image !== screen.image) {
        folieOverlayImage = variante.image;
    }
}

/* -----------------------------------------------------
     AFFICHAGE NORMAL
------------------------------------------------------ */

loadScreen(id);
handleZoneMusic(screen);
triggerJumpScareEffect(id);

/* -----------------------------------------------------
     MORPHING IMAGE / TEXTE
------------------------------------------------------ */

if (folieTextOverride) {
    const textEl = document.getElementById("text");
    if (textEl) textEl.textContent = folieTextOverride;
}

if (folieOverlayImage) {
    updateImage(folieOverlayImage);
} else {
    updateImage(null);
}

/* -----------------------------------------------------
     ACTION
------------------------------------------------------ */
if (typeof screen.action === "function") {
    screen.action();
}
}

/* -----------------------------------------------------
     UPDATE STATISTIQUES
------------------------------------------------------ */

function updateStatsInterface() {

    const mapPC = {
        force: "char-for-pc",
        intelligence: "char-int-pc",
        agilite: "char-agi-pc",
        constitution: "char-con-pc"
    };

    for (let stat in mapPC) {
        const elem = document.getElementById(mapPC[stat]);
        if (elem) elem.textContent = player[stat] || 0;
    }

    const mapMobile = {
        force: "char-for-mobile",
        intelligence: "char-int-mobile",
        agilite: "char-agi-mobile",
        constitution: "char-con-mobile"
    };

    for (let stat in mapMobile) {
        const elem = document.getElementById(mapMobile[stat]);
        if (elem) elem.textContent = player[stat] || 0;
    }

    // --- Ajout mob ---
    const mapMob = {
        force: "char-for-mob",
        intelligence: "char-int-mob",
        agilite: "char-agi-mob",
        constitution: "char-con-mob"
    };

    for (let stat in mapMob) {
        const elem = document.getElementById(mapMob[stat]);
        if (elem) elem.textContent = player[stat] || 0;
    }
}

/* -----------------------------------------------------
     REDIRECTION SELON LA FOLIE
------------------------------------------------------ */
function resolveMadnessScreen(id) {
    const madness = player.madness || 0;

    if (madness >= 12 && screens[id + "_f12"]) return id + "_f12";
    if (madness >= 10 && screens[id + "_f10"]) return id + "_f10";
    if (madness >= 5 && screens[id + "_f5"]) return id + "_f5";
    return id;
}

/* -----------------------------------------------------
     AFFICHAGE ÉCRAN
------------------------------------------------------ */
function loadScreen(id, options = {}) {

    id = resolveMadnessScreen(id);

    const { fromLoad = false } = options;
    const data = screens[id];

    if (!data) {
        console.error(`Écran inconnu : ${id}`);
        return;
    }

    const finalData = applyFolieVariant({
        ...data,
        choix: data.choix
    });

    if (!fromLoad) {
        if (!localStorage.getItem("justReset")) {
            localStorage.setItem("lastScreen", id);
        } else {
            localStorage.removeItem("justReset");
        }
    }

    const img = document.getElementById("screen-image");
    const title = document.getElementById("screen-title");
    const textEl = document.getElementById("screen-text");
    const choicesContainer = document.getElementById("choices-container");
    const overlay = document.getElementById("screen-image-overlay");
    const wrapper = document.querySelector(".screen-image-wrapper");


    /* ===============================
       FADE OUT
    =============================== */

    img.classList.add("fade-out");
    textEl.classList.add("fade-out");
    title.classList.add("fade-out");

    setTimeout(() => {

        /* ===============================
           AFFICHAGE NORMAL (IMPORTANT)
        =============================== */

        img.src = data.image;
        document.body.style.setProperty("--bg-image", `url("${data.image}")`);

        title.textContent = data.titre || id;
        textEl.textContent = data.texte || "Aucune description.";

        overlay.style.opacity = "0";
        overlay.src = "";

        wrapper.classList.remove("madness-distort", "madness-shake", "madness-breath");

        /* ===============================
           CHOIX
        =============================== */

        choicesContainer.innerHTML = "";

        if (data.choix && data.choix.length > 0) {
            data.choix.forEach((choice, i) => {

                const div = document.createElement("div");
                div.className = "choix-item";
                div.dataset.goto = choice.goto || "";
                div.innerHTML = `<span class="choix-num">${i + 1}</span> ${choice.texte}`;

                div.addEventListener("click", () => {
                    keyboardEnabled = true;

                    if (typeof choice.action === "function") {
                        choice.action();
                    }

                    if (choice.goto) {
                        showScreen(choice.goto);
                    }
                });

                choicesContainer.appendChild(div);
            });
        }

        /* ===============================
           FADE IN
        =============================== */

        img.classList.remove("fade-out");
        img.classList.add("fade-in");

        textEl.classList.remove("fade-out");
        textEl.classList.add("fade-in");

        title.classList.remove("fade-out");
        title.classList.add("fade-in");

        setTimeout(() => {
            img.classList.remove("fade-in");
            textEl.classList.remove("fade-in");
            title.classList.remove("fade-in");
        }, 400);
		
		
        /* ===============================
           REQUIRE ALL
        =============================== */
        if (data.requireAll) {

            let ok = true;

            for (let cond of data.requireAll) {

                if (cond.type === "race") {
                    if (player.race.toLowerCase() !== cond.value.toLowerCase()) {
                        ok = false;
                    }
                }

                if (cond.type === "statMin") {
                    if (player[cond.stat] < cond.value) {
                        ok = false;
                    }
                }

                if (cond.type === "item") {
                    if (!player.inventory.includes(cond.value)) {
                        ok = false;
                    }
                }
            }

            if (!ok) {
                addLogEntry(`<p><span class="log-tag log-fail">[Action ratée]</span> ${data.titre}</p>`);
                return loadScreen(data.elseGoto);
            }

            addLogEntry(`<p><span class="log-tag log-success">[Action réussie]</span> ${data.titre}</p>`);

            if (data.goto) {
                return showScreen(data.goto);
            }
        }

        /* ===============================
           REQUIRE ANY
        =============================== */
        if (data.requireAny) {

            let ok = false;

            for (let cond of data.requireAny) {

                if (cond.type === "race" &&
                    player.race.toLowerCase() === cond.value.toLowerCase()) {
                    ok = true;
                }

                if (cond.type === "statMin" &&
                    player[cond.stat] >= cond.value) {
                    ok = true;
                }

                if (cond.type === "item" &&
                    player.inventory.includes(cond.value)) {
                    ok = true;
                }
            }

            if (!ok) {
                addLogEntry(`<p><span class="log-tag log-fail">[Action ratée]</span> ${data.titre}</p>`);
                return loadScreen(data.elseGoto);
            }

            addLogEntry(`<p><span class="log-tag log-success">[Action réussie]</span> ${data.titre}</p>`);

            if (data.goto) {
                return showScreen(data.goto);
            }
        }

        /* ===============================
           INVENTAIRE + MORPH FOLIE
        =============================== */

        setTimeout(() => {

            updateInventoryDisplay();

            if (finalData.image !== data.image) {

                const normalText = data.texte;
                const madnessText = finalData.texte;
                const madnessImage = finalData.image;

                overlay.src = madnessImage;
                overlay.style.opacity = "0";

                /* ---- TRANSITION VERS FOLIE (2.5s) ---- */

                setTimeout(() => {

                    overlay.style.transition = "opacity 1.5s ease-in-out";
                    overlay.style.opacity = "1";

                    textEl.classList.add("fade-out");

                    setTimeout(() => {
                        textEl.textContent = madnessText;
                        textEl.classList.remove("fade-out");
                        textEl.classList.add("fade-in");
                    }, 400);

                    wrapper.classList.add("madness-distort");

                    if (player.folie >= 10) {
                        wrapper.classList.add("madness-breath");
                    }

                    if (player.folie >= 15) {
                        wrapper.classList.add("madness-shake");
                    }

                }, 1500);

                /* ---- RETOUR NORMAL (12.5s) ---- */

                setTimeout(() => {

                    overlay.style.opacity = "0";

                    textEl.classList.add("fade-out");

                    setTimeout(() => {
                        textEl.textContent = normalText;
                        textEl.classList.remove("fade-out");
                        textEl.classList.add("fade-in");
                    }, 400);

                    wrapper.classList.remove(
                        "madness-distort",
                        "madness-breath",
                        "madness-shake"
                    );

                }, 10000);
            }

        }, 300);

    }, 300);
}

/* -----------------------------------------------------
       UPDATE IMAGE
------------------------------------------------------ */

function updateImage(overlaySrc) {

    const baseImage = document.getElementById("screen-image");
    const overlayImage = document.getElementById("screen-image-overlay");

    if (!overlaySrc) {
        overlayImage.style.opacity = "0";
        return;
    }

    console.log("Overlay src appliqué :", overlaySrc);

    overlayImage.src = overlaySrc;

    // petit délai pour forcer le navigateur à enregistrer le changement
    requestAnimationFrame(() => {
        overlayImage.style.opacity = "1";
    });
}

/* -----------------------------------------------------
       EFFET SURPRISE
------------------------------------------------------ */
function triggerJumpScareEffect(screenId) {

    if (!jumpScareScreens[screenId]) return;

    if (!player.jumpScares) player.jumpScares = [];
    if (player.jumpScares.includes(screenId)) return;

    player.jumpScares.push(screenId);
    savePlayer();

    const config = jumpScareScreens[screenId];
    const baseImage = document.getElementById("screen-image");

    if (!baseImage) return;

	// 🔊 SON
	if (config.sound && typeof playSFX === "function") {
		playSFX(config.sound);
	}

    const rect = baseImage.getBoundingClientRect();

    const scareImage = document.createElement("img");
    scareImage.src = config.image || baseImage.src;

    scareImage.style.position = "fixed";
    scareImage.style.top = rect.top + "px";
    scareImage.style.left = rect.left + "px";
    scareImage.style.width = rect.width + "px";
    scareImage.style.height = rect.height + "px";
    scareImage.style.objectFit = "cover";
    scareImage.style.zIndex = "999999999";
    scareImage.style.pointerEvents = "none";
    scareImage.style.transformOrigin = "center center";
    scareImage.style.transition = "none";

    document.body.appendChild(scareImage);

    // ✅ Flash element
    let flash = document.getElementById("jumpscare-flash");
    if (!flash) {
        flash = document.createElement("div");
        flash.id = "jumpscare-flash";
        document.body.appendChild(flash);
    }

    scareImage.onload = () => {

        scareImage.getBoundingClientRect();

        // ⚡ FLASH BLANC
        flash.style.transition = "none";
        flash.style.opacity = "1";

        setTimeout(() => {
            flash.style.transition = "opacity 0.2s ease";
            flash.style.opacity = "0";
        }, 60);

        // 🌪 SHAKE GLOBAL
        document.body.classList.add("jumpscare-shake");
        setTimeout(() => {
            document.body.classList.remove("jumpscare-shake");
        }, 400);

        // 📺 GLITCH
        scareImage.classList.add("glitch-effect");

        // 💥 Zoom centre
        scareImage.style.transition = "all 0.8s cubic-bezier(.2,.8,.2,1)";
        scareImage.style.top = "50%";
        scareImage.style.left = "50%";
        scareImage.style.transform = "translate(-50%, -50%) scale(6)";

        setTimeout(() => {
            scareImage.remove();
        }, 900);
    };
}


/* -----------------------------------------------------
       GESTION DES CHOIX
------------------------------------------------------ */
function attachChoiceListeners() {
    // On remplace chaque élément par un clone pour supprimer TOUS les anciens listeners
    const oldChoices = document.querySelectorAll("#choices-container .choix-item");

    oldChoices.forEach(choice => {
        const clone = choice.cloneNode(true);
        choice.replaceWith(clone);
    });

    // On reselectionne les nouveaux éléments (clonés)
    const choices = document.querySelectorAll("#choices-container .choix-item");

    // On ajoute les listeners tout neufs
    choices.forEach(choiceEl => {
        choiceEl.addEventListener("click", () => {
            keyboardEnabled = true;
            const goto = choiceEl.dataset.goto;
            if (goto) {
                showScreen(goto);
            }
        });
    });
}

/* -----------------------------------------------------
     GESTION LOOT OBJETS ANIMATION
------------------------------------------------------ */

function lootObjet() {

    const imageLieu = document.getElementById("screen-image");

    let target;

    if (window.innerWidth < 768) {
        // Cible le bouton qui ouvre le side-menu-mobile (nouveau)
        target = document.querySelector(".mobile-menu-button-mob") 
              || document.querySelector(".mobile-menu-button");
    } else {
        target = document.getElementById("inventory-list-pc");
    }

    console.log("lootObjet appelée");

    animateLootToInventory(
        icon,
        imageLieu,
        target
    );

}

/* -----------------------------------------------------
       BASE DE DONNEES DES ECRANS
------------------------------------------------------ */

const screens = {
"Ecran0000": {
  titre: "Bienvenue dans le jeu : It's Just An Adventure de Madcarak",
  texte: "Vous êtes dans la beta v0.2 du jeu, ceci est une démo qui va vous permettre d'explorer 3 zones. Je vous conseille fortement de commencer par le chapitre de la forêt qui est le début du jeu pour une meilleure immersion.",
  image: "Lieux/intro.png",
  choix: [
    { texte: "Se rendre au chapitre de la forêt (C'est en effet un bon conseil que celui-là !)", goto: "Ecran0001" },
    { texte: "Se rendre vers celui de la montagne (uniquement si je suis un fainéant et que je n'arrive pas à finir la zone de la forêt ! ^^)", goto: "Ecran0049" },
	{ texte: "Tester la partie du champignon (partie horrifique en test)", goto: "Ecran0143" },
  ]
},"Ecran0000A": {
  titre: "Fin de la démo, jeu encore en construction",
  texte: "Bravo vous êtes arrivé jusqu'au bout de la démo, avez-vous essayer la partie champignon pour des sensations fortes ?",
  image: "Lieux/error.png",
  choix: [
    { texte: "Se rendre au chapitre de la forêt", goto: "Ecran0001" },
    { texte: "Se rendre vers celui de la montagne", goto: "Ecran0049" },
	{ texte: "Tester la partie du champignon (partie horrifique)", goto: "Ecran0143" },
  ]
},
"Ecran0001": {
  zone: "foret",
  titre: "Dans une forêt inconnue",
  texte: "Un mal de tête vous prend au réveil, vous vous trouvez dans une forêt que vous ne connaissez pas..",
  image: "Lieux/Foret/001. Foret.png",
  choix: [
    { texte: "Continuer sur le sentier", goto: "Ecran0002" },
    { texte: "S'enfoncer dans les bois à gauche", goto: "Ecran0003" },
    { texte: "Partir en direction de la droite", goto: "Ecran0004" },
  ]
},
"Ecran0002": {
	zone: "foret",
  titre: "Sur le sentier",
  texte: "Vous continuez sur le sentier et vous tombez sur un panneau qui propose deux routes",
  image: "Lieux/Foret/002. Foret.jpg",
  choix: [
    { texte: "Prendre la route à droite", goto: "Ecran0005" },
    { texte: "Plutôt celle de gauche", goto: "Ecran0006" },
    { texte: "Examiner le panneau", goto: "Ecran0007" },
  ]
},
"Ecran0003": {
	zone: "cimetiere",
  titre: "Un cimetière",
  texte: "Après un petit moment de marche à travers bois, vous tombez sur d'anciennes tombes.",
  image: "Lieux/Foret/003. Foret.jpg",
  choix: [
    { texte: "Fouiller autour des tombes", goto: "Ecran0008" },
    { texte: "Se recueillir un moment", goto: "Ecran0009" },
    { texte: "Continuer à travers bois", goto: "Ecran0004" },
  ]
},
"Ecran0004": {
	zone: "foret",
  titre: "L'Homme-Arbre",
  texte: "Vous tombez face à un homme‑arbre, qui ne semble pas agressif. Il entame la discussion et vous dit : « Que fais‑tu dans ma forêt ? ",
  image: "Lieux/Foret/004. Foret.jpg",
  
  meetCharacter: "Homme-Arbre",
  redirectIfMet: "Ecran0024",
  
  choix: [
    { texte: "Je ne sais pas trop, je me suis réveillé pas loin d'ici !", goto: "Ecran0010" },
    { texte: "Dans quelle forêt sommes-nous ?", goto: "Ecran0011" },
    { texte: "Tu ne vas pas me manger tout de même ?", goto: "Ecran0012" },
  ]
},
"Ecran0005": {
	zone: "foret",
  titre: "La ruine",
  texte: "Vous tombez nez à nez face à une ancienne ruine",
  image: "Lieux/Foret/005. Foret.jpg",
  choix: [
    { texte: "Pénétrer à l'intérieur", goto: "Ecran0013" },
    { texte: "Faire le tour de la ruine", goto: "Ecran0014" },
    { texte: "Continuer son chemin", goto: "Ecran0004" },
  ]
},
	"Ecran0006": {
		zone: "montagne",
  titre: "La route des cols",
  texte: "La forêt devient de moins en moins dense. Un petit vent, qui semble magique, souffle..",
  image: "Lieux/Foret/006. Foret.jpg",
  choix: [
    { texte: "Respirer un bon coup d'air frais !", goto: "Ecran0015" },
    { texte: "Redescendre vert la forêt", goto: "Ecran0001" },
  ]
},
"Ecran0007": {
	zone: "foret",
  titre: "Le panneau",
  texte: "Le panneau est écrit dans une langue inconnue. Il n’y a rien d’autre dans les parages.",
  image: "Lieux/Foret/002. Foret.jpg",
  choix: [
    { texte: "Prendre la route à droite", goto: "Ecran0005" },
    { texte: "Plutôt celle de gauche", goto: "Ecran0006" },
  ]
},
"Ecran0008": {
	zone: "cimetiere",
  titre: "Fouille du cimetière",
  texte: "Vous fouillez autour des tombes et trouvez une bague qui semble dégager une grande énergie !",
  image: "Lieux/Foret/008. Foret.jpg",
  
  onceFlag: "bague_cimetiere_pris",
  alternateGotoIfOwned: "Ecran0008A",
  
  choix: [
    { texte: "Mettre la bague", goto: "Ecran0017" },
    { texte: "Ne pas la ramasser et se recueillir", goto: "Ecran0018" },
    { texte: "Continuer à travers bois", goto: "Ecran0004" },
  ]
},


"Ecran0008A": {
	zone: "cimetiere",
  titre: "Fouille du cimetière",
  texte: "Plus rien à fouiller par ici..",
  image: "Lieux/Foret/003. Foret.jpg",
  choix: [
    { texte: "Se recueillir", goto: "Ecran0018" },
    { texte: "Continuer à travers bois", goto: "Ecran0004" },
  ]
},
"Ecran0009": {
	zone: "cimetiere",
  titre: "Recueillement",
  texte: "Vous vous recueillez un moment auprès des tombes et vous vous sentez bien ! (Grâce aléatoire)",
  image: "Lieux/Foret/009. Foret.jpg",
  choix: [
    { texte: "Continuer à travers bois", goto: "Ecran0004" },
    { texte: "Fouiller autour des tombes", goto: "Ecran0008" },
    { texte: "Retourner vers la forêt", goto: "Ecran0001" },
  ]
},
"Ecran0009A": {
	zone: "cimetiere",
  titre: "Recueillement",
  texte: "Vous vous recueillez un moment auprès des tombes..",
  image: "Lieux/Foret/009. Foret.jpg",
  choix: [
    { texte: "Continuer à travers bois", goto: "Ecran0004" },
    { texte: "Retourner vers la forêt", goto: "Ecran0001" },
  ]
},
"Ecran0010": {
	zone: "foret",
  titre: "L'Homme-Arbre",
  texte: "L'Homme-Arbre vous regarde et vous dit : « Es‑tu là pour troubler l’ordre qui règne en ces lieux ? »",
  image: "Lieux/Foret/004. Foret.jpg",
  choix: [
    { texte: "Non cela ne m'a même pas effleuré l'esprit", goto: "Ecran0019" },
    { texte: "En effet je suis là pour ça !", goto: "Ecran0038" },
    { texte: "Tu ne vas pas me manger tout de même ?", goto: "Ecran0012" },
  ]
},
"Ecran0011": {
	zone: "foret",
  titre: "L'Homme-Arbre",
  texte: "Nous sommes dans la forêt de Hankpath, l’une des plus belles forêts que je connaisse... et la seule.",
  image: "Lieux/Foret/004. Foret.jpg",
  choix: [
    { texte: "Tu ne vas pas me manger tout de même ?", goto: "Ecran0012" },
    { texte: "Je vois que t'y connais rien, ça ne m'étonne pas pour un Homme-Arbre", goto: "Ecran0038" },
    { texte: "Dire au revoir et s'en aller", goto: "Ecran0024" },
  ]
},
"Ecran0012": {
	zone: "foret",
  titre: "L'Homme-Arbre",
  texte: "L'Homme‑Arbre rigole lentement... « Je ne mange pas de chair ». ",
  image: "Lieux/Foret/004. Foret.jpg",
  choix: [
	{ texte: "Que ferais-tu si je trouble l'ordre de ces bois ?", goto: "Ecran0019" },
    { texte: "Dire au revoir et s'en aller au loin", goto: "Ecran0024" },
    { texte: "Retourner vers la forêt", goto: "Ecran0001" },
  ]
},
"Ecran0013": {
	zone: "donjon",
  titre: "Dans la ruine",
  texte: "Une odeur désagréable émane de la pièce, c'est poussiéreux et l'air est pesant.",
  image: "Lieux/Foret/013. Foret.jpg",
  choix: [
    { texte: "Examiner les lieux", goto: "Ecran0021" },
    { texte: "Passer par la trappe du fond", goto: "Ecran0023" },
    { texte: "Sortir de la ruine", goto: "Ecran0005" },
  ]
},
"Ecran0014": {
	zone: "foret",
  titre: "Le Squelette",
  texte: "Un squelette est là, il semble être mort en faisant la sieste.",
  image: "Lieux/Foret/014. Foret.jpg",
  choix: [
    { texte: "Fouiller le squelette et les alentours", goto: "Ecran0025" },
    { texte: "Revenir devant la ruine", goto: "Ecran0005" },
  ]
},
"Ecran0015": {
	zone: "montagne",
  titre: "Le bon air frais !",
  texte: "Vous humez l'air et vous vous sentez bien ! (Grâce aléatoire)",
  image: "Lieux/Foret/006. Foret.jpg",
  
  graceAleatoire: true,
  alternateGotoAfterGrace: "Ecran0015A",
  
  choix: [
    { texte: "Continuer hors de la forêt", goto: "Ecran0016" },
    { texte: "Revenir sur ses pas", goto: "Ecran0002" },
  ]
},
"Ecran0015A": {
	zone: "montagne",
  titre: "Le bon air frais !",
  texte: "L'air de la montagne vous gagne..",
  image: "Lieux/Foret/006. Foret.jpg",
  choix: [
    { texte: "Continuer hors de la forêt", goto: "Ecran0016" },
    { texte: "Revenir sur ses pas", goto: "Ecran0002" },
  ]
},
"Ecran0016": {
	zone: "montagne",
  titre: "Hors de la forêt",
  texte: "Enfin sortie de cette forêt ! La vue est époustouflante..",
  image: "Lieux/Montagne/001. Montagne.jpg",
  choix: [
    { texte: "Continuez vers les montagnes", goto: "Ecran0047" },
    { texte: "Redescendre vers le cimetière", goto: "Ecran0003" },
  ]
},
"Ecran0017": {
	zone: "cimetiere",
  titre: "Malédiction",
  texte: "Une fois la bague mise vous sentez une douleur qui vous prend jusqu'au bras !",
  image: "Lieux/Foret/018. Foret.jpg",
  sound: "folieUp",
  
  giveItem: "Bague Maudite",
  onceFlag: "bague_cimetiere_pris",
  
  choix: [
    { texte: "Essayer d'enlever la bague", goto: "Ecran0036" },
    { texte: "Continuer à travers bois", goto: "Ecran0005" },
  ]
},

"Ecran0018": {
	zone: "cimetiere",
  titre: "Recueillement",
  texte: "Vous abandonnez l'idée de récupérer la bague et vous recueillez près des tombes et vous vous sentez bien ! (Grâce aléatoire)",
  image: "Lieux/Foret/009. Foret.jpg",
  
  graceAleatoire: true,
  alternateGotoAfterGrace: "Ecran0018A",
  
  choix: [
    { texte: "Continuer à travers bois", goto: "Ecran0004" },
  ]
},
"Ecran0018A": {
	zone: "cimetiere",
  titre: "Recueillement",
  texte: "Vous abandonnez l'idée de récupérer la bague et vous recueillez près des tombes, vous vous sentez bien !",
  image: "Lieux/Foret/009. Foret.jpg",
  choix: [
    { texte: "Continuer à travers bois", goto: "Ecran0004" },
  ]
},
"Ecran0019": {
	zone: "foret",
  titre: "L'Homme-Arbre",
  texte: "Cela m'embêterai de devoir te maltraiter..",
  image: "Lieux/Foret/004. Foret.jpg",
  choix: [
    { texte: "Tu ne vas pas me manger tout de même ?", goto: "Ecran0012" },
    { texte: "Me maltraiter ? Se mettre en position d'attaque !", goto: "Ecran0038" },
    { texte: "Dire au revoir et s'en aller", goto: "Ecran0024" },
  ]
},
"Ecran0021": {
	zone: "donjon",
  titre: "Examiner les lieux",
  texte: "Vous trouvez un parchemin elfique.",
  image: "Lieux/Foret/005. Parchemin.jpg",

  giveItem: "Parchemin Elfique",
  onceFlag: "parchemin_elfique_trouve",
  alternateGotoIfOwned: "Ecran0033",

  choix: [
    { texte: "Déchiffrer", goto: "Ecran0034" },
  ]
},
"Ecran0022": {
	zone: "lac",
  titre: "Le lac",
  texte: "Vous arrivez devant un joli lac en plein milieu de la forêt",
  image: "Lieux/Foret/022. Foret.jpg",
  choix: [
    { texte: "Essayer d'identifier l'odeur", goto: "Ecran0030" },
    { texte: "Prendre la barque et partir sur le lac", goto: "Ecran0031" },
    { texte: "S'enfoncer dans la forêt", goto: "Ecran0050" },
  ]
},
"Ecran0023": {
	zone: "donjon",
  titre: "Le tumulus",
  texte: "Une fois dans le tumulus vous ne voyez plus rien",
  image: "Lieux/Foret/024. Foret.jpg",
  requiresMissingItem: "Pierre du Passage Droite",
  choix: [
    { texte: "Continuer dans le tumulus", goto: "Ecran0046" },
    { texte: "Sortir de la ruine", goto: "Ecran0005" },
  ]
},
"Ecran0024": {
	zone: "foret",
  titre: "L'Homme-Arbre",
  texte: "L'homme-arbre vous regarde mais ne réagit pas",
  image: "Lieux/Foret/004. Foret.jpg",
  choix: [
    { texte: "Revenir au panneau", goto: "Ecran0002" },
    { texte: "S'en aller derrière lui", goto: "Ecran0022" },
    { texte: "Tenter de le distraire", goto: "Ecran0024" },
  ]
},
"Ecran0025": {
	zone: "foret",
  titre: "Fouille du squelette",
  texte: "Vous trouvez une torche non allumée",
  image: "Lieux/Foret/014. Foret.jpg",
  
  giveItem: "Torche",
  onceFlag: "torche_trouve",
  alternateGotoIfOwned: "Ecran0029",
  
  meetCharacter: "Squelette",
  redirectIfMet: "Ecran0029",
  
  choix: [
    { texte: "Revenir devant la ruine", goto: "Ecran0005" },
    { texte: "S'enfoncer dans la forêt", goto: "Ecran0050" },
  ]
},
"Ecran0026": {
	zone: "foret",
  titre: "L'Homme-Arbre",
  texte: "L'homme-arbre baisse ses grandes branches, comme pour mieux vous observer. « Alors tu t’es réveillé ici… Ce lieu attire parfois les égarés. Certains disent que la forêt de Hankpath ressent le mal‑être des voyageurs et tente de les guider… ou de les perdre. ",
  image: "Lieux/Foret/004. Foret.jpg",
  choix: [
    { texte: "Je veux seulement comprendre où je suis", goto: "Ecran0011" },
    { texte: "La forêt semble… inquiète", goto: "Ecran0027" },
    { texte: "Je ne veux pas te déranger", goto: "Ecran0019" },
  ]
},
"Ecran0027": {
	zone: "foret",
  titre: "L'Homme-Arbre",
  texte: "La forêt souffre, ses racines sont tourmentées",
  image: "Lieux/Foret/004. Foret.jpg",
  choix: [
    { texte: "Qui la tourmente ?", goto: "Ecran0028" },
    { texte: "J’aimerais aider", goto: "Ecran0019" },
    { texte: "Je me sens observé…", goto: "Ecran0011" },
  ]
},
"Ecran0028": {
	zone: "foret",
  titre: "L'Homme-Arbre",
  texte: "Quelque chose rôde… une présence lourde",
  image: "Lieux/Foret/004. Foret.jpg",
  choix: [
    { texte: "Je ne veux pas te causer plus d’effroi", goto: "Ecran0019" },
    { texte: "Et si je l’affrontais ?", goto: "Ecran0019" },
    { texte: "Partir discrètement…", goto: "Ecran0024" },
  ]
},
"Ecran0029": {
	zone: "foret",
  titre: "Le Squelette",
  texte: "Vous avez déjà fouillé cette emplacement",
  image: "Lieux/Foret/014. Foret.jpg",
  choix: [
    { texte: "Revenir devant la ruine", goto: "Ecran0005" },
    { texte: "S'enfoncer dans la forêt", goto: "Ecran0050" },
  ]
},
"Ecran0030": {
	zone: "lac",
  titre: "Essayer d'identifier l'odeur",
  texte: "L'odeur que vous sentez semble être celui d'octopodes, elle est forte et pas agréable au nez",
  image: "Lieux/Foret/022. Foret.jpg",
  choix: [
    { texte: "Prendre la barque et partir sur le lac", goto: "Ecran0031" },
    { texte: "Faire le tour du lac", goto: "Ecran0040" },
  ]
},
"Ecran0031": {
	zone: "lac",
  titre: "Prendre la barque et partir sur le lac",
  texte: "Vous trouvez une pelle à l'intérieur de la barque qui va vous servir de rame..",
  image: "Lieux/Foret/022. Foret.jpg",
  
  giveItem: "Pelle",
  onceFlag: "pelle_trouve",

  choix: [
    { texte: "Faire le tour du lac", goto: "Ecran0040" },
    { texte: "Descendre de la barque finalement", goto: "Ecran0022" },
  ]
},
"Ecran0032": {
	zone: "lac",
  titre: "Faire le tour du lac",
  texte: "Vous suivez le ruisseau jusqu'à une clairière",
  image: "Lieux/Foret/022. Foret.jpg",
  choix: [
    { texte: "Approcher de la clairière", goto: "Ecran0051" },
    { texte: "Cerner la clairière", goto: "Ecran0039" },
    { texte: "Faire demi-tour", goto: "Ecran0013" },
  ]
},
"Ecran0033": {
	zone: "donjon",
  titre: "Examiner les lieux",
  texte: "Rien de plus à récupérer ici",
  image: "Lieux/Foret/013. Foret.jpg",
  choix: [
    { texte: "Passer par la trappe du fond", goto: "Ecran0023" },
    { texte: "Sortir de la ruine", goto: "Ecran0005" },
  ]
},
"Ecran0034": {
	zone: "donjon",
  titre: "Déchiffrage du parchemin",
  texte: "Vous tentez de déchiffrer les symboles...",
  image: "Lieux/Foret/005. Parchemin.jpg",
  requireAny: [
    { type: "race", value: "Elfe" },
    { type: "statMin", stat: "intelligence", value: 10 }
  ],
  elseGoto: "Ecran0035",
  choix: [
    { texte: "Continuer", goto: "Ecran0033" }
  ]
},
"Ecran0035": {
	zone: "donjon",
  titre: "Déchiffrage du parchemin",
  texte: "Vous essayer de déchiffrer le parchemin mais rien n'y fais, vous comprenez rien à ce charabia",
  image: "Lieux/Foret/005. Parchemin.jpg",
  choix: [
    { texte: "Continuer", goto: "Ecran0033" },
  ]
},
"Ecran0036": {
	zone: "cimetiere",
  titre: "Malédiction",
  texte: "Impossible de retirer la bague",
  image: "Lieux/Foret/018. Foret.jpg",
  choix: [
    { texte: "Continuer à travers bois", goto: "Ecran0004" },
    { texte: "S'enfoncer sur la gauche", goto: "Ecran0005" },
  ]
},
"Ecran0037": {
	zone: "foret",
  titre: "L'Homme-Arbre – Défaite",
  texte: "La nature recouvre toujours la pierre",
  image: "Lieux/Foret/004. Foret.jpg",
  choix: [
    { texte: "Accepter la défaite et partir", goto: "Ecran0024" },
  ]
},
"Ecran0038": {
	zone: "foret",
  titre: "L'Homme-Arbre – Égalité",
  texte: "Deux esprits sylvestres ! Rejouons !",
  image: "Lieux/Foret/004. Foret.jpg",
  choix: [
    { texte: "Pierre", goto: "Ecran0037" },
    { texte: "Feuille", goto: "Ecran0038" },
    { texte: "Ciseaux", goto: "Ecran0039" },
  ]
},
"Ecran0039": {
	zone: "foret",
  titre: "L'Homme-Arbre – Victoire",
  texte: "Vous faites « Ciseaux »… et l’Homme‑Arbre fait « Feuille ». Il pousse un soupir impressionné. « Le vent coupe parfois les feuilles les plus robustes. Tu as gagné, voyageur. » Il récupère quelque chose entre son écorce et vous le tend.",
  image: "Lieux/Foret/004. Foret.jpg",
  
  giveItem: "Potion Rouge",  
  onceFlag: "potion_rouge_trouve",
  alternateGotoIfOwned: "Ecran0024",
  
  choix: [
    { texte: "Remercier et partir", goto: "Ecran0024" },
  ]
},
"Ecran0040": {
	zone: "lac",
  titre: "L'octopus",
  texte: "Vous rencontrez un Octopus géant, à première vue il ne semble pas agressif,",
  image: "Lieux/Foret/029. Foret.jpg",
  choix: [
    { texte: "Bonjour le poulpe !", goto: "Ecran0041" },
    { texte: "Eh Oh !!", goto: "Ecran0041" },
  ]
},
"Ecran0041": {
	zone: "lac",
  titre: "L'octopus",
  texte: "L’octopus ne semble pas réagir, pourtant il regarde dans votre direction, peut-être attend-il quelque chose,",
  image: "Lieux/Foret/029. Foret.jpg",
  choix: [
    { texte: "Espèce de sale mollusque baveux, tu m'entends ?", goto: "Ecran0041A" },
    { texte: "Poulpy !?", goto: "Ecran0041A" },
  ]
},
"Ecran0041A": {
	zone: "lac",
  titre: "Le poulpe est attiré par la Glande Lumineuse",
  image: "Lieux/Foret/029. Foret.jpg",

  requireAny: [
    { type: "item", value: "Glande Lumineuse" }
  ],
  elseGoto: "Ecran0042",

  goto: "Ecran0055"
},
"Ecran0042": {
	zone: "lac",
  titre: "L'octopus",
  texte: "Toujours aucune réaction.. que peut-il bien vouloir",
  image: "Lieux/Foret/029. Foret.jpg",
  choix: [
    { texte: "Continuer le tour du lac", goto: "Ecran0044" },
  ]
},
"Ecran0043": {
	zone: "donjon",
  titre: "Le tumulus",
  texte: "Sans lumière je ne peux pas aller plus loin",
  image: "Lieux/Foret/024. Foret.jpg",
  choix: [
    { texte: "Sortir de la ruine", goto: "Ecran0005" },
  ]
},
"Ecran0044": {
	zone: "lac",
  titre: "Le cerf",
  texte: "Un cerf majestueux regarde au loin, vous ne semblez pas le déranger",
  image: "Lieux/Foret/032 - Foret.jpg",
  choix: [
    { texte: "S'approcher discrètement", goto: "Ecran0061" },
  ]
},
"Ecran0045": {
	zone: "lac",
  titre: "Essayer d'identifier l'odeur",
  texte: "Vous reprenez la barque et faite le tour",
  image: "Lieux/Foret/022. Foret.jpg",
  choix: [
    { texte: "Allez vers le poulpe", goto: "Ecran0040" },
    { texte: "Prendre sur la droite", goto: "Ecran0044" },
  ]
},
"Ecran0046": {
	zone: "donjon",
  titre: "Continue dans le Tumulus",
  image: "Lieux/Foret/024. Foret.jpg",

  requireAny: [
    { type: "item", value: "Torche Allumée" }
  ],
  elseGoto: "Ecran0043",

  goto: "Ecran0080"
},
"Ecran0047": {
	zone: "montagne",
  titre: "Éboulement",
  texte: "Vous tombez face à un éboulement infranchissable, peut-être quelque chose de magique m'aiderai",
  image: "Lieux/Montagne/011. Montagne.png",
  choix: [
    { texte: "Essayer de franchir quand même", goto: "Ecran0047A" },
    { texte: "Revenir sur ses pas", goto: "Ecran0016" },
  ]
},
"Ecran0047A": {
	zone: "montagne",
  titre: "J'ai l'impression que je vais devoir trouver un objet qui m'aidera à franchir cet amas de pierres",
  image: "Lieux/Montagne/011. Montagne.png",
 requireAny: [
    { type: "item", value: "Pierre du Passage Complète" }
  ],
  elseGoto: "Ecran0048",

  goto: "Ecran0049"
},
"Ecran0048": {
	zone: "montagne",
  titre: "Éboulement",
  texte: "Impossible , ni de grimper ni de retirer les pierres pour passer",
  image: "Lieux/Montagne/011. Montagne.png",
  choix: [
    { texte: "Revenir sur ses pas", goto: "Ecran0016" },
  ]
},
"Ecran0049": {
    zone: "montagne",
    titre: "La voie est dégagée",
    texte: "La pierre de passage magique a complètement dégagé le chemin...",
    image: "Lieux/Montagne/012. Montagne.png",
	sound: "magic_spell_4.mp3",

    action: () => {

        if (!hasItem("Pierre du Passage Complète")) {
            return;
        }

        removeItem("Pierre du Passage Complète");
    },

    choix: [
        { texte: "Se diriger vers le temple", goto: "Ecran0101" },
        { texte: "Revenir sur ses pas", goto: "Ecran0016" },
    ]
},

"Ecran0050": {
	zone: "foret",
  titre: "Le lutin fou",
  texte: "Un petit être bondit devant vous : « AH ! Enfin quelqu’un ! Tu vas dans la montagne ? J’ai quelque chose pour mon cousin ! »",
  image: "Lieux/Foret/025. Foret.jpg",
  meetCharacter: "Lutin Foret",
  redirectIfMet: "Ecran0054",
  choix: [
    { texte: "Lui demander ce qu’il veut", goto: "Ecran0051" },
    { texte: "Accepter sans discuter", goto: "Ecran0053" },
  ]
},
"Ecran0051": {
	zone: "foret",
  titre: "La demande du lutin",
  texte: "« Donne-lui cette lettre ! C'est TRÈS important ! Enfin, je crois… » dit-il en secouant un papier froissé.",
  image: "Lieux/Foret/025. Foret.jpg",
  choix: [
    { texte: "Prendre la lettre", goto: "Ecran0053" },
    { texte: "Lui demander ce qu’elle contient", goto: "Ecran0052" },
  ]
},
"Ecran0052": {
	zone: "foret",
  titre: "Le lutin s'agite",
  texte: "« Hein ? Ce qu’elle contient ? Aucune idée ! Je l’ai écrite y’a des mois ! »",
  image: "Lieux/Foret/025. Foret.jpg",
  choix: [
    { texte: "Prendre la lettre", goto: "Ecran0053" },
  ]
},
"Ecran0053": {
	zone: "foret",
  titre: "Lettre du lutin",
  texte: "Vous recevez une lettre froissée et collante, adressée à un lutin des montagnes.",
  image: "Lieux/Foret/033. Foret.jpg",
  giveItem: "Lettre Froissée",
  alternateGotoIfOwned: "Ecran0054",
  choix: [
    { texte: "Aurais-tu autre chose à me donner ?", goto: "Ecran0054" },
    { texte: "Continuer son chemin", goto: "Ecran0070" },
  ]
},
"Ecran0054": {
	zone: "foret",
  titre: "Lutin silencieux",
  texte: "Le lutin vous regarde, l’air distrait : « Ah… c’est toi. J’ai rien d’autre pour toi. »",
  image: "Lieux/Foret/025. Foret.jpg",
  choix: [
    { texte: "Repartir", goto: "Ecran0070" },
  ]
},
"Ecran0055": {
	zone: "lac",
  titre: "Résonance visqueuse",
  texte: "La glande lumineuse dans votre sac se met à vibrer. L’octopus cligne lentement de ses huit yeux. Une voix humide résonne directement dans votre esprit : Enfin quelqu’un qui sent correctement…",
  image: "Lieux/Foret/029. Foret.jpg",
  choix: [
    { texte: "…C’est vous qui venez de parler ?", goto: "Ecran0056" },
    { texte: "Je refuse les conversations télépathiques gluantes.", goto: "Ecran0056" },
  ]
},
"Ecran0056": {
	zone: "lac",
  titre: "Dialogue céphalopodique",
  texte: "Évidemment. Je suis Grôthul l’Octopode Réfléchi. Porteur officiel des secrets humides. Tu portes la Glande. Donc tu m’entends. Donc tu es potentiellement intéressant.",
  image: "Lieux/Foret/029. Foret.jpg",
  meetCharacter: "Le poulpe",
  redirectIfMet: "Ecran0042",
  choix: [
    { texte: "Potentiellement ?", goto: "Ecran0057" },
    { texte: "Je préférerais être sec.", goto: "Ecran0057" },
  ]
},
"Ecran0057": {
	zone: "lac",
  titre: "La révélation molle",
  texte: "La Glande Lumineuse est un organe sacré du GCT : le Grand Cycle Tentaculaire. Elle brille quand le destin frissonne. Et là… ça frissonne beaucoup. L’eau autour de lui fait des bulles nerveuses.",
  image: "Lieux/Foret/029. Foret.jpg",
  choix: [
    { texte: "Vous allez me manger ?", goto: "Ecran0058" },
    { texte: "Le GCT, c'est pas un syndicat ?", goto: "Ecran0065" },
  ]
},
"Ecran0058": {
	zone: "lac",
  titre: "Offense tentaculaire",
  texte: "Te manger ? Je ne mange que les prophètes mal assaisonnés. Non. Tu es ici pour la Pierre du Passage Gauche. Une tentacule émerge lentement de l’eau.",
  image: "Lieux/Foret/029. Foret.jpg",
  choix: [
    { texte: "Pourquoi gauche ?", goto: "Ecran0059" },
    { texte: "Je prends.", goto: "Ecran0060" },
  ]
},
"Ecran0059": {
	zone: "lac",
  titre: "Philosophie latérale",
  texte: "Parce que la droite mène toujours à des escaliers inutiles. La gauche mène aux vérités inconfortables. C’est scientifique.",
  image: "Lieux/Foret/029. Foret.jpg",
  choix: [
    { texte: "Je suis prêt pour l’inconfort.", goto: "Ecran0060" },
  ]
},
"Ecran0060": {
	zone: "lac",
  titre: "Transmission humide",
  texte: "Le poulpe dépose dans votre main une pierre froide marquée d’un symbole spiralé. Utilise-la quand un choix semblera idiot. C’est généralement le bon.",
  image: "Lieux/Foret/029. Foret.jpg",
  giveItem: "Pierre du Passage Gauche",
  action: () => {

    if (!hasItem("Glande Lumineuse")) {
        return;
    }

    removeItem("Glande Lumineuse");
},

  choix: [
    { texte: "Remercier l’octopode.", goto: "Ecran0044" },
  ]
},
"Ecran0061": {
	zone: "lac",
  titre: "Approche",
  texte: "Le cerf ne fuit pas. Une boule verdâtre tombe au sol, vous la récupérez, elle se solidifie dans votre main",
  image: "Lieux/Foret/032 - Foret.jpg",
  giveItem: "Glande Lumineuse",
  onceFlag: "glande_lumineuse_pris",
  alternateGotoIfOwned: "Ecran0063",
  
  choix: [
    { texte: "Continuer", goto: "Ecran0022" },
  ]
},
"Ecran0063": {
	zone: "lac",
  titre: "Détour",
  texte: "Le cerf semble imperturbable",
  image: "Lieux/Foret/032 - Foret.jpg",
  choix: [
    { texte: "Continuer", goto: "Ecran0022" },
  ]
},
"Ecran0064": {
	zone: "lac",
  titre: "Face au cerf",
  texte: "Vous restez immobile. Le cerf incline la tête et s’éloigne en silence.",
  image: "Lieux/Foret/032 - Foret.jpg",
  choix: [
    { texte: "Retour au lac", goto: "Ecran0022" },
  ]
},
"Ecran0065": {
	zone: "lac",
  titre: "Le poulpe… encore",
  texte: "Toutes les tentacules se figent. Ne prononce pas ceci ici mon ami ! Ces derniers nous doivent encore trois marées et un cataclysme.",
  image: "Lieux/Foret/029. Foret.jpg",
  choix: [
    { texte: "Vous n’êtes pas alliés.. à ces derniers!?", goto: "Ecran0066" },
    { texte: "Je retire ce que j’ai dit.", goto: "Ecran0067" },
  ]
},
"Ecran0066": {
	zone: "lac",
  titre: "Vieille rancune",
  texte: "Disons qu'ils sont décalés, qu'ils sont fous et de gauche sûrement. Nous sommes très sensibles à ça. Une tentacule pince la glande lumineuse avec intérêt, mmmhhh...",
  image: "Lieux/Foret/029. Foret.jpg",
  choix: [
    { texte: "Donc je suis en sécurité ?", goto: "Ecran0068" },
  ]
},
"Ecran0067": {
	zone: "lac",
  titre: "Excuses marines",
  texte: "Acceptées. Nous aimons les êtres capables de rétropédalage stratégique.",
  image: "Lieux/Foret/029. Foret.jpg",
  choix: [
    { texte: "Et maintenant ?", goto: "Ecran0068" },
  ]
},
"Ecran0068": {
	zone: "lac",
  titre: "Accord tentaculaire",
  texte: "Je te confie la Pierre du Passage Gauche je sens qu'elle te sera utile dans un endroit haut et froid.",
  image: "Lieux/Foret/029. Foret.jpg",
  giveItem: "Pierre du Passage Gauche",
  action: () => {

    if (!hasItem("Glande Lumineuse")) {
        return;
    }

    removeItem("Glande Lumineuse");
},

  choix: [
    { texte: "Quitter le lac prudemment.", goto: "Ecran0069" },
  ]
},
"Ecran0069": {
	zone: "lac",
  titre: "Épilogue visqueux",
  texte: "Alors que vous partez, une dernière pensée glisse dans votre esprit : J'ai l'impression qu'ils sont tous un peu fou dans cette forêt !",
  image: "Lieux/Foret/029. Foret.jpg",
  choix: [
    { texte: "Continuer votre route.", goto: "Ecran0003" },
  ]
},
"Ecran0070": {
	zone: "foret",
  titre: "Maison forestière",
  texte: "Vous arrivez devant une petite maison de bois se tenant entre les arbres. La porte est entrouverte.",
  image: "Lieux/Foret/028. Foret.jpg",
  requiresMissingItem: "Clé Rouillée",
  alternateGotoIfOwned: "Ecran0075",
  choix: [
    { texte: "Entrer discrètement", goto: "Ecran0071" },
    { texte: "Frapper à la porte", goto: "Ecran0072" },
  ]
},
"Ecran0071": {
	zone: "foret",
  titre: "À l’intérieur",
  texte: "La maison est vide. Sur une table ce trouve un pot de miel et une clef rouillée.",
  image: "Lieux/Foret/034. Foret.jpg",
  choix: [
    { texte: "Prendre la clef", goto: "Ecran0073" },
    { texte: "Goûter le miel", goto: "Ecran0074" },
    { texte: "Sortir de la maison", goto: "Ecran0070" },
  ]
},
"Ecran0072": {
	zone: "foret",
  titre: "Porte close",
  texte: "Personne ne répond. Le silence est lourd.",
  image: "Lieux/Foret/028. Foret.jpg",
  choix: [
    { texte: "Entrer quand même", goto: "Ecran0071" },
    { texte: "Repartir en direction du lac", goto: "Ecran0022" },
    { texte: "Retourner vers le panneau", goto: "Ecran0002" },
  ]
},
"Ecran0073": {
	zone: "foret",
  titre: "La clef rouillée",
  texte: "Vous prenez la clef rouillée. Elle semble très ancienne.",
  image: "Lieux/Foret/034. Foret.jpg",
  giveItem: "Clé Rouillée",
  choix: [
    { texte: "Goûter le miel", goto: "Ecran0074" },
    { texte: "Sortir de la maison", goto: "Ecran0075" },
  ]
},
"Ecran0074": {
	zone: "foret",
  titre: "Miel étrange",
  texte: "Le miel apaise votre esprit. Votre folie semble diminuer…",
  image: "Lieux/Foret/034. Foret.jpg",
  sound: "folieDown",
  choix: [
    { texte: "Sortir de la maison", goto: "Ecran0075" },
  ]
},
"Ecran0075": {
	zone: "foret",
  titre: "Maison forestière",
  texte: "Il semble qu'il n'y est plus rien dans cette maison",
  image: "Lieux/Foret/028. Foret.jpg",
  choix: [
    { texte: "Repartir en direction du lac", goto: "Ecran0022" },
    { texte: "Retourner vers le panneau", goto: "Ecran0002" },
    { texte: "Suivre une étrange lumière verte", goto: "Ecran0090" },
  ]
},
"Ecran0079": {
	zone: "donjon",
  titre: "Salle du coffre",
  texte: "Sans la clé je ne pourrais pas ouvrir ce coffre !",
  image: "Lieux/Foret/046. Foret.jpg",
  choix: [
    { texte: "Revenir au début du tumulus", goto: "Ecran0023" },
  ]
},
"Ecran0080": {
	zone: "donjon",
  titre: "Tumulus – Couloir principal",
  texte: "Le tunnel s’enfonce en lignes brisées. Les murs semblent vibrer légèrement.",
  image: "Lieux/Foret/041. Foret.jpg",
  choix: [
    { texte: "Aller tout droit", goto: "Ecran0081" },
    { texte: "Tourner à gauche", goto: "Ecran0084" },
    { texte: "Tourner à droite", goto: "Ecran0083" },
  ]
},
"Ecran0081": {
	zone: "donjon",
  titre: "Ghorbin le gnome-tunnel",
  texte: "AH ! Un visiteur ! Salutation je m'appelle Ghorbin, j’adore les visiteurs. Vous avez de beaux genoux. Puis-je les voler ? Ha !",
  image: "Lieux/Foret/045. Foret.png",
  choix: [
    { texte: "Reculer lentement", goto: "Ecran0080" },
    { texte: "Partir à droite", goto: "Ecran0082" },
    { texte: "Suivre Ghorbin qui part en courant !", goto: "Ecran0085" },
  ]
},
"Ecran0082": {
	zone: "donjon",
  titre: "Impasse suintante",
  texte: "Le tunnel se termine sur un mur noirci par la moisissure.",
  image: "Lieux/Foret/041. Foret.jpg",
  choix: [
    { texte: "Revenir sur vos pas", goto: "Ecran0081" },
  ]
},
"Ecran0083": {
	zone: "donjon",
  titre: "Passage tournant",
  texte: "Je suis revenu au début, comment est-ce possible ? Plus vous avancez plus vous avez l’étrange sensation de revenir sur vos pas.",
  image: "Lieux/Foret/041. Foret.jpg",
  choix: [
    { texte: "Continuer obstinément", goto: "Ecran0088" },
    { texte: "Revenir", goto: "Ecran0080" },
  ]
},
"Ecran0084": {
	zone: "donjon",
  titre: "Couloir en ruine",
  texte: "Des pierres tombent parfois du plafond comme si le tumulus respirait.",
  image: "Lieux/Foret/043. Foret.jpg",
  choix: [
    { texte: "Continuer vers la gauche", goto: "Ecran0081" },
    { texte: "Revenir au début", goto: "Ecran0080" },
  ]
},
"Ecran0085": {
	zone: "donjon",
  titre: "Ghorbin encore",
  texte: "Ghorbin apparaît au détour d'un couloir : Ici la gauche va à droite et la droite va au mauvais endroit ! Ou l’inverse… j'ne sais plus..",
  image: "Lieux/Foret/042. Foret.png",
  choix: [
    { texte: "Suivre ses conseils qui semble peu fiable", goto: "Ecran0086" },
    { texte: "Aller dans la direction opposée", goto: "Ecran0087" },
  ]
},
"Ecran0086": {
	zone: "donjon",
  titre: "Salle du coffre",
  texte: "Un coffre trône au milieu de la pièce. Sa serrure rouillée semble fragile.",
  image: "Lieux/Foret/046. Foret.jpg",
  choix: [
    { texte: "Essayer d'ouvrir la serrure", goto: "Ecran0086A" },
  ]
},
"Ecran0086A": {
	zone: "donjon",
  titre: "Ouverture du coffre",
  image: "Lieux/Foret/046. Foret.jpg",

  requireAny: [
    { type: "item", value: "Clé Rouillée" }
  ],
  elseGoto: "Ecran0079",

  goto: "Ecran0089"
},
"Ecran0087": {
	zone: "donjon",
  titre: "Impasse des ossements",
  texte: "Un tas d’ossements brisés jonche le sol. Mieux vaut ne pas rester ici.",
  image: "Lieux/Foret/047. Foret.jpg",
  choix: [
    { texte: "Revenir", goto: "Ecran0080" },
  ]
},
"Ecran0088": {
	zone: "donjon",
  titre: "Impasse mouvante",
  texte: " Le tumulus change… même les couleurs sont étranges !",
  image: "Lieux/Foret/048. Foret.jpg",
  choix: [
    { texte: "Revenir", goto: "Ecran0083" },
  ]
},
"Ecran0089": {
	zone: "donjon",
  titre: "Salle du trésor",
  texte: "Le coffre s’ouvre dans un craquement. Une énergie magique s'en échappe..",
  image: "Lieux/Foret/049. Foret.jpg",
  sound: "coffre",
  choix: [
    { texte: "Fouillez le coffre", goto: "Ecran0089A" },
  ]
},
"Ecran0089A": {
	zone: "donjon",
  titre: "Salle du trésor",
  texte: "Vous trouvez une moitié de pierre vibrante, elle ne semble pas complète",
  image: "Lieux/Foret/040. Foret.jpg",
  giveItem: "Pierre du Passage Droite",
    onceFlag: "pierre_passage_droite_recuperee",
  alternateGotoIfOwned: "Ecran0089B",
  choix: [
    { texte: "Vous récupérez une moitié de pierre magique.", goto: "Ecran0013" },
  ]
},
"Ecran0089B": {
	zone: "donjon",
  titre: "Salle du trésor",
  texte: "Le coffre est vide, je pense qu'il n'y a plus rien à trouver dans ces tunnels,",
  image: "Lieux/Foret/049. Foret.jpg",
  choix: [
    { texte: "Retourner à l'entrée du tumulus", goto: "Ecran0023" },
  ]
},
"Ecran0090": {
	zone: "foret",
  titre: "Maison de la sorcière",
  texte: "Une maison biscornue pulse d’une lumière verte.",
  image: "Lieux/Foret/035. Foret.jpg",
  choix: [
    { texte: "Entrer sans frapper", goto: "Ecran0091" },
    { texte: "Frapper à la porte", goto: "Ecran0092" },
    { texte: "S’éloigner", goto: "Ecran0014" },
  ]
},
"Ecran0091": {
	zone: "foret",
  titre: "Antre de la sorcière",
  texte: "Une femme en manteau noir manipule une potion fumante. « QUI OSE ? »",
  image: "Lieux/Foret/026. Foret.jpg",
  choix: [
    { texte: "Je ne suis personne mais j'aurais besoin de votre aide pour allumer ma torche", goto: "Ecran0093" },
    { texte: "Rester silencieux", goto: "Ecran0094" },
    { texte: "Sortir en courant", goto: "Ecran0090" },
  ]
},
"Ecran0092": {
	zone: "foret",
  titre: "Surprise",
  texte: "La sorcière ouvre brusquement : « QUI OSE ? »",
  image: "Lieux/Foret/036. Foret.jpg",
  choix: [
    { texte: "Auriez-vous du feu pour allumer ma torche ?", goto: "Ecran0093" },
    { texte: "S’excuser", goto: "Ecran0094" },
    { texte: "Fuir", goto: "Ecran0090" },
  ]
},
"Ecran0093": {
	zone: "foret",
  titre: "Le pacte",
  texte: "« J’allumerai ta torche… mais j’ai besoin d'un parchemin elfique et d'un bout de bois bien sûr ! »",
  image: "Lieux/Foret/036. Foret.jpg",

  choix: [
    { texte: "Un parchemin elfique !", goto: "Ecran0093A" },
    { texte: "Je n'ai pas ces objets", goto: "Ecran0094" }
  ]
},
"Ecran0093A": {
	zone: "foret",
  titre: "Allumer la torche à l'aide du parchemin",
  image: "Lieux/Foret/036. Foret.jpg",

  requireAll: [
    { type: "item", value: "Parchemin Elfique" },
    { type: "item", value: "Torche" }
  ],
  elseGoto: "Ecran0099",

  goto: "Ecran0096"
},

"Ecran0094": {
	zone: "foret",
  titre: "Rejet",
  texte: "« Reviens avec les objets que j'ai cité »",
  image: "Lieux/Foret/036. Foret.jpg",
  choix: [
    { texte: "S'en aller", goto: "Ecran0090" },
  ]
},
"Ecran0095": {
	zone: "foret",
  titre: "Indifférence",
  texte: "La sorcière ne vous accorde plus un regard. « Je suis occupée. »",
  image: "Lieux/Foret/026. Foret.jpg",
  choix: [
    { texte: "Partir", goto: "Ecran0014" },
  ]
},
"Ecran0096": {
	zone: "foret",
  titre: "Flamme elfique",
  texte: "La sorcière brûle le parchemin et enflamme ta torche.",
  image: "Lieux/Foret/036. Foret.jpg",
  sound: "trash",

action: () => {
    if (!hasItem("Parchemin Elfique")) {
        return;
    }
	
	removeItem("Parchemin Elfique");
	removeItem("Torche");

    addItemToInventory("Torche Allumée");
	onceFlag("torche_allumee_trouve");
},

  alternateGotoIfOwned: "Ecran0095",

  choix: [
    { texte: "Et la lumière fut !", goto: "Ecran0098" },
    { texte: "Sorcière", goto: "Ecran0095" }
  ]
},

"Ecran0098": {
	zone: "foret",
  titre: "Dehors",
  texte: "La torche enchantée crépite doucement.",
  image: "Lieux/Foret/037. Foret.png",
  sound: "torch",
  choix: [
    { texte: "Retourner dans la forêt", goto: "Ecran0001" },
  ]
},
"Ecran0099": {
	zone: "foret",
  titre: "Il manque un élément",
  texte: "« T'es bête ou quoi !? Sans un des éléments je ne peux rien faire. »",
  image: "Lieux/Foret/036. Foret.jpg",
  choix: [
    { texte: "Revenir", goto: "Ecran0093" },
    { texte: "Partir", goto: "Ecran0090" }
  ]
},
"Ecran0100": {
	zone: "foret",
  titre: "Maison de la sorcière",
  texte: "Je n'ai plus rien à faire dans la maison de l'autre folle de sorcière !",
  image: "Lieux/Foret/035. Foret.jpg",
  choix: [
    { texte: "Retourner au panneau", goto: "Ecran0002" },
  ]
},
"Ecran0101": {
	zone: "montagne",
  titre: "Le temple démoniaque",
  texte: "Vous arrivez face à un jolie temple pris dans la neige, tout autour il y a des statues qui semblent appartenir à une divinité démoniaque",
  image: "Lieux/Montagne/013. Montagne.png",
  choix: [
    { texte: "S'approcher d'une des statues", goto: "Ecran0102" },
    { texte: "Allez devant la porte d'entrée", goto: "Ecran0103" },
    { texte: "Faire le tour du temple", goto: "Ecran0104" },
  ]
},
"Ecran0102": {
	zone: "montagne",
  titre: "La statue qui vous regarde",
  texte: "Où que vous alliez, les yeux de pierre jaunes vous suivent, Même les héros n’aiment pas être jugés par un caillou immortel.",
  image: "Lieux/Montagne/014. Montagne.png",
  meetCharacter: "Statue Démoniaque",
  redirectIfMet: "Ecran0118",
  choix: [
    { texte: "Adresser la parole à la statue", goto: "Ecran0105" },
    { texte: "Arrête de me regarder", goto: "Ecran0106" },
  ]
},
"Ecran0103": {
	zone: "montagne",
  titre: "La porte du temple",
  texte: "Vous arrivez devant la lourde porte de bois du temple, couverte de runes anciennes qui frémissent doucement un léger murmure : « Non, ça ne s’ouvrira pas gratuitement. »",
  image: "Lieux/Montagne/015. Montagne.png",
  choix: [
    { texte: "Qui me parle ?", goto: "Ecran0107" },
    { texte: "Essayer d'ouvrir la porte", goto: "Ecran0108" },
    { texte: "Se diriger vers la statue", goto: "Ecran0102" },
  ]
},
"Ecran0104": {
	zone: "musicien",
  titre: "Le musicien fou",
  texte: "Après avoir fait le tour du temple, vous tombez sur un musicien fou, soufflant et tapotant dans un instrument improbable aux sons interdits.",
  image: "Lieux/Montagne/006. Montagne.jpg",
  choix: [
    { texte: "Aller à sa rencontre", goto: "Ecran0128" },
    { texte: "Repartir vers la porte", goto: "Ecran0103" },
    { texte: "Allez vers la statue", goto: "Ecran0102" },
  ]
},
"Ecran0105": {
	zone: "montagne",
  titre: "La statue qui vous regarde",
  texte: "« Vous voilà enfin. Avant de continuer, acceptez-vous d’entendre la parole de Morbélios, le Dévoreur de Soleils ? »",
  image: "Lieux/Montagne/014. Montagne.png",
  choix: [
    { texte: "Non, je cherche juste la sortie.", goto: "Ecran0109" },
    { texte: "Ça dépend, il sacrifie quoi ?", goto: "Ecran0110" },
    { texte: "Mmmmmh… je n’ai rien de mieux à faire.", goto: "Ecran0111" },
  ]
},
"Ecran0106": {
	zone: "montagne",
  titre: "La statue qui vous regarde",
  texte: "« Cela fait bien longtemps qu'il n'y a pas eu d'agitation dans les parages, je ne peux pas m'en empêcher !! J'ai une énigme pour toi, mortel : Qu’est-ce qui marche sans pieds, parle sans bouche et ment toujours ? »",
  image: "Lieux/Montagne/014. Montagne.png",
  choix: [
    { texte: "Vous", goto: "Ecran0112" },
    { texte: "Un ver de terre ?", goto: "Ecran0113" },
    { texte: "Un cultiste du temple qui se trouve à côté, c'est ça c'est sûr ?", goto: "Ecran0114" },
  ]
},
"Ecran0107": {
	zone: "montagne",
  titre: "La porte du temple",
  texte: "Le murmure disparaît, vous n'entendez plus rien, il semblerai que je ne vais pas pouvoir rentrer facilement",
  image: "Lieux/Montagne/015. Montagne.png",
  meetCharacter: "Temple",
  redirectIfMet: "Ecran0125",
  choix: [
    { texte: "Insister, êtes-vous là ?", goto: "Ecran0119" },
    { texte: "Essayer d'ouvrir la porte", goto: "Ecran0108" },
  ]
},
"Ecran0108": {
	zone: "montagne",
  titre: "La porte du temple",
  texte: "Une douleur vous prend au cerveau ! La porte se métamorphose et les runes se mettent à tournoyer d'une lumière jaune en son centre",
  image: "Lieux/Montagne/016. Montagne.png",
  sound: "folieUp",
  choix: [
    { texte: "Essayer de communiquez avec les murmures", goto: "Ecran0120" },
  ]
},
"Ecran0109": {
	zone: "montagne",
  titre: "La statue qui vous regarde",
  texte: "« La sortie est un mensonge inventé par ceux qui refusent Morbélios. J'ai une énigme pour toi, mortel : Qu’est-ce qui marche sans pieds, parle sans bouche et ment toujours ? »",
  image: "Lieux/Montagne/014. Montagne.png",
  choix: [
    { texte: "Vous", goto: "Ecran0112" },
    { texte: "Un ver de terre ?", goto: "Ecran0113" },
    { texte: "Un cultiste du temple qui se trouve à côté, c'est ça c'est sûr ?", goto: "Ecran0114" },
  ]
},
"Ecran0110": {
	zone: "montagne",
  titre: "La statue qui vous regarde",
  texte: "« Principalement l’espoir. Et parfois les genoux. J'ai une énigme pour toi, mortel : Qu’est-ce qui marche sans pieds, parle sans bouche et ment toujours ? »",
  image: "Lieux/Montagne/014. Montagne.png",
  choix: [
    { texte: "Vous", goto: "Ecran0112" },
    { texte: "Un ver de terre ?", goto: "Ecran0113" },
    { texte: "Un cultiste du temple qui se trouve à côté, c'est ça c'est sûr ?", goto: "Ecran0114" },
  ]
},
"Ecran0111": {
	zone: "montagne",
  titre: "La statue qui vous regarde",
  texte: "« Excellent état d’esprit. La foi commence par l’ennui. J'ai une énigme pour toi, mortel : Qu’est-ce qui marche sans pieds, parle sans bouche et ment toujours ? »",
  image: "Lieux/Montagne/014. Montagne.png",
  choix: [
    { texte: "Vous", goto: "Ecran0112" },
    { texte: "Un ver de terre ?", goto: "Ecran0113" },
    { texte: "Un cultiste du temple qui se trouve à côté, c'est ça c'est sûr ?", goto: "Ecran0114" },
  ]
},
"Ecran0112": {
	zone: "montagne",
  titre: "La statue qui vous regarde",
  texte: "« Correct. L’honnêteté est surfait chez nous. Une autre : Qu’abandonne-t-on pour gagner, et gagne-t-on en l’abandonnant ? »",
  image: "Lieux/Montagne/014. Montagne.png",
  choix: [
    { texte: "Le libre arbitre", goto: "Ecran0115" },
    { texte: "La raison", goto: "Ecran0116" },
    { texte: "Mes chaussures, visiblement", goto: "Ecran0117" },
  ]
},
"Ecran0113": {
	zone: "montagne",
  titre: "La statue qui vous regarde",
  texte: "« Acceptable… Morbélios apprécie le cynisme. Une autre : Qu’abandonne-t-on pour gagner, et gagne-t-on en l’abandonnant ? »",
  image: "Lieux/Montagne/014. Montagne.png",
  choix: [
    { texte: "Le libre arbitre", goto: "Ecran0115" },
    { texte: "La raison", goto: "Ecran0116" },
    { texte: "Mes chaussures, visiblement", goto: "Ecran0117" },
  ]
},
"Ecran0114": {
	zone: "montagne",
  titre: "La statue qui vous regarde",
  texte: "Vous sentez une douleur au cerveau ! « Faux, mais audacieux. Vous serez recyclé. Une autre : Qu’abandonne-t-on pour gagner, et gagne-t-on en l’abandonnant ? »",
  image: "Lieux/Montagne/014. Montagne.png",
  sound: "folieUp",
  choix: [
    { texte: "Le libre arbitre", goto: "Ecran0115" },
    { texte: "La raison", goto: "Ecran0116" },
    { texte: "Mes chaussures, visiblement", goto: "Ecran0117" },
  ]
},
"Ecran0115": {
	zone: "montagne",
  titre: "La statue qui vous regarde",
  texte: "« Magnifique. Morbélios vous observe déjà intensément. Félicitations. Vous êtes désormais un peu moins libre. »",
  image: "Lieux/Montagne/014. Montagne.png",
  choix: [
    { texte: "Toucher la statue", goto: "Ecran0118" },
    { texte: "Allez devant la porte d'entrée", goto: "Ecran0103" },
    { texte: "Faire le tour du temple", goto: "Ecran0104" },
  ]
},
"Ecran0116": {
	zone: "montagne",
  titre: "La statue qui vous regarde",
  texte: "« Exact. Vous êtes prêt pour le chœur des murmures. Félicitations. Vous êtes désormais un peu moins libre. »",
  image: "Lieux/Montagne/014. Montagne.png",
  choix: [
    { texte: "S'agiter en faisant des grands mouvements de bras", goto: "Ecran0118" },
    { texte: "Allez devant la porte d'entrée", goto: "Ecran0103" },
    { texte: "Faire le tour du temple", goto: "Ecran0104" },
  ]
},
"Ecran0117": {
	zone: "montagne",
  titre: "La statue qui vous regarde",
  texte: "Vous sentez une douleur au cerveau ! « Insolent… mais Morbélios aime l’ironie. Conversion partielle acceptée. Félicitations. Vous êtes désormais un peu moins libre. »",
  image: "Lieux/Montagne/014. Montagne.png",
  sound: "folieUp",
  choix: [
    { texte: "Allez devant la porte d'entrée", goto: "Ecran0103" },
    { texte: "Faire le tour du temple", goto: "Ecran0104" },
    { texte: "Continuer le chemin en contre bas", goto: "Ecran0126" },
  ]
},  
"Ecran0118": {
	zone: "montagne",
  titre: "La statue qui vous regarde",
  texte: "La statue reste muette, cependant elle ne cesse de vous dévisager !",
  image: "Lieux/Montagne/014. Montagne.png",
  choix: [
    { texte: "Allez devant la porte d'entrée", goto: "Ecran0103" },
    { texte: "Faire le tour du temple", goto: "Ecran0104" },
  ]
},
"Ecran0119": {
	zone: "montagne",
  titre: "La porte du temple",
  texte: "Votre cerveau vous fait souffrir ! La porte change de forme subitement « Nul ne franchira ces portes sans l'objet de désire de Morbélios »",
  image: "Lieux/Montagne/016. Montagne.png",
  sound: "folieUp",
  choix: [
    { texte: "De quel objet parlez-vous ?", goto: "Ecran0121" },
    { texte: "A quoi ressemble cet objet ?", goto: "Ecran0122" },
  ]
},
"Ecran0120": {
	zone: "montagne",
  titre: "La porte du temple",
  texte: "« Nul ne franchira ces portes sans l'objet de désire de Morbélios »",
  image: "Lieux/Montagne/016. Montagne.png",
  choix: [
    { texte: "De quel objet parlez-vous ?", goto: "Ecran0121" },
    { texte: "A quoi ressemble cet objet ?", goto: "Ecran0122" },
  ]
},
"Ecran0121": {
	zone: "montagne",
  titre: "La porte du temple",
  texte: "L'objet qui ferait plier l'esprit de Morbélios n'est pas de ce monde mais se trouve dans ces montagnes.",
  image: "Lieux/Montagne/016. Montagne.png",
  choix: [
    { texte: "A quoi ressemble cet objet ?", goto: "Ecran0122" },
    { texte: "Je reviendrais une fois l'objet en ma possession", goto: "Ecran0123" },
  ]
},
"Ecran0122": {
	zone: "montagne",
  titre: "La porte du temple",
  texte: "Quand tu le verras, tu comprendras et tu ouvrira ton âme à Morbélios,",
  image: "Lieux/Montagne/016. Montagne.png",
  choix: [
    { texte: "Je reviendrais une fois l'objet en ma possession", goto: "Ecran0123" },
  ]
},
"Ecran0123": {
	zone: "montagne",
  titre: "La porte du temple",
  texte: "Ahahahahah.. j'ai hâte de voir ça !!",
  image: "Lieux/Montagne/016. Montagne.png",
  choix: [
    { texte: "Que veux-tu dire ?", goto: "Ecran0124" },
  ]
},
"Ecran0124": {
	zone: "montagne",
  titre: "La porte du temple",
  texte: "Les murmures se sont arrêtés ! L'énergie centrale de la porte continue à tourner et briller de jaune..",
  image: "Lieux/Montagne/016. Montagne.png",
  choix: [
    { texte: "Ouhou ! Il y a quelqu'un ?", goto: "Ecran0125" },
  ]
},
"Ecran0125": {
	zone: "montagne",
  titre: "La porte du temple",
  texte: "Seul le bruit de l'énergie magique et du souffle du vent résonnent devant la porte.",
  image: "Lieux/Montagne/016. Montagne.png",
  choix: [
    { texte: "Faire le tour du temple", goto: "Ecran0104" },
    { texte: "Se diriger vers la statue", goto: "Ecran0102" },
    { texte: "Continuer le chemin en contre bas", goto: "Ecran0126" },
  ]
},
"Ecran0126": {
	zone: "montagne",
  titre: "Le puit",
  texte: "Le temps devient étrange, on dirais que la nuit tombe et que le ciel s’assombrit, mais lorsque vous regarder vers le temple le jour est  présent.",
  image: "Lieux/Montagne/002. Montagne.jpg",
  choix: [
    { texte: "Jeter un œil dans le puit", goto: "Ecran0000" },
    { texte: "Se rendre vers la maison que vous apercevez au loin", goto: "Ecran0127" },
  ]
},
"Ecran0127": {
	zone: "montagne",
  titre: "Maison de montagne",
  texte: "Vous approchez de la maison, devant celle-ci se trouve un homme bourru qui vous regarde d'un air étrange",
  image: "Lieux/Montagne/007. Montagne.jpg",
  choix: [
    { texte: "S'approchez de lui", goto: "Ecran0000A" },
    { texte: "Repartir vers le puit", goto: "Ecran0000A" },
    { texte: "Continuer son chemin", goto: "Ecran0000A" },
  ]
},
"Ecran0128": {
	zone: "musicien",
  titre: "Le musicien fou",
  texte: "« Oh… un auditeur. Rare. Fragile. ♪ doooom »",
  image: "Lieux/Montagne/018. Montagne.png",
  meetCharacter: "Musicien Fou",
  redirectIfMet: "Ecran0142",
  choix: [
    { texte: "Quel est cet instrument ?", goto: "Ecran0129" },
    { texte: "Vous êtes perdu ?", goto: "Ecran0130" },
    { texte: "Cette musique… elle me fait mal aux oreilles.", goto: "Ecran0131" },
  ]
},
"Ecran0129": {
	zone: "musicien",
  titre: "Le musicien fou",
  texte: "« Un morbhorn. Accordé sur la peur. Cadeau de Morbélios… ♪ braaah, Petit jeu. Si tu gagnes… récompense. Si tu perds… concert. ♪ do-do-do »",
  image: "Lieux/Montagne/018. Montagne.png",
  choix: [
    { texte: "Je suis quelqu'un de joueur, mais je manque encore de connaissance sur le sujet", goto: "Ecran0132" },
    { texte: "Mmmh non merci.. je ne préfère pas !", goto: "Ecran0133" },
  ]
},
"Ecran0130": {
	zone: "musicien",
  titre: "Le musicien fou",
  texte: "« Perdu ? Non. Consacré. ♪ ti-ti-ti, Petit jeu. Si tu gagnes… récompense. Si tu perds… concert. ♪ do-do-do »",
  image: "Lieux/Montagne/018. Montagne.png",
  choix: [
    { texte: "Je suis quelqu'un de joueur, mais je manque encore de connaissance sur le sujet", goto: "Ecran0132" },
    { texte: "Mmmh non merci.. je ne préfère pas !", goto: "Ecran0133" },
  ]
},
"Ecran0131": {
	zone: "musicien",
  titre: "Le musicien fou",
  texte: "« C’est normal. La vérité pique. ♪ gnnnng, Petit jeu. Si tu gagnes… récompense. Si tu perds… concert. ♪ do-do-do »",
  image: "Lieux/Montagne/018. Montagne.png",
  choix: [
    { texte: "Je suis quelqu'un de joueur, mais je manque encore de connaissance sur le sujet", goto: "Ecran0132" },
    { texte: "Mmmh non merci.. je ne préfère pas !", goto: "Ecran0133" },
  ]
},
"Ecran0132": {
	zone: "musicien",
  titre: "Le musicien fou",
  texte: "« Qui est le chanteur sacré du culte de Morbléios ? »",
  image: "Lieux/Montagne/018. Montagne.png",
  choix: [
    { texte: "En impro totale : Le Chœur des Sans-Langue", goto: "Ecran0134" },
    { texte: "Morbélios himself ?", goto: "Ecran0135" },
    { texte: "D'après ce que j'entends.. Vous ?", goto: "Ecran0136" },
  ]
},
"Ecran0133": {
	zone: "musicien",
  titre: "Le musicien fou",
  texte: "Le musicien fou.. lance un accord et vous paralise le corps ! « Je ne te laisse pas le choix.. Qui est le chanteur sacré du culte de Morbléios ? »",
  image: "Lieux/Montagne/018. Montagne.png",
  choix: [
    { texte: "En impro totale : Le Chœur des Sans-Langue", goto: "Ecran0134" },
    { texte: "Morbélios himself ?", goto: "Ecran0135" },
    { texte: "D'après ce que j'entends.. Vous ?", goto: "Ecran0136" },
  ]
},
"Ecran0134": {
	zone: "musicien",
  titre: "Le musicien fou",
  texte: "« Il semblerait que tu as vu juste.. L'impro est ce qui nous correspond, par contre il chante mal.. mais c'est voulu ! Dernière note. Pourquoi la musique plaît à Morbélios ? ♪ do… »",
  image: "Lieux/Montagne/018. Montagne.png",
  choix: [
    { texte: "« Parce qu’elle enchaîne les âmes »", goto: "Ecran0137" },
    { texte: "« Parce qu’elle fait souffrir »", goto: "Ecran0138" },
    { texte: "« Parce qu’il n’a pas d’oreilles ? »", goto: "Ecran0139" },
  ]
},
"Ecran0135": {
	zone: "musicien",
  titre: "Le musicien fou",
  texte: "« Faux. Il hurle, et ne sait chanter qu'avec ses fesse.. en plus ça pu !. ♪ bwom. Dernière note. Pourquoi la musique plaît à Morbélios ? ♪ do… »",
  image: "Lieux/Montagne/018. Montagne.png",
  choix: [
    { texte: "« Parce qu’elle enchaîne les âmes »", goto: "Ecran0137" },
    { texte: "« Parce qu’elle fait souffrir »", goto: "Ecran0138" },
    { texte: "« Parce qu’il n’a pas d’oreilles ? »", goto: "Ecran0139" },
  ]
},
"Ecran0136": {
	zone: "musicien",
  titre: "Le musicien fou",
  texte: "« Flatteur mais dangereux tout de même ♪ piiing. Dernière note. Pourquoi la musique plaît à Morbélios ? ♪ do… »",
  image: "Lieux/Montagne/018. Montagne.png",
  choix: [
    { texte: "« Parce qu’elle enchaîne les âmes »", goto: "Ecran0137" },
    { texte: "« Parce qu’elle fait souffrir »", goto: "Ecran0138" },
    { texte: "« Parce qu’il n’a pas d’oreilles ? »", goto: "Ecran0139" },
  ]
},
"Ecran0137": {
	zone: "musicien",
  titre: "Le musicien fou",
  texte: "« Très juste. Très inquiétant., mais faux Shtoiiiing ♪ Recommence »",
  image: "Lieux/Montagne/018. Montagne.png",
  choix: [
    { texte: "« Parce qu’elle bouleverse les âmes »", goto: "Ecran0137" },
    { texte: "« Parce qu’elle fait souffrir beaucoup »", goto: "Ecran0138" },
    { texte: "« Parce qu’il n’a pas de nez ? »", goto: "Ecran0139" },
  ]
},
"Ecran0138": {
	zone: "musicien",
  titre: "Le musicien fou",
  texte: "« Oui. Simple. Efficace. ♪ Tu as joué. Tu as écouté. Prends. ♪ cliiing »",
  image: "Lieux/Montagne/018. Montagne.png",
  choix: [
    { texte: "Prendre ce que le musicien vous tend !", goto: "Ecran0141" },
  ]
},
"Ecran0139": {
	zone: "musicien",
  titre: "Le musicien fou",
  texte: "« …Peut-être. Personne n’a vérifié. plooong ♪ »",
  image: "Lieux/Montagne/018. Montagne.png",
  choix: [
    { texte: "« Parce qu’elle bouleverse les âmes »", goto: "Ecran0137" },
    { texte: "« Parce qu’elle fait souffrir beaucoup »", goto: "Ecran0138" },
    { texte: "« Parce qu’il n’a pas de nez ? »", goto: "Ecran0139" },
  ]
},
"Ecran0140": {
	zone: "musicien",
  titre: "Le musicien fou",
  texte: "« Réessaye.. tu n'as pas du bien comprendre la question.. Splouuungiiii ♪ »",
  image: "Lieux/Montagne/018. Montagne.png",
  choix: [
    { texte: "« Parce qu’elle bouleverse les âmes »", goto: "Ecran0137" },
    { texte: "« Parce qu’elle fait souffrir beaucoup »", goto: "Ecran0138" },
    { texte: "« Parce qu’il n’a pas de nez ? »", goto: "Ecran0139" },
  ]
},
"Ecran0141": {
	zone: "musicien",
  titre: "Corde",
  texte: "Il vous tend une corde usée mais qui semble fonctionnelle.",
  image: "Lieux/Montagne/017. Montagne.png",
  giveItem: "Corde",
  choix: [
    { texte: "Prendre la corde", goto: "Ecran0142" },
  ]
},
"Ecran0142": {
	zone: "musicien",
  titre: "Le musicien fou",
  texte: "Le musicien fou semble en pleine création musicale, les sons qui parviennent à vos oreilles sont  désagréables, il a les yeux révulsés et ne semble plus dans la réalité.",
  image: "Lieux/Montagne/018. Montagne.png",
  choix: [
    { texte: "Repartir vers la porte", goto: "Ecran0103" },
    { texte: "Allez vers la statue", goto: "Ecran0102" },
    { texte: "Continuer le chemin en contre bas", goto: "Ecran0126" },
  ]
},
"Ecran0143": {
	zone: "champignon",
  titre: "Une excroissance rouge",
  texte: "Au détour du sentier, un champignon gigantesque bloque presque la clairière.",
  image: "Lieux/Champignon/001. champignon.png",

  folieVariants: {
    5: {
      texte: "Vous sentez la folie vous envahir, le rouge du champignon semble légèrement plus sombre.",
	  image: "Lieux/Champignon/001. champignon_A.png",
	  sound: "madness"
    },
    10: {
      texte: "Vous sentez la folie vous envahir, le champignon incline légèrement son chapeau. — Tu reviens.",
      image: "Lieux/Champignon/001. distordue.png",
	  sound: "madness"
    },
    15: {
      texte: "Vous sentez la folie vous envahir, le champignon change de forme et vous dit : Tu es enfin prêt !! Le champignon respire au même rythme que toi.",
      image: "Lieux/Champignon/001. distordue.png",
	  sound: "madness"
    }
  },

  choix: [
    { texte: "S’approcher encore", goto: "Ecran0144" },
    { texte: "Essayer de fuir", goto: "Ecran0144" },
  ]
},
"Ecran0144": {
	zone: "champignon",
  titre: "La voix humide",
  texte: "Le temps change à la vitesse de l'éclair, le champignon brille de mille feux. Enfin. La voix semble vibrer directement dans votre poitrine.",
  image: "Lieux/Champignon/002. champignon.png",
  
    folieVariants: {
    5: {
      texte: "La folie prend le dessus, le rouge du champignon semble légèrement plus sombre ou n'est-ce qu'une impression.",
	  image: "Lieux/Champignon/002. champignon_A.png",
	  sound: "madness"
    },
    10: {
      texte: "La folie prend le dessus, tu fais semblant de ne pas me reconnaître ? La lumière semble s'intensifier.",
      image: "Lieux/Champignon/002. distordue.png",
	  sound: "madness"
    },
    15: {
      texte: "La folie prend le dessus, tu fais semblant de ne pas me reconnaître ? Le champignon ouvre la bouche et ricane.",
      image: "Lieux/Champignon/002. distordue.png",
	  sound: "madness"
    }
  },
  
  choix: [
    { texte: "Qui parle ?", goto: "Ecran0145" },
    { texte: "Essayer de comprendre", goto: "Ecran0146" },
  ]
},
"Ecran0145": {
	zone: "champignon",
  titre: "Annonce absurde",
  texte: "Nous sommes en 2026. Le nombre résonne étrangement. Êtes-vous certain que vous êtes dans la bonne époque ?",
  image: "Lieux/Champignon/002. champignon.png",
  choix: [
    { texte: "Que signifie 2026 ?", goto: "Ecran0147" },
    { texte: "C’est insensé.", goto: "Ecran0146" },
  ]
},
"Ecran0146": {
	zone: "champignon",
  titre: "Refus instinctif",
  texte: "Votre cœur s'accélère. Les images ne sont plus réalité, une lumière intense passe entre les arbre et le champignon n'est plus.. Parler à un champignon n’est déjà pas raisonnable. L’écouter parler d’une époque inconnue l’est encore moins.",
  image: "Lieux/Champignon/003. champignon.png",
  choix: [
    { texte: "Fermer les yeux et essayer de revenir à la réalité", goto: "Ecran0147" },
    { texte: "Se boucher les oreilles", goto: "Ecran0147" },
  ]
},
"Ecran0147": {
	zone: "champignon",
  titre: "Le Wi‑Fi",
  texte: "Votre vision semble altéré une fois de plus ! Le son résonne dans votre tête. En 2026, les humains prient le Wi‑Fi. Il prononce ce mot comme une prière sacrée. Une divinité invisible qui relie tous les esprits.",
  image: "Lieux/Champignon/004. champignon.png",
  choix: [
    { texte: "Se moquer du champignon", goto: "Ecran0148" },
    { texte: "En savoir plus", goto: "Ecran0148" },
  ]
},
"Ecran0148": {
	zone: "champignon",
  titre: "Rectangle lumineux",
  texte: "Ils fixent des rectangles lumineux pendant des heures. Quand la divinité disparaît… ils paniquent. Une image fugace clignote dans votre esprit.",
  image: "Lieux/Champignon/009. champignon.png",
  sound: "folieUp",
  choix: [
    { texte: "Secouer la tête", goto: "Ecran0149" },
    { texte: "Fermer les yeux et écouter", goto: "Ecran0149" },
  ]
},
"Ecran0149": {
	zone: "champignon",
  titre: "Pluie de spores",
  texte: "Des spores lumineuses commencent à tomber lentement autour de vous. Elles brillent d’un vert doux, presque apaisant. Le temps ici n’est pas fixe, murmure la voix, jour, nuit, lever de soleil ou encore pluie, rien n'est figé !",
  image: "Lieux/Champignon/005. champignon.png",
  choix: [
    { texte: "Observer les spores", goto: "Ecran0150" },
    { texte: "Tenter de les balayer", goto: "Ecran0150" },
  ]
},
"Ecran0150": {
	zone: "champignon",
  titre: "Le soleil se déplace",
  texte: "Le soleil a changé d’angle. Les ombres s’allongent. Vous êtes certain que le temps vient d’accélérer.",
  image: "Lieux/Champignon/007. champignon.png",
  choix: [
    { texte: "Admirer le paysage", goto: "Ecran0151" },
    { texte: "Se mettre en boule et prendre votre tête entre les mains", goto: "Ecran0151" },
  ]
},
"Ecran0151": {
	zone: "champignon",
  titre: "Approche",
  texte: "Un vieil homme apparaît devant vous, il tient un objet qui éclair son visage, il dit : Approche. Écoute. Ou touche. Sa surface semble respirer.",
  image: "Lieux/Champignon/006. champignon.png",
  choix: [
    { texte: "Toucher l'objet brillant", goto: "Ecran0152" },
	{ texte: "Écouter attentivement", goto: "Ecran0153" },
  ]
},
"Ecran0152": {
	zone: "champignon",
  titre: "Contact interdit",
  texte: "Votre main touche la surface de l'objet. Une vision brutale vous traverse. Tours de verre. Lumières sans flamme. Ciel gris. Est-ce donc ça 2026..?",
  image: "Lieux/Champignon/011. champignon.png",
  sound: "folieUp",
  choix: [
    { texte: "Retirer votre main", goto: "Ecran0153" },
  ]
},
"Ecran0153": {
	zone: "champignon",
  titre: "Approche",
  texte: "Le vieil homme hurle, sa tête se déforme, il est semble fou..",
  image: "Lieux/Champignon/012. champignon.png",
  choix: [
    { texte: "Faire un pas en arrière", goto: "Ecran0154" },
	{ texte: "Se protéger", goto: "Ecran0154" },
  ]
},
"Ecran0154": {
	zone: "champignon",
  titre: "Les Prophètes",
  texte: "Nouvelle vision : en 2026, les prophètes ne portent sont différents. Ils portent des anneaux lumineux et parlent dans des miroirs noirs. On les appelle... Influenceurs.",
  image: "Lieux/Champignon/013. champignon.png",
  choix: [
    { texte: "Influenceurs ?", goto: "Ecran0155" },
    { texte: "Tu es fou...", goto: "Ecran0155" },
  ]
},

"Ecran0155": {
	zone: "champignon",
  titre: "Les Miracles Numériques",
  texte: "Ils vendent des potions invisibles. Ils bénissent des foules sans les toucher. Chaque parole génère de l’or. Les fidèles les suivent sans jamais les voir.",
  image: "Lieux/Champignon/014. champignon.png",
  choix: [
    { texte: "Et cet or ?", goto: "Ecran0156" },
    { texte: "C’est absurde.", goto: "Ecran0156" },
  ]
},

"Ecran0156": {
	zone: "champignon",
  titre: "La Pierre Philosophale",
  texte: "L’or n’est plus frappé. Il est miné mais d'une autre manière que tu ne peux l'imaginer. On l’appelle Crypto. Une pierre philosophale invisible que tous convoitent.",
  image: "Lieux/Champignon/015. champignon.png",
  choix: [
    { texte: "Miné ?", goto: "Ecran0157" },
    { texte: "Tu délires.", goto: "Ecran0157" },
  ]
},

"Ecran0157": {
	zone: "champignon",
  titre: "La Malédiction",
  texte: "Mais le plus terrible ce n’est pas l’or. C’est la Batterie Faible. Quand l’énergie descend sous les 10%, les hommes deviennent fous. Ils cherchent désespérément une prise sacrée.",
  image: "Lieux/Champignon/016. champignon.png",
  choix: [
    { texte: "Assez !", goto: "Ecran0158" },
    { texte: "Continue...", goto: "Ecran0158" },
  ]
},

"Ecran0158": {
	zone: "champignon",
  titre: "L'Être du Signal",
  texte: "Une créature avec une étrange tête faite de fils de cuivre et un champignon apparaît sous vos yeux. Il dit vrai ! Je capte encore les échos du Réseau !",
  image: "Lieux/Champignon/017. champignon.png",
  meetCharacter: "Ermite du Signal",
  redirectIfMet: "Ecran0159",
  choix: [
    { texte: "Qui es-tu ?", goto: "Ecran0159" },
    { texte: "Encore un fou...", goto: "Ecran0159" },
  ]
},

"Ecran0159": {
	zone: "champignon",
  titre: "L’Ermite du Signal",
  texte: "Il dit avec une voix étrange : Je suis le dernier récepteur, je capte les fragments. Il fouille dans sa toge et fait apparaître trois objets derrière des particules bleues électriques, il vous propose de choisir : désires-tu le Spore Connecté, le Fragment de Signal ou la Pierre de Wi-Fi Sacrée ?",
  image: "Lieux/Champignon/018. champignon.png",
  choix: [
    { texte: "Prendre la Spore Connectée", goto: "Ecran0161" },
    { texte: "Prendre le Fragment de Signal", goto: "Ecran0162" },
    { texte: "Prendre la Pierre Wi‑Fi Sacrée", goto: "Ecran0163" },
  ]
},
"Ecran0161": {
	zone: "champignon",
  titre: "Spore Connectée",
  texte: "La spore pulse dans votre main, ça semble vivant. Un murmure numérique traverse votre esprit et une douleur vous foudroie..",
  image: "Lieux/Champignon/019. champignon.png",
  sound: "folieUp",
  giveItem: "Spore Connectée",
  onceFlag: "spore_connectee_obtenue",
  choix: [
    { texte: "Continuer", goto: "Ecran0164" },
  ]
},

"Ecran0162": {
	zone: "champignon",
  titre: "Fragment de Signal",
  texte: "Le fragment vibre légèrement. Vous entendez un écho lointain. Connexion instable...",
  image: "Lieux/Champignon/020. champignon.png",
  giveItem: "Fragment de Signal",
  onceFlag: "fragment_signal_obtenu",
  choix: [
    { texte: "Continuer", goto: "Ecran0164" },
  ]
},

"Ecran0163": {
	zone: "champignon",
  titre: "Pierre Wi‑Fi Sacrée",
  texte: "La pierre irradie d'une chaleur rassurante. Votre esprit semble s’apaiser brièvement.",
  image: "Lieux/Champignon/021. champignon.png",
  giveItem: "Pierre Wi‑Fi Sacrée",
  onceFlag: "pierre_wifi_obtenue",
  choix: [
    { texte: "Continuer", goto: "Ecran0164" },
  ]
},

"Ecran0164": {
	zone: "champignon",
  titre: "Connexion",
  texte: "Une vision traverse votre esprit, comme si vous vous voyez de loin face à un énorme champignon. Une voix agréable parle dans votre tête : tu portes désormais une relique du futur.",
  image: "Lieux/Champignon/022. champignon.png",
  choix: [
    { texte: "Rester encore", goto: "Ecran0165" },
    { texte: "S’éloigner lentement", goto: "Ecran0165" },
  ]
},

"Ecran0165": {
	zone: "champignon",
  titre: "Fracture légère",
  texte: "Le vent change. Les ombres s’étirent. Quelque chose commence à se fissurer dans le temps.",
  image: "Lieux/Champignon/023. champignon.png",
  choix: [
    { texte: "Observer le phénomène", goto: "Ecran0166" },
	{ texte: "Vous vous dites que cela ne ce finira jamais", goto: "Ecran0166" },
  ]
},
"Ecran0166": {
	zone: "champignon",
  titre: "Lumière déclinante",
  texte: "Le soleil descend lentement derrière les arbres. Les ombres deviennent longues et fines. Le champignon semble plus grand qu’avant. Cette légère chaleur est agréable",
  image: "Lieux/Champignon/024. champignon.png",

  folieVariants: {
    10: {
      texte: "Le soleil chute brutalement vers l’horizon. Le champignon respire au rythme du monde.",
	  image: "Lieux/Champignon/024. distordue.png",
	  sound: "madness"
    },
    15: {
      texte: "Le ciel se fissure légèrement. Le champignon vous observe comme s’il connaissait déjà votre fin.",
	  image: "Lieux/Champignon/024. distordue.png",
	  sound: "madness"
    }
  },

  choix: [
    { texte: "Rester silencieux", goto: "Ecran0167" },
    { texte: "Apprécier la chaleur du coucher de soleil", goto: "Ecran0167" },
  ]
},
"Ecran0167": {
	zone: "champignon",
  titre: "Voix grave",
  texte: "Le temps change à une vitesse hallucinante. Le champignon incline son chapeau. Sa voix devient plus profonde. Le temps n’est pas une ligne, dit-il. C’est une racine.",
  image: "Lieux/Champignon/025. champignon.png",
  choix: [
    { texte: "Que veux-tu dire ?", goto: "Ecran0168" },
    { texte: "Je ne crois pas en tes paroles", goto: "Ecran0168" },
  ]
},
"Ecran0168": {
	zone: "champignon",
  titre: "Racines du futur",
  texte: "Chaque choix pousse quelque part. Chaque peur arrose une possibilité. Tu es déjà en train de devenir ce que tu redoutes.",
  image: "Lieux/Champignon/025. champignon.png",
  choix: [
    { texte: "Je n’ai pas peur", goto: "Ecran0169" },
    { texte: "Que vois-tu pour moi ?", goto: "Ecran0169" },
  ]
},
"Ecran0169": {
	zone: "champignon",
  titre: "Proposition",
  texte: "Le champignon se penche vers vous. Veux-tu voir ton futur ?",
  image: "Lieux/Champignon/026. champignon.png",
  choix: [
    { texte: "Oui. Montre-moi.", goto: "Ecran0170" },
    { texte: "Non. Je refuse.", goto: "Ecran0174" },
  ]
},
"Ecran0170": {
	zone: "champignon",
  titre: "Toi",
  texte: "Vous vous voyez plus vieux. Vos yeux sont vides. Une racine traverse votre poitrine.",
  image: "Lieux/Champignon/027. champignon.png",
  choix: [
    { texte: "Hurler", goto: "Ecran0172" },
    { texte: "Reculer", goto: "Ecran0172" },
  ]
},
"Ecran0172": {
	zone: "champignon",
  titre: "Rupture",
  texte: "La vision éclate comme du verre. Le ciel devient presque noir. Le rire du champignon résonne dans votre tête.",
  image: "Lieux/Champignon/028. champignon.png",
  sound: "broken_mirror",
  choix: [
    { texte: "Toucher la vision", goto: "Ecran0173" },
  ]
},
"Ecran0173": {
	zone: "champignon",
  titre: "Contact",
  texte: "Votre main traverse la vision, attirée par une lumière violacé.",
  image: "Lieux/Champignon/029. champignon.png",
  choix: [
    { texte: "Retirer la main, pourquoi ?", goto: "Ecran0175" },
  ]
},
"Ecran0174": {
	zone: "champignon",
  titre: "Refus",
  texte: "Tout s'apaise, la violence visuelle et sonore disparaît. Le champignon reste silencieux. Le soleil se couche de nouveau.",
  image: "Lieux/Champignon/010. champignon.png",
  choix: [
    { texte: "Pourquoi tout cela ?", goto: "Ecran0175" },
  ]
},
"Ecran0175": {
		zone: "champignon",
  titre: "Réponse lente",
  texte: "Parce que ceux qui voient changent. Et ceux qui changent fissurent le monde.",
  image: "Lieux/Champignon/031. champignon.png",
  choix: [
    { texte: "Je ne veux rien fissurer", goto: "Ecran0177" },
    { texte: "Alors je le fissurerai", goto: "Ecran0176" },
  ]
},
"Ecran0176": {
		zone: "champignon",
  titre: "Acceptation tardive",
  texte: "Le champignon incline lentement son chapeau. Il est trop tard pour reculer.",
  image: "Lieux/Champignon/026. champignon.png",
  meetCharacter: "champi",
  redirectIfMet: "Ecran0177",
  choix: [
    { texte: "Voir le futur finalement", goto: "Ecran0170" },
  ]
},
"Ecran0177": {
		zone: "champignon",
  titre: "Nuit installée",
  texte: "La nuit tombe définitivement. Le champignon luit faiblement d'une teinte rouge dans l’obscurité. Quelque chose a changé en vous, vous le sentez.",
  image: "Lieux/Champignon/030. champignon.png",
  choix: [
    { texte: "Rester face à lui", goto: "Ecran0000A" },
  ]
},






"Ecran0186": {
	zone: "foret",
  titre: "Silence forestier",
  texte: "Lorsque vous vous retournez, la clairière semble ordinaire. Le champignon est toujours là. Immobile. Comme s’il n’avait jamais parlé.",
  image: "Lieux/Champignon/010. champignon.png",
  choix: [
    { texte: "Reprendre votre route", goto: "Ecran0103" },
  ]
}





};