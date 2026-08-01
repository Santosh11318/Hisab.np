/* ==========================================================================
   SIP Calculator
   ========================================================================== */

function simulateSIP(monthly, annualRatePct, years, stepUpPct=0){
  const i = annualRatePct/100/12;
  let value = 0, invested = 0, currentMonthly = monthly;
  const yearly = [];
  for(let y=1; y<=years; y++){
    for(let m=1; m<=12; m++){
      value = (value + currentMonthly) * (1+i);
      invested += currentMonthly;
    }
    yearly.push({ year:y, invested: Math.round(invested), value: Math.round(value), returns: Math.round(value-invested) });
    if(stepUpPct > 0) currentMonthly = currentMonthly * (1 + stepUpPct/100);
  }
  return { yearly, totalInvested: Math.round(invested), totalValue: Math.round(value), totalReturns: Math.round(value-invested) };
}

let sipChartLine, sipChartPie;

function renderSIP(){
  const monthly = parseFloat(document.getElementById("sipMonthly").value) || 0;
  const rate = parseFloat(document.getElementById("sipRate").value) || 0;
  const years = parseFloat(document.getElementById("sipYears").value) || 0;
  const compareOn = document.getElementById("sipCompareToggle").checked;
  const stepUp = compareOn ? (parseFloat(document.getElementById("sipStepUp").value) || 0) : 0;

  const base = simulateSIP(monthly, rate, years, 0);
  const stepped = compareOn ? simulateSIP(monthly, rate, years, stepUp) : null;
  const active = stepped || base;

  document.getElementById("sipTotalValue").textContent = fmtNPR(active.totalValue);
  document.getElementById("sipInvested").textContent = fmtNPR(active.totalInvested);
  document.getElementById("sipReturns").textContent = fmtNPR(active.totalReturns);
  document.getElementById("sipMultiple").textContent = (active.totalValue / (active.totalInvested||1)).toFixed(2) + "x";

  const c = chartColors();

  // Pie: invested vs returns
  const pieCtx = document.getElementById("sipPie");
  if(sipChartPie) sipChartPie.destroy();
  sipChartPie = new Chart(pieCtx, {
    type:"doughnut",
    data:{ labels:["Invested amount","Est. returns"], datasets:[{ data:[active.totalInvested, active.totalReturns], backgroundColor:[c.slate, c.crimson], borderWidth:0 }] },
    options:{ cutout:"68%", plugins:{ legend:{ position:"bottom", labels:{ color:c.ink, font:{family:c.font, size:11}, usePointStyle:true, padding:16 } } } }
  });

  // Line: year-wise growth (base vs stepped if compare on)
  const lineCtx = document.getElementById("sipLine");
  if(sipChartLine) sipChartLine.destroy();
  const datasets = [{
    label:"Regular SIP", data: base.yearly.map(y=>y.value), borderColor:c.pine, backgroundColor:c.pine+"22",
    tension:.35, fill:true, pointRadius:0, borderWidth:2.5
  }];
  if(compareOn){
    datasets.push({ label:"Step-up SIP", data: stepped.yearly.map(y=>y.value), borderColor:c.crimson, backgroundColor:c.crimson+"18", tension:.35, fill:true, pointRadius:0, borderWidth:2.5 });
  }
  sipChartLine = new Chart(lineCtx, {
    type:"line",
    data:{ labels: base.yearly.map(y=>"Y"+y.year), datasets },
    options:{
      plugins:{ legend:{ display: compareOn, position:"bottom", labels:{color:c.ink, font:{family:c.font,size:11}} } },
      scales:{
        x:{ grid:{display:false}, ticks:{color:c.slate, font:{family:c.font,size:10}} },
        y:{ grid:{color:c.grid}, ticks:{color:c.slate, font:{family:c.font,size:10}, callback:v=>(v/100000).toFixed(0)+"L"} }
      }
    }
  });

  // table
  const tbody = document.getElementById("sipTableBody");
  tbody.innerHTML = active.yearly.map(y=>`<tr><td>${y.year}</td><td>${fmtNPR(y.invested)}</td><td>${fmtNPR(y.returns)}</td><td>${fmtNPR(y.value)}</td></tr>`).join("");

  window._sipActive = active;
}

document.addEventListener("DOMContentLoaded", ()=>{
  const monthlyRange = document.getElementById("sipMonthlyRange");
  const monthlyNum = document.getElementById("sipMonthly");
  const rateRange = document.getElementById("sipRateRange");
  const rateNum = document.getElementById("sipRate");
  const yearsRange = document.getElementById("sipYearsRange");
  const yearsNum = document.getElementById("sipYears");
  const stepUpRange = document.getElementById("sipStepUpRange");
  const stepUpNum = document.getElementById("sipStepUp");

  bindSlider(monthlyRange, monthlyNum, renderSIP);
  bindSlider(rateRange, rateNum, renderSIP);
  bindSlider(yearsRange, yearsNum, renderSIP);
  bindSlider(stepUpRange, stepUpNum, renderSIP);

  document.getElementById("sipCompareToggle").addEventListener("change", (e)=>{
    document.getElementById("sipStepUpField").style.display = e.target.checked ? "block" : "none";
    renderSIP();
  });

  document.getElementById("sipReset").addEventListener("click", ()=>{
    monthlyRange.value = monthlyNum.value = 10000;
    rateRange.value = rateNum.value = 12;
    yearsRange.value = yearsNum.value = 15;
    stepUpRange.value = stepUpNum.value = 10;
    document.getElementById("sipCompareToggle").checked = false;
    document.getElementById("sipStepUpField").style.display = "none";
    renderSIP();
    showToast(t("calc_reset_toast"), "fa-arrows-rotate");
  });

  document.getElementById("sipSave").addEventListener("click", ()=>{
    saveCalculation("sip", "SIP Calculator", { monthly: monthlyNum.value, rate: rateNum.value, years: yearsNum.value });
    showToast(t("calc_save_toast"), "fa-bookmark");
  });

  document.getElementById("sipCopy").addEventListener("click", ()=>{
    const a = window._sipActive;
    copySummary(`SIP: Rs ${monthlyNum.value}/mo for ${yearsNum.value} yrs @ ${rateNum.value}% → Total value ${fmtNPR(a.totalValue)} (Invested ${fmtNPR(a.totalInvested)}, Returns ${fmtNPR(a.totalReturns)})`);
  });

  document.getElementById("sipCSV").addEventListener("click", ()=>{
    exportCSV("sip-breakdown.csv", window._sipActive.yearly.map(y=>({Year:y.year, Invested:y.invested, Returns:y.returns, "Total Value":y.value})));
  });

  document.getElementById("sipPDF").addEventListener("click", downloadPDF);

  renderSIP();
});
