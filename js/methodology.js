(async function () {
  renderChrome("methodology.html");
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
        <thead><tr><th>Set</th><th class="num">Reference words</th><th>Role</th></tr></thead>
        <tbody>
          ${manifest.sets
            .map(
              (s) => `<tr>
                <td>${s}</td>
                <td class="num">${refWordsBySet[s] ?? "—"}</td>
                <td>${manifest.pooled_scope.includes(s) ? "Pooled into the headline WER" : "Reported separately, secondary/qualitative"}</td>
              </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>`;
})();
