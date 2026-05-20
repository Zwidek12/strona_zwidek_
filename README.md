# Portfolio — Maksymilian Frankowski

Single-page personal portfolio (HTML + Tailwind CSS via CDN).

## Preview locally

Open `index.html` in a browser, or run a simple static server:

```bash
npx serve .
```

## GitHub Pages

**Settings → Pages →** branch `main`, folder `/ (root)`.

## Cloudflare Pages

Recommended build settings:

| Setting | Value |
|---------|--------|
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` |

The build only copies `index.html` into `dist/` (no Vite). After renaming the repo, reconnect Git to `Zwidek12/strona_zwidek_` in the Cloudflare project settings.
