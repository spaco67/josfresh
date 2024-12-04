"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Copy, Wallet } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

interface WalletCardProps {
  wallet: {
    balance: number;
    accountNumber: string;
    accountName: string;
    showBalance: boolean;
  };
  onToggleVisibility: () => void;
  onTopUp: () => void;
}

export function WalletCard({ wallet, onToggleVisibility, onTopUp }: WalletCardProps) {
  const [copied, setCopied] = useState(false);

  const copyAccountNumber = async () => {
    try {
      await navigator.clipboard.writeText(wallet.accountNumber);
      setCopied(true);
      toast.success('Account number copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy account number');
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Balance
          </h3>
          <div className="mt-2 flex items-center gap-2">
            <p className="text-3xl font-bold text-green-600">
              {wallet.showBalance ? formatCurrency(wallet.balance) : '****'}
            </p>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleVisibility}
              className="ml-2"
            >
              {wallet.showBalance ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <Button onClick={onTopUp}>Top Up</Button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Account Number</span>
          <div className="flex items-center gap-2">
            <span className="font-medium">{wallet.accountNumber}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={copyAccountNumber}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Account Name</span>
          <span className="font-medium">{wallet.accountName}</span>
        </div>
      </div>
    </Card>
  );
} 