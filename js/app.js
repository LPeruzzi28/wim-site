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

// ---------- Présentation de la section work (sélecteur temporaire pour comparer 3 propositions) ----------
const workButtons = document.querySelectorAll("[data-work-style]");
function setWork(n, persist) {
    if (!["1", "2", "3"].includes(n)) n = "1";
    document.documentElement.setAttribute("data-work", n);
    workButtons.forEach(b => b.classList.toggle("is-active", b.dataset.workStyle === n));
    if (persist) {
        try { localStorage.setItem("wim-work", n); } catch (e) {}
    }
}
workButtons.forEach(b => b.addEventListener("click", () => setWork(b.dataset.workStyle, true)));
setWork(document.documentElement.getAttribute("data-work"), false);

// Aperçu d'image qui suit la souris sur la version "liste"
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !prefersReducedMotion) {
    const preview = document.getElementById("preview");
    const previewImg = preview.querySelector("img");
    let px = -999, py = -999, tx = -999, ty = -999, running = false;

    const tick = () => {
        px += (tx - px) * 0.16;
        py += (ty - py) * 0.16;
        preview.style.transform = `translate3d(${px}px, ${py}px, 0)`;
        if (Math.abs(tx - px) > 0.3 || Math.abs(ty - py) > 0.3) requestAnimationFrame(tick);
        else running = false;
    };

    window.addEventListener("pointermove", e => {
        tx = e.clientX + 28;
        ty = e.clientY - preview.offsetHeight / 2;
        if (px === -999) { px = tx; py = ty; }
        if (!running) { running = true; requestAnimationFrame(tick); }
    }, { passive: true });

    const list = document.querySelector(".work-view--list");
    list.addEventListener("pointerover", e => {
        const row = e.target.closest(".wl-row");
        if (!row || !row.dataset.preview) return;
        previewImg.src = encodeURI(row.dataset.preview);
        preview.style.opacity = 1;
    });
    list.addEventListener("pointerout", e => {
        const row = e.target.closest(".wl-row");
        if (!row || row.contains(e.relatedTarget)) return;
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
