/**
 * Point d'entrée : construit les sections à partir des données, puis branche les comportements.
 * L'ordre compte : le contenu est construit d'abord, de sorte que GSAP / ScrollTrigger (initAnimations)
 * trouvent les éléments qu'ils animent.
 */
import { projects } from "./data/projects.js";
import { inspirations } from "./data/inspirations.js";
import { clips } from "./data/clips.js";
import { requireById } from "./lib/dom.js";
import { initProjectModal } from "./components/project-modal.js";
import { initWorkAccordion } from "./components/work-accordion.js";
import { initInspoMarquee } from "./components/inspo-marquee.js";
import { initAudioPlayer } from "./components/audio-player.js";
import { initHeroVideo } from "./components/hero-video.js";
import { initSmoothScroll } from "./components/smooth-scroll.js";
import { initScrollSpy } from "./components/scroll-spy.js";
import { initAnimations } from "./components/animations.js";

const modal = initProjectModal();
initWorkAccordion(requireById("work-root"), projects, modal.open, modal.isOpen);
initInspoMarquee(requireById("inspo-root"), inspirations);
initAudioPlayer(clips);

initHeroVideo();
initSmoothScroll();
initScrollSpy();
initAnimations();
