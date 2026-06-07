"use client";
import { useState } from "react";
import { useLocale } from "../../lib/locale-context";

export default function ContactContent() {
  const { locale } = useLocale();
  const de = locale === "de";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(de ? "Wird gesendet..." : "Submitting...");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ full_name: name, email, message: msg }) });
      const data = await res.json();
      if (data.success) { setStatus(de ? "Nachricht erhalten. Wir melden uns innerhalb von 24 Stunden." : "Message received. We'll respond within 24 hours."); setName(""); setEmail(""); setMsg(""); }
      else setStatus(`${de ? "Fehler" : "Error"}: ${data.error}`);
    } catch { setStatus(de ? "Netzwerkfehler." : "Network error."); }
  }

  const cls = "w-full bg-[#060613] border border-[#1e1e38] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#00d1b2]/60 transition-colors";

  return (
    <main className="min-h-screen bg-[#060613] text-gray-100">
      <div className="max-w-lg mx-auto px-4 py-16 space-y-8">
        <header className="text-center space-y-3">
          <p className="text-xs text-[#00d1b2] font-mono uppercase tracking-[0.3em]">
            {de ? "Beratung" : "Advisory Desk"}
          </p>
          <h1 className="font-syne text-3xl font-extrabold text-white uppercase tracking-wide">
            {de ? "Sprechen Sie mit uns" : "Speak to an Advisor"}
          </h1>
          <p className="text-sm text-gray-400">
            {de ? "Antwort innerhalb von 24 Stunden · Begrenzte Beratungsplätze" : "Response within 24 hours · Limited advisory slots this week"}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="bg-[#0f0f30] border border-[#1e1e38] rounded-xl p-6 space-y-5">
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">{de ? "Vollständiger Name" : "Full Name"}</label>
            <input type="text" required className={cls} value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">{de ? "E-Mail-Adresse" : "Email Address"}</label>
            <input type="email" required className={cls} value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">{de ? "Nachricht" : "Message"}</label>
            <textarea rows={4} required className={`${cls} resize-none`}
              placeholder={de ? "z.B. Ich möchte mit dem Apex Thrive Plan starten..." : "e.g. I'd like to start with the Apex Thrive plan..."}
              value={msg} onChange={e => setMsg(e.target.value)} />
          </div>
          <button type="submit" className="w-full bg-[#00d1b2] text-[#060613] font-syne font-bold py-3 rounded-lg hover:opacity-90 transition-opacity text-sm tracking-wider">
            {de ? "Rückruf anfragen →" : "Request a Callback →"}
          </button>
          {status && <p className={`text-sm text-center ${status.includes("Error") || status.includes("Fehler") || status.includes("Netzwerk") ? "text-red-400" : "text-[#00d1b2]"}`}>{status}</p>}
        </form>

        <div className="text-center text-xs text-gray-600 space-y-1">
          <p>{de ? "Sicherheitsprobleme melden:" : "Security issues:"} <a href="mailto:security@apexasset.io" className="text-[#00d1b2]">security@apexasset.io</a></p>
          <p>{de ? "Allgemeine Anfragen:" : "General:"} <a href="mailto:support@apexasset.io" className="text-[#00d1b2]">support@apexasset.io</a></p>
        </div>
      </div>
    </main>
  );
}
