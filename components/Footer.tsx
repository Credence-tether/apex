import Link from "next/link";

const COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "APY Plans", href: "/#plans" },
      { label: "Credit Lines", href: "/loans" },
      { label: "Fee Schedule", href: "/fees" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Security", href: "/security" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Risk Disclosure", href: "/risk" },
      { label: "Compliance", href: "/compliance" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[#1e1e38] bg-[#0b0b20] mt-12">
      <div className="bg-red-500/5 border-b border-red-500/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-[11px] sm:text-xs text-red-300/80 font-mono uppercase tracking-wider text-center sm:text-left">
            Capital at risk. Digital assets may lose value. Target yields are
            not guaranteed. Not FDIC, SIPC, or FSCS insured.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1 space-y-3">
            <Link
              href="/"
              className="text-sm font-bold tracking-[0.32em] uppercase text-[#00d1b2]"
            >
              APEX
            </Link>
            <p className="text-xs text-gray-500 font-light leading-relaxed">
              Institutional-grade digital asset custody, structured yield, and
              asset-backed credit.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.heading} className="space-y-3">
              <p className="text-[10px] text-[#00d1b2] font-mono uppercase tracking-widest">
                {col.heading}
              </p>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-gray-400 hover:text-[#00d1b2] transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-[#1e1e38] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-gray-600 font-mono">
            &copy; {year} Apex Asset Management. All rights reserved.
          </p>
          <p className="text-[11px] text-gray-600 font-light max-w-md sm:text-right">
            Apex does not provide investment, legal or tax advice. Services
            are limited to eligible jurisdictions.
          </p>
        </div>
      </div>
    </footer>
  );
}