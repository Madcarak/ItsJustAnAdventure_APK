/* -----------------------------------------------------
       SYSTEME AUDIO (musique de fond forêt)
------------------------------------------------------ */

let musicStarted = false;
let musicVolume = 0.4;
let sfxVolume = 0.7;
let globalMute = false;

// === CRÉATION DES SONS ===
const forestMusic = new Audio("sons/foret.mp3");
forestMusic.loop = true;
forestMusic.volume = musicVolume;

const letterSound = new Audio("data:audio/wav;base64,UklGRjQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YWwAAACqAADCAADmAAD8AAD9AAD4AADtAADfAADM AAB3AABYAABAAABAAABWAAB5AADPAADfAADtAAD4AAD9AAD8AADmAADCAACqAAA=");

// === UN SEUL gestionnaire démarrage musique ===
document.addEventListener("click", startMusicOnce, { once: true });
document.addEventListener("keydown", startMusicOnce, { once: true });

function startMusicOnce() {
    if (!musicStarted) {
        musicStarted = true;
        forestMusic.play().catch(() => {});
    }
}

// === Mettre à jour les volumes ===
function refreshAudioSettings() {
    forestMusic.muted = globalMute;
    letterSound.muted = globalMute;

    forestMusic.volume = musicVolume;
    letterSound.volume = sfxVolume;
}

/* -----------------------------------------------------
       MACHINE A ECRIRE
------------------------------------------------------ */
function typeWriter(element, text, speed = 30) {
    if (textIsAnimating) {
        cancelAnimationFrame(currentTextAnimation);
        element.innerHTML = text;
        textIsAnimating = false;
        return;
    }

    textIsAnimating = true;
    element.innerHTML = "";
    let i = 0;
    let lastTime = 0;

    function write(timestamp) {
        if (timestamp - lastTime >= speed) {
            if (i < text.length) {
                element.innerHTML += text[i];

                if (i % 2 === 0 && text[i].trim() !== "") {
                    letterSound.currentTime = 0;
                    letterSound.play().catch(() => {});
                }

                i++;
                lastTime = timestamp;
            } else {
                textIsAnimating = false;
                return;
            }
        }
        currentTextAnimation = requestAnimationFrame(write);
    }

    requestAnimationFrame(write);
}
