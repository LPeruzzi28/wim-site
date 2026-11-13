/**
 * Simulation du serveur d'AuditCom pour la version de démonstration du portfolio.
 *
 * Le site d'origine charge la liste des clubs et le rapport PDF depuis le serveur de la classe, et envoie
 * le formulaire (nom, e-mail) à ce même serveur. Ici, tout est simulé dans le navigateur :
 * - la liste des clubs est un jeu de données d'exemple ;
 * - le formulaire n'envoie rien, aucune donnée ne quitte la page ;
 * - le « rapport » téléchargé est un PDF d'une page généré sur place.
 *
 * Ce fichier est chargé avant main.js, qui reste identique à l'original.
 */

const API_PREFIX = "https://auditcom.onrender.com/api";

const DEMO_CLUBS = [
    "FC Exemple", "AS Démo", "Olympique Test", "Sporting Maquette",
    "Union Prototype", "Racing Échantillon", "Étoile Fictive", "Stade Modèle"
].map((teamName, index) => ({
    teamName,
    title: "Rapport d'audit",
    author: `Équipe ${index + 1}`,
    uploadedAt: `2026-01-${String(12 + index).padStart(2, "0")} 10:00:00`,
    logoUrl: ""
}));

const jsonResponse = (body, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

/** PDF d'une page, construit à la main (les positions de la table xref sont calculées). */
function buildDemoPdf() {
    const stream = "BT /F1 22 Tf 72 740 Td (Rapport de demonstration) Tj ET\n"
        + "BT /F1 12 Tf 72 705 Td (Ce fichier est genere par la version de demonstration du portfolio.) Tj ET\n"
        + "BT /F1 12 Tf 72 685 Td (Le vrai rapport d'AuditCom n'est pas inclus.) Tj ET";
    const objects = [
        "<< /Type /Catalog /Pages 2 0 R >>",
        "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
        `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
        "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"
    ];
    let pdf = "%PDF-1.4\n";
    const offsets = objects.map((body, i) => {
        const offset = pdf.length;
        pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
        return offset;
    });
    const xrefAt = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    pdf += offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("");
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefAt}\n%%EOF`;
    return new TextEncoder().encode(pdf);
}

/** Réponse en flux (quelques morceaux espacés) pour que la barre de progression s'anime. */
function pdfResponse() {
    const bytes = buildDemoPdf();
    const chunkCount = 12;
    const chunkSize = Math.ceil(bytes.length / chunkCount);
    let sent = 0;
    const body = new ReadableStream({
        async pull(controller) {
            await new Promise((resolve) => setTimeout(resolve, 120));
            controller.enqueue(bytes.slice(sent, sent + chunkSize));
            sent += chunkSize;
            if (sent >= bytes.length) controller.close();
        }
    });
    return new Response(body, {
        status: 200,
        headers: { "Content-Type": "application/pdf", "Content-Length": String(bytes.length) }
    });
}

const realFetch = window.fetch.bind(window);

window.fetch = async (input, init) => {
    const url = typeof input === "string" ? input : input.url;
    if (!url.startsWith(API_PREFIX)) return realFetch(input, init);

    if (url === `${API_PREFIX}/pdfs`) {
        return jsonResponse({ success: true, count: DEMO_CLUBS.length, teamName: null, pdfs: DEMO_CLUBS });
    }
    if (url === `${API_PREFIX}/submit` && init?.method === "POST") {
        const { lastName, firstName, email } = JSON.parse(init.body);
        const valid = Boolean(lastName?.trim() && firstName?.trim() && /^\S+@\S+\.\S+$/.test(email ?? ""));
        return valid ? pdfResponse() : jsonResponse({ success: false }, 400);
    }
    return jsonResponse({ success: false }, 404);
};

/** Logos d'exemple : pastille de couleur avec les initiales du club (les vrais logos viennent du serveur). */
function logoFor(name) {
    const initials = name.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase();
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">`
        + `<circle cx="50" cy="50" r="48" fill="#5F6075"/>`
        + `<text x="50" y="62" font-family="Arial,sans-serif" font-size="34" font-weight="700" fill="#fff" text-anchor="middle">${initials}</text></svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function decorateTeams() {
    const teamList = document.querySelector("#teamList");
    new MutationObserver(() => {
        teamList.querySelectorAll("article").forEach((article) => {
            const img = article.querySelector("img");
            const name = article.querySelector("h2")?.textContent ?? "";
            if (img && !img.src.startsWith("data:")) img.src = logoFor(name);
        });
    }).observe(teamList, { childList: true });
}

function addDemoNotice() {
    const notice = document.createElement("p");
    notice.textContent = "Version de démonstration : données d'exemple, aucune information n'est envoyée.";
    notice.style.cssText = "position:fixed;left:50%;bottom:12px;transform:translateX(-50%);z-index:1000;"
        + "margin:0;padding:8px 14px;border-radius:999px;background:#111;color:#fff;font:500 13px/1.2 Arial,sans-serif;"
        + "box-shadow:0 4px 14px rgba(0,0,0,.3);max-width:calc(100vw - 24px);text-align:center;pointer-events:none;";
    document.body.append(notice);
}

decorateTeams();
addDemoNotice();
