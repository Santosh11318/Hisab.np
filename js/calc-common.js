/* ==========================================================================
   HISAAB.NP — calculator helpers, shared by every calculator page
   ========================================================================== */

function fmtNPR(n, decimals=0){
  if(isNaN(n)) n = 0;
  return "Rs " + Number(n).toLocaleString("en-IN", {maximumFractionDigits:decimals, minimumFractionDigits:decimals});
}
function fmtNum(n, decimals=0){
  if(isNaN(n)) n = 0;
  return Number(n).toLocaleString("en-IN", {maximumFractionDigits:decimals, minimumFractionDigits:decimals});
}

/* Link a <input type=range> with a numeric text field, keeping both in sync
   and calling onChange(value) whenever either updates. */
function bindSlider(rangeEl, numberEl, onChange){
  function fromRange(){
    numberEl.value = rangeEl.value;
    onChange(parseFloat(rangeEl.value));
  }
  function fromNumber(){
    let v = parseFloat(numberEl.value);
    if(isNaN(v)) v = 0;
    v = Math.min(parseFloat(rangeEl.max), Math.max(parseFloat(rangeEl.min), v));
    rangeEl.value = v;
    onChange(v);
  }
  rangeEl.addEventListener("input", fromRange);
  numberEl.addEventListener("input", fromNumber);
  numberEl.addEventListener("blur", fromNumber);
}

function chartColors(){
  const dark = document.documentElement.getAttribute("data-theme") === "dark";
  return {
    ink: dark ? "#EDF1F0" : "#12233B",
    grid: dark ? "rgba(237,241,240,.08)" : "rgba(18,35,59,.07)",
    crimson: dark ? "#E0687A" : "#A63446",
    marigold: dark ? "#E8BA66" : "#D9A441",
    pine: dark ? "#3EA786" : "#1E6F5C",
    slate: dark ? "#8B98A6" : "#5B6570",
    font: "'IBM Plex Mono', monospace",
  };
}

/* localStorage save / history */
const HISAAB_SAVED_KEY = "hisaab_saved_calcs";
function saveCalculation(calcId, label, data){
  const list = JSON.parse(localStorage.getItem(HISAAB_SAVED_KEY) || "[]");
  list.unshift({calcId, label, data, ts: Date.now()});
  localStorage.setItem(HISAAB_SAVED_KEY, JSON.stringify(list.slice(0,25)));
}

/* CSV export from an array of row-objects */
function exportCSV(filename, rows){
  if(!rows.length) return;
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")].concat(
    rows.map(r=> headers.map(h=> `"${String(r[h]).replace(/"/g,'""')}"`).join(","))
  );
  const blob = new Blob([lines.join("\n")], {type:"text/csv;charset=utf-8;"});
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

/* Copy a plain-text summary to clipboard */
async function copySummary(text){
  try{
    await navigator.clipboard.writeText(text);
    showToast(t("calc_copy_toast"), "fa-copy");
  }catch(e){
    showToast(text);
  }
}

/* Print / "download PDF" — uses the browser's native print-to-PDF, styled
   via the @media print rules in main.css for a clean one-page export. */
function downloadPDF(){
  window.print();
}
