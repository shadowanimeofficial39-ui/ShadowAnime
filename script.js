
"use strict";

/* =========================================
   SHADOW ANIME - COMPLETE WEBSITE SCRIPT
   ========================================= */

// Find the elements already present in index.html.
const animeGrid = document.getElementById("animeGrid");
const searchInput = document.getElementById("searchInput");
const emptyMessage = document.getElementById("emptyMessage");
const genreButtons = document.querySelectorAll("[data-genre]");

// Anime catalogue.
// videoUrl is empty until you have an authorized video source.
const animeList = [
    {
        title: "Naruto",
        year: 2002,
        genre: "Action",
        episodes: 220,
        description:
            "Follow Naruto Uzumaki as he trains to become a great ninja and earn the respect of his village.",
        poster: "https://placehold.co/400x600/252044/ffffff?text=Naruto",
        videoUrl: ""
    },
    {
        title: "One Piece",
        year: 1999,
        genre: "Adventure",
        episodes: 1000,
        description:
            "Join Monkey D. Luffy and his crew on an adventurous journey to find the legendary treasure.",
        poster: "https://placehold.co/400x600/252044/ffffff?text=One+Piece",
        videoUrl: ""
    },
    {
        title: "Demon Slayer",
        year: 2019,
        genre: "Action",
        episodes: 26,
        description:
            "Tanjiro begins a dangerous journey to protect people and search for a way to help his sister.",
        poster: "https://placehold.co/400x600/252044/ffffff?text=Demon+Slayer",
        videoUrl: ""
    },
    {
        title: "Your Name",
        year: 2016,
        genre: "Romance",
        episodes: 1,
        description:
            "Two teenagers discover a mysterious connection that links their lives across distance and time.",
        poster: "https://placehold.co/400x600/252044/ffffff?text=Your+Name",
        videoUrl: ""
    },
    {
        title: "Frieren",
        year: 2023,
        genre: "Fantasy",
        episodes: 28,
        description:
            "An elven mage reflects on friendship, time, and the meaning of the journey after a great adventure.",
        poster: "https://placehold.co/400x600/252044/ffffff?text=Frieren",
        videoUrl: ""
    },
    {
        title: "Spy x Family",
        year: 2022,
        genre: "Adventure",
        episodes: 25,
        description:
            "A spy, an assassin, and a telepath form an unusual family while hiding their secrets from one another.",
        poster: "https://placehold.co/400x600/252044/ffffff?text=Spy+x+Family",
        videoUrl: ""
    },
    {
        title: "Suzume",
        year: 2022,
        genre: "Fantasy",
        episodes: 1,
        description:
            "A young girl travels across Japan to help close mysterious doors connected to dangerous disasters.",
        poster: "https://placehold.co/400x600/252044/ffffff?text=Suzume",
        videoUrl: ""
    },
    {
        title: "Horimiya",
        year: 2021,
        genre: "Romance",
        episodes: 13,
        description:
            "Two classmates discover unexpected sides of one another and develop a close friendship.",
        poster: "https://placehold.co/400x600/252044/ffffff?text=Horimiya",
        videoUrl: ""
    }
];

let selectedGenre = "All";
let searchText = "";

/* =========================================
   CREATE ANIME CARDS
   ========================================= */

function createAnimeCard(anime) {
    const card = document.createElement("article");
    card.className = "anime-card";

    const poster = document.createElement("img");
    poster.className = "anime-poster";
    poster.src = anime.poster;
    poster.alt = anime.title + " poster";
    poster.loading = "lazy";

    poster.addEventListener("error", () => {
        poster.src =
            "https://placehold.co/400x600/252044/ffffff?text=Anime";
    }, { once: true });

    const info = document.createElement("div");
    info.className = "anime-info";

    const title = document.createElement("h3");
    title.textContent = anime.title;

    const details = document.createElement("p");
    details.textContent =
        anime.year + " • " + anime.genre;

    const button = document.createElement("button");
    button.className = "details-button";
    button.type = "button";
    button.textContent = "View Details";
    button.setAttribute(
        "aria-label",
        "View details for " + anime.title
    );

    button.addEventListener("click", () => {
        showAnimeDetails(anime);
    });

    info.append(title, details, button);
    card.append(poster, info);

    return card;
}

