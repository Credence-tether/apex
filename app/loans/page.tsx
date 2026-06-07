import { Metadata } from "next";
import LoansContent from "./LoansContent";

export const metadata: Metadata = {
  title: "Crypto-Backed Loans | Apex Asset Management",
  description: "Borrow money against your crypto without selling it. Fixed interest rates, instant transfer, and flexible repayment.",
  keywords: ["crypto backed loan", "borrow against crypto", "crypto credit line", "crypto LTV loan"],
  alternates: { canonical: "/loans" },
};

export default function LoansPage() {
  return <LoansContent />;
}
