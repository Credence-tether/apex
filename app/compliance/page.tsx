import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "../../components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Compliance Framework | Apex KYC, AML & Sanctions Program",
  description:
    "Apex&rsquo;s compliance program: KYC/CDD onboarding, AML monitoring, sanctions screening, Travel Rule alignment, GDPR/CCPA data protection, restricted jurisdictions and records retention.",
  keywords: [
    "crypto compliance",
    "crypto KYC AML",
    "FATF Travel Rule crypto",
    "sanctions screening crypto",
    "GDPR crypto platform",
  ],
  alternates: { canonical: "/compliance" },
  openGraph: {
    title: "Apex Compliance Framework",
    description: "KYC, AML, sanctions, Travel Rule and data-protection program.",
    url: "/compliance",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Apex Compliance Framework",
    description: "KYC, AML, sanctions, Travel Rule and data-protection program.",
  },

};

const PILLARS = [
  {
    title: "KYC & Customer Due Diligence",
    body: "Risk-based onboarding for individuals and institutions, including identity verification, beneficial ownership disclosure where applicable, PEP screening, and ongoing review.",
  },
  {
    title: "AML Transaction Monitoring",
    body: "Automated monitoring against typologies for layering, structuring, and high-risk counterparties, with human review and Suspicious Activity Reporting where required by law.",
  },
  {
    title: "Sanctions Screening",
    body: "Continuous screening against UN, EU, UK (OFSI), US (OFAC) and equivalent lists for accounts, beneficial owners, and counterparties.",
  },
  {
    title: "FATF Travel Rule",
    body: "Where applicable, Apex transmits originator/beneficiary information for qualifying virtual asset transfers via supported Travel Rule networks.",
  },
  {
    title: "Data Protection (GDPR / CCPA)",
    body: "Lawful basis recorded for each processing purpose, data minimization, subject-rights handling within statutory windows, and documented data-retention schedules.",
  },
  {
    title: "Records Retention",
    body: "Account, transaction, and compliance records are retained for the period required by applicable law (typically a minimum of five years after account closure).",
  },
];

const RESTRICTED = [
  "Sanctioned jurisdictions under UN, EU, UK or US comprehensive sanctions programs.",
  "Jurisdictions where digital asset services are prohibited or require a licence Apex does not hold.",
  "Specific US states pending state-level registration; verified during onboarding.",
];

export default function CompliancePage() {
  return (
    <main className="min-h-screen bg-[#060613] text-gray-100 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Compliance", href: "/compliance" }]} />
        <header className="space-y-3 border-b border-[#1e1e38] pb-6">
          <p className="text-[10px] sm:text-xs text-[#00d1b2] font-mono uppercase tracking-[0.32em]">
            Compliance / Program
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-syne uppercase tracking-wider leading-tight">
            Compliance Framework
          </h1>
          <p className="text-sm sm:text-base text-gray-400 font-light leading-relaxed max-w-3xl">
            Apex operates a documented compliance program aligned with FATF
            recommendations and applicable national regulation. The summary
            below sets out the program&rsquo;s pillars and current scope.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {PILLARS.map((p) => (
            <div
              key={p.title}
              className="bg-[#0f0f30] border border-[#1e1e38] rounded-xl p-5 sm:p-6"
            >
              <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide mb-2">
                {p.title}
              </h2>
              <p className="text-sm text-gray-400 font-light leading-relaxed">
                {p.body}
              </p>
            </div>
          ))}
        </section>

        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-syne uppercase tracking-wide">
            Restricted Jurisdictions
          </h2>
          <ul className="space-y-2">
            {RESTRICTED.map((r) => (
              <li
                key={r}
                className="flex items-start gap-3 bg-[#0f0f30] border border-[#1e1e38] rounded-lg px-4 py-3"
              >
                <span className="text-[#00d1b2] font-mono text-xs mt-0.5">
                  &#9888;
                </span>
                <span className="text-sm text-gray-300 font-light">{r}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-500 font-light leading-relaxed">
            The restricted list is updated to reflect regulatory changes. The
            authoritative list is enforced during onboarding; if you can open
            an account, you are eligible at that time.
          </p>
        </section>

        <section className="bg-[#0f0f30] border border-[#1e1e38] rounded-xl p-5 sm:p-6 space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide">
            Reporting Concerns
          </h2>
          <p className="text-sm text-gray-400 font-light leading-relaxed">
            To report a compliance concern, contact{" "}
            <span className="text-[#00d1b2] font-mono">
              compliance@apex.example
            </span>
            . Law enforcement requests should be sent to the same address with
            appropriate legal process. See the{" "}
            <Link href="/privacy" className="text-[#00d1b2] hover:underline">
              Privacy Policy
            </Link>{" "}
            for data-subject rights.
          </p>
        </section>
      </div>
    </main>
  );
}