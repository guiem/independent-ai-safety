import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import { loadYamlDirectory, loadYamlFile } from "./lib.mjs";
import { cleanLabel, contentHash, extractDirectoryCandidates, extractFeedItems, extractGdeltItems, robotsAllows, semanticPageHash, slug } from "./discovery-lib.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const today = process.env.DISCOVERY_DATE || new Date().toISOString().slice(0, 10);
const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const configuredSources = await loadYamlFile(path.join(root, "data/discovery/sources.yml"));
const organizations = (await loadYamlDirectory(path.join(root, "data/organizations"))).map(row => row.record);
const canonicalSources = (await loadYamlDirectory(path.join(root, "data/sources"))).map(row => row.record);
const configuredUrls = new Set(configuredSources.map(source => source.url));
const watchedSources = canonicalSources.filter(source => ["official-page", "annual-report", "audited-accounts", "legal-filing", "registry", "government-record"].includes(source.source_type) && !configuredUrls.has(source.url)).map(source => ({ id:`discovery-watch-${source.id.replace(/^src-/, "")}`, name:`Tracked source: ${source.publisher} — ${source.title}`, url:source.url, kind:"tracked-page", inclusion_hint:"unknown", notes:"Canonical evidence page monitored for semantic changes." }));
const sources = [...configuredSources, ...watchedSources];
const knownDomains = new Set(organizations.flatMap(org => org.canonical_domains));
const registryFile = path.join(root, "data/candidates/registry.yml");
const stateFile = path.join(root, "data/discovery/state.json");
const reportFile = path.join(root, "reports/discovery/latest.md");
const registry = await readYamlArray(registryFile);
const state = await readJson(stateFile, { version: 1, sources: {}, feed_items: {} });
const byDomain = new Map(registry.map(item => [item.canonical_domain, item]));
const robotsCache = new Map();
const report = { newCandidates: [], enrichedCandidates: [], changedSources: [], disappearedLeads: [], feedLeads: [], failures: [], skipped: [] };
let successfulDirectories = 0;
const seenLeadTitles = new Set();

for (const source of sources) {
  try {
    const allowed = await allowedByRobots(source.url);
    if (!allowed) { report.skipped.push(`${source.name}: blocked by robots.txt`); continue; }
    const previousState = state.sources[source.id];
    const response = await fetchWithRetry(source.url, previousState);
    if (response.status === 304) {
      if (source.kind === "directory-html") successfulDirectories += 1;
      continue;
    }
    const body = await response.text();
    const foundCandidates = source.kind === "directory-html" ? extractDirectoryCandidates(body, source.url, knownDomains).filter(found => !(source.exclude_context_patterns || []).some(pattern => new RegExp(pattern, "i").test(found.source_context || ""))) : [];
    const rawFeedItems = source.kind === "news-gdelt" ? extractGdeltItems(body) : source.kind === "news-feed" ? extractFeedItems(body, source.url) : [];
    const feedItems = source.include_title_pattern ? rawFeedItems.filter(item => new RegExp(source.include_title_pattern, "i").test(item.title)) : rawFeedItems;
    const fingerprintValue = source.kind === "directory-html" ? foundCandidates.map(found => [found.canonical_domain, found.name, found.source_context]) : source.kind.startsWith("news-") ? feedItems.map(item => item.id) : null;
    const hash = fingerprintValue ? contentHash(JSON.stringify(fingerprintValue)) : semanticPageHash(body, source.url);
    const previousHash = previousState?.hash;
    if (previousHash && previousHash !== hash) report.changedSources.push({ source, previousHash, hash });
    const entityKeys = foundCandidates.map(found => found.canonical_domain);
    for (const domain of previousState?.entity_keys || []) if (!entityKeys.includes(domain)) report.disappearedLeads.push({ domain, source });
    if (!previousHash || previousHash !== hash) state.sources[source.id] = { url: source.url, hash, checked_at: today, etag: response.headers.get("etag"), last_modified: response.headers.get("last-modified"), entity_keys: entityKeys };

    if (source.kind === "directory-html") {
      successfulDirectories += 1;
      for (const found of foundCandidates) mergeCandidate(found, source);
    } else if (["news-feed", "news-gdelt"].includes(source.kind)) {
      const previousItems = new Set(state.feed_items[source.id] || []);
      report.feedLeads.push(...feedItems.filter(item => !previousItems.has(item.id)).filter(item => {
        const key = item.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
        if (seenLeadTitles.has(key)) return false;
        seenLeadTitles.add(key); return true;
      }).slice(0, 25).map(item => ({ ...item, source })));
      state.feed_items[source.id] = feedItems.slice(0, 250).map(item => item.id);
    }
  } catch (error) {
    report.failures.push(`${source.name}: ${error.message}`);
  }
  await delay(350);
}

const sortedRegistry = [...byDomain.values()].sort((a, b) => a.canonical_domain.localeCompare(b.canonical_domain));
const markdown = renderReport(report, sortedRegistry.length);
if (dryRun) {
  console.log(markdown);
} else {
  await mkdir(path.dirname(reportFile), { recursive: true });
  await writeFile(registryFile, YAML.stringify(sortedRegistry, { lineWidth: 0 }));
  await writeFile(stateFile, `${JSON.stringify(state, null, 2)}\n`);
  const materialChange = report.newCandidates.length || report.enrichedCandidates.length || report.feedLeads.length || report.changedSources.length || report.disappearedLeads.length;
  if (materialChange || !(await exists(reportFile))) await writeFile(reportFile, markdown);
}
console.log(`Discovery complete: ${report.newCandidates.length} new candidates, ${report.enrichedCandidates.length} enriched, ${report.feedLeads.length} new event leads, ${report.failures.length} source failures.`);
if (successfulDirectories < 2) {
  console.error(`Discovery failed safety threshold: only ${successfulDirectories} directory sources succeeded.`);
  process.exitCode = 2;
}

