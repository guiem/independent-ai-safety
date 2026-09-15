# Methodology

## Unit of analysis

The primary unit is an institution or stable fiscally sponsored project. University labs are separate from their host universities. Programs become first-class entities only when needed to avoid misattributing funding or evaluation relationships.

## Workflow

1. Discover a candidate from a directory, primary feed, registry, paper, or community submission.
2. Resolve aliases and canonical domains before creating an ID.
3. Collect primary evidence for scope, status, legal relationship, activities, and material relationships.
4. Create source records first, then link claims to source IDs.
5. Record unknowns and contradictions explicitly.
6. Validate schemas and cross-record references.
7. Require human review before moving a candidate into canonical data.
8. Build deterministic public JSON and exports from canonical records.

## Stable IDs

IDs are lowercase ASCII slugs with a type prefix: `org-`, `src-`, `rel-`, `obs-`, or `tax-`. IDs do not encode names likely to change except a durable short slug. Aliases preserve former names.

## Freshness

`last_verified` means a reviewer checked the cited sources for the current record. It is not the page publication date. `next_review_due` is field-sensitive in principle; the MVP stores a conservative record-level due date and can add per-field dates later. Stale data remains visible with a warning unless known false.

## Aggregation

- Funding totals include only disclosed cash transactions with a settled non-duplicate state; commitments and receipts can be shown separately and never summed together as if independent.
- Headcount uses the most recent eligible observation and displays its as-of date/method.
- Unknown observations do not contribute zero.
- Node sizing uses square-root scaling and a neutral default for unknown values.
- Derived similarity uses shared taxonomy tags and is never stored as a factual institutional relationship.

## Limitations

Public disclosure is uneven and can make transparent organizations appear more connected or dependent. English-language and online sources create geographic bias. Funding flows may be delayed, aggregated, anonymous, or routed through sponsors. Evaluation contracts can be confidential. The graph therefore represents documented evidence, not the totality of real institutional influence.

