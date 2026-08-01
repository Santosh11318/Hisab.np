/* ==========================================================================
   Retirement Corpus Calculator
   ========================================================================== */

function computeRetirement(params){
  const { currentAge, retireAge, lifeExpectancy, monthlyExpense, inflation, preReturn, postReturn, existingSavings=0 } = params;
  const yearsToRetire = Math.max(retireAge - currentAge, 0);
  const yearsInRetirement = Math.max(lifeExpectancy - retireAge, 1);

  const futureMonthlyExpense = monthlyExpense * Math.pow(1+inflation/100, yearsToRetire);

  // real monthly rate during retirement (post-retirement return vs inflation)
  const realAnnual = ((1+postReturn/100)/(1+inflation/100)) - 1;
  const realMonthly = Math.pow(1+realAnnual, 1/12) - 1;
  const nMonthsRetire = yearsInRetirement*12;
  let corpus;
  if(Math.abs(realMonthly) < 1e-9){
    corpus = futureMonthlyExpense * nMonthsRetire;
  } else {
    corpus = futureMonthlyExpense * (1 - Math.pow(1+realMonthly, -nMonthsRetire)) / realMonthly;
  }

  // future value of existing savings by retirement
  const fvExisting = existingSavings * Math.pow(1+preReturn/100, yearsToRetire);
  const netCorpusNeeded = Math.max(corpus - fvExisting, 0);

  // required monthly SIP to hit netCorpusNeeded over yearsToRetire at preReturn
  const i = preReturn/100/12;
  const nMonthsAccum = yearsToRetire*12;
  let requiredSIP = 0;
  if(nMonthsAccum > 0){
    const factor = ((Math.pow(1+i, nMonthsAccum)-1)/i) * (1+i);
    requiredSIP = netCorpusNeeded / factor;
  }

  // yearly projection of corpus building (for chart)
  const yearly = [];
  let value = existingSavings;
  let sip = requiredSIP;
  for(let y=1; y<=yearsToRetire; y++){
    for(let m=1; m<=12; m++){ value = (value + sip) * (1+i); }
    yearly.push({ year:y, age: currentAge+y, value: Math.round(value) });
  }

  return { yearsToRetire, yearsInRetirement, futureMonthlyExpense: Math.round(futureMonthlyExpense), corpus: Math.round(corpus), fvExisting: Math.round(fvExisting), netCorpusNeeded: Math.round(netCorpusNeeded), requiredSIP: Math.round(requiredSIP), yearly };
}

let retChartLine, retChartPie;

