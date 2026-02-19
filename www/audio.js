/* -----------------------------------------------------
       SYSTEME AUDIO 
------------------------------------------------------ */

let musicStarted = false;
let musicVolume = 0.4;
let sfxVolume = 0.7;
let globalMute = false;
let currentScreenId = null;;
let currentZone = null;


let currentMusic = null;        // musique en cours
let currentMusicPath = null;    // chemin actuel

// === SFX ===
const letterSound = new Audio("data:audio/wav;base64,UklGRjQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YWwAAACqAADCAADmAAD8AAD9AAD4AADtAADfAADM AAB3AABYAABAAABAAABWAAB5AADPAADfAADtAAD4AAD9AAD8AADmAADCAACqAAA=");
document.addEventListener("click", startMusicOnce, { once: true });
document.addEventListener("keydown", startMusicOnce, { once: true });

/* -----------------------------------------------------
       MUSIQUES / AMBIANCES
------------------------------------------------------ */
const zoneMusic = {
    foret: "musique/foret.mp3",
    montagne: "musique/montagne.mp3",
	donjon: "musique/donjon.mp3",
	cimetiere: "musique/cimetiere.mp3",
	musicien: "musique/musicien.mp3",
	lac: "musique/lac.mp3",
    champignon: "musique/champignon.mp3"
};

/* -----------------------------------------------------
       FONCTION MUSIQUE
------------------------------------------------------ */

function handleZoneMusic(screen) {

    if (!musicStarted) return;
    if (!screen.zone) return;

    const newZone = screen.zone;
    const newMusicPath = zoneMusic[newZone];

    if (!newMusicPath) return;
    if (currentZone === newZone) return;

    const FADE_DURATION = 1000;
    const FADE_INTERVAL = 50;

    const steps = FADE_DURATION / FADE_INTERVAL;
    const volumeStep = musicVolume / steps;

    const oldMusic = currentMusic; // ✅ on sauvegarde l'ancienne

    const newMusic = new Audio(newMusicPath);
    newMusic.loop = true;
    newMusic.volume = 0;
    newMusic.muted = globalMute;

    newMusic.play().catch(err => {
        console.log("Erreur lecture nouvelle musique :", err);
    });

    // 🎚 Fade IN
    let fadeIn = setInterval(() => {
        if (newMusic.volume < musicVolume) {
            newMusic.volume = Math.min(newMusic.volume + volumeStep, musicVolume);
        } else {
            clearInterval(fadeIn);
        }
    }, FADE_INTERVAL);

    // 🎚 Fade OUT
    if (oldMusic) {
        let fadeOut = setInterval(() => {
            if (oldMusic.volume > 0) {
                oldMusic.volume = Math.max(oldMusic.volume - volumeStep, 0);
            } else {
                clearInterval(fadeOut);
                oldMusic.pause();
                oldMusic.currentTime = 0;
            }
        }, FADE_INTERVAL);
    }

    currentMusic = newMusic;
    currentMusicPath = newMusicPath;
    currentZone = newZone;
}


/* -----------------------------------------------------
       DEMARRAGE MUSIQUE
------------------------------------------------------ */

function startMusicOnce() {
    if (!musicStarted) {
        musicStarted = true;

        if (currentScreenId) {
            const screen = screens[currentScreenId];
            if (screen) handleZoneMusic(screen);
        }
    }
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
