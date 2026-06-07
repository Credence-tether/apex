import { Metadata } from "next";
import RiskContent from "./RiskContent";

export const metadata: Metadata = {
  title: "Risk Disclosure | Apex Asset Management",
  description: "What are the risks of investing with Apex? Read this before you open an account.",
  keywords: ["crypto risk", "digital asset risk", "investment risk disclosure"],
  alternates: { canonical: "/risk" },
};

export default function RiskPage() {
  return <RiskContent />;
}
