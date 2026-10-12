/**
 * Constantes partagées par les scripts.
 * Le point de rupture mobile doit rester aligné avec les @media (max-width: 800px) des feuilles de style.
 */
export const MOBILE_MAX_WIDTH = 800;

export const isMobileViewport = () => window.innerWidth <= MOBILE_MAX_WIDTH;
