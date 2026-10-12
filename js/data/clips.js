/**
 * Extraits audio (~25 s) joués par le lecteur. Ils sont recadrés depuis les morceaux complets
 * pour rester raisonnables côté droits d'auteur, et rangés dans le dossier « audio/ ».
 *
 * @typedef {Object} Clip
 * @property {string} title  « Titre · Artiste » affiché dans le lecteur.
 * @property {string} file   Chemin du fichier audio.
 */

/** @type {Clip[]} */
export const clips = [
    { title: "Everybody Loves The Sunshine · Roy Ayers Ubiquity", file: "audio/1. Everybody Loves The Sunshine.mp3" },
    { title: "Bam Bam · Sister Nancy", file: "audio/2. Bam Bam.mp3" },
    { title: "Out Getting Ribs · Feeling Blew", file: "audio/3. Out Getting Ribs.mp3" },
    { title: "Born Slippy (Nuxx) · Underworld", file: "audio/4. Born Slippy (Nuxx) - Radio Edit.mp3" },
    { title: "Porcelain · Moby", file: "audio/6. Porcelain.mp3" },
    { title: "Night Nurse · Gregory Isaacs", file: "audio/7. Night Nurse.mp3" },
    { title: "Closer to the Sun · Slightly Stoopid", file: "audio/8. Closer to the Sun.mp3" },
    { title: "Young Folks · Peter Bjorn and John", file: "audio/9. Young Folks.mp3" },
    { title: "Dreams · Fleetwood Mac", file: "audio/10. Dreams - 2004 Remaster.mp3" },
    { title: "escape · jacal", file: "audio/11. escape.mp3" },
    { title: "Chasing Cities · Tyron", file: "audio/12. Chasing Cities.mp3" },
    { title: "Sowing The Seeds Of Love · Tears For Fears", file: "audio/13. Sowing The Seeds Of Love.mp3" },
    { title: "Here I Come · Dennis Brown", file: "audio/14. Here I Come.mp3" },
    { title: "Spitting Off the Edge of the World · Yeah Yeah Yeahs/Perfume Genius", file: "audio/16. Spitting Off the Edge of the World.mp3" },
    { title: "2am · Slightly Stoopid", file: "audio/18. 2am.mp3" },
    { title: "Gypsy · Fleetwood Mac", file: "audio/19. Gypsy.mp3" }
];
