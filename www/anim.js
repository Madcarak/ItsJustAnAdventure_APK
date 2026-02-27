window.animatedLootToInventory = function(itemName) {
    console.log("🔥 Loot LÉGENDAIRE déclenché :", itemName);

    let iconPath = itemIcons[itemName];

    if (!iconPath) {
        console.warn("Icône introuvable pour :", itemName);
        return;
    }

    if (!iconPath.startsWith("Objets/")) {
        iconPath = "Objets/" + iconPath;
    }

    const screenImage = document.getElementById("screen-image");

    let inventoryElement =
        document.getElementById("inventory-list-pc") ||
        document.getElementById("inventory-list");

    if (!inventoryElement) {
        inventoryElement = document.querySelector(".mobile-header");
    }

    if (!screenImage || !inventoryElement) {
        console.warn("Animation impossible : éléments manquants");
        return;
    }

    const startRect = screenImage.getBoundingClientRect();
    const endRect   = inventoryElement.getBoundingClientRect();

    const startSize = 640; // Taille initiale en pixels
    const endSize   = 64;  // Taille finale en pixels

    const centerStartX = startRect.left + startRect.width / 2;
    const centerStartY = startRect.top + startRect.height / 2;

    const centerEndX = endRect.left + endRect.width / 2;
    const centerEndY = endRect.top + endRect.height / 2;

    const deltaX = centerEndX - centerStartX;
    const deltaY = centerEndY - centerStartY;

    // =========================
    // IMAGE PRINCIPALE
    // =========================

    const lootImg = document.createElement("img");
    lootImg.src = iconPath;

    lootImg.style.position = "fixed";
    lootImg.style.width = startSize + "px"; // Taille initiale en pixels
    lootImg.style.height = startSize + "px";
    lootImg.style.left = (centerStartX - startSize / 2) + "px";
    lootImg.style.top = (centerStartY - startSize / 2) + "px";
    lootImg.style.zIndex = "9999";
    lootImg.style.pointerEvents = "none";
    lootImg.style.transformOrigin = "center";
    lootImg.style.willChange = "transform, filter";
    lootImg.style.filter = "drop-shadow(0 0 40px gold) blur(0px)"; // Pas de flou initial
    lootImg.style.transition = "transform 1.2s cubic-bezier(.2,.8,.2,1), filter 1.2s cubic-bezier(.2,.8,.2,1)";

    document.body.appendChild(lootImg);

    // =========================
    // TRAÎNÉE LUMINEUSE
    // =========================

    const trail = document.createElement("div");

    trail.style.position = "fixed";
    trail.style.left = (centerStartX) + "px";
    trail.style.top = (centerStartY) + "px";
    trail.style.width = "20px";
    trail.style.height = "20px";
    trail.style.borderRadius = "50%";
    trail.style.pointerEvents = "none";
    trail.style.zIndex = "9998";
    trail.style.background = "radial-gradient(circle, rgba(255,215,0,0.9) 0%, rgba(255,215,0,0.6) 40%, rgba(255,215,0,0.2) 70%, transparent 100%)";
    trail.style.filter = "blur(8px)";
    trail.style.transformOrigin = "center";
    trail.style.transition = "transform 1.2s cubic-bezier(.2,.8,.2,1), opacity 1.2s ease";

    document.body.appendChild(trail);

    // =========================
    // FRAME 1 : apparition massive
    // =========================

    requestAnimationFrame(() => {
        lootImg.style.transform = `
            translate(0px, 0px)
            rotate(15deg)
        `;
    });

    // =========================
    // FRAME 2 : déplacement + net progressif
    // =========================

    setTimeout(() => {

        lootImg.style.transform = `
            translate(${deltaX}px, ${deltaY}px)
            scale(${endSize / startSize})
            rotate(0deg)
        `;

        // Blur diminue progressivement
        lootImg.style.filter = "drop-shadow(0 0 40px gold) blur(0px)";

        // Traînée suit
        trail.style.transform = `
            translate(${deltaX}px, ${deltaY}px)
            scale(3)
        `;

        trail.style.opacity = "0";

    }, 50);

    // =========================
    // FIN ANIMATION
    // =========================

    setTimeout(() => {

        const sound = document.getElementById("loot-sound");
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(() => {});
        }

        inventoryElement.classList.add("inventory-glow");

        inventoryElement.style.transition = "transform 0.18s ease";
        inventoryElement.style.transform = "scale(1.12)";

        setTimeout(() => {
            inventoryElement.style.transform = "scale(1)";
        }, 180);

        setTimeout(() => {
            inventoryElement.classList.remove("inventory-glow");
        }, 500);

        lootImg.remove();
        trail.remove();

    }, 1200);

    return true;
}



