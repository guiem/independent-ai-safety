import { createHash } from "node:crypto";
import * as cheerio from "cheerio";

const blockedDomains = new Set([
  "facebook.com", "instagram.com", "linkedin.com", "twitter.com", "x.com", "youtube.com",
  "google.com", "googleapis.com", "gstatic.com", "cloudflare.com", "jsdelivr.net", "w.org",
  "schema.org", "fonts.googleapis.com", "fonts.gstatic.com", "doubleclick.net", "creativecommons.org",
  "airtable.com", "every.org", "open.spotify.com", "join.slack.com", "github.com", "substack.com",
  "lesswrong.com", "alignmentforum.org", "forum.effectivealtruism.org"
]);
const weakLabels = /^(website|official site|learn more|read more|visit|home|about|careers|contact|source|view|open|here|link|image)(\s*[↗→])?$/i;

export function normalizeUrl(value, base) {
  try {
    const url = new URL(value, base);
    if (!/^https?:$/.test(url.protocol)) return null;
    url.protocol = "https:";
    url.hash = "";
    for (const key of [...url.searchParams.keys()]) if (/^(utm_|fbclid|gclid)/i.test(key)) url.searchParams.delete(key);
    if (url.pathname !== "/") url.pathname = url.pathname.replace(/\/+$/, "");
    return url.toString();
  } catch { return null; }
}

export function canonicalDomain(value) {
  try { return new URL(value).hostname.toLowerCase().replace(/^www\./, ""); }
  catch { return null; }
}

export function contentHash(value) {
  return createHash("sha256").update(String(value).replace(/\s+/g, " ").trim()).digest("hex");
}

export function semanticPageHash(html, pageUrl) {
  const $ = cheerio.load(html);
  $("script, style, noscript, svg, template").remove();
  const root = $("main, article").first().length ? $("main, article").first() : $("body");
  const text = root.text().replace(/\s+/g, " ").trim();
  const links = root.find("a[href]").map((_, element) => normalizeUrl($(element).attr("href"), pageUrl)).get().filter(Boolean).sort();
  return contentHash(JSON.stringify({ text, links }));
}

export function slug(value) {
  return String(value).toLowerCase().replace(/^www\./, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 90);
}

export function cleanLabel(value, domain) {
  const text = String(value || "").replace(/\s+/g, " ").replace(/[↗→]+$/g, "").trim();
  if (text.length >= 2 && text.length <= 160 && !weakLabels.test(text) && !/^https?:/i.test(text)) return text;
  return domain.split(".")[0].replaceAll("-", " ").replace(/\b\w/g, letter => letter.toUpperCase());
}

export function extractDirectoryCandidates(html, sourceUrl, knownDomains = new Set()) {
  const $ = cheerio.load(html);
  const sourceDomain = canonicalDomain(sourceUrl);
  const grouped = new Map();
  $("a[href]").each((_, element) => {
    const href = normalizeUrl($(element).attr("href"), sourceUrl);
    const domain = canonicalDomain(href);
    if (!href || !domain || domain === sourceDomain || matchesKnownDomain(domain, knownDomains) || isBlocked(domain)) return;
    if (/\.(?:png|jpe?g|gif|svg|webp|pdf|zip)(?:\?|$)/i.test(href)) return;
    const heading = $(element).find("h1, h2, h3, h4, h5").first().text();
    const imageLabel = ($(element).find("img").first().attr("title") || $(element).find("img").first().attr("alt") || "").replace(/\s+logo$/i, "");
    const label = cleanLabel(heading || $(element).attr("aria-label") || imageLabel || $(element).text(), domain);
    const categoryLabel = $(element).find("p").filter((_, node) => /^category$/i.test($(node).text().trim())).first();
    const context = categoryLabel.length ? categoryLabel.next("p").text().replace(/\s+/g, " ").trim() : null;
    const existing = grouped.get(domain);
    if (!existing || scoreLabel(label, domain) > scoreLabel(existing.name, domain)) grouped.set(domain, { name: label, website: originOrUsefulPath(href), canonical_domain: domain, source_context: context });
  });
  return [...grouped.values()].sort((a, b) => a.canonical_domain.localeCompare(b.canonical_domain));
}

export function extractFeedItems(xml, sourceUrl) {
  const $ = cheerio.load(xml, { xmlMode: true });
  const rows = [];
  $("item, entry").each((_, element) => {
    const node = $(element);
    const rawLink = node.find("link").first().attr("href") || node.find("link").first().text();
    const url = normalizeUrl(rawLink, sourceUrl);
    const title = node.find("title").first().text().replace(/\s+/g, " ").trim();
    const published = node.find("pubDate, published, updated").first().text().trim() || null;
    if (url && title) rows.push({ id: contentHash(url).slice(0, 16), title, url, published });
  });
  return rows;
}

export function extractGdeltItems(json) {
  const parsed = typeof json === "string" ? JSON.parse(json) : json;
  return (parsed.articles || []).flatMap(article => {
    const url = normalizeUrl(article.url);
    const title = String(article.title || "").replace(/\s+/g, " ").trim();
    return url && title ? [{ id: contentHash(url).slice(0, 16), title, url, published: article.seendate || null }] : [];
  });
}

export function robotsAllows(robotsText, pathname, userAgent = "IndependentAISafetyBot") {
  if (!robotsText) return true;
  const groups = parseRobots(robotsText);
  const applicable = [...(groups.get("*") || []), ...(groups.get(userAgent.toLowerCase()) || [])];
  let winner = null;
  for (const rule of applicable) {
    if (!pathname.startsWith(rule.path)) continue;
    if (!winner || rule.path.length > winner.path.length || (rule.path.length === winner.path.length && rule.allow)) winner = rule;
  }
  return winner ? winner.allow : true;
}

function parseRobots(text) {
  const groups = new Map();
  let agents = [];
  for (const raw of String(text).split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, "").trim();
    if (!line.includes(":")) continue;
    const [rawKey, ...rest] = line.split(":");
    const key = rawKey.trim().toLowerCase();
    const value = rest.join(":").trim();
    if (key === "user-agent") { agents = [value.toLowerCase()]; continue; }
    if (!["allow", "disallow"].includes(key) || !value) continue;
    for (const agent of agents) {
      if (!groups.has(agent)) groups.set(agent, []);
      groups.get(agent).push({ allow: key === "allow", path: value.replace(/\*.*$/, "") });
    }
  }
  return groups;
}

function isBlocked(domain) {
  return [...blockedDomains].some(blocked => domain === blocked || domain.endsWith(`.${blocked}`));
}

function matchesKnownDomain(domain, knownDomains) {
  return [...knownDomains].some(known => domain === known || domain.endsWith(`.${known}`));
}

function scoreLabel(label, domain) {
  const fallback = cleanLabel("", domain);
  return (label === fallback ? 0 : 10) + Math.min(label.length, 60);
}

function originOrUsefulPath(href) {
  const url = new URL(href);
  return `${url.origin}${/^\/(about|research|organization|institute|lab)(?:\/|$)/i.test(url.pathname) ? url.pathname : "/"}`;
}
