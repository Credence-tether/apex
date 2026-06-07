export type Locale = "en" | "de";

export const translations = {
  en: {
    nav: {
      about: "About", plans: "APY Plans", loans: "Credit Lines",
      fees: "Fees", security: "Security", faq: "FAQ",
      contact: "Contact", login: "Login", signup: "Sign Up",
      dashboard: "Dashboard", signout: "Sign Out",
    },
    hero: {
      badge: "Institutional-Grade Digital Yield",
      headline1: "Automated Yield Generation",
      headline2: "for Digital Wealth",
      sub: "Access high-tier fixed APY configurations. Earn up to",
      sub2: "APY with weekly distributions — starting from just $300.",
      cta: "Start Earning Now →",
      calc: "Calculate My Yield",
    },
    trust: {
      managed: "Assets Managed", investors: "Active Investors",
      uptime: "Uptime SLA", compliant: "Compliant",
    },
    plans: {
      heading: "Fixed Yield Asset Matrices",
      sub: "Choose your capital tier. Yield settlements processed every Sunday.",
      bestValue: "Best Value", mostPopular: "Most Popular",
      getStarted: "Get Started →", requestAccess: "Request Access",
      lock: "lock", apy: "APY",
    },
    calc: {
      heading: "Yield Projection Matrix",
      sub: "See exactly what your capital will earn before you commit",
      label1: "Principal Allocation ($)",
      label2: "Target Rate (APY %)",
      btn: "Calculate My Returns →",
      loading: "Running Calculations...",
      weekly: "Weekly", daily: "Daily", annual: "Annual",
      gateTitle: "📩 Get this projection in your inbox",
      gateSub: "We'll send a detailed breakdown + how to get started with this plan.",
      gatePlaceholder: "your@email.com",
      gateSend: "Send It",
      sentTitle: "✓ Projection sent!",
      sentSub: "Check your inbox — and take the next step:",
      sentCta: "Open My Account →",
    },
    contact: {
      heading: "Speak to an Advisor",
      sub: "Our institutional desk responds within",
      hours: "24 hours",
      sub2: ". Limited advisory slots available this week.",
      nameLabel: "Your Full Name",
      emailLabel: "Email Address",
      msgLabel: "How can we help?",
      msgPlaceholder: "e.g. I'd like to start with the Apex Thrive plan...",
      btn: "Request a Callback →",
    },
    sticky: { msg: "Earn up to 15.6% APY", sub: "· Weekly distributions · From $300", cta: "Start Earning →" },
    localeSwitcher: { switchTo: "Auf Deutsch wechseln" },
  },
  de: {
    nav: {
      about: "Über uns", plans: "Zinspläne", loans: "Kreditlinien",
      fees: "Gebühren", security: "Sicherheit", faq: "FAQ",
      contact: "Kontakt", login: "Anmelden", signup: "Registrieren",
      dashboard: "Dashboard", signout: "Abmelden",
    },
    hero: {
      badge: "Institutionelle digitale Rendite",
      headline1: "Automatisierte Ertragsoptimierung",
      headline2: "für digitales Vermögen",
      sub: "Feste Zinspläne mit bis zu",
      sub2: "Jahresrendite — ab nur 300 $. Wöchentliche Ausschüttungen.",
      cta: "Jetzt investieren →",
      calc: "Rendite berechnen",
    },
    trust: {
      managed: "Verwaltetes Kapital", investors: "Aktive Anleger",
      uptime: "Verfügbarkeits-SLA", compliant: "Zertifiziert",
    },
    plans: {
      heading: "Feste Renditepläne",
      sub: "Wählen Sie Ihre Kapitalstufe. Auszahlung jeden Sonntag.",
      bestValue: "Bestes Angebot", mostPopular: "Beliebteste Wahl",
      getStarted: "Jetzt starten →", requestAccess: "Zugang anfragen",
      lock: "Laufzeit", apy: "Jahresrendite",
    },
    calc: {
      heading: "Renditenrechner",
      sub: "Berechnen Sie Ihren Ertrag — bevor Sie sich festlegen",
      label1: "Einlage ($)",
      label2: "Zinssatz (% p.a.)",
      btn: "Rendite berechnen →",
      loading: "Berechnung läuft...",
      weekly: "Wöchentlich", daily: "Täglich", annual: "Jährlich",
      gateTitle: "📩 Prognose per E-Mail erhalten",
      gateSub: "Wir senden Ihnen eine detaillierte Auswertung und Informationen zur Eröffnung.",
      gatePlaceholder: "ihre@email.de",
      gateSend: "Absenden",
      sentTitle: "✓ Prognose gesendet!",
      sentSub: "Prüfen Sie Ihren Posteingang — und machen Sie den nächsten Schritt:",
      sentCta: "Konto eröffnen →",
    },
    contact: {
      heading: "Beratungsgespräch anfragen",
      sub: "Unser Team antwortet innerhalb von",
      hours: "24 Stunden",
      sub2: ". Begrenzte Beratungsplätze diese Woche.",
      nameLabel: "Vollständiger Name",
      emailLabel: "E-Mail-Adresse",
      msgLabel: "Wie können wir helfen?",
      msgPlaceholder: "z.B. Ich möchte mit dem Apex Thrive Plan starten...",
      btn: "Rückruf anfragen →",
    },
    sticky: { msg: "Bis zu 15,6 % Jahresrendite", sub: "· Wöchentliche Ausschüttungen · Ab 300 $", cta: "Jetzt starten →" },
    localeSwitcher: { switchTo: "Switch to English" },
  },
} satisfies Record<Locale, unknown>;

export type Translations = typeof translations.en;

export function getTranslations(locale: Locale): Translations {
  return translations[locale] as Translations;
}