/* =========================================
   SEARCH AND GENRE FILTERING
   ========================================= */

function renderAnime() {
    if (!animeGrid) {
        console.error(
            'Could not find an element with id="animeGrid".'
        );
        return;
    }

    animeGrid.replaceChildren();

    const filteredAnime = animeList.filter((anime) => {
        const matchesSearch =
            anime.title.toLowerCase().includes(searchText) ||
            anime.genre.toLowerCase().includes(searchText);

        const matchesGenre =
            selectedGenre === "All" ||
            anime.genre.toLowerCase() ===
                selectedGenre.toLowerCase();

        return matchesSearch && matchesGenre;
    });

    filteredAnime.forEach((anime) => {
        animeGrid.appendChild(createAnimeCard(anime));
    });

    if (emptyMessage) {
        emptyMessage.hidden = filteredAnime.length !== 0;
    }
}

if (searchInput) {
    searchInput.addEventListener("input", (event) => {
        searchText = event.target.value.trim().toLowerCase();
        renderAnime();
    });
}

genreButtons.forEach((button) => {
    button.addEventListener("click", () => {
        selectedGenre = button.dataset.genre || "All";

        genreButtons.forEach((item) => {
            const active = item === button;
            item.classList.toggle("active", active);
            item.setAttribute("aria-pressed", String(active));
        });

        renderAnime();
    });

    button.setAttribute(
        "aria-pressed",
        String(button.classList.contains("active"))
    );
});

/* =========================================
   SHARED POPUP HELPERS
   ========================================= */

function createOverlay(dialogClass) {
    const overlay = document.createElement("div");
    overlay.className = "details-overlay";
    overlay.setAttribute("role", "presentation");

    const dialog = document.createElement("section");
    dialog.className = "details-dialog " + dialogClass;
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("tabindex", "-1");

    const closeButton = document.createElement("button");
    closeButton.className = "details-close";
    closeButton.type = "button";
    closeButton.textContent = "×";
    closeButton.setAttribute("aria-label", "Close window");

    dialog.appendChild(closeButton);
    overlay.appendChild(dialog);

    document.body.appendChild(overlay);
    document.body.classList.add("modal-open");

    function close() {
        overlay.remove();

        if (!document.querySelector(".details-overlay")) {
            document.body.classList.remove("modal-open");
        }

        document.removeEventListener("keydown", onKeydown);

        if (typeof close.previousFocus?.focus === "function") {
            close.previousFocus.focus();
        }
    }

    close.previousFocus = document.activeElement;

    function onKeydown(event) {
        if (event.key === "Escape") {
            close();
        }
    }

    closeButton.addEventListener("click", close);

    overlay.addEventListener("click", (event) => {
        if (event.target === overlay) {
            close();
        }
    });

    document.addEventListener("keydown", onKeydown);

    return { overlay, dialog, closeButton, close };
}

/* =========================================
   ANIME DETAILS POPUP
   ========================================= */

function showAnimeDetails(anime) {
    // Close any previous popup first.
    document.querySelectorAll(".details-overlay").forEach((item) => {
        item.remove();
    });
    document.body.classList.remove("modal-open");

    const popup = createOverlay("anime-details-dialog");
    const dialog = popup.dialog;

    const title = document.createElement("h2");
    title.textContent = anime.title;

    const facts = document.createElement("p");
    facts.className = "details-facts";
    facts.textContent =
        anime.year + " • " + anime.genre + " • " +
        (anime.episodes === 1
            ? "Movie"
            : anime.episodes + " episodes");

    const description = document.createElement("p");
    description.className = "details-description";
    description.textContent = anime.description;

    const notice = document.createElement("p");
    notice.className = "details-notice";
    notice.textContent =
        "Explore the anime details below. Streaming is available " +
        "only when an authorized video source has been added.";

    const watchButton = document.createElement("button");
    watchButton.className = "watch-anime-button";
    watchButton.type = "button";
    watchButton.textContent = "▶ Watch Anime";

    watchButton.addEventListener("click", () => {
        popup.close();
        showWatchPage(anime);
    });

    dialog.setAttribute("aria-labelledby", "detailsTitle");
    title.id = "detailsTitle";

    dialog.append(
        title,
        facts,
        description,
        notice,
        watchButton
    );

    popup.closeButton.focus();
}

