import { el, isTouchOnly, prefersReducedMotion } from "../lib/dom.js";
import { isMobileViewport } from "../config.js";

/** @typedef {import("../data/projects.js").Project} Project */

/* Réglages de l'accordéon ------------------------------------------------------------------------ */
const OPEN_TRACK = "9fr";                 // part de la bande ouverte dans la grille…
const CLOSED_TRACK = "1fr";               // …par rapport à chaque bande fermée
const IMAGE_WIDTH_RATIO = 0.58;           // largeur d'une image = part de la largeur du bloc (bande ouverte)
const STACKED_HEIGHT_RATIO = 0.62;        // sur mobile (bandes empilées) : part de la hauteur du bloc
const AUTOPLAY_DELAY_MS = 4000;           // délai entre deux projets en défilement automatique
const EAGER_IMAGES = 2;                   // nombre de projets dont les images sont chargées tout de suite
const ZOOM_DAMPING = 0.35;                // atténuation du zoom hérité des anciennes cartes (voir panelImageStyle)

/**
 * Le style propre à une image (ex. « transform: scale(1.6) ») ne doit pas écraser le centrage de l'accordéon :
 * on garde object-position & co, et on convertit le zoom en variable CSS (--z), atténué parce que les bandes
 * sont déjà très grandes. La feuille de style applique ensuite --z.
 *
 * @param {Project} project
 * @returns {string}
 */
function panelImageStyle(project) {
    const raw = project.imageStyle || "";
    const zoom = raw.match(/scale\(([\d.]+)\)/);
    const withoutTransform = raw.replace(/transform:[^;]*;?/g, "");
    return withoutTransform + (zoom ? `--z:${(1 + (parseFloat(zoom[1]) - 1) * ZOOM_DAMPING).toFixed(2)};` : "");
}

/**
 * Deux copies de l'image par bande : une nette et une floutée (le « verre »). Le flou est calculé une seule fois ;
 * pendant l'animation, seule l'opacité change.
 *
 * @param {Project} project
 * @param {"sharp" | "soft"} variant
 * @param {boolean} eager
 */
function createPanelImage(project, variant, eager) {
    if (!project.image) return null;
    const attrs = {
        src: encodeURI(project.image),
        alt: variant === "sharp" ? project.title : "",
        loading: eager ? "eager" : "lazy",
        draggable: "false"
    };
    if (variant === "soft") attrs["aria-hidden"] = "true";
    return el("img", { className: `work-panel-${variant}`, attrs, style: panelImageStyle(project) });
}

/** @param {Project} project @param {number} index */
function createPanel(project, index) {
    const eager = index < EAGER_IMAGES;
    return el("button", { className: "work-panel", attrs: { type: "button", "aria-label": project.title } }, [
        createPanelImage(project, "sharp", eager),
        createPanelImage(project, "soft", eager),
        el("span", { className: "work-panel-tint" }),
        el("span", { className: "work-panel-label", text: project.title }),
        el("span", { className: "work-panel-detail" }, [
            el("span", { className: "work-panel-tag", text: project.tag }),
            el("span", { className: "work-panel-title", text: project.title })
        ])
    ]);
}

/**
 * Section « work » : accordéon de bandes. La bande survolée s'ouvre et montre son image.
 *
 * Fluidité : les colonnes (ou lignes, sur mobile) de la grille s'animent, mais chaque image garde une taille
 * fixe (celle de la bande ouverte) et est seulement révélée ; le « verre » est une copie floutée pré-calculée,
 * fondue avec l'image nette (opacité uniquement) : aucun filtre n'est recalculé pendant l'animation.
 *
 * @param {HTMLElement} root                      Conteneur dans lequel insérer l'accordéon.
 * @param {Project[]} projects
 * @param {(project: Project) => void} openProject  Appelé quand on clique sur une bande ouverte.
 * @param {() => boolean} isModalOpen              Pour suspendre le défilement automatique pendant le détail.
 */
export function initWorkAccordion(root, projects, openProject, isModalOpen) {
    const accordion = el("div", { className: "work-accordion" });
    const panels = projects.map(createPanel);
    panels.forEach(panel => accordion.append(panel));

    let activeIndex = 0;

    function activate(index) {
        activeIndex = index;
        panels.forEach((panel, i) => panel.classList.toggle("is-active", i === index));
        const tracks = projects.map((_, i) => (i === index ? OPEN_TRACK : CLOSED_TRACK)).join(" ");
        accordion.style.setProperty("--cols", tracks);   // ordinateur : colonnes
        accordion.style.setProperty("--rows", tracks);   // mobile : rangées
    }

    function updateImageSizes() {
        const { clientWidth: width, clientHeight: height } = accordion;
        const stacked = isMobileViewport();
        accordion.style.setProperty("--fw", `${Math.round(stacked ? width : width * IMAGE_WIDTH_RATIO)}px`);
        accordion.style.setProperty("--fh", `${Math.round(stacked ? height * STACKED_HEIGHT_RATIO : height)}px`);
    }

    // Défilement automatique : sans interaction, l'accordéon ouvre les projets l'un après l'autre.
    // Il s'arrête dès que la souris survole le bloc, et reprend quand elle le quitte.
    let autoplayTimer = null;
    function startAutoplay() {
        clearInterval(autoplayTimer);
        if (prefersReducedMotion()) return;
        autoplayTimer = setInterval(() => {
            const rect = accordion.getBoundingClientRect();
            const visible = rect.bottom > 0 && rect.top < window.innerHeight;
            if (document.hidden || !visible || isModalOpen()) return;
            activate((activeIndex + 1) % projects.length);
        }, AUTOPLAY_DELAY_MS);
    }

    panels.forEach((panel, index) => {
        panel.addEventListener("pointerenter", event => { if (event.pointerType === "mouse") activate(index); });
        panel.addEventListener("focus", () => activate(index));
        panel.addEventListener("click", () => {
            // Écran tactile : un premier toucher ouvre la bande, le second ouvre le projet.
            if (isTouchOnly() && !panel.classList.contains("is-active")) { activate(index); return; }
            openProject(projects[index]);
        });
    });
    accordion.addEventListener("pointerenter", () => clearInterval(autoplayTimer));
    accordion.addEventListener("pointerleave", startAutoplay);

    activate(0);
    root.append(accordion);
    startAutoplay();
    updateImageSizes();
    new ResizeObserver(updateImageSizes).observe(accordion);
}
