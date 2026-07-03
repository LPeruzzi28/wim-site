// Pilote le widget Spotify via l'API officielle (postMessage) pour pouvoir
// déclencher play() par script, ce qu'un simple <iframe> ne permet pas
// (origine différente : open.spotify.com).
window.onSpotifyIframeApiReady = (IFrameAPI) => {
    const element = document.getElementById("spotify-embed");
    const options = {
        uri: "spotify:playlist:0pxPz3FrToSyqZz1RMcmee",
        width: "100%",
        height: "152"
    };

    const defaultVolume = 0.3; // 0 (muet) à 1 (max) — ajuste ici si besoin

    IFrameAPI.createController(element, options, (EmbedController) => {
        EmbedController.setVolume(defaultVolume);

        // Les navigateurs bloquent tout son avant une interaction utilisateur.
        // On lance donc la lecture au tout premier clic/touche/touche clavier,
        // où qu'il soit sur la page, une seule fois.
        const startOnInteraction = () => {
            EmbedController.setVolume(defaultVolume);
            EmbedController.play();
            document.removeEventListener("click", startOnInteraction);
            document.removeEventListener("keydown", startOnInteraction);
            document.removeEventListener("touchstart", startOnInteraction);
        };
        document.addEventListener("click", startOnInteraction, { once: true });
        document.addEventListener("keydown", startOnInteraction, { once: true });
        document.addEventListener("touchstart", startOnInteraction, { once: true });
    });
};
