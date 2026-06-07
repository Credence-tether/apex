"use client";
import { useLocale } from "../../lib/locale-context";

export default function LoansContent() {
  const { locale } = useLocale();
  const de = locale === "de";

  const STATS = de
    ? [{ val: "50% LTV", desc: "Max. Beleihungsquote" }, { val: "4.5%", desc: "Fester Zinssatz p.a." }, { val: "Sofort", desc: "Wallet-Auszahlung" }, { val: "Flexibel", desc: "Rückzahlungsplan" }]
    : [{ val: "50% LTV", desc: "Max Loan-to-Value" }, { val: "4.5%", desc: "Fixed Origination Rate" }, { val: "Instant", desc: "Wallet Disbursement" }, { val: "Flexible", desc: "Repayment Schedule" }];

  const STEPS = de
    ? ["Kapital in einen berechtigten Renditeplan einzahlen (ab 1.000 $)", "Kreditlinie in Ihrem Dashboard aktivieren", "Betrag anfordern — sofortige Überweisung an Ihre Wallet", "Zinsen laufen monatlich an; Kapital jederzeit tilgbar"]
    : ["Deposit capital into an eligible yield plan ($1,000+ tier or above)", "Activate your credit line from the dashboard", "Request an amount — instant disbursement to your wallet", "Interest accrues monthly; repay principal at any time"];

  return (
    <main className="min-h-screen bg-[#060613] text-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
        <header className="text-center space-y-4">
          <p className="text-xs text-[#00d1b2] font-mono uppercase tracking-[0.3em]">
            {de ? "Asset-gedeckte Kreditlinien" : "Asset-Backed Credit Lines"}
          </p>
          <h1 className="font-syne text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-wide">
            {de ? "Liquidität ohne zu verkaufen" : "Access Liquidity Without Selling"}
          </h1>
          <p className="text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
            {de
              ? "Ihr Krypto-Portfolio erwirtschaftet weiter Rendite, während Sie gleichzeitig eine Kreditlinie in Anspruch nehmen."
              : "Your crypto portfolio keeps earning yield while you draw down a credit line against it simultaneously."}
          </p>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STATS.map((s) => (
            <div key={s.desc} className="bg-[#0f0f30] border border-[#1e1e38] rounded-xl p-5 text-center">
              <div className="font-syne text-xl font-bold text-[#00d1b2]">{s.val}</div>
              <div className="text-xs text-gray-500 mt-1">{s.desc}</div>
            </div>
          ))}
        </div>

        <div className="bg-[#0f0f30] border border-[#1e1e38] rounded-xl p-6 space-y-4">
          <h2 className="font-syne font-bold text-base text-white">
            {de ? "So funktioniert es" : "How It Works"}
          </h2>
          <ol className="space-y-3">
            {STEPS.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                <span className="text-[#00d1b2] font-syne font-bold flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="bg-[#0a1628] border border-[#00d1b2]/20 rounded-xl p-5 text-center">
          <p className="text-sm text-gray-300 mb-3">
            {de ? "Kreditlinie verfügbar ab dem Wachstumsplan ($1.000+)" : "Credit lines available from the Amateur Growth plan ($1,000+)"}
          </p>
          <a href="/login" className="inline-block bg-[#00d1b2] text-[#060613] font-syne font-bold text-sm px-8 py-3 rounded-lg hover:opacity-90 transition-opacity">
            {de ? "Konto eröffnen →" : "Open Account →"}
          </a>
        </div>
      </div>
    </main>
  );
}
