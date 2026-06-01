"use client";

import { useState, useCallback } from "react";

const NAV_LINKS = [
  { label: "About Architecture", href: "/about" },
  { label: "APY Plans", href: "/#plans" },
  { label: "Credit Lines", href: "/loans" },
  { label: "Fee Schedule", href: "/fees" },
  { label: "Security Protocols", href: "/security" },
  { label: "Regulatory Terms", href: "/terms" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-[#0e0e2c]/95 backdrop-blur border-b border-[#1e1e38]">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <a
          href="/"
          className="text-sm font-syne font-bold tracking-[0.32em] uppercase text-[#00d1b2]"
        >
          APEX
        </a>

        <div className="hidden lg:flex items-center gap-4 flex-wrap">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-gray-400 hover:text-[#00d1b2] transition-colors duration-200 font-sans"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/login"
            className="text-sm text-[#00d1b2] border border-[#00d1b2]/40 px-4 py-2 rounded-full hover:bg-[#00d1b2]/10 transition-all duration-200 font-sans"
          >
            Login
          </a>
          <a
            href="/login"
            className="text-sm bg-[#00d1b2] text-[#060613] px-4 py-2 rounded-full font-sans font-semibold hover:opacity-90 transition-opacity duration-200"
          >
            Sign Up
          </a>
        </div>

        <button
          type="button"
          onClick={toggleMenu}
          className="lg:hidden inline-flex items-center justify-center rounded-md border border-[#1e1e38] bg-[#090a1f]/90 px-3 py-2 text-gray-300 hover:border-[#00d1b2]/50 hover:text-white transition"
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
        >
          <span className="sr-only">Toggle navigation menu</span>
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-[#1e1e38] bg-[#0e0e2c]/95 px-4 py-4">
          <div className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-gray-300 hover:text-[#00d1b2] transition-colors duration-200 font-sans"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-3">
            <a
              href="/login"
              className="block text-center text-sm text-[#00d1b2] border border-[#00d1b2]/40 px-4 py-2 rounded-full hover:bg-[#00d1b2]/10 transition-all duration-200 font-sans"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </a>
            <a
              href="/login"
              className="block text-center text-sm bg-[#00d1b2] text-[#060613] px-4 py-2 rounded-full font-sans font-semibold hover:opacity-90 transition-opacity duration-200"
              onClick={() => setMenuOpen(false)}
            >
              Sign Up
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
