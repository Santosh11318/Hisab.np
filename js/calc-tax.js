/* ==========================================================================
   Nepal Income Tax Calculator
   FY 2083/84 (2026/27) — current, unified slab for resident individuals
   FY 2082/83 (2025/26) — previous, single-person slab (shown for comparison)
   Source: Budget 2083/84, Finance Ordinance 2083 (see page FAQ for notes).
   ========================================================================== */

const TAX_SLABS_CURRENT = [ // FY 2083/84
  { upto: 1000000, rate: 1 },
  { upto: 1500000, rate: 10 },
  { upto: 2500000, rate: 20 },
  { upto: 4000000, rate: 27 },
  { upto: Infinity, rate: 29 },
];
const TAX_SLABS_OLD = [ // FY 2082/83, single/unmarried
  { upto: 500000, rate: 1 },
  { upto: 700000, rate: 10 },
  { upto: 1000000, rate: 20 },
  { upto: 2000000, rate: 30 },
  { upto: 5000000, rate: 36 },
  { upto: Infinity, rate: 39 },
];

function computeTax(income, slabs, ssfExempt=false){
  let remaining = income, lower = 0, tax = 0;
  const rows = [];
  for(const slab of slabs){
    if(remaining <= 0) break;
    const band = Math.min(remaining, slab.upto - lower);
    if(band <= 0){ lower = slab.upto; continue; }
    let rate = slab.rate;
    if(ssfExempt && lower === 0 && slab.rate === 1) rate = 0;
    const bandTax = band * rate/100;
    tax += bandTax;
    rows.push({ from: lower, to: Math.min(slab.upto, income), rate, taxable: band, tax: bandTax });
    remaining -= band;
    lower = slab.upto;
  }
  return { tax: Math.round(tax), rows, effectiveRate: income>0 ? (tax/income*100) : 0 };
}

let taxChartPie, taxChartBar;

function renderTax(){
  const income = parseFloat(document.getElementById("taxIncome").value) || 0;
  const ssfExempt = document.getElementById("taxSSFExempt").checked;
  const compareOn = document.getElementById("taxCompareToggle").checked;

  const current = computeTax(income, TAX_SLABS_CURRENT, ssfExempt);
  const old = compareOn ? computeTax(income, TAX_SLABS_OLD, ssfExempt) : null;

  document.getElementById("taxAmount").textContent = fmtNPR(current.tax);
  document.getElementById("taxNetIncome").textContent = fmtNPR(income - current.tax);
  document.getElementById("taxEffRate").textContent = current.effectiveRate.toFixed(2) + "%";
  document.getElementById("taxMonthly").textContent = fmtNPR(Math.round(current.tax/12));

  if(compareOn){
    const diff = old.tax - current.tax;
    document.getElementById("taxSavedBox").style.display = "grid";
    document.getElementById("taxSavedAmount").textContent = (diff>=0?"− ":"+ ") + fmtNPR(Math.abs(diff));
    document.getElementById("taxSavedLabel").textContent = diff>=0 ? "Less tax under FY 2083/84" : "More tax under FY 2083/84";
  } else {
    document.getElementById("taxSavedBox").style.display = "none";
  }

  const c = chartColors();

  const pieCtx = document.getElementById("taxPie");
  if(taxChartPie) taxChartPie.destroy();
  taxChartPie = new Chart(pieCtx, {
    type:"doughnut",
    data:{ labels:["Take-home", "Tax"], datasets:[{ data:[income-current.tax, current.tax], backgroundColor:[c.pine, c.crimson], borderWidth:0 }] },
    options:{ cutout:"68%", plugins:{ legend:{ position:"bottom", labels:{ color:c.ink, font:{family:c.font,size:11}, usePointStyle:true, padding:16 } } } }
  });

  const barCtx = document.getElementById("taxBar");
  if(taxChartBar) taxChartBar.destroy();
  const datasets = [{ label:"FY 2083/84 (current)", data: current.rows.map(r=>r.tax), backgroundColor:c.pine, borderRadius:6 }];
  if(compareOn) datasets.push({ label:"FY 2082/83 (old)", data: old.rows.map(r=>r.tax), backgroundColor:c.crimson, borderRadius:6 });
  const labels = (compareOn && old.rows.length > current.rows.length ? old.rows : current.rows).map(r=>r.rate+"%");
  taxChartBar = new Chart(barCtx, {
    type:"bar",
    data:{ labels, datasets },
    options:{
      plugins:{ legend:{ display:compareOn, position:"bottom", labels:{color:c.ink, font:{family:c.font,size:11}} } },
      scales:{
        x:{ grid:{display:false}, ticks:{color:c.slate, font:{family:c.font,size:10}} },
        y:{ grid:{color:c.grid}, ticks:{color:c.slate, font:{family:c.font,size:10}, callback:v=>(v/1000).toFixed(0)+"K"} }
      }
    }
  });

  const tbody = document.getElementById("taxTableBody");
  tbody.innerHTML = current.rows.map(r=>`<tr><td>${fmtNPR(r.from)} – ${r.to===Infinity?"above":fmtNPR(r.to)}</td><td>${r.rate}%</td><td>${fmtNPR(r.taxable)}</td><td>${fmtNPR(Math.round(r.tax))}</td></tr>`).join("");

  window._taxActive = current;
}

document.addEventListener("DOMContentLoaded", ()=>{
  const iRange = document.getElementById("taxIncomeRange"), iNum = document.getElementById("taxIncome");
  bindSlider(iRange, iNum, renderTax);
  document.getElementById("taxSSFExempt").addEventListener("change", renderTax);
  document.getElementById("taxCompareToggle").addEventListener("change", renderTax);

  document.getElementById("taxReset").addEventListener("click", ()=>{
    iRange.value = iNum.value = 1200000;
    document.getElementById("taxSSFExempt").checked = false;
    document.getElementById("taxCompareToggle").checked = false;
    renderTax();
    showToast(t("calc_reset_toast"), "fa-arrows-rotate");
  });

  document.getElementById("taxSave").addEventListener("click", ()=>{
    saveCalculation("tax", "Income Tax Calculator", { income: iNum.value });
    showToast(t("calc_save_toast"), "fa-bookmark");
  });

  document.getElementById("taxCopy").addEventListener("click", ()=>{
    copySummary(`Income Tax (FY 2083/84): Annual income ${fmtNPR(iNum.value)} → Tax ${fmtNPR(window._taxActive.tax)} (effective ${window._taxActive.effectiveRate.toFixed(2)}%)`);
  });

  document.getElementById("taxCSV").addEventListener("click", ()=>{
    exportCSV("income-tax-breakdown.csv", window._taxActive.rows.map(r=>({Band:`${r.from}-${r.to}`, Rate:r.rate+"%", Taxable:Math.round(r.taxable), Tax:Math.round(r.tax)})));
  });

  document.getElementById("taxPDF").addEventListener("click", downloadPDF);

  renderTax();
});
