const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasGsap = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
const animate = hasGsap && !prefersReducedMotion;
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

// ---------- Palette (sélecteur temporaire pour comparer les 3 propositions) ----------
const themes = ["noir", "papier", "rouge-bleu"];
const themeButtons = document.querySelectorAll("[data-set-theme]");

function setTheme(name, persist) {
    if (!themes.includes(name)) name = "papier";
    document.documentElement.setAttribute("data-theme", name);
    themeButtons.forEach(b => b.classList.toggle("is-active", b.dataset.setTheme === name));
    if (persist) {
        try { localStorage.setItem("wim-theme", name); } catch (e) {}
    }
}

themeButtons.forEach(b => b.addEventListener("click", () => setTheme(b.dataset.setTheme, true)));
setTheme(document.documentElement.getAttribute("data-theme"), false);

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

// ---------- Aperçu de l'image qui suit le curseur sur la liste des projets ----------
const preview = document.getElementById("preview");
const previewImg = preview.querySelector("img");

if (canHover) {
    let px = -999, py = -999, tx = -999, ty = -999, running = false;

    const tick = () => {
        px += (tx - px) * 0.16;
        py += (ty - py) * 0.16;
        preview.style.transform = `translate3d(${px}px, ${py}px, 0) rotate(${(tx - px) * 0.04}deg)`;
        if (Math.abs(tx - px) > 0.3 || Math.abs(ty - py) > 0.3) requestAnimationFrame(tick);
        else running = false;
    };

    window.addEventListener("pointermove", e => {
        tx = e.clientX + 28;
        ty = e.clientY - preview.offsetHeight / 2;
        if (px === -999) { px = tx; py = ty; }
        if (!running) { running = true; requestAnimationFrame(tick); }
    });

    document.getElementById("portfolio-grid").addEventListener("pointerover", e => {
        const card = e.target.closest(".portfolio-card");
        if (!card || !card.dataset.preview) return;
        previewImg.src = encodeURI(card.dataset.preview);
        preview.style.opacity = 1;
    });
    document.getElementById("portfolio-grid").addEventListener("pointerout", e => {
        const card = e.target.closest(".portfolio-card");
        if (!card || card.contains(e.relatedTarget)) return;
        preview.style.opacity = 0;
    });
    window.addEventListener("scroll", () => { preview.style.opacity = 0; }, { passive: true });
}

// ---------- Animations (GSAP) ----------
if (animate) {
    gsap.registerPlugin(ScrollTrigger);

    const intro = gsap.timeline({ defaults: { ease: "power4.out" } });
    intro
        .from(".hero-title .line > span", { yPercent: 110, duration: 1.3, stagger: 0.12 }, 0.1)
        .from(".hero-intro", { opacity: 0, y: 12, duration: 0.9 }, 0.3)
        .from(".bar", { opacity: 0, duration: 0.8, clearProps: "opacity" }, 0.5);

    gsap.utils.toArray(".head").forEach(head => {
        gsap.from(head.children, {
            opacity: 0, y: 40, duration: 1.1, stagger: 0.1, ease: "power4.out",
            scrollTrigger: { trigger: head, start: "top 88%" }
        });
    });

    ScrollTrigger.batch(".portfolio-card", {
        start: "top 94%",
        onEnter: batch => gsap.from(batch, {
            opacity: 0, y: 24, duration: 0.8, stagger: 0.07, ease: "power3.out", clearProps: "transform,opacity"
        })
    });

    ScrollTrigger.batch(".inspo-card", {
        start: "top 94%",
        onEnter: batch => gsap.from(batch, {
            opacity: 0, duration: 0.5, stagger: 0.05, ease: "steps(3)", clearProps: "opacity"
        })
    });

    gsap.from(".foot-big", {
        yPercent: 35, duration: 1.4, ease: "power4.out",
        scrollTrigger: { trigger: ".foot", start: "top 85%" }
    });
}
