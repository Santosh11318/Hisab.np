/* ==========================================================================
   EMI / Loan Calculator
   ========================================================================== */

function computeEMI(principal, annualRatePct, years, extraMonthly=0){
  const r = annualRatePct/100/12;
  const n = years*12;
  const emi = r === 0 ? principal/n : principal * r * Math.pow(1+r,n) / (Math.pow(1+r,n)-1);
  let balance = principal;
  const schedule = [];
  let month = 0, totalInterest = 0;
  while(balance > 0.5 && month < n + 600){
    month++;
    const interest = balance * r;
    let principalPaid = emi - interest + extraMonthly;
    if(principalPaid > balance) principalPaid = balance;
    balance -= principalPaid;
    totalInterest += interest;
    schedule.push({ month, principalPaid, interest, balance: Math.max(balance,0) });
    if(balance <= 0.5) break;
  }
  // roll into yearly rows
  const yearly = [];
  for(let y=0; y<Math.ceil(schedule.length/12); y++){
    const rows = schedule.slice(y*12, y*12+12);
    yearly.push({
      year: y+1,
      principal: Math.round(rows.reduce((s,r)=>s+r.principalPaid,0)),
      interest: Math.round(rows.reduce((s,r)=>s+r.interest,0)),
      balance: Math.round(rows[rows.length-1].balance)
    });
  }
  return { emi: Math.round(emi), totalInterest: Math.round(totalInterest), totalPayment: Math.round(principal+totalInterest), months: schedule.length, yearly, schedule };
}

let emiChartLine, emiChartPie;

function renderEMI(){
  const principal = parseFloat(document.getElementById("emiPrincipal").value) || 0;
  const rate = parseFloat(document.getElementById("emiRate").value) || 0;
  const years = parseFloat(document.getElementById("emiYears").value) || 0;
  const compareOn = document.getElementById("emiCompareToggle").checked;
  const extra = compareOn ? (parseFloat(document.getElementById("emiExtra").value) || 0) : 0;

  const base = computeEMI(principal, rate, years, 0);
  const withExtra = compareOn ? computeEMI(principal, rate, years, extra) : null;
  const active = withExtra || base;

  document.getElementById("emiAmount").textContent = fmtNPR(base.emi);
  document.getElementById("emiTotalInterest").textContent = fmtNPR(active.totalInterest);
  document.getElementById("emiTotalPayment").textContent = fmtNPR(active.totalPayment);
  const tenureLabel = document.getElementById("emiTenureOut");
  tenureLabel.textContent = (active.months/12).toFixed(1) + " yrs";

  if(compareOn){
    const monthsSaved = base.months - withExtra.months;
    const interestSaved = base.totalInterest - withExtra.totalInterest;
    document.getElementById("emiSavedBox").style.display = "grid";
    document.getElementById("emiMonthsSaved").textContent = monthsSaved + " mo";
    document.getElementById("emiInterestSaved").textContent = fmtNPR(interestSaved);
  } else {
    document.getElementById("emiSavedBox").style.display = "none";
  }

  const c = chartColors();

  const pieCtx = document.getElementById("emiPie");
  if(emiChartPie) emiChartPie.destroy();
  emiChartPie = new Chart(pieCtx, {
    type:"doughnut",
    data:{ labels:["Principal","Total interest"], datasets:[{ data:[principal, active.totalInterest], backgroundColor:[c.pine, c.crimson], borderWidth:0 }] },
    options:{ cutout:"68%", plugins:{ legend:{ position:"bottom", labels:{ color:c.ink, font:{family:c.font,size:11}, usePointStyle:true, padding:16 } } } }
  });

  const lineCtx = document.getElementById("emiLine");
  if(emiChartLine) emiChartLine.destroy();
  const datasets = [{ label:"Outstanding balance", data: base.yearly.map(y=>y.balance), borderColor:c.slate, backgroundColor:c.slate+"18", tension:.3, fill:true, pointRadius:0, borderWidth:2.5 }];
  if(compareOn) datasets.push({ label:"With prepayment", data: withExtra.yearly.map(y=>y.balance), borderColor:c.crimson, backgroundColor:c.crimson+"18", tension:.3, fill:true, pointRadius:0, borderWidth:2.5 });
  emiChartLine = new Chart(lineCtx, {
    type:"line",
    data:{ labels: base.yearly.map(y=>"Y"+y.year), datasets },
    options:{
      plugins:{ legend:{ display:compareOn, position:"bottom", labels:{color:c.ink, font:{family:c.font,size:11}} } },
      scales:{
        x:{ grid:{display:false}, ticks:{color:c.slate, font:{family:c.font,size:10}} },
        y:{ grid:{color:c.grid}, ticks:{color:c.slate, font:{family:c.font,size:10}, callback:v=>(v/100000).toFixed(0)+"L"} }
      }
    }
  });

  const tbody = document.getElementById("emiTableBody");
  tbody.innerHTML = active.yearly.map(y=>`<tr><td>${y.year}</td><td>${fmtNPR(y.principal)}</td><td>${fmtNPR(y.interest)}</td><td>${fmtNPR(y.balance)}</td></tr>`).join("");

  window._emiActive = active;
  window._emiBase = base;
}

