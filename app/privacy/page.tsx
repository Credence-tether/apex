import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "../../components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy | Apex",
  description:
    "How Apex collects, uses, shares, and retains personal data, your rights under GDPR and CCPA, cookie usage, and how to contact the Data Protection Officer.",
  keywords: [
    "apex privacy policy",
    "crypto platform privacy",
    "GDPR digital assets",
    "CCPA crypto",
    "data protection officer crypto",
  ],
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Apex Privacy Policy",
    description: "How Apex handles personal data and your rights.",
    url: "/privacy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Apex Privacy Policy",
    description: "How Apex handles personal data and your rights.",
  },

};

const SECTIONS = [
  {
    title: "Data We Collect",
    body: "Identity data (name, date of birth, government ID, photo), contact data (email, address, phone), transaction data (deposits, withdrawals, balances, on-chain addresses), device and log data (IP, user-agent, session events), and any information you provide in support communications.",
  },
  {
    title: "How We Use Data",
    body: "To operate the Platform, verify identity, meet legal obligations (AML/CTF, sanctions, tax reporting), prevent fraud, secure accounts, communicate with you, and improve our service. Each purpose has a documented lawful basis.",
  },
  {
    title: "Sharing",
    body: "We share data with vetted processors (identity verification, communications, infrastructure), with regulators and law enforcement where legally required, and with professional advisers under confidentiality. We do not sell personal data.",
  },
  {
    title: "International Transfers",
    body: "Where data is transferred outside your home jurisdiction, we rely on appropriate safeguards such as Standard Contractual Clauses or equivalent mechanisms.",
  },
  {
    title: "Retention",
    body: "We retain account, transaction, and compliance records for the period required by law (typically a minimum of five years after account closure) and delete or anonymize personal data when no longer required.",
  },
  {
    title: "Your Rights",
    body: "Subject to applicable law, you have rights to access, rectify, delete, restrict, or port your personal data, and to object to certain processing. Submit requests via privacy@apex.example; we respond within the statutory window.",
  },
  {
    title: "Cookies",
    body: "We use strictly-necessary cookies for authentication and security, and limited analytics cookies (where you consent) to improve the Platform. You can manage cookie preferences in your browser.",
  },
  {
    title: "Children",
    body: "Apex is not intended for use by minors. We do not knowingly collect data from children.",
  },
  {
    title: "Contact",
    body: "Data Protection Officer: privacy@apex.example. For complaints, you may also contact your local supervisory authority.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#060613] text-gray-100 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Privacy", href: "/privacy" }]} />
        <header className="space-y-3 border-b border-[#1e1e38] pb-6">
          <p className="text-[10px] sm:text-xs text-[#00d1b2] font-mono uppercase tracking-[0.32em]">
            Privacy
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-syne uppercase tracking-wider leading-tight">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-mono uppercase tracking-widest">
            Effective: January 1, 2026
          </p>
        </header>

        <div className="space-y-6">
          {SECTIONS.map((s) => (
            <section
              key={s.title}
              className="bg-[#0f0f30] border border-[#1e1e38] rounded-xl p-5 sm:p-6 space-y-2"
            >
              <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide">
                {s.title}
              </h2>
              <p className="text-sm text-gray-400 font-light leading-relaxed">
                {s.body}
              </p>
            </section>
          ))}
        </div>

        <p className="text-xs text-gray-500 font-light leading-relaxed">
          See also our{" "}
          <Link href="/terms" className="text-[#00d1b2] hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/compliance" className="text-[#00d1b2] hover:underline">
            Compliance Framework
          </Link>
          .
        </p>
      </div>
    </main>
  );
}