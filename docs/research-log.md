# Research log

## 2026-09-15 — mandatory checkpoint

### Verified

- MindXO publishes an open 57-organization, 12-category atlas and links CC BY 4.0.
- AISafety.com publishes both a funding directory and a broad ecosystem map; it states CC BY-SA and describes its small nonprofit/community maintenance model.
- grantmaking.ai describes linked organization, person, project, fund, and grant data; ongoing feeds from four funding sources; provenance states; profile claiming; and public/private API layers. Its footer states CC BY-SA.
- The AI Safety Directory publishes extensive organization, tool, and grant lists, but no clear dataset license or field-level evidence policy was found on inspected pages.
- Kumu public projects are free, but Kumu states it has no public API; remote JSON is supported with limits.
- Graph Commons advertises GraphQL API access and broad exports, but its official pages currently disagree about the Starter node limit (100 versus 500).
- Flourish provides responsive public embeds; live data, HTML export, team features, and API-related capabilities are paid tiers or quote-based.
- Cytoscape.js is MIT-licensed and actively maintained; Sigma.js is WebGL-based, with its v4 documentation still labeled prerelease.
- Sampura Research's official 2026 launch page describes a fiscally sponsored nonprofit focused on human–AI complementarity for scalable oversight.

### Inferred

- The core unmet need is an auditable evidence store and relationship model, not visualization alone.
- Cytoscape.js should be adequate for filtered MVP views at hundreds to low thousands of elements, subject to a production benchmark.
- Editorial review capacity, rather than frontend engineering, is likely to be the long-term bottleneck.

### Unknown

- Adjacent projects' bulk data-sharing terms and partnership interest.
- Exact API limits and identifier guarantees for grantmaking.ai and Graph Commons.
- AI Safety Directory ownership, licensing, and editorial controls.
- The density of the eventual graph and therefore real client performance at 2,000 nodes.
- The available ongoing reviewer budget.

### Deferred pending approval

- Outreach to adjacent maintainers.
- Final scope/taxonomy/evidence documents and schemas.
- Canonical seed records and full frontend.
- GitHub workflows, discovery automation, and deployment.

### Sources

See citations in [existing-landscape.md](existing-landscape.md) and [platform-decision.md](platform-decision.md). Organization-specific spike labels were checked against [Sampura Research](https://sampura.org/news/announcing-sampura-research/), [LawZero](https://lawzero.org/en), and [Apollo Research](https://www.apolloresearch.ai/science).

