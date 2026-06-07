"use client";
import Link from "next/link";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useLocale } from "../../lib/locale-context";

const PRINCIPLES = {
  en: [
    { title: "Custody First", body: "95%+ of client funds are held in independently audited, multi-signature cold storage. Hot-wallet exposure is rate-limited and continuously monitored." },
    { title: "Transparent Operations", body: "On-chain attestations and quarterly proof-of-reserves reports give clients verifiable visibility into balances, flows, and counterparty exposure." },
    { title: "Risk Before Return", body: "Every strategy is screened against a published risk matrix. We accept lower target yields when the alternative is opaque counterparty or smart-contract risk." },
    { title: "Regulatory Posture", body: "We operate under a KYC/AML/CTF program aligned with FATF guidance, with sanctions screening, source-of-funds checks, and jurisdiction-aware onboarding." },
  ],
  de: [
    { title: "Verwahrung zuerst", body: "Über 95 % der Kundengelder werden in unabhängig geprüften Multi-Signatur-Cold-Wallets verwahrt. Das Hot-Wallet-Exposure ist begrenzt und wird kontinuierlich überwacht." },
    { title: "Transparenter Betrieb", body: "On-Chain-Bestätigungen und vierteljährliche Proof-of-Reserves-Berichte geben Kunden nachprüfbare Einblicke in Guthaben, Transaktionen und Gegenparteirisiken." },
    { title: "Risiko vor Rendite", body: "Jede Strategie wird gegen eine veröffentlichte RisikoMatrix geprüft. Wir akzeptieren niedrigere Zielrenditen, wenn die Alternative unklare Gegenpartei- oder Smart-Contract-Risiken birgt." },
    { title: "Regulatorische Haltung", body: "Wir betreiben ein KYC/AML/CTF-Programm gemäß FATF-Leitlinien, mit Sanktionsprüfungen, Herkunftsnachweisen und jurisdiktionsbewusstem Onboarding." },
  ],
};

const MILESTONES = {
  en: [
    { year: "2022", text: "Apex formed by a team of former prime-brokerage and protocol-engineering operators." },
    { year: "2023", text: "Cold-storage custody architecture deployed; first independent penetration test completed." },
    { year: "2024", text: "Public quarterly proof-of-reserves attestations begin; bug bounty program launched." },
    { year: "2025", text: "SOC 2 Type I readiness program; institutional credit desk goes live." },
    { year: "2026", text: "Targeting SOC 2 Type II report and expansion into regulated jurisdictions." },
  ],
  de: [
    { year: "2022", text: "Apex gegründet von einem Team ehemaliger Prime-Brokerage- und Protokoll-Engineering-Experten." },
    { year: "2023", text: "Cold-Storage-Verwahrungsarchitektur deployed; erster unabhängiger Penetrationstest abgeschlossen." },
    { year: "2024", text: "Vierteljährliche Proof-of-Reserves-Bestätigungen gestartet; Bug-Bounty-Programm eingeführt." },
    { year: "2025", text: "SOC-2-Typ-I-Bereitschaftsprogramm; institutioneller Kreditdesk live." },
    { year: "2026", text: "Angestrebter SOC-2-Typ-II-Bericht und Expansion in regulierte Jurisdiktionen." },
  ],
};

