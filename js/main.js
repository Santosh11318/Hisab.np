/* ==========================================================================
   HISAAB.NP — shared site behaviour
   ========================================================================== */

/* ---------- theme ---------- */
function applyTheme(){
  const theme = localStorage.getItem(HISAAB_THEME_KEY) || "light";
  document.documentElement.setAttribute("data-theme", theme);
  document.querySelectorAll(".theme-btn i").forEach(i=>{
    i.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  });
}
function toggleTheme(){
  const cur = localStorage.getItem(HISAAB_THEME_KEY) || "light";
  localStorage.setItem(HISAAB_THEME_KEY, cur === "light" ? "dark" : "light");
  applyTheme();
}

/* ---------- toast ---------- */
let toastTimer;
function showToast(msg, icon="fa-circle-check"){
  let el = document.querySelector(".toast");
  if(!el){
    el = document.createElement("div");
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.innerHTML = `<i class="fa-solid ${icon}"></i><span>${msg}</span>`;
  requestAnimationFrame(()=> el.classList.add("show"));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> el.classList.remove("show"), 2600);
}

/* ---------- scroll reveal (AOS-lite, no dependency needed) ---------- */
function initReveal(){
  const items = document.querySelectorAll("[data-aos]");
  if(!("IntersectionObserver" in window)){
    items.forEach(el=>el.classList.add("aos-animate"));
    return;
  }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("aos-animate");
        io.unobserve(entry.target);
      }
    });
  },{threshold:.15});
  items.forEach(el=>io.observe(el));
}

/* ---------- back to top ---------- */
function initBackTop(){
  const btn = document.querySelector(".back-top");
  if(!btn) return;
  window.addEventListener("scroll", ()=>{
    btn.classList.toggle("show", window.scrollY > 640);
  });
  btn.addEventListener("click", ()=> window.scrollTo({top:0, behavior:"smooth"}));
}

