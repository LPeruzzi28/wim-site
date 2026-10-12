import { prefersReducedMotion } from "../lib/dom.js";

/**
 * Animations d'entrée et de défilement (GSAP + ScrollTrigger). Sans GSAP, ou avec « moins d'animations »,
 * la page s'affiche simplement, sans animation.
 */
export function initAnimations() {
    const { gsap, ScrollTrigger } = window;
    if (!gsap || !ScrollTrigger || prefersReducedMotion()) return;

    gsap.registerPlugin(ScrollTrigger);

    // Entrée du hero
    gsap.timeline({ defaults: { ease: "power4.out" } })
        .from(".hero-title .line > span", { yPercent: 110, duration: 1.3, stagger: 0.12 }, 0.1)
        .from(".hero-intro", { opacity: 0, y: 12, duration: 0.9 }, 0.3)
        .from(".hero-video--lead", { scale: 1.2, duration: 2.4, ease: "expo.out" }, 0)
        .from(".site-header", { opacity: 0, duration: 0.8, clearProps: "opacity" }, 0.5);

    // Titres de section
    gsap.utils.toArray(".section-head").forEach(head => {
        gsap.from(head.children, {
            opacity: 0, y: 40, duration: 1.1, stagger: 0.1, ease: "power4.out",
            scrollTrigger: { trigger: head, start: "top 88%" }
        });
    });

    // Section work : les bandes se déploient l'une après l'autre
    gsap.from(".work-panel", {
        opacity: 0, y: 60, duration: 1, stagger: 0.07, ease: "power3.out", clearProps: "transform,opacity",
        scrollTrigger: { trigger: ".work-accordion", start: "top 88%" }
    });

    // Rangées d'inspirations : elles accélèrent quand on scrolle vite, puis reviennent à leur vitesse normale
    const marqueeAnimations = () => [...document.querySelectorAll(".inspo-track")].flatMap(track => track.getAnimations());
    ScrollTrigger.create({
        trigger: ".inspo",
        start: "top bottom",
        end: "bottom top",
        onUpdate: self => {
            const rate = 1 + Math.min(Math.abs(self.getVelocity()) / 500, 5);
            marqueeAnimations().forEach(animation => {
                gsap.to(animation, {
                    playbackRate: rate, duration: 0.25, overwrite: true,
                    onComplete: () => gsap.to(animation, { playbackRate: 1, duration: 1.2 })
                });
            });
        }
    });

    // Gros « wim! » du pied de page
    gsap.from(".site-footer-wordmark", {
        yPercent: 35, duration: 1.4, ease: "power4.out",
        scrollTrigger: { trigger: ".site-footer", start: "top 85%" }
    });
}
