import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "../../components/Breadcrumbs";

export const metadata: Metadata = {
  title: "FAQ | Apex Digital Asset Management",
  description:
    "Answers to common questions about Apex: account opening, deposits, withdrawals, target yields, custody, security, crypto-backed loans, taxes, and supported jurisdictions.",
  keywords: [
    "apex faq",
    "crypto yield FAQ",
    "crypto custody FAQ",
    "crypto loan questions",
    "digital asset taxes",
  ],
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "Apex FAQ",
    description: "Answers to common questions about accounts, yield, custody and loans.",
    url: "/faq",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Apex FAQ",
    description: "Answers to common questions about accounts, yield, custody and loans.",
  },

};

const GROUPS: { heading: string; items: { q: string; a: string }[] }[] = [
  {
    heading: "Accounts",
    items: [
      {
        q: "Who can open an Apex account?",
        a: "Adults in eligible jurisdictions who pass our identity verification (KYC) and sanctions screening. See the Compliance Framework for the current restricted-jurisdiction list.",
      },
      {
        q: "What documents do I need?",
        a: "Government-issued photo ID and proof of address. Institutional accounts also need entity formation documents and beneficial ownership disclosures.",
      },
      {
        q: "How long does verification take?",
        a: "Most individual accounts are verified within one business day. Institutional accounts typically take 3–5 business days.",
      },
    ],
  },
  {
    heading: "Yield & Deposits",
    items: [
      {
        q: "Are the advertised APYs guaranteed?",
        a: "No. Published rates are targets based on current strategy parameters and historical performance. Actual returns vary with market conditions and are not guaranteed.",
      },
      {
        q: "When do I start earning?",
        a: "Allocation typically begins on the next settlement cycle after your deposit clears. Lock-up periods, where applicable, are disclosed at the point of opt-in.",
      },
      {
        q: "Can I add to a position?",
        a: "Yes. Additional deposits to an existing strategy start earning from the next settlement cycle and do not reset existing lock-up timers.",
      },
    ],
  },
  {
    heading: "Withdrawals",
    items: [
      {
        q: "How quickly can I withdraw?",
        a: "Standard withdrawals to allow-listed addresses are processed within one business day. Newly added addresses are subject to a 24-hour cool-down for security.",
      },
      {
        q: "What about positions under lock-up?",
        a: "Locked positions can be withdrawn at maturity. Early redemption is available case-by-case for institutional accounts and may incur a published unwind fee.",
      },
    ],
  },
  {
    heading: "Security & Custody",
    items: [
      {
        q: "Where are my assets held?",
        a: "Over 95% of client reserves sit in geographically distributed, multi-signature cold storage. Operational keys live in FIPS-validated hardware security modules.",
      },
      {
        q: "Are funds insured?",
        a: "Funds held with Apex are not protected by FDIC, SIPC, FSCS, or equivalent deposit insurance. We do maintain commercial crime and cyber policies; details are shared with institutional clients under NDA.",
      },
      {
        q: "Do you publish proof of reserves?",
        a: "Yes. We publish a quarterly proof-of-reserves attestation listing on-chain wallet balances against aggregate client liabilities, signed by an independent firm.",
      },
    ],
  },
  {
    heading: "Loans",
    items: [
      {
        q: "How are loans collateralized?",
        a: "Every credit line is over-collateralized by the client&rsquo;s own portfolio held in cold custody. No client assets are lent to third parties.",
      },
      {
        q: "What happens if my collateral drops in value?",
        a: "You receive email and in-platform alerts with a configurable top-up window. Partial liquidations only occur if LTV crosses the published threshold and the window expires.",
      },
    ],
  },
  {
    heading: "Taxes",
    items: [
      {
        q: "Does Apex provide tax documents?",
        a: "We provide downloadable transaction histories and, where applicable, jurisdiction-specific summaries. Apex does not provide tax advice; consult a qualified professional.",
      },
    ],
  },
];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: GROUPS.flatMap((g) =>
      g.items.map((i) => ({
        "@type": "Question",
        name: i.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: i.a.replace(/&rsquo;/g, "\u2019"),
        },
      }))
    ),
  };

  return (
    <main className="min-h-screen bg-[#060613] text-gray-100 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "FAQ", href: "/faq" }]} />
        <header className="space-y-3 border-b border-[#1e1e38] pb-6">
          <p className="text-[10px] sm:text-xs text-[#00d1b2] font-mono uppercase tracking-[0.32em]">
            Help / Frequently Asked
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-syne uppercase tracking-wider leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-gray-400 font-light leading-relaxed max-w-3xl">
            Quick answers to common questions about accounts, yield, custody,
            and credit. Can&rsquo;t find what you need? Visit the{" "}
            <Link href="/contact" className="text-[#00d1b2] hover:underline">
              contact page
            </Link>
            .
          </p>
        </header>

        <div className="space-y-10">
          {GROUPS.map((g) => (
            <section key={g.heading} className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white font-syne uppercase tracking-wide">
                {g.heading}
              </h2>
              <div className="space-y-3">
                {g.items.map((i, idx) => (
                  <details
                    key={idx}
                    className="group bg-[#0f0f30] border border-[#1e1e38] rounded-xl"
                  >
                    <summary className="cursor-pointer list-none flex items-start justify-between gap-4 p-4 sm:p-5 text-sm sm:text-base text-white font-semibold">
                      <span>{i.q}</span>
                      <span className="text-[#00d1b2] font-mono text-lg leading-none mt-0.5 transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <div
                      className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm text-gray-400 font-light leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: i.a }}
                    />
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}