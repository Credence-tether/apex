"use client";
import { useLocale } from "../../lib/locale-context";

const PILLARS = {
  en: [
    { icon: "🔒", title: "Cold Storage", points: ["95% of reserves held offline in air-gapped multi-sig wallets", "Hardware security modules (HSMs) for key management", "Independent quarterly custody audits"] },
    { icon: "🔑", title: "Access Controls", points: ["Mandatory two-factor authentication for all accounts", "Withdrawal address whitelisting with 48-hour lock", "Session anomaly detection and automatic logout"] },
    { icon: "📋", title: "Proof of Reserves", points: ["On-chain attestations published quarterly", "Third-party auditor verification", "Real-time reserve ratio monitoring"] },
    { icon: "🛡️", title: "Operational Security", points: ["SOC-2 Type I readiness program underway", "Regular penetration testing by external firms", "Bug bounty program open to security researchers"] },
  ],
  de: [
    { icon: "🔒", title: "Cold Storage", points: ["95 % der Reserven offline in Air-Gapped-Multi-Sig-Wallets", "Hardware-Sicherheitsmodule (HSMs) für Schlüsselverwaltung", "Unabhängige vierteljährliche Verwahrungsprüfungen"] },
    { icon: "🔑", title: "Zugriffskontrollen", points: ["Verbindliche Zwei-Faktor-Authentifizierung für alle Konten", "Auszahlungsadress-Whitelisting mit 48-Stunden-Sperre", "Sitzungsanomaliedetektion und automatischer Logout"] },
    { icon: "📋", title: "Proof of Reserves", points: ["On-Chain-Bestätigungen werden vierteljährlich veröffentlicht", "Überprüfung durch unabhängige Drittprüfer", "Echtzeit-Reservequoten-Monitoring"] },
    { icon: "🛡️", title: "Betriebssicherheit", points: ["SOC-2-Typ-I-Bereitschaftsprogramm läuft", "Regelmäßige Penetrationstests durch externe Firmen", "Bug-Bounty-Programm für Sicherheitsforscher"] },
  ],
};

export default function SecurityContent() {
  const { locale } = useLocale();
  const de = locale === "de";
  const pillars = de ? PILLARS.de : PILLARS.en;

  return (
    <main className="min-h-screen bg-[#060613] text-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
        <header className="space-y-4 text-center">
          <p className="text-xs text-[#00d1b2] font-mono uppercase tracking-[0.3em]">
            {de ? "Sicherheit & Risikomanagement" : "Security & Risk Management"}
          </p>
          <h1 className="font-syne text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-wide">
            {de ? "Ihr Kapital. Maximal geschützt." : "Your Capital. Maximum Protection."}
          </h1>
          <p className="text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
            {de
              ? "Jede Schicht unserer Infrastruktur ist darauf ausgelegt, Risiken zu minimieren, bevor sie auftreten."
              : "Every layer of our infrastructure is designed to eliminate risk before it can occur."}
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pillars.map((p) => (
            <div key={p.title} className="bg-[#0f0f30] border border-[#1e1e38] rounded-xl p-6">
              <div className="text-2xl mb-3">{p.icon}</div>
              <h2 className="font-syne font-bold text-base text-white mb-3">{p.title}</h2>
              <ul className="space-y-2">
                {p.points.map((pt) => (
                  <li key={pt} className="text-xs text-gray-400 flex items-start gap-2">
                    <span className="text-[#00d1b2] mt-0.5 flex-shrink-0">✓</span>{pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-[#0f0f30] border border-[#1e1e38] rounded-xl p-6 text-center space-y-3">
          <p className="text-sm text-gray-300 font-syne font-bold">
            {de ? "Sicherheitslücke melden" : "Report a Security Issue"}
          </p>
          <p className="text-xs text-gray-400">
            {de ? "Verantwortungsvolle Offenlegung:" : "Responsible disclosure:"}{" "}
            <a href="mailto:security@apexasset.io" className="text-[#00d1b2] hover:underline">security@apexasset.io</a>
          </p>
        </div>
      </div>
    </main>
  );
}
