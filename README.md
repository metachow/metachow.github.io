# metachow.github.io

Personal blog, built with [Astro](https://astro.build) and deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.

## Writing

Add a Markdown file to `src/content/posts/`. The filename becomes the URL (`hello-world.md` → `/post/hello-world/`).

```md
---
title: My post
date: 2026-09-22
tags: [photography]
cover: ../../assets/posts/my-post.jpg   # optional
description: One-line summary           # optional; defaults to the start of the post
---

Post body in Markdown.
```

Set `listed: false` for standalone pages (like `about.md`) that shouldn't appear in the post list, archives or RSS.

## Local development

```sh
npm install
npm run dev      # http://localhost:4321, live reload
npm run build    # output in dist/
```

## Where things live

- `src/styles/global.css` — all styles; `--bg-blur` controls the sidebar blur
- `src/components/Sidebar.astro` — sidebar, nav and mobile menu
- `src/consts.ts` — site title, description and nav items
- `src/assets/sidebar-bg.jpg` — sidebar background (blurred live by CSS)
