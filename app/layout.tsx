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
  description: "Secure your financial future with Apex.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <head>
        <link rel="stylesheet" href="/generated.css" />
      </head>
      <body className="bg-[#060613] text-gray-100 font-dm antialiased">
        {children}
      </body>
    </html>
  );
}
