import { Metadata } from "next";
import ContactContent from "./ContactContent";

export const metadata: Metadata = {
  title: "Contact Us | Apex Asset Management",
  description: "Get help with your Apex account, ask about investments, or report a security issue. We respond within 1 business day.",
  keywords: ["apex contact", "crypto support", "investment help"],
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <ContactContent />;
}
