"use client";
import { useState } from "react";
import { useLocale } from "../../lib/locale-context";

const FAQS = {
  en: [
    { q: "How do I open an account?", a: "Click 'Sign Up', complete KYC verification (usually under 10 minutes), deposit funds, and select a yield plan." },
    { q: "What is the minimum investment?", a: "The Starter plan begins at $300. Higher tiers unlock credit lines and priority support." },
    { q: "When are yields paid out?", a: "Yields are calculated daily and distributed weekly within your plan's settlement window. There is no fixed day — payouts are processed within 7 days of each settlement date." },
    { q: "Can I withdraw before maturity?", a: "Yes. An early withdrawal fee of 2.0% applies. Your principal and accrued yield (minus the fee) are returned to your wallet." },
    { q: "Is my capital insured?", a: "Apex is not a bank. Your funds are not covered by FDIC, SIPC, or equivalent deposit insurance. We mitigate risk through cold custody, over-collateralization, and conservative yield strategies." },
    { q: "How do crypto-backed loans work?", a: "Investors on the $1,000+ tier can draw a credit line of up to 50% of their portfolio value. Your assets remain in custody and continue earning yield while the loan is active." },
    { q: "What cryptocurrencies do you accept?", a: "BTC, ETH, USDT, and USDC. Additional assets may be available — contact your advisor." },
    { q: "How do I report a security issue?", a: "Email security@apexasset.io with details. We have a responsible disclosure policy and a bug bounty program." },
  ],
  de: [
    { q: "Wie eröffne ich ein Konto?", a: "Klicken Sie auf 'Registrieren', schließen Sie die KYC-Verifizierung ab (in der Regel unter 10 Minuten), zahlen Sie Kapital ein und wählen Sie einen Renditeplan." },
    { q: "Wie hoch ist die Mindestanlage?", a: "Der Einstiegsplan beginnt bei 300 $. Höhere Stufen schalten Kreditlinien und bevorzugten Support frei." },
    { q: "Wann werden Renditen ausgezahlt?", a: "Renditen werden täglich berechnet und wöchentlich innerhalb des Abrechnungsfensters Ihres Plans ausgezahlt. Es gibt keinen festen Wochentag — Auszahlungen erfolgen innerhalb von 7 Tagen nach jedem Abrechnungsdatum." },
    { q: "Kann ich vor Fälligkeit auszahlen?", a: "Ja. Es fällt eine Vorfälligkeitsgebühr von 2,0 % an. Ihr Kapital und die aufgelaufene Rendite (abzüglich der Gebühr) werden an Ihre Wallet zurückgesendet." },
    { q: "Ist mein Kapital versichert?", a: "Apex ist keine Bank. Ihre Gelder sind nicht durch gesetzliche Einlagensicherungssysteme abgedeckt. Wir mindern Risiken durch Cold-Storage-Verwahrung, Überbesicherung und konservative Renditestrategien." },
    { q: "Wie funktionieren krypto-gedeckte Kredite?", a: "Anleger ab der 1.000-$-Stufe können eine Kreditlinie von bis zu 50 % ihres Portfoliowerts in Anspruch nehmen. Ihre Assets bleiben verwahrt und erwirtschaften weiterhin Rendite." },
    { q: "Welche Kryptowährungen akzeptieren Sie?", a: "BTC, ETH, USDT und USDC. Weitere Assets können verfügbar sein — kontaktieren Sie Ihren Berater." },
    { q: "Wie melde ich eine Sicherheitslücke?", a: "Senden Sie eine E-Mail an security@apexasset.io mit Details. Wir haben eine Responsible-Disclosure-Richtlinie und ein Bug-Bounty-Programm." },
  ],
};

export default function FaqContent() {
  const { locale } = useLocale();
  const de = locale === "de";
  const faqs = de ? FAQS.de : FAQS.en;
  const [open, setOpen] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-[#060613] text-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-16 space-y-8">
        <header className="text-center space-y-3">
          <p className="text-xs text-[#00d1b2] font-mono uppercase tracking-[0.3em]">
            {de ? "Häufige Fragen" : "Frequently Asked Questions"}
          </p>
          <h1 className="font-syne text-3xl font-extrabold text-white uppercase tracking-wide">FAQ</h1>
        </header>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-[#0f0f30] border border-[#1e1e38] rounded-xl overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left px-5 py-4 flex justify-between items-center gap-3">
                <span className="text-sm font-medium text-gray-200">{faq.q}</span>
                <span className="text-[#00d1b2] text-lg flex-shrink-0">{open === i ? "−" : "+"}</span>
              </button>
              {open === i && (
                <div className="px-5 pb-4 text-sm text-gray-400 leading-relaxed border-t border-[#1e1e38] pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500 mb-3">
            {de ? "Weitere Fragen?" : "Still have questions?"}
          </p>
          <a href="/contact" className="inline-block text-sm text-[#00d1b2] border border-[#00d1b2]/30 px-6 py-2 rounded-lg hover:bg-[#00d1b2]/10 transition-all">
            {de ? "Beratung anfragen →" : "Contact an Advisor →"}
          </a>
        </div>
      </div>
    </main>
  );
}
