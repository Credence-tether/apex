import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "../../components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Risk Disclosure | Apex Digital Asset Management",
  description:
    "Plain-language disclosure of the market, smart-contract, counterparty, custodial, regulatory, liquidity and operational risks of using Apex. Required reading before opening an account.",
  keywords: [
    "crypto risk disclosure",
    "digital asset risk",
    "smart contract risk",
    "counterparty risk crypto",
    "crypto regulatory risk",
  ],
  alternates: { canonical: "/risk" },
  openGraph: {
    title: "Apex Risk Disclosure",
    description: "Required-reading disclosure of all material risks of using Apex.",
    url: "/risk",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Apex Risk Disclosure",
    description: "Required-reading disclosure of all material risks of using Apex.",
  },

};

const RISKS = [
  {
    title: "Market Risk",
    body: "Digital asset prices can move sharply, including to zero. Yield strategies do not eliminate market exposure and can underperform or lose value during volatile periods.",
  },
  {
    title: "Smart-Contract Risk",
    body: "On-chain strategies depend on third-party smart contracts that may contain bugs, be subject to governance attacks, or behave unexpectedly under stress.",
  },
  {
    title: "Counterparty Risk",
    body: "Where Apex interacts with venues, market-makers, oracles, or custodial partners, the failure of those parties can cause loss even when our own controls operate correctly.",
  },
  {
    title: "Custodial Risk",
    body: "Custody controls are designed to be robust but are not infallible. Key compromise, insider risk, or operational error can in principle result in loss.",
  },
  {
    title: "Regulatory Risk",
    body: "Digital asset regulation is evolving. New rules may restrict products, require additional disclosures, change tax treatment, or limit availability in your jurisdiction.",
  },
  {
    title: "Liquidity Risk",
    body: "During market stress, withdrawal queues, lock-ups, or on-chain congestion can delay redemption. Some strategies have explicit lock-up periods disclosed at opt-in.",
  },
  {
    title: "Operational & Cyber Risk",
    body: "Cyber attacks, infrastructure outages, third-party software failures, and human error can affect availability and, in rare cases, accuracy of balances during incident windows.",
  },
  {
    title: "Credit / Liquidation Risk (Loans)",
    body: "Asset-backed credit lines use volatile collateral. If collateral value falls and is not topped up within the published window, collateral can be partially or fully liquidated.",
  },
];

export default function RiskPage() {
  return (
    <main className="min-h-screen bg-[#060613] text-gray-100 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Risk Disclosure", href: "/risk" }]} />
        <header className="space-y-3 border-b border-[#1e1e38] pb-6">
          <p className="text-[10px] sm:text-xs text-[#00d1b2] font-mono uppercase tracking-[0.32em]">
            Required Reading
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-syne uppercase tracking-wider leading-tight">
            Risk Disclosure
          </h1>
          <p className="text-sm sm:text-base text-gray-400 font-light leading-relaxed max-w-3xl">
            Using Apex involves material risk. This page sets out the
            principal categories of risk you accept by opening and funding
            an account. It is not a complete list. If anything below is
            unclear, do not transact until you have taken independent
            advice.
          </p>
        </header>

        <div className="bg-[#0f0f30] border border-red-500/20 rounded-xl p-5 sm:p-6">
          <p className="text-xs sm:text-sm text-red-300 font-mono uppercase tracking-widest">
            Capital at risk. Digital assets may lose value. Not FDIC, SIPC,
            or FSCS insured. Past performance is not indicative of future
            results.
          </p>
        </div>

        <section className="space-y-4">
          {RISKS.map((r) => (
            <article
              key={r.title}
              className="bg-[#0f0f30] border border-[#1e1e38] rounded-xl p-5 sm:p-6 space-y-2"
            >
              <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide">
                {r.title}
              </h2>
              <p className="text-sm text-gray-400 font-light leading-relaxed">
                {r.body}
              </p>
            </article>
          ))}
        </section>

        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-syne uppercase tracking-wide">
            No Investment Advice
          </h2>
          <p className="text-sm text-gray-400 font-light leading-relaxed">
            Nothing on the Apex website, in the Platform, or in any
            communication from Apex constitutes financial, legal, or tax
            advice. Allocation, sizing, and product choice are your
            decisions. Read the{" "}
            <Link href="/terms" className="text-[#00d1b2] hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="/compliance"
              className="text-[#00d1b2] hover:underline"
            >
              Compliance Framework
            </Link>{" "}
            before transacting.
          </p>
        </section>
      </div>
    </main>
  );
}