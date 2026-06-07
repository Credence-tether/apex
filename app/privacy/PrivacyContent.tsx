"use client";
import { useLocale } from "../../lib/locale-context";

export default function PrivacyContent() {
  const { locale } = useLocale();
  const de = locale === "de";

  return (
    <main className="min-h-screen bg-[#060613] text-gray-100">
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
        <header className="space-y-3">
          <p className="text-xs text-[#00d1b2] font-mono uppercase tracking-[0.3em]">
            {de ? "Datenschutz" : "Privacy"}
          </p>
          <h1 className="font-syne text-3xl font-extrabold text-white uppercase tracking-wide">
            {de ? "Datenschutzerklärung" : "Privacy Policy"}
          </h1>
          <p className="text-xs text-gray-500">{de ? "Zuletzt aktualisiert: Januar 2026" : "Last updated: January 2026"}</p>
        </header>

        <div className="space-y-6 text-sm text-gray-400 leading-relaxed">
          {de ? (
            <>
              <section className="space-y-2">
                <h2 className="text-base font-bold text-gray-200">1. Erhobene Daten</h2>
                <p>Wir erheben Daten, die Sie uns direkt mitteilen (Name, E-Mail, Ausweis für KYC), Nutzungsdaten (IP-Adresse, Browser, besuchte Seiten) und Transaktionsdaten (Einzahlungen, Auszahlungen, Wallet-Adressen).</p>
              </section>
              <section className="space-y-2">
                <h2 className="text-base font-bold text-gray-200">2. Verwendung der Daten</h2>
                <p>Ihre Daten werden verwendet zur Kontoführung, Erfüllung gesetzlicher KYC/AML-Pflichten, Erbringung unserer Dienstleistungen und — mit Ihrer Einwilligung — für Marketing-Kommunikation.</p>
              </section>
              <section className="space-y-2">
                <h2 className="text-base font-bold text-gray-200">3. Weitergabe an Dritte</h2>
                <p>Wir verkaufen Ihre Daten nicht. Weitergaben erfolgen nur an Dienstleister (z.B. KYC-Anbieter), wenn gesetzlich vorgeschrieben, oder mit Ihrer ausdrücklichen Einwilligung.</p>
              </section>
              <section className="space-y-2">
                <h2 className="text-base font-bold text-gray-200">4. Ihre Rechte (DSGVO)</h2>
                <p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Kontakt: <a href="mailto:privacy@apexasset.io" className="text-[#00d1b2]">privacy@apexasset.io</a></p>
              </section>
              <section className="space-y-2">
                <h2 className="text-base font-bold text-gray-200">5. Cookies</h2>
                <p>Wir verwenden ausschließlich funktionale Cookies (Sitzung, Spracheinstellung). Keine Werbe- oder Tracking-Cookies von Drittanbietern.</p>
              </section>
              <section className="space-y-2">
                <h2 className="text-base font-bold text-gray-200">6. Datenspeicherung</h2>
                <p>KYC-Daten werden gemäß gesetzlicher Vorgaben 5 Jahre nach Kontoschließung aufbewahrt. Andere Daten werden auf Anfrage oder nach 24 Monaten Inaktivität gelöscht.</p>
              </section>
            </>
          ) : (
            <>
              <section className="space-y-2">
                <h2 className="text-base font-bold text-gray-200">1. Data We Collect</h2>
                <p>We collect data you provide directly (name, email, ID for KYC), usage data (IP address, browser, pages visited), and transaction data (deposits, withdrawals, wallet addresses).</p>
              </section>
              <section className="space-y-2">
                <h2 className="text-base font-bold text-gray-200">2. How We Use Data</h2>
                <p>Your data is used to operate your account, fulfill legal KYC/AML obligations, deliver our services, and — with your consent — send marketing communications.</p>
              </section>
              <section className="space-y-2">
                <h2 className="text-base font-bold text-gray-200">3. Third-Party Sharing</h2>
                <p>We do not sell your data. Sharing occurs only with service providers (e.g. KYC vendors), when legally required, or with your explicit consent.</p>
              </section>
              <section className="space-y-2">
                <h2 className="text-base font-bold text-gray-200">4. Your Rights (GDPR / CCPA)</h2>
                <p>You have the right to access, correct, delete, restrict processing, port your data, and object to processing. Contact: <a href="mailto:privacy@apexasset.io" className="text-[#00d1b2]">privacy@apexasset.io</a></p>
              </section>
              <section className="space-y-2">
                <h2 className="text-base font-bold text-gray-200">5. Cookies</h2>
                <p>We use only functional cookies (session, language preference). No third-party advertising or tracking cookies.</p>
              </section>
              <section className="space-y-2">
                <h2 className="text-base font-bold text-gray-200">6. Data Retention</h2>
                <p>KYC data is retained for 5 years after account closure per legal requirements. Other data is deleted on request or after 24 months of inactivity.</p>
              </section>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
