# Existing landscape

Research date: 2026-09-15

## Executive finding

The broad idea of an AI-safety organization directory is **not differentiated**. MindXO and AISafety.com already publish interactive ecosystem views, grantmaking.ai maintains linked organization/project/funder/grant records, and the AI Safety Directory covers a still broader security-and-safety market. A new product is justified only if it stays focused on a gap those products do not currently expose together:

- typed, source-level funding, sponsorship, commissioning, evaluation, and collaboration relationships;
- observable independence dimensions rather than a single score;
- orthogonal risk-domain, lifecycle-stage, and activity taxonomies;
- dates, confidence, contradictions, and sources attached to every material claim;
- version-controlled, portable records and a human-reviewed change history.

This conclusion is based on public product surfaces and documentation. It does not establish what private datasets or unpublished roadmaps the maintainers may have.

## Products inspected

### MindXO AI Safety Organizations Atlas

- **Coverage:** The atlas says it contains 57 organizations in 12 categories. Its list spans standards bodies, government safety institutes, security bodies, technical-safety organizations, policy groups, intergovernmental bodies, audit organizations, risk databases, and regional government entities. It includes METR, Apollo Research, LawZero, CAIS, MIRI, Redwood, CeSIA, and SaferAI.
- **Form:** Interactive map plus searchable/filterable directory. Public entries are concise organization summaries and selected outputs rather than evidence-rich profiles or a relationship graph.
- **Freshness:** The page is live and identifies itself as a living resource, but it does not display a per-record verification date on the public directory inspected on 2026-09-15.
- **Ownership/license:** Published by MindXO; the atlas page links CC BY 4.0.
- **Strengths:** Broad institutional coverage, simple categories, geographic framing, low-friction public access.
- **Limit for this project:** No visible transaction-level funding layer, independence model, field-level provenance, contradiction handling, or portable public relationship dataset.