/* ---------- FAQ accordion ---------- */
function initFAQ(){
  document.querySelectorAll(".faq-item").forEach(item=>{
    const q = item.querySelector(".faq-q");
    const a = item.querySelector(".faq-a");
    q.addEventListener("click", ()=>{
      const isOpen = item.classList.contains("open");
      item.closest(".faq-list").querySelectorAll(".faq-item").forEach(other=>{
        other.classList.remove("open");
        other.querySelector(".faq-a").style.maxHeight = null;
      });
      if(!isOpen){
        item.classList.add("open");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });
}

/* ---------- animated counters ---------- */
function animateNumber(el, target, opts={}){
  const { duration = 900, prefix = "", suffix = "", decimals = 0 } = opts;
  const start = parseFloat(el.dataset.raw || "0") || 0;
  const startTime = performance.now();
  function tick(now){
    const p = Math.min(1, (now - startTime) / duration);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = start + (target - start) * eased;
    el.textContent = prefix + val.toLocaleString("en-IN", {maximumFractionDigits:decimals, minimumFractionDigits:decimals}) + suffix;
    if(p < 1) requestAnimationFrame(tick);
    else el.dataset.raw = target;
  }
  requestAnimationFrame(tick);
}

/* ---------- site search ---------- */
const CALCULATOR_INDEX = [
  {name:"SIP Calculator", cat:"Investment", url:"calculators/sip-calculator.html"},
  {name:"Loan EMI Calculator (Home / Car / Personal / Education / Gold)", cat:"Loan", url:"calculators/emi-calculator.html"},
  {name:"Income Tax Calculator", cat:"Tax", url:"calculators/income-tax-calculator.html"},
  {name:"Retirement Corpus Calculator", cat:"Retirement", url:"calculators/retirement-calculator.html"},
  {name:"Step-up SIP Calculator", cat:"Investment", url:"calculators/step-up-sip-calculator.html"},
  {name:"Lumpsum Calculator", cat:"Investment", url:"calculators/lumpsum-calculator.html"},
  {name:"SWP Calculator", cat:"Investment", url:"calculators/swp-calculator.html"},
  {name:"CAGR Calculator", cat:"Investment", url:"calculators/cagr-calculator.html"},
  {name:"ROI Calculator", cat:"Investment", url:"calculators/roi-calculator.html"},
  {name:"XIRR Calculator", cat:"Investment", url:"calculators/xirr-calculator.html"},
  {name:"Cost of Delay Calculator", cat:"Investment", url:"calculators/cost-of-delay-calculator.html"},
  {name:"Crorepati Calculator", cat:"Investment", url:"calculators/crorepati-calculator.html"},
  {name:"Goal SIP Calculator", cat:"Investment", url:"calculators/goal-sip-calculator.html"},
  {name:"Future Value Calculator", cat:"Investment", url:"calculators/future-value-calculator.html"},
  {name:"Present Value Calculator", cat:"Investment", url:"calculators/present-value-calculator.html"},
  {name:"Compound Interest Calculator", cat:"Investment", url:"calculators/compound-interest-calculator.html"},
  {name:"Simple Interest Calculator", cat:"Investment", url:"calculators/simple-interest-calculator.html"},
  {name:"Loan Eligibility Calculator", cat:"Loan", url:"calculators/loan-eligibility-calculator.html"},
  {name:"Loan Prepayment Calculator", cat:"Loan", url:"calculators/loan-prepayment-calculator.html"},
  {name:"Loan Foreclosure Calculator", cat:"Loan", url:"calculators/loan-foreclosure-calculator.html"},
  {name:"Balance Transfer Calculator", cat:"Loan", url:"calculators/balance-transfer-calculator.html"},
  {name:"Credit Card EMI Calculator", cat:"Loan", url:"calculators/credit-card-emi-calculator.html"},
  {name:"Debt Payoff Calculator", cat:"Loan", url:"calculators/debt-payoff-calculator.html"},
  {name:"Credit Card Payoff Calculator", cat:"Loan", url:"calculators/credit-card-payoff-calculator.html"},
  {name:"GST / Indirect Tax Calculator", cat:"Business", url:"calculators/gst-calculator.html"},
  {name:"VAT Calculator", cat:"Business", url:"calculators/vat-calculator.html"},
  {name:"Profit Margin Calculator", cat:"Business", url:"calculators/profit-margin-calculator.html"},
  {name:"Markup Calculator", cat:"Business", url:"calculators/markup-calculator.html"},
  {name:"Break-even Calculator", cat:"Business", url:"calculators/break-even-calculator.html"},
  {name:"Inventory Turnover Calculator", cat:"Business", url:"calculators/inventory-calculator.html"},
  {name:"Sales Target Calculator", cat:"Business", url:"calculators/sales-target-calculator.html"},
  {name:"Business Growth Calculator", cat:"Business", url:"calculators/business-growth-calculator.html"},
  {name:"Working Capital Calculator", cat:"Business", url:"calculators/working-capital-calculator.html"},
  {name:"Cash Flow Calculator", cat:"Business", url:"calculators/cash-flow-calculator.html"},
  {name:"Tax Saving Calculator", cat:"Tax", url:"calculators/tax-saving-calculator.html"},
  {name:"Salary Tax Calculator", cat:"Tax", url:"calculators/salary-tax-calculator.html"},
  {name:"Capital Gain Tax Calculator", cat:"Tax", url:"calculators/capital-gain-calculator.html"},
  {name:"Inflation Calculator", cat:"Tax", url:"calculators/inflation-calculator.html"},
  {name:"Purchasing Power Calculator", cat:"Tax", url:"calculators/purchasing-power-calculator.html"},
  {name:"Real Return Calculator", cat:"Tax", url:"calculators/real-return-calculator.html"},
  {name:"Pension Calculator", cat:"Retirement", url:"calculators/pension-calculator.html"},
  {name:"Emergency Fund Calculator", cat:"Retirement", url:"calculators/emergency-fund-calculator.html"},
  {name:"FIRE Calculator", cat:"Retirement", url:"calculators/fire-calculator.html"},
  {name:"Child Education Goal Calculator", cat:"Retirement", url:"calculators/child-education-calculator.html"},
  {name:"Marriage Goal Calculator", cat:"Retirement", url:"calculators/marriage-goal-calculator.html"},
  {name:"Dream House Goal Calculator", cat:"Retirement", url:"calculators/dream-house-goal-calculator.html"},
  {name:"Vacation Goal Calculator", cat:"Retirement", url:"calculators/vacation-goal-calculator.html"},
  {name:"NEPSE Brokerage Calculator", cat:"Trading", url:"calculators/brokerage-calculator.html"},
  {name:"Risk Reward Calculator", cat:"Trading", url:"calculators/risk-reward-calculator.html"},
  {name:"Position Size Calculator", cat:"Trading", url:"calculators/position-size-calculator.html"},
  {name:"Stop Loss Calculator", cat:"Trading", url:"calculators/stop-loss-calculator.html"},
  {name:"Profit Loss Calculator", cat:"Trading", url:"calculators/profit-loss-calculator.html"},
  {name:"Average Price Calculator", cat:"Trading", url:"calculators/average-price-calculator.html"},
  {name:"Option Profit Calculator", cat:"Trading", url:"calculators/option-profit-calculator.html"},
  {name:"Stock Return Calculator", cat:"Trading", url:"calculators/stock-return-calculator.html"},
  {name:"Dividend Yield Calculator", cat:"Trading", url:"calculators/dividend-yield-calculator.html"},
];

function initSearch(inputSel, resultsSel){
  const input = document.querySelector(inputSel);
  const results = document.querySelector(resultsSel);
  if(!input || !results) return;
  function render(list){
    if(!list.length){ results.classList.remove("open"); results.innerHTML=""; return; }
    results.innerHTML = list.slice(0,7).map(c=>`<a href="${c.url}">${c.name}<span>${c.cat}</span></a>`).join("");
    results.classList.add("open");
  }
  input.addEventListener("input", ()=>{
    const q = input.value.trim().toLowerCase();
    if(!q){ render([]); return; }
    render(CALCULATOR_INDEX.filter(c=> c.name.toLowerCase().includes(q) || c.cat.toLowerCase().includes(q)));
  });
  document.addEventListener("click", (e)=>{
    if(!e.target.closest(inputSel) && !e.target.closest(resultsSel)) results.classList.remove("open");
  });
}

/* ---------- mobile nav ---------- */
function initMobileNav(){
  const toggle = document.querySelector(".nav-toggle");
  const panel = document.querySelector(".mobile-nav");
  if(!toggle || !panel) return;
  toggle.addEventListener("click", ()=>{
    panel.classList.toggle("open");
    toggle.querySelector("i").className = panel.classList.contains("open") ? "fa-solid fa-xmark" : "fa-solid fa-bars";
  });
  panel.querySelectorAll("a").forEach(a=> a.addEventListener("click", ()=>{
    panel.classList.remove("open");
    toggle.querySelector("i").className = "fa-solid fa-bars";
  }));
}

/* ---------- init ---------- */
document.addEventListener("DOMContentLoaded", ()=>{
  applyTheme();
  initReveal();
  initBackTop();
  initFAQ();
  initMobileNav();
  document.querySelectorAll(".theme-btn").forEach(b=> b.addEventListener("click", toggleTheme));
  document.querySelectorAll(".lang-btn").forEach(b=> b.addEventListener("click", ()=> setLang(b.dataset.lang)));
  initSearch(".hero-search input", ".hero-search .search-results");
  initSearch(".nav-search input", ".nav-search .search-results");

  document.querySelectorAll(".hero-search form, .nav-search form").forEach(f=>{
    f.addEventListener("submit", e=>{
      e.preventDefault();
      const first = f.parentElement.querySelector(".search-results a");
      if(first) window.location.href = first.getAttribute("href");
    });
  });

  document.querySelectorAll("[data-copy-share]").forEach(btn=>{
    btn.addEventListener("click", async ()=>{
      const url = window.location.href;
      if(navigator.share){
        try{ await navigator.share({title: document.title, url}); return; }catch(e){ /* fall through to copy */ }
      }
      try{
        await navigator.clipboard.writeText(url);
        showToast(t("calc_share_toast"), "fa-link");
      }catch(e){ showToast(url); }
    });
  });
});
