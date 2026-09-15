# Platform decision: evidence graph and public explorer

Status: **Proposed — approval required before full implementation**  
Decision date: 2026-09-15  
Research horizon: public product pages and documentation retrieved 2026-09-15

## Decision

Use **Cytoscape.js 3.x as the graph renderer inside a thin static web application**, with canonical human-readable YAML in Git, JSON Schema validation, and deterministic JSON/CSV/GraphML builds. Deploy the static application through GitHub Actions to GitHub Pages initially, retaining the option to move the generated assets to another static host without changing the data model.

This is a conditional go. The representation is differentiated; a generic directory is not. Before bulk collection, seek data-partnership conversations with grantmaking.ai, AISafety.com, and MindXO.

Direct answer: **we are reusing a mature graph library, not rebuilding a graph engine**. The project-specific work is the evidence model, editorial workflow, accessible explorer, filters, and deterministic export pipeline. Those are the product.

## Representation

Use a heterogeneous, directed, multilayer property graph:

- primary nodes: organizations and contextual institutions;
- controlled-vocabulary nodes or attributes: safety topics and lifecycle stages;
- factual edges: funding, sponsorship, incubation, spin-out, collaboration, evaluation, commissioning, membership, and affiliation;
- derived edges: topic similarity, computed and visually separated from factual claims;
- evidence records: sources linked to every material field and relationship;
- observation records: dated funding, headcount, revenue/budget, and output measurements.

Canonical YAML should represent domain records, not renderer-specific elements. A deterministic build should resolve IDs and compile separate browser JSON and portable exports. This keeps Cytoscape.js replaceable.

## Scoring method

Scores are 1 (poor) to 5 (excellent) for this project's stated needs. All criteria are equally weighted because no stakeholder weights have yet been approved. A product claim earns at most 4 unless the behavior was exercised in the local spike or is structurally under project control. “Accessibility” includes the ability to provide a keyboard/searchable non-canvas alternative; canvas/WebGL renderers do not get credit merely for being responsive.

| Criterion | Kumu | Graph Commons | Flourish | Cytoscape.js | Sigma.js + Graphology |
| --- | ---: | ---: | ---: | ---: | ---: |
| Public URL / embed | 5 | 5 | 5 | 5 | 5 |
| Filtering / search | 5 | 4 | 4 | 5 | 5 |
| Typed nodes / edges | 5 | 5 | 3 | 5 | 5 |
| Switchable size / color | 4 | 4 | 3 | 5 | 5 |
| URL-addressable views | 5 | 4 | 3 | 5 | 5 |
| Mobile / accessibility | 3 | 3 | 4 | 3 | 3 |
| 100 / 500 / 2,000 nodes | 3 | 5 | 3 | 4 | 5 |
| Automated Git JSON/CSV updates | 3 | 5 | 3 | 5 | 5 |
| CSV / JSON / GraphML export | 3 | 5 | 2 | 5 | 5 |
| Collaboration / contributions | 5 | 5 | 4 | 5 | 5 |
| Branding / customization | 3 | 4 | 4 | 5 | 5 |
| Analytics | 3 | 3 | 3 | 4 | 4 |
| Cost now / at scale | 4 | 3 | 2 | 5 | 5 |
| Low lock-in / portability | 3 | 3 | 2 | 5 | 5 |
| Low maintenance burden | 5 | 5 | 5 | 3 | 2 |
| **Total / 75** | **59** | **63** | **50** | **68** | **69** |

Sigma narrowly wins an unweighted total because of WebGL performance. Cytoscape.js is recommended because this MVP is expected to contain hundreds, not tens of thousands, of visible nodes and needs rich typed-edge interaction, compound/layered graph semantics, mature extensions, and less custom rendering work. Performance should be revisited if a normal filtered view exceeds roughly 2,000 nodes or 10,000 edges.

## Alternatives considered

### Kumu

Kumu is the strongest low-code option. Public projects and unlimited collaborators are free; private projects start at $9/month, and Pro workspaces are $10/month plus $20/month per private project. It supports filters, clustering, views, embeds, and predictable deep links to maps, views, and elements. It can follow remote JSON and export Excel/JSON.

The limitations are decisive for the canonical system: Kumu states that it has no public API; remote JSON blueprints cover elements/connections/loops rather than a full project; JSON exports omit presentations; and practical performance depends on client and graph complexity. Its visual configuration and presentations would become additional platform state outside Git. It remains an excellent editorial/demo client over a Git-owned dataset, and a 30–50-node Kumu import should be tested later if a nontechnical maintainer workflow becomes a priority.