Sources: [MindXO atlas](https://www.mind-xo.com/ai-safety-organizations-atlas/), [MindXO overview](https://www.mind-xo.com/).

### grantmaking.ai

- **Coverage:** A searchable database of organizations, people, projects, funds, and grants. The current about page says live grant data flows from Manifund, EA Funds, the Survival and Flourishing Fund, and Coefficient Giving. A currently indexed project page reports growth to 650 organization entries; counts should be treated as changing product telemetry rather than a stable snapshot.
- **Form:** Linked public profiles and grant/fundraising workflows, with public and permissioned private layers. It uses models for relevance filtering and tag suggestions while retaining human review.
- **Freshness/provenance:** The product says profiles show where data came from, when it was updated, and whether it was scraped, AI-assisted, or self-provided. Verification expires when the underlying data changes.
- **Ownership/license:** The public site footer states CC BY-SA. The public about page says public directory material and approved grants are accessible on the web and through an API; private funding fields and reviewer material remain restricted.
- **Strengths:** Best adjacent source for funding discovery, active asks, grants, profile claiming, provenance states, and funder coordination.
- **Limit for this project:** Its center of gravity is allocating funding, not comparing evaluator independence or mapping typed lifecycle/evaluation relationships. Some sensitive monetary fields are intentionally private. It should be approached as a potential data partner rather than duplicated.

Sources: [grantmaking.ai about](https://app.grantmaking.ai/about), [grantmaking.ai projects](https://app.grantmaking.ai/projects).

### AISafety.com Funding and field map

- **Coverage:** Funding opportunities plus a broad field map that mixes organizations, programs, funders, media, courses, communities, and other resources. The current map includes well over 100 entries and explicitly includes METR, LawZero, Apollo Research, GovAI, CHAI, FAR.AI, and many ecosystem-support organizations.
- **Form:** Curated lists and a visual overview; users can search and switch to cards. Corrections and additions are accepted through community forms.
- **Freshness:** Current listings include 2026 programs and organizations. The public pages do not show field-level observation or verification dates.
- **Ownership/license:** AISafety.com describes itself as a small nonprofit/community project with 1.25 salaried staff and volunteers, supported at about $100,000 annually by the Survival and Flourishing Fund. The site states CC BY-SA.
- **Strengths:** Strong navigation and onboarding, active opportunity curation, community contribution path, permissive reuse terms.
- **Limit for this project:** Its categories are designed for finding a place in the primarily existential-risk-focused ecosystem, not for auditing institutional independence or tracing evidence-backed funding/evaluation relationships.

Sources: [AISafety.com field map](https://aisafety.com/map), [funding directory](https://aisafety.com/funding), [about and license](https://aisafety.com/about).

### AI Safety Directory grants database

- **Coverage:** The Directory of AI Security & Safety publishes large lists of organizations, tools, frameworks, grants, and resources. Its organization page mixes frontier developers, government bodies, nonprofits, research groups, consortia, commercial security vendors, and open-source projects. Its grants page lists many funding programs across these categories.
- **Form:** Search-oriented directory and individual listing pages, not a public relationship graph.
- **Freshness:** Pages inspected were recently crawled and carry 2026-oriented content, but the visible grants page does not expose per-claim retrieval dates, source spans, or a documented review state.
- **Ownership/license:** No clear dataset license or maintainer identity was found on the public pages inspected. Reuse therefore requires explicit permission or independent re-verification of every lead.
- **Strengths:** High recall across commercial AI security, assurance tooling, standards, and government programs; useful for candidate discovery.
- **Limit/risk:** Broad inclusion criteria and unsupported summary amounts make it unsuitable as sole evidence. Treat records as leads only, as the project brief requires.

Sources: [grants](https://aisecurityandsafety.org/en/grants/), [organizations](https://aisecurityandsafety.org/en/organizations/), [tools](https://aisecurityandsafety.org/en/tools/).

### Other relevant resources

| Resource | What it maps | Relevance and boundary |
| --- | --- | --- |
| Apart Research, Mapping AI Safety Research | 5,000+ alignment papers clustered into topics using an LLM | Useful complementary research-output graph; its unit is a document/topic, not an institution or sourced funding relationship. [Project description](https://apartresearch.com/news/mapping-ai-safety-research-an-open-source-knowledge-graph) |
| UNESCO civil-society and academic network | Global organizations working on AI ethics and policy | Valuable discovery source for geographic and public-interest coverage; broader than AI safety and not an independence/funding graph. [Map](https://www.unesco.org/ethics-ai/en/civil-society-organizations/map) |
| Mapping AI | People, organizations, resources, and influence in US AI policy | A close structural analogue for influence mapping, but US-policy-centric rather than a global safety-assurance evidence base. [Map](https://aimapping.org/map) |
| AI Evaluator Forum | Independent AI research/evaluation organizations | Relevant seed list and possible partner for evaluator definitions; not, on its public landing page, a comprehensive funding/provenance graph. [Forum](https://aievaluatorforum.org/) |
| MITRE AI Assurance Landscape | Frameworks and reports in the assurance ecosystem | Strong taxonomy and assurance context; the report says the space contains 50+ frameworks and 500+ reports, but its purpose is not an organization funding network. [Report](https://www.mitre.org/sites/default/files/2025-05/PR-24-2962-The-AI-Assurance-Landscape-v1.pdf) |
| AI Watch | People and organizations in the AI-safety community | A useful affiliation/name-resolution lead exposed through the AISafety.com map; provenance, licensing, and current maintenance need separate review before use. [Database](https://aiwatch.issarice.com/) |

## Precise gap and product boundary

The product should not market itself as the most complete directory. Its defensible public-interest role is an **audit trail for institutional relationships and independence**.

The minimum differentiated record is not an organization card; it is a claim such as “Funder A committed amount X to organization B for period C,” “Evaluator B evaluated developer D under access model E,” or “Sponsor F legally hosts project G,” with source, observation date, confidence, and contradiction state. The public graph is one projection of that evidence store.

The project should explicitly link out to, collaborate with, or ingest permitted exports from adjacent maintainers:

1. Ask grantmaking.ai about public API scope, bulk reuse, identifiers, and a reciprocal correction flow.
2. Reuse AISafety.com CC BY-SA records only with attribution/share-alike review, and independently verify material claims.
3. Ask MindXO whether its CC BY 4.0 atlas data is available as a structured export.
4. Use the AI Safety Directory only for discovery unless its ownership, license, and evidence process become clear.

## Go/no-go test

Proceed with a new repository only if maintainers are willing to sustain the evidence policy and at least the following MVP slice: 75 verified core organizations, transaction-level funding records, evaluator-to-developer relationships, and observable independence fields. If the intended product is only searchable organization cards and category filters, contribute improvements to AISafety.com, MindXO, or grantmaking.ai instead.

## Known unknowns

- Exact public API rate limits, bulk-export rights, and identifier stability for grantmaking.ai.
- Whether MindXO offers a machine-readable atlas export beyond the rendered page.
- The AI Safety Directory's ownership, editorial process, source policy, and dataset license.
- Current data-maintenance capacity and partnership interest of each adjacent project.
- Whether a common organization identifier or crosswalk already exists privately among these maintainers.