function removeItem(itemName) {

    console.log("💥 Explosion déclenchée pour :", itemName);

    const index = player.inventory.indexOf(itemName);
    if (index === -1) return false;

    let inventoryElement =
        document.getElementById("inventory-list-pc") ||
        document.getElementById("inventory-list");

    if (!inventoryElement) {
        inventoryElement = document.querySelector(".mobile-header");
    }

    if (!inventoryElement) {
        console.warn("❌ Inventory container introuvable");
        return false;
    }

    const fxLayer = document.getElementById("fx-layer");
    if (!fxLayer) {
        console.error("❌ fx-layer introuvable !");
        return false;
    }

    // =========================
    // POSITION DU SLOT VISIBLE
    // =========================

    const invRect = inventoryElement.getBoundingClientRect();

    const slots = inventoryElement.querySelectorAll("img[data-item]");
    let slotElement = null;

    for (let img of slots) {
        if (img.dataset.item === itemName) {
            slotElement = img;
            break;
        }
    }

    let centerX, centerY;

    if (slotElement) {
        const rect = slotElement.getBoundingClientRect();
        centerX = rect.left + rect.width / 2;
        centerY = rect.top + rect.height / 2;
    } else {
        // fallback : centre inventaire
        centerX = invRect.left + invRect.width / 2;
        centerY = invRect.top + invRect.height / 2;
    }

    console.log("✅ Position explosion :", centerX, centerY);

    // =========================
    // CLONE VISUEL (shrink fade)
    // =========================

    if (slotElement) {
        const clone = slotElement.cloneNode(true);
        clone.classList.add("loot-fly");
        clone.style.left = (centerX - 32) + "px";
        clone.style.top = (centerY - 32) + "px";
        clone.style.zIndex = "9999998";

        fxLayer.appendChild(clone);

        requestAnimationFrame(() => {
            clone.style.transform = "scale(0.3)";
            clone.style.opacity = "0";
        });

        setTimeout(() => clone.remove(), 700);
    }

    // =========================
    // PARTICULES OR
    // =========================

    for (let i = 0; i < 40; i++) {

        const particle = document.createElement("div");

        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 70;

        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;

        particle.style.position = "fixed";
        particle.style.left = centerX + "px";
        particle.style.top = centerY + "px";
        particle.style.width = "8px";
        particle.style.height = "8px";
        particle.style.borderRadius = "50%";
        particle.style.background = "gold";
        particle.style.boxShadow = "0 0 15px gold";
        particle.style.pointerEvents = "none";
        particle.style.zIndex = "9999999";
        particle.style.transition = "transform 0.7s ease-out, opacity 0.7s ease-out";

        fxLayer.appendChild(particle);

        requestAnimationFrame(() => {
            particle.style.transform = `translate(${dx}px, ${dy}px) scale(0.2)`;
            particle.style.opacity = "0";
        });

        setTimeout(() => particle.remove(), 700);
    }

    // =========================
    // GLOW INVENTAIRE
    // =========================

    inventoryElement.classList.add("inventory-glow");

    setTimeout(() => {
        inventoryElement.classList.remove("inventory-glow");
    }, 500);

    // =========================
    // SUPPRESSION LOGIQUE
    // =========================

setTimeout(() => {

    const currentIndex = player.inventory.indexOf(itemName);

    if (currentIndex !== -1) {
        player.inventory.splice(currentIndex, 1);
        console.log(`✅ Objet retiré : ${itemName}`);
    } else {
        console.warn("⚠️ Objet déjà retiré :", itemName);
    }

    savePlayer();
    updateInventoryDisplay();

}, 250);

    return true;
}

function triggerFolieEffect(type) {

    const portraits = [
        document.getElementById("portrait-mobile"),
        document.getElementById("portrait-pc")
    ];

    const soundUp = document.getElementById("sound-folie-up");
    const soundDown = document.getElementById("sound-folie-down");

    portraits.forEach(portrait => {
        if (!portrait) return;

        portrait.classList.remove("folie-up", "folie-down");
        void portrait.offsetWidth; // reset animation

        if (type === "up") {
            portrait.classList.add("folie-up");
        } else if (type === "down") {
            portrait.classList.add("folie-down");
        }
    });

    // 🔊 Lecture son
    if (type === "up" && soundUp) {
        soundUp.currentTime = 0;
        soundUp.play().catch(() => {});
    }

    if (type === "down" && soundDown) {
        soundDown.currentTime = 0;
        soundDown.play().catch(() => {});
    }
}

function checkFoliePermanent() {

    let permanent = document.getElementById("folie-permanent-overlay");

    if (player.folie >= 15) {

        if (!permanent) {
            permanent = document.createElement("div");
            permanent.id = "folie-permanent-overlay";
            permanent.className = "folie-permanente";
            document.body.appendChild(permanent);
        }

    } else {

        if (permanent) {
            permanent.remove();
        }
    }
}