Sources: [pricing](https://www.kumu.io/pricing), [no public API](https://docs.kumu.io/frequently-asked-questions/does-kumu-have-a-public-api), [remote JSON](https://docs.kumu.io/guides/import/blueprints), [exports](https://docs.kumu.io/guides/export), [deep-link URLs](https://docs.kumu.io/guides/urls), [data-volume guidance](https://docs.kumu.io/frequently-asked-questions/how-much-data-can-kumu-handle).

### Graph Commons

Graph Commons is the strongest hosted graph-native alternative. Its current main pricing page says Starter is free with 100 nodes per graph, Professional is $20/month with up to 20,000 nodes, and Organization is $250/month with up to 1 million nodes. It advertises CSV, JSON, GraphML, Cypher, and Excel exports, embedding, deeplinks, collaboration, and a read/write GraphQL API on every plan.

There is a pricing-document inconsistency: a separate indexed Starter page says 500 nodes. Until clarified, assume the stricter 100-node free limit. Professional could host an MVP cheaply, but the public explorer and editorial state would depend on a vendor account and service terms. It is a credible fallback if staffing cannot support even a thin custom client.

Sources: [current plans and feature matrix](https://graphcommons.com/plans), [separate Starter page showing a conflicting limit](https://graphcommons.com/plans/free), [terms/API conditions](https://graphcommons.com/terms).

### Flourish network charts

Flourish is polished, responsive, and easy to embed. Its network template supports directional arrows, weighted links, filters, popups, and radial or force layouts. The free plan supports public publishing with attribution. Live CSV/Google Sheets updates, HTML self-hosting, team collaboration, and unbranded embeds are Publisher features sold by quote; enterprise adds a rendering API.

It is optimized for authored visual stories, not an evidence-rich application with several normalized record types, field-level citations, arbitrary profile routing, and portable graph exports. Data portability and automation would be weaker or paid, so it is better for editorial snapshots than the canonical explorer.

Sources: [network chart](https://flourish.studio/visualisations/network-charts/), [pricing and features](https://flourish.studio/pricing/), [accessibility](https://flourish.studio/accessibility/).

### Cytoscape.js

Cytoscape.js is an MIT-licensed graph theory and visualization library with directed, undirected, mixed, multi-, loop, and compound graph support; filtering, traversal, styling, layouts, and graph algorithms; JSON serialization; and an extension ecosystem that includes GraphML and view utilities. The GitHub project had 11k stars and a current 3.x release in 2026, supporting the maturity assessment.

It does not provide product UI, accessible profiles, analytics, or hosting. Those must be built. The local spike demonstrates the core interactions with 40 representative nodes: typed filters, size/color switching, selected-node details, evidence affordance, and query-string state. It is intentionally not canonical data.

Sources: [documentation](https://js.cytoscape.org/), [repository and release history](https://github.com/cytoscape/cytoscape.js/), [MIT license](https://github.com/cytoscape/cytoscape.js/blob/unstable/LICENSE), [layout/performance guidance](https://blog.js.cytoscape.org/2020/05/11/layouts/).

### Sigma.js + Graphology

Sigma.js is an open-source WebGL renderer built on Graphology. Its stable documentation describes graphs of thousands of nodes and edges, while the v4 beta documentation describes smooth interaction at tens of thousands and exposes detailed performance controls. Graphology supplies the graph data structures and algorithms.

It is the better rendering choice if scale dominates. For this product, custom edge interaction, semantic styling, layout orchestration, and accessibility would require more application work. Use stable v3 if selected today; v4 is still marked beta/alpha in its own documentation. Keep it as the migration target if Cytoscape.js performance tests fail.

Sources: [stable introduction](https://www.sigmajs.org/docs/), [v4 rendering model](https://v4.sigmajs.org/concepts/rendering/), [performance guidance](https://v4.sigmajs.org/how-to/technical/performance/), [Graphology data model](https://www.sigmajs.org/docs/advanced/data/).

## Spike result

The runnable spike is at [`spikes/cytoscape/index.html`](../spikes/cytoscape/index.html). Serve the repository root (for example, `python3 -m http.server 8000`) and open `/spikes/cytoscape/`.

It contains 40 illustrative nodes covering core organizations, frontier developers, funders, government institutes, topics, and lifecycle stages. It includes METR, LawZero, Sampura Research, and Apollo Research. The spike validates that one renderer instance can update size and color without reload, filter typed nodes/edges, select nodes and edges into a details panel, and persist view controls in the URL. It does **not** validate accessibility, mobile layouts, production performance, or the truth of a canonical dataset.

No hosted-platform spikes were created because doing so would require creating third-party accounts and durable vendor-side project state. Their relevant limits were instead checked against current official documentation.

## Architecture

```text
human-reviewed YAML + source records
              |
       schema validation
              |
   deterministic build/export
       /        |         \
 browser JSON  CSV      GraphML
       |
 static explorer (Cytoscape.js + semantic HTML details/list view)
       |
 GitHub Actions -> GitHub Pages (replaceable static host)
```

- Canonical format: one YAML file per core organization plus normalized relationship, source, and observation files.
- Validation: JSON Schema plus cross-record checks for duplicate IDs, dangling references, dates/currencies, and likely double-counted funding.
- Frontend: small TypeScript application; Cytoscape.js only owns graph rendering and interaction.
- Accessibility: every graph state must have an equivalent searchable/filterable HTML list, keyboard-reachable controls, textual relationship summaries, and non-color-only encodings.
- Routing: query parameters for named view, filters, size metric, color dimension, and selected record; stable path or query identifier for organization profiles.
- Updates: scheduled discovery creates batched candidates or pull requests; only reviewed YAML becomes canonical.
- Hosting: GitHub Pages supports public repositories, custom domains, HTTPS, and custom Actions builds. Its documented 1 GB published-site and 100 GB/month soft bandwidth limits are ample for the MVP; migrate to another static CDN if usage grows.

Sources: [GitHub Pages custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages), [GitHub Pages limits](https://docs.github.com/en/enterprise-cloud@latest/pages/getting-started-with-github-pages/github-pages-limits).

## Costs and maintenance

- Software/hosting at MVP: $0 for Cytoscape.js and a public GitHub Pages repository, excluding a domain and any paid data services.
- Expected engineering maintenance after launch: roughly 0.5–1 day/month for dependency updates, browser/accessibility regressions, and CI; this excludes research/editorial review, which will dominate ongoing effort.
- Expected initial frontend effort: 2–4 engineer-weeks for a credible accessible explorer after schemas and sample data stabilize.
- Research/editorial burden: likely at least 1–2 reviewer-days/week during seed collection and ongoing discovery. This is the principal sustainability risk.

These are planning estimates, not vendor quotes.

## Tradeoffs and risks

- **Accessibility:** Canvas graphs are not inherently screen-reader navigable. The HTML list/profile view is a release requirement, not a later enhancement.
- **Hairball risk:** Default queries must constrain context and edge layers; topic similarity must remain off by default and visually marked as derived.
- **Editorial capacity:** A sophisticated schema can create an illusion of rigor without reviewers. Start with fewer, well-evidenced records.
- **Source rights:** Facts may be reusable while original prose/database selection can be protected. Store short supporting paraphrases and metadata; do not bulk-copy unclear datasets.
- **Dependency risk:** Pin Cytoscape.js 3.x and extensions. Test upgrades. Do not adopt Sigma v4 while its own site labels it prerelease.
- **Hosting risk:** GitHub Pages is replaceable because builds produce static assets. Avoid runtime reliance on GitHub APIs for the public site.
- **Partnership duplication:** If grantmaking.ai exposes sufficient public transaction/provenance data, integrate or cross-link rather than recollect it.

## Migration path

1. Keep canonical data and URLs renderer-neutral.
2. Separate graph projection from domain records in the build step.
3. If Cytoscape.js fails the 2,000-node performance target, replace the renderer with Sigma.js/Graphology while preserving the explorer controls and JSON contract.
4. If engineering capacity disappears, publish generated Kumu/Graph Commons imports as a reduced-function fallback while retaining Git as source of truth.
5. Static hosting can move from GitHub Pages to Cloudflare Pages, Netlify, S3/CDN, or another host without a data migration.

## Approval requested

Approve, reject, or amend the following checkpoint:

1. Proceed only with the narrow evidence-and-independence graph, not a generic directory.
2. Use Cytoscape.js 3.x in a thin static application.
3. Keep YAML/source/observation records canonical in Git and compile JSON/CSV/GraphML.
4. Use GitHub Actions and GitHub Pages for the first deployment.
5. Contact adjacent maintainers before bulk ingestion and treat partnership/reuse as preferred.

