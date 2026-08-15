// Shared data loading + chrome for the Estonian ASR Workbench results site.
// Reads only from ./site-data/ -- a static, precomputed export from the
// Workbench repository. No network calls beyond same-origin fetch of these
// JSON/text files; no live scoring or alignment happens here.

const DATA_ROOT = "./site-data";

const CATEGORY_LABEL = {
  "estonian-specialized-local": "Estonian-specialized, local",
  "general-multilingual-open": "General multilingual, open",
  "commercial-cloud": "Commercial / cloud",
};

const NAV_ITEMS = [
  { href: "index.html", label: "Home" },
  { href: "compare.html", label: "Compare" },
  { href: "transcripts.html", label: "Transcripts" },
  { href: "systems.html", label: "Systems" },
  { href: "methodology.html", label: "Methodology" },
];

async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.json();
}

async function loadText(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.text();
}

async function loadWorkbenchData() {
  const [manifest, systems, resultsPerSet] = await Promise.all([
    loadJSON(`${DATA_ROOT}/manifest.json`),
    loadJSON(`${DATA_ROOT}/systems.json`),
    loadJSON(`${DATA_ROOT}/results_per_set.json`),
  ]);
  return { manifest, systems, resultsPerSet };
}

function familyBucket(architectureFamily) {
  const f = (architectureFamily || "").toLowerCase();
  if (f.includes("whisper")) return "Whisper";
  if (f.includes("zipformer")) return "Zipformer";
  if (f.includes("wav2vec2") || f.includes("ctc")) return "wav2vec2 + CTC";
  return "Unknown / proprietary";
}

function fmtPct(n) {
  return n === null || n === undefined ? "—" : `${n.toFixed(2)}%`;
}

// Shared factual-dimension labels, used by both /compare and /systems so
// the two pages can never silently disagree on what a value means. Compact
// form (dash) for dense table cells on /compare; /systems uses the
// UNKNOWN_LONG constant directly for its fuller, explicit wording, per the
// "don't invent proprietary detail" requirement -- see systems.js.
const UNKNOWN_LONG = "Unknown / not publicly documented";

function deploymentBadge(s) {
  if (s.deployment === "local") return `<span class="dim-badge local">Local-capable</span>`;
  if (s.deployment === "cloud") return `<span class="dim-badge cloud">External service</span>`;
  return "—";
}

function hardwareLabel(s) {
  const { gpu, cpu } = s.hardware;
  if (gpu && cpu) return "GPU + CPU";
  if (gpu) return "GPU";
  if (cpu) return "CPU";
  return "—";
}

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function reproLabel(v) {
  return { yes: "Yes", partially: "Partially", no: "No", not_run: "Not run" }[v] || "Unknown";
}

function streamingLabel(v, long) {
  return v === true ? "Streaming" : v === false ? "Offline" : long ? UNKNOWN_LONG : "—";
}

function tunedLabel(v, long) {
  return v === true ? "Estonian-tuned" : v === false ? "General multilingual" : long ? UNKNOWN_LONG : "—";
}

function renderChrome(activeHref) {
  const header = document.getElementById("site-header");
  const footer = document.getElementById("site-footer");
  if (header) {
    header.innerHTML = `
      <div class="scope-strip">Compares existing Estonian speech-recognition systems. Does not build or train ASR models.</div>
      <div class="wrap bar">
        <a class="brand" href="index.html">Estonian ASR <span>Workbench</span></a>
        <nav class="site-nav">
          ${NAV_ITEMS.map((item) =>
            item.href
              ? `<a href="${item.href}" class="${item.href === activeHref ? "active" : ""}">${item.label}</a>`
              : `<span class="soon">${item.label}</span>`
          ).join("")}
        </nav>
      </div>`;
  }
  if (footer) {
    footer.innerHTML = `
      <div class="wrap">
        <span>Estonian ASR Workbench — comparison project, not a product. See Methodology and About for full detail.</span>
        <span id="foot-version" class="mono"></span>
      </div>`;
  }
}

function applyManifestFooter(manifest) {
  const el = document.getElementById("foot-version");
  if (el) {
    el.textContent = `${manifest.workbench_version} · exported ${manifest.export_generated_at} · ${manifest.benchmarked_system_count}/${manifest.system_count} systems benchmarked`;
  }
}
