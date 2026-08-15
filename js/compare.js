(async function () {
  renderChrome("compare.html");
  document.title = t("compare.title");
  document.getElementById("page-h1").textContent = t("compare.h1");
  document.getElementById("page-intro").textContent = t("compare.intro");
  document.getElementById("rank-note").textContent = t("compare.rankNote");

  const { manifest, systems, resultsPerSet } = await loadWorkbenchData();
  applyManifestFooter(manifest);

  const FILTER_DEFS = [
    {
      key: "deployment",
      label: t("compare.filters.deployment"),
      options: [
        { value: "local", label: t("common.deployment.local") },
        { value: "cloud", label: t("common.deployment.cloud") },
      ],
      get: (s) => s.deployment,
    },
    {
      key: "family",
      label: t("compare.filters.family"),
      options: [
        { value: "Whisper", label: "Whisper" },
        { value: "Zipformer", label: "Zipformer" },
        { value: "wav2vec2 + CTC", label: "wav2vec2 + CTC" },
        { value: "unknownProprietary", label: t("common.family.unknownProprietary") },
      ],
      get: (s) => familyBucket(s.architecture_family),
    },
    {
      key: "streaming",
      label: t("compare.filters.streaming"),
      options: [
        { value: "true", label: t("compare.filters.optStreaming") },
        { value: "false", label: t("compare.filters.optOffline") },
        { value: "null", label: t("compare.filters.optUnknown") },
      ],
      get: (s) => String(s.streaming),
    },
    {
      key: "tuning",
      label: t("compare.filters.tuning"),
      options: [
        { value: "true", label: t("compare.filters.optTuned") },
        { value: "false", label: t("compare.filters.optGeneral") },
        { value: "null", label: t("compare.filters.optUnknown") },
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

  // width: explicit column width in px (table-layout:fixed + <colgroup>,
  // see below) -- based on measured text-metric worst cases per column,
  // not guessed. nowrap: true forces single-line (System short names must
  // never wrap; the trivial Yes/No/dash and numeric columns never need
  // to). Columns without nowrap (Category, Deployment, Hardware,
  // Streaming, Reproducible) may wrap to 2 lines under long ET translations
  // -- an acceptable, ordinary table behavior, unlike system NAMES wrapping.
  const COLUMNS = [
    { key: "display_name", label: t("compare.columns.system"), width: 210, nowrap: true, cellClass: "sys-cell", render: (s) => esc(shortLabel(s)), title: (s) => s.display_name },
    { key: "category", label: t("compare.columns.category"), width: 140, render: (s) => categoryLabel(s.category) },
    { key: "deployment", label: t("compare.columns.deployment"), width: 110, render: deploymentBadge },
    { key: "hardware", label: t("compare.columns.hardware"), width: 80, render: hardwareLabel },
    { key: "streaming", label: t("compare.columns.streaming"), width: 110, render: (s) => streamingLabel(s.streaming) },
    { key: "estonian_tuned", label: t("compare.columns.tuned"), width: 60, nowrap: true, render: (s) => (s.estonian_tuned === true ? t("common.repro.yes") : s.estonian_tuned === false ? t("common.repro.no") : t("common.dash")) },
    { key: "reproducible_by_user", label: t("compare.columns.reproducible"), width: 100, render: (s) => reproLabel(s.reproducible_by_user) },
    { key: "wer", label: t("compare.columns.wer"), width: 64, numeric: true, nowrap: true, render: (s) => fmtPct(s.headline?.wer_percent ?? null), sortVal: (s) => s.headline?.wer_percent ?? Infinity },
    { key: "cer", label: t("compare.columns.cer"), width: 64, numeric: true, nowrap: true, render: (s) => fmtPct(s.headline?.cer_percent ?? null), sortVal: (s) => s.headline?.cer_percent ?? Infinity },
    { key: "compound", label: t("compare.columns.compound"), width: 90, numeric: true, nowrap: true, render: (s) => fmtPct(s.headline?.compound_aware_wer_percent ?? null), sortVal: (s) => s.headline?.compound_aware_wer_percent ?? Infinity },
  ];

  // deploymentBadge, hardwareLabel, reproLabel, streamingLabel, categoryLabel,
  // shortLabel are shared from data.js -- see there, not redefined here, so
  // /compare and /systems can't silently disagree on what a value means.

  let sortKey = "wer";
  let sortDir = 1; // 1 asc, -1 desc
  const openRows = new Set();

  document.getElementById("leaderboard").insertAdjacentHTML(
    "afterbegin",
    `<colgroup>${COLUMNS.map((c) => `<col style="width:${c.width}px">`).join("")}</colgroup>`
  );

  const theadRow = document.getElementById("thead-row");
  theadRow.innerHTML = COLUMNS.map(
    (c) => `<th class="${c.numeric ? "num " : ""}${c.nowrap ? "nowrap" : ""}" data-key="${c.key}">${c.label}</th>`
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
    document.getElementById("filter-count").textContent = t("compare.filterCount")
      .replace("${n}", rows.length)
      .replace("${total}", systems.length);

    if (rows.length === 0) {
      tbody.innerHTML = `<tr><td colspan="${COLUMNS.length}" class="empty-hint">${t("compare.emptyFilter")}</td></tr>`;
      return;
    }

    tbody.innerHTML = rows
      .map((s) => {
        const cells = COLUMNS.map((c) => {
          const cls = [c.numeric ? "num" : "", c.nowrap ? "nowrap" : "", c.cellClass || ""].filter(Boolean).join(" ");
          const titleAttr = c.title ? ` title="${esc(c.title(s))}"` : "";
          return `<td class="${cls}"${titleAttr}>${c.render ? c.render(s) : s[c.key] ?? t("common.dash")}</td>`;
        }).join("");
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
    // The dense row shows only the short display name -- the full
    // canonical name (and provider) is never hidden, just moved here.
    const header = `<p class="detail-fullname"><span class="note-label">${t("compare.fullName")}</span> ${esc(s.display_name)}
      <span class="detail-provider">${esc(s.provider || UNKNOWN_LONG())}</span></p>`;

    if (s.status === "planned") {
      // not_benchmarked_reason is raw Workbench metadata -- never translated.
      return `${header}<em>${t("compare.plannedDetail")}${esc(s.not_benchmarked_reason || "")}.</em>`;
    }
    const rows = perSetRows(s.system_id);
    if (rows.length === 0) return `${header}<em>${t("compare.noPerSetData")}</em>`;
    return `
      ${header}
      <table class="mini-table">
        <thead><tr><th>${t("compare.miniSet")}</th><th>${t("compare.miniWer")}</th><th>${t("compare.miniCer")}</th><th>${t("compare.miniCompound")}</th><th>${t("compare.miniRefWords")}</th></tr></thead>
        <tbody>
          ${rows
            .map(
              (r) => `<tr>
                <td>${r.set}${r.set === "E" ? " " + t("compare.secondary") : ""}</td>
                <td>${fmtNum(Number(r.wer_percent))}%</td>
                <td>${fmtNum(Number(r.cer_percent))}%</td>
                <td>${fmtNum(Number(r.compound_aware_wer_percent))}%</td>
                <td>${r.reference_words}</td>
              </tr>`
            )
            .join("")}
        </tbody>
      </table>
      <p style="margin:8px 0 0;"><a href="transcripts.html?set=${rows[0].set}&sys=${s.system_id}">${t("compare.compareTranscripts")}</a></p>`;
  }

  renderFilters();
  renderTable();
})();
