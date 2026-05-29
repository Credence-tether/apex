import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Apex | High APY Crypto Wealth & Secured Asset Management",
  description:
    "Secure your financial future with Apex. Earn competitive fixed APY distributed weekly and access institutional capital-backed crypto loan options securely.",
  keywords:
    "Apex crypto, high APY investing, secure digital assets, crypto asset wealth, institutional crypto loans, transaction processing",
  robots: "index, follow",
  alternates: {
    canonical: "https://apex.vercel.app",
  },
  openGraph: {
    title: "Apex | High APY Crypto Wealth & Secured Asset Management",
    description:
      "Access high-tier fixed APY configurations built on verified risk-mitigation frameworks.",
    type: "website",
    url: "https://apex.vercel.app",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body className="bg-[#060613] text-gray-100 font-dm antialiased">
        {children}
      </body>
    </html>
  );
}

