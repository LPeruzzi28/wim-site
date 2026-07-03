// Bascule entre les "pages" (Accueil / Projets / Inspirations) sans recharger
// le document, pour que le lecteur Spotify continue de jouer en fond.
const views = document.querySelectorAll("[data-view]");
const navLinks = document.querySelectorAll("[data-view-link]");

function showView(name) {
    views.forEach(section => {
        section.hidden = section.dataset.view !== name;
    });
    navLinks.forEach(link => {
        link.classList.toggle("active", link.dataset.viewLink === name);
    });
}

function currentView() {
    const hash = location.hash.replace("#", "");
    const known = ["home", "projets", "inspirations"];
    return known.includes(hash) ? hash : "home";
}

window.addEventListener("hashchange", () => showView(currentView()));
showView(currentView());
