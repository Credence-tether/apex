import { Metadata } from "next";
import FeesContent from "./FeesContent";

export const metadata: Metadata = {
  title: "Fee Schedule | Apex Transparent Pricing",
  description: "Full Apex fee schedule: deposits, withdrawals, network gas pass-through, credit-line origination. No hidden fees.",
  alternates: { canonical: "/fees" },
};

export default function FeesPage() {
  return <FeesContent />;
}
