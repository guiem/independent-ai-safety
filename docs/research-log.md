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

## 2026-09-15 — exhaustive discovery expansion

### Verified

- The [AI Evaluator Forum member list](https://aievaluatorforum.org/about/members) currently exposes eight independent evaluation organizations or programs and is a high-precision discovery input.
- The [Mathematical AI Safety Institute list](https://maisi.org/research/organizations) supplies focused mathematical and technical safety leads.
- Broader sources—including [AISafety.com](https://aisafety.com/map), [Failure-First](https://failurefirst.org/research/ai-safety-orgs/), and [AI Safety Guide](https://www.aisafetyguide.org/institutes)—substantially increase recall but mix organizations with programs, funders, communities, and frontier developers.
- A live, robots-aware collection pass plus a primary-source check of public AI safety institutes produced 281 non-canonical candidate domains after canonical-domain deduplication and obvious media/social/infrastructure exclusions. Thirty-seven candidates appeared in more than one configured source.
- Current government sources confirm operating institute or office leads in Australia, Canada, the European Union, France, Japan, the Republic of Korea, Singapore, the United Kingdom, and the United States. Kenya participates in the international network, but its current implementation roadmap describes establishing a National AI Risk and Safety Institute as future work, so no operating-institute candidate was asserted.

### Limitations

- Candidate counts measure unique website domains, not verified in-scope institutions.
- Directory labels and categories are discovery metadata only.
- The UNESCO map returned HTTP 403 to the collector and remains a manual discovery source until permitted structured access exists.
- News search has high noise and is filtered to organization/funding/change terms before entering the review report.
- Exhaustive discovery is not exhaustive verification: every candidate still needs primary-source review before canonical promotion.
