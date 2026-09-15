# Discovery and update pipeline

The discovery layer maximizes recall while the canonical graph maximizes evidential reliability. A discovered website or article is never published as a factual organization record automatically.

## Inputs

`data/discovery/sources.yml` is the auditable source registry. It currently covers:

- focused evaluator and technical-safety lists;
- broad safety, governance, standards, training, and public-interest directories;
- a global UNESCO civil-society map where access permits;
- a funding-oriented project directory;
- the official international network membership page, paired with jurisdiction-level primary government sources;
- one consolidated GDELT news query for launches, funding, grants, evaluations, and audits.

Directories are discovery evidence only. News results are event leads only. New inputs must document their scope and must not be added when automated access conflicts with robots directives, terms, or reasonable rate limits.

## Local run

```bash
npm install
npm run discover
npm run validate
```

The collector writes:

- `data/candidates/registry.yml`: external organization-site leads deduplicated by canonical domain;
- `data/discovery/state.json`: content fingerprints and already-seen feed-item IDs;
- `reports/discovery/latest.md`: a compact human-review queue.

Candidate records and exports include a deterministic `confidence_level` from 1 to 5. This is discovery confidence—the strength of the signal that the named website represents a real, plausibly in-scope organization or stable program—not confidence in any country, legal, independence, funding, activity, or relationship claim.

- **5:** an official primary source confirms the organization or program is operating;
- **4:** the lead appears independently in at least three configured discovery sources;
- **3:** it appears in two sources, or one focused higher-precision source;
- **2:** it appears in one broad ecosystem directory;
- **1:** it has only a weak or unclassified signal.

The public graph shows all candidate leads by default as small hollow nodes. Users can hide them, select only candidate scope, or set a minimum discovery-confidence threshold. Candidate detail panels preserve the warning and source links; they do not expose unreviewed classifications as facts.

Set `DISCOVERY_DATE=YYYY-MM-DD` for a reproducible dated fixture or historical test. Use `npm run discover -- --dry-run` to print a report without writing files.

## Daily automation

`.github/workflows/daily-discovery.yml` runs at 06:17 UTC and on manual dispatch. It resumes a single `automated/daily-discovery` branch, runs the full validation/test/build suite, refreshes the candidate exports, and opens or updates one rolling pull request. Reusing one branch prevents one-article-per-PR noise and preserves unmerged discovery state between runs.

The workflow fails its safety threshold if fewer than two directory sources succeed. Individual fetch failures and robots exclusions remain visible in the review report.

## Review and promotion

For each candidate:

1. Decide whether it is an institution, stable project, context entity, informal community, media resource, or unrelated lead.
2. Confirm material safety work from an official page or stronger primary record.
3. Resolve aliases, legal identity, parent/sponsor, current status, and canonical domain.
4. Create normalized source records with short supporting paraphrases.
5. Create one canonical organization file and any sourced relationships/observations.
6. Mark the candidate `promoted` only in the same reviewed change; use `rejected` with a concise reason when it is out of scope.
7. Run `npm run check` before merge.

Automated or LLM-assisted text is never sufficient evidence for promotion. Directory descriptions may help prioritize review but must not be copied into canonical records as verified claims.

## Maintenance

- Add focused regional and non-English directories to reduce current English-language bias.
- Prefer structured APIs and feeds over page scraping when terms and licensing permit.
- Keep extraction adapters small and covered by fixtures.
- Treat a changed source fingerprint as a review signal, not proof that an organization changed.
- Periodically audit rejected candidates because scope or organizational status can change.
