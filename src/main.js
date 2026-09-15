import cytoscape from "cytoscape";
import "./styles.css";

main().catch(error => {
  console.error(error);
  const loading = document.querySelector("#loading");
  loading.textContent = "The reviewed dataset could not be loaded. Run npm run build:data and reload.";
});

async function main() {
const graphUrl = new URL("./data/graph.json", window.location.href);
const datasetUrl = new URL("./data/dataset.json", window.location.href);
const [graph, dataset] = await Promise.all([
  fetch(graphUrl).then(requireOk).then(response => response.json()),
  fetch(datasetUrl).then(requireOk).then(response => response.json())
]);

const organizations = new Map(dataset.organizations.map(item => [item.id, item]));
const sources = new Map(dataset.sources.map(item => [item.id, item]));
const nodes = graph.nodes.map(node => ({ data: { ...node.data, label: node.data.name } }));
const elements = [...nodes, ...graph.edges];

const colors = {
  type: {
    organization: "#147d68", funder: "#d48a31", "frontier-developer": "#ad5c52",
    "fiscal-sponsor-incubator": "#6474a8", risk_domains: "#7459a6", lifecycle_stages: "#397d9c", activities: "#687770"
  },
  independence: {
    "separate-legal-entity": "#147d68", "fiscally-sponsored-project": "#6474a8",
    "commercial-company": "#ad5c52", "academic-unit": "#7459a6", "government-body": "#397d9c", unknown: "#89918d"
  }
};

const cy = cytoscape({
  container: document.querySelector("#cy"),
  elements,
  minZoom: 0.25,
  maxZoom: 2.5,
  layout: { name: "cose", animate: false, randomize: true, nodeRepulsion: 90000, idealEdgeLength: 115, edgeElasticity: 80, gravity: 0.3, numIter: 1200 },
  style: [
    { selector: "node", style: { label: "data(label)", width: 34, height: 34, "background-color": "#147d68", color: "#17211d", "font-family": "Inter, system-ui, sans-serif", "font-size": 10, "font-weight": 600, "text-wrap": "wrap", "text-max-width": 105, "text-valign": "bottom", "text-margin-y": 8, "border-width": 2, "border-color": "#fffdf8" } },
    { selector: "node[scope = 'taxonomy']", style: { shape: "round-tag", width: 28, height: 28, "font-size": 9 } },
    { selector: "node[primary_display_type = 'funder']", style: { shape: "diamond" } },
    { selector: "node[primary_display_type = 'frontier-developer']", style: { shape: "round-rectangle" } },
    { selector: "node[primary_display_type = 'fiscal-sponsor-incubator']", style: { shape: "hexagon" } },
    { selector: "node.unknown-independence", style: { "border-style": "dashed", "border-color": "#606b65" } },
    { selector: "edge", style: { width: 1.4, "line-color": "#9da49f", "target-arrow-color": "#9da49f", "target-arrow-shape": "triangle", "arrow-scale": 0.75, "curve-style": "bezier", opacity: 0.66 } },
    { selector: "edge[type = 'FUNDED_BY']", style: { width: 3.2, "line-color": "#d48a31", "target-arrow-color": "#d48a31" } },
    { selector: "edge[type = 'FISCALLY_SPONSORED_BY']", style: { width: 2.5, "line-color": "#6474a8", "target-arrow-color": "#6474a8" } },
    { selector: "edge[type = 'EVALUATED']", style: { width: 2.4, "line-color": "#397d9c", "target-arrow-color": "#397d9c" } },
    { selector: "edge[type = 'COLLABORATED_WITH']", style: { "line-style": "dashed", "line-color": "#7459a6", "target-arrow-color": "#7459a6" } },
    { selector: ":selected", style: { "overlay-color": "#efaa43", "overlay-opacity": 0.28, "overlay-padding": 9 } },
    { selector: ".dim", style: { opacity: 0.06, "text-opacity": 0.06, events: "no" } }
  ]
});

document.querySelector("#loading").hidden = true;
const controlIds = ["search", "scope", "country", "relationship", "colorBy", "sizeBy"];
const controls = Object.fromEntries(controlIds.map(id => [id, document.querySelector(`#${id}`)]));
const countries = [...new Set(dataset.organizations.map(org => org.geography.country).filter(Boolean))]
  .sort((a, b) => displayCountry(a).localeCompare(displayCountry(b)));
for (const country of countries) {
  const option = document.createElement("option");
  option.value = country;
  option.textContent = `${countryFlag(country)} ${displayCountry(country)}`;
  controls.country.append(option);
}
const initial = new URLSearchParams(location.search);
for (const [key, control] of Object.entries(controls)) if (initial.has(key)) control.value = initial.get(key);

function update() {
  const query = controls.search.value.trim().toLowerCase();
  const scope = controls.scope.value;
  const country = controls.country.value;
  const relationship = controls.relationship.value;
  const palette = colors[controls.colorBy.value];

  cy.batch(() => {
    cy.elements().removeClass("dim unknown-independence");
    cy.nodes().forEach(node => {
      const data = node.data();
      const org = organizations.get(data.id);
      const haystack = [data.name, data.description, org?.risk_domains?.primary, org?.activities?.primary].filter(Boolean).join(" ").toLowerCase();
      const scopeMatch = scope === "all" || data.scope === scope;
      const countryMatch = country === "all" || org?.geography?.country === country;
      if (!scopeMatch || !countryMatch || (query && !haystack.includes(query))) node.addClass("dim");
      const independence = org?.independence?.legal_independence || "unknown";
      const key = controls.colorBy.value === "type" ? data.primary_display_type : independence;
      const taxonomyColor = colors.type[data.primary_display_type];
      node.style("background-color", org ? (palette[key] || "#89918d") : (taxonomyColor || "#89918d"));
      if (org && independence === "unknown") node.addClass("unknown-independence");
      const size = nodeSize(node, controls.sizeBy.value);
      node.style({ width: size, height: size });
    });
    cy.edges().forEach(edge => {
      const filtered = relationship !== "all" && edge.data("type") !== relationship;
      if (filtered || edge.source().hasClass("dim") || edge.target().hasClass("dim")) edge.addClass("dim");
    });
  });

  const visibleNodes = cy.nodes().filter(node => !node.hasClass("dim")).length;
  const visibleEdges = cy.edges().filter(edge => !edge.hasClass("dim")).length;
  document.querySelector("#count").textContent = `${visibleNodes} nodes · ${visibleEdges} relationships`;
  renderLegend(palette);
  persistState();
}

function nodeSize(node, mode) {
  if (mode === "equal" || node.data("scope") === "taxonomy") return node.data("scope") === "taxonomy" ? 28 : 34;
  if (mode === "connections") return 25 + Math.sqrt(node.connectedEdges().length) * 8;
  const total = node.data("metrics")?.funding_disclosed_usd;
  return total == null ? 27 : Math.min(72, 27 + Math.sqrt(total / 1_000_000) * 8);
}

function renderLegend(palette) {
  const legend = document.querySelector("#legend");
  legend.replaceChildren();
  for (const [label, color] of Object.entries(palette)) {
    const row = document.createElement("div");
    row.innerHTML = `<span class="swatch" style="--swatch:${color}"></span><span>${humanize(label)}</span>`;
    legend.append(row);
  }
}

function persistState() {
  const defaults = { search: "", scope: "all", country: "all", relationship: "all", colorBy: "type", sizeBy: "equal" };
  const params = new URLSearchParams();
  for (const [key, control] of Object.entries(controls)) if (control.value !== defaults[key]) params.set(key, control.value);
  history.replaceState(null, "", params.size ? `?${params}` : location.pathname);
}

function showNode(node) {
  const data = node.data();
  const org = organizations.get(data.id);
  if (!org) return showTaxonomy(data, node);
  const connected = node.connectedEdges().filter(edge => !edge.hasClass("dim"));
  const funding = connected.filter(edge => edge.data("type") === "FUNDED_BY");
  const sourceIds = new Set([...Object.values(org.source_refs).flat(), ...connected.flatMap(edge => edge.data("source_ids") || [])]);
  const independence = org.independence;
  const flag = countryFlag(org.geography.country);
  setDetails(`
    <p class="eyebrow">${escapeHtml(humanize(org.primary_display_type))} · ${escapeHtml(org.confidence)} confidence</p>
    <h2 class="org-title"><span>${escapeHtml(org.name)}</span>${flag ? `<span class="country-flag" title="${escapeAttribute(displayCountry(org.geography.country))}" aria-label="${escapeAttribute(displayCountry(org.geography.country))}">${flag}</span>` : ""}</h2>
    <p>${escapeHtml(org.description)}</p>
    <div class="chips">${[org.risk_domains.primary, org.lifecycle_stages.primary, org.activities.primary].filter(Boolean).map(taxonomyChip).join("")}</div>
    <h3>Independence evidence</h3>
    <dl>
      ${fact("Legal", humanize(independence.legal_independence))}
      ${fact("Developer cash", humanize(independence.developer_cash_funding_policy))}
      ${fact("In-kind support", independence.developer_in_kind_support.map(humanize).join(", "))}
      ${fact("Publication rights", humanize(independence.publication_rights))}
      ${fact("Conflict policy", humanize(independence.conflict_policy_public))}
      ${fact("Disclosure", humanize(independence.funding_disclosure_quality))}
    </dl>
    ${independence.notes ? `<p class="evidence-note">${escapeHtml(independence.notes)}</p>` : ""}
    ${independence.limitations ? `<p class="limitation"><strong>Evidence gap:</strong> ${escapeHtml(independence.limitations)}</p>` : ""}
    <h3>Documented relationships</h3>
    <p>${connected.length} visible; ${funding.length} funding record${funding.length === 1 ? "" : "s"}.</p>
    <h3>Sources</h3>
    <ul class="source-list">${[...sourceIds].map(sourceLink).join("")}</ul>
    <p class="verified">Verified ${escapeHtml(org.last_verified)} · Review due ${escapeHtml(org.next_review_due)}</p>
    <a class="primary-link" href="${escapeAttribute(org.website)}" target="_blank" rel="noreferrer">Visit organization ↗</a>
  `);
}

function showTaxonomy(data, node) {
  setDetails(`<p class="eyebrow">Taxonomy node</p><h2>${escapeHtml(data.name)}</h2><p>${escapeHtml(data.description)}</p><p>${node.connectedEdges().length} classified organizations in the current graph.</p><p class="limitation">Taxonomy links are editorial classifications supported by the organization's cited scope and activity evidence.</p>`);
}

function showEdge(edge) {
  const data = edge.data();
  const from = edge.source().data("name");
  const to = edge.target().data("name");
  const amount = data.amount?.value == null ? "" : `<p class="amount">${new Intl.NumberFormat("en-US", { style: "currency", currency: data.amount.currency, maximumFractionDigits: 0 }).format(data.amount.value)} <small>${escapeHtml(data.amount.status)}</small></p>`;
  setDetails(`
    <p class="eyebrow">Documented relationship · ${escapeHtml(data.confidence)} confidence</p>
    <h2>${escapeHtml(humanize(data.type))}</h2>
    <p class="route"><strong>${escapeHtml(from)}</strong><span>→</span><strong>${escapeHtml(to)}</strong></p>
    ${amount}
    <dl>${fact("Status", humanize(data.status))}${fact("Announced", data.announcement_date || "Unknown")}${data.amount ? fact("Restriction", humanize(data.amount.restriction)) : ""}</dl>
    <p>${escapeHtml(data.notes || "No additional note.")}</p>
    <h3>Evidence</h3>
    <ul class="source-list">${data.source_ids.map(sourceLink).join("")}</ul>
    <p class="limitation">This edge records only the stated relationship. Collaboration, evaluation, or access does not by itself establish funding or operational control.</p>
  `);
}

function taxonomyChip(id) {
  const node = cy.getElementById(id);
  return `<span>${escapeHtml(node.data("name") || humanize(id))}</span>`;
}

function sourceLink(id) {
  const source = sources.get(id);
  return source ? `<li><a href="${escapeAttribute(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.title)}</a><small>${escapeHtml(source.publisher)} · retrieved ${escapeHtml(source.retrieval_date)}</small></li>` : "";
}

function fact(label, value) { return `<dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value ?? "Unknown")}</dd>`; }
function humanize(value) { return String(value ?? "unknown").replace(/^tax-(risk|life|activity)-/, "").replaceAll("_", " ").replaceAll("-", " ").replace(/\b\w/g, letter => letter.toUpperCase()); }
function countryCode(country) {
  return { US: "US", UK: "GB", Canada: "CA", France: "FR" }[country] || (/^[A-Z]{2}$/.test(country || "") ? country : null);
}
function countryFlag(country) {
  const code = countryCode(country);
  return code ? [...code].map(letter => String.fromCodePoint(127397 + letter.charCodeAt(0))).join("") : "";
}
function displayCountry(country) {
  const code = countryCode(country);
  if (!code) return country || "Unknown country";
  try { return new Intl.DisplayNames(["en"], { type: "region" }).of(code); }
  catch { return country; }
}
function setDetails(html) { document.querySelector("#details").innerHTML = html; }
function escapeHtml(value) { const element = document.createElement("span"); element.textContent = String(value); return element.innerHTML; }
function escapeAttribute(value) { return escapeHtml(value).replaceAll('"', "&quot;"); }
function requireOk(response) { if (!response.ok) throw new Error(`Could not load ${response.url}: ${response.status}`); return response; }

cy.on("tap", "node", event => showNode(event.target));
cy.on("tap", "edge", event => showEdge(event.target));
for (const control of Object.values(controls)) control.addEventListener("input", update);
document.querySelector("#reset").addEventListener("click", () => {
  controls.search.value = ""; controls.scope.value = "all"; controls.country.value = "all"; controls.relationship.value = "all"; controls.colorBy.value = "type"; controls.sizeBy.value = "equal";
  update(); cy.fit(undefined, 50);
});
update();
}
