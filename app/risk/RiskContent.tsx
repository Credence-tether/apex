"use client";
import { useLocale } from "../../lib/locale-context";

export default function RiskContent() {
  const { locale } = useLocale();
  const de = locale === "de";

  return (
    <main className="min-h-screen bg-[#060613] text-gray-100">
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
        <header className="space-y-3">
          <p className="text-xs text-[#00d1b2] font-mono uppercase tracking-[0.3em]">
            {de ? "Risikooffenlegung" : "Risk Disclosure"}
          </p>
          <h1 className="font-syne text-3xl font-extrabold text-white uppercase tracking-wide">
            {de ? "Bitte vor Kontoeröffnung lesen" : "Please Read Before Opening an Account"}
          </h1>
        </header>

        <div className="space-y-6 text-sm text-gray-400 leading-relaxed">
          {de ? (
            <>
              <p><strong className="text-gray-200">Kapitalrisiko:</strong> Digitale Assets sind hochvolatil. Ihr eingesetztes Kapital kann an Wert verlieren oder vollständig verloren gehen. Vergangene Renditen sind kein Indikator für zukünftige Ergebnisse.</p>
              <p><strong className="text-gray-200">Keine Einlagensicherung:</strong> Apex ist keine Bank. Ihre Gelder sind nicht durch gesetzliche Einlagensicherungssysteme (z.B. FDIC, FSCS) gedeckt.</p>
              <p><strong className="text-gray-200">Regulatorisches Risiko:</strong> Die gesetzlichen Rahmenbedingungen für digitale Assets können sich ändern und den Betrieb oder die Verfügbarkeit von Diensten beeinflussen.</p>
              <p><strong className="text-gray-200">Technologisches Risiko:</strong> Smart Contracts und Blockchain-Netzwerke können Fehler oder Schwachstellen aufweisen. Wir mindern dieses Risiko durch Prüfungen und konservative Strategieauswahl.</p>
              <p><strong className="text-gray-200">Renditen:</strong> Alle angegebenen APY-Werte sind Zielwerte, keine Garantien. Tatsächliche Renditen können abweichen.</p>
            </>
          ) : (
            <>
              <p><strong className="text-gray-200">Capital Risk:</strong> Digital assets are highly volatile. The value of your investment may decrease or you may lose your entire principal. Past performance is not indicative of future results.</p>
              <p><strong className="text-gray-200">No Deposit Insurance:</strong> Apex is not a bank. Your funds are not covered by FDIC, FSCS, or equivalent government deposit insurance schemes.</p>
              <p><strong className="text-gray-200">Regulatory Risk:</strong> The legal and regulatory framework for digital assets is evolving and may affect operations or service availability.</p>
              <p><strong className="text-gray-200">Technology Risk:</strong> Smart contracts and blockchain networks may contain bugs or vulnerabilities. We mitigate this through audits and conservative strategy selection.</p>
              <p><strong className="text-gray-200">Yield Targets:</strong> All APY figures shown are targets, not guarantees. Actual returns may differ.</p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
