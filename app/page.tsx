"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";

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
    min: "From $300",
    apy: "5.2%",
    lock: "12-Week Lock",
    perks: ["Standard Allocation Tracking", "Weekly Balance View", "No Credit Privileges"],
    accent: "border-gray-500/30",
  },
  {
    name: "Amateur Growth",
    min: "$1,000+",
    apy: "7.8%",
    lock: "24-Week Lock",
    perks: ["Weekly Balance Settling", "Asset-Backed Credit Eligible", "Priority Email Support"],
    accent: "border-gray-400/50",
    featured: true,
  },
  {
    name: "Apex Thrive",
    min: "$5,000+",
    apy: "11.4%",
    lock: "52-Week Lock",
    perks: ["Priority Queue Tracking", "Max Credit Line Authorization", "Dedicated Account Node"],
    accent: "border-gray-300/40",
  },
  {
    name: "Institutional",
    min: "> $25,000",
    apy: "15.6%",
    lock: "104-Week Lock",
    perks: ["Private Desk Operations", "Negotiable Pool Liquidity", "Custom Compliance Reports"],
    accent: "border-gray-200/30",
  },
];

const FEES = [
  { label: "Capital Deposit Handling Charge", value: "0.5%" },
  { label: "Standard Withdrawal Processing Charge", value: "1.5%" },
  { label: "Credit Line Setup Fee (Origination)", value: "1.0%" },
  { label: "Network Node Processing Gas Fee", value: "$2.00 flat" },
];

const STEPS = [
  {
    num: "01",
    title: "Establish Wallet",
    body: "Register your private account node via the Client Portal and secure credentials using advanced two-factor encryption protocols.",
  },
  {
    num: "02",
    title: "Allocate Principal",
    body: "Initiate a transparent blockchain deposit tracking request to allocate crypto capital into an optimized fixed yield tier from $300.",
  },
  {
    num: "03",
    title: "Weekly Distributions",
    body: "Watch available assets grow automatically with portfolio rewards programmatically distributed every 7 days.",
  },
];

