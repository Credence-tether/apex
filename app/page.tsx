"use client";

import { useState, useEffect } from "react";
import { useLocale } from "../lib/locale-context";

type APYResult = {
  balance: number;
  apy_percentage: number;
  weekly_yield: number;
  daily_yield: number;
  projected_annual: number;
};

const PLANS = [
  {
    name: "Stable-Tier Entry",
    nameDe: "Einstiegsplan",
    min: "From $300",
    apy: "5.2%",
    apyNum: 5.2,
    lock: "12-Week Lock",
    lockDe: "12 Wochen Laufzeit",
    perks: ["Standard Allocation Tracking", "Weekly Balance View", "No Credit Privileges"],
    perksDe: ["Standardmäßiges Tracking", "Wöchentliche Kontoansicht", "Kein Kreditrahmen"],
    featured: false,
    popular: false,
  },
  {
    name: "Amateur Growth",
    nameDe: "Wachstumsplan",
    min: "$1,000+",
    apy: "7.8%",
    apyNum: 7.8,
    lock: "24-Week Lock",
    lockDe: "24 Wochen Laufzeit",
    perks: ["Weekly Balance Settling",
      "Early Withdrawal Available", "Asset-Backed Credit Eligible", "Priority Email Support"],
    perksDe: ["Wöchentliche Abrechnung",
      "Vorzeitige Auszahlung möglich", "Kreditrahmen verfügbar", "Bevorzugter E-Mail-Support"],
    featured: false,
    popular: true,
  },
  {
    name: "Apex Thrive",
    nameDe: "Apex Wachstum",
    min: "$5,000+",
    apy: "11.4%",
    apyNum: 11.4,
    lock: "52-Week Lock",
    lockDe: "52 Wochen Laufzeit",
    perks: ["Priority Queue Tracking",
      "Early Withdrawal Available", "Max Credit Line Authorization", "Dedicated Account Node"],
    perksDe: ["Bevorzugtes Tracking",
      "Vorzeitige Auszahlung möglich", "Maximaler Kreditrahmen", "Persönlicher Account-Manager"],
    featured: true,
    popular: false,
  },
  {
    name: "Institutional",
    nameDe: "Institutionell",
    min: "> $25,000",
    apy: "15.6%",
    apyNum: 15.6,
    lock: "104-Week Lock",
    lockDe: "104 Wochen Laufzeit",
    perks: ["Private Desk Operations",
      "Early Withdrawal Available", "Negotiable Pool Liquidity", "Custom Compliance Reports"],
    perksDe: ["Privater Desk-Service",
      "Vorzeitige Auszahlung möglich", "Verhandelbare Liquidität", "Individuelle Compliance-Berichte"],
    featured: false,
    popular: false,
  },
];

const FEES_EN = [
  { label: "Capital Deposit Handling Charge", value: "0.5%" },
  { label: "Standard Withdrawal Processing Charge", value: "1.5%" },
  { label: "Credit Line Setup Fee (Origination)", value: "1.0%" },
  { label: "Network Node Processing Gas Fee", value: "$2.00 flat" },
];

const FEES_DE = [
  { label: "Einzahlungsgebühr", value: "0,5%" },
  { label: "Auszahlungsgebühr", value: "1,5%" },
  { label: "Kreditrahmen-Einrichtungsgebühr", value: "1,0%" },
  { label: "Netzwerk-Transaktionsgebühr", value: "2,00 $ pauschal" },
];

const STEPS_EN = [
  { num: "01", icon: "🔐", title: "Open Your Account", body: "Register on the Client Portal and secure your login with two-factor authentication. Takes less than 5 minutes." },
  { num: "02", icon: "💰", title: "Deposit Funds", body: "Send crypto to your personal wallet address. Choose a yield plan that matches your goals — starting from $300." },
  { num: "03", icon: "📈", title: "Earn Every Week", body: "Your returns are calculated daily and paid out within your plan's settlement window, directly to your account balance." },
];

