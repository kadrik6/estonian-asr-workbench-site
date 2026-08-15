(async function () {
  renderChrome("compare.html");
  const { manifest, systems, resultsPerSet } = await loadWorkbenchData();
  applyManifestFooter(manifest);

  const FILTER_DEFS = [
    {
      key: "deployment",
      label: "Deployment",
      options: [
        { value: "local", label: "Local-capable" },
        { value: "cloud", label: "External service" },
      ],
      get: (s) => s.deployment,
    },
    {
      key: "family",
      label: "Architecture family",
      options: [
        { value: "Whisper", label: "Whisper" },
        { value: "Zipformer", label: "Zipformer" },
        { value: "wav2vec2 + CTC", label: "wav2vec2 + CTC" },
        { value: "Unknown / proprietary", label: "Unknown / proprietary" },
      ],
      get: (s) => familyBucket(s.architecture_family),
    },
    {
      key: "streaming",
      label: "Streaming / offline",
      options: [
        { value: "true", label: "Streaming" },
        { value: "false", label: "Offline" },
        { value: "null", label: "Unknown" },
      ],
      get: (s) => String(s.streaming),
    },
    {
      key: "tuning",
      label: "Estonian-tuned",
      options: [
        { value: "true", label: "Estonian-tuned" },
        { value: "false", label: "General multilingual" },
        { value: "null", label: "Unknown" },
      ],
      get: (s) => String(s.estonian_tuned),
    },
  ];

  // active[key] = Set of selected option values; empty Set = no filter applied
  const active = {};
  FILTER_DEFS.forEach((f) => (active[f.key] = new Set()));

  const filtersEl = document.getElementById("filters");
  function renderFilters() {
    filtersEl.innerHTML =
      FILTER_DEFS.map(
        (f) => `
        <div class="filter-group">
          <span class="fg-label">${f.label}</span>
          <div class="fg-opts">
            ${f.options
              .map(
                (o) => `<button class="chip" data-filter="${f.key}" data-value="${o.value}"
                  aria-pressed="${active[f.key].has(o.value)}">${o.label}</button>`
              )
              .join("")}
          </div>
        </div>`
      ).join("") + `<span class="filter-meta" id="filter-count"></span>`;

    filtersEl.querySelectorAll(".chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.filter;
        const val = btn.dataset.value;
        if (active[key].has(val)) active[key].delete(val);
        else active[key].add(val);
        renderFilters();
        renderTable();
      });
    });
  }

  function matchesFilters(s) {
    return FILTER_DEFS.every((f) => {
      if (active[f.key].size === 0) return true;
      return active[f.key].has(f.get(s));
    });
  }

  const COLUMNS = [
    { key: "display_name", label: "System", numeric: false },
    { key: "category", label: "Category", numeric: false, render: (s) => CATEGORY_LABEL[s.category] || s.category },
    { key: "deployment", label: "Deployment", numeric: false, render: deploymentBadge },
    { key: "hardware", label: "Hardware", numeric: false, render: hardwareLabel },
    { key: "streaming", label: "Streaming", numeric: false, render: (s) => streamingLabel(s.streaming) },
    { key: "estonian_tuned", label: "Est.-tuned", numeric: false, render: (s) => (s.estonian_tuned === true ? "Yes" : s.estonian_tuned === false ? "No" : "—") },
    { key: "reproducible_by_user", label: "Reproducible", numeric: false, render: (s) => reproLabel(s.reproducible_by_user) },
    { key: "wer", label: "WER", numeric: true, render: (s) => fmtPct(s.headline?.wer_percent ?? null), sortVal: (s) => s.headline?.wer_percent ?? Infinity },
    { key: "cer", label: "CER", numeric: true, render: (s) => fmtPct(s.headline?.cer_percent ?? null), sortVal: (s) => s.headline?.cer_percent ?? Infinity },
    { key: "compound", label: "Compound-aware", numeric: true, render: (s) => fmtPct(s.headline?.compound_aware_wer_percent ?? null), sortVal: (s) => s.headline?.compound_aware_wer_percent ?? Infinity },
  ];

  // deploymentBadge, hardwareLabel, reproLabel, streamingLabel are shared
  // from data.js -- see there, not redefined here, so /compare and
  // /systems can't silently disagree on what a value means.

  let sortKey = "wer";
  let sortDir = 1; // 1 asc, -1 desc
  const openRows = new Set();

  const theadRow = document.getElementById("thead-row");
  theadRow.innerHTML = COLUMNS.map(
    (c) => `<th class="${c.numeric ? "num" : ""}" data-key="${c.key}">${c.label}</th>`
  ).join("");
  theadRow.querySelectorAll("th").forEach((th) => {
    th.addEventListener("click", () => {
      const key = th.dataset.key;
      if (sortKey === key) sortDir *= -1;
      else {
        sortKey = key;
        sortDir = 1;
      }
      renderTable();
    });
  });

  function sortedFiltered() {
    const col = COLUMNS.find((c) => c.key === sortKey);
    const rows = systems.filter(matchesFilters);
    rows.sort((a, b) => {
      let av, bv;
      if (col.numeric) {
        av = col.sortVal(a);
        bv = col.sortVal(b);
        // Missing values (not-yet-benchmarked systems) always sort last,
        // regardless of sort direction -- Infinity would otherwise jump to
        // the top on a descending sort, implying "worst score" instead of
        // "no score".
        const aMissing = !Number.isFinite(av);
        const bMissing = !Number.isFinite(bv);
        if (aMissing || bMissing) {
          if (aMissing && bMissing) return 0;
          return aMissing ? 1 : -1;
        }
      } else {
        av = String(col.render ? col.render(a).replace(/<[^>]+>/g, "") : a[col.key] ?? "");
        bv = String(col.render ? col.render(b).replace(/<[^>]+>/g, "") : b[col.key] ?? "");
      }
      if (av < bv) return -1 * sortDir;
      if (av > bv) return 1 * sortDir;
      return 0;
    });
    return rows;
  }

  function perSetRows(systemId) {
    return resultsPerSet
      .filter((r) => r.system_id === systemId)
      .sort((a, b) => a.set.localeCompare(b.set));
  }

  const tbody = document.getElementById("tbody");
  function renderTable() {
    theadRow.querySelectorAll("th").forEach((th) => {
      th.removeAttribute("aria-sort");
      if (th.dataset.key === sortKey) th.setAttribute("aria-sort", sortDir === 1 ? "ascending" : "descending");
    });

    const rows = sortedFiltered();
    document.getElementById("filter-count").textContent = `${rows.length} / ${systems.length} systems`;

    if (rows.length === 0) {
      tbody.innerHTML = `<tr><td colspan="${COLUMNS.length}" class="empty-hint">No systems match the selected filters. Try clearing one.</td></tr>`;
      return;
    }

    tbody.innerHTML = rows
      .map((s) => {
        const cells = COLUMNS.map((c) => `<td class="${c.numeric ? "num" : ""}">${c.render ? c.render(s) : s[c.key] ?? "—"}</td>`).join("");
        const detail = renderDetail(s);
        return `
          <tr class="sysrow" data-id="${s.system_id}">${cells}</tr>
          <tr class="detail-row ${openRows.has(s.system_id) ? "open" : ""}" data-detail-for="${s.system_id}">
            <td colspan="${COLUMNS.length}">${detail}</td>
          </tr>`;
      })
      .join("");

    tbody.querySelectorAll("tr.sysrow").forEach((tr) => {
      tr.addEventListener("click", () => {
        const id = tr.dataset.id;
        if (openRows.has(id)) openRows.delete(id);
        else openRows.add(id);
        document.querySelector(`tr[data-detail-for="${id}"]`).classList.toggle("open");
      });
    });
  }

  function renderDetail(s) {
    if (s.status === "planned") {
      return `<em>Planned, not benchmarked — ${s.not_benchmarked_reason || "no reason recorded"}.</em>`;
    }
    const rows = perSetRows(s.system_id);
    if (rows.length === 0) return `<em>No per-set data exported.</em>`;
    return `
      <table class="mini-table">
        <thead><tr><th>Set</th><th>WER</th><th>CER</th><th>Compound-aware</th><th>Ref words</th></tr></thead>
        <tbody>
          ${rows
            .map(
              (r) => `<tr>
                <td>${r.set}${r.set === "E" ? " (secondary)" : ""}</td>
                <td>${Number(r.wer_percent).toFixed(2)}%</td>
                <td>${Number(r.cer_percent).toFixed(2)}%</td>
                <td>${Number(r.compound_aware_wer_percent).toFixed(2)}%</td>
                <td>${r.reference_words}</td>
              </tr>`
            )
            .join("")}
        </tbody>
      </table>
      <p style="margin:8px 0 0;"><a href="transcripts.html?set=${rows[0].set}&sys=${s.system_id}">Compare this system's transcripts →</a></p>`;
  }

  renderFilters();
  renderTable();
})();
