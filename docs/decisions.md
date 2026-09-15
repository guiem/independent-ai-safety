# Decision log

## 2026-09-15 — D001: narrow the product boundary

- **Status:** accepted.
- **Decision:** Build an evidence-backed institutional relationship and independence graph, not another general AI-safety directory.
- **Reason:** Several maintained products already cover organization discovery. None of the inspected public products visibly combines transaction-level relationships, observable independence dimensions, field-level provenance, contradiction handling, and Git-portable history.
- **Reversal condition:** If an adjacent maintainer demonstrates this combined capability and offers an extensible contribution path, prefer contributing or integrating.

## 2026-09-15 — D002: Cytoscape.js over hosted authoring platforms

- **Status:** accepted.
- **Decision:** Cytoscape.js 3.x in a thin static client; YAML in Git is canonical.
- **Reason:** Best balance of graph semantics, interaction control, portability, current maturity, and zero license cost at an MVP scale of hundreds of nodes.
- **Alternative:** Sigma.js/Graphology if measured graph scale makes WebGL necessary; Graph Commons if engineering capacity becomes the binding constraint.

## 2026-09-15 — D003: static hosting

- **Status:** accepted.
- **Decision:** GitHub Actions builds and GitHub Pages hosts the first public release.
- **Reason:** Aligns review, history, build, and deployment while leaving generated assets portable.

## 2026-09-15 — D004: separate exhaustive discovery from canonical publication

- **Status:** accepted.
- **Decision:** Maintain a high-recall candidate registry and one rolling daily review PR; never add automatically discovered entities or facts directly to the public graph.
- **Reason:** Broad directories find small and regional groups but also contain individuals, programs, media, vendors, inactive projects, and unsupported claims. Domain deduplication plus human promotion preserves recall without presenting discovery noise as verified evidence.
