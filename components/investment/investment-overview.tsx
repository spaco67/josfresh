"use client";

import { Card } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";

export function InvestmentOverview() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOverview() {
      try {
        const res = await fetch("/api/investments/overview");
        const data = await res.json();
        if (res.ok) {
          setData(data.data);
        }
      } catch (error) {
        console.error("Error fetching investment overview:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOverview();
  }, []);

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Investment Overview</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="month" />
            <YAxis
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip
              formatter={(value) => formatCurrency(value as number)}
            />
            <Bar
              dataKey="invested"
              name="Amount Invested"
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="returns"
              name="Returns"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
} 