export default function HomePage() {
  const [balance, setBalance] = useState("");
  const [apy, setApy] = useState("");
  const [result, setResult] = useState<APYResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [formStatus, setFormStatus] = useState("");

  async function handleCalculate() {
    setError("");
    setResult(null);
    const b = parseFloat(balance);
    const a = parseFloat(apy);
    if (isNaN(b) || isNaN(a)) { setError("Please enter valid numeric values."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/apy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ balance: b, apy: a }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Calculation failed.");
      else setResult(data);
    } catch { setError("Network error."); }
    finally { setLoading(false); }
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormStatus("Submitting...");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: name, email, message: msg }),
      });
      const data = await response.json();
      if (data.success) {
        setFormStatus("Thank you! Your message was submitted successfully.");
        setName(""); setEmail(""); setMsg("");
      } else { setFormStatus(`Submission error: ${data.error}`); }
    } catch { setFormStatus("Network error. Failed to save to database."); }
  }

  return (
    <div className="min-h-screen bg-[#060613] text-gray-100">

      {/* HEADER */}
      <header className="bg-[#0b0b20] border-b border-[#1e1e38] px-4 py-5 text-center">
        <h1 className="font-syne text-xl sm:text-3xl font-extrabold tracking-widest text-[#e2e8f0] uppercase leading-tight">
          Apex Asset Management
        </h1>
        <p className="text-xs text-gray-500 mt-1 tracking-widest uppercase">
          Administration Node ID: APX-2026
        </p>
      </header>

      {/* NAV */}
      <Navbar />

      {/* HERO */}
      <section
        className="relative overflow-hidden px-4 py-16 sm:py-28 text-center"
        style={{ background: "radial-gradient(ellipse at 50% 0%, #111135 0%, #060613 70%)" }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block text-xs font-syne tracking-[0.2em] uppercase text-[#e2e8f0] mb-5 border border-[#e2e8f0]/30 px-3 py-1 rounded-full">
            Institutional-Grade Digital Yield
          </span>
          <h2 className="font-syne text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-5">
            Automated Yield Generation
            <br />
            <span className="text-[#e2e8f0]">for Digital Wealth</span>
          </h2>
          <p className="text-base text-gray-400 max-w-xl mx-auto mb-8 font-dm font-light leading-relaxed">
            Access high-tier fixed APY configurations built on verified risk-mitigation frameworks.
            Manage digital crypto assets with institutional transparency.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#plans"
              className="bg-[#e2e8f0] text-[#060613] font-syne font-bold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity text-sm">
              View APY Plans
            </a>
            <a href="#calculator"
              className="border border-[#e2e8f0]/50 text-[#e2e8f0] font-syne font-semibold px-8 py-3 rounded-lg hover:bg-[#e2e8f0]/10 transition-all text-sm">
              Calculate Yield
            </a>
          </div>
        </div>

        {/* STATS */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
          {[
            { val: "15.6%", label: "Max APY" },
            { val: "Weekly", label: "Distributions" },
            { val: "50% LTV", label: "Credit Lines" },
            { val: "95% Cold", label: "Custody" },
          ].map((stat) => (
            <div key={stat.label}
              className="bg-[#0f0f30] border border-[#1e1e38] rounded-xl px-4 py-4 text-center">
              <div className="font-syne text-lg font-bold text-[#e2e8f0]">{stat.val}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="max-w-5xl mx-auto py-16 px-4 border-t border-[#1e1e38]/40">
        <h2 className="text-center font-syne text-2xl sm:text-3xl font-bold mb-10">Operational Architecture</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {STEPS.map((step) => (
            <div key={step.num} className="bg-[#0f0f30]/40 p-6 rounded-xl border border-[#1e1e38]/30">
              <div className="text-2xl font-bold text-[#e2e8f0]/30 font-syne mb-3">{step.num}</div>
              <h3 className="text-lg font-bold mb-2">{step.title}</h3>
              <p className="text-sm text-gray-400 font-light leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PLANS */}
      <section id="plans" className="max-w-5xl mx-auto py-16 px-4 border-t border-[#1e1e38]/40">
        <h2 className="text-center font-syne text-2xl sm:text-3xl font-bold mb-3">Fixed Yield Asset Matrices</h2>
        <p className="text-center text-sm text-gray-400 mb-10 max-w-md mx-auto">
          Choose a baseline capital configuration tier. Yield settlements processed every Sunday.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map((plan) => (
            <div key={plan.name}
              className={`bg-[#0f0f30] p-5 rounded-xl border flex flex-col justify-between transition-all duration-300 hover:border-[#e2e8f0]/40 ${plan.accent}`}>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">{plan.lock}</p>
                <h3 className="font-syne text-base font-bold mb-1">{plan.name}</h3>
                <div className="text-2xl font-bold mb-3 font-syne text-[#e2e8f0]">{plan.apy} APY</div>
                <p className="text-sm text-gray-400 mb-3">{plan.min}</p>
                <ul className="space-y-2 mb-5">
                  {plan.perks.map((p) => (
                    <li key={p} className="text-xs text-gray-400 flex items-start gap-2">
                      <span className="text-[#e2e8f0] mt-0.5 flex-shrink-0">✓</span>{p}
                    </li>
                  ))}
                </ul>
              </div>
              <a href="/login"
                className="block text-center text-xs font-syne font-bold uppercase tracking-widest border border-[#e2e8f0]/40 text-[#e2e8f0] py-2 rounded-lg hover:bg-[#e2e8f0]/10 transition-all">
                Request Access
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* CREDIT LINES */}
      <section id="loans" className="max-w-5xl mx-auto py-16 px-4 border-t border-[#1e1e38]/40">
        <h2 className="text-center font-syne text-2xl sm:text-3xl font-bold mb-2">Liquidity Extension</h2>
        <p className="text-center text-sm text-gray-500 uppercase tracking-widest mb-2">Capital-Backed Credit Lines</p>
        <p className="text-center text-sm text-gray-400 mb-3 max-w-xl mx-auto">
          Maintain active capital placements in the Amateur Growth tier or above to instantly unlock dollar-denominated liquidity facilities.
        </p>
        <p className="text-center text-xs text-gray-500 mb-10 max-w-lg mx-auto">
          Risk/Credit Notice: All credit lines are backed safely 1:1 against your cold custody ledger balances.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
          {[
            { val: "50% LTV", desc: "Max Loan-to-Value" },
            { val: "Instant", desc: "Wallet Disbursement" },
            { val: "4.5%", desc: "Fixed Origination Rate" },
            { val: "Flexible", desc: "Repayment Matrix" },
          ].map((item) => (
            <div key={item.desc}
              className="bg-[#0f0f30] border border-[#1e1e38] rounded-xl px-4 py-5 text-center">
              <div className="font-syne text-lg font-bold text-[#e2e8f0]">{item.val}</div>
              <div className="text-xs text-gray-500 mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* APY CALCULATOR */}
      <section id="calculator" className="max-w-lg mx-auto py-16 px-4 border-t border-[#1e1e38]/40">
        <h2 className="text-center font-syne text-2xl sm:text-3xl font-bold mb-2">Yield Projection Matrix</h2>
        <p className="text-center text-sm text-gray-400 mb-8">Run multi-scenario simulations based on target APY allocations</p>
        <div className="bg-[#0f0f30] border border-[#1e1e38] rounded-xl p-6 space-y-5">
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Principal Allocation ($)</label>
            <input type="number" placeholder="e.g. 5000"
              className="w-full bg-[#060613] border border-[#1e1e38] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#e2e8f0]/60"
              value={balance} onChange={(e) => setBalance(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Target Rate (APY %)</label>
            <input type="number" step="0.1" placeholder="e.g. 11.4"
              className="w-full bg-[#060613] border border-[#1e1e38] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#e2e8f0]/60"
              value={apy} onChange={(e) => setApy(e.target.value)} />
          </div>
          <button onClick={handleCalculate} disabled={loading}
            className="w-full bg-[#e2e8f0] text-[#060613] font-syne font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 text-sm">
            {loading ? "Running Calculations..." : "Execute Simulation"}
          </button>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          {result && (
            <div className="grid grid-cols-3 gap-3 pt-1">
              {[
                { label: "Weekly", val: `$${result.weekly_yield.toFixed(2)}` },
                { label: "Daily", val: `$${result.daily_yield.toFixed(2)}` },
                { label: "Annual", val: `$${result.projected_annual.toFixed(2)}` },
              ].map((item) => (
                <div key={item.label} className="bg-[#060613] border border-[#1e1e38] rounded-lg p-3 text-center">
                  <div className="font-syne text-base font-bold text-[#e2e8f0]">{item.val}</div>
                  <div className="text-xs text-gray-500 mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FEES */}
      <section id="fees" className="max-w-lg mx-auto py-16 px-4 border-t border-[#1e1e38]/40">
        <h2 className="text-center font-syne text-2xl sm:text-3xl font-bold mb-3">Protocol Fee Disclosures</h2>
        <p className="text-center text-sm text-gray-400 mb-8">Transparent fee tracking to protect system asset integrity</p>
        <div className="bg-[#0f0f30] border border-[#1e1e38] rounded-xl overflow-hidden">
          {FEES.map((fee, i) => (
            <div key={fee.label}
              className={`flex justify-between items-center px-5 py-4 text-sm gap-4 ${i < FEES.length - 1 ? "border-b border-[#1e1e38]" : ""}`}>
              <span className="text-gray-400 text-xs leading-relaxed">{fee.label}</span>
              <span className="font-syne font-bold text-[#e2e8f0] flex-shrink-0">{fee.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SECURITY */}
      <section id="security" className="max-w-5xl mx-auto py-16 px-4 border-t border-[#1e1e38]/40">
        <h2 className="text-center font-syne text-2xl sm:text-3xl font-bold mb-4">Risk Management Operations</h2>
        <p className="text-center text-sm text-gray-400 mb-10 max-w-xl mx-auto">
          Apex manages pool parameters using deep encryption layers and strict operational procedures.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: "Cold Storage", body: "95% of active reserves are retained in isolated multisig custody nodes." },
            { title: "Zero Leveraged Exposure", body: "Fixed yields operate completely inside non-directional liquidity pools." },
            { title: "Audited Ledgers", body: "All tracking events are reconciled via secure server execution loops." },
          ].map((item) => (
            <div key={item.title} className="bg-[#0f0f30]/40 border border-[#1e1e38]/30 rounded-xl p-5">
              <h3 className="font-syne font-bold text-base mb-2 text-[#e2e8f0]">{item.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="max-w-lg mx-auto py-16 px-4 border-t border-[#1e1e38]/40">
        <h2 className="text-center font-syne text-2xl sm:text-3xl font-bold mb-3">Corporate Support Gate</h2>
        <p className="text-center text-sm text-gray-400 mb-8">Submit general ledger inquiries to our internal accounts desk.</p>
        <form onSubmit={handleFormSubmit} className="bg-[#0f0f30] border border-[#1e1e38] rounded-xl p-6 space-y-5">
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Legal Full Name</label>
            <input type="text" required
              className="w-full bg-[#060613] border border-[#1e1e38] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#e2e8f0]/60"
              value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Corporate Email Address</label>
            <input type="email" required
              className="w-full bg-[#060613] border border-[#1e1e38] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#e2e8f0]/60"
              value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Inquiry Statement</label>
            <textarea rows={4} required
              className="w-full bg-[#060613] border border-[#1e1e38] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#e2e8f0]/60 resize-none"
              value={msg} onChange={(e) => setMsg(e.target.value)} />
          </div>
          <button type="submit"
            className="w-full bg-[#e2e8f0] text-[#060613] font-syne font-bold py-3 rounded-lg hover:opacity-90 transition-opacity text-sm">
            Submit Official Inquiry
          </button>
          {formStatus && <p className="text-sm text-center text-[#e2e8f0] mt-2">{formStatus}</p>}
        </form>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#1e1e38] py-8 text-center text-xs text-gray-600 px-4">
        <p className="mb-2 font-syne tracking-widest uppercase text-gray-500">Apex Asset Management — APX-2026</p>
        <p className="max-w-md mx-auto leading-relaxed">Apex operates as a closed private template execution interface. Past performance frameworks do not guarantee identical ledger yields.</p>
      </footer>

    </div>
  );
}
