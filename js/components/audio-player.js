import { requireById } from "../lib/dom.js";

/** @typedef {import("../data/clips.js").Clip} Clip */

/**
 * Lecteur audio : joue des extraits dans un ordre aléatoire (sans répétition rapprochée).
 *
 * @param {Clip[]} clips
 */
export function initAudioPlayer(clips) {
    const audio = /** @type {HTMLAudioElement} */ (requireById("player-audio"));
    const toggle = /** @type {HTMLButtonElement} */ (requireById("player-toggle"));
    const next = /** @type {HTMLButtonElement} */ (requireById("player-next"));
    const title = requireById("player-title");
    const bar = requireById("player-bar");
    const barFill = requireById("player-bar-fill");

    if (clips.length === 0) {
        title.textContent = "Ajoute des extraits dans audio/";
        toggle.disabled = true;
        next.disabled = true;
        return;
    }

    let currentIndex = -1;

    // « Sac à mélange » : on tire tous les morceaux un par un dans un ordre aléatoire avant de remélanger,
    // pour éviter qu'un même titre revienne trop souvent (un tirage aléatoire pur peut sembler répétitif
    // sur peu de morceaux).
    let queue = [];

    function refillQueue() {
        queue = clips.map((_, i) => i);
        for (let i = queue.length - 1; i > 0; i--) {   // mélange de Fisher-Yates
            const j = Math.floor(Math.random() * (i + 1));
            [queue[i], queue[j]] = [queue[j], queue[i]];
        }
        // Évite de rejouer tout de suite le morceau qui vient de finir.
        if (queue.length > 1 && queue[queue.length - 1] === currentIndex) {
            const swapWith = Math.floor(Math.random() * (queue.length - 1));
            [queue[queue.length - 1], queue[swapWith]] = [queue[swapWith], queue[queue.length - 1]];
        }
    }

    function pickRandomIndex() {
        if (clips.length === 1) return 0;
        if (queue.length === 0) refillQueue();
        return queue.pop();
    }

    function setPlayingState(playing) {
        toggle.classList.toggle("playing", playing);
        toggle.setAttribute("aria-label", playing ? "Pause" : "Lecture");
    }

    function loadClip(index) {
        currentIndex = index;
        const clip = clips[index];
        audio.src = encodeURI(clip.file);
        title.textContent = clip.title;
        barFill.style.width = "0%";
    }

    function play() {
        return audio.play().then(() => setPlayingState(true)).catch(() => setPlayingState(false));
    }

    function pause() {
        audio.pause();
        setPlayingState(false);
    }

    function playRandom() {
        loadClip(pickRandomIndex());
        play();
    }

    loadClip(pickRandomIndex());

    // Les navigateurs bloquent la lecture automatique avec son avant une interaction de l'utilisateur :
    // on tente directement, puis on retente à la première interaction si c'est refusé.
    audio.play().then(() => setPlayingState(true)).catch(() => {
        const startOnInteraction = () => {
            ["click", "keydown", "touchstart"].forEach(type => document.removeEventListener(type, startOnInteraction));
            play();
        };
        ["click", "keydown", "touchstart"].forEach(type => document.addEventListener(type, startOnInteraction, { once: true }));
    });

    toggle.addEventListener("click", () => { if (audio.paused) play(); else pause(); });
    next.addEventListener("click", playRandom);
    audio.addEventListener("ended", playRandom);

    audio.addEventListener("timeupdate", () => {
        if (!audio.duration) return;
        barFill.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
    });

    bar.addEventListener("click", event => {
        if (!audio.duration) return;
        const rect = bar.getBoundingClientRect();
        audio.currentTime = ((event.clientX - rect.left) / rect.width) * audio.duration;
    });
}
