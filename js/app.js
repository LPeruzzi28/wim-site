const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasGsap = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
const animate = hasGsap && !prefersReducedMotion;

// ---------- Vidéo du hero : deux copies synchronisées (lettres + fond) ----------
const heroVideos = [document.getElementById("hero-video"), document.getElementById("hero-video-bg")];
heroVideos.forEach(v => { v.src = v.dataset.src; });

if (prefersReducedMotion) {
    heroVideos.forEach(v => v.pause());
} else {
    heroVideos.forEach(v => v.play().catch(() => {}));
    // Resynchronise la 2e copie si elle dérive de plus d'un dixième de seconde.
    setInterval(() => {
        const [main, bg] = heroVideos;
        if (!document.hidden && Math.abs(main.currentTime - bg.currentTime) > 0.1) {
            bg.currentTime = main.currentTime;
        }
    }, 1500);
}

// ---------- Défilement fluide (Lenis) + ancres ----------
let lenis = null;
if (typeof Lenis !== "undefined" && !prefersReducedMotion) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    window.lenis = lenis;
    if (hasGsap) {
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add(time => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
    } else {
        const raf = time => { lenis.raf(time); requestAnimationFrame(raf); };
        requestAnimationFrame(raf);
    }
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
        const target = document.querySelector(link.getAttribute("href"));
        if (!target) return;
        e.preventDefault();
        if (lenis) lenis.scrollTo(target, { duration: 1.3 });
        else target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
});

// ---------- Lien actif dans la nav ----------
const sections = document.querySelectorAll("[data-view]");
const navLinks = document.querySelectorAll("[data-view-link]");

function updateActiveSection() {
    const center = window.innerHeight / 2;
    let current = null;
    sections.forEach(section => {
        const r = section.getBoundingClientRect();
        if (r.top <= center && r.bottom >= center) current = section;
    });
    navLinks.forEach(l => l.classList.toggle("active", !!current && l.dataset.viewLink === current.dataset.view));
}
window.addEventListener("scroll", updateActiveSection, { passive: true });
updateActiveSection();

// ---------- Survol des cartes : 3 variantes à comparer ----------
// 1 = vagues (filtre SVG animé), 2 = feuille de couleur (CSS), 3 = image qui défile (CSS)
const hoverButtons = document.querySelectorAll("[data-hover].hover-btn");
function setHover(n, persist) {
    if (!["1", "2", "3"].includes(n)) n = "2";
    document.documentElement.setAttribute("data-hover", n);
    hoverButtons.forEach(b => b.classList.toggle("is-active", b.dataset.hover === n));
    if (persist) {
        try { localStorage.setItem("wim-hover", n); } catch (e) {}
    }
}
hoverButtons.forEach(b => b.addEventListener("click", () => setHover(b.dataset.hover, true)));
setHover(document.documentElement.getAttribute("data-hover"), false);

if (animate && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const rippleMap = document.getElementById("ripple-map");
    const rippleTarget = card => card.querySelector(".portfolio-card-zoom, .inspo-card-media");
    let rippling = null;

    document.addEventListener("pointerover", e => {
        if (document.documentElement.dataset.hover !== "1") return;
        const card = e.target.closest(".portfolio-card, .inspo-card");
        if (!card || card.contains(e.relatedTarget)) return;
        const target = rippleTarget(card);
        if (rippling && rippling !== target) rippling.classList.remove("is-rippling");
        rippling = target;
        target.classList.add("is-rippling");
        gsap.killTweensOf(rippleMap);
        gsap.fromTo(rippleMap, { attr: { scale: 0 } }, {
            attr: { scale: 24 }, duration: 0.45, ease: "power2.out",
            onComplete: () => gsap.to(rippleMap, { attr: { scale: 5 }, duration: 1.2, ease: "power2.inOut" })
        });
    });

    document.addEventListener("pointerout", e => {
        if (document.documentElement.dataset.hover !== "1") return;
        const card = e.target.closest(".portfolio-card, .inspo-card");
        if (!card || card.contains(e.relatedTarget)) return;
        const target = rippleTarget(card);
        gsap.killTweensOf(rippleMap);
        gsap.to(rippleMap, {
            attr: { scale: 0 }, duration: 0.5, ease: "power2.out",
            onComplete: () => target.classList.remove("is-rippling")
        });
    });
}

// ---------- Version (sélecteur temporaire pour comparer les deux propositions) ----------
const colors = ["sunset", "nowhere"];
const swatchButtons = document.querySelectorAll("[data-color]");

