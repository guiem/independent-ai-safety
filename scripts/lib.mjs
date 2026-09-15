import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import YAML from "yaml";

export async function loadYamlDirectory(directory) {
  let entries = [];
  try { entries = await readdir(directory, { withFileTypes: true }); }
  catch (error) { if (error.code === "ENOENT") return []; throw error; }
  const files = entries.filter(entry => entry.isFile() && /\.ya?ml$/i.test(entry.name)).map(entry => entry.name).sort();
  const records = [];
  for (const file of files) {
    const raw = await readFile(path.join(directory, file), "utf8");
    const parsed = YAML.parse(raw);
    for (const record of Array.isArray(parsed) ? parsed : [parsed]) records.push({ record, file:path.join(directory, file) });
  }
  return records;
}

export async function loadYamlFile(file) {
  return YAML.parse(await readFile(file, "utf8"));
}

export function stableSort(value) {
  if (Array.isArray(value)) return value.map(stableSort);
  if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map(key => [key, stableSort(value[key])]));
  return value;
}

export function stableJson(value) {
  return `${JSON.stringify(stableSort(value), null, 2)}\n`;
}

export function csvCell(value) {
  const text = value == null ? "" : Array.isArray(value) ? value.join("|") : typeof value === "object" ? JSON.stringify(value) : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export function toCsv(rows, columns) {
  return `${[columns.map(csvCell), ...rows.map(row => columns.map(column => csvCell(row[column])))].map(row => row.join(",")).join("\n")}\n`;
}

export function xmlEscape(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}

