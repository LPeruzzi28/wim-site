import { el, requireById } from "../lib/dom.js";
import { scrollLock } from "./smooth-scroll.js";

/** @typedef {import("../data/projects.js").Project} Project */

/**
 * Fenêtre de détail d'un projet (image ou vidéo, catégorie, titre, description, liens).
 * Gère l'ouverture / fermeture (bouton, clic sur le fond, Échap), le blocage du défilement,
 * le focus clavier (déplacé dans la fenêtre puis rendu au bouton d'origine) et l'inertie du reste de la page.
 *
 * @returns {{ open: (project: Project) => void, isOpen: () => boolean }}
 */
export function initProjectModal() {
    const modal = requireById("project-modal");
    const media = requireById("project-modal-media");
    const tag = requireById("project-modal-tag");
    const title = requireById("project-modal-title");
    const description = requireById("project-modal-desc");
    const links = requireById("project-modal-links");
    const closeButton = requireById("project-modal-close");

    /** @type {HTMLElement | null} */
    let opener = null;

    // Tout ce qui n'est pas la fenêtre (page, lecteur…) devient inerte tant qu'elle est ouverte.
    const backgroundNodes = () => [...document.body.children]
        .filter(node => node !== modal && !["SCRIPT", "STYLE", "LINK"].includes(node.tagName));

    function renderMedia(project) {
        media.replaceChildren();
        if (project.video) {
            const video = el("video", { attrs: { src: encodeURI(project.video), poster: encodeURI(project.image || "") } });
            // Les propriétés (et pas seulement les attributs) sont nécessaires pour la lecture automatique d'une vidéo créée en JS.
            Object.assign(video, { autoplay: true, muted: true, loop: true, playsInline: true });
            media.append(video);
        } else if (project.image) {
            media.append(el("img", {
                attrs: { src: encodeURI(project.image), alt: project.title },
                style: project.imageStyle
            }));
        }
    }

    function renderLinks(project) {
        links.replaceChildren(...project.links.map(link => el("a", {
            attrs: { href: encodeURI(link.href), target: "_blank", rel: "noopener noreferrer" },
            text: link.label
        })));
    }

    function open(project) {
        opener = /** @type {HTMLElement | null} */ (document.activeElement);
        renderMedia(project);
        tag.textContent = project.tag;
        title.textContent = project.title;
        description.textContent = project.desc;
        renderLinks(project);

        modal.classList.add("is-open");
        backgroundNodes().forEach(node => node.setAttribute("inert", ""));
        scrollLock.lock();
        closeButton.focus({ preventScroll: true });
    }

    function close() {
        if (!modal.classList.contains("is-open")) return;
        modal.classList.remove("is-open");
        backgroundNodes().forEach(node => node.removeAttribute("inert"));
        scrollLock.unlock();
        media.replaceChildren();          // arrête la vidéo éventuelle
        if (opener) opener.focus({ preventScroll: true });
        opener = null;
    }

    closeButton.addEventListener("click", close);
    modal.addEventListener("click", event => { if (event.target === modal) close(); });
    document.addEventListener("keydown", event => { if (event.key === "Escape") close(); });

    return { open, isOpen: () => modal.classList.contains("is-open") };
}
