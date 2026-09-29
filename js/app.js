// Toutes les sections sont visibles sur une seule page qui scrolle.
// La nav se contente de scroller vers la bonne section, et se surligne
// elle-même selon la section actuellement visible à l'écran.
const sections = document.querySelectorAll("[data-view]");
const navLinks = document.querySelectorAll("[data-view-link]");

function updateActiveSection() {
    const viewportCenter = window.innerHeight / 2;
    let closest = sections[0];
    let closestDistance = Infinity;

    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - viewportCenter);
        if (distance < closestDistance) {
            closestDistance = distance;
            closest = section;
        }
    });

    navLinks.forEach(link => {
        link.classList.toggle("active", link.dataset.viewLink === closest.dataset.view);
    });
}

let ticking = false;
window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
        updateActiveSection();
        ticking = false;
    });
});
window.addEventListener("resize", updateActiveSection);
updateActiveSection();

// Horloge dans l'en-tête.
const clockEl = document.getElementById("clock");
function updateClock() {
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString("fr-CH", { hour: "2-digit", minute: "2-digit" });
}
updateClock();
setInterval(updateClock, 15000);

// Nombre de projets, affiché dans le coin du hero (dérivé du vrai tableau,
// voir js/portfolio.js).
const projectCountEl = document.getElementById("project-count");
if (projectCountEl && typeof projects !== "undefined") {
    projectCountEl.textContent = `${String(projects.length).padStart(2, "0")} Projets`;
}

// Bandeau défilant construit à partir des vraies catégories des projets
// et inspirations (voir js/portfolio.js et js/inspirations.js).
const marqueeTrack = document.getElementById("marquee-track");
if (marqueeTrack) {
    const words = new Set();
    if (typeof projects !== "undefined") {
        projects.forEach(p => p.tag.split(/[·,]/).forEach(w => words.add(w.trim())));
    }
    if (typeof inspirations !== "undefined") {
        inspirations.forEach(i => words.add(i.tag.trim()));
    }
    const list = Array.from(words);
    const html = list.map(w => `<span>${w}</span>`).join("");
    marqueeTrack.innerHTML = html + html;
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasGsap = typeof gsap !== "undefined";

if (hasGsap && !prefersReducedMotion) {
    gsap.registerPlugin(ScrollTrigger);

    // Entrée du hero : les éléments apparaissent en cascade.
    gsap.from([".corner-tl", ".kicker", "#title", ".corner-br", ".marquee"], {
        opacity: 0,
        y: 22,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.09,
        delay: 0.1
    });

    // Les cartes apparaissent par vagues à l'arrivée au scroll.
    gsap.set(".portfolio-card, .inspo-card", { opacity: 0, y: 32 });
    ScrollTrigger.batch(".portfolio-card, .inspo-card", {
        start: "top 88%",
        onEnter: batch => gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.08
        })
    });

    // Les titres de section glissent légèrement en arrivant.
    gsap.utils.toArray("h2#portfolio-title, h2#inspo-title").forEach(title => {
        gsap.from(title, {
            opacity: 0,
            y: 24,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: title, start: "top 90%" }
        });
    });

    // Léger parallaxe sur les grands chiffres fantômes derrière les titres.
    gsap.utils.toArray(".ghost-number").forEach(ghost => {
        gsap.to(ghost, {
            y: -60,
            ease: "none",
            scrollTrigger: { trigger: ghost, start: "top bottom", end: "bottom top", scrub: true }
        });
    });

    // Parallaxe sur la scène du hero (soleil + crêtes) au scroll : chaque
    // calque bouge à une vitesse différente pour donner de la profondeur.
    const heroTop = document.querySelector("section.top");
    if (heroTop) {
        gsap.to(".hero-ridge-back", {
            y: -40,
            ease: "none",
            scrollTrigger: { trigger: heroTop, start: "top top", end: "bottom top", scrub: true }
        });
        gsap.to(".hero-ridge-front", {
            y: -90,
            ease: "none",
            scrollTrigger: { trigger: heroTop, start: "top top", end: "bottom top", scrub: true }
        });
        gsap.to(".hero-glow, .hero-sun", {
            y: 60,
            x: 30,
            ease: "none",
            scrollTrigger: { trigger: heroTop, start: "top top", end: "bottom top", scrub: true }
        });
    }

    // Curseur personnalisé qui suit la souris et grossit sur les éléments
    // interactifs.
    const cursor = document.getElementById("cursor-dot");
    if (cursor && window.matchMedia("(hover: hover)").matches) {
        const moveX = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3.out" });
        const moveY = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3.out" });

        window.addEventListener("pointermove", e => {
            moveX(e.clientX);
            moveY(e.clientY);
        });

        const growTargets = "a, button, .portfolio-card, .inspo-card";
        document.addEventListener("pointerover", e => {
            if (e.target.closest(growTargets)) {
                gsap.to(cursor, { scale: 3, duration: 0.25 });
            }
        });
        document.addEventListener("pointerout", e => {
            if (e.target.closest(growTargets)) {
                gsap.to(cursor, { scale: 1, duration: 0.25 });
            }
        });
    }
} else {
    // Pas de GSAP (ou préférence pour moins d'animations) : on affiche
    // tout de suite, sans animation d'entrée.
    document.querySelectorAll(".portfolio-card, .inspo-card").forEach(el => {
        el.style.opacity = 1;
    });
    document.body.style.cursor = "auto";
    const cursor = document.getElementById("cursor-dot");
    if (cursor) cursor.style.display = "none";
}
