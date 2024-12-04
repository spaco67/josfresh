"use client";

import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface Stats {
  totalInvested: number;
  activeInvestments: number;
  totalReturns: number;
  pendingReturns: number;
}

export function InvestmentStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/investments/stats");
        const data = await res.json();
        if (res.ok) {
          setStats(data.data);
        }
      } catch (error) {
        console.error("Error fetching investment stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
      <Card className="p-6">
        <h3 className="text-sm font-medium text-muted-foreground">
          Total Invested
        </h3>
        <p className="text-2xl font-bold mt-2">
          {formatCurrency(stats.totalInvested)}
        </p>
      </Card>
      <Card className="p-6">
        <h3 className="text-sm font-medium text-muted-foreground">
          Active Investments
        </h3>
        <p className="text-2xl font-bold mt-2">{stats.activeInvestments}</p>
      </Card>
      <Card className="p-6">
        <h3 className="text-sm font-medium text-muted-foreground">
          Total Returns
        </h3>
        <p className="text-2xl font-bold mt-2 text-green-600">
          {formatCurrency(stats.totalReturns)}
        </p>
      </Card>
      <Card className="p-6">
        <h3 className="text-sm font-medium text-muted-foreground">
          Pending Returns
        </h3>
        <p className="text-2xl font-bold mt-2 text-blue-600">
          {formatCurrency(stats.pendingReturns)}
        </p>
      </Card>
    </div>
  );
} 