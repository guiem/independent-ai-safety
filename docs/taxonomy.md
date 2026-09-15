# Taxonomy

Taxonomy version: 1.0 (2026-09-15)

Classifications use three orthogonal dimensions. Each organization may have one primary and several secondary values per dimension. Tags describe documented work; they do not imply effectiveness or endorsement.

## Risk or harm domains

| ID | Definition | Inclusion example | Borderline / exclusion |
| --- | --- | --- | --- |
| `loss-of-control` | Loss of meaningful human control, catastrophic misalignment, or takeover risk | Control evaluations or alignment research explicitly motivated by catastrophic loss of control | General model reliability without a control-risk link |
| `deception-hidden-objectives` | Scheming, strategic deception, alignment faking, or concealed goals | Evaluations for covert pursuit of unintended objectives | Ordinary hallucination unless studied as deception |
| `autonomous-replication-rd` | Autonomous replication/adaptation or acceleration of AI R&D | Agent autonomy and AI-R&D capability evaluations | Generic coding benchmarks |
| `cyber-security` | Offensive cyber misuse and security of AI systems | Cyber capability evals, model theft defenses | General IT security unrelated to AI |
| `bio-chem-misuse` | Biological or chemical weapon enablement and related misuse | Frontier-model uplift evaluations | General computational biology |
| `robustness-adversarial` | Robustness, distribution shift, adversarial failure, and reliability | Adversarial testing tied to safety | Accuracy optimization alone |
| `privacy-data` | Privacy, surveillance, and data protection harms | Privacy audits or privacy-preserving ML safety work | Generic cybersecurity with no privacy dimension |
| `bias-discrimination` | Disparate treatment, discrimination, and unequal impact | Algorithmic bias research and audits | General diversity programs |
| `misinformation-manipulation` | Misinformation, persuasion, manipulation, and epistemic integrity | Deepfake governance or persuasion evaluations | General media studies without AI focus |
| `human-factors-oversight` | Human oversight, automation bias, reliance, and human–AI coordination | Scalable oversight or human-in-the-loop evaluation | Generic UX research |
| `labor-power-society` | Labor effects, concentration of power, democracy, and societal impacts | Worker surveillance or industry-concentration research | Broad economic research without an AI harm link |
| `critical-domain-safety` | Safety in health, infrastructure, transport, defense, or other high-stakes domains | Assurance of deployed medical AI | General domain adoption |
| `other` | Material risk that does not fit above | Must include an explanatory note | Never a convenience fallback without explanation |

## Lifecycle or intervention stages

| ID | Definition | Borderline note |
| --- | --- | --- |
| `data-pretraining` | Data curation and pre-training interventions | Includes provenance or filtering only when safety-motivated |
| `architecture-safe-design` | Architectural or non-agentic safe-by-design research | Distinct from post-training behavior shaping |
| `training-alignment` | Training objectives, reward design, alignment, and control training | Includes scalable oversight used during training |
| `posttraining-safeguards` | Fine-tuning, guardrails, and mitigations after base training | Runtime monitoring belongs below |
| `predeployment-evaluation` | Testing before public or internal deployment decisions | Record access model where known |
| `deployment-monitoring` | Assurance and monitoring during real-world deployment | Includes continuous evaluation |
| `incident-investigation` | Detection, reporting, analysis, and investigation of incidents | A static risk list alone is not incident work |
| `organizational-governance` | Governance systems, safety cases, policies, and internal controls | Public policy belongs below |
| `standards-audit-conformity` | Standards, certification, audit, and conformity assessment | Distinguish standard-setting from performing audits |
| `policy-regulation` | Public policy, law, regulation, and regulatory implementation | Technical standards work may carry both tags |
| `field-building-funding` | Training, convening, infrastructure, or grantmaking | Secondary unless it is the organization's main output |

## Activity or output types

`evaluations-benchmarks`, `red-teaming`, `auditing-assurance`, `interpretability`, `scalable-oversight`, `alignment-control`, `formal-methods-safety-cases`, `incidents-investigations`, `standards-frameworks`, `policy-advocacy`, `forecasting-measurement`, and `education-field-building-funding`.

### Counting boundary

- An evaluation is counted only when a public report, system card contribution, benchmark release, or equivalent documented deliverable identifies the evaluated system or evaluation suite.
- A research output is a public paper, substantial technical report, dataset, benchmark, or documented evaluation. Blog posts count only when they contain original methods/results and are labeled separately.
- Versions, mirrors, preprint/journal duplicates, and translated copies count once.
- Counts always include a period, retrieval date, coverage source, and method. Missing counts remain unknown.

