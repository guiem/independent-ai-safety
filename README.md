# Independent AI Safety Network

An evidence-backed relationship graph for organizations working on AI safety. The project maps documented risk focus, lifecycle interventions, funding, fiscal sponsorship, evaluation, and collaboration without collapsing independence into a single score.

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Canonical records live in `data/`; the app reads generated files from `public/data/`.

## Validate and build

```bash
npm run check
```

This validates schemas and references, runs tests, regenerates deterministic JSON/CSV/GraphML, and builds the static site into `dist/`.

See [`docs/methodology.md`](docs/methodology.md), [`docs/evidence-policy.md`](docs/evidence-policy.md), and [`CONTRIBUTING.md`](CONTRIBUTING.md) before changing canonical records.

Code is MIT licensed. Original structured data is available under CC BY 4.0; source materials retain their own rights.
