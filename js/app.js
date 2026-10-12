const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasGsap = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
const animate = hasGsap && !prefersReducedMotion;

// ---------- Palette (sélecteur temporaire pour comparer les 3 propositions) ----------
const themeButtons = document.querySelectorAll("[data-set-theme]");

function setTheme(name, persist) {
    document.documentElement.setAttribute("data-theme", name);
    themeButtons.forEach(b => b.classList.toggle("is-active", b.dataset.setTheme === name));
    if (persist) {
        try { localStorage.setItem("wim-theme", name); } catch (e) {}
    }
}

themeButtons.forEach(b => b.addEventListener("click", () => setTheme(b.dataset.setTheme, true)));
setTheme(document.documentElement.getAttribute("data-theme"), false);

// ---------- Horloge dans l'en-tête ----------
const clockEl = document.getElementById("clock");
function updateClock() {
    clockEl.textContent = new Date().toLocaleTimeString("fr-CH", { hour: "2-digit", minute: "2-digit" });
}
updateClock();
setInterval(updateClock, 15000);

// ---------- Compteurs, dérivés des vrais tableaux (js/portfolio.js et js/inspirations.js) ----------
const pad = n => String(n).padStart(2, "0");
document.getElementById("count-projects").textContent = pad(projects.length);
document.getElementById("count-inspo").textContent = pad(inspirations.length);

// ---------- Bandeau des noms : uniquement les créateurs qui m'inspirent ----------
const namesRow = document.getElementById("names-row");
const namesHtml = inspirations
    .map(i => `<a href="${i.link}" target="_blank" rel="noopener">${i.name}</a>`)
    .join("");
namesRow.innerHTML = namesHtml + namesHtml;

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
        if (lenis) lenis.scrollTo(target, { duration: 1.4 });
        else target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
});

// ---------- En-tête : plein au-delà du hero, se cache en descendant ----------
const header = document.getElementById("site-header");
let lastY = window.scrollY;

function updateHeader() {
    const y = window.scrollY;
    header.classList.toggle("is-solid", y > window.innerHeight - 90);
    if (y > lastY && y > 300) header.classList.add("is-hidden");
    else if (y < lastY) header.classList.remove("is-hidden");
    lastY = y;
}
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

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

// ---------- Curseur à étiquette ("Voir" sur un projet, "Visiter" sur une inspiration) ----------
const cursor = document.getElementById("cursor");
const cursorLabel = document.getElementById("cursor-label");
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (animate && canHover && cursor) {
    gsap.set(cursor, { scale: 0 });
    const moveX = gsap.quickTo(cursor, "x", { duration: 0.4, ease: "power3.out" });
    const moveY = gsap.quickTo(cursor, "y", { duration: 0.4, ease: "power3.out" });
    window.addEventListener("pointermove", e => { moveX(e.clientX); moveY(e.clientY); });

    document.addEventListener("pointerover", e => {
        const t = e.target.closest("[data-cursor]");
        if (!t) return;
        cursorLabel.textContent = t.dataset.cursor;
        gsap.to(cursor, { scale: 1, duration: 0.45, ease: "power3.out", overwrite: "auto" });
    });
    document.addEventListener("pointerout", e => {
        const t = e.target.closest("[data-cursor]");
        if (!t || t.contains(e.relatedTarget)) return;
        gsap.to(cursor, { scale: 0, duration: 0.3, ease: "power3.out", overwrite: "auto" });
    });
}

// ---------- Animations (GSAP) ----------
if (animate) {
    gsap.registerPlugin(ScrollTrigger);

    // Entrée du hero
    const intro = gsap.timeline({ defaults: { ease: "power4.out" } });
    intro
        .from(".hero-img", { scale: 1.22, duration: 2.4, ease: "expo.out" }, 0)
        .from(".hero-title .line > span", { yPercent: 115, duration: 1.4, stagger: 0.14 }, 0.15)
        .from(".hero-kicker", { opacity: 0, y: 14, duration: 1 }, 0.5)
        .from(".hero-foot", { opacity: 0, y: 20, duration: 1.1 }, 0.8)
        .from(".site-header", { opacity: 0, duration: 1, clearProps: "opacity" }, 0.9);

    // Parallaxe de l'image du hero + le texte s'efface en défilant
    gsap.to(".hero-media", {
        yPercent: 10,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
    gsap.to(".hero-content", {
        y: -60,
        opacity: 0.1,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "20% top", end: "bottom top", scrub: true }
    });

    // Phrase d'intro : les mots s'allument au scroll
    const statement = document.getElementById("statement-text");
    const words = statement.textContent.trim().split(/\s+/);
    statement.innerHTML = words.map(w => `<span class="w">${w} </span>`).join("");
    gsap.fromTo(statement.querySelectorAll(".w"), { opacity: 0.16 }, {
        opacity: 1,
        ease: "none",
        stagger: 0.12,
        scrollTrigger: { trigger: statement, start: "top 82%", end: "bottom 50%", scrub: true }
    });
    gsap.from(".statement-meta > div", {
        opacity: 0, y: 30, duration: 1, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: ".statement-meta", start: "top 92%" }
    });

    // En-têtes de section
    gsap.utils.toArray(".section-head").forEach(head => {
        gsap.from(head.children, {
            opacity: 0, y: 50, duration: 1.2, stagger: 0.1, ease: "power4.out",
            scrollTrigger: { trigger: head, start: "top 88%" }
        });
    });

    // Cartes de réalisations : l'image se dévoile, puis le texte suit
    gsap.utils.toArray(".portfolio-card").forEach(card => {
        const tl = gsap.timeline({
            defaults: { ease: "expo.out" },
            scrollTrigger: { trigger: card, start: "top 86%" }
        });
        tl.from(card.querySelector(".portfolio-card-media"), { clipPath: "inset(0 0 100% 0)", duration: 1.4 })
          .from(card.querySelector(".portfolio-card-zoom"), { scale: 1.3, duration: 1.8, clearProps: "transform" }, 0)
          .from(card.querySelectorAll(".portfolio-card-meta, .portfolio-card-title, .portfolio-card-cta"), {
              opacity: 0, y: 26, duration: 1, stagger: 0.09, ease: "power3.out", clearProps: "transform,opacity"
          }, 0.35);
    });

    // Cartes d'inspirations : apparition par vagues
    ScrollTrigger.batch(".inspo-card", {
        start: "top 90%",
        onEnter: batch => gsap.from(batch, {
            opacity: 0, y: 50, duration: 1, stagger: 0.09, ease: "power3.out", clearProps: "transform,opacity"
        })
    });

    // Bandeau : accélère légèrement selon la vitesse de scroll
    ScrollTrigger.create({
        trigger: ".names",
        start: "top bottom",
        end: "bottom top",
        onUpdate: self => {
            const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 800, 4);
            gsap.to(namesRow.getAnimations()[0] || {}, { playbackRate: boost, duration: 0.2, overwrite: true });
            gsap.to(namesRow.getAnimations()[0] || {}, { playbackRate: 1, duration: 0.8, delay: 0.2 });
        }
    });

    // Footer
    gsap.from(".footer-big", {
        yPercent: 30, opacity: 0, duration: 1.4, ease: "power4.out",
        scrollTrigger: { trigger: ".site-footer", start: "top 80%" }
    });
}
