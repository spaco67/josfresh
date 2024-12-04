"use client";

import { useState } from "react";
import { usePaystackPayment } from "react-paystack";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface TopUpModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function TopUpModal({ open, onClose, onSuccess }: TopUpModalProps) {
  const { data: session } = useSession();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const config = {
    reference: `TOP_UP_${Date.now()}`,
    email: session?.user?.email!,
    amount: parseFloat(amount) * 100, // Convert to kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
  };

  const initializePayment = usePaystackPayment(config);

  const handlePaystackSuccess = async (reference: string) => {
    try {
      setLoading(true);
      console.log('Processing payment success:', { reference, amount });

      const res = await fetch("/api/wallet/topup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          reference,
        }),
      });

      const data = await res.json();
      console.log('Top-up response:', data);

      if (!res.ok) {
        throw new Error(data.error || 'Failed to process top-up');
      }

      toast.success("Wallet topped up successfully!");
      setAmount("");
      onSuccess(); // This will refresh the wallet data
      onClose();
    } catch (error) {
      console.error('Top-up error:', error);
      toast.error("Failed to process top-up. Please contact support.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) < 100) {
      toast.error("Minimum amount is ₦100");
      return;
    }

    initializePayment(
      () => handlePaystackSuccess(config.reference),
      () => {
        toast.error("Transaction cancelled");
        setLoading(false);
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Top Up Wallet</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₦)</Label>
            <Input
              id="amount"
              type="number"
              min="100"
              step="100"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              required
              disabled={loading}
            />
            <p className="text-sm text-muted-foreground">
              Minimum amount: ₦100
            </p>
          </div>
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Proceed"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 