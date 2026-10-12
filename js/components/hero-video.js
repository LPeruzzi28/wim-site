import { prefersReducedMotion } from "../lib/dom.js";

const RESYNC_INTERVAL_MS = 1500;
const MAX_DRIFT_SECONDS = 0.1;

/**
 * Le hero affiche deux copies de la même vidéo (une dans les lettres, une très discrète en fond).
 * On charge la source en différé (data-src), on les lance ensemble et on les resynchronise si elles dérivent.
 * Avec « moins d'animations », la vidéo reste en pause sur son image d'aperçu.
 */
export function initHeroVideo() {
    const videos = [...document.querySelectorAll(".hero-video")];
    if (videos.length === 0) return;

    videos.forEach(video => { video.src = video.dataset.src; });

    if (prefersReducedMotion()) {
        videos.forEach(video => video.pause());
        return;
    }

    videos.forEach(video => video.play().catch(() => { /* lecture auto refusée : l'image d'aperçu reste affichée */ }));

    const [lead, background] = videos;
    if (!background) return;
    setInterval(() => {
        if (!document.hidden && Math.abs(lead.currentTime - background.currentTime) > MAX_DRIFT_SECONDS) {
            background.currentTime = lead.currentTime;
        }
    }, RESYNC_INTERVAL_MS);
}
