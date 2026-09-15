# Evidence policy

## Claim standard

Every material public field and relationship must cite one or more source IDs. Material fields include institutional status, description, taxonomy, leadership, funding, sponsor/parent, evaluations, access, independence attributes, and time-varying metrics.

Evidence priority:

1. official announcements, annual/audited reports, legal filings, registries, and official research/team pages;
2. official funder databases and government records;
3. research papers and program reports;
4. reputable journalism;
5. directories and social posts for discovery or explicitly low-confidence support.

Self-description establishes what an organization claims and reports; it does not by itself establish effectiveness or independence.

## Source records

Each source stores URL, title, publisher, publication date when known, retrieval date, source type, archival URL when available, a short paraphrase of support, and reliability tier. Do not reproduce substantial copyrighted text. A source can support several claims, but each organization or relationship explicitly lists the source IDs used.

## Confidence and contradictions

- `high`: directly and unambiguously supported by authoritative primary evidence.
- `medium`: supported but incomplete, dated, self-reported, or reliant on a strong secondary source.
- `low`: plausible discovery lead that cannot be published as a settled material claim.
- `unknown`: no evidence; never convert to false, zero, or “no conflict.”

Conflicting claims remain recorded in `contradictions` or candidate review notes with both sources. Editors must not silently choose the more convenient value.

## Funding

- Preserve original amount and currency.
- Record pledged, committed, awarded, and received as distinct statuses.
- Separate cash from API credits, compute, model access, staff time, or other in-kind support.
- Record announcement date and covered period separately.
- Add normalized USD only with an exchange-rate source and conversion date.
- Prefer confirmation from both funder and recipient.
- Use a shared `possible_duplicate_group` when a round announcement may overlap component grants; aggregate builds must exclude unresolved possible duplicates.
- Undisclosed amounts remain `null`, never zero.

## Independence

Record legal form, developer cash policy/share, in-kind support, appointment control, operational control, publication rights, conflict-policy availability, and disclosure quality independently. Nonprofit status is not evidence of operational or editorial independence. Unknown values remain unknown.

## Automated extraction

Automated discovery writes only to `data/candidates/` or a review issue/PR. A model-generated claim cannot enter canonical records without a reviewer checking the source and source span. Robots directives, terms, privacy, copyright, and reasonable rate limits govern collection.

## Review windows

- status, leadership, headcount, and active funding: review every 180 days;
- legal form, founding, and historical relationships: every 365 days;
- operational/publication independence for active evaluators: every 180 days and after a major engagement;
- output counts: refresh at least annually;
- URLs: automated checks may run weekly, but redirects do not authorize changing substantive claims.

