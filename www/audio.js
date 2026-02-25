/* -----------------------------------------------------
       SYSTEME AUDIO 
------------------------------------------------------ */

let musicStarted = false;
let musicVolume = 0.4;
let sfxVolume = 0.7;
let globalMute = false;

let currentScreenId = null;;
let currentZone = null;
let currentMusic = null;        
let currentMusicPath = null;
    
let lastSfxTime = 0;
const SFX_COOLDOWN = 80; // 


// === SFX ===
document.addEventListener("click", startMusicOnce, { once: true });
document.addEventListener("keydown", startMusicOnce, { once: true });
document.addEventListener("click", startAudioSystem, { once: true });
document.addEventListener("keydown", startAudioSystem, { once: true });


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
       REGISTRE GLOBAL DES SONS
------------------------------------------------------ */

const SFX = {   
    loot: "sons/loot.mp3",
    folieUp: "sons/folie_up.mp3",
    folieDown: "sons/folie_down.mp3",
    dice: "sons/de.mp3",
    rire: "sons/rire.mp3",
    rire2: "sons/rire2.mp3",
    madness: "sons/madness.mp3",
	torch: "sons/torch.mp3",
	trash: "sons/trash.mp3",
	coffre: "sons/coffre.mp3",
	magic_spell_4: "sons/magic_spell_4.mp3",
	mort_vivant: "sons/mort_vivant.mp3",
	broken_mirror: "sons/broken_mirror.mp3",
	cri: "sons/cri.mp3"

};

const sfxCache = {};


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
       CHARGEMENT SFX
------------------------------------------------------ */

function preloadSFX() {
    for (let key in SFX) {
        const audio = new Audio(SFX[key]);
        audio.preload = "auto";
        sfxCache[key] = audio;
    }
}

document.addEventListener("click", () => {
    preloadSFX();
}, { once: true });



/* -----------------------------------------------------
       LECTURE SFX
------------------------------------------------------ */

function playSFX(name, ignoreCooldown = false) {

    if (globalMute) return null;

    const now = Date.now();
    if (!ignoreCooldown && (now - lastSfxTime < SFX_COOLDOWN)) return null;
    lastSfxTime = now;

    const original = sfxCache[name];
    if (!original) {
        console.warn("SFX introuvable :", name);
        return null;
    }

    try {

        const soundClone = original.cloneNode(true);
        soundClone.volume = sfxVolume;
        soundClone.muted = false;

        const playPromise = soundClone.play();
        if (playPromise !== undefined) {
            playPromise.catch(err => {
                console.warn("Erreur play SFX :", name, err);
            });
        }

        return soundClone; // ✅ IMPORTANT

    } catch (e) {
        console.warn("Erreur SFX :", name, e);
        return null;
    }
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

function startAudioSystem() {
    if (musicStarted) return;

    musicStarted = true;
    preloadSFX();
}
