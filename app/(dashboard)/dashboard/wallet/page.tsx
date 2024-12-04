"use client";

import { useState, useEffect } from "react";
import { WalletCard } from "@/components/wallet/wallet-card";
import { TopUpModal } from "@/components/wallet/top-up-modal";
import { TransactionHistory } from "@/components/wallet/transaction-history";
import { toast } from "sonner";

export default function WalletPage() {
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showTopUp, setShowTopUp] = useState(false);

  async function fetchWallet() {
    try {
      const res = await fetch("/api/wallet");
      const data = await res.json();
      setWallet(data);
    } catch (error) {
      toast.error("Failed to load wallet");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWallet();
  }, []);

  async function handleToggleVisibility() {
    try {
      const res = await fetch("/api/wallet/visibility", {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed to update visibility");
      await fetchWallet();
    } catch (error) {
      toast.error("Failed to update visibility");
    }
  }

  if (loading) return <div>Loading...</div>;
  if (!wallet) return <div>Failed to load wallet</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Wallet</h1>

      <WalletCard
        wallet={wallet}
        onToggleVisibility={handleToggleVisibility}
        onTopUp={() => setShowTopUp(true)}
      />

      <TransactionHistory transactions={wallet.transactions} />

      <TopUpModal
        open={showTopUp}
        onClose={() => setShowTopUp(false)}
        onSuccess={fetchWallet}
      />
    </div>
  );
} 