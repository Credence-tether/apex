"use client";
import { useEffect, useState } from "react";
import { createClient } from "../../utils/supabase/client";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [wallet, setWallet] = useState<any>(null);
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      // Fetch balance data from apex_wallets schema
      const { data: walletData } = await supabase
        .from("apex_wallets")
        .select("*")
        .single();

      // Fetch contract data from apex_investments schema
      const { data: investmentData } = await supabase
        .from("apex_investments")
        .select("*");

      setWallet(walletData);
      setInvestments(investmentData || []);
      setLoading(false);
    };

    fetchUserData();
  }, [supabase, router]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#060613] text-white flex items-center justify-center">
        Loading Asset Account...
      </div>
    );

  return (
    <main className="min-h-screen bg-[#060613] text-white p-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-8 border-b border-[#1e1e38] pb-4">
          <h1 className="text-2xl font-bold text-[#00d1b2]">
            Apex Client Portal
          </h1>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/login");
            }}
            className="px-4 py-2 border border-red-500 text-red-500 rounded text-sm hover:bg-red-500 hover:text-white transition"
          >
            Secure Log Out
          </button>
        </header>

        {/* WALLET BALANCE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#0f0f30] p-6 rounded-xl border border-[#1e1e38]">
            <p className="text-gray-400 text-sm uppercase font-semibold">
              Available Liquidity Balance
            </p>
            <p className="text-4xl font-bold mt-2 text-white">
              ${wallet?.balance?.toFixed(2) || "0.00"}
            </p>
          </div>
          <div className="bg-[#0f0f30] p-6 rounded-xl border border-[#1e1e38]">
            <p className="text-gray-400 text-sm uppercase font-semibold">
              Total APY Earnings Distributed
            </p>
            <p className="text-4xl font-bold mt-2 text-[#00d1b2]">
              ${wallet?.earnings_to_date?.toFixed(2) || "0.00"}
            </p>
          </div>
        </div>

        {/* ACTIVE INVESTMENTS SECTION */}
        <div className="bg-[#0f0f30] p-6 rounded-xl border border-[#1e1e38]">
          <h2 className="text-xl font-bold mb-4">
            Active Asset Allocation Contracts
          </h2>
          {investments.length === 0 ? (
            <p className="text-gray-400">
              No active fixed yield configurations running.
            </p>
          ) : (
            <div className="space-y-4">
              {investments.map((inv) => (
                <div
                  key={inv.id}
                  className="flex justify-between items-center p-4 bg-[#09091f] rounded border border-[#1e1e38]"
                >
                  <div>
                    <p className="font-semibold text-white">{inv.plan_name}</p>
                    <p className="text-sm text-gray-400">
                      Principal: ${inv.amount_invested}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#00d1b2] font-bold">
                      {(inv.apy_percentage * 100).toFixed(1)}% APY
                    </p>
                    <p className="text-xs text-gray-500">
                      Status: {inv.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
