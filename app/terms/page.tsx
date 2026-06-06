import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "../../components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Terms of Service | Apex Digital Asset Management",
  description:
    "Apex Terms of Service: eligibility, account responsibilities, accepted risks, AML/KYC obligations, prohibited jurisdictions, dispute resolution, and governing law.",
  keywords: [
    "crypto terms of service",
    "digital asset platform terms",
    "AML KYC requirements",
    "prohibited jurisdictions crypto",
    "crypto dispute resolution",
  ],
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms of Service | Apex",
    description: "Full regulatory and legal terms governing use of Apex.",
    url: "/terms",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | Apex",
    description: "Full regulatory and legal terms governing use of Apex.",
  },

};

const SECTIONS = [
  {
    id: "1-acceptance",
    title: "1. Acceptance of Terms",
    body: "By creating an account or otherwise using Apex (the &ldquo;Platform&rdquo;), you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;), our Privacy Policy, Risk Disclosure, and Compliance Framework. If you do not agree, you must not access or use the Platform.",
  },
  {
    id: "2-eligibility",
    title: "2. Eligibility",
    body: "You must be at least 18 years old (or the age of majority in your jurisdiction), legally capable of entering into a binding agreement, and not a resident or citizen of any restricted jurisdiction listed in our Compliance Framework. Institutional users must be duly organized and authorized to transact in digital assets.",
  },
  {
    id: "3-account",
    title: "3. Account Registration & Security",
    body: "You are responsible for safeguarding your credentials, enabling multi-factor authentication, and promptly reporting any unauthorized access. You are responsible for all activity that occurs under your account. Apex may suspend or terminate access where security risk is reasonably suspected.",
  },
  {
    id: "4-services",
    title: "4. Services",
    body: "Apex provides custody, yield, and credit services for supported digital assets. Services are provided on an as-available basis. Specific product terms (including target yields, fees, lock-ups, and LTV) are disclosed at the point of opt-in and may be amended with prior notice for new positions.",
  },
  {
    id: "5-risk",
    title: "5. Acknowledged Risks",
    body: "Digital assets are highly volatile and may lose substantial or all value. Target yields are not guaranteed. Smart-contract, counterparty, custodial, regulatory, and operational risks all apply. You confirm you have read the Risk Disclosure and accept that no return is risk-free. Funds held with Apex are NOT protected by FDIC, SIPC, FSCS, or any equivalent deposit-insurance scheme.",
  },
  {
    id: "6-fees",
    title: "6. Fees",
    body: "Applicable fees are disclosed in the Fee Schedule and at the point of transaction. Network/gas fees are passed through at cost. We reserve the right to update fees with at least 30 days&rsquo; notice; existing positions are unaffected for the remainder of their committed term.",
  },
  {
    id: "7-aml",
    title: "7. AML, KYC & Sanctions",
    body: "You agree to provide accurate identification information, beneficial ownership disclosures (where applicable), and source-of-funds evidence on request. You confirm you are not subject to sanctions imposed by the UN, EU, UK, US (OFAC) or equivalent regimes. Apex will report suspicious activity to competent authorities as required by law.",
  },
  {
    id: "8-prohibited",
    title: "8. Prohibited Use",
    body: "You may not use the Platform for money laundering, terrorism financing, sanctions evasion, fraud, market manipulation, unauthorized access, scraping, or any activity that violates applicable law. We may freeze accounts and cooperate with authorities where prohibited use is suspected.",
  },
  {
    id: "9-jurisdictions",
    title: "9. Restricted Jurisdictions",
    body: "Services are not offered to persons or entities located in restricted jurisdictions, including those subject to comprehensive sanctions. The current list is published in our Compliance Framework and may be updated to reflect regulatory changes.",
  },
  {
    id: "10-availability",
    title: "10. Service Availability & Modifications",
    body: "We may modify, suspend, or discontinue any feature with reasonable notice. Scheduled maintenance windows are communicated in advance. We do not warrant uninterrupted or error-free operation, but we maintain documented availability targets and incident response procedures.",
  },
  {
    id: "11-ip",
    title: "11. Intellectual Property",
    body: "All Platform content, software, trademarks, and branding remain the property of Apex or its licensors. You receive a limited, non-exclusive, non-transferable licence to use the Platform for its intended purpose.",
  },
  {
    id: "12-liability",
    title: "12. Limitation of Liability",
    body: "To the maximum extent permitted by law, Apex is not liable for indirect, incidental, special, consequential, or punitive damages, or for lost profits, lost yields, or lost data, arising from your use of the Platform. Nothing in these Terms limits liability that cannot lawfully be limited.",
  },
  {
    id: "13-indemnity",
    title: "13. Indemnity",
    body: "You agree to indemnify Apex and its affiliates against claims, losses, and expenses arising from your breach of these Terms, your violation of law, or your misuse of the Platform.",
  },
  {
    id: "14-disputes",
    title: "14. Dispute Resolution & Governing Law",
    body: "These Terms are governed by the laws of the jurisdiction stated in your account agreement. Disputes will first be addressed in good-faith negotiation; unresolved disputes will be referred to binding arbitration under the rules specified there, except where mandatory consumer-protection laws require otherwise.",
  },
  {
    id: "15-changes",
    title: "15. Changes to Terms",
    body: "We may update these Terms. Material changes will be communicated by email and on-platform notice at least 14 days before they take effect. Continued use after the effective date constitutes acceptance.",
  },
  {
    id: "16-contact",
    title: "16. Contact",
    body: "Questions about these Terms can be sent to legal@apex.example or via the contact page.",
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#060613] text-gray-100 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Terms of Service", href: "/terms" }]} />
        <header className="space-y-3 border-b border-[#1e1e38] pb-6">
          <p className="text-[10px] sm:text-xs text-[#00d1b2] font-mono uppercase tracking-[0.32em]">
            Legal / Regulatory Terms
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-syne uppercase tracking-wider leading-tight">
            Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-mono uppercase tracking-widest">
            Effective: January 1, 2026
          </p>
        </header>

        <nav
          aria-label="Table of contents"
          className="bg-[#0f0f30] border border-[#1e1e38] rounded-xl p-4 sm:p-5"
        >
          <p className="text-xs text-[#00d1b2] font-mono uppercase tracking-widest mb-3">
            Jump to
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-gray-400 hover:text-[#00d1b2] transition-colors"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-8">
          {SECTIONS.map((s) => (
            <section key={s.id} id={s.id} className="space-y-2 scroll-mt-24">
              <h2 className="text-base sm:text-lg font-bold text-white font-syne uppercase tracking-wide">
                {s.title}
              </h2>
              <p
                className="text-sm text-gray-400 font-light leading-relaxed"
                dangerouslySetInnerHTML={{ __html: s.body }}
              />
            </section>
          ))}
        </div>

        <footer className="text-xs text-gray-500 font-mono leading-relaxed border-t border-[#1e1e38] pt-6">
          Nothing on this page constitutes financial, legal, or tax advice.
          Consult a qualified professional before making investment decisions.
          See the{" "}
          <Link href="/risk" className="text-[#00d1b2] hover:underline">
            risk disclosure
          </Link>{" "}
          and{" "}
          <Link
            href="/compliance"
            className="text-[#00d1b2] hover:underline"
          >
            compliance framework
          </Link>
          .
        </footer>
      </div>
    </main>
  );
}