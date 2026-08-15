(async function () {
  renderChrome("transcripts.html");
  const { manifest, systems, resultsPerSet } = await loadWorkbenchData();
  applyManifestFooter(manifest);

  const benchmarked = systems.filter((s) => s.status === "benchmarked");
  const byId = Object.fromEntries(systems.map((s) => [s.system_id, s]));

  const MIN_SYS = 2;
  const MAX_SYS = 4;
  const DEFAULT_SYSTEMS = ["tekstiks-ee", "whisper-verbatim-2604", "openai-whisper-medium-generic"];

  const params = new URLSearchParams(location.search);
  let currentSet = params.get("set") && manifest.sets.includes(params.get("set")) ? params.get("set") : "A";

  let selected = new Set();
  if (params.get("sys") && byId[params.get("sys")]) selected.add(params.get("sys"));
  for (const id of DEFAULT_SYSTEMS) {
    if (selected.size >= 3) break;
    if (byId[id]) selected.add(id);
  }

  const setPicker = document.getElementById("set-picker");
  function renderSetPicker() {
    setPicker.innerHTML = manifest.sets
      .map(
        (s) => `<button data-set="${s}" aria-pressed="${s === currentSet}" title="Set ${s}${s === "E" ? " — secondary/qualitative" : ""}">${s}</button>`
      )
      .join("");
    setPicker.querySelectorAll("button").forEach((btn) =>
      btn.addEventListener("click", () => {
        currentSet = btn.dataset.set;
        renderSetPicker();
        renderAll();
      })
    );
  }

  const sysPicker = document.getElementById("sys-picker");
  const pickerNote = document.getElementById("picker-note");
  function renderSysPicker() {
    sysPicker.innerHTML = benchmarked
      .map((s) => {
        const checked = selected.has(s.system_id);
        const disable = !checked && selected.size >= MAX_SYS;
        return `<label class="${checked ? "checked" : ""} ${disable ? "disabled" : ""}">
          <input type="checkbox" data-id="${s.system_id}" ${checked ? "checked" : ""} ${disable ? "disabled" : ""}>
          ${s.display_name}
        </label>`;
      })
      .join("");
    pickerNote.textContent =
      selected.size >= MAX_SYS
        ? "Four is the readable limit — uncheck one to add another."
        : selected.size <= MIN_SYS
        ? "Pick at least two systems to compare."
        : "";

    sysPicker.querySelectorAll("input").forEach((cb) =>
      cb.addEventListener("change", () => {
        const id = cb.dataset.id;
        if (cb.checked) {
          if (selected.size >= MAX_SYS) {
            cb.checked = false;
            return;
          }
          selected.add(id);
        } else {
          if (selected.size <= MIN_SYS) {
            cb.checked = true;
            return;
          }
          selected.delete(id);
        }
        renderSysPicker();
        renderAll();
      })
    );
  }

  // esc() is shared from data.js.

  function renderOps(ops) {
    const parts = [];
    for (const op of ops) {
      if (op.op === "correct") {
        for (const t of op.hyp) parts.push(`<span class="tok">${esc(t)}</span>`);
      } else if (op.op === "substitution") {
        const refTxt = esc(op.ref.join(" "));
        for (const t of op.hyp) parts.push(`<span class="tok sub" title="reference: ${refTxt}">${esc(t)}</span>`);
      } else if (op.op === "insertion") {
        for (const t of op.hyp) parts.push(`<span class="tok ins" title="not in reference">${esc(t)}</span>`);
      } else if (op.op === "deletion") {
        for (const t of op.ref) parts.push(`<span class="tok del" title="missing — reference had this">${esc(t)}</span>`);
      } else if (op.op === "boundary") {
        const refTxt = esc(op.ref.join(" "));
        for (const t of op.hyp) parts.push(`<span class="tok bound" title="word-boundary difference only — reference: ${refTxt}">${esc(t)}</span>`);
      }
    }
    return parts.join(" ");
  }

  function reconstructReference(ops) {
    const words = [];
    for (const op of ops) {
      if (op.ref && op.ref.length) words.push(...op.ref);
    }
    return words.join(" ");
  }

  const refBlock = document.getElementById("ref-block");
  const cols = document.getElementById("transcript-cols");

  async function renderAll() {
    if (selected.size < MIN_SYS) {
      cols.innerHTML = `<div class="empty-hint">Pick at least two systems above to compare.</div>`;
      refBlock.innerHTML = "";
      return;
    }

    const ids = [...selected];
    const alignments = await Promise.all(
      ids.map((id) => loadJSON(`${DATA_ROOT}/alignments/${id}/${currentSet}.json`))
    );

    refBlock.innerHTML = `<span class="eyebrow">Reference script — Set ${currentSet}${currentSet === "E" ? " (secondary/qualitative)" : ""}</span><span class="ref-sub">What every system below is being compared against</span><span class="ref-text">${esc(
      reconstructReference(alignments[0].ops)
    )}</span>`;

    cols.innerHTML = ids
      .map((id, i) => {
        const sys = byId[id];
        const row = resultsPerSet.find((r) => r.system_id === id && r.set === currentSet);
        const wer = row ? `${Number(row.wer_percent).toFixed(2)}% WER` : "";
        return `
          <div class="transcript-col">
            <div class="col-head"><span>${sys.display_name}</span><span class="wer">${wer}</span></div>
            <div class="col-body">${renderOps(alignments[i].ops)}</div>
          </div>`;
      })
      .join("");
  }

  renderSetPicker();
  renderSysPicker();
  renderAll();
})();
