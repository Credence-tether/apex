import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "../../components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Fee Schedule | Apex Transparent Pricing",
  description:
    "Full Apex fee schedule: deposits, withdrawals, network gas pass-through, credit-line origination, FX, and account limits. No hidden fees, no spread markups, no slippage capture.",
  keywords: [
    "crypto platform fees",
    "digital asset withdrawal fees",
    "crypto loan origination fee",
    "transparent crypto pricing",
    "no hidden fees crypto",
  ],
  alternates: { canonical: "/fees" },
  openGraph: {
    title: "Apex Fee Schedule",
    description: "Transparent, all-in pricing for custody, yield and credit.",
    url: "/fees",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Apex Fee Schedule",
    description: "Transparent, all-in pricing for custody, yield and credit.",
  },

};

const FEES = [
  {
    label: "Capital Deposit Handling",
    value: "0.5%",
    detail: "Applied once on incoming transfers. Waived for institutional tier above $250k.",
  },
  {
    label: "Standard Withdrawal Processing",
    value: "1.5%",
    detail: "Processed within one business day. Allow-listed addresses only.",
  },
  {
    label: "Credit Line Origination",
    value: "1.0%",
    detail: "Charged once on draw. Repaying early incurs no penalty.",
  },
  {
    label: "Network / Gas Pass-Through",
    value: "At cost (~$2.00 flat)",
    detail: "We do not mark up on-chain network fees.",
  },
  {
    label: "Currency Conversion (FX)",
    value: "0.25%",
    detail: "Mid-market reference rate plus a published spread. No hidden markup.",
  },
  {
    label: "Inactivity Fee",
    value: "None",
    detail: "We never charge dormant-account fees.",
  },
];

const LIMITS = [
  { label: "Minimum deposit", value: "$300" },
  { label: "Daily withdrawal cap (standard)", value: "$50,000" },
  { label: "Daily withdrawal cap (institutional)", value: "On request" },
  { label: "Allow-list cool-down on new addresses", value: "24 hours" },
];

export default function FeesPage() {
  return (
    <main className="min-h-screen bg-[#060613] text-gray-100 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Fees", href: "/fees" }]} />
        <header className="space-y-3 border-b border-[#1e1e38] pb-6">
          <p className="text-[10px] sm:text-xs text-[#00d1b2] font-mono uppercase tracking-[0.32em]">
            Pricing / Audit Ledger
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-syne uppercase tracking-wider leading-tight">
            Transparent Fee Schedule
          </h1>
          <p className="text-sm sm:text-base text-gray-400 font-light leading-relaxed max-w-3xl">
            Every fee Apex charges is published here. We do not capture spread,
            do not mark up network fees, and do not charge for things we
            haven&rsquo;t told you about up front.
          </p>
        </header>

        <section className="bg-[#0f0f30] border border-[#1e1e38] rounded-xl divide-y divide-[#1e1e38]/60">
          {FEES.map((fee) => (
            <div
              key={fee.label}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 sm:p-5"
            >
              <div className="space-y-1 sm:max-w-[60%]">
                <p className="text-sm sm:text-base text-white font-semibold">
                  {fee.label}
                </p>
                <p className="text-xs text-gray-500 font-light leading-relaxed">
                  {fee.detail}
                </p>
              </div>
              <span className="font-semibold text-[#00d1b2] font-mono text-sm sm:text-base whitespace-nowrap">
                {fee.value}
              </span>
            </div>
          ))}
        </section>

        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-syne uppercase tracking-wide">
            Account Limits
          </h2>
          <div className="bg-[#0f0f30] border border-[#1e1e38] rounded-xl divide-y divide-[#1e1e38]/60">
            {LIMITS.map((l) => (
              <div
                key={l.label}
                className="flex items-center justify-between gap-2 p-4 sm:p-5"
              >
                <span className="text-sm text-gray-400 font-light">
                  {l.label}
                </span>
                <span className="text-sm font-semibold text-white font-mono">
                  {l.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-syne uppercase tracking-wide">
            Worked Example
          </h2>
          <div className="bg-[#0f0f30] border border-[#1e1e38] rounded-xl p-5 sm:p-6 space-y-2 text-sm text-gray-400 font-light leading-relaxed">
            <p>
              Deposit of <span className="text-white font-mono">$10,000</span>:
              handling fee <span className="text-white font-mono">$50</span>{" "}
              (0.5%). Net principal allocated:{" "}
              <span className="text-white font-mono">$9,950</span>.
            </p>
            <p>
              Withdrawal of <span className="text-white font-mono">$2,000</span>:
              processing fee{" "}
              <span className="text-white font-mono">$30</span> (1.5%) plus
              network gas pass-through (~$2). Net received:{" "}
              <span className="text-white font-mono">~$1,968</span>.
            </p>
          </div>
        </section>

        <section className="bg-[#0f0f30] border border-[#1e1e38] rounded-xl p-5 sm:p-6 space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide">
            Important
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed">
            Fee changes apply only to new positions and are notified at least
            30 days in advance. Yield figures shown on other pages are{" "}
            <em>targets</em> — actual returns vary and capital is at risk.
            Funds held with Apex are not protected by FDIC, SIPC, or
            equivalent deposit insurance. See the{" "}
            <Link href="/terms" className="text-[#00d1b2] hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/risk" className="text-[#00d1b2] hover:underline">
              Risk Disclosure
            </Link>{" "}
            for full details.
          </p>
        </section>
      </div>
    </main>
  );
}