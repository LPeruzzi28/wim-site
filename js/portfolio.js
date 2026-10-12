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

// Section work : une grande image de fond (celle du projet survolé) et, par-dessus, l'index des projets.
const esc = value => String(value).replace(/"/g, "&quot;");
const imgOf = (project, alt = "") => project.image
    ? `<img src="${encodeURI(project.image)}" alt="${esc(alt)}" loading="lazy" draggable="false" style="${project.imageStyle || ""}">`
    : "";

const wf = document.createElement("div");
wf.className = "wf";
wf.innerHTML = `<div class="wf-bg"></div><div class="wf-shade"></div><div class="wf-list"></div>`;
const wfBg = wf.querySelector(".wf-bg");
const wfList = wf.querySelector(".wf-list");

function setWf(index) {
    wfBg.querySelectorAll(".wf-slide").forEach((el, i) => el.classList.toggle("is-active", i === index));
    wfList.querySelectorAll(".wf-item").forEach((el, i) => el.classList.toggle("is-active", i === index));
}

projects.forEach((project, index) => {
    const slide = document.createElement("div");
    slide.className = "wf-slide";
    slide.innerHTML = imgOf(project);
    wfBg.appendChild(slide);

    const item = document.createElement("button");
    item.className = "wf-item";
    item.type = "button";
    item.innerHTML = `<h3 class="wf-title">${project.title}</h3><span class="wf-tag">${project.tag}</span>`;
    item.addEventListener("pointerenter", () => setWf(index));
    item.addEventListener("focus", () => setWf(index));
    item.addEventListener("click", () => openModal(project));
    wfList.appendChild(item);
});

setWf(0);
grid.appendChild(wf);

modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
});
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
});
