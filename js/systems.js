(async function () {
  renderChrome("systems.html");
  const { manifest, systems } = await loadWorkbenchData();
  applyManifestFooter(manifest);

  const CATEGORY_ORDER = ["estonian-specialized-local", "general-multilingual-open", "commercial-cloud"];
  const openCards = new Set();

  function labelize(key) {
    return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }

  // Renders any plain-data value (the free-form `source` object, mainly) as
  // a label/value list -- deliberately generic rather than hardcoded per
  // system, since each system's provenance fields differ (HF repo/commit
  // hashes for open checkpoints, vendor/product for proprietary ones, etc.)
  // and inventing a rigid shared shape would risk dropping or misrepresenting
  // some of them.
  function renderKV(obj) {
    if (obj === null || obj === undefined) return `<span class="kv-empty">${UNKNOWN_LONG}</span>`;
    if (typeof obj !== "object") return esc(String(obj));
    if (Array.isArray(obj)) {
      if (obj.length === 0) return `<span class="kv-empty">(none)</span>`;
      return obj.map((v) => (typeof v === "object" ? renderKV(v) : esc(String(v)))).join(", ");
    }
    const entries = Object.entries(obj).filter(([, v]) => v !== null && v !== undefined && v !== "");
    if (entries.length === 0) return `<span class="kv-empty">${UNKNOWN_LONG}</span>`;
    return (
      `<dl class="kv-list">` +
      entries
        .map(([k, v]) => {
          const valueHtml = typeof v === "object" ? renderKV(v) : `<span class="kv-val">${esc(String(v))}</span>`;
          return `<div class="kv-row"><dt>${esc(labelize(k))}</dt><dd>${valueHtml}</dd></div>`;
        })
        .join("") +
      `</dl>`
    );
  }

  function badges(s) {
    const parts = [deploymentBadge(s)];
    parts.push(`<span class="dim-badge">${streamingLabel(s.streaming, true)}</span>`);
    parts.push(`<span class="dim-badge">${tunedLabel(s.estonian_tuned, true)}</span>`);
    parts.push(
      s.status === "planned"
        ? `<span class="dim-badge planned">Planned, not benchmarked</span>`
        : `<span class="dim-badge local">Benchmarked</span>`
    );
    return parts.join(" ");
  }

  function headlineSummary(s) {
    if (!s.headline) return `<span class="card-wer-empty">Not benchmarked</span>`;
    return `<span class="card-wer">${fmtPct(s.headline.wer_percent)}</span><span class="card-wer-label">WER</span>`;
  }

  function detailBody(s) {
    const rows = [
      ["Architecture family", familyLabelLong(s.architecture_family)],
      ["Streaming / offline", streamingLabel(s.streaming, true)],
      ["Deployment", s.deployment === "local" ? "Local-capable" : s.deployment === "cloud" ? "External service" : UNKNOWN_LONG],
      ["Hardware used in this benchmark", hardwareLabel(s) === "—" ? UNKNOWN_LONG : hardwareLabel(s)],
      ["Estonian-specific training", tunedLabel(s.estonian_tuned, true)],
      ["Reproducible by you", reproLabel(s.reproducible_by_user)],
      ["Benchmark status", s.status === "planned" ? `Planned, not run — ${s.not_benchmarked_reason || "no reason recorded"}` : "Benchmarked"],
    ];

    const headlineRow = s.headline
      ? `<div class="kv-row"><dt>Headline (pooled A–D)</dt><dd>
          <span class="kv-val">WER ${fmtPct(s.headline.wer_percent)}</span> ·
          <span class="kv-val">CER ${fmtPct(s.headline.cer_percent)}</span> ·
          <span class="kv-val">Compound-aware WER ${fmtPct(s.headline.compound_aware_wer_percent)}</span>
        </dd></div>`
      : `<div class="kv-row"><dt>Headline</dt><dd><span class="kv-empty">Not benchmarked</span></dd></div>`;

    const factsHtml =
      `<dl class="kv-list">` +
      rows.map(([label, val]) => `<div class="kv-row"><dt>${esc(label)}</dt><dd><span class="kv-val">${esc(val)}</span></dd></div>`).join("") +
      headlineRow +
      `</dl>`;

    const limitations = s.known_limitations
      ? `<div class="note-block limitation"><span class="note-label">Known limitations</span><p>${esc(s.known_limitations)}</p></div>`
      : "";
    const unknowns = s.known_unknowns
      ? `<div class="note-block unknown"><span class="note-label">Known unknowns</span><p>${esc(s.known_unknowns)}</p></div>`
      : "";
    const neither =
      !s.known_limitations && !s.known_unknowns
        ? `<div class="note-block"><span class="note-label">Known limitations / unknowns</span><p>No system-specific limitations are currently documented in the Workbench metadata.</p></div>`
        : "";

    const provider = `<div class="kv-row"><dt>Provider / author</dt><dd><span class="kv-val">${esc(s.provider || UNKNOWN_LONG)}</span></dd></div>`;

    const links = `<p class="detail-links">
        <a href="compare.html">See in Compare →</a>
        ${s.status === "benchmarked" ? ` · <a href="transcripts.html?set=A&sys=${encodeURIComponent(s.system_id)}">Compare its transcripts →</a>` : ""}
      </p>`;

    return `
      <div class="detail-grid">
        <div>
          <p class="note-label" style="display:block;margin-bottom:6px;">Profile</p>
          <dl class="kv-list">${provider}</dl>
          ${factsHtml}
        </div>
        <div>
          <p class="note-label" style="display:block;margin-bottom:6px;">Provenance / source</p>
          ${renderKV(s.source)}
        </div>
      </div>
      ${limitations}${unknowns}${neither}
      ${links}`;
  }

  function familyLabelLong(f) {
    return f || UNKNOWN_LONG;
  }

  const catalog = document.getElementById("catalog");

  function render() {
    catalog.innerHTML = CATEGORY_ORDER.map((cat) => {
      const group = systems.filter((s) => s.category === cat);
      if (group.length === 0) return "";
      return `
        <section class="cat-section">
          <h2 class="cat-heading"><span class="cat-dot cat-${cat}"></span>${CATEGORY_LABEL[cat] || cat} <span class="cat-count">(${group.length})</span></h2>
          <div class="system-grid">
            ${group
              .map(
                (s) => `
              <article class="system-card ${openCards.has(s.system_id) ? "open" : ""}" data-id="${s.system_id}">
                <button class="card-head" type="button" aria-expanded="${openCards.has(s.system_id)}">
                  <div class="card-head-main">
                    <div class="card-title">${esc(s.display_name)}</div>
                    <div class="card-provider">${esc(s.provider || UNKNOWN_LONG)}</div>
                    <div class="card-badges">${badges(s)}</div>
                  </div>
                  <div class="card-wer-wrap">${headlineSummary(s)}</div>
                </button>
                <div class="card-detail">${openCards.has(s.system_id) ? detailBody(s) : ""}</div>
              </article>`
              )
              .join("")}
          </div>
        </section>`;
    }).join("");

    catalog.querySelectorAll(".card-head").forEach((btn) => {
      btn.addEventListener("click", () => {
        const card = btn.closest(".system-card");
        const id = card.dataset.id;
        if (openCards.has(id)) openCards.delete(id);
        else openCards.add(id);
        render();
        const el = openCards.has(id) ? document.querySelector(`.system-card[data-id="${id}"]`) : null;
        if (el && typeof el.scrollIntoView === "function") el.scrollIntoView({ block: "nearest" });
      });
    });
  }

  render();
})();
