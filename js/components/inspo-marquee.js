import { el } from "../lib/dom.js";

/** @typedef {import("../data/inspirations.js").Inspiration} Inspiration */

/**
 * @param {Inspiration} item
 * @param {boolean} duplicate  Copie visuelle (pour la boucle) : masquée aux lecteurs d'écran et au clavier.
 */
function createCard(item, duplicate) {
    const media = el("div", { className: "inspo-card-media" }, [
        item.image
            ? el("img", {
                attrs: { src: encodeURI(item.image), alt: duplicate ? "" : item.name, loading: "lazy", draggable: "false" }
            })
            : el("div", { className: "placeholder", text: "Image bientôt disponible" })
    ]);
    const body = el("div", { className: "inspo-card-body" }, [
        el("h3", { className: "inspo-card-name", text: item.name })
    ]);

    const card = el("a", {
        className: "inspo-card",
        attrs: { href: item.link, target: "_blank", rel: "noopener noreferrer" }
    }, [media, body]);

    if (duplicate) {
        card.setAttribute("aria-hidden", "true");
        card.tabIndex = -1;
    }
    return card;
}

/**
 * Section « inspo » : deux rangées de cartes qui défilent en sens inverse (animation CSS).
 * Chaque rangée contient sa liste quatre fois (deux passes de deux répétitions) : les répétitions suffisent à
 * dépasser la largeur d'un grand écran, et le décalage CSS de -50 % boucle sans coupure.
 *
 * @param {HTMLElement} root
 * @param {Inspiration[]} inspirations
 */
export function initInspoMarquee(root, inspirations) {
    const half = Math.ceil(inspirations.length / 2);
    const REPEATS = 2;

    [inspirations.slice(0, half), inspirations.slice(half)].forEach(items => {
        const track = el("div", { className: "inspo-track" });
        for (let pass = 0; pass < 2; pass++) {
            for (let repeat = 0; repeat < REPEATS; repeat++) {
                items.forEach(item => track.append(createCard(item, pass > 0 || repeat > 0)));
            }
        }
        root.append(el("div", { className: "inspo-row" }, [track]));
    });
}