function renderRetirement(){
  const currentAge = parseFloat(document.getElementById("retCurrentAge").value) || 25;
  const retireAge = parseFloat(document.getElementById("retRetireAge").value) || 60;
  const lifeExpectancy = parseFloat(document.getElementById("retLifeExp").value) || 80;
  const monthlyExpense = parseFloat(document.getElementById("retExpense").value) || 0;
  const inflation = parseFloat(document.getElementById("retInflation").value) || 0;
  const preReturn = parseFloat(document.getElementById("retPreReturn").value) || 0;
  const postReturn = parseFloat(document.getElementById("retPostReturn").value) || 0;
  const compareOn = document.getElementById("retCompareToggle").checked;
  const existing = compareOn ? (parseFloat(document.getElementById("retExisting").value) || 0) : 0;

  const withoutExisting = computeRetirement({currentAge, retireAge, lifeExpectancy, monthlyExpense, inflation, preReturn, postReturn, existingSavings:0});
  const withExisting = compareOn ? computeRetirement({currentAge, retireAge, lifeExpectancy, monthlyExpense, inflation, preReturn, postReturn, existingSavings:existing}) : null;
  const active = withExisting || withoutExisting;

  document.getElementById("retCorpus").textContent = fmtNPR(active.corpus);
  document.getElementById("retMonthlySIP").textContent = fmtNPR(active.requiredSIP);
  document.getElementById("retFutureExpense").textContent = fmtNPR(active.futureMonthlyExpense);
  document.getElementById("retYearsLeft").textContent = active.yearsToRetire + " yrs";

  if(compareOn){
    document.getElementById("retSavedBox").style.display = "grid";
    document.getElementById("retSIPReduced").textContent = fmtNPR(withoutExisting.requiredSIP - withExisting.requiredSIP);
  } else {
    document.getElementById("retSavedBox").style.display = "none";
  }

  const c = chartColors();

  const pieCtx = document.getElementById("retPie");
  if(retChartPie) retChartPie.destroy();
  retChartPie = new Chart(pieCtx, {
    type:"doughnut",
    data:{ labels:["Your contributions (SIP)","Growth"], datasets:[{ data:[active.requiredSIP*active.yearsToRetire*12, Math.max(active.corpus-active.fvExisting-(active.requiredSIP*active.yearsToRetire*12),0)], backgroundColor:[c.slate, c.pine], borderWidth:0 }] },
    options:{ cutout:"68%", plugins:{ legend:{ position:"bottom", labels:{ color:c.ink, font:{family:c.font,size:11}, usePointStyle:true, padding:16 } } } }
  });

  const lineCtx = document.getElementById("retLine");
  if(retChartLine) retChartLine.destroy();
  const datasets = [{ label:"Corpus growth", data: withoutExisting.yearly.map(y=>y.value), borderColor:c.pine, backgroundColor:c.pine+"22", tension:.35, fill:true, pointRadius:0, borderWidth:2.5 }];
  if(compareOn) datasets.push({ label:"With existing savings", data: withExisting.yearly.map(y=>y.value), borderColor:c.crimson, backgroundColor:c.crimson+"18", tension:.35, fill:true, pointRadius:0, borderWidth:2.5 });
  retChartLine = new Chart(lineCtx, {
    type:"line",
    data:{ labels: withoutExisting.yearly.map(y=>"Age "+y.age), datasets },
    options:{
      plugins:{ legend:{ display:compareOn, position:"bottom", labels:{color:c.ink, font:{family:c.font,size:11}} } },
      scales:{
        x:{ grid:{display:false}, ticks:{color:c.slate, font:{family:c.font,size:10}, maxTicksLimit:8} },
        y:{ grid:{color:c.grid}, ticks:{color:c.slate, font:{family:c.font,size:10}, callback:v=>(v/100000).toFixed(0)+"L"} }
      }
    }
  });

  const tbody = document.getElementById("retTableBody");
  tbody.innerHTML = active.yearly.filter((y,idx)=> idx % Math.ceil(active.yearly.length/12 || 1) === 0 || idx===active.yearly.length-1).map(y=>`<tr><td>${y.year}</td><td>${y.age}</td><td>${fmtNPR(y.value)}</td></tr>`).join("");

  window._retActive = active;
}

document.addEventListener("DOMContentLoaded", ()=>{
  const bind = (rangeId, numId) => bindSlider(document.getElementById(rangeId), document.getElementById(numId), renderRetirement);
  bind("retCurrentAgeRange","retCurrentAge");
  bind("retRetireAgeRange","retRetireAge");
  bind("retLifeExpRange","retLifeExp");
  bind("retExpenseRange","retExpense");
  bind("retInflationRange","retInflation");
  bind("retPreReturnRange","retPreReturn");
  bind("retPostReturnRange","retPostReturn");
  bind("retExistingRange","retExisting");

  document.getElementById("retCompareToggle").addEventListener("change", e=>{
    document.getElementById("retExistingField").style.display = e.target.checked ? "block" : "none";
    renderRetirement();
  });

  document.getElementById("retReset").addEventListener("click", ()=>{
    const defaults = { retCurrentAge:28, retRetireAge:60, retLifeExp:80, retExpense:40000, retInflation:7, retPreReturn:11, retPostReturn:8, retExisting:500000 };
    Object.entries(defaults).forEach(([id,val])=>{
      document.getElementById(id).value = val;
      const r = document.getElementById(id+"Range");
      if(r) r.value = val;
    });
    document.getElementById("retCompareToggle").checked = false;
    document.getElementById("retExistingField").style.display = "none";
    renderRetirement();
    showToast(t("calc_reset_toast"), "fa-arrows-rotate");
  });

  document.getElementById("retSave").addEventListener("click", ()=>{
    saveCalculation("retirement", "Retirement Calculator", { currentAge: document.getElementById("retCurrentAge").value });
    showToast(t("calc_save_toast"), "fa-bookmark");
  });

  document.getElementById("retCopy").addEventListener("click", ()=>{
    const a = window._retActive;
    copySummary(`Retirement plan: Corpus needed ${fmtNPR(a.corpus)}, required monthly SIP ${fmtNPR(a.requiredSIP)} for ${a.yearsToRetire} years.`);
  });

  document.getElementById("retCSV").addEventListener("click", ()=>{
    exportCSV("retirement-projection.csv", window._retActive.yearly.map(y=>({Year:y.year, Age:y.age, "Projected Corpus":y.value})));
  });

  document.getElementById("retPDF").addEventListener("click", downloadPDF);

  renderRetirement();
});
