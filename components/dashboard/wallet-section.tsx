"use client";

import { useState, useEffect } from "react";
import { WalletCard } from "@/components/wallet/wallet-card";
import { TopUpModal } from "@/components/wallet/top-up-modal";
import { TransactionHistory } from "@/components/wallet/transaction-history";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function WalletSection() {
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showTopUp, setShowTopUp] = useState(false);

  async function fetchWallet() {
    try {
      const res = await fetch("/api/wallet", {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      const data = await res.json();
      console.log('Fetched wallet data:', data);

      if (res.ok) {
        setWallet(data);
      } else {
        throw new Error(data.error || 'Failed to load wallet');
      }
    } catch (error) {
      console.error('Error fetching wallet:', error);
      toast.error("Failed to load wallet");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWallet();
    refreshWalletBalance();
  }, []);

  useEffect(() => {
    const handleWalletUpdate = (event: CustomEvent<any>) => {
      if (event.detail) {
        setWallet(prevWallet => ({
          ...prevWallet,
          ...event.detail
        }));
      }
    };

    window.addEventListener('walletUpdate', handleWalletUpdate as EventListener);

    return () => {
      window.removeEventListener('walletUpdate', handleWalletUpdate as EventListener);
    };
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

  async function refreshWalletBalance() {
    try {
      const res = await fetch("/api/wallet/refresh", {
        method: "POST",
      });
      
      if (!res.ok) {
        throw new Error('Failed to refresh balance');
      }
      
      await fetchWallet();
    } catch (error) {
      console.error('Error refreshing balance:', error);
      toast.error("Failed to refresh balance");
    }
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </Card>
    );
  }

  if (!wallet) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          Failed to load wallet
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <WalletCard
        wallet={wallet}
        onToggleVisibility={handleToggleVisibility}
        onTopUp={() => setShowTopUp(true)}
      />

      <TransactionHistory transactions={wallet.transactions || []} />

      <TopUpModal
        open={showTopUp}
        onClose={() => setShowTopUp(false)}
        onSuccess={fetchWallet}
      />
    </div>
  );
} 