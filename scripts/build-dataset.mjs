import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadYamlDirectory, loadYamlFile, stableJson, toCsv, xmlEscape } from "./lib.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "public", "data");
await mkdir(output, { recursive:true });

const load = async folder => (await loadYamlDirectory(path.join(root, "data", folder))).map(item => item.record).sort((a,b) => a.id.localeCompare(b.id));
const organizations = await load("organizations");
const relationships = await load("relationships");
const sources = await load("sources");
const observations = await load("observations");
const taxonomy = await loadYamlFile(path.join(root, "data", "taxonomies.yml"));
const taxonomyRows = Object.entries(taxonomy).flatMap(([dimension, rows]) => rows.map(row => ({ ...row, dimension })));

const latestObservation = (id, metric) => observations.filter(item => item.subject_id === id && item.metric === metric && item.value != null).sort((a,b) => (b.as_of || b.period_end || "").localeCompare(a.as_of || a.period_end || ""))[0] || null;
const metrics = Object.fromEntries(organizations.map(org => {
  const funding = relationships.filter(rel => rel.type === "FUNDED_BY" && rel.source_id === org.id && rel.amount?.support_type === "cash" && rel.amount?.normalized_usd != null && !rel.possible_duplicate_group).reduce((sum, rel) => sum + rel.amount.normalized_usd, 0);
  const hasFunding = relationships.some(rel => rel.type === "FUNDED_BY" && rel.source_id === org.id && rel.amount?.support_type === "cash" && rel.amount?.normalized_usd != null && !rel.possible_duplicate_group);
  return [org.id, {
    funding_disclosed_usd: hasFunding ? funding : null,
    headcount: latestObservation(org.id, "headcount"),
    annual_revenue: latestObservation(org.id, "annual-revenue"),
    operating_budget: latestObservation(org.id, "operating-budget"),
    research_outputs: latestObservation(org.id, "research-output-count"),
    evaluations: latestObservation(org.id, "evaluation-benchmark-count")
  }];
}));

const graph = {
  generated_at: new Date().toISOString(),
  schema_version: "1.0.0",
  nodes: [
    ...organizations.map(org => ({ data:{ ...org, metrics:metrics[org.id] } })),
    ...taxonomyRows.map(item => ({ data:{ id:item.id, name:item.label, description:item.description, scope:"taxonomy", primary_display_type:item.dimension } }))
  ],
  edges: relationships.map(rel => ({ data:{ ...rel, source:rel.source_id, target:rel.target_id } }))
};

const bundle = { generated_at:graph.generated_at, schema_version:graph.schema_version, organizations, relationships, sources, observations, taxonomy };
await Promise.all([
  writeFile(path.join(output, "dataset.json"), stableJson(bundle)),
  writeFile(path.join(output, "graph.json"), stableJson(graph)),
  writeFile(path.join(output, "organizations.csv"), toCsv(organizations.map(org => ({ id:org.id, name:org.name, scope:org.scope, display_type:org.primary_display_type, entity_type:org.entity_type, status:org.status, country:org.geography.country, website:org.website, risk_primary:org.risk_domains.primary, lifecycle_primary:org.lifecycle_stages.primary, activity_primary:org.activities.primary, last_verified:org.last_verified, confidence:org.confidence })), ["id","name","scope","display_type","entity_type","status","country","website","risk_primary","lifecycle_primary","activity_primary","last_verified","confidence"])),
  writeFile(path.join(output, "relationships.csv"), toCsv(relationships.map(rel => ({ id:rel.id, source_id:rel.source_id, target_id:rel.target_id, type:rel.type, status:rel.status, amount:rel.amount?.value, currency:rel.amount?.currency, amount_status:rel.amount?.status, normalized_usd:rel.amount?.normalized_usd, announcement_date:rel.announcement_date, confidence:rel.confidence, source_ids:rel.source_ids })), ["id","source_id","target_id","type","status","amount","currency","amount_status","normalized_usd","announcement_date","confidence","source_ids"])),
  writeFile(path.join(output, "graph.graphml"), graphMl(graph))
]);

console.log(`Built deterministic exports for ${organizations.length} organizations and ${relationships.length} relationships in public/data/.`);

function graphMl(value) {
  const nodes = value.nodes.map(({ data }) => `    <node id="${xmlEscape(data.id)}"><data key="label">${xmlEscape(data.name)}</data><data key="type">${xmlEscape(data.primary_display_type)}</data><data key="scope">${xmlEscape(data.scope)}</data></node>`).join("\n");
  const edges = value.edges.map(({ data }) => `    <edge id="${xmlEscape(data.id)}" source="${xmlEscape(data.source)}" target="${xmlEscape(data.target)}"><data key="relationship">${xmlEscape(data.type)}</data><data key="confidence">${xmlEscape(data.confidence)}</data></edge>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<graphml xmlns="http://graphml.graphdrawing.org/xmlns">\n  <key id="label" for="node" attr.name="label" attr.type="string"/>\n  <key id="type" for="node" attr.name="type" attr.type="string"/>\n  <key id="scope" for="node" attr.name="scope" attr.type="string"/>\n  <key id="relationship" for="edge" attr.name="relationship" attr.type="string"/>\n  <key id="confidence" for="edge" attr.name="confidence" attr.type="string"/>\n  <graph id="independent-ai-safety" edgedefault="directed">\n${nodes}\n${edges}\n  </graph>\n</graphml>\n`;
}

