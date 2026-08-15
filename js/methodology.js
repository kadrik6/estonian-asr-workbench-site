(async function () {
  renderChrome("methodology.html");
  document.title = t("methodology.title");
  document.getElementById("page-h1").textContent = t("methodology.h1");
  document.getElementById("page-intro").textContent = t("methodology.intro");
  document.getElementById("summary-heading").textContent = t("methodology.summaryHeading");
  document.getElementById("summary-list").innerHTML = t("methodology.summary")
    .map((li) => `<li>${li}</li>`)
    .join("");

  const TOC_IDS = [
    "sets",
    "reference",
    "wer",
    "cer",
    "compound",
    "normalization",
    "normalized-display",
    "speed",
    "limitations",
    "reproducibility",
  ];
  const TOC_KEYS = {
    sets: "sets",
    reference: "reference",
    wer: "wer",
    cer: "cer",
    compound: "compound",
    normalization: "normalization",
    "normalized-display": "normalizedDisplay",
    speed: "speed",
    limitations: "limitations",
    reproducibility: "reproducibility",
  };
  const toc = document.getElementById("method-toc");
  toc.setAttribute("aria-label", t("methodology.toc.aria"));
  toc.innerHTML = TOC_IDS.map((id) => `<a href="#${id}">${t(`methodology.toc.${TOC_KEYS[id]}`)}</a>`).join("");

  for (const id of TOC_IDS) {
    const section = document.getElementById(id);
    const data = t(`methodology.sections.${id}`);
    section.querySelector("h2").textContent = data.h2;
    const pSlot = section.querySelector(".p-slot");
    if (pSlot && data.p) pSlot.innerHTML = data.p.map((p) => `<p>${p}</p>`).join("");
    const liSlot = section.querySelector(".li-slot");
    if (liSlot && data.li) liSlot.innerHTML = data.li.map((li) => `<li>${li}</li>`).join("");
  }

  const { manifest, resultsPerSet } = await loadWorkbenchData();
  applyManifestFooter(manifest);

  const refWordsBySet = {};
  for (const row of resultsPerSet) {
    if (!(row.set in refWordsBySet)) refWordsBySet[row.set] = row.reference_words;
  }

  const setsTable = document.getElementById("sets-table");
  setsTable.innerHTML = `
    <div class="table-wrap">
      <table class="leaderboard mini-sets">
        <thead><tr><th>${t("transcripts.setLabel")}</th><th class="num">${t("compare.miniRefWords")}</th><th>${t("methodology.tableRole")}</th></tr></thead>
        <tbody>
          ${manifest.sets
            .map(
              (s) => `<tr>
                <td>${s}</td>
                <td class="num">${refWordsBySet[s] ?? t("common.dash")}</td>
                <td>${manifest.pooled_scope.includes(s) ? t("methodology.rolePooled") : t("methodology.roleSecondary")}</td>
              </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>`;
})();
