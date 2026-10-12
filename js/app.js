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

// ---------- Format de l'accordéon work (sélecteur temporaire pour comparer 3 propositions) ----------
const wfButtons = document.querySelectorAll("[data-wf-style]");
function applyWfMode() {
    const style = document.documentElement.getAttribute("data-wf");
    document.documentElement.setAttribute("data-wf-mode", window.innerWidth <= 800 ? "2" : style);
    wfButtons.forEach(b => b.classList.toggle("is-active", b.dataset.wfStyle === style));
    window.dispatchEvent(new Event("wf-mode"));
}
function setWfStyle(n, persist) {
    if (!["1", "2", "3"].includes(n)) n = "1";
    document.documentElement.setAttribute("data-wf", n);
    if (persist) {
        try { localStorage.setItem("wim-wf", n); } catch (e) {}
    }
    applyWfMode();
}
wfButtons.forEach(b => b.addEventListener("click", () => setWfStyle(b.dataset.wfStyle, true)));
window.addEventListener("resize", applyWfMode);
setWfStyle(document.documentElement.getAttribute("data-wf"), false);

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

    // Section work : les bandes se déploient l'une après l'autre
    gsap.from(".wf-panel", {
        opacity: 0, y: 60, duration: 1, stagger: 0.07, ease: "power3.out", clearProps: "transform,opacity",
        scrollTrigger: { trigger: ".wf-acc", start: "top 88%" }
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
