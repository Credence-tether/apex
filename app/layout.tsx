import "./globals.css";
import { Metadata } from "next";
import Navbar from "../components/Navbar";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#060613] text-gray-100 antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
