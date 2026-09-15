/* Disposable interaction spike. Records are illustrative and are not canonical claims. */
const nodeRows = [
  ["metr","METR","organization","evaluations",null,null,"https://metr.org/"],
  ["lawzero","LawZero","organization","safe-design",null,15,"https://lawzero.org/en/news/yoshua-bengio-launches-lawzero-new-nonprofit-advancing-safe-design-ai"],
  ["sampura","Sampura Research","organization","oversight",11,null,"https://sampura.org/news/announcing-sampura-research/"],
  ["apollo","Apollo Research","organization","evaluations",null,15,"https://www.apolloresearch.ai/blog/the-first-year-of-apollo-research"],
  ["cais","Center for AI Safety","organization","research",null,null,"https://safe.ai/"],
  ["redwood","Redwood Research","organization","research",null,null,"https://www.redwoodresearch.org/"],
  ["miri","MIRI","organization","research",null,null,"https://intelligence.org/"],
  ["saferai","SaferAI","organization","governance",null,null,"https://www.safer-ai.org/"],
  ["cesia","CeSIA","organization","governance",null,null,"https://www.cesia.org/"],
  ["govai","GovAI","organization","governance",null,null,"https://www.governance.ai/"],
  ["arc","Alignment Research Center","organization","research",null,null,"https://www.alignment.org/"],
  ["far","FAR.AI","organization","research",null,null,"https://far.ai/"],
  ["chai","CHAI","organization","research",null,null,"https://humancompatible.ai/"],
  ["ainow","AI Now Institute","organization","public-interest",null,null,"https://ainowinstitute.org/"],
  ["ada","Ada Lovelace Institute","organization","public-interest",null,null,"https://www.adalovelaceinstitute.org/"],
  ["ajl","Algorithmic Justice League","organization","public-interest",null,null,"https://www.ajl.org/"],
  ["fli","Future of Life Institute","organization","governance",null,null,"https://futureoflife.org/"],
  ["forhumanity","ForHumanity","organization","audit",null,null,"https://forhumanity.center/"],
  ["evalforum","AI Evaluator Forum","organization","evaluations",null,null,"https://aievaluatorforum.org/"],
  ["apart","Apart Research","organization","research",null,20,"https://apartresearch.com/"],
  ["openai","OpenAI","frontier","developer",null,null,"https://openai.com/"],
  ["anthropic","Anthropic","frontier","developer",null,null,"https://www.anthropic.com/"],
  ["deepmind","Google DeepMind","frontier","developer",null,null,"https://deepmind.google/"],
  ["meta","Meta AI","frontier","developer",null,null,"https://ai.meta.com/"],
  ["coefficient","Coefficient Giving","funder","funding",null,null,"https://coefficientgiving.org/"],
  ["sff","Survival and Flourishing Fund","funder","funding",null,null,"https://survivalandflourishing.fund/"],
  ["openphil","Open Philanthropy","funder","funding",null,null,"https://www.openphilanthropy.org/"],
  ["fmf-fund","Frontier Model Forum AI Safety Fund","funder","funding",null,null,"https://www.frontiermodelforum.org/"],
  ["schmidt","Schmidt Sciences","funder","funding",null,null,"https://www.schmidtsciences.org/"],
  ["ukaisi","UK AI Security Institute","government","evaluations",null,null,"https://www.aisi.gov.uk/"],
  ["uscaisi","US CAISI","government","standards",null,null,"https://www.nist.gov/caisi"],
  ["japanaisi","Japan AI Safety Institute","government","evaluations",null,null,"https://aisi.go.jp/"],
  ["singaporeaisi","Singapore AI Safety Institute","government","evaluations",null,null,"https://www.aisi.gov.sg/"],
  ["canadaaisi","Canadian AI Safety Institute","government","research",null,null,"https://ised-isde.canada.ca/site/ai-safety-institute/en"],
  ["topic-evals","Evaluations & benchmarks","topic","evaluations",null,null,null],
  ["topic-safe-design","Safe-by-design research","topic","safe-design",null,null,null],
  ["topic-governance","Governance & audit","topic","governance",null,null,null],
  ["topic-harms","Present-day harms","topic","public-interest",null,null,null],
  ["stage-predeploy","Pre-deployment evaluation","lifecycle","evaluations",null,null,null],
  ["stage-monitor","Deployment monitoring","lifecycle","oversight",null,null,null]
];

