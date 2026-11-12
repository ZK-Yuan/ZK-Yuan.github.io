# zk-yuan.github.io

Personal site and résumé of Zekai Yuan (苑泽楷), served by GitHub Pages. Plain HTML, CSS and JavaScript, no build step.

- `index.html` — one page: intro statement, two-column résumé (about, experience, research, projects, life), travel covers and contact. Bilingual: every text has an `.en` and a `.zh` version, and the toggle switches `data-lang` on `<html>`.
- `assets/v3.css`, `assets/v3.js` — styles and interactions (word reveal, live Shenzhen clock, section nav, project hover previews, marquees, magnetic button).
- `assets/fonts/` — Inter, Instrument Serif and JetBrains Mono (SIL Open Font License).
- `images/v3/` — web-sized photos and project previews.
- `*-detail.html`, `bytedance-evaluation.html`, `assets/case-study.*` — older case-study pages, linked from Experience.

Preview locally with `python3 -m http.server 8000` and open `http://127.0.0.1:8000/`.
