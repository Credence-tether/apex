"use client";
import { useLocale } from "../../lib/locale-context";

export default function TermsContent() {
  const { locale } = useLocale();
  const de = locale === "de";

  return (
    <main className="min-h-screen bg-[#060613] text-gray-100">
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
        <header className="space-y-3">
          <p className="text-xs text-[#00d1b2] font-mono uppercase tracking-[0.3em]">
            {de ? "Rechtliches" : "Legal"}
          </p>
          <h1 className="font-syne text-3xl font-extrabold text-white uppercase tracking-wide">
            {de ? "Nutzungsbedingungen" : "Terms of Service"}
          </h1>
          <p className="text-xs text-gray-500">{de ? "Zuletzt aktualisiert: Januar 2026" : "Last updated: January 2026"}</p>
        </header>

        <div className="space-y-6 text-sm text-gray-400 leading-relaxed">
          {de ? (
            <>
              <section className="space-y-2">
                <h2 className="text-base font-bold text-gray-200">1. Zulassung</h2>
                <p>Apex-Dienste stehen ausschließlich Nutzern ab 18 Jahren in zugelassenen Jurisdiktionen zur Verfügung, die unsere KYC/AML-Prüfung bestanden haben. US-Personen sind derzeit ausgeschlossen.</p>
              </section>
              <section className="space-y-2">
                <h2 className="text-base font-bold text-gray-200">2. Angebotene Dienste</h2>
                <p>Apex bietet strukturierte Renditepläne, asset-gedeckte Kreditlinien und damit verbundene Verwahrungsdienstleistungen an. Alle Renditen sind Zielwerte und keine Garantien.</p>
              </section>
              <section className="space-y-2">
                <h2 className="text-base font-bold text-gray-200">3. Gebühren</h2>
                <p>Aktuelle Gebühren sind auf unserer <a href="/fees" className="text-[#00d1b2]">Gebührenseite</a> veröffentlicht. Änderungen werden 14 Tage im Voraus angekündigt.</p>
              </section>
              <section className="space-y-2">
                <h2 className="text-base font-bold text-gray-200">4. Pflichten des Nutzers</h2>
                <p>Sie verpflichten sich, keine Gelder aus illegalen Quellen einzuzahlen, keine Manipulation oder Missbrauch der Plattform zu betreiben und uns bei KYC/AML-Anfragen zu unterstützen.</p>
              </section>
              <section className="space-y-2">
                <h2 className="text-base font-bold text-gray-200">5. Haftungsbeschränkung</h2>
                <p>Apex haftet nicht für Verluste, die auf Marktvolatilität, höhere Gewalt, regulatorische Änderungen oder Netzwerkausfälle zurückzuführen sind.</p>
              </section>
              <section className="space-y-2">
                <h2 className="text-base font-bold text-gray-200">6. Streitbeilegung</h2>
                <p>Streitigkeiten werden zunächst im Wege der Mediation beigelegt. Gerichtsstand ist nach Wahl von Apex.</p>
              </section>
            </>
          ) : (
            <>
              <section className="space-y-2">
                <h2 className="text-base font-bold text-gray-200">1. Eligibility</h2>
                <p>Apex services are available only to users aged 18+ in eligible jurisdictions who have passed our KYC/AML review. US persons are currently excluded.</p>
              </section>
              <section className="space-y-2">
                <h2 className="text-base font-bold text-gray-200">2. Services Offered</h2>
                <p>Apex provides structured yield plans, asset-backed credit lines, and associated custody services. All yields are targets, not guarantees.</p>
              </section>
              <section className="space-y-2">
                <h2 className="text-base font-bold text-gray-200">3. Fees</h2>
                <p>Current fees are published on our <a href="/fees" className="text-[#00d1b2]">fees page</a>. Changes are communicated 14 days in advance.</p>
              </section>
              <section className="space-y-2">
                <h2 className="text-base font-bold text-gray-200">4. User Responsibilities</h2>
                <p>You agree not to deposit funds from illegal sources, not to manipulate or abuse the platform, and to cooperate with KYC/AML requests.</p>
              </section>
              <section className="space-y-2">
                <h2 className="text-base font-bold text-gray-200">5. Limitation of Liability</h2>
                <p>Apex is not liable for losses resulting from market volatility, force majeure, regulatory changes, or network outages.</p>
              </section>
              <section className="space-y-2">
                <h2 className="text-base font-bold text-gray-200">6. Dispute Resolution</h2>
                <p>Disputes will first be addressed through mediation. Jurisdiction is at Apex's election.</p>
              </section>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