const edgeRows = [
  ["sampura","coefficient","FUNDED_BY","USD 11m announced: USD 7m first year + USD 4m pledged","https://sampura.org/news/announcing-sampura-research/"],
  ["apollo","openai","COLLABORATED_WITH","Anti-scheming evaluations","https://openai.com/index/detecting-and-reducing-scheming-in-ai-models/"],
  ["apollo","openai","EVALUATED","Frontier-model scheming evaluations","https://www.apolloresearch.ai/science"],
  ["lawzero","topic-safe-design","WORKS_ON","Scientist AI","https://lawzero.org/en"],
  ["sampura","topic-evals","WORKS_ON","Human–AI judges for scalable oversight","https://sampura.org/news/announcing-sampura-research/"],
  ["sampura","stage-monitor","INTERVENES_AT","Planned deployment-time monitoring applications","https://sampura.org/news/announcing-sampura-research/"],
  ["metr","topic-evals","WORKS_ON","Capability evaluations","https://metr.org/"],
  ["metr","stage-predeploy","INTERVENES_AT","Pre-deployment evaluation","https://metr.org/"],
  ["apollo","topic-evals","WORKS_ON","Scheming evaluations","https://www.apolloresearch.ai/science"],
  ["apollo","stage-predeploy","INTERVENES_AT","Pre-deployment evaluation","https://www.apolloresearch.ai/science"],
  ["cais","topic-evals","WORKS_ON","Benchmarks and safety research",null],
  ["redwood","topic-evals","WORKS_ON","Control and alignment research",null],
  ["miri","topic-safe-design","WORKS_ON","Foundational alignment research",null],
  ["saferai","topic-governance","WORKS_ON","Risk management and standards",null],
  ["cesia","topic-governance","WORKS_ON","Policy and governance",null],
  ["govai","topic-governance","WORKS_ON","Governance research",null],
  ["arc","topic-safe-design","WORKS_ON","Alignment research",null],
  ["far","topic-evals","WORKS_ON","Safety research",null],
  ["chai","topic-safe-design","WORKS_ON","Human-compatible AI",null],
  ["ainow","topic-harms","WORKS_ON","Social impacts and accountability",null],
  ["ada","topic-harms","WORKS_ON","Public-interest technology",null],
  ["ajl","topic-harms","WORKS_ON","Bias and discrimination",null],
  ["fli","topic-governance","WORKS_ON","AI risk governance",null],
  ["forhumanity","topic-governance","WORKS_ON","Independent audit",null],
  ["evalforum","topic-evals","WORKS_ON","Evaluator coordination",null],
  ["apart","topic-evals","WORKS_ON","Research mapping and safety research",null],
  ["ukaisi","topic-evals","WORKS_ON","Public-sector evaluation",null],
  ["japanaisi","topic-evals","WORKS_ON","Safety evaluation",null],
  ["singaporeaisi","topic-evals","WORKS_ON","Safety evaluation",null],
  ["canadaaisi","topic-evals","WORKS_ON","Safety research",null],
  ["uscaisi","topic-governance","WORKS_ON","Standards and evaluation",null]
];

const elements = [
  ...nodeRows.map(([id,label,type,activity,funding,headcount,source]) => ({
    data: { id, label, type, activity, funding, headcount, source }
  })),
  ...edgeRows.map(([source,target,type,note,evidence], index) => ({
    data: { id: `e${index + 1}`, source, target, type, note, evidence }
  }))
];

const typeColors = { organization:"#237a64", frontier:"#8f544b", funder:"#d48a2f", government:"#536fa8", topic:"#7a63a8", lifecycle:"#4d8d97" };
const activityColors = { evaluations:"#316ca6", "safe-design":"#754da0", oversight:"#1f8175", research:"#4a7c59", governance:"#d07f22", "public-interest":"#bd4e68", audit:"#666f78", developer:"#8f544b", funding:"#c6922f", standards:"#536fa8" };

const cy = cytoscape({
  container: document.getElementById("cy"), elements,
  layout: { name:"cose", animate:false, randomize:true, nodeRepulsion: node => node.data("type") === "topic" ? 110000 : 65000, idealEdgeLength: 95 },
  style: [
    { selector:"node", style:{ "background-color":"#237a64", label:"data(label)", color:"#17211d", "font-size":10, "text-wrap":"wrap", "text-max-width":90, "text-valign":"bottom", "text-margin-y":7, width:30, height:30, "border-width":1, "border-color":"#fff" } },
    { selector:"node[type = 'frontier']", style:{ shape:"round-rectangle" } },
    { selector:"node[type = 'funder']", style:{ shape:"diamond" } },
    { selector:"node[type = 'government']", style:{ shape:"hexagon" } },
    { selector:"node[type = 'topic'], node[type = 'lifecycle']", style:{ shape:"tag", "font-weight":700 } },
    { selector:"node.unknown", style:{ "border-width":3, "border-style":"dotted", "border-color":"#69756f" } },
    { selector:"edge", style:{ width:1.3, "line-color":"#a7aaa5", "target-arrow-color":"#a7aaa5", "target-arrow-shape":"triangle", "curve-style":"bezier", opacity:.7 } },
    { selector:"edge[type = 'FUNDED_BY']", style:{ "line-color":"#d48a2f", "target-arrow-color":"#d48a2f", width:3 } },
    { selector:"edge[type = 'EVALUATED']", style:{ "line-color":"#316ca6", "target-arrow-color":"#316ca6", width:2.5 } },
    { selector:"edge[type = 'COLLABORATED_WITH']", style:{ "line-style":"dashed", "line-color":"#675e91", "target-arrow-color":"#675e91" } },
    { selector:":selected", style:{ "overlay-color":"#e59b3c", "overlay-opacity":.25, "overlay-padding":8 } },
    { selector:".dim", style:{ opacity:.09 } }
  ]
});

