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
