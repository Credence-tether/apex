"use client";
import { useState } from "react";
import {
  createClient,
  getSupabaseClientError,
} from "../../utils/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const envError = getSupabaseClientError();
  const supabase = createClient();
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (envError) {
      setMessage(envError);
      setLoading(false);
      return;
    }

    try {
      if (isRegistering) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${location.origin}/auth/callback`,
            data: { full_name: fullName.trim() },
          },
        });
        if (error) setMessage(error.message);
        else
          setMessage(
            "Registration successful! Check your email for verification.",
          );
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          setMessage(error.message);
          setLoading(false);
          return;
        }

        // Role-based redirect — new schema uses 'role' not 'user_role'
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        const target = profile?.role === "admin" ? "/admin" : "/dashboard";
        router.push(target);
        return;
      }
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Authentication failed.",
      );
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#060613] flex items-center justify-center p-4">
      <div className="bg-[#0f0f30] p-8 rounded-xl border border-[#1e1e38] w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-[#00d1b2] tracking-widest uppercase">
            APEX
          </h1>
          <p className="text-xs text-gray-500 mt-1 tracking-wide">
            {isRegistering ? "Create Your Account" : "Access Client Portal"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {isRegistering && (
            <div>
              <label className="block text-[10px] text-gray-400 uppercase mb-1 tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                required
                className="w-full p-3 rounded-lg bg-[#09091f] border border-[#1e1e38] text-white text-sm focus:border-[#00d1b2] focus:outline-none transition"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          )}
          <div>
            <label className="block text-[10px] text-gray-400 uppercase mb-1 tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full p-3 rounded-lg bg-[#09091f] border border-[#1e1e38] text-white text-sm focus:border-[#00d1b2] focus:outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[10px] text-gray-400 uppercase mb-1 tracking-wider">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full p-3 rounded-lg bg-[#09091f] border border-[#1e1e38] text-white text-sm focus:border-[#00d1b2] focus:outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={Boolean(envError) || loading}
            className="w-full p-3 rounded-lg bg-[#00d1b2] text-[#060613] font-bold text-sm uppercase tracking-wider hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition mt-2"
          >
            {loading ? "Verifying..." : isRegistering ? "Register" : "Sign In"}
          </button>
        </form>

        {(message || envError) && (
          <div
            className={`mt-4 p-3 rounded-lg text-sm text-center ${message.includes("successful") ? "bg-teal-950/40 text-[#00d1b2] border border-[#00d1b2]/30" : "bg-red-950/40 text-red-400 border border-red-500/30"}`}
          >
            {message || envError}
          </div>
        )}

        <p className="text-sm text-gray-400 text-center mt-6">
          {isRegistering
            ? "Already have an account?"
            : "New to Apex Asset Management?"}
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setMessage("");
            }}
            className="text-[#00d1b2] ml-1 underline bg-transparent border-none cursor-pointer"
          >
            {isRegistering ? "Sign In Here" : "Create Account"}
          </button>
        </p>
      </div>
    </main>
  );
}
