import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "../../components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Crypto-Backed Credit Lines | Apex Asset-Secured Loans",
  description:
    "Apex asset-backed credit lines: borrow USD-denominated liquidity against your custodied digital asset portfolio at conservative LTV with transparent, fixed origination pricing.",
  keywords: [
    "crypto backed loans",
    "asset backed credit line",
    "borrow against crypto",
    "crypto LTV loan",
    "institutional crypto credit",
  ],
  alternates: { canonical: "/loans" },
  openGraph: {
    title: "Apex Crypto-Backed Credit Lines",
    description:
      "Borrow against your custodied portfolio at conservative LTV with transparent fees.",
    url: "/loans",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Apex Crypto-Backed Credit Lines",
    description: "Borrow against your custodied portfolio at conservative LTV with transparent fees.",
  },

};

const TIERS = [
  {
    tier: "Conservative",
    ltv: "Up to 25%",
    rate: "4.5% APR",
    callout: "Lowest liquidation risk; recommended default.",
  },
  {
    tier: "Standard",
    ltv: "Up to 40%",
    rate: "6.0% APR",
    callout: "Balanced draw size and headroom.",
  },
  {
    tier: "Maximum",
    ltv: "Up to 50%",
    rate: "7.5% APR",
    callout: "Tightest collateral buffer; suitable only for active users.",
  },
];

const MECHANICS = [
  {
    title: "Over-Collateralized",
    body: "Every draw is backed by client-owned assets held in segregated cold custody. No client funds are lent to third parties.",
  },
  {
    title: "Interest Accrual",
    body: "APR accrues daily on outstanding principal. There is no minimum interest charge and no early-repayment penalty.",
  },
  {
    title: "Margin & Top-Up",
    body: "If LTV rises toward the liquidation threshold, you are notified by email and in-platform with a configurable top-up window before any automated rebalancing.",
  },
  {
    title: "Repayment",
    body: "Repay in part or full at any time from your settlement balance or by depositing additional collateral to restore headroom.",
  },
];

const ELIGIBILITY = [
  "Verified Apex account in good standing.",
  "Eligible collateral held in cold custody for at least one settlement cycle.",
  "Resident of an eligible jurisdiction (see Compliance Framework).",
  "Acceptance of the Loan Agreement and Risk Disclosure.",
];

export default function LoansPage() {
  return (
    <main className="min-h-screen bg-[#060613] text-gray-100 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Loans", href: "/loans" }]} />
        <header className="space-y-3 border-b border-[#1e1e38] pb-6">
          <p className="text-[10px] sm:text-xs text-[#00d1b2] font-mono uppercase tracking-[0.32em]">
            Credit / Liquidity Facilities
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-syne uppercase tracking-wider leading-tight">
            Asset-Backed Credit Lines
          </h1>
          <p className="text-sm sm:text-base text-gray-400 font-light leading-relaxed max-w-3xl">
            Borrow USD-denominated liquidity against your custodied digital
            asset portfolio without selling your position. Conservative LTV,
            fixed transparent pricing, and a documented margin process —
            designed to keep liquidations rare and predictable.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-syne uppercase tracking-wide">
            LTV Tiers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TIERS.map((t) => (
              <div
                key={t.tier}
                className="bg-[#0f0f30] border border-[#1e1e38] rounded-xl p-5 sm:p-6 space-y-3"
              >
                <p className="text-xs text-[#00d1b2] font-mono uppercase tracking-widest">
                  {t.tier}
                </p>
                <p className="text-2xl font-bold text-white font-syne">
                  {t.ltv}
                </p>
                <p className="text-sm text-gray-300 font-mono">{t.rate}</p>
                <p className="text-xs text-gray-500 font-light leading-relaxed">
                  {t.callout}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-syne uppercase tracking-wide">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MECHANICS.map((m) => (
              <div
                key={m.title}
                className="bg-[#0f0f30] border border-[#1e1e38] rounded-xl p-5"
              >
                <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wide mb-2">
                  {m.title}
                </h3>
                <p className="text-sm text-gray-400 font-light leading-relaxed">
                  {m.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-syne uppercase tracking-wide">
            Eligibility
          </h2>
          <ul className="space-y-2">
            {ELIGIBILITY.map((e) => (
              <li
                key={e}
                className="flex items-start gap-3 bg-[#0f0f30] border border-[#1e1e38] rounded-lg px-4 py-3"
              >
                <span className="text-[#00d1b2] font-mono text-xs mt-0.5">
                  &#10003;
                </span>
                <span className="text-sm text-gray-300 font-light">{e}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-[#0f0f30] border border-[#1e1e38] rounded-xl p-5 sm:p-6 space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide">
            Risk Note
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed">
            Borrowing against volatile collateral can result in partial or
            total liquidation of that collateral if market values fall faster
            than top-ups arrive. APR and LTV tiers are subject to change for
            new draws with notice. Crypto-backed credit is not appropriate
            for every user. Please read the{" "}
            <Link href="/risk" className="text-[#00d1b2] hover:underline">
              Risk Disclosure
            </Link>{" "}
            in full before borrowing.
          </p>
        </section>

        <section className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between bg-[#0f0f30] border border-[#1e1e38] rounded-xl p-5 sm:p-6">
          <div>
            <p className="text-sm sm:text-base text-white font-semibold">
              Ready to open a credit line?
            </p>
            <p className="text-xs text-gray-500 font-light mt-1">
              Eligible accounts can request a facility from the dashboard.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center justify-center text-sm bg-[#00d1b2] text-[#060613] px-5 py-2.5 rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            Sign in to apply
          </Link>
        </section>
      </div>
    </main>
  );
}