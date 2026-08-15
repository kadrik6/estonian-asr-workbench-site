// Shared data loading + chrome for the Estonian ASR Workbench results site.
// Reads only from ./site-data/ -- a static, precomputed export from the
// Workbench repository. No network calls beyond same-origin fetch of these
// JSON/text files; no live scoring or alignment happens here.
//
// Requires js/i18n.js to be loaded first (t, getLang, setLang, TRANSLATIONS).

const DATA_ROOT = "./site-data";

const NAV_ITEMS = [
  { href: "index.html", key: "nav.home" },
  { href: "compare.html", key: "nav.compare" },
  { href: "transcripts.html", key: "nav.transcripts" },
  { href: "systems.html", key: "nav.systems" },
  { href: "methodology.html", key: "nav.methodology" },
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

// familyBucket() buckets a system's free-text architecture_family into one
// of a small set of families for filtering. The bucket VALUES returned here
// (Whisper/Zipformer/wav2vec2 + CTC/unknownProprietary) are proper technical
// names or internal keys, not translated text -- callers render the visible
// label via CATEGORY_LABEL-style lookups or t("common.family.*").
function familyBucket(architectureFamily) {
  const f = (architectureFamily || "").toLowerCase();
  if (f.includes("whisper")) return "Whisper";
  if (f.includes("zipformer")) return "Zipformer";
  if (f.includes("wav2vec2") || f.includes("ctc")) return "wav2vec2 + CTC";
  return "unknownProprietary";
}

function categoryLabel(category) {
  return t(`common.category.${category}`);
}

// Short public-facing display names, used on the homepage chart and the
// /compare table's dense System column ONLY -- never touches site-data/ or
// the canonical system_id/display_name (still shown in full on /systems,
// in title tooltips, and in /compare's expandable detail row). Proper
// names, so identical in ET and EN. Falls back to the full display_name
// for any system not listed here (e.g. a new one added later) rather than
// silently rendering blank.
const SHORT_LABELS = {
  "tekstiks-ee": "tekstiks.ee",
  "whisper-verbatim-2604": "TalTech Whisper Turbo",
  "taltech-local-whisper-medium": "TalTech Whisper Medium",
  "rust-zipformer-small": "Zipformer Small",
  "rust-zipformer-large": "Zipformer Large",
  "microsoft-word-transcribe": "Microsoft Word",
  "whisper-large-v3": "Whisper Large-v3",
  "openai-whisper-medium-generic": "Whisper Medium",
  "omnilingual-asr-ctc-300m": "Meta Omnilingual CTC",
};
function shortLabel(s) {
  return SHORT_LABELS[s.system_id] || s.display_name;
}
function categoryBarVar(cat) {
  if (cat === "estonian-specialized-local") return "local";
  if (cat === "commercial-cloud") return "cloud";
  return "accent";
}

function familyLabel(bucket) {
  return bucket === "Whisper" || bucket === "Zipformer" || bucket === "wav2vec2 + CTC" ? bucket : t("common.family.unknownProprietary");
}

// Display-only locale formatting: Estonian convention uses a comma decimal
// separator, English uses a period. This never touches the underlying
// number or any stored/exported value -- only how it's rendered as text.
function fmtNum(n) {
  const s = n.toFixed(2);
  return getLang() === "et" ? s.replace(".", ",") : s;
}

function fmtPct(n) {
  return n === null || n === undefined ? t("common.dash") : `${fmtNum(n)}%`;
}

// Shared factual-dimension labels, used by both /compare and /systems so
// the two pages can never silently disagree on what a value means. Compact
// form (dash) for dense table cells on /compare; /systems uses the
// UNKNOWN_LONG constant directly for its fuller, explicit wording, per the
// "don't invent proprietary detail" requirement -- see systems.js.
function UNKNOWN_LONG() {
  return t("common.unknownLong");
}

function deploymentBadge(s) {
  if (s.deployment === "local") return `<span class="dim-badge local">${t("common.deployment.local")}</span>`;
  if (s.deployment === "cloud") return `<span class="dim-badge cloud">${t("common.deployment.cloud")}</span>`;
  return t("common.dash");
}

function hardwareLabel(s) {
  const { gpu, cpu } = s.hardware;
  if (gpu && cpu) return t("common.hardware.gpuCpu");
  if (gpu) return t("common.hardware.gpu");
  if (cpu) return t("common.hardware.cpu");
  return t("common.dash");
}

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function reproLabel(v) {
  const known = ["yes", "partially", "no", "not_run"];
  return t(`common.repro.${known.includes(v) ? v : "unknown"}`);
}

function streamingLabel(v, long) {
  if (v === true) return t("common.streaming.true");
  if (v === false) return t("common.streaming.false");
  return long ? UNKNOWN_LONG() : t("common.dash");
}

function tunedLabel(v, long) {
  if (v === true) return t("common.tuned.true");
  if (v === false) return t("common.tuned.false");
  return long ? UNKNOWN_LONG() : t("common.dash");
}

function renderChrome(activeHref) {
  const header = document.getElementById("site-header");
  const footer = document.getElementById("site-footer");
  const lang = getLang();
  if (header) {
    header.innerHTML = `
      <div class="scope-strip">${t("common.scopeStrip")}</div>
      <div class="wrap bar">
        <a class="brand" href="index.html">${t("brand.pre")} <span>${t("brand.accent")}</span></a>
        <nav class="site-nav">
          ${NAV_ITEMS.map(
            (item) => `<a href="${item.href}" class="${item.href === activeHref ? "active" : ""}">${t(item.key)}</a>`
          ).join("")}
        </nav>
        <div class="lang-switch" role="group" aria-label="Language / Keel">
          <button type="button" data-lang="et" aria-pressed="${lang === "et"}">ET</button>
          <span class="lang-sep">|</span>
          <button type="button" data-lang="en" aria-pressed="${lang === "en"}">EN</button>
        </div>
      </div>`;
    header.querySelectorAll(".lang-switch button").forEach((btn) => {
      btn.addEventListener("click", () => setLang(btn.dataset.lang));
    });
  }
  if (footer) {
    footer.innerHTML = `
      <div class="wrap">
        <span>${t("common.footerTagline")}</span>
        <span id="foot-version" class="mono"></span>
      </div>`;
  }
}

function applyManifestFooter(manifest) {
  const el = document.getElementById("foot-version");
  if (el) {
    el.textContent = `${manifest.workbench_version} · ${t("common.footerExported")} ${manifest.export_generated_at} · ${manifest.benchmarked_system_count}/${manifest.system_count} ${t("common.footerBenchmarked")}`;
  }
}
