/* ==========================================================================
   HISAAB.NP — generic calculator engine
   Every batch-generated calculator page defines `window.CALC = {...}` inline,
   then this file renders the inputs, runs CALC.compute(), and wires up the
   result card, chart, table (if any), and the save/copy/csv/pdf actions.
   ========================================================================== */

function fmtVal(v, format){
  switch(format){
    case "npr": return fmtNPR(v);
    case "percent": return (typeof v === "number" ? v.toFixed(2) : v) + "%";
    case "ratio": return (typeof v === "number" ? v.toFixed(2) : v) + "x";
    case "number": return fmtNum(v);
    case "months": return fmtNum(v) + " mo";
    case "years": return (typeof v === "number" ? v.toFixed(1) : v) + " yrs";
    default: return v;
  }
}

let genChart;

function renderGeneric(){
  const inputs = {};
  window.CALC.fields.forEach(f=>{
    inputs[f.id] = parseFloat(document.getElementById(f.id).value) || 0;
  });

  const out = window.CALC.compute(inputs);

  document.getElementById("genPrimaryLabel").textContent = out.primary.label;
  document.getElementById("genPrimaryValue").textContent = fmtVal(out.primary.value, out.primary.format);
  document.getElementById("genSub").textContent = out.note || window.CALC.resultNote || "";

  const grid = document.getElementById("genSecondaryGrid");
  grid.innerHTML = (out.secondary || []).map(s=>`<div><b>${fmtVal(s.value, s.format)}</b><span>${s.label}</span></div>`).join("");

  if(out.chart){
    const c = chartColors();
    const palette = [c.pine, c.crimson, c.marigold, c.slate];
    const ctx = document.getElementById("genChart");
    if(genChart) genChart.destroy();
    if(out.chart.type === "pie"){
      genChart = new Chart(ctx, {
        type:"doughnut",
        data:{ labels:out.chart.labels, datasets:[{ data:out.chart.data, backgroundColor:palette, borderWidth:0 }] },
        options:{ cutout:"68%", plugins:{ legend:{ position:"bottom", labels:{ color:c.ink, font:{family:c.font,size:11}, usePointStyle:true, padding:16 } } } }
      });
    } else {
      genChart = new Chart(ctx, {
        type:"bar",
        data:{ labels:out.chart.labels, datasets:[{ data:out.chart.data, backgroundColor:c.pine, borderRadius:6 }] },
        options:{
          plugins:{ legend:{ display:false } },
          scales:{ x:{ grid:{display:false}, ticks:{color:c.slate, font:{family:c.font,size:10}} }, y:{ grid:{color:c.grid}, ticks:{color:c.slate, font:{family:c.font,size:10}} } }
        }
      });
    }
  }

  window._genOut = out;
  window._genInputs = inputs;
}

function buildGenericFields(){
  const wrap = document.getElementById("genFields");
  wrap.innerHTML = window.CALC.fields.map(f=>`
    <div class="field">
      <div class="field-top"><label>${f.label}</label></div>
      <div class="field-input"><span>${f.unit}</span><input type="number" id="${f.id}" value="${f.default}" min="${f.min}" max="${f.max}" step="${f.step}"></div>
      <input type="range" id="${f.id}Range" min="${f.min}" max="${f.max}" step="${f.step}" value="${f.default}">
    </div>
  `).join("");

  window.CALC.fields.forEach(f=>{
    bindSlider(document.getElementById(f.id+"Range"), document.getElementById(f.id), renderGeneric);
  });
}

document.addEventListener("DOMContentLoaded", ()=>{
  buildGenericFields();
  renderGeneric();

  document.getElementById("genReset").addEventListener("click", ()=>{
    window.CALC.fields.forEach(f=>{
      document.getElementById(f.id).value = f.default;
      document.getElementById(f.id+"Range").value = f.default;
    });
    renderGeneric();
    showToast(t("calc_reset_toast"), "fa-arrows-rotate");
  });

  document.getElementById("genSave").addEventListener("click", ()=>{
    saveCalculation(window.CALC.slug, window.CALC.title, window._genInputs);
    showToast(t("calc_save_toast"), "fa-bookmark");
  });

  document.getElementById("genCopy").addEventListener("click", ()=>{
    const out = window._genOut;
    const parts = [`${out.primary.label}: ${fmtVal(out.primary.value, out.primary.format)}`]
      .concat((out.secondary||[]).map(s=>`${s.label}: ${fmtVal(s.value, s.format)}`));
    copySummary(`${window.CALC.title} — ${parts.join(", ")}`);
  });

  document.getElementById("genCSV").addEventListener("click", ()=>{
    const out = window._genOut;
    const row = { [out.primary.label]: out.primary.value };
    (out.secondary||[]).forEach(s=> row[s.label] = s.value);
    exportCSV(window.CALC.slug + ".csv", [row]);
  });

  document.getElementById("genPDF").addEventListener("click", downloadPDF);
});