function setColor(name, persist) {
    if (!colors.includes(name)) name = "sunset";
    document.documentElement.setAttribute("data-color", name);
    swatchButtons.forEach(b => b.classList.toggle("is-active", b.dataset.color === name));
    if (persist) {
        try { localStorage.setItem("wim-color", name); } catch (e) {}
    }
}
swatchButtons.forEach(b => b.addEventListener("click", () => setColor(b.dataset.color, true)));
setColor(document.documentElement.getAttribute("data-color"), false);

// ---------- Carrousel "work" : défilement horizontal propre, la page garde son scroll ----------
const workViewport = document.querySelector(".work-viewport");
const workProgress = document.querySelector(".work-progress span");
const workCards = [...document.querySelectorAll(".portfolio-card")];

function updateWorkProgress() {
    const max = workViewport.scrollWidth - workViewport.clientWidth;
    const ratio = max > 0 ? workViewport.scrollLeft / max : 0;
    const visible = workViewport.clientWidth / workViewport.scrollWidth;
    workProgress.style.transform = `scaleX(${Math.max(visible, 0.08) + ratio * (1 - Math.max(visible, 0.08))})`;
}

let lastScrollLeft = 0;
let skewReset;
workViewport.addEventListener("scroll", () => {
    updateWorkProgress();
    if (animate) {
        const delta = workViewport.scrollLeft - lastScrollLeft;
        gsap.to(workCards, { skewX: gsap.utils.clamp(-6, 6, delta * -0.25), duration: 0.3, overwrite: "auto" });
        clearTimeout(skewReset);
        skewReset = setTimeout(() => gsap.to(workCards, { skewX: 0, duration: 0.6, ease: "power3.out" }), 120);
    }
    lastScrollLeft = workViewport.scrollLeft;
}, { passive: true });
window.addEventListener("resize", updateWorkProgress);
updateWorkProgress();

// Glisser à la souris
let drag = null;
workViewport.addEventListener("pointerdown", e => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    drag = { x: e.clientX, left: workViewport.scrollLeft, moved: false };
});
window.addEventListener("pointermove", e => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 5) {
        drag.moved = true;
        workViewport.classList.add("is-dragging");
    }
    if (drag.moved) workViewport.scrollLeft = drag.left - dx;
});
window.addEventListener("pointerup", () => {
    if (!drag) return;
    const moved = drag.moved;
    drag = null;
    workViewport.classList.remove("is-dragging");
    if (moved) {
        // empêche le clic qui suit un glissé d'ouvrir un projet
        const block = e => { e.stopPropagation(); e.preventDefault(); };
        workViewport.addEventListener("click", block, { capture: true, once: true });
        setTimeout(() => workViewport.removeEventListener("click", block, { capture: true }), 0);
    }
});

// Flèches
const stepSize = () => (workCards[0] ? workCards[0].getBoundingClientRect().width : 400) + 40;
document.getElementById("work-prev").addEventListener("click", () => workViewport.scrollBy({ left: -stepSize(), behavior: "smooth" }));
document.getElementById("work-next").addEventListener("click", () => workViewport.scrollBy({ left: stepSize(), behavior: "smooth" }));

// ---------- Animations (GSAP) ----------
if (animate) {
    gsap.registerPlugin(ScrollTrigger);

    const intro = gsap.timeline({ defaults: { ease: "power4.out" } });
    intro
        .from(".hero-title .line > span", { yPercent: 110, duration: 1.3, stagger: 0.12 }, 0.1)
        .from(".hero-intro", { opacity: 0, y: 12, duration: 0.9 }, 0.3)
        .from("#hero-video", { scale: 1.2, duration: 2.4, ease: "expo.out" }, 0)
        .from(".bar", { opacity: 0, duration: 0.8, clearProps: "opacity" }, 0.5);

    gsap.utils.toArray(".head").forEach(head => {
        gsap.from(head.children, {
            opacity: 0, y: 40, duration: 1.1, stagger: 0.1, ease: "power4.out",
            scrollTrigger: { trigger: head, start: "top 88%" }
        });
    });

    // Rangées d'inspirations : accélèrent quand on scrolle
    const inspoAnimations = () => [...document.querySelectorAll(".inspo-track")].flatMap(t => t.getAnimations());
    ScrollTrigger.create({
        trigger: ".inspo",
        start: "top bottom",
        end: "bottom top",
        onUpdate: self => {
            const rate = 1 + Math.min(Math.abs(self.getVelocity()) / 500, 5);
            inspoAnimations().forEach(a => {
                gsap.to(a, { playbackRate: rate, duration: 0.25, overwrite: true, onComplete: () => gsap.to(a, { playbackRate: 1, duration: 1.2 }) });
            });
        }
    });

    gsap.from(".foot-big", {
        yPercent: 35, duration: 1.4, ease: "power4.out",
        scrollTrigger: { trigger: ".foot", start: "top 85%" }
    });
}
