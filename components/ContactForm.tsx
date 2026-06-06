"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      topic: String(data.get("topic") || "support"),
      message: String(data.get("message") || "").trim(),
      consent: data.get("consent") === "on",
      // honeypot
      website: String(data.get("website") || ""),
    };

    if (payload.website) {
      setStatus("success");
      form.reset();
      return;
    }
    if (!payload.name || !payload.email || !payload.message) {
      setStatus("error");
      setError("Please complete name, email and message.");
      return;
    }
    if (!payload.consent) {
      setStatus("error");
      setError("Please confirm consent to be contacted.");
      return;
    }

    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setError("Could not send. Please email support@apex.example instead.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#0f0f30] border border-[#1e1e38] rounded-xl p-5 sm:p-6 space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block space-y-1">
          <span className="text-xs text-gray-400 font-mono uppercase tracking-widest">
            Name
          </span>
          <input
            name="name"
            type="text"
            autoComplete="name"
            required
            className="w-full bg-[#060613] border border-[#1e1e38] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#00d1b2]/60"
            placeholder="Your name"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs text-gray-400 font-mono uppercase tracking-widest">
            Email
          </span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full bg-[#060613] border border-[#1e1e38] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#00d1b2]/60"
            placeholder="you@example.com"
          />
        </label>
      </div>

      <label className="block space-y-1">
        <span className="text-xs text-gray-400 font-mono uppercase tracking-widest">
          Topic
        </span>
        <select
          name="topic"
          defaultValue="support"
          className="w-full bg-[#060613] border border-[#1e1e38] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#00d1b2]/60"
        >
          <option value="support">Client support</option>
          <option value="compliance">Compliance</option>
          <option value="security">Security / disclosure</option>
          <option value="press">Press</option>
          <option value="partnerships">Institutional / partnerships</option>
          <option value="other">Other</option>
        </select>
      </label>

      <label className="block space-y-1">
        <span className="text-xs text-gray-400 font-mono uppercase tracking-widest">
          Message
        </span>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full bg-[#060613] border border-[#1e1e38] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#00d1b2]/60 resize-y"
          placeholder="Briefly describe how we can help."
        />
      </label>

      {/* honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <label className="flex items-start gap-2 text-xs text-gray-400 font-light">
        <input
          type="checkbox"
          name="consent"
          className="mt-1 accent-[#00d1b2]"
        />
        <span>
          I consent to Apex processing the information above to respond to my
          enquiry, in line with the Privacy Policy.
        </span>
      </label>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center justify-center text-sm bg-[#00d1b2] text-[#060613] px-5 py-2.5 rounded-full font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {status === "submitting" ? "Sending..." : "Send message"}
        </button>
        {status === "success" && (
          <p className="text-xs text-[#00d1b2] font-mono">
            Message received. We will be in touch.
          </p>
        )}
        {status === "error" && (
          <p className="text-xs text-red-400 font-mono">{error}</p>
        )}
      </div>
    </form>
  );
}