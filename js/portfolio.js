const projects = [
    {
        title: "DiBike",
        tag: "Projet de groupe",
        desc: "Projet en groupe de 3 où nous devions mettre en place un écosystème digital pour une association de vélo, de l'idée du concept à la création d'un site web, de posts Instagram, etc.",
        image: "projet-ecole/sae4/DiBike-mockup-insta.jpg",
        links: [
            { label: "Logo", href: "projet-ecole/sae4/DiBike_logotype_baseline_1024.png" },
            { label: "Poster (PDF)", href: "projet-ecole/sae4/DiBike-poster.pdf" },
            { label: "Présentation (PDF)", href: "projet-ecole/sae4/presentation.pdf" }
        ]
    },
    {
        title: "Vivre en Suisse",
        tag: "PHP / SQL · Projet d'une semaine",
        desc: "Projet d'une semaine mélangeant PHP et SQL. On a dû créer une page web qui présente divers scénarios autour de l'évolution climatique.",
        image: "projet-ecole/sae3/sae3-screenshot.png",
        imageStyle: "object-position: top;",
        links: [
            { label: "Voir le site", href: "https://vivreensuisse.objectif-fitness.ch" }
        ]
    },
    {
        title: "InfraDon lampadaires",
        tag: "Base de données",
        desc: "Projet de création et gestion de base de données : on nous a fourni des tableaux Excel remplis de données et nous avons dû créer la base de données pour en sortir certaines informations qui nous étaient demandées.",
        image: "projet-ecole/InfraDon-lampadaire/base-donnees-carres-flottants_78370-6689.avif",
        imageStyle: "transform: scale(1.6);",
        links: [
            { label: "Voir le poster (PDF)", href: "projet-ecole/InfraDon-lampadaire/poster_A3_InfraDon.pdf" }
        ]
    },
    {
        title: "Chaîne YouTube",
        tag: "Perso · Vidéo",
        desc: "Chaîne YouTube lancée cet hiver pour documenter et garder des souvenirs de mes journées de ski.",
        image: "projet-ecole/ytb/ytb-thumbnail.png",
        video: "video/ski-loop.mp4",
        links: [
            { label: "Voir la chaîne", href: "https://www.youtube.com/@LPoezzi" }
        ]
    },
    {
        title: "Série photo",
        tag: "Photographie",
        desc: "Projet photo : réaliser une série de 4 photos, dont une avec une faible profondeur de champ et une autre en studio.",
        image: "projet-ecole/Projet-serie-photo/Capture d’écran 2026-07-04 à 23.03.56.png",
        links: [
            { label: "Voir le PDF", href: "projet-ecole/Projet-serie-photo/M54-3-Peruzzi-Louis.pdf" }
        ]
    },
    {
        title: "RepGraph",
        tag: "Dataviz",
        desc: "Nous devions choisir une statistique et en tirer une représentation que nous voulions mettre en avant sous forme de graphique.",
        image: "projet-ecole/repGraph/RepGraph.png",
        imageStyle: "object-position: left top;",
        links: [
            { label: "Voir le PDF", href: "projet-ecole/repGraph/RepGraph_LouisPeruzzi.pdf" }
        ]
    },
    {
        title: "Muxic Festival",
        tag: "Design graphique",
        desc: "Pour la première semaine de cours, il nous a été demandé de faire des propositions graphiques pour un festival fictif à Yverdon, le Muxic Festival.",
        image: "projet-ecole/muxic/muxic-mockup-flyer.png",
        links: []
    },
    {
        title: "Auditcom club de foot",
        tag: "Projet de groupe · Communication",
        desc: "Projet en groupe de deux : un club de foot suisse nous a été assigné et nous avons dû réaliser un audit de leur communication, puis un site web mettant en avant tous les rapports réalisés par les différentes équipes de la classe.",
        image: "projet-ecole/auditcom-clubfoot/auditcom-screenshot.png",
        imageStyle: "object-position: top;",
        links: []
    }
];

const grid = document.getElementById("portfolio-grid");
const modal = document.getElementById("portfolio-modal");
const modalMedia = document.getElementById("portfolio-modal-media");
const modalTag = document.getElementById("portfolio-modal-tag");
const modalTitle = document.getElementById("portfolio-modal-title");
const modalDesc = document.getElementById("portfolio-modal-desc");
const modalLinks = document.getElementById("portfolio-modal-links");
const modalClose = document.getElementById("portfolio-modal-close");

