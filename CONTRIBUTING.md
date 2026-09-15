# Contributing

Contributions are welcome through focused pull requests or issue forms. Do not add a claim without a source record.

1. Read `docs/scope.md`, `docs/taxonomy.md`, and `docs/evidence-policy.md`.
2. Add or update source records before referencing them from organizations or relationships.
3. Preserve unknowns and conflicting claims; do not infer independence from legal form.
4. Run `npm install` once, then `npm run check` before opening a pull request.
5. Keep generated files in `public/data/` synchronized with canonical YAML by running `npm run build:data`.

Automated or LLM-assisted submissions must say how they were produced. A human contributor remains responsible for checking every cited source.

Discovery candidates in `data/candidates/registry.yml` are leads, not public claims. Follow `docs/discovery.md` when triaging, rejecting, or promoting them; promotion requires primary evidence and normalized canonical records.
