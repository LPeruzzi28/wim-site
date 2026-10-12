/** Petits utilitaires DOM sans dépendance. */

/** L'utilisateur demande-t-il moins d'animations ? (évalué à chaque appel : la préférence peut changer) */
export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Appareil sans survol (téléphone, tablette) ? */
export const isTouchOnly = () => window.matchMedia("(hover: none)").matches;

/**
 * Crée un élément sans passer par innerHTML : le texte est toujours inséré en tant que texte,
 * ce qui évite toute injection de balisage si une donnée contient un caractère spécial.
 *
 * @param {string} tag
 * @param {{ className?: string, attrs?: Record<string, string>, style?: string, text?: string }} [options]
 * @param {(Node|null|undefined|false)[]} [children]  Les valeurs vides sont ignorées.
 * @returns {HTMLElement}
 */
export function el(tag, { className, attrs, style, text } = {}, children = []) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (attrs) for (const [name, value] of Object.entries(attrs)) node.setAttribute(name, value);
    if (style) node.setAttribute("style", style);
    if (text != null) node.textContent = text;
    node.append(...children.filter(Boolean));
    return node;
}

/**
 * Récupère un élément obligatoire ; échoue explicitement s'il manque (plutôt qu'une erreur obscure plus loin).
 * @param {string} id
 * @returns {HTMLElement}
 */
export function requireById(id) {
    const node = document.getElementById(id);
    if (!node) throw new Error(`Élément #${id} introuvable dans la page.`);
    return node;
}
