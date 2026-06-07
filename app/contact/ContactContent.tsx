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

        {/* Live Support Banner */}
        <div className="bg-[#0a1a14] border border-[#00d1b2]/20 rounded-xl p-4 flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <div className="w-3 h-3 rounded-full bg-[#00d1b2]" />
            <div className="w-3 h-3 rounded-full bg-[#00d1b2] absolute top-0 left-0 animate-ping opacity-60" />
          </div>
          <div>
            <p className="text-xs text-[#00d1b2] font-mono uppercase tracking-widest mb-0.5">
              {de ? "Live-Support verfügbar" : "Live Support Available"}
            </p>
            <p className="text-xs text-gray-400">
              {de
                ? "Unser Team ist online und antwortet in der Regel innerhalb weniger Minuten."
                : "Our team is online and typically responds within minutes."}
            </p>
          </div>
          <a
            href="mailto:support@apxfund.xyz"
            className="ml-auto flex-shrink-0 bg-[#00d1b2] text-[#060613] text-xs font-bold px-3 py-2 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            {de ? "Jetzt chatten" : "Chat Now"}
          </a>
        </div>

        {/* Contact Form */}
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

        {/* Contact Details */}
        <div className="bg-[#0f0f30] border border-[#1e1e38] rounded-xl p-5 space-y-4">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-mono">
            {de ? "Kontaktinformationen" : "Contact Information"}
          </p>

          <div className="flex items-start gap-3">
            <span className="text-[#00d1b2] text-base mt-0.5">✉</span>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">{de ? "Allgemeine Anfragen" : "General Support"}</p>
              <a href="mailto:support@apxfund.xyz" className="text-sm text-[#00d1b2] hover:underline">support@apxfund.xyz</a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-[#00d1b2] text-base mt-0.5">🔒</span>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">{de ? "Sicherheitsprobleme" : "Security Issues"}</p>
              <a href="mailto:support@apxfund.xyz" className="text-sm text-[#00d1b2] hover:underline">support@apxfund.xyz</a>
            </div>
          </div>

          <div className="h-px bg-[#1e1e38]" />

          <div className="flex items-start gap-3">
            <span className="text-[#00d1b2] text-base mt-0.5">📍</span>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">{de ? "Büro" : "Office"}</p>
              <p className="text-sm text-gray-300">
                Apex Asset Management<br />
                Forbury Rd<br />
                Reading RG1 1AX<br />
                {de ? "Vereinigtes Königreich" : "United Kingdom"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-[#00d1b2] text-base mt-0.5">🕐</span>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">{de ? "Geschäftszeiten" : "Business Hours"}</p>
              <p className="text-sm text-gray-300">
                {de ? "Mo–Fr: 9:00–18:00 GMT" : "Mon–Fri: 9:00 AM – 6:00 PM GMT"}
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

