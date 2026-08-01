/* ==========================================================================
   HISAAB.NP — i18n engine
   Usage: give any element data-i18n="key". For placeholders use
   data-i18n-ph="key". Page scripts may extend window.I18N with page-specific
   keys before DOMContentLoaded finishes (see calculators/*.html).
   ========================================================================== */

window.I18N = {
  brand_tag:        { en: "Nepal's Financial Calculators", np: "नेपालको वित्तीय क्यालकुलेटर संग्रह" },
  nav_investment:   { en: "Investment", np: "लगानी" },
  nav_loan:         { en: "Loan", np: "ऋण" },
  nav_tax:          { en: "Tax", np: "कर" },
  nav_business:     { en: "Business", np: "व्यवसाय" },
  nav_retirement:   { en: "Retirement", np: "अवकाश" },
  nav_trading:      { en: "Trading", np: "ट्रेडिङ" },
  nav_blog:         { en: "Guides", np: "मार्गदर्शन" },
  nav_mega_popular: { en: "Popular", np: "लोकप्रिय" },
  nav_mega_all:     { en: "All calculators", np: "सबै क्यालकुलेटर" },
  theme_toggle:     { en: "Toggle theme", np: "थिम बदल्नुहोस्" },
  search_ph:        { en: "Search 40+ calculators — SIP, EMI, tax…", np: "४०+ क्यालकुलेटर खोज्नुहोस् — SIP, EMI, कर…" },

  hero_eyebrow:     { en: "Made for Nepal, Rupee-first", np: "नेपालका लागि, रुपैयाँ-केन्द्रित" },
  hero_h1_1:        { en: "Every rupee decision,", np: "हरेक रुपैयाँको निर्णय," },
  hero_h1_2:        { en: "calculated clearly.", np: "स्पष्ट हिसाबका साथ।" },
  hero_lede:        { en: "Hisaab.np brings together 40+ free calculators for SIP, EMI, tax, retirement, business and trading — built for Nepal's currency, tax slabs and financial habits.", np: "Hisaab.np ले SIP, EMI, कर, अवकाश, व्यवसाय र ट्रेडिङका लागि ४०+ नि:शुल्क क्यालकुलेटर एकै ठाउँमा ल्याउँछ — नेपालको मुद्रा, कर स्तर र वित्तीय बानीलाई ध्यानमा राखेर बनाइएको।" },
  hero_cta_primary: { en: "Start with SIP Calculator", np: "SIP क्यालकुलेटरबाट सुरु गर्नुहोस्" },
  hero_cta_ghost:   { en: "Browse all calculators", np: "सबै क्यालकुलेटर हेर्नुहोस्" },
  hero_stat1_n:     { en: "56+", np: "५६+" },
  hero_stat1_l:     { en: "Calculators", np: "क्यालकुलेटरहरू" },
  hero_stat2_n:     { en: "6", np: "६" },
  hero_stat2_l:     { en: "Categories", np: "श्रेणीहरू" },
  hero_stat3_n:     { en: "NPR", np: "रु." },
  hero_stat3_l:     { en: "Native currency", np: "मूल मुद्रा" },
  hero_popular_lbl: { en: "Trending now", np: "अहिले चलिरहेको" },

  cat_eyebrow:      { en: "Six categories, one destination", np: "छ श्रेणी, एउटै गन्तव्य" },
  cat_h2:           { en: "Find the right calculator", np: "सही क्यालकुलेटर फेला पार्नुहोस्" },
  cat_p:            { en: "Every calculator is built with Nepal's tax rules, loan practices and market conventions in mind.", np: "हरेक क्यालकुलेटर नेपालको कर नियम, ऋण अभ्यास र बजार चलनलाई ध्यानमा राखेर बनाइएको हो।" },
  cat_investment_d: { en: "SIP, lumpsum, SWP, CAGR, XIRR and 8 more.", np: "SIP, लम्पसम, SWP, CAGR, XIRR लगायत थप ८।" },
  cat_loan_d:       { en: "EMI, eligibility, prepayment, balance transfer.", np: "EMI, योग्यता, पूर्व-भुक्तानी, ब्यालेन्स ट्रान्सफर।" },
  cat_tax_d:        { en: "Income tax, salary tax, capital gain.", np: "आयकर, तलब कर, पूँजीगत लाभ।" },
  cat_business_d:   { en: "GST, VAT, break-even, cash flow.", np: "जीएसटी, भ्याट, ब्रेक-इभन, नगद प्रवाह।" },
  cat_retirement_d: { en: "Corpus, pension, FIRE, goal planning.", np: "कोष, पेन्सन, FIRE, लक्ष्य योजना।" },
  cat_trading_d:    { en: "Brokerage, risk-reward, position size.", np: "ब्रोकरेज, जोखिम-प्रतिफल, पोजिसन साइज।" },
  cat_link:         { en: "calculators", np: "क्यालकुलेटर" },

  feat_eyebrow:     { en: "Freshly built", np: "भर्खरै बनेको" },
  feat_h2:          { en: "Flagship calculators", np: "प्रमुख क्यालकुलेटरहरू" },
  feat_p:           { en: "Start here — the four most-used tools, fully interactive with charts and PDF export.", np: "यहीँबाट सुरु गर्नुहोस् — सबैभन्दा धेरै प्रयोग हुने चार उपकरण, चार्ट र PDF एक्सपोर्टसहित।" },

  tips_eyebrow:     { en: "Trusted by 12,000+ users", np: "१२,०००+ प्रयोगकर्ताको भरोसा" },
  tips_h2:          { en: "What people say", np: "प्रयोगकर्ताहरूको भनाइ" },

  faq_eyebrow:      { en: "Good to know", np: "जान्नु राम्रो" },
  faq_h2:           { en: "Frequently asked", np: "बारम्बार सोधिने प्रश्न" },

  news_h2:          { en: "One rupee-smart tip a week", np: "हप्ताको एउटा रुपैयाँ-चतुर सुझाव" },
  news_p:           { en: "Short, practical notes on saving, investing and taxes in Nepal. No spam, unsubscribe anytime.", np: "नेपालमा बचत, लगानी र करका बारे छोटो र व्यावहारिक जानकारी। स्प्याम छैन, जुनसुकै बेला अनसब्स्क्राइब गर्न सकिन्छ।" },
  news_ph:          { en: "you@email.com", np: "you@email.com" },
  news_btn:         { en: "Subscribe", np: "सब्स्क्राइब गर्नुहोस्" },

  foot_desc:        { en: "Nepal's largest collection of financial calculators — investment, loan, tax, business, retirement and trading, in one place.", np: "नेपालको सबैभन्दा ठूलो वित्तीय क्यालकुलेटर संग्रह — लगानी, ऋण, कर, व्यवसाय, अवकाश र ट्रेडिङ, एकै ठाउँमा।" },
  foot_calc:        { en: "Calculators", np: "क्यालकुलेटर" },
  foot_company:     { en: "Company", np: "कम्पनी" },
  foot_about:       { en: "About us", np: "हाम्रो बारेमा" },
  foot_contact:     { en: "Contact", np: "सम्पर्क" },
  foot_blog:        { en: "Blog", np: "ब्लग" },
  foot_faq:         { en: "FAQ", np: "प्रश्नोत्तर" },
  foot_legal:       { en: "Legal", np: "कानुनी" },
  foot_privacy:     { en: "Privacy policy", np: "गोपनीयता नीति" },
  foot_terms:       { en: "Terms of use", np: "प्रयोगका सर्तहरू" },
  foot_disclaimer:  { en: "Disclaimer", np: "अस्वीकरण" },
  foot_resources:   { en: "Resources", np: "स्रोतहरू" },
  foot_sip_guide:   { en: "SIP guide", np: "SIP मार्गदर्शन" },
  foot_loan_guide:  { en: "Loan guide", np: "ऋण मार्गदर्शन" },
  foot_tax_guide:   { en: "Tax guide", np: "कर मार्गदर्शन" },
  foot_rights:      { en: "© 2026 Hisaab.np — All calculations are estimates, not financial advice.", np: "© २०२६ Hisaab.np — सबै गणना अनुमानित हुन्, वित्तीय सल्लाह होइन।" },

  breadcrumb_home:  { en: "Home", np: "गृहपृष्ठ" },

  /* ---- shared calculator UI ---- */
  calc_inputs:      { en: "Your inputs", np: "तपाईंको विवरण" },
  calc_result:      { en: "Result", np: "नतिजा" },
  calc_reset:       { en: "Reset", np: "रिसेट" },
  calc_save:        { en: "Save", np: "सेभ" },
  calc_share:       { en: "Share", np: "सेयर" },
  calc_copy:        { en: "Copy", np: "कपी" },
  calc_pdf:         { en: "Download PDF", np: "PDF डाउनलोड" },
  calc_csv:         { en: "Export CSV", np: "CSV एक्सपोर्ट" },
  calc_print:       { en: "Print", np: "प्रिन्ट" },
  calc_compare:     { en: "Compare scenario", np: "तुलना गर्नुहोस्" },
  calc_monthly:     { en: "Monthly", np: "मासिक" },
  calc_yearly:      { en: "Yearly", np: "वार्षिक" },
  calc_breakdown:   { en: "Yearly breakdown", np: "वार्षिक विवरण" },
  calc_formula_t:   { en: "Formula used", np: "प्रयोग गरिएको सूत्र" },
  calc_explain_t:   { en: "How it works", np: "यसले कसरी काम गर्छ" },
  calc_adv_t:       { en: "Why it helps", np: "किन उपयोगी छ" },
  calc_example_t:   { en: "Worked example", np: "उदाहरण" },
  calc_faq_t:       { en: "FAQs", np: "प्रश्नोत्तर" },
  calc_related_t:   { en: "Related calculators", np: "सम्बन्धित क्यालकुलेटर" },
  calc_share_toast: { en: "Link copied to clipboard", np: "लिङ्क क्लिपबोर्डमा कपी भयो" },
  calc_save_toast:  { en: "Calculation saved", np: "गणना सेभ भयो" },
  calc_copy_toast:  { en: "Result copied", np: "नतिजा कपी भयो" },
  calc_reset_toast: { en: "Inputs reset", np: "इनपुट रिसेट भयो" },
};

const HISAAB_LANG_KEY = "hisaab_lang";
const HISAAB_THEME_KEY = "hisaab_theme";

function applyI18n(){
  const lang = localStorage.getItem(HISAAB_LANG_KEY) || "en";
  document.documentElement.setAttribute("lang-mode", lang);
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.getAttribute("data-i18n");
    const entry = window.I18N[key];
    if(entry && entry[lang]) el.textContent = entry[lang];
  });
  document.querySelectorAll("[data-i18n-ph]").forEach(el=>{
    const key = el.getAttribute("data-i18n-ph");
    const entry = window.I18N[key];
    if(entry && entry[lang]) el.setAttribute("placeholder", entry[lang]);
  });
  document.querySelectorAll(".lang-btn").forEach(b=>{
    b.classList.toggle("active", b.dataset.lang === lang);
  });
}

function setLang(lang){
  localStorage.setItem(HISAAB_LANG_KEY, lang);
  applyI18n();
}

function t(key){
  const lang = localStorage.getItem(HISAAB_LANG_KEY) || "en";
  const entry = window.I18N[key];
  return entry ? (entry[lang] || entry.en) : key;
}

document.addEventListener("DOMContentLoaded", applyI18n);
