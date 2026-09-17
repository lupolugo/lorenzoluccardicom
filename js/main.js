/* ==========================================================================
   main.js
   Logica condivisa da tutte le pagine: apertura/chiusura menu mobile
   e utility per caricare dati dai file JSON in /data.
   ========================================================================== */

// --- Menu mobile -----------------------------------------------------------
function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    links.setAttribute("data-open", String(!isOpen));
  });

  // Chiudi il menu quando si clicca un link (utile su mobile)
  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      links.setAttribute("data-open", "false");
    });
  });
}

// --- Utility di formattazione -----------------------------------------------
function formatDate(isoDate) {
  const d = new Date(isoDate);
  return d.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// --- Caricamento dati --------------------------------------------------------
// Nota: il fetch di file locali richiede un piccolo server (es. `python3 -m
// http.server` dentro la cartella del sito), perché i browser bloccano il
// fetch su file:// per motivi di sicurezza. Su GitHub Pages funziona senza
// nessuna configurazione aggiuntiva.
async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Impossibile caricare ${path}`);
  return res.json();
}

// --- Rendering: lista articoli del blog --------------------------------------
async function renderPostList(targetSelector, { limit } = {}) {
  const target = document.querySelector(targetSelector);
  if (!target) return;

  try {
    let posts = await loadJSON("data/posts.json");
    posts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (limit) posts = posts.slice(0, limit);

    if (posts.length === 0) {
      target.innerHTML = '<p class="state-message">Nessun articolo pubblicato ancora.</p>';
      return;
    }

    target.innerHTML = posts
      .map(
        (post) => `
        <article class="post-row">
          <div class="post-date">${formatDate(post.date)}</div>
          <div>
            <h3 class="post-title"><a href="${post.url}">${post.title}</a></h3>
            <p class="post-excerpt">${post.excerpt}</p>
            ${post.sourceUrl ? `<a class="post-source" href="${post.sourceUrl}" target="_blank" rel="noopener">Articolo originale</a>` : ""}
          </div>
        </article>`
      )
      .join("");
  } catch (err) {
    target.innerHTML = '<p class="state-message">Errore nel caricamento degli articoli.</p>';
    console.error(err);
  }
}

// --- Rendering: wishlist ------------------------------------------------------
async function renderWishlist(targetSelector) {
  const target = document.querySelector(targetSelector);
  if (!target) return;

  try {
    const items = await loadJSON("data/wishlist.json");

    if (items.length === 0) {
      target.innerHTML = '<p class="state-message">La wishlist è vuota.</p>';
      return;
    }

    target.innerHTML = items
      .map(
        (item) => `
        <div class="wishlist-item">
          <div class="wishlist-thumb">
            <img src="${item.image}" alt="${item.name}" loading="lazy" />
          </div>
          <div class="wishlist-name">${item.name}</div>
          <div class="wishlist-price">${item.price}</div>
          <a class="wishlist-buy" href="${item.buyUrl}" target="_blank" rel="noopener">Vai all'acquisto</a>
        </div>`
      )
      .join("");
  } catch (err) {
    target.innerHTML = '<p class="state-message">Errore nel caricamento della wishlist.</p>';
    console.error(err);
  }
}

// --- Rendering: griglia libri --------------------------------------------------
async function renderBooksGrid(targetSelector) {
  const target = document.querySelector(targetSelector);
  if (!target) return;

  try {
    const books = await loadJSON("data/libri.json");

    if (books.length === 0) {
      target.innerHTML = '<p class="state-message">Nessun libro registrato ancora.</p>';
      return;
    }

    target.innerHTML = books
      .map(
        (book) => `
        <a class="book-spine" href="libro.html?id=${book.id}">
          <div class="book-cover">
            <img src="${book.image}" alt="${book.title}" loading="lazy" />
            <div class="book-cover-title">${book.title}</div>
          </div>
          <div class="book-author">${book.author}</div>
        </a>`
      )
      .join("");
  } catch (err) {
    target.innerHTML = '<p class="state-message">Errore nel caricamento dei libri.</p>';
    console.error(err);
  }
}

// --- Rendering: scheda dettaglio libro ------------------------------------------
async function renderBookDetail(targetSelector) {
  const target = document.querySelector(targetSelector);
  if (!target) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  try {
    const books = await loadJSON("data/libri.json");
    const book = books.find((b) => String(b.id) === id);

    if (!book) {
      target.innerHTML = '<p class="state-message">Libro non trovato.</p>';
      return;
    }

    document.title = `${book.title} — Libri letti`;

    target.innerHTML = `
      <div class="book-detail">
        <div class="book-cover">
          <div class="book-cover-title">${book.title}</div>
        </div>
        <div>
          <p class="eyebrow">${book.author}</p>
          <h1>${book.title}</h1>
          <div class="book-meta">
            <span>Iniziato il ${formatDate(book.dateStarted)}</span>
            <span>Terminato il ${formatDate(book.dateFinished)}</span>
            <span class="book-rating">${"★".repeat(book.rating)}${"☆".repeat(5 - book.rating)}</span>
          </div>
          <p>${book.review}</p>
        </div>
      </div>
    `;
  } catch (err) {
    target.innerHTML = '<p class="state-message">Errore nel caricamento della scheda.</p>';
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", initNav);
