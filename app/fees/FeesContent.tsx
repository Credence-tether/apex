"use client";
import { useLocale } from "../../lib/locale-context";

const FEES = {
  en: [
    { label: "Capital Deposit Handling Charge", value: "0.5%" },
    { label: "Standard Withdrawal Processing Charge", value: "1.5%" },
    { label: "Credit Line Setup Fee (Origination)", value: "1.0%" },
    { label: "Network Node Processing Gas Fee", value: "$2.00 flat" },
    { label: "Early Withdrawal Fee (before maturity)", value: "2.0%" },
    { label: "Monthly Account Fee", value: "None" },
    { label: "Spread or Slippage Capture", value: "None" },
  ],
  de: [
    { label: "Einzahlungsgebühr", value: "0,5 %" },
    { label: "Auszahlungsgebühr (Standard)", value: "1,5 %" },
    { label: "Kreditrahmen-Einrichtungsgebühr", value: "1,0 %" },
    { label: "Netzwerk-Transaktionsgebühr", value: "2,00 $ pauschal" },
    { label: "Vorzeitige Auszahlungsgebühr (vor Fälligkeit)", value: "2,0 %" },
    { label: "Monatliche Kontogebühr", value: "Keine" },
    { label: "Spread oder Slippage", value: "Keine" },
  ],
};

export default function FeesContent() {
  const { locale } = useLocale();
  const de = locale === "de";
  const fees = de ? FEES.de : FEES.en;

  return (
    <main className="min-h-screen bg-[#060613] text-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-16 space-y-10">
        <header className="text-center space-y-3">
          <p className="text-xs text-[#00d1b2] font-mono uppercase tracking-[0.3em]">
            {de ? "Vollständige Transparenz" : "Full Transparency"}
          </p>
          <h1 className="font-syne text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-wide">
            {de ? "Gebührenübersicht" : "Fee Schedule"}
          </h1>
          <p className="text-sm text-gray-400">
            {de ? "Alle Gebühren direkt bei der Transaktion — keine Überraschungen." : "All fees deducted at point of transaction — no surprises."}
          </p>
        </header>

        <div className="bg-[#0f0f30] border border-[#1e1e38] rounded-xl overflow-hidden">
          {fees.map((fee, i) => (
            <div key={fee.label} className={`flex justify-between items-center px-5 py-4 gap-4 ${i < fees.length - 1 ? "border-b border-[#1e1e38]" : ""}`}>
              <span className="text-xs text-gray-400 leading-relaxed">{fee.label}</span>
              <span className={`font-syne font-bold flex-shrink-0 ${fee.value === "None" || fee.value === "Keine" ? "text-[#00d1b2]" : "text-[#e2e8f0]"}`}>
                {fee.value}
              </span>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-600">
          {de
            ? "Gebühren können sich ändern. Änderungen werden 14 Tage im Voraus bekannt gegeben."
            : "Fees subject to change. Any changes communicated 14 days in advance."}
        </p>
      </div>
    </main>
  );
}
