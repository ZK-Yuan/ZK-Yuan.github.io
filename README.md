# zk-yuan.github.io

Personal site and résumé of Zekai Yuan (苑泽楷), served by GitHub Pages. Plain HTML, CSS and JavaScript, no build step.

- `index.html` — one page: a portrait hero (layout after Dennis Snellenberg) followed by a two-column résumé (layout after Brittany Chiang) with about, research, experience, projects, life and contact. Bilingual: every text has an `.en` and a `.zh` version, and the toggle switches `data-lang` on `<html>`. Wording follows the public CV in `assets/zekai-yuan-cv.pdf`.
- `assets/site.css`, `assets/site.js` — styles and interactions (greeting preloader, scroll-reactive name marquee, sticky section nav, cursor spotlight).
- `assets/fonts/` — Inter (SIL Open Font License).
- `images/v4/` — portrait, Ecure thumbnail and social preview; `images/v3/` — project thumbnails and travel covers.
- `*-detail.html`, `bytedance-evaluation.html`, `assets/case-study.*` — older case-study pages, linked from Experience.

Preview locally with `python3 -m http.server 8000` and open `http://127.0.0.1:8000/`.
