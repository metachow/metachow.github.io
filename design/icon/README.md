Source files for the site icon, as exported from the design tool (they carry a C2PA provenance manifest in `<metadata>`).

The served files in `public/` are derived from these:

- `favicon.svg`: `favicon.svg` (light mode) and `favicon-light.svg` (dark mode) merged, switching on `prefers-color-scheme`, metadata stripped
- `favicon.ico`: 16/32/48 px from `favicon.svg`
- `apple-touch-icon.png` (180), `icon-192.png`, `icon-512.png`: from `metachow-apple-touch-icon.svg`
