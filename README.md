# Playbox Visualizers Template

This repository is the starter scaffold for Playbox-managed visualizer workspaces.

## Included

- Next.js App Router shell
- Shared header, theme provider, and theme toggle
- `data/visualisers.json` registry pattern
- One sample visualizer route at `/queue`
- `AGENTS.md` and `CLAUDE.md` guidance files for builder context

## Local development

```bash
npm install
npm run dev
```

## Adding a new visualizer

1. Create a route in `app/<slug>/page.tsx`.
2. Create a component in `components/Visualizers/<Name>Visualizer/`.
3. Add an entry in `data/visualisers.json`.
4. Reuse the sample queue visualizer as the reference structure for controls, styling, and event tracking.