document.addEventListener("DOMContentLoaded", ()=>{
  const pRange = document.getElementById("emiPrincipalRange"), pNum = document.getElementById("emiPrincipal");
  const rRange = document.getElementById("emiRateRange"), rNum = document.getElementById("emiRate");
  const yRange = document.getElementById("emiYearsRange"), yNum = document.getElementById("emiYears");
  const eRange = document.getElementById("emiExtraRange"), eNum = document.getElementById("emiExtra");

  bindSlider(pRange, pNum, renderEMI);
  bindSlider(rRange, rNum, renderEMI);
  bindSlider(yRange, yNum, renderEMI);
  bindSlider(eRange, eNum, renderEMI);

  document.getElementById("emiCompareToggle").addEventListener("change", e=>{
    document.getElementById("emiExtraField").style.display = e.target.checked ? "block" : "none";
    renderEMI();
  });

  document.querySelectorAll(".loan-type-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      document.querySelectorAll(".loan-type-btn").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      pRange.value = pNum.value = btn.dataset.amount;
      rRange.value = rNum.value = btn.dataset.rate;
      renderEMI();
    });
  });

  document.getElementById("emiReset").addEventListener("click", ()=>{
    pRange.value = pNum.value = 3000000;
    rRange.value = rNum.value = 9.5;
    yRange.value = yNum.value = 20;
    eRange.value = eNum.value = 5000;
    document.getElementById("emiCompareToggle").checked = false;
    document.getElementById("emiExtraField").style.display = "none";
    renderEMI();
    showToast(t("calc_reset_toast"), "fa-arrows-rotate");
  });

  document.getElementById("emiSave").addEventListener("click", ()=>{
    saveCalculation("emi", "EMI Calculator", { principal: pNum.value, rate: rNum.value, years: yNum.value });
    showToast(t("calc_save_toast"), "fa-bookmark");
  });

  document.getElementById("emiCopy").addEventListener("click", ()=>{
    copySummary(`EMI: ${fmtNPR(window._emiBase.emi)}/mo on ${fmtNPR(pNum.value)} @ ${rNum.value}% for ${yNum.value} yrs → Total interest ${fmtNPR(window._emiActive.totalInterest)}`);
  });

  document.getElementById("emiCSV").addEventListener("click", ()=>{
    exportCSV("emi-amortization.csv", window._emiActive.yearly.map(y=>({Year:y.year, Principal:y.principal, Interest:y.interest, "Balance":y.balance})));
  });

  document.getElementById("emiPDF").addEventListener("click", downloadPDF);

  renderEMI();
});
