import { Metadata } from "next";
import SecurityContent from "./SecurityContent";

export const metadata: Metadata = {
  title: "Security | Apex Asset Management",
  description: "How Apex keeps your money safe: cold storage, two-factor login, withdrawal limits, and regular security audits.",
  keywords: ["crypto security", "cold storage", "multi-signature wallet", "two-factor authentication", "proof of reserves"],
  alternates: { canonical: "/security" },
};

export default function SecurityPage() {
  return <SecurityContent />;
}
