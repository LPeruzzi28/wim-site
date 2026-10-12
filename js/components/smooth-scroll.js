import { prefersReducedMotion } from "../lib/dom.js";

/** @type {any} Instance de Lenis (bibliothèque chargée par balise <script>), ou null. */
let lenis = null;

/**
 * Défilement fluide (Lenis) et ancres internes.
 * Sans Lenis ou avec « moins d'animations », on retombe sur le défilement natif.
 */
export function initSmoothScroll() {
    const reduced = prefersReducedMotion();
    const { Lenis, gsap, ScrollTrigger } = window;

    if (Lenis && !reduced) {
        lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
        if (gsap && ScrollTrigger) {
            // Lenis pilote ScrollTrigger et utilise le ticker de GSAP comme boucle d'animation.
            lenis.on("scroll", ScrollTrigger.update);
            gsap.ticker.add(time => lenis.raf(time * 1000));
            gsap.ticker.lagSmoothing(0);
        } else {
            const loop = time => { lenis.raf(time); requestAnimationFrame(loop); };
            requestAnimationFrame(loop);
        }
    }

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", event => {
            const target = document.querySelector(link.getAttribute("href"));
            if (!target) return;
            event.preventDefault();
            if (lenis) lenis.scrollTo(target, { duration: 1.3 });
            else target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
        });
    });
}

/** Bloque / débloque le défilement de la page (utilisé pendant l'ouverture du détail d'un projet). */
export const scrollLock = {
    lock() {
        if (lenis) lenis.stop();
        document.body.style.overflow = "hidden";
    },
    unlock() {
        if (lenis) lenis.start();
        document.body.style.overflow = "";
    }
};
