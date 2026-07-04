// Toutes les sections sont visibles sur une seule page qui scrolle.
// La nav se contente de scroller vers la bonne section, et se surligne
// elle-même selon la section actuellement visible à l'écran.
const sections = document.querySelectorAll("[data-view]");
const navLinks = document.querySelectorAll("[data-view-link]");

// Choisit la section dont le centre est le plus proche du centre de l'écran
// (plus fiable qu'un IntersectionObserver à seuil fixe pour des sections
// de hauteurs très différentes, comme "Accueil" qui est courte).
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

    sections.forEach(section => section.classList.toggle("in-view", section === closest));
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