/* =========================================
   WATCH PAGE
   ========================================= */

function showWatchPage(anime) {
    const popup = createOverlay("watch-page-dialog");
    const dialog = popup.dialog;

    const title = document.createElement("h2");
    title.textContent = "Watch " + anime.title;

    const subtitle = document.createElement("p");
    subtitle.className = "details-facts";
    subtitle.textContent = anime.year + " • " + anime.genre;

    dialog.setAttribute("aria-labelledby", "watchTitle");
    title.id = "watchTitle";

    if (anime.videoUrl) {
        // Only use a video URL you own or are authorized to stream.
        const video = document.createElement("video");
        video.className = "anime-video-player";
        video.controls = true;
        video.preload = "metadata";
        video.src = anime.videoUrl;

        video.style.width = "100%";
        video.style.maxHeight = "55vh";
        video.style.background = "#000";
        video.style.borderRadius = "12px";

        dialog.append(title, subtitle, video);
    } else {
        const message = document.createElement("p");
        message.className = "details-notice";
        message.textContent =
            "A video has not been added for this anime yet. " +
            "Shadow Anime is ready for a video URL that you own " +
            "or are authorized to stream.";

        const backButton = document.createElement("button");
        backButton.className = "watch-anime-button";
        backButton.type = "button";
        backButton.textContent = "Back to Anime Details";

        backButton.addEventListener("click", () => {
            popup.close();
            showAnimeDetails(anime);
        });

        dialog.append(title, subtitle, message, backButton);
    }

    popup.closeButton.focus();
}

/* =========================================
   POPUP AND WATCH PAGE STYLES
   ========================================= */

function addPopupStyles() {
    if (document.getElementById("popupStyles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "popupStyles";

    style.textContent = `
        body.modal-open {
            overflow: hidden;
        }

        .details-overlay {
            position: fixed;
            inset: 0;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            background: rgba(0, 0, 0, 0.82);
            backdrop-filter: blur(8px);
            overflow-y: auto;
        }

        .details-dialog {
            box-sizing: border-box;
            width: 100%;
            max-width: 560px;
            max-height: 85vh;
            overflow-y: auto;
            position: relative;
            padding: 32px;
            background: #171522;
            color: #f7f4ff;
            border: 1px solid rgba(155, 92, 255, 0.55);
            border-radius: 18px;
            box-shadow: 0 20px 70px rgba(0, 0, 0, 0.5);
        }

        .details-dialog h2 {
            padding-right: 35px;
            font-size: 27px;
            line-height: 1.3;
            overflow-wrap: anywhere;
        }

        .details-close {
            position: absolute;
            top: 12px;
            right: 16px;
            z-index: 2;
            width: 38px;
            height: 38px;
            border: none;
            border-radius: 8px;
            background: #29223c;
            color: white;
            font-size: 28px;
            cursor: pointer;
        }

        .details-close:hover {
            background: #7040bc;
        }

        .details-facts {
            color: #c7a8ff;
            line-height: 1.6;
        }

        .details-description,
        .details-notice {
            line-height: 1.7;
        }

        .details-notice {
            padding: 12px;
            border-radius: 10px;
            background: rgba(155, 92, 255, 0.10);
            color: #ded4f5;
        }

        .watch-anime-button {
            display: block;
            width: 100%;
            margin-top: 24px;
            padding: 14px 20px;
            border: none;
            border-radius: 10px;
            background: linear-gradient(135deg, #9b5cff, #ff4fa3);
            color: white;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
        }

        .watch-anime-button:hover {
            filter: brightness(1.15);
        }

        .watch-anime-button:focus-visible,
        .details-close:focus-visible {
            outline: 3px solid #ffffff;
            outline-offset: 3px;
        }
    `;

    document.head.appendChild(style);
}

/* =========================================
   START THE WEBSITE
   ========================================= */

addPopupStyles();
renderAnime();

const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

console.log("Shadow Anime loaded successfully!");
