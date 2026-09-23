// Toutes les sections sont visibles sur une seule page qui scrolle.
// La nav se contente de scroller vers la bonne section, et se surligne
// elle-même selon la section actuellement visible à l'écran.
const sections = document.querySelectorAll("[data-view]");
const navLinks = document.querySelectorAll("[data-view-link]");

// Surligne le lien de nav de la section dont le centre est le plus proche
// du centre de l'écran.
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

// Le fond bouge un peu moins vite que le contenu (léger effet parallaxe)
// au lieu de rester totalement fixe ou de scroller à la même vitesse.
const bgLayer = document.getElementById("bg-layer");
const parallaxFactor = 0.2;
const parallaxMaxOffset = 400; // doit rester sous la marge basse du calque (voir .bg-layer)

function updateParallax() {
    const offset = Math.min(window.scrollY * parallaxFactor, parallaxMaxOffset);
    bgLayer.style.transform = `translateY(${-offset}px)`;
}

let ticking = false;
window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
        updateActiveSection();
        updateParallax();
        ticking = false;
    });
});
window.addEventListener("resize", updateActiveSection);
updateActiveSection();
updateParallax();

// Petites touches "vivantes" (tilt 3D au survol + apparition au scroll),
// désactivées si l'utilisateur préfère moins d'animations.
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {

    // Le titre et les cartes s'inclinent légèrement en suivant la souris.
    const tiltSelector = "#title, .portfolio-card, .inspo-card";
    let tiltedEl = null;

    function resetTilt(el) {
        el.style.transition = "transform 0.4s ease";
        el.style.transform = "";
    }

    document.addEventListener("pointermove", (e) => {
        const el = e.target.closest(tiltSelector);
        if (el !== tiltedEl) {
            if (tiltedEl) resetTilt(tiltedEl);
            tiltedEl = el;
        }
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const isTitle = el.id === "title";
        const maxTilt = isTitle ? 10 : 8;
        const rotateY = (px - 0.5) * maxTilt * 2;
        const rotateX = (0.5 - py) * maxTilt * 2;
        const lift = isTitle ? "" : "translateY(-4px) ";

        el.style.transition = "";
        el.style.transform = `${lift}perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    document.addEventListener("pointerleave", () => {
        if (tiltedEl) {
            resetTilt(tiltedEl);
            tiltedEl = null;
        }
    });

    // Les cartes et titres de section apparaissent en douceur à l'arrivée au scroll.
    const revealTargets = document.querySelectorAll(
        ".portfolio-card, .inspo-card, h2#portfolio-title, h2#inspo-title"
    );
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealTargets.forEach(el => {
        el.classList.add("reveal");
        revealObserver.observe(el);
    });
}
