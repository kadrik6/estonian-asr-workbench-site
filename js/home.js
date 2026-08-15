(async function () {
  renderChrome("index.html");
  document.title = t("home.title");
  document.getElementById("page-h1").textContent = t("home.h1");
  document.getElementById("hero-scope").innerHTML = t("home.heroScope");
  document.getElementById("chart-heading").textContent = t("home.chartHeading");
  document.getElementById("chart-caption").textContent = t("home.chartCaption");
  document.getElementById("findings-heading").textContent = t("home.findingsHeading");
  document.getElementById("finding-grid").innerHTML = [1, 2, 3]
    .map(
      (i) => `
        <div class="finding-card">
          <h3>${t(`home.finding${i}Title`)}</h3>
          <p>${t(`home.finding${i}Body`)}</p>
        </div>`
    )
    .join("");
  document.getElementById("cta-compare").textContent = t("home.ctaCompare");
  document.getElementById("cta-transcripts").textContent = t("home.ctaTranscripts");

  // Short display labels for the HOMEPAGE CHART ONLY. These never touch
  // site-data/ or systems.json -- the canonical system_id and full
  // display_name (used everywhere else, including /systems) are untouched.
  // Proper names, so identical in ET and EN; falls back to the full name
  // for any system not listed here (e.g. if a new one is added later)
  // rather than silently rendering blank.
  const HOME_CHART_LABELS = {
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
  function homeChartLabel(s) {
    return HOME_CHART_LABELS[s.system_id] || s.display_name;
  }
  function categoryBarVar(cat) {
    if (cat === "estonian-specialized-local") return "local";
    if (cat === "commercial-cloud") return "cloud";
    return "accent";
  }

  const { manifest, systems } = await loadWorkbenchData();
  applyManifestFooter(manifest);

  const CHART_CATEGORIES = ["estonian-specialized-local", "general-multilingual-open", "commercial-cloud"];
  document.getElementById("chart-legend").innerHTML = CHART_CATEGORIES.map(
    (cat) => `<span class="item"><span class="cat-dot cat-${cat}"></span>${categoryLabel(cat)}</span>`
  ).join("");

  const benchmarked = systems
    .filter((s) => s.status === "benchmarked" && s.headline)
    .sort((a, b) => a.headline.wer_percent - b.headline.wer_percent);

  const maxWer = Math.max(...benchmarked.map((s) => s.headline.wer_percent));
  const chart = document.getElementById("barchart");
  chart.innerHTML = benchmarked
    .map((s) => {
      const pct = (s.headline.wer_percent / maxWer) * 100;
      const short = esc(homeChartLabel(s));
      return `
        <div class="row" title="${esc(s.display_name)}">
          <div class="label"><span class="cat-dot cat-${s.category}"></span><strong>${short}</strong></div>
          <div class="track"><div class="fill" style="width:${pct}%; background: var(--${categoryBarVar(s.category)})"></div></div>
          <div class="val">${fmtPct(s.headline.wer_percent)}</div>
        </div>`;
    })
    .join("");
})();