const STEPS_DE = [
  { num: "01", icon: "🔐", title: "Konto eröffnen", body: "Registrieren Sie sich im Client-Portal und aktivieren Sie die Zwei-Faktor-Authentifizierung. Dauert weniger als 5 Minuten." },
  { num: "02", icon: "💰", title: "Einzahlen", body: "Senden Sie Krypto an Ihre persönliche Wallet-Adresse. Wählen Sie einen Renditeplan ab 300 $." },
  { num: "03", icon: "📈", title: "Wöchentlich verdienen", body: "Ihre Rendite wird täglich berechnet und jeden Sonntag direkt auf Ihr Konto ausgezahlt." },
];

export default function HomePage() {
  const { locale, t, toggleLocale } = useLocale();

  const [balance, setBalance] = useState("");
  const [apy, setApy] = useState("");
  const [result, setResult] = useState<APYResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [gateEmail, setGateEmail] = useState("");
  const [gateSent, setGateSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [formStatus, setFormStatus] = useState("");
  const [showSticky, setShowSticky] = useState(false);

  const de = locale === "de";
  const STEPS = de ? STEPS_DE : STEPS_EN;
  const FEES = de ? FEES_DE : FEES_EN;

  const TRUST_STATS = [
    { val: "$4.2M+", label: t.trust.managed },
    { val: "680+",   label: t.trust.investors },
    { val: "99.9%",  label: t.trust.uptime },
    { val: "SOC-2",  label: t.trust.compliant },
  ];

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 420);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handleCalculate() {
    setError(""); setResult(null); setShowEmailGate(false); setGateSent(false);
    const b = parseFloat(balance), a = parseFloat(apy);
    if (isNaN(b) || isNaN(a)) { setError(de ? "Bitte gültige Zahlen eingeben." : "Please enter valid numeric values."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/apy", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ balance: b, apy: a }) });
      const data = await res.json();
      if (!res.ok) setError(data.error || (de ? "Berechnung fehlgeschlagen." : "Calculation failed."));
      else { setResult(data); setShowEmailGate(true); }
    } catch { setError(de ? "Netzwerkfehler." : "Network error."); }
    finally { setLoading(false); }
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormStatus(de ? "Wird gesendet..." : "Submitting...");
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ full_name: name, email, message: msg }) });
      const data = await response.json();
      if (data.success) {
        setFormStatus(de ? "Nachricht erhalten. Wir melden uns innerhalb von 24 Stunden." : "Message received. An advisor will contact you within 24 hours.");
        setName(""); setEmail(""); setMsg("");
      } else setFormStatus(`${de ? "Fehler" : "Error"}: ${data.error}`);
    } catch { setFormStatus(de ? "Netzwerkfehler." : "Network error."); }
  }

  function handleGateSubmit(e: React.FormEvent) { e.preventDefault(); setGateSent(true); }

  const inputCls = "w-full bg-[#060613] border border-[#1e1e38] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#00d1b2]/60 transition-colors";
  const labelCls = "block text-xs text-gray-400 uppercase tracking-widest mb-2";

  return (
    <div className="min-h-screen bg-[#060613] text-gray-100">

      {/* HEADER */}
      <header className="bg-[#0b0b20] border-b border-[#1e1e38] px-4 py-4 text-center relative">
        <h1 className="font-syne text-base sm:text-2xl font-extrabold tracking-widest text-[#e2e8f0] uppercase leading-tight">
          Apex Asset Management
        </h1>
        <p className="text-xs text-gray-500 mt-1 tracking-widest uppercase">

        </p>
        {/* Locale toggle */}
        <button
          onClick={toggleLocale}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-xs border border-[#1e1e38] text-gray-400 px-3 py-1.5 rounded-lg hover:border-[#00d1b2]/40 hover:text-[#00d1b2] transition-all"
        >
          {de ? "🇬🇧 English" : "🇩🇪 Deutsch"}
        </button>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden px-4 py-16 sm:py-28 text-center"
        style={{ background: "radial-gradient(ellipse at 50% 0%, #111135 0%, #060613 70%)" }}>
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block text-xs font-syne tracking-[0.2em] uppercase text-[#00d1b2] mb-5 border border-[#00d1b2]/30 px-3 py-1 rounded-full">
            {t.hero.badge}
          </span>
          <h2 className="font-syne text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-5">
            {t.hero.headline1}<br /><span className="text-[#00d1b2]">{t.hero.headline2}</span>
          </h2>
          <p className="text-base text-gray-400 max-w-xl mx-auto mb-8 font-light leading-relaxed">
            {t.hero.sub} <strong className="text-[#00d1b2]">15.6% {de ? "Jahresrendite" : "APY"}</strong> {t.hero.sub2}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/login" className="bg-[#00d1b2] text-[#060613] font-syne font-bold px-10 py-4 rounded-lg hover:opacity-90 transition-opacity text-sm tracking-wider shadow-lg shadow-[#00d1b2]/20">
              {t.hero.cta}
            </a>
            <a href="#calculator" className="border border-[#e2e8f0]/30 text-gray-300 font-syne font-semibold px-8 py-4 rounded-lg hover:bg-white/5 hover:border-[#e2e8f0]/50 transition-all text-sm">
              {t.hero.calc}
            </a>
          </div>
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {TRUST_STATS.map((s) => (
              <div key={s.label} className="bg-[#0f0f30] border border-[#1e1e38] rounded-xl px-4 py-4 text-center">
                <div className="font-syne text-lg font-bold text-[#00d1b2]">{s.val}</div>
                <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-gray-500">
            <span>✓ 15.6% {de ? "Max. Jahresrendite" : "Max APY"}</span>
            <span>✓ {de ? "Wöchentliche Ausschüttungen" : "Weekly Distributions"}</span>
            <span>✓ {de ? "50% Beleihungsquote" : "50% LTV Credit Lines"}</span>
            <span>✓ {de ? "95% Cold Custody" : "95% Cold Custody"}</span>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="max-w-5xl mx-auto py-16 px-4 border-t border-[#1e1e38]/40">
        <h2 className="text-center font-syne text-2xl sm:text-3xl font-bold mb-2">
          {de ? "So funktioniert es" : "How It Works"}
        </h2>
        <p className="text-center text-sm text-gray-500 mb-10">
          {de ? "Drei Schritte zum institutionellen Ertrag" : "Three steps to start earning institutional-grade yield"}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {STEPS.map((step) => (
            <div key={step.num} className="bg-[#0f0f30]/40 p-6 rounded-xl border border-[#1e1e38]/30 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{step.icon}</span>
                <span className="text-2xl font-bold text-[#00d1b2]/30 font-syne">{step.num}</span>
              </div>
              <h3 className="text-base font-bold">{step.title}</h3>
              <p className="text-sm text-gray-400 font-light leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <a href="/login" className="inline-block text-sm text-[#00d1b2] border border-[#00d1b2]/30 px-6 py-2 rounded-lg hover:bg-[#00d1b2]/10 transition-all">
            {de ? "Konto eröffnen →" : "Open Your Account →"}
          </a>
        </div>
      </section>

      {/* PLANS */}
      <section id="plans" className="max-w-5xl mx-auto py-16 px-4 border-t border-[#1e1e38]/40">
        <h2 className="text-center font-syne text-2xl sm:text-3xl font-bold mb-3">{t.plans.heading}</h2>
        <p className="text-center text-sm text-gray-400 mb-10 max-w-md mx-auto">{t.plans.sub}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map((plan) => (
            <div key={plan.name}
              className={`relative bg-[#0f0f30] p-5 rounded-xl flex flex-col justify-between transition-all duration-300 ${
                plan.featured ? "border-2 border-[#00d1b2] shadow-lg shadow-[#00d1b2]/10"
                : plan.popular ? "border border-[#00d1b2]/40"
                : "border border-[#1e1e38]/60 hover:border-[#e2e8f0]/20"}`}>
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00d1b2] text-[#060613] text-[10px] font-syne font-bold uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap">
                  {t.plans.bestValue}
                </div>
              )}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0f0f30] border border-[#00d1b2]/50 text-[#00d1b2] text-[10px] font-syne font-bold uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap">
                  {t.plans.mostPopular}
                </div>
              )}
              <div className={plan.featured || plan.popular ? "mt-3" : ""}>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">
                  {de ? plan.lockDe : plan.lock}
                </p>
                <h3 className="font-syne text-base font-bold mb-1">{de ? plan.nameDe : plan.name}</h3>
                <div className={`text-2xl font-bold mb-1 font-syne ${plan.featured ? "text-[#00d1b2]" : "text-[#e2e8f0]"}`}>
                  {plan.apy} {t.plans.apy}
                </div>
                <p className="text-sm text-gray-400 mb-3">{plan.min}</p>
                <ul className="space-y-2 mb-5">
                  {(de ? plan.perksDe : plan.perks).map((p) => (
                    <li key={p} className="text-xs text-gray-400 flex items-start gap-2">
                      <span className="text-[#00d1b2] mt-0.5 flex-shrink-0">✓</span>{p}
                    </li>
                  ))}
                </ul>
              </div>
              <a href="/login"
                className={`block text-center text-xs font-syne font-bold uppercase tracking-widest py-2.5 rounded-lg transition-all ${
                  plan.featured ? "bg-[#00d1b2] text-[#060613] hover:opacity-90"
                  : "border border-[#e2e8f0]/30 text-[#e2e8f0] hover:bg-white/5"}`}>
                {plan.featured ? t.plans.getStarted : t.plans.requestAccess}
              </a>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-600 mt-6">
          {de ? "Alle Pläne beinhalten wöchentliche Ausschüttungen · Keine versteckten Gebühren"
               : "All plans include weekly yield distributions · No hidden fees · Cancel anytime within lock period terms"}
        </p>
      </section>

      {/* CREDIT LINES */}
      <section id="loans" className="max-w-5xl mx-auto py-16 px-4 border-t border-[#1e1e38]/40">
        <h2 className="text-center font-syne text-2xl sm:text-3xl font-bold mb-2">
          {de ? "Kreditlinie auf Ihr Kapital" : "Liquidity Extension"}
        </h2>
        <p className="text-center text-xs text-gray-500 uppercase tracking-widest mb-3">
          {de ? "Krypto-gedeckte Kreditlinien" : "Capital-Backed Credit Lines"}
        </p>
        <p className="text-center text-sm text-gray-400 mb-8 max-w-xl mx-auto">
          {de
            ? "Ab dem Wachstumsplan erhalten Sie sofort eine Kreditlinie — gedeckt durch Ihr Krypto-Guthaben. Ihr Kapital erwirtschaftet weiter Rendite, während Sie die Kreditlinie nutzen."
            : "Investors on the Amateur Growth tier or above instantly unlock dollar-denominated credit lines — backed 1:1 against your cold custody balance. "}
          {!de && <strong className="text-gray-300">Your assets keep earning while you spend.</strong>}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-8">
          {[
            { val: "50% LTV", desc: de ? "Max. Beleihungsquote" : "Max Loan-to-Value" },
            { val: de ? "Sofort" : "Instant", desc: de ? "Wallet-Auszahlung" : "Wallet Disbursement" },
            { val: "4.5%", desc: de ? "Fester Zinssatz p.a." : "Fixed Origination Rate" },
            { val: de ? "Flexibel" : "Flexible", desc: de ? "Rückzahlungsplan" : "Repayment Matrix" },
          ].map((item) => (
            <div key={item.desc} className="bg-[#0f0f30] border border-[#1e1e38] rounded-xl px-4 py-5 text-center">
              <div className="font-syne text-lg font-bold text-[#00d1b2]">{item.val}</div>
              <div className="text-xs text-gray-500 mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <a href="/loans" className="inline-block text-sm text-[#00d1b2] border border-[#00d1b2]/30 px-6 py-2 rounded-lg hover:bg-[#00d1b2]/10 transition-all">
            {de ? "Mehr über Kreditlinien →" : "Learn About Credit Lines →"}
          </a>
        </div>
      </section>

      {/* CALCULATOR */}
      <section id="calculator" className="max-w-lg mx-auto py-16 px-4 border-t border-[#1e1e38]/40">
        <h2 className="text-center font-syne text-2xl sm:text-3xl font-bold mb-2">{t.calc.heading}</h2>
        <p className="text-center text-sm text-gray-400 mb-8">{t.calc.sub}</p>
        <div className="bg-[#0f0f30] border border-[#1e1e38] rounded-xl p-6 space-y-5">
          <div>
            <label className={labelCls}>{t.calc.label1}</label>
            <input type="number" placeholder={de ? "z.B. 5000" : "e.g. 5000"} className={inputCls}
              value={balance} onChange={(e) => setBalance(e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>{t.calc.label2}</label>
            <input type="number" step="0.1" placeholder={de ? "z.B. 11,4" : "e.g. 11.4"} className={inputCls}
              value={apy} onChange={(e) => setApy(e.target.value)} />
            <div className="flex gap-2 mt-2 flex-wrap">
              {PLANS.map((p) => (
                <button key={p.apyNum} onClick={() => setApy(String(p.apyNum))}
                  className={`text-xs px-2 py-1 rounded border transition-all ${apy === String(p.apyNum)
                    ? "bg-[#00d1b2] text-[#060613] border-[#00d1b2]"
                    : "border-[#1e1e38] text-gray-400 hover:border-[#00d1b2]/40"}`}>
                  {p.apy}
                </button>
              ))}
            </div>
          </div>
          <button onClick={handleCalculate} disabled={loading}
            className="w-full bg-[#00d1b2] text-[#060613] font-syne font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 text-sm tracking-wider">
            {loading ? t.calc.loading : t.calc.btn}
          </button>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          {result && (
            <>
              <div className="grid grid-cols-3 gap-3 pt-1">
                {[
                  { label: t.calc.weekly, val: `$${result.weekly_yield.toFixed(2)}` },
                  { label: t.calc.daily,  val: `$${result.daily_yield.toFixed(2)}` },
                  { label: t.calc.annual, val: `$${result.projected_annual.toFixed(2)}` },
                ].map((item) => (
                  <div key={item.label} className="bg-[#060613] border border-[#1e1e38] rounded-lg p-3 text-center">
                    <div className="font-syne text-base font-bold text-[#00d1b2]">{item.val}</div>
                    <div className="text-xs text-gray-500 mt-1">{item.label}</div>
                  </div>
                ))}
              </div>
              {showEmailGate && !gateSent && (
                <div className="bg-[#0a1628] border border-[#00d1b2]/20 rounded-xl p-4 mt-2">
                  <p className="text-sm text-gray-300 font-syne font-bold mb-1">{t.calc.gateTitle}</p>
                  <p className="text-xs text-gray-500 mb-3">{t.calc.gateSub}</p>
                  <form onSubmit={handleGateSubmit} className="flex gap-2">
                    <input type="email" required placeholder={t.calc.gatePlaceholder}
                      className="flex-1 bg-[#060613] border border-[#1e1e38] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00d1b2]/60"
                      value={gateEmail} onChange={(e) => setGateEmail(e.target.value)} />
                    <button type="submit"
                      className="bg-[#00d1b2] text-[#060613] font-bold text-xs px-4 py-2 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap">
                      {t.calc.gateSend}
                    </button>
                  </form>
                </div>
              )}
              {gateSent && (
                <div className="bg-[#00d1b2]/10 border border-[#00d1b2]/30 rounded-xl p-4 text-center">
                  <p className="text-sm text-[#00d1b2] font-bold">{t.calc.sentTitle}</p>
                  <p className="text-xs text-gray-400 mt-1">{t.calc.sentSub}</p>
                  <a href="/login" className="inline-block mt-2 text-xs bg-[#00d1b2] text-[#060613] font-bold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                    {t.calc.sentCta}
                  </a>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* FEES */}
      <section id="fees" className="max-w-lg mx-auto py-16 px-4 border-t border-[#1e1e38]/40">
        <h2 className="text-center font-syne text-2xl sm:text-3xl font-bold mb-3">
          {de ? "Gebührenübersicht" : "Protocol Fee Disclosures"}
        </h2>
        <p className="text-center text-sm text-gray-400 mb-8">
          {de ? "Vollständige Transparenz — keine versteckten Kosten." : "Full transparency — no hidden charges, ever."}
        </p>
        <div className="bg-[#0f0f30] border border-[#1e1e38] rounded-xl overflow-hidden">
          {FEES.map((fee, i) => (
            <div key={fee.label}
              className={`flex justify-between items-center px-5 py-4 text-sm gap-4 ${i < FEES.length - 1 ? "border-b border-[#1e1e38]" : ""}`}>
              <span className="text-gray-400 text-xs leading-relaxed">{fee.label}</span>
              <span className="font-syne font-bold text-[#e2e8f0] flex-shrink-0">{fee.value}</span>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-600 mt-4">
          {de ? "Alle Gebühren werden direkt bei der Transaktion abgezogen. Keine monatlichen Kontogebühren."
               : "All fees are deducted transparently at point of transaction. No monthly account charges."}
        </p>
      </section>

      {/* SECURITY */}
      <section id="security" className="max-w-5xl mx-auto py-16 px-4 border-t border-[#1e1e38]/40">
        <h2 className="text-center font-syne text-2xl sm:text-3xl font-bold mb-4">
          {de ? "Sicherheit & Risikomanagement" : "Risk Management Operations"}
        </h2>
        <p className="text-center text-sm text-gray-400 mb-10 max-w-xl mx-auto">
          {de ? "Ihr Kapital ist auf jeder Ebene durch institutionelle Sicherheitsstandards geschützt."
               : "Your capital is protected by institutional-grade security at every layer."}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: "🔒",
              title: de ? "Cold Storage" : "Cold Storage",
              points: de
                ? ["95 % der Reserven in Offline-Wallets", "Multi-Signatur-Wallet-Schutz", "Physisch getrennte Signierinfrastruktur"]
                : ["95% reserves in cold custody", "Multi-signature wallet protection", "Air-gapped signing infrastructure"],
            },
            {
              icon: "📊",
              title: de ? "Kein Handelsrisiko" : "Zero Leveraged Exposure",
              points: de
                ? ["Kein Richtungshandel", "Feste Renditen aus Liquiditätspools", "Kein spekulativer Kapitaleinsatz"]
                : ["No directional trading risk", "Fixed yields from liquidity pools only", "Capital never used for speculation"],
            },
            {
              icon: "📋",
              title: de ? "Geprüfte Bücher" : "Audited Ledgers",
              points: de
                ? ["Alle Transaktionen on-chain abgeglichen", "Wöchentliche Ledger-Snapshots", "Vollständiger Prüfpfad auf Anfrage"]
                : ["All transactions reconciled on-chain", "Weekly ledger snapshots", "Full audit trail available on request"],
            },
          ].map((item) => (
            <div key={item.title} className="bg-[#0f0f30]/40 border border-[#1e1e38]/30 rounded-xl p-5">
              <div className="text-2xl mb-3">{item.icon}</div>
              <h3 className="font-syne font-bold text-base mb-3 text-[#e2e8f0]">{item.title}</h3>
              <ul className="space-y-2">
                {item.points.map((pt) => (
                  <li key={pt} className="text-xs text-gray-400 flex items-start gap-2">
                    <span className="text-[#00d1b2] mt-0.5 flex-shrink-0">✓</span>{pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="max-w-lg mx-auto py-16 px-4 border-t border-[#1e1e38]/40">
        <h2 className="text-center font-syne text-2xl sm:text-3xl font-bold mb-3">{t.contact.heading}</h2>
        <p className="text-center text-sm text-gray-400 mb-3 max-w-sm mx-auto">
          {t.contact.sub} <strong className="text-gray-300">{t.contact.hours}</strong>{t.contact.sub2}
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {(de
            ? ["Persönliche Renditestrategie", "Onboarding-Unterstützung", "Kreditrahmen-Prüfung"]
            : ["Personalized yield strategy", "Portfolio onboarding support", "Credit line eligibility review"]
          ).map((v) => (
            <span key={v} className="text-xs text-[#00d1b2] flex items-center gap-1">
              <span>✓</span> {v}
            </span>
          ))}
        </div>
        <form onSubmit={handleFormSubmit} className="bg-[#0f0f30] border border-[#1e1e38] rounded-xl p-6 space-y-5">
          <div>
            <label className={labelCls}>{t.contact.nameLabel}</label>
            <input type="text" required className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>{t.contact.emailLabel}</label>
            <input type="email" required className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>{t.contact.msgLabel}</label>
            <textarea rows={4} required className={`${inputCls} resize-none`}
              placeholder={t.contact.msgPlaceholder}
              value={msg} onChange={(e) => setMsg(e.target.value)} />
          </div>
          <button type="submit"
            className="w-full bg-[#00d1b2] text-[#060613] font-syne font-bold py-3 rounded-lg hover:opacity-90 transition-opacity text-sm tracking-wider">
            {t.contact.btn}
          </button>
          {formStatus && (
            <p className={`text-sm text-center mt-2 ${formStatus.toLowerCase().includes("error") || formStatus.toLowerCase().includes("fehler") ? "text-red-400" : "text-[#00d1b2]"}`}>
              {formStatus}
            </p>
          )}
        </form>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#1e1e38] py-10 text-center text-xs text-gray-600 px-4">
        <p className="mb-2 font-syne tracking-widest uppercase text-gray-500">Apex Asset Management — APX-2026</p>
        <div className="flex justify-center gap-6 mb-4 text-gray-600">
          <a href="/about" className="hover:text-gray-400 transition-colors">{de ? "Über uns" : "About"}</a>
          <a href="/fees" className="hover:text-gray-400 transition-colors">{de ? "Gebühren" : "Fees"}</a>
          <a href="/security" className="hover:text-gray-400 transition-colors">{de ? "Sicherheit" : "Security"}</a>
          <a href="/faq" className="hover:text-gray-400 transition-colors">FAQ</a>
          <a href="/contact" className="hover:text-gray-400 transition-colors">{de ? "Kontakt" : "Contact"}</a>
        </div>
        <p className="max-w-md mx-auto leading-relaxed">
          {de
            ? "Apex ist eine geschlossene private Investitionsplattform. Vergangene Renditen garantieren keine zukünftigen Ergebnisse. Digitale Anlagen unterliegen Risiken."
            : "Apex operates as a closed private investment platform. Past performance does not guarantee future results. Digital asset investments carry risk."}
        </p>
        <button onClick={toggleLocale} className="mt-4 text-xs text-gray-600 hover:text-[#00d1b2] transition-colors underline underline-offset-2">
          {de ? "🇬🇧 Switch to English" : "🇩🇪 Auf Deutsch wechseln"}
        </button>
      </footer>

      {/* STICKY CTA */}
      {showSticky && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a1628]/98 border-t border-[#00d1b2]/20 backdrop-blur px-4 py-3 flex items-center justify-between gap-3"
          style={{ boxShadow: "0 -4px 24px rgba(0,0,0,0.4)" }}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-2 h-2 bg-[#00d1b2] rounded-full flex-shrink-0 animate-pulse" />
            <p className="text-xs text-gray-300 truncate">
              <span className="text-[#00d1b2] font-bold">{t.sticky.msg}</span>{" "}{t.sticky.sub}
            </p>
          </div>
          <a href="/login"
            className="flex-shrink-0 bg-[#00d1b2] text-[#060613] font-syne font-bold text-xs px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap">
            {t.sticky.cta}
          </a>
        </div>
      )}
    </div>
  );
}
