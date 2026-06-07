import { Metadata } from "next";
import FaqContent from "./FaqContent";

export const metadata: Metadata = {
  title: "FAQ | Apex Digital Asset Management",
  description: "Answers to common questions about Apex: account opening, deposits, withdrawals, target yields, custody, and crypto-backed loans.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return <FaqContent />;
}
