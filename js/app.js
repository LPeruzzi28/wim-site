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
