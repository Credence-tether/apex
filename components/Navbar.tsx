"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient, getSupabaseClientError } from "../utils/supabase/client";

const NAV_LINKS = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "APY Plans", href: "#plans" },
  { label: "Credit Lines", href: "#loans" },
  { label: "Fee Schedule", href: "#fees" },
  { label: "Security", href: "#security" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const envError = getSupabaseClientError();
  const supabase = createClient();

  useEffect(() => {
    if (envError) {
      setLoading(false);
      return;
    }

    supabase.auth
      .getUser()
      .then(({ data, error }) => {
        if (error) {
          console.warn(error);
          setUser(null);
        } else {
          setUser(data.user);
        }
      })
      .catch((error) => {
        console.warn(error);
        setUser(null);
      })
      .finally(() => setLoading(false));

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );
    return () => listener.subscription.unsubscribe();
  }, [envError]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="sticky top-0 z-50 bg-[#0e0e2c]/95 backdrop-blur border-b border-[#1e1e38]">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap justify-center gap-x-6 gap-y-2 items-center">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-sm text-gray-400 hover:text-gray-100 transition-colors duration-200 font-dm"
          >
            {link.label}
          </a>
        ))}
        <a
          href="#calculator"
          className="text-sm text-gray-200 border border-gray-200/40 px-3 py-0.5 rounded-full hover:bg-gray-200/10 transition-all duration-200"
        >
          APY Calculator
        </a>
        {!loading && (
          <div className="flex items-center gap-2 ml-2">
            {user ? (
              <>
                <a
                  href="/dashboard"
                  className="text-sm font-syne font-semibold text-[#e2e8f0] border border-[#e2e8f0]/30 px-3 py-1 rounded-lg hover:bg-[#e2e8f0]/10 transition-all"
                >
                  Dashboard
                </a>
                <button
                  onClick={handleSignOut}
                  className="text-sm font-syne font-semibold bg-[#e2e8f0] text-[#060613] px-3 py-1 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  className="text-sm font-syne font-semibold text-[#e2e8f0] border border-[#e2e8f0]/30 px-3 py-1 rounded-lg hover:bg-[#e2e8f0]/10 transition-all"
                >
                  Sign In
                </a>
                <a
                  href="/login"
                  className="text-sm font-syne font-semibold bg-[#e2e8f0] text-[#060613] px-3 py-1 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Sign Up
                </a>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