const controls = ["search","nodeType","edgeType","sizeMetric","colorDimension"].reduce((acc,id) => (acc[id] = document.getElementById(id), acc), {});
const params = new URLSearchParams(location.search);
for (const [id, el] of Object.entries(controls)) if (params.has(id)) el.value = params.get(id);

function metricSize(node, metric) {
  if (metric === "equal") return 30;
  const value = node.data(metric);
  if (value == null) return 25;
  return 18 + Math.sqrt(value) * (metric === "funding" ? 4.5 : 2.7);
}

function update() {
  const query = controls.search.value.trim().toLowerCase();
  const nodeType = controls.nodeType.value;
  const edgeType = controls.edgeType.value;
  const metric = controls.sizeMetric.value;
  const colors = controls.colorDimension.value === "type" ? typeColors : activityColors;

  cy.batch(() => {
    cy.elements().removeClass("dim unknown");
    cy.nodes().forEach(node => {
      const matchesText = !query || `${node.data("label")} ${node.data("activity")}`.toLowerCase().includes(query);
      const matchesType = nodeType === "all" || node.data("type") === nodeType;
      if (!matchesText || !matchesType) node.addClass("dim");
      if (metric !== "equal" && node.data(metric) == null) node.addClass("unknown");
      node.style({ width:metricSize(node, metric), height:metricSize(node, metric), "background-color":colors[node.data(controls.colorDimension.value)] || "#78817d" });
    });
    cy.edges().forEach(edge => {
      if ((edgeType !== "all" && edge.data("type") !== edgeType) || edge.source().hasClass("dim") || edge.target().hasClass("dim")) edge.addClass("dim");
    });
  });

  const next = new URLSearchParams();
  for (const [id, el] of Object.entries(controls)) if (el.value && !(["nodeType","edgeType"].includes(id) && el.value === "all") && !(id === "sizeMetric" && el.value === "equal") && !(id === "colorDimension" && el.value === "type")) next.set(id, el.value);
  history.replaceState(null, "", next.size ? `?${next}` : location.pathname);
  const visibleNodes = cy.nodes().filter(n => !n.hasClass("dim")).length;
  const visibleEdges = cy.edges().filter(e => !e.hasClass("dim")).length;
  document.getElementById("count").textContent = `${visibleNodes} visible nodes · ${visibleEdges} visible relationships`;
  renderLegend(colors);
}

function renderLegend(colors) {
  const legend = document.getElementById("legend");
  legend.replaceChildren();
  Object.entries(colors).forEach(([label,color]) => {
    const swatch = document.createElement("span"); swatch.className = "swatch"; swatch.style.background = color;
    const text = document.createElement("span"); text.textContent = label.replaceAll("-", " ");
    legend.append(swatch, text);
  });
}

function showDetails(element) {
  const d = element.data();
  const panel = document.getElementById("details");
  if (element.isNode()) {
    const metric = value => value == null ? "Unknown (neutral display)" : value;
    panel.innerHTML = `<p class="eyebrow">${d.type}</p><h2>${d.label}</h2><p>Primary activity: ${d.activity}</p><dl><dt>Funding</dt><dd>${metric(d.funding)}${d.funding != null ? "m USD" : ""}</dd><dt>Headcount</dt><dd>${metric(d.headcount)}</dd><dt>Connections</dt><dd>${element.connectedEdges().length}</dd></dl><p class="warning">Spike record only. The few populated metrics have example sources but omit production metadata such as as-of dates; they must not enter the canonical dataset without field-level review.</p>${d.source ? `<p><a href="${d.source}" target="_blank" rel="noreferrer">Open example source</a></p>` : "<p>No example source attached.</p>"}`;
  } else {
    panel.innerHTML = `<p class="eyebrow">Relationship</p><h2>${d.type.replaceAll("_", " ")}</h2><p>${element.source().data("label")} → ${element.target().data("label")}</p><p>${d.note || "Amount/status not disclosed in this spike."}</p><p class="warning">Illustrative edge. Canonical relationships require dates, confidence, and reviewed source support.</p>${d.evidence ? `<p><a href="${d.evidence}" target="_blank" rel="noreferrer">Open example evidence</a></p>` : "<p>Evidence not attached in the spike.</p>"}`;
  }
}

cy.on("tap", "node, edge", event => showDetails(event.target));
Object.values(controls).forEach(control => control.addEventListener("input", update));
document.getElementById("reset").addEventListener("click", () => {
  controls.search.value = ""; controls.nodeType.value = "all"; controls.edgeType.value = "all"; controls.sizeMetric.value = "equal"; controls.colorDimension.value = "type";
  update(); cy.fit(undefined, 40);
});

update();
