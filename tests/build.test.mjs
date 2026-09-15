import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { stableJson, toCsv, xmlEscape } from "../scripts/lib.mjs";
import { candidateConfidence, canonicalDomain, extractDirectoryCandidates, extractFeedItems, extractGdeltItems, normalizeUrl, robotsAllows, semanticPageHash } from "../scripts/discovery-lib.mjs";

test("stableJson recursively sorts object keys", () => {
  assert.equal(stableJson({ z:1, a:{ d:2, b:1 } }), '{\n  "a": {\n    "b": 1,\n    "d": 2\n  },\n  "z": 1\n}\n');
});

test("CSV escapes quotes and arrays", () => {
  assert.equal(toCsv([{ name:'A "quoted" name', tags:["one","two"] }], ["name","tags"]), '"name","tags"\n"A ""quoted"" name","one|two"\n');
});

test("GraphML values are escaped", () => {
  assert.equal(xmlEscape('A & <B> "C"'), "A &amp; &lt;B&gt; &quot;C&quot;");
});

test("directory discovery deduplicates domains and ignores known/social links", () => {
  const html = `<a href="https://www.example.org/about">Example Safety Lab</a><a href="https://example.org/jobs">Careers</a><a href="https://x.com/example">Social</a><a href="https://known.org/">Known</a><a href="https://program.known.org/">Known program</a>`;
  assert.deepEqual(extractDirectoryCandidates(html, "https://directory.test/list", new Set(["known.org"])), [{ name:"Example Safety Lab", website:"https://www.example.org/about", canonical_domain:"example.org", source_context:null }]);
});

test("GDELT discovery extracts article leads", () => {
  const [item] = extractGdeltItems({ articles:[{ title:"Small lab launches", url:"http://small-lab.test/news", seendate:"20260914T100000Z" }] });
  assert.equal(item.title, "Small lab launches");
  assert.equal(item.url, "https://small-lab.test/news");
});

test("feed discovery extracts stable article leads", () => {
  const xml = `<rss><channel><item><title>New AI safety institute</title><link>https://news.test/story?utm_source=rss</link><pubDate>Mon, 14 Sep 2026 10:00:00 GMT</pubDate></item></channel></rss>`;
  const [item] = extractFeedItems(xml, "https://feed.test/rss");
  assert.equal(item.title, "New AI safety institute");
  assert.equal(item.url, "https://news.test/story");
  assert.equal(item.id.length, 16);
});

test("URL/domain normalization and robots rules are conservative", () => {
  assert.equal(normalizeUrl("/Org/?utm_source=x#team", "http://www.Example.org/list"), "https://www.example.org/Org");
  assert.equal(canonicalDomain("https://www.Example.org/"), "example.org");
  assert.equal(robotsAllows("User-agent: *\nDisallow: /private\nAllow: /private/public", "/private/report"), false);
  assert.equal(robotsAllows("User-agent: *\nDisallow: /private\nAllow: /private/public", "/private/public/list"), true);
});

test("semantic page fingerprints ignore scripts but detect visible changes", () => {
  const first = semanticPageHash(`<main><h1>About</h1><p>Stable text</p><script>nonce=1</script></main>`, "https://example.org/about");
  const same = semanticPageHash(`<main><h1>About</h1><p>Stable text</p><script>nonce=2</script></main>`, "https://example.org/about");
  const changed = semanticPageHash(`<main><h1>About</h1><p>Changed text</p></main>`, "https://example.org/about");
  assert.equal(first, same);
  assert.notEqual(first, changed);
});

test("candidate confidence distinguishes primary confirmation and corroboration", () => {
  assert.equal(candidateConfidence({ primary_source_confirmed:true, discovery_sources:["a"] }).level, 5);
  assert.equal(candidateConfidence({ discovery_sources:["a", "b", "c"] }).level, 4);
  assert.equal(candidateConfidence({ discovery_sources:["a"] }, new Map([["a", "borderline"]])).level, 2);
  assert.equal(candidateConfidence({ discovery_sources:["a"] }, new Map([["a", "unknown"]])).level, 1);
});

test("generated graph exposes scored candidate leads separately", async () => {
  const graph = JSON.parse(await readFile(new URL("../public/data/graph.json", import.meta.url), "utf8"));
  const dataset = JSON.parse(await readFile(new URL("../public/data/dataset.json", import.meta.url), "utf8"));
  const generatedVersion = await readFile(new URL("../src/data-version.js", import.meta.url), "utf8");
  const candidateNodes = graph.nodes.filter(node => node.data.scope === "candidate");
  assert.equal(graph.data_version, dataset.data_version);
  assert.match(graph.data_version, /^[a-f0-9]{16}$/);
  assert.match(generatedVersion, new RegExp(`DATA_VERSION = "${graph.data_version}"`));
  assert.ok(candidateNodes.length > 0);
  assert.ok(candidateNodes.every(node => Number.isInteger(node.data.confidence_level) && node.data.confidence_level >= 1 && node.data.confidence_level <= 5));
  assert.ok(candidateNodes.every(node => node.data.evidence_level === "discovery-only"));
});
