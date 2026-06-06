import Link from "next/link";

export type Crumb = { name: string; href: string };

type Props = {
  items: Crumb[];
  /** Site origin used to emit absolute URLs in JSON-LD. */
  siteUrl?: string;
};

/**
 * Accessible breadcrumb trail + schema.org BreadcrumbList JSON-LD.
 * Renders inline with the page header; the final crumb is the current page.
 */
export default function Breadcrumbs({
  items,
  siteUrl = "https://apex.example",
}: Props) {
  if (!items?.length) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${siteUrl}${c.href}`,
    })),
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.2em] text-gray-500"
    >
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((c, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={c.href} className="flex items-center gap-x-2">
              {isLast ? (
                <span aria-current="page" className="text-[#00d1b2]">
                  {c.name}
                </span>
              ) : (
                <Link
                  href={c.href}
                  className="hover:text-gray-300 transition-colors"
                >
                  {c.name}
                </Link>
              )}
              {!isLast && <span className="text-gray-700">/</span>}
            </li>
          );
        })}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </nav>
  );
}