function openModal(project) {
    modalMedia.innerHTML = project.video
        ? `<video src="${encodeURI(project.video)}" poster="${encodeURI(project.image || "")}" autoplay muted loop playsinline></video>`
        : project.image
        ? `<img src="${encodeURI(project.image)}" alt="${project.title}" style="${project.imageStyle || ""}">`
        : "";
    modalTag.textContent = project.tag;
    modalTitle.textContent = project.title;
    modalDesc.textContent = project.desc;
    modalLinks.innerHTML = project.links
        .map(link => `<a href="${encodeURI(link.href)}" target="_blank" rel="noopener">${link.label}</a>`)
        .join("");
    modal.classList.add("open");
    if (window.lenis) window.lenis.stop();
    document.body.style.overflow = "hidden";
}

function closeModal() {
    modal.classList.remove("open");
    if (window.lenis) window.lenis.start();
    document.body.style.overflow = "";
}

// Section work : accordéon de bandes verticales. Chaque projet est une bande en verre flouté avec son titre à
// la verticale ; la bande survolée s'ouvre en grand et montre son image et son titre.
const esc = value => String(value).replace(/"/g, "&quot;");
const imgOf = (project, alt = "") => project.image
    ? `<img src="${encodeURI(project.image)}" alt="${esc(alt)}" loading="lazy" draggable="false" style="${project.imageStyle || ""}">`
    : "";

const acc = document.createElement("div");
acc.className = "wf-acc";
const touchOnly = window.matchMedia("(hover: none)");
const panels = [];
let wfIndex = 0;

// Tout est piloté par des variables CSS : les colonnes / lignes de la grille (pour une transition fluide)
// et la distance de chaque carte à la carte active (pour la variante "éventail").
function setWf(index) {
    wfIndex = index;
    panels.forEach((el, i) => {
        el.classList.toggle("is-active", i === index);
        el.style.setProperty("--d", i - index);
        el.style.setProperty("--ad", Math.abs(i - index));
    });
    const track = (n, on, off) => Array.from({ length: n }, (_, i) => (i === index ? on : off)).join(" ");
    acc.style.setProperty("--cols", track(projects.length, "9fr", "1fr"));
    acc.style.setProperty("--rows", track(projects.length, "9fr", "1fr"));
    const col = index % 4, row = Math.floor(index / 4);
    acc.style.setProperty("--cols4", [0, 1, 2, 3].map(c => (c === col ? "2.3fr" : "1fr")).join(" "));
    acc.style.setProperty("--rows2", [0, 1].map(r => (r === row ? "1.7fr" : "1fr")).join(" "));
}

// Les images gardent une taille fixe (celle de l'état ouvert) et sont seulement "révélées" par la bande :
// elles ne sont jamais recalculées pendant l'animation, ce qui la rend fluide.
function updateSizes() {
    const w = acc.clientWidth, h = acc.clientHeight;
    const mode = document.documentElement.dataset.wfMode;
    let fw = w * 0.58, fh = h;
    if (mode === "2") { fw = w; fh = h * 0.62; }
    if (mode === "3") { fw = w * 0.45; fh = h * 0.64; }
    if (mode === "5") { fw = w * 0.46; fh = h; }
    acc.style.setProperty("--fw", `${Math.round(fw)}px`);
    acc.style.setProperty("--fh", `${Math.round(fh)}px`);
}

projects.forEach((project, index) => {
    const panel = document.createElement("button");
    panel.className = "wf-panel";
    panel.type = "button";
    panel.style.setProperty("--gc", (index % 4) + 1);
    panel.style.setProperty("--gr", Math.floor(index / 4) + 1);
    panel.setAttribute("aria-label", project.title);
    panel.innerHTML = `
        ${imgOf(project)}
        <span class="wf-panel-glass"></span>
        <span class="wf-panel-v">${project.title}</span>
        <span class="wf-panel-h">
            <span class="wf-panel-tag">${project.tag}</span>
            <span class="wf-panel-title">${project.title}</span>
        </span>
    `;
    // le premier visuel est chargé tout de suite (c'est celui qu'on voit en premier)
    if (index === 0) panel.querySelectorAll("img").forEach(img => { img.loading = "eager"; });
    panel.addEventListener("pointerenter", e => {
        // variante éventail : on choisit en cliquant (sinon la carte bouge sous le curseur)
        if (e.pointerType === "mouse" && document.documentElement.dataset.wfMode !== "5") setWf(index);
    });
    panel.addEventListener("focus", () => setWf(index));
    panel.addEventListener("click", () => {
        const needsSelect = !panel.classList.contains("is-active")
            && (touchOnly.matches || document.documentElement.dataset.wfMode === "5");
        if (needsSelect) { setWf(index); return; }
        openModal(project);
    });
    panels.push(panel);
    acc.appendChild(panel);
});

window.addEventListener("resize", updateSizes);
window.addEventListener("wf-mode", updateSizes);
setWf(0);
updateSizes();
grid.appendChild(acc);

modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
});
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
});
