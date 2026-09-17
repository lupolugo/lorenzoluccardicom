# Sito personale — scheletro

Struttura HTML/CSS/JS puro, senza framework né build step. Pronto per GitHub Pages.

## Struttura cartelle

```
├── index.html        Homepage (hero + ultimi 5 articoli)
├── blog.html          Elenco completo articoli
├── wishlist.html       Griglia wishlist
├── libri.html         Griglia libri letti
├── libro.html         Scheda dettaglio di un libro (?id=... nell'URL)
├── css/style.css       Tutto lo stile, con i design tokens in cima al file
├── js/main.js          Menu mobile + funzioni che caricano i dati JSON
├── data/
│   ├── posts.json      Articoli del blog
│   ├── wishlist.json   Prodotti della wishlist
│   └── libri.json      Libri letti
└── assets/             Immagini
```

## Come funziona

Ogni pagina carica i propri dati da un file `.json` in `/data` tramite `fetch()`
(vedi `js/main.js`). Per aggiungere un articolo, un prodotto o un libro basta
aggiungere un nuovo oggetto al relativo file JSON — non serve toccare l'HTML.

La scheda del libro (`libro.html`) legge l'id dalla query string dell'URL
(es. `libro.html?id=2`) e cerca il libro corrispondente in `libri.json`.

## Test in locale

I browser bloccano `fetch()` su file aperti direttamente (`file://`), quindi
serve un piccolo server locale. Dalla cartella del progetto:

```bash
python3 -m http.server 8000
```

poi apri `http://localhost:8000` nel browser.

(Su GitHub Pages questo non serve: il sito viene servito via HTTP e i fetch
funzionano normalmente.)

## Pubblicazione su GitHub Pages

1. Metti tutti questi file nella root del repository (o in una cartella `docs/`
   se preferisci, impostandolo poi nelle Settings → Pages del repo).
2. Settings → Pages → seleziona il branch e la cartella da pubblicare.
3. Se hai un dominio proprietario, aggiungi un file `CNAME` nella root con
   dentro solo il tuo dominio (es. `lorenzoluccardi.com`) e configura i record
   DNS del dominio verso GitHub Pages.

## Prossimi passi possibili

- Personalizzare i colori/font nei `:root` di `css/style.css`.
- Aggiungere contenuti reali ai file JSON in `/data`.
- Valutare un sistema di commenti reale sul blog (es. Giscus, basato su GitHub
  Discussions — gratuito e compatibile con siti statici).
- Aggiungere pagine per i singoli post del blog (oggi puntano tutte a
  `blog.html`, da estendere sul modello di `libro.html`).
