import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "../../components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Security at Apex | Cold Storage, Multi-Sig & Proof of Reserves",
  description:
    "How Apex protects client assets: multi-signature cold storage, hardware-backed key management, withdrawal allow-lists, MFA, continuous monitoring, penetration testing, and on-chain proof of reserves.",
  keywords: [
    "crypto security best practices",
    "proof of reserves",
    "multi-signature cold storage",
    "hardware wallet custody",
    "crypto bug bounty",
    "soc 2 crypto platform",
  ],
  alternates: { canonical: "/security" },
  openGraph: {
    title: "Security at Apex | Cold Storage & Proof of Reserves",
    description:
      "Apex&rsquo;s layered security architecture: custody, key management, monitoring, and assurance.",
    url: "/security",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Security at Apex | Cold Storage & Proof of Reserves",
    description: "Apex&rsquo;s layered security architecture: custody, key management, monitoring, and assurance.",
  },

};

const LAYERS = [
  {
    title: "Multi-Signature Cold Storage",
    body: "95%+ of client reserves sit in geographically distributed, hardware-isolated multi-signature wallets. Quorum approvals are required for any movement; single-key compromise cannot move funds.",
  },
  {
    title: "Hardware-Backed Key Management",
    body: "Operational keys live inside FIPS 140-2 validated hardware security modules. Keys are never exported in plaintext and access is gated by role-based controls and tamper-evident audit logs.",
  },
  {
    title: "Withdrawal Allow-Lists & Time Locks",
    body: "Clients can pin withdrawals to allow-listed destinations only. New addresses are subject to a configurable time lock and email/2FA re-confirmation before they become eligible.",
  },
  {
    title: "Account Security (MFA, WebAuthn)",
    body: "TOTP and hardware-key (WebAuthn / FIDO2) second factors are supported. Session fingerprinting, anomalous-login alerts, and one-tap session revocation are available from every account.",
  },
  {
    title: "Continuous Monitoring",
    body: "24/7 on-chain and infrastructure monitoring with automated incident playbooks. Wallet balance, gas, and counterparty exposure are tracked in real time against pre-set risk limits.",
  },
  {
    title: "Independent Assurance",
    body: "Annual third-party penetration tests, ongoing dependency and container scanning, and an open responsible-disclosure program. We publish a quarterly proof-of-reserves attestation.",
  },
];

const COMMITMENTS = [
  "No rehypothecation of client assets.",
  "No uncollateralized lending of client funds to third parties.",
  "No directional, leveraged trading with client capital.",
  "Segregated client accounts; operating funds are never co-mingled.",
  "Documented, tested incident response with defined client communication SLAs.",
];

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-[#060613] text-gray-100 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Security", href: "/security" }]} />
        <header className="space-y-3 border-b border-[#1e1e38] pb-6">
          <p className="text-[10px] sm:text-xs text-[#00d1b2] font-mono uppercase tracking-[0.32em]">
            Security / Risk Management Protocols
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-syne uppercase tracking-wider leading-tight">
            Defense In Depth, Audited Continuously
          </h1>
          <p className="text-sm sm:text-base text-gray-400 font-light leading-relaxed max-w-3xl">
            Apex&rsquo;s security model is designed for institutional
            allocators: layered custody, hardware-backed keys, monitored
            operations, and independent assurance. Below is a plain-language
            summary of the controls protecting client assets.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {LAYERS.map((l) => (
            <div
              key={l.title}
              className="bg-[#0f0f30] border border-[#1e1e38] rounded-xl p-5 sm:p-6"
            >
              <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide mb-2">
                {l.title}
              </h2>
              <p className="text-sm text-gray-400 font-light leading-relaxed">
                {l.body}
              </p>
            </div>
          ))}
        </section>

        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-syne uppercase tracking-wide">
            What We Will Not Do
          </h2>
          <ul className="space-y-2">
            {COMMITMENTS.map((c) => (
              <li
                key={c}
                className="flex items-start gap-3 bg-[#0f0f30] border border-[#1e1e38] rounded-lg px-4 py-3"
              >
                <span className="text-[#00d1b2] font-mono text-xs mt-0.5">
                  &#10003;
                </span>
                <span className="text-sm text-gray-300 font-light">{c}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-syne uppercase tracking-wide">
            Responsible Disclosure
          </h2>
          <div className="bg-[#0f0f30] border border-[#1e1e38] rounded-xl p-5 sm:p-6 space-y-3 text-sm text-gray-400 font-light leading-relaxed">
            <p>
              If you believe you have discovered a vulnerability in Apex,
              please report it through our coordinated disclosure channel.
              We commit to acknowledge reports within two business days and
              provide a triage update within seven.
            </p>
            <p>
              Submit reports to{" "}
              <span className="text-[#00d1b2] font-mono">
                security@apex.example
              </span>{" "}
              with reproduction steps. PGP key fingerprint and bug bounty
              scope are available on the{" "}
              <Link href="/contact" className="text-[#00d1b2] hover:underline">
                contact page
              </Link>
              .
            </p>
            <p className="text-xs text-gray-500">
              Please do not perform testing that could degrade service for
              other users or access data that is not your own.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-syne uppercase tracking-wide">
            Assurance &amp; Reporting
          </h2>
          <p className="text-sm text-gray-400 font-light leading-relaxed max-w-3xl">
            Apex publishes a quarterly proof-of-reserves attestation listing
            on-chain wallet balances and aggregate client liabilities, signed
            by an independent firm. SOC 2 readiness work is underway; status
            is shared on request under NDA for prospective institutional
            clients. Review our{" "}
            <Link href="/compliance" className="text-[#00d1b2] hover:underline">
              compliance framework
            </Link>{" "}
            for jurisdiction coverage and the{" "}
            <Link href="/risk" className="text-[#00d1b2] hover:underline">
              risk disclosure
            </Link>{" "}
            for limits of any security program.
          </p>
        </section>
      </div>
    </main>
  );
}