export default function AboutContent() {
  const { locale } = useLocale();
  const de = locale === "de";
  const principles = de ? PRINCIPLES.de : PRINCIPLES.en;
  const milestones = de ? MILESTONES.de : MILESTONES.en;

  return (
    <main className="min-h-screen bg-[#060613] text-gray-100 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        <Breadcrumbs items={[
          { name: de ? "Startseite" : "Home", href: "/" },
          { name: de ? "Über uns" : "About", href: "/about" },
        ]} />

        <header className="space-y-4">
          <p className="text-[10px] sm:text-xs text-[#00d1b2] font-mono uppercase tracking-[0.32em]">
            {de ? "Unternehmen / Betriebsarchitektur" : "Company / Operating Architecture"}
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-syne uppercase tracking-wider leading-tight">
            {de
              ? "Verlässliche Infrastruktur für digitales Asset-Management"
              : "Building Defensible Infrastructure for Digital Asset Management"}
          </h1>
          <p className="text-sm sm:text-base text-gray-400 font-light leading-relaxed max-w-3xl">
            {de
              ? "Apex ist eine Enterprise-Plattform für die Verwahrung digitaler Assets, strukturierte Renditen und asset-gedeckte Kredite. Wir bieten seriösen Investoren eine Alternative zu intransparenten Retail-Krypto-Produkten — aufgebaut auf Cold-Storage-Verwahrung, unabhängigen Bestätigungen und konservativen Risikorahmen."
              : "Apex is an enterprise platform for digital asset custody, structured yield, and asset-backed credit. We exist to give serious allocators an alternative to opaque, retail-grade crypto products — built on cold-storage custody, independent attestations, and conservative risk frameworks."}
          </p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {principles.map((p) => (
            <div key={p.title} className="bg-[#0f0f30] border border-[#1e1e38] rounded-xl p-5 sm:p-6">
              <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide mb-2">{p.title}</h2>
              <p className="text-sm text-gray-400 font-light leading-relaxed">{p.body}</p>
            </div>
          ))}
        </section>

        <section className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-syne uppercase tracking-wide">
            {de ? "Wie Apex arbeitet" : "How Apex Operates"}
          </h2>
          <div className="space-y-4 text-sm sm:text-base text-gray-400 font-light leading-relaxed">
            {de ? (
              <>
                <p>Apex betreibt einen standardmäßig nicht-verwahrenden Software-Stack: Kundenkapital wird getrennt gehalten, wo möglich on-chain verfolgt und niemals mit Betriebsmitteln vermischt. Tresorybewegungen über festgelegte Schwellenwerte erfordern eine Mehrparteien-Autorisierung und hinterlassen einen unveränderlichen Prüfpfad.</p>
                <p>Renditestrategien sind auf ein veröffentlichtes Universum marktneutraler Aktivitäten beschränkt — hauptsächlich Liquiditätsbereitstellung in geprüften automatisierten Market-Makern und konservativen Festzinsäquivalenten. Wir betreiben keine Richtungsspekulation, unbesicherte Kreditvergabe oder Rehypothekierung von Kundenvermögen.</p>
                <p>Kreditlinien sind bei konservativen LTV-Quoten gegen das eigene Portfolio des Kunden überbesichert. Es gibt keinen Weg, durch den die Kreditaufnahme eines Kunden die Verwahrung eines anderen Kunden gefährdet.</p>
              </>
            ) : (
              <>
                <p>Apex runs a non-custodial-by-default software stack: client capital is segregated, tracked on-chain where possible, and never co-mingled with operating funds. Treasury movements above pre-set thresholds require multi-party authorization and produce an immutable audit trail.</p>
                <p>Yield strategies are restricted to a published universe of market-neutral activities — primarily liquidity provision in vetted automated market makers and conservative fixed-income equivalents. We do not engage in directional speculation, uncollateralized lending, or rehypothecation of client assets.</p>
                <p>Credit lines are over-collateralized at conservative LTV ratios against the client's own portfolio. There is no path by which one client's borrowing puts another client's custody at risk.</p>
              </>
            )}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-syne uppercase tracking-wide">
            {de ? "Meilensteine" : "Milestones"}
          </h2>
          <ol className="relative border-l border-[#1e1e38] pl-6 space-y-6">
            {milestones.map((m) => (
              <li key={m.year} className="relative">
                <span className="absolute -left-[31px] top-1 inline-flex h-3 w-3 rounded-full bg-[#00d1b2]/70 ring-4 ring-[#060613]" />
                <p className="text-xs font-mono text-[#00d1b2] uppercase tracking-widest">{m.year}</p>
                <p className="text-sm text-gray-300 font-light leading-relaxed mt-1">{m.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="bg-[#0f0f30] border border-[#1e1e38] rounded-xl p-5 sm:p-6 space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide">
            {de ? "Wichtiger Hinweis" : "Important Notice"}
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed">
            {de
              ? <>Apex-Dienste richten sich an Nutzer in zugelassenen Jurisdiktionen, die unsere Onboarding-Anforderungen erfüllen. Digitale Assets sind volatil und können an Wert verlieren. Renditeangaben auf dieser Website sind Zielwerte, keine Garantien, und sind nicht durch staatliche Einlagensicherungssysteme geschützt. Bitte lesen Sie unsere <Link href="/risk" className="text-[#00d1b2] hover:underline">Risikohinweise</Link>, <Link href="/terms" className="text-[#00d1b2] hover:underline">Nutzungsbedingungen</Link> und unser <Link href="/compliance" className="text-[#00d1b2] hover:underline">Compliance-Framework</Link> vor der Kontoeröffnung.</>
              : <>Apex services are intended for users in eligible jurisdictions who satisfy our onboarding requirements. Digital assets are volatile and may lose value. Yield figures shown elsewhere on this site are targets, not guarantees, and are not protected by FDIC, SIPC, or equivalent deposit insurance schemes. Please read our <Link href="/risk" className="text-[#00d1b2] hover:underline">risk disclosure</Link>, <Link href="/terms" className="text-[#00d1b2] hover:underline">terms</Link>, and <Link href="/compliance" className="text-[#00d1b2] hover:underline">compliance framework</Link> before opening an account.</>
            }
          </p>
        </section>
      </div>
    </main>
  );
}
