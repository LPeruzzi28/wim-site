// Remplace ces entrées par tes vraies inspirations.
// name  : nom de l'artiste / de la chaîne / du compte
// tag   : catégorie affichée (Musique, YouTube, TikTok, Film, Style...)
// link  : URL vers son profil / sa chaîne
// image : chemin vers une image (ou null pour un placeholder en attendant)
const inspirations = [
    {
        name: "Nom de l'artiste",
        tag: "Musique",
        link: "#",
        image: null
    },
    {
        name: "Nom de la chaîne YouTube",
        tag: "YouTube",
        link: "#",
        image: null
    },
    {
        name: "Nom du compte TikTok",
        tag: "TikTok",
        link: "#",
        image: null
    },
    {
        name: "Nom du réalisateur / film",
        tag: "Film",
        link: "#",
        image: null
    }
];

const inspoGrid = document.getElementById("inspo-grid");

inspirations.forEach(item => {
    const card = document.createElement("a");
    card.className = "inspo-card";
    card.href = item.link;
    card.target = "_blank";
    card.rel = "noopener";
    card.innerHTML = `
        ${item.image
            ? `<img class="inspo-card-thumb" src="${encodeURI(item.image)}" alt="${item.name}">`
            : `<div class="inspo-card-thumb placeholder">Image bientôt disponible</div>`}
        <div class="inspo-card-body">
            <span class="inspo-card-tag">${item.tag}</span>
            <h3 class="inspo-card-name">${item.name}</h3>
        </div>
    `;
    inspoGrid.appendChild(card);
});
