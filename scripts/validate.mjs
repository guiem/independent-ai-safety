import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { loadYamlDirectory, loadYamlFile } from "./lib.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const kinds = ["source", "organization", "relationship", "observation"];
const ajv = new Ajv2020({ allErrors:true, strict:true });
addFormats(ajv);

const validators = {};
for (const kind of [...kinds, "taxonomy"]) {
  const schema = JSON.parse(await readFile(path.join(root, "schemas", `${kind}.schema.json`), "utf8"));
  validators[kind] = ajv.compile(schema);
}

const collections = {};
let errors = [];
for (const kind of kinds) {
  const folder = kind === "source" ? "sources" : kind === "organization" ? "organizations" : `${kind}s`;
  collections[kind] = await loadYamlDirectory(path.join(root, "data", folder));
  for (const { record, file } of collections[kind]) {
    if (!validators[kind](record)) errors.push(...validators[kind].errors.map(error => `${path.relative(root, file)}${error.instancePath || "/"}: ${error.message}`));
  }
}

const taxonomyFile = path.join(root, "data", "taxonomies.yml");
const taxonomy = await loadYamlFile(taxonomyFile);
if (!validators.taxonomy(taxonomy)) errors.push(...validators.taxonomy.errors.map(error => `data/taxonomies.yml${error.instancePath || "/"}: ${error.message}`));

const allRecords = kinds.flatMap(kind => collections[kind]);
const idFiles = new Map();
for (const { record, file } of allRecords) {
  if (!record?.id) continue;
  if (idFiles.has(record.id)) errors.push(`duplicate id ${record.id}: ${path.relative(root, idFiles.get(record.id))} and ${path.relative(root, file)}`);
  idFiles.set(record.id, file);
}

const sourceIds = new Set(collections.source.map(item => item.record.id));
const organizationIds = new Set(collections.organization.map(item => item.record.id));
const taxonomyIds = new Set(Object.values(taxonomy).flat().map(item => item.id));
const entityIds = new Set([...organizationIds, ...taxonomyIds]);

function requireSources(ids, label) {
  for (const id of ids || []) if (!sourceIds.has(id)) errors.push(`${label}: unknown source ${id}`);
}

const materialRefs = ["description", "status", "entity_type", "risk_domains", "lifecycle_stages", "activities", "independence"];
for (const { record, file } of collections.organization) {
  const label = path.relative(root, file);
  if (record.parent_or_sponsor_id && !organizationIds.has(record.parent_or_sponsor_id)) errors.push(`${label}: unknown parent_or_sponsor_id ${record.parent_or_sponsor_id}`);
  for (const [field, ids] of Object.entries(record.source_refs || {})) requireSources(ids, `${label} source_refs.${field}`);
  for (const field of materialRefs) if (!record.source_refs?.[field]?.length) errors.push(`${label}: material field ${field} needs source_refs`);
  const groups = [["risk_domains", taxonomy.risk_domains], ["lifecycle_stages", taxonomy.lifecycle_stages], ["activities", taxonomy.activities]];
  for (const [field, allowedRows] of groups) {
    const allowed = new Set(allowedRows.map(item => item.id));
    const values = [record[field]?.primary, ...(record[field]?.secondary || [])].filter(Boolean);
    for (const value of values) if (!allowed.has(value)) errors.push(`${label}: unknown ${field} value ${value}`);
    if (record[field]?.primary && record[field]?.secondary?.includes(record[field].primary)) errors.push(`${label}: ${field} primary is duplicated in secondary`);
  }
}

const fundingFingerprints = new Map();
for (const { record, file } of collections.relationship) {
  const label = path.relative(root, file);
  if (!entityIds.has(record.source_id)) errors.push(`${label}: unknown source entity ${record.source_id}`);
  if (!entityIds.has(record.target_id)) errors.push(`${label}: unknown target entity ${record.target_id}`);
  requireSources(record.source_ids, label);
  if (record.source_id === record.target_id) errors.push(`${label}: self relationship is not allowed`);
  if (record.type === "FUNDED_BY" && record.source_id.startsWith("org-") && record.target_id.startsWith("org-")) {
    const target = collections.organization.find(item => item.record.id === record.target_id)?.record;
    if (target && target.primary_display_type !== "funder" && target.primary_display_type !== "frontier-developer") errors.push(`${label}: FUNDED_BY target must display as funder or frontier-developer`);
  }
  if (["FUNDED_BY", "FUNDS"].includes(record.type) && record.amount?.value != null) {
    const fp = [record.source_id, record.target_id, record.amount.value, record.amount.currency, record.announcement_date].join("|");
    if (fundingFingerprints.has(fp) && !record.possible_duplicate_group) errors.push(`${label}: obvious funding duplicate of ${fundingFingerprints.get(fp)}; resolve or set possible_duplicate_group`);
    fundingFingerprints.set(fp, label);
  }
}

for (const { record, file } of collections.observation) {
  const label = path.relative(root, file);
  if (!organizationIds.has(record.subject_id)) errors.push(`${label}: unknown subject ${record.subject_id}`);
  requireSources(record.source_ids, label);
}

if (errors.length) {
  console.error(`Validation failed with ${errors.length} error(s):\n${errors.map(error => `- ${error}`).join("\n")}`);
  process.exit(1);
}

console.log(`Validated ${collections.organization.length} organizations, ${collections.relationship.length} relationships, ${collections.source.length} sources, ${collections.observation.length} observations, and ${taxonomyIds.size} taxonomy values.`);