function mergeCandidate(found, source) {
  const current = byDomain.get(found.canonical_domain);
  if (!current) {
    const candidate = {
      id: `cand-${slug(found.canonical_domain)}`,
      name: cleanLabel(found.name, found.canonical_domain),
      website: found.website,
      canonical_domain: found.canonical_domain,
      status: "new",
      discovery_sources: [source.id],
      listing_urls: [source.url],
      source_contexts: found.source_context ? [found.source_context] : [],
      first_seen: today,
      last_seen: today,
      evidence_level: "discovery-only",
      inclusion_hint: source.inclusion_hint,
      notes: "Automatically discovered external-site lead; verify scope, legal identity, status, and primary sources before promotion."
    };
    byDomain.set(found.canonical_domain, candidate);
    report.newCandidates.push(candidate);
    return;
  }
  let changed = false;
  if (!current.discovery_sources.includes(source.id)) { current.discovery_sources.push(source.id); changed = true; }
  if (!current.listing_urls.includes(source.url)) { current.listing_urls.push(source.url); changed = true; }
  if (found.source_context && !current.source_contexts.includes(found.source_context)) { current.source_contexts.push(found.source_context); changed = true; }
  if (changed) {
    current.discovery_sources.sort(); current.listing_urls.sort(); current.source_contexts.sort(); current.last_seen = today;
    report.enrichedCandidates.push(current);
  }
}

async function allowedByRobots(value) {
  const url = new URL(value);
  if (!robotsCache.has(url.origin)) {
    try {
      const response = await fetch(`${url.origin}/robots.txt`, { headers: requestHeaders(), signal: AbortSignal.timeout(8000) });
      robotsCache.set(url.origin, response.ok ? await response.text() : "");
    } catch { robotsCache.set(url.origin, ""); }
  }
  return robotsAllows(robotsCache.get(url.origin), url.pathname);
}

async function fetchWithRetry(url, previousState) {
  let lastError;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const headers = requestHeaders();
      if (previousState?.etag) headers["if-none-match"] = previousState.etag;
      if (previousState?.last_modified) headers["if-modified-since"] = previousState.last_modified;
      const response = await fetch(url, { headers, redirect: "follow", signal: AbortSignal.timeout(25000) });
      if (response.ok || response.status === 304) return response;
      if (![429, 500, 502, 503, 504].includes(response.status)) throw new Error(`HTTP ${response.status}`);
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) { lastError = error; }
    if (attempt < 1) await delay(lastError?.message === "HTTP 429" ? 15000 : 1000);
  }
  throw lastError;
}

function requestHeaders() {
  return { "user-agent": "IndependentAISafetyBot/0.1 (+https://github.com/guiem/independent-ai-safety; discovery only)", accept: "text/html, application/rss+xml, application/atom+xml, application/xml;q=0.9, */*;q=0.1" };
}

function renderReport(value, totalCandidates) {
  const list = rows => rows.length ? rows.map(row => `- [${row.name}](${row.website}) — ${row.canonical_domain}; via ${row.discovery_sources.join(", ")}`).join("\n") : "- None.";
  const leads = value.feedLeads.length ? value.feedLeads.map(item => `- [${item.title}](${item.url}) — ${item.source.name}${item.published ? `; ${item.published}` : ""}`).join("\n") : "- None.";
  return `# Daily discovery review\n\nRun date: ${today}\n\nThis report contains discovery leads only. Nothing here is canonical until a reviewer checks primary sources and creates or updates normalized records.\n\n## Summary\n\n- Candidate registry: ${totalCandidates}\n- New organization-site leads: ${value.newCandidates.length}\n- Existing candidates found by an additional source: ${value.enrichedCandidates.length}\n- New launch/funding/evaluation article leads: ${value.feedLeads.length}\n- Changed discovery or canonical evidence pages: ${value.changedSources.length}\n- Leads no longer present in a directory: ${value.disappearedLeads.length}\n- Fetch failures: ${value.failures.length}\n- Robots exclusions: ${value.skipped.length}\n\n## New organization-site leads\n\n${list(value.newCandidates)}\n\n## Candidates corroborated by another directory\n\n${list(value.enrichedCandidates)}\n\n## New event leads\n\n${leads}\n\n## Changed source pages\n\n${value.changedSources.length ? value.changedSources.map(item => `- ${item.source.name}`).join("\n") : "- None."}\n\n## Leads no longer listed\n\n${value.disappearedLeads.length ? value.disappearedLeads.map(item => `- ${item.domain} — previously in ${item.source.name}`).join("\n") : "- None."}\n\n## Fetch failures\n\n${value.failures.length ? value.failures.map(item => `- ${item}`).join("\n") : "- None."}\n\n## Robots exclusions\n\n${value.skipped.length ? value.skipped.map(item => `- ${item}`).join("\n") : "- None."}\n`;
}

async function readYamlArray(file) {
  try { return YAML.parse(await readFile(file, "utf8")) || []; }
  catch (error) { if (error.code === "ENOENT") return []; throw error; }
}
async function readJson(file, fallback) {
  try { return JSON.parse(await readFile(file, "utf8")); }
  catch (error) { if (error.code === "ENOENT") return fallback; throw error; }
}
function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
async function exists(file) {
  try { await readFile(file); return true; }
  catch (error) { if (error.code === "ENOENT") return false; throw error; }
}
