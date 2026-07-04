// Extraits de ~25s (recadrés depuis les morceaux complets pour rester
// raisonnable côté droits d'auteur) dans le dossier "audio/".
const clips = [
    { title: "Everybody Loves The Sunshine — Roy Ayers Ubiquity", file: "audio/1. Everybody Loves The Sunshine.mp3" },
    { title: "Bam Bam — Sister Nancy", file: "audio/2. Bam Bam.mp3" },
    { title: "Out Getting Ribs — Feeling Blew", file: "audio/3. Out Getting Ribs.mp3" },
    { title: "Born Slippy (Nuxx) — Underworld", file: "audio/4. Born Slippy (Nuxx) - Radio Edit.mp3" },
    { title: "L'Amour Toujours — Gigi D'Agostino", file: "audio/5. L'Amour Toujours.mp3" },
    { title: "Porcelain — Moby", file: "audio/6. Porcelain.mp3" },
    { title: "Night Nurse — Gregory Isaacs", file: "audio/7. Night Nurse.mp3" },
    { title: "Closer to the Sun — Slightly Stoopid", file: "audio/8. Closer to the Sun.mp3" },
    { title: "Young Folks — Peter Bjorn and John", file: "audio/9. Young Folks.mp3" },
    { title: "Dreams — Fleetwood Mac", file: "audio/10. Dreams - 2004 Remaster.mp3" },
    { title: "escape — jacal", file: "audio/11. escape.mp3" },
    { title: "Chasing Cities — Tyron", file: "audio/12. Chasing Cities.mp3" },
    { title: "Sowing The Seeds Of Love — Tears For Fears", file: "audio/13. Sowing The Seeds Of Love.mp3" },
    { title: "Here I Come — Dennis Brown", file: "audio/14. Here I Come.mp3" },
    { title: "Where (U Are) — DJ Sonnenbrand", file: "audio/15. Where (U Are).mp3" },
    { title: "Spitting Off the Edge of the World — Yeah Yeah Yeahs/Perfume Genius", file: "audio/16. Spitting Off the Edge of the World.mp3" },
    { title: "Save That Shit — Chief Keef/Soulja Boy", file: "audio/17. Save That Shit.mp3" },
    { title: "2am — Slightly Stoopid", file: "audio/18. 2am.mp3" },
    { title: "Gypsy — Fleetwood Mac", file: "audio/19. Gypsy.mp3" }
];

const audio = document.getElementById("player-audio");
const toggle = document.getElementById("player-toggle");
const next = document.getElementById("player-next");
const title = document.getElementById("player-title");
const bar = document.getElementById("player-bar");
const barFill = document.getElementById("player-bar-fill");

let currentIndex = -1;

function pickRandomIndex() {
    if (clips.length === 1) return 0;
    let i;
    do {
        i = Math.floor(Math.random() * clips.length);
    } while (i === currentIndex);
    return i;
}

function loadClip(index) {
    currentIndex = index;
    const clip = clips[index];
    audio.src = encodeURI(clip.file);
    title.textContent = clip.title;
    barFill.style.width = "0%";
}

function play() {
    audio.play();
    toggle.classList.add("playing");
}

function pause() {
    audio.pause();
    toggle.classList.remove("playing");
}

function playRandom() {
    loadClip(pickRandomIndex());
    play();
}

if (clips.length > 0) {
    loadClip(pickRandomIndex());

    // Les navigateurs bloquent l'autoplay avec son avant une interaction
    // utilisateur : on tente directement, puis on retente au premier
    // clic/touche/touche clavier si c'est refusé.
    audio.play().then(() => toggle.classList.add("playing")).catch(() => {
        const startOnInteraction = () => {
            play();
            document.removeEventListener("click", startOnInteraction);
            document.removeEventListener("keydown", startOnInteraction);
            document.removeEventListener("touchstart", startOnInteraction);
        };
        document.addEventListener("click", startOnInteraction, { once: true });
        document.addEventListener("keydown", startOnInteraction, { once: true });
        document.addEventListener("touchstart", startOnInteraction, { once: true });
    });

    toggle.addEventListener("click", () => {
        if (audio.paused) play();
        else pause();
    });

    next.addEventListener("click", playRandom);

    audio.addEventListener("ended", playRandom);

    audio.addEventListener("timeupdate", () => {
        if (!audio.duration) return;
        barFill.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
    });

    bar.addEventListener("click", (e) => {
        if (!audio.duration) return;
        const rect = bar.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        audio.currentTime = ratio * audio.duration;
    });
} else {
    title.textContent = "Ajoute des extraits dans audio/";
    toggle.disabled = true;
    next.disabled = true;
}
