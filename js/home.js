(async function () {
  renderChrome("index.html");
  const { manifest, systems } = await loadWorkbenchData();
  applyManifestFooter(manifest);

  const benchmarked = systems
    .filter((s) => s.status === "benchmarked" && s.headline)
    .sort((a, b) => a.headline.wer_percent - b.headline.wer_percent);

  const maxWer = Math.max(...benchmarked.map((s) => s.headline.wer_percent));
  const chart = document.getElementById("barchart");
  chart.innerHTML = benchmarked
    .map((s) => {
      const pct = (s.headline.wer_percent / maxWer) * 100;
      return `
        <div class="row">
          <div class="label"><span class="cat-dot cat-${s.category}"></span><strong>${s.display_name}</strong></div>
          <div class="track"><div class="fill" style="width:${pct}%; background: var(--${
        s.category === "estonian-specialized-local"
          ? "local"
          : s.category === "commercial-cloud"
          ? "cloud"
          : "accent"
      })"></div></div>
          <div class="val">${fmtPct(s.headline.wer_percent)}</div>
        </div>`;
    })
    .join("");
})();
