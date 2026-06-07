import "./globals.css";
import { Metadata } from "next";
import { cookies } from "next/headers";
import Navbar from "../components/Navbar";
import { LocaleProvider } from "../lib/locale-context";
import type { Locale } from "../lib/i18n";

export const metadata: Metadata = {
  title: "Apex | High APY Crypto Wealth & Secured Asset Management",
  description:
    "Secure your financial future with Apex. Earn competitive fixed APY on structured digital asset portfolios and access institutional crypto loan options securely.",
  keywords: [
    "Apex crypto wealth",
    "fixed APY digital assets",
    "asset backed liquidity lines",
    "secure crypto yield portfolios",
    "institutional capital configurations",
    "collateralized portfolio credit",
  ],
  robots: "index, follow",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("apex-locale")?.value;
  const serverLocale: Locale = localeCookie === "de" ? "de" : "en";

  return (
    <html lang={serverLocale} className="scroll-smooth">
      <body className="bg-[#060613] text-gray-100 antialiased">
        <LocaleProvider serverLocale={serverLocale}>
          <Navbar />
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
