/**
 * Souligne dans le menu le lien de la section actuellement au centre de l'écran.
 * Les sections portent data-view ; les liens du menu portent data-view-link.
 */
export function initScrollSpy() {
    const sections = document.querySelectorAll("[data-view]");
    const links = document.querySelectorAll("[data-view-link]");

    function update() {
        const center = window.innerHeight / 2;
        let current = null;
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= center && rect.bottom >= center) current = section;
        });
        links.forEach(link => {
            link.classList.toggle("active", Boolean(current) && link.dataset.viewLink === current.dataset.view);
        });
    }

    window.addEventListener("scroll", update, { passive: true });
    update();
}
