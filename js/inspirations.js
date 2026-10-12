// name  : nom de l'artiste / de la chaîne / du compte
// tag   : catégorie affichée (Musique, YouTube, TikTok, Film, Style...)
// link  : URL vers son profil / sa chaîne
// image : chemin vers une image (ou null pour un placeholder en attendant)
const inspirations = [
    {
        name: "Lounge4ever",
        tag: "Music inspo",
        link: "https://www.youtube.com/@Lounge4ever",
        image: "inspirations/Lounge4ever/Capture d’écran 2026-07-04 à 22.43.51.png"
    },
    {
        name: "Margoproxy",
        tag: "Music inspo",
        link: "https://www.youtube.com/@margoprxy",
        image: "inspirations/margoproxy/Capture d’écran 2026-07-04 à 22.38.24.png"
    },
    {
        name: "Mathieu Courdesses",
        tag: "Docu animalier",
        link: "https://www.youtube.com/@mathieucourdesses",
        image: "inspirations/Mathieu Courdesses/Capture d’écran 2026-07-04 à 22.39.04.png"
    },
    {
        name: "Clubsaab",
        tag: "Ski YouTuber",
        link: "https://www.youtube.com/@clubsaab",
        image: "inspirations/clubsaab/Capture d’écran 2026-07-04 à 22.45.16.png"
    },
    {
        name: "Kway",
        tag: "Ski YouTuber",
        link: "https://www.youtube.com/@kwayproduction",
        image: "inspirations/kway/Capture d’écran 2026-07-04 à 22.37.03.png"
    },
    {
        name: "Seriously nothing",
        tag: "Ski YouTuber",
        link: "https://www.youtube.com/@seriouslynothing",
        image: "inspirations/seriously nothing/Capture d’écran 2026-07-04 à 22.36.33.png"
    },
    {
        name: "Deadmen",
        tag: "Outdoor YouTuber",
        link: "https://www.youtube.com/@Deadmen",
        image: "inspirations/deadmen/Capture d’écran 2026-07-04 à 22.43.07.png"
    },
    {
        name: "Outdoor boys",
        tag: "Wild surviving",
        link: "https://www.youtube.com/@OutdoorBoys",
        image: "inspirations/outdoor boys/images (1).jpeg"
    },
    {
        name: "Wild Homestead",
        tag: "Shed building",
        link: "https://www.youtube.com/@wildhomestead",
        image: "inspirations/wild homestead/Capture d’écran 2026-07-04 à 22.40.11.png"
    },
    {
        name: "Jens",
        tag: "Car camping",
        link: "https://www.youtube.com/@jens-dransfield",
        image: "inspirations/jens/Capture d’écran 2026-07-04 à 22.41.01.png"
    },
    {
        name: "Kxd logos",
        tag: "Logo from the 90s",
        link: "https://www.tiktok.com/@kxdlogos",
        image: "inspirations/kxd logos/Capture d’écran 2026-07-04 à 22.49.17.png"
    }
];

const inspoGrid = document.getElementById("inspo-grid");

function buildInspoCard(item, hidden) {
    const card = document.createElement("a");
    card.className = "inspo-card";
    card.href = item.link;
    card.target = "_blank";
    card.rel = "noopener";
    if (hidden) {
        card.setAttribute("aria-hidden", "true");
        card.tabIndex = -1;
    }
    card.innerHTML = `
        <div class="inspo-card-media">
            ${item.image
                ? `<img src="${encodeURI(item.image)}" alt="${hidden ? "" : item.name}" loading="lazy" draggable="false">`
                : `<div class="placeholder">image bientôt disponible</div>`}
            <span class="inspo-card-sheet"><span>ouvrir</span><span>↗</span></span>
        </div>
        <div class="inspo-card-body">
            <h3 class="inspo-card-name">${item.name}</h3>
        </div>
    `;
    return card;
}

// Deux rangées ; chaque rangée contient sa liste deux fois pour boucler sans coupure.
const half = Math.ceil(inspirations.length / 2);
[inspirations.slice(0, half), inspirations.slice(half)].forEach(items => {
    const row = document.createElement("div");
    row.className = "inspo-row";
    const track = document.createElement("div");
    track.className = "inspo-track";
    // Répète la liste assez de fois pour dépasser la largeur d'un grand écran, puis double le tout.
    const repeat = 2;
    for (let pass = 0; pass < 2; pass++) {
        for (let r = 0; r < repeat; r++) {
            items.forEach(item => track.appendChild(buildInspoCard(item, pass > 0 || r > 0)));
        }
    }
    row.appendChild(track);
    inspoGrid.appendChild(row);
});
