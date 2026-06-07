import { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About Apex | Institutional Digital Asset Management & Custody",
  description: "Apex is an enterprise digital asset management platform combining institutional-grade custody, transparent on-chain operations, and risk-managed yield strategies for qualified investors.",
  keywords: ["institutional crypto asset management","regulated digital asset custody","transparent crypto yield platform","enterprise blockchain treasury","qualified investor crypto"],
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Apex | Institutional Digital Asset Management",
    description: "Mission, governance, custody architecture and operating principles behind Apex.",
    url: "/about", type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Apex | Institutional Digital Asset Management",
    description: "Mission, governance, custody architecture and operating principles behind Apex.",
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
