import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "../../components/Breadcrumbs";
import ContactForm from "../../components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Apex | Support, Compliance, Press & Partnerships",
  description:
    "Reach the right Apex team fast: client support, compliance, security disclosures, press, and institutional partnerships. Documented response-time SLAs.",
  keywords: [
    "apex contact",
    "crypto platform support",
    "crypto compliance contact",
    "responsible disclosure crypto",
    "institutional crypto partnerships",
  ],
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Apex",
    description: "Direct lines for support, compliance, security and partnerships.",
    url: "/contact",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Apex",
    description: "Direct lines for support, compliance, security and partnerships.",
  },

};

const CHANNELS = [
  {
    label: "Client Support",
    email: "support@apex.example",
    sla: "Response within 1 business day",
    note: "Account access, transfers, statements.",
  },
  {
    label: "Compliance",
    email: "compliance@apex.example",
    sla: "Response within 2 business days",
    note: "KYC, source-of-funds, regulatory enquiries.",
  },
  {
    label: "Security / Disclosure",
    email: "security@apex.example",
    sla: "Acknowledged within 2 business days",
    note: "Responsible disclosure. PGP fingerprint available on request.",
  },
  {
    label: "Press",
    email: "press@apex.example",
    sla: "Response within 3 business days",
    note: "Media enquiries and statements.",
  },
  {
    label: "Institutional / Partnerships",
    email: "partners@apex.example",
    sla: "Response within 2 business days",
    note: "Allocators, custodians, and integration partners.",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#060613] text-gray-100 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Contact", href: "/contact" }]} />
        <header className="space-y-3 border-b border-[#1e1e38] pb-6">
          <p className="text-[10px] sm:text-xs text-[#00d1b2] font-mono uppercase tracking-[0.32em]">
            Get In Touch
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-syne uppercase tracking-wider leading-tight">
            Talk to the Right Team
          </h1>
          <p className="text-sm sm:text-base text-gray-400 font-light leading-relaxed max-w-3xl">
            Choose the channel that matches your request. For account-specific
            issues, please sign in first so we can verify identity before
            discussing details.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {CHANNELS.map((c) => (
            <div
              key={c.label}
              className="bg-[#0f0f30] border border-[#1e1e38] rounded-xl p-5 sm:p-6 space-y-2"
            >
              <p className="text-xs text-[#00d1b2] font-mono uppercase tracking-widest">
                {c.label}
              </p>
              <a
                href={`mailto:${c.email}`}
                className="block text-base sm:text-lg font-semibold text-white hover:text-[#00d1b2] transition-colors break-all"
              >
                {c.email}
              </a>
              <p className="text-xs text-gray-500 font-mono uppercase tracking-wide">
                {c.sla}
              </p>
              <p className="text-sm text-gray-400 font-light leading-relaxed">
                {c.note}
              </p>
            </div>
          ))}
        </section>

        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-syne uppercase tracking-wide">
            Send a Message
          </h2>
          <p className="text-sm text-gray-400 font-light leading-relaxed max-w-2xl">
            Use this form for general enquiries. Do not include passwords,
            seed phrases, or sensitive personal data — Apex staff will never
            ask for them.
          </p>
          <ContactForm />
        </section>

        <section className="bg-[#0f0f30] border border-[#1e1e38] rounded-xl p-5 sm:p-6 space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide">
            Registered Office
          </h2>
          <p className="text-sm text-gray-400 font-light leading-relaxed">
            Apex Asset Management Ltd.
            <br />
            Address available to verified clients on request.
          </p>
        </section>
      </div>
    </main>
  );